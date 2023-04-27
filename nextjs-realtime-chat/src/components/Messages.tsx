'use client'

import {FC, useEffect, useRef, useState} from 'react'
import {pusherClient} from '@/lib/pusher'
import {cn, toPusherKey} from '@/lib/utils'
import {format} from 'date-fns'
import Image from 'next/image'
import {Message} from '@/lib/message'

type MessagesProps = {
	initialMessages: Message[],
	sessionId: string,
	chatId: string,
	sessionImg: string | null | undefined
	chatPartner: User
}

export const Messages:FC<MessagesProps> = ({
	initialMessages,
	sessionId,
	chatId,
	chatPartner, 
	sessionImg
}) => {
	const [messages, setMessages] = useState<Message[]>(initialMessages)

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`chat:${chatId}`))

		const handleMessage = (msg: Message) => setMessages(prev => [msg, ...prev])

		pusherClient.bind('incoming-message', handleMessage)

		return () => {
			pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
			
			pusherClient.unbind('incoming-message', handleMessage)
		}
	}, [chatId])

	const scrollDownRef = useRef<HTMLDivElement | null>(null)

	const formatTimestamp = (ts: number) => format(ts, 'HH:mm')

	const contents = (
		<div 
			id='messages'
			className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
		>
			<div ref={scrollDownRef}/>

			{messages.map((mg, idx) => {
				const isCurrentUser = mg.senderId === sessionId

				const hasNextMessageFromSameUser = messages[idx-1]?.senderId === messages[idx].senderId

				return (
					<div
						key={`${mg.id}-${mg.timeStamp}`}
						className='chat-message'
					>
						<div
							className={cn(
								'flex items-end',
								{'justify-end': isCurrentUser}
							)}
						>
							<div
								className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2',{
									'order-1 items-end': isCurrentUser,
									'order-2 items-start': isCurrentUser,
								})}
							>
								<span
									className={cn('px-4 py-2 rounded-lg inline-block', {
										'bg-indigo-600 text-white': isCurrentUser,
										'bg-gray-200 text-gray-900': !isCurrentUser,
										'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
										'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
									})}
								>
									{mg.text}{''}
									<span className="ml-2 text-xs text-gray-400">
										{formatTimestamp(mg.timeStamp)}
									</span>
								</span>
							</div>

							<div
								className={cn('relative w-6 -h-6', {
									'order-2': isCurrentUser,
									'order-1': !isCurrentUser,
									invisible:hasNextMessageFromSameUser
								})}
							>
								<Image 
									fill
									className='rounded-full'
									src={isCurrentUser ? (sessionImg as string) : chatPartner.image}
									alt='Profile pic'
									referrerPolicy='no-referrer'
								/>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)

	return contents
}

