import {fetchRedis} from './redis'

export const getFriendByUserId = async(id: string) => {
	const friendIds = (await fetchRedis('smembers', `user:${id}:friends`)) as string[]
	console.log(friendIds)

	const friends = await Promise.all(friendIds.map(
		async (friendId) => {
			const friend = await fetchRedis('get', `user:${friendId}`) as string
			const parsedFriend = JSON.parse(friend) as User
			return parsedFriend
		}))

	return friends
}