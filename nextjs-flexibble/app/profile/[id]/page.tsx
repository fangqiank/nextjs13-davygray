import { getUserProjects} from '@/lib/actions'
import { ProfilePage } from '@/components/ProfilePage'
import { UserProfile } from '@/types'

type UserProfilePageProps = {
	params: {id: string}
}

const UserProfilePage = async ({params: {id}}: UserProfilePageProps) => {
	const res =  await getUserProjects(id, 100) as {
		user: UserProfile
	}

	if(!res?.user)
		return (
			<p className="no-result-text">Problems with fetch user info</p>
		)

	return (
		<ProfilePage
			user={res?.user} 
		/>
	)
} 

export default UserProfilePage
