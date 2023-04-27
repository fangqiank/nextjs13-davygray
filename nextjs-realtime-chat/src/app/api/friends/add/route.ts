import {fetchRedis} from '@/lib/redis'
import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {z} from 'zod'
import {pusherServer} from '@/lib/pusher'
import {toPusherKey} from '@/lib/utils'
import {addFriendValidator} from '@/lib/add-friend'
import {getServerSession} from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async(req: NextRequest) => {
	try{
		const body = await req.json()

		const {email:emailToAdd} = addFriendValidator.parse(body.email)
		
		const idToAdd = (await fetchRedis(
			'get', 
			`user:email:${emailToAdd}`
			))as string

		if(!idToAdd)
			return new NextResponse('Can not find this friend', {status:400})

		const session = await getServerSession(authOptions)
		if(!session)
			return new NextResponse('Unauthorized', {status: 401})

		if(idToAdd === session.user.id)
			return new NextResponse('You can not add yourself as a friend', {
				status:400
			})	

		const alreadyAdded = (await fetchRedis(
			'sismember', 
			`user: ${idToAdd}:incoming_friend_requests`,
			session.user.id
		)) as 0 | 1
		if(alreadyAdded)
			return new NextResponse('Already added this user', { status: 400 })

		const isAlreadyFriends = (await fetchRedis(
			'sismember', 
			`user:${session.user.id}:friends`, 
			idToAdd
		)) as 0 | 1
		if(isAlreadyFriends)
			return new NextResponse('Already friends with this user', { status: 400 })

		await pusherServer.trigger(
			toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
			'incoming_friend_requests',
			{
				senderId: session.user.id,
				senderEmail: session.user.email
			}
		)

		await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)
		return new NextResponse('OK')
	}	
	catch(err){
		if(err instanceof z.ZodError)
			return new NextResponse('Invalid request payload', { status: 422 })

		return new NextResponse('Invalid request', { status: 400 })
	}
}