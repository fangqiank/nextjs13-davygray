'use client'

import {getUserProjects} from '@/lib/actions'
import { ProjectInterface, UserProfile } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export const RelatedProjects = async ({userId, projectId}: {
	userId: string,
	projectId: string
}) => {
	const result = await getUserProjects(userId) as {
		user: UserProfile
	}

	const filteredProjects = result?.user?.projects?.edges?.filter(({node} : {node: ProjectInterface}) => node?.id !== projectId)

	if(filteredProjects.length === 0)
		return null
		
	const contents = (
		<section className="flex flex-col mt-32 w-full">
			<div className="flexBetween">
				<p className="text-base font-bold">
					More by {result?.user?.name}
				</p>

				<Link 
					href={`/profile/${result?.user?.id}`}
					className='text-primary-purple text-base'
				>
					View All
				</Link>
			</div>

			<div className="related_project-grid">
				{filteredProjects?.map(({node}: {node: ProjectInterface}) => (
					<div 
						className="flexCenter related_project-card drop-shadow-card"
						key={node?.id}
					>
						<Link
							href={`/project/${node?.id}`}
							className='flexCenter group relative w-full h-full'
						>
							<Image
								src={node?.image}
								width={414}
								height={314}
								alt='project image'
								className='w-full h-full object-cover rounded-2xl' 
							/>

							<div className="hidden group-hover:flex related_project-card_title">
								<p className="w-full">{node?.title}</p>
							</div>
						</Link>
					</div>
				))}
			</div>
		</section>
	)
	
	return contents
}