import { FriendRequest } from '@/components/FriendRequest'
import {fetchRedis} from '@/lib/redis'
import {authOptions} from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'

const ReuqestsPage = async () => {
	const session = await getServerSession(authOptions)
	if(!session)
		notFound()
	
	const incomingSenderIds = (await fetchRedis(
		'smembers',
		`user:${session.user.id}:incoming_friend_requests`
	)) as string[]

	const incomingFriendRequests = await Promise.all(
		incomingSenderIds.map(async id => {
			const sender = (await fetchRedis('get', `user:${id}`)) as string
			const senderParsed = JSON.parse(sender) as User

			return {senderId: id, senderEmail: senderParsed.email}
		})
	)

	const contents = (
		<main className="pt-8">
			<h1 className="font-bold text-5xl mb-8">Add a friend</h1>
			<div className="flex flex-col gap-4">
				<FriendRequest
					incomingRequests={incomingFriendRequests}
					sessionId={session.user.id} 
				/>
			</div>
		</main>
	)

	return contents
}

export default ReuqestsPage