import { fetchRedis } from "@/lib/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import {Message, messageValidator} from '@/lib/message'
import {nanoid} from 'nanoid'
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req:NextRequest) => {
	try{
		const {text, chatId}: {text:string, chatId:string} = await req.json()
		const session = await getServerSession(authOptions)

		if(!session)
			return new NextResponse('Unauthorzied', {status:401})

		const [userId1, userId2] = chatId.split('--')
		
		if(session.user.id !== userId1 && session.user.id !== userId2)
			return new NextResponse('Unauthorized',{status:401})

		const friendId = session.user.id === userId1 ? userId2 : userId1

		const friendList =(await fetchRedis(
			'smembers',
			`user:${session.user.id}:friends`
		)) as string[]
		
		const isFriend = friendList.includes(friendId)
		if(!isFriend)
			return new NextResponse('Unauthorized',{status:401})
			
		const rawSender = (await fetchRedis(
			'get',
			`user:${session.user.id}`
		)) as string
		const sender = JSON.parse(rawSender) as User
		
		const timestamp = Date.now()

		const messageData: Message = messageValidator.parse({
			id: nanoid(),
			senderId: session.user.id,
			text,
			timeStamp: timestamp
		})

		await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', messageData)

		await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
			...messageData,
			senderImg: sender.image,
			senderName: sender.name
		})

		await db.sadd(`chat:${chatId}:messages`,{
			score:timestamp,
			member:JSON.stringify(messageData)
		})

		return new NextResponse('OK')
	}catch(err){
		if(err instanceof Error)
			return new NextResponse('Server error', {status:500})
	}
}