import {ChatInput} from '@/components/ChatInput'
import { Messages } from '@/components/Messages'
import {fetchRedis} from '@/lib/redis'
import {authOptions} from '@/lib/auth'
import {messageArrayValidate} from '@/lib/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const generateMetadata = async ({params}: {params: {chatId: string}}) => {
	const session = await getServerSession(authOptions)
	if(!session) notFound()

	const [userId1, userId2] = params.chatId.split('--')
	const {user} = session

	const chatPartnerId  = user.id === userId1 ? userId2 : userId1
	const partnerRaw = (await fetchRedis(
		'get',
		`user: ${chatPartnerId}`
	)) as string
	const chatPartner = JSON.parse(partnerRaw) as User	

	return {title: `FriendZone | ${chatPartner.name} chat`}
}

type ChatPageProps = {
	params: {
		chatId: string
	}
}

const getChatMessages = async (chatId: string) => {
	try{
		const result: string[] = await fetchRedis(
			'zrange',
			`chat:${chatId}:messages`,
			0,
			-1
		)

		const dbMessages = result.map(res => JSON.parse(res) as Message).reverse()
		const messages = messageArrayValidate.parse(dbMessages)
		return messages
	}catch(err){
		notFound()
	}
}

const ChatPage = async ({params}: ChatPageProps) => {
	const {chatId} = params

	const session = await getServerSession(authOptions)
	if(!session)  notFound()

	const {user} = session

	const [userId1, userId2] = chatId.split('--')

	if(user.id !== userId1 && user.id  !== userId2)
		notFound()

	const partnerId = user.id === userId1 ? userId2 : userId1

	const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${partnerId}`
  )) as string

	const chatPartner = JSON.parse(chatPartnerRaw) as User

	const initialMessages = await getChatMessages(chatId)

	const contents = (
		<div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
			<div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
				<div className="relative flex items-center space-x-4">
					<div className="relative">
						<div className="relative w-8 sm:w-12 h-8 sm:h-12">
							<Image
								fill
								className='rouned-full'
								src={chatPartner.image}
								alt={`${chatPartner.name} profile pic`}
								referrerPolicy='no-referrer'
							/>
						</div>
					</div>

					<div className="flex flex-col leading-tight">
						<div className="text-xl flex items-center">
							<span className="text-gray-700 mr-3 font-semibold">
								{chatPartner.name}
							</span>
						</div>

						<span className="text-sm text-gray-600">{chatPartner.email}</span>
					</div>
				</div>
			</div>

			<Messages
				chatId={chatId}
				chatPartner={chatPartner}
				sessionId={session.user.id}
				sessionImg={session.user.image}
				initialMessages={initialMessages} 
			/>

			<ChatInput
				chatId={chatId}
				chatPartner={chatPartner} 
			/>
		</div>
	)

	return contents
}

export default ChatPage