import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {z} from 'zod'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
	try{
		const body = await request.json()

		const session = await getServerSession(authOptions)

		if(!session)
			return new NextResponse('Unauthorized', {status:401})

		const {id:idToDeny} = z.object({id:z.string()}).parse(body)

		await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

		return new NextResponse('OK')
	}catch(err){
		console.log(err)

		if(err instanceof z.ZodError)
			return new NextResponse('Invalid request payload', {status:422})

		return new NextResponse('Invalid request', {status:400})
	}
}