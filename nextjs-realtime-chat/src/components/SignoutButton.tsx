"use client"

import {Loader2, LogOut} from 'lucide-react'
import {signOut} from 'next-auth/react'
import {ButtonHTMLAttributes, FC, useState} from 'react'
import {toast} from 'react-hot-toast'
import { Button } from './Button'

interface  SignoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

export const SignoutButton: FC<SignoutButtonProps> = ({...props}) => {
	const [isSignout, setIsSignout] = useState(false)

	const contents = (
		<Button
			{...props}
			variant='ghost'
			onClick={async () => {
				setIsSignout(true)
				try{
					await signOut()
				}catch(err){
					toast.error('Something went wrong with signing out')
				}finally{
					setIsSignout(false)
				}
			}} 
		>
			{isSignout 
				? (
				<Loader2 className='animate-spin h-4 w-4' />
			 ) : (
				<LogOut className='h-4 w-4'/>
			 )}
		</Button>
	)

	return contents
}