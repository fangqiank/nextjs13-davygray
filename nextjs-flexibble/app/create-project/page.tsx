import { redirect } from "next/navigation"
import {getCurrentUser} from '@/lib/session'
import { Modal } from "@/components/Modal"
import { ProjectForm } from "@/components/ProjectForm"

const CreateProjectPage = async () => {
	const session = await getCurrentUser()

	if(!session?.user) 
		redirect('/')

	return (
		<Modal>
			<h3 className="modal-head-text">Create a new project</h3>

			<ProjectForm
				type="create"
				session={session} 
			/>
		</Modal>
	)
}

export default CreateProjectPage