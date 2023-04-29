import {Icons, Icon} from '@/components/Icons'
import {SignoutButton} from '@/components/SignoutButton'
import {authOptions} from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import {FriendRequestSideBar} from '@/components/FriendRequestSideBar'
import {fetchRedis} from '@/lib/redis'
import {ChatListSidebar} from  '@/components/ChatlistSideBar'
import {MobileChatLayout} from '@/components/MobileChatLayout'
import {getFriendByUserId} from '@/lib/getFriendsByUserId'
import { SidebarOption } from '@/types/typings'
import { getServerSession } from 'next-auth'

type DashBoardLayoutLayoutProps = {
	children: ReactNode
}

export const metadata = {
	title: 'FriendZone | Dashboard',
	description: 'Your dashboard'
}

const sidebarOptions: SidebarOption[] =[
	{
		id: 1,
		name: 'Add freind',
		href: '/dashboard/add',
		Icon: 'UserPlus'
	}
]

const DashBoardLayout = async ({children}: DashBoardLayoutLayoutProps) => {
	const session = await getServerSession(authOptions)
	if(!session)
		notFound()

	const friends = await getFriendByUserId(session.user.id)
	const unseenRequestCount = (
		(await fetchRedis(
			'smembers', 
			`user:${session.user.id}:incoming_friend_requests`
		)) as User[]
	).length
	const contents = (
		<div className="w-full flex h-screen">
			<div className="md:hidden">
				<MobileChatLayout
					friends={friends}
					session={session}
					sidebarOptions={sidebarOptions}
					unseenRequestCount={unseenRequestCount} 
				/>
			</div>

			<div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
				<Link
					href='/dashboard'
					className='flex h-16 shrink-0 items-center'
				>
					<Icons.Logo className='h-8 w-auto text-indigo-600' />
				</Link>
					{
						friends.length > 0 
							? (
									<div className='text-xs font-semibold leading-6 text-gray-400'>
										Your chats
									</div>
								)
							: null
					}

					<nav className="flex flex-1 flex-col">
						<ul 
							className="flex flex-1 flex-col gap-7"
							role='list'
						>
							<li>
								<ChatListSidebar
									sessionId={session.user.id}
									friends={friends} 
								/>
							</li>
							<li>
								<div className="text-xs font-semibold leading-6 text-gray-400">
									Overview
								</div>

								<ul className="-mx-2 mt-2 space-y-1">
									{sidebarOptions.map(option => {
										const Icon = Icons[option.Icon]
										
										return (
											<li key={option.id}>
												<Link
													href={option.href}
													className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
												>
													<span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
														<Icon className='h-4 w-4'/>
													</span>

													<span className="truncate">{option.name}</span>
												</Link>
											</li>
										)
									})}

									<li>
									<FriendRequestSideBar
                    sessionId={session.user.id}
                    initialRequestCount={unseenRequestCount}
                  />
									</li>
								</ul>	
							</li>

							<li className='-mx-6 mt-auto flex items-center'>
									<div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
										<div className='relative h-8 w-8 bg-gray-50'>
											<Image 
												fill
												referrerPolicy='no-referrer'
												className='rounded-full'
												src={session.user.image || ''}
												alt='Your profile picture'
											/>
										</div>

										<span className='sr-only'>Your profile</span>
										<div className='flex flex-col'>
											<span aria-hidden='true'>{session.user.name}</span>
											<span className='text-xs text-zinc-400' aria-hidden='true'>
												{session.user.email}
											</span>
										</div>
									</div>

									<SignoutButton  className='h-full aspect-square' />
							</li>
						</ul>
					</nav>
			</div>

			<aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
		</div>
	)

	return contents
}

export default DashBoardLayout