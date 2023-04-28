'use client'

import axios, {AxiosError} from 'axios'
import { useState, FC } from 'react'
import { Button } from './Button'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {addFriendValidator} from '@/lib/add-friend'

interface AddFriendButtonProps{}

type FormData = z.infer<typeof addFriendValidator>

export const AddFriendButton: FC<AddFriendButtonProps> = () => {
	const [showSuccess, setShowSuccess] = useState(false)

	const {register, handleSubmit, setError, formState: {errors}}  = useForm<FormData>({
		resolver: zodResolver(addFriendValidator)
	})

	const addFriend = async (email: string) => {
		try{
			const validEmail = addFriendValidator.parse({email})

			await axios.post('/api/friends/add', {
				email: validEmail
			})

			setShowSuccess(true)
		}catch(err){
			if(err instanceof z.ZodError){
				setError('email', {message: err.message})
				return
			}else if(err instanceof AxiosError){
				setError('email', {message: err.response?.data})
				return
			}

			setError('email', {message: 'Something went wrong'})
		}
	}

	const onSubmit = (data: FormData) => addFriend(data.email)

	return (
		<form
			className='max-w-sm'
			onSubmit={handleSubmit(onSubmit)}
		>
			<label 
				htmlFor="email"
				className='block text-sm font-medium leading-6 text-gray-900'
			>
				Add friend by email
			</label>

			<div className="mt-2 flex gap-4">
				<input
					{...register('email')}
					type='text'
					className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
					placeholder='zhangsan@mail.com' 
				/>
				<Button>Add</Button>
			</div>

			<p className="mt-1 text-sm text-red-600">
				{errors.email?.message}
			</p>
			{showSuccess ? (
				<p className='mt-1 text-sm text-green-600'>Friend resquest sent!</p>
			) : null}
		</form>
	)
}