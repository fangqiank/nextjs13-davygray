'use client'

import {FC, ReactNode} from 'react'
import {Toaster} from 'react-hot-toast'

type ProviderProps = {
	children: ReactNode
}

export const Provider: FC<ProviderProps> = ({children}) => {
	return (
		<>
			<Toaster 
				position='top-center'
				reverseOrder={false}
			/>
			{children}	
		</>
	)
}