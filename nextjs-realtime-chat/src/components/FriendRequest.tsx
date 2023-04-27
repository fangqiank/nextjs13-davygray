'use client'

import {FC, useEffect, useState} from 'react'
import {pusherClient} from '@/lib/pusher'
import {toPusherKey} from '@/lib/utils'
import axios from 'axios'
import {Check, UserPlus, X} from 'lucide-react'
import { useRouter } from 'next/navigation'

type FriendRequestProps = {
	incomingRequests: IncomingFriendRequest[],
	sessionId: string
}

export const FriendRequest:FC<FriendRequestProps> =({incomingRequests, sessionId}) => {
	const router = useRouter()
	const [friendRequests, setFreindRequests] = useState<IncomingFriendRequest[]>(incomingRequests)

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

		const handleFreindRequest = ({
			senderId,
			senderEmail
		}: IncomingFriendRequest) => {
			setFreindRequests(prev => [...prev, {senderId, senderEmail}])
		}

		pusherClient.bind('incoming_friend_requests', handleFreindRequest)

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

			pusherClient.unbind('incoming_friend_requests', handleFreindRequest)
		}
	},[sessionId])

	const acceptFriend = async (id: string) => {
		await axios.post('/api/freinds/accept', {
			id
		})

		setFreindRequests(prev => prev.filter(x => x.senderId !== id))

		router.refresh()
	}

	const denyFreind = async (id: string) => {
		await axios.post('/api/friends/deny', {id})

		setFreindRequests(prev => prev.filter(x => x.senderId !== id))

		router.refresh()
	}

	const contents = (
		<>
			{friendRequests.length === 0 ? (
			<p className='text-sm text-zinc-500'>Nothing</p>
			) : (
				friendRequests.map(req => (
					<div
						key={req.senderId} 
						className="flex gap-4 items-center"
					>
						<UserPlus className='text-black'/>
						<p className="font-medium text-lg">{req.senderEmail}</p>
						<button 
							className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md "
							aria-label='Accept'
							onClick={() => acceptFriend(req.senderId)}
						>
							<Check className='font-semibold text-white w-3/4 h-3/4' />
						</button>

						<button 
							className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
							aria-label='Deny'
							onClick={() => denyFreind(req.senderId)}
						>
							<X className='font-semibold text-white w-3/4 h-3/4'/>
						</button>
					</div>
				))
			)}
		</>
	)
	
	return contents
}