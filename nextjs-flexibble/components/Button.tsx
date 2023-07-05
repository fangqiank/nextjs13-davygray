'use client'

import React, {MouseEventHandler} from 'react'
import Image from 'next/image'

type ButtonProps = {
	title: string,
	leftIcon?: string | null,
	rightIcon?: string | null,
	handleClick?: MouseEventHandler,
	submitting?: boolean | false,
	type?: 'button' | 'submit',
	bgColor?: string,
	textColor?: string 
}

export const Button = ({title, leftIcon, rightIcon, handleClick, submitting, type, bgColor, textColor}: ButtonProps) => {
	return (
		<button
			type={type || 'button'}
			disabled={submitting || false}
			className={`flexCenter gap-2 px-4 py-3 ${textColor ? textColor : 'text-white'} ${submitting ? 'bg-black/50' : bgColor ? bgColor : 'bg-primary-purple'} rounded-xl text-sm font-medium max-md:w-full`}
			onClick={handleClick}
		>
			{leftIcon && <Image src={leftIcon} width={14} height={14} alt='left icon' />}
			{title}
			{rightIcon && <Image src={rightIcon} width={14} height={14} alt='right icon' />}
		</button>
	)
}
