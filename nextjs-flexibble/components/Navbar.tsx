'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {NavLinks} from '@/constants'
import {getCurrentUser} from '@/lib/session'
import { AuthProvider } from '@/components/AuthProvider'
import { Button } from './Button'
import {ProfileMenu} from './ProfileMenu'


export const Navbar = async () => {
	const session = await getCurrentUser()

	const contents = (
		<nav className="flexBetween navbar">
			<div className="flex-1 flexStart gap-10">
				<Link
					href='/'
				>
					<Image
						src='/logo.svg'
						width={116}
						height={43}
						alt='logo' 
					/>
				</Link>

				<ul className="xl:flex hidden text-small gap-7">
					{NavLinks.map(link => (
						<Link
							href={link.href}
							key={link.text}
						>
							{link.text}
						</Link>
					))}
				</ul>
			</div>

			{/* <div className="flexCenter gap-4">
				{session?.user ? (
					<>
						<ProfileMenu session={session} />

						<Link href='/create-project'>
							<Button title='Share Work'/>
						</Link>
					</>
				) : (
					<AuthProvider />
				)}
			</div> */}
		</nav>
	)
	
	return contents
}