'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './Button'

type LoadMoreProps = {
	startCursor: string,
	endCursor: string,
	hasPreviousPage: boolean,
	hasNextPage: boolean
}

export const LoadMore = ({startCursor, endCursor, hasPreviousPage, hasNextPage}: LoadMoreProps) => {
	const router = useRouter()
	
	const navigate = (type: string) => {
		const currentParams = new URLSearchParams(window.location.search)

		if(type === 'prev' && hasPreviousPage){
			currentParams.delete('endcursor')
			currentParams.set('startcursor', startCursor)
		}else if(type === 'next' && hasNextPage){
			currentParams.delete('startcursor')
			currentParams.set('endcursor', endCursor)
		}

		const newSearchParams = currentParams.toString()
		const newPathname = `${window.location.pathname}?${newSearchParams}`

		router.push(newPathname)
	}

	return (
		<div className='w-full flexCenter gap-5 mt-10'>
			{hasPreviousPage && (
				<Button
					title='First Page'
					handleClick={() => navigate('prev')} 
				/>
			)}

			{hasNextPage && (
				<Button
					title='Next Page'
					handleClick={() => navigate('next')} 
				/>
			)}
		</div>
	)
}