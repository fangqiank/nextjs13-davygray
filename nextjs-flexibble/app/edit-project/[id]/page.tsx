import { redirect } from 'next/navigation'
import { Modal } from '@/components/Modal'
import { ProjectForm } from '@/components/ProjectForm'
import { getCurrentUser } from '@/lib/session'
import { getProjectDetails } from '@/lib/actions'
import { ProjectInterface } from '@/types'

type EditProjectPageProps = {
	params: {
		id: string
	}
}

const EditProjectPage = async ({params: {id}}: EditProjectPageProps) => {
	const session = await getCurrentUser()

	if(!session?.user)
		redirect('/')

	const res = await getProjectDetails(id) as {
		project?: ProjectInterface
	}	

	if(!res?.project) {
		return (
			<p className="no-result-text">Problems with fetching project details</p>
		)
	}

	return (
		<Modal>
			<h3 className="modal-head-text">Edit Project</h3>

			<ProjectForm
				type='edit'
				session={session}
				project={res?.project} 
			/>
		</Modal>
	)
}

export default EditProjectPage