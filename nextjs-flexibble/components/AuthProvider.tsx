'use client'

import React, {useState, useEffect} from 'react'
import {getProviders, signIn} from 'next-auth/react'
import { Button } from './Button'

type Provider = {
	id: string,
	name: string,
	type: string, 
	signinUrl: string,
	callbackUrl: string,
	signinUrlParams?: Record<string, string> | undefined
}

type Providers = Record<string, Provider>

export const AuthProvider = () => {
	const [providers, setProviders] =  useState<Providers | null>(null)

	useEffect(() => {
		const fetchProviders = async () => {
			const res = await getProviders()
			setProviders(res)
		}

			fetchProviders()
	}, [])
	
	if(providers){
		return (
			<div>
				{Object.values(providers).map((prov: Provider, idx) => (
					<Button
						type='button'
						key={idx}
						title='Sign In'
						handleClick={() => signIn(prov?.id)}
					/>
				))}
			</div>	
		)
	}
}