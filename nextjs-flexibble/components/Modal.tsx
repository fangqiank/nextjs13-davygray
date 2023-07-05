'use client'

import React, {useCallback, useRef, ReactNode, MouseEvent} from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type ModalProps = {
	children: ReactNode
}

export const Modal = ({children}: ModalProps) => {
	const overlay = useRef<HTMLDivElement>(null)
	const warpper = useRef<HTMLDivElement>(null)
	const router = useRouter()

	const onDismiss = useCallback(() => {
		router.push('/')
	}, [router])

	const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
		if((e.target === overlay.current) && onDismiss){
			onDismiss()
		}
	}, [onDismiss, overlay])

	return (
		<div
			ref={overlay}
			className='modal'
			onClick={e => handleClick(e)}
		>	
			<button
				type='button'
				className='absolute top-4 right-8'
				onClick={onDismiss}
			>
				<Image
					src='/close.svg'
					width={17}
					height={17} 
					alt='close'
				/>
			</button>

			<div 
				ref={warpper}
				className="modal_wrapper"
			>
				{children}
			</div>
		</div>
	)
}