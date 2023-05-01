'use client'

import {useRef, useState, FC} from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from './Button'

type ChatInputProps = {
	chatPartner: User, 
	chatId: string
}

export const ChatInput:FC<ChatInputProps> = ({chatPartner, chatId}) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [input, setInput] = useState('')

	const sendMessage = async () => {
		if(!input) 
			return 
		
		setIsLoading(true)
		try{
			await axios.post('/api/message/send', {text:input, chatId})
			setInput('')
			textareaRef.current?.focus()
		}catch(err){
			toast.error(`Something went wrong with ${err}`)
		}finally{
			setIsLoading(false)
		}
	}

	const contents = (
		<div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
			<div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
				<TextareaAutosize
					ref={ textareaRef}
					rows={1}
					value={input}
					placeholder={`Message ${chatPartner.name}`}
					className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder::text-gray-400 focus:ring-0 sm:py-15 sm:text-sm sm:leading-6'
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => {
						if(e.key === 'Enter' && !e.shiftKey){
							e.preventDefault()
							sendMessage()
						}
					}} 
				/>

				<div
					className='py-2'
					aria-hidden='true'
					onClick={() => textareaRef.current?.focus()}
				>
					<div className="py-px">
						<div className="h-9" />
					</div>
				</div>

				<div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
					<div className="flex-shrink-0">
						<Button
							isLoading={isLoading}
							onClick={sendMessage}
							type='submit'
						>
							Send
						</Button>
					</div>
				</div>
			</div>
		</div>
	)

	return contents
}