'use client'

import {experimental_useOptimistic as useOptimistic} from 'react'
import { useRouter } from 'next/navigation'
import {experimental_useFormStatus as useFormStatus} from 'react-dom'
import { updateTodo } from '@/lib/actions'

export const UpdateCheckbox = ({todo}: {todo: Todo}) => {
	const router = useRouter()
	const {pending} = useFormStatus()
	const [optimisticTodo, addoptimisticTodo] = useOptimistic(
		todo,
		(
			state: Todo,
			completed: boolean
		) => ({...state, completed})
	)

	return (
		<input
			type='checkbox'
			className='min-w-[2rem] min-h-[2rem]'
			checked={optimisticTodo.completed}
			id="completed"
			name="completed"
			onChange={async () => {
				addoptimisticTodo(!todo.completed)
				await updateTodo(todo)
				router.refresh()
			}}
			disabled={pending}
		/>
	)
}