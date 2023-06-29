'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {deleteProject, fetchToken} from '@/lib/actions'

type ProjectActionsProps = {
	projectId: string
}

export const ProjectActions = ({projectId}: ProjectActionsProps) => {
	const [isDeleting, setIsDeleting] = useState(false)
	const router = useRouter()

	const handleDelete =async () => {
		setIsDeleting(true)

		const {token} = await fetchToken()

		try{
			await deleteProject(projectId, token)
			router.push('/')
		} catch(err){
			console.error(err)
		} finally{
			setIsDeleting(false)
		}
	}
	
	const contents = (
		<>
			<Link 
				className='flexCenter edit-action_btn'
				href={`edit=project/${projectId}`}
			>
				<Image
					src='/pencile.svg'
					width={15}
					height={15}
					alt='edit' 
				/>
			</Link>

			<button
				type='button'
				disabled={isDeleting}
				className={`flexCenter delete-action_btn ${isDeleting ? 'bg-gray' : 'bg-primary-purple'}`}
				onClick={handleDelete}
			>
				<Image
					src='/trash.svg'
					width={15}
					height={15}
					alt='delete' 
				/>
			</button>
		</>
	)

	return contents
}