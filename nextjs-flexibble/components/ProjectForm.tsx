'use client'

import React, {ChangeEvent, FormEvent, useState} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormField } from './FormField'
import { Button } from './Button'
import { CustomMenu } from './CustomMenu'
import {categoryFilters} from '@/constants'
import {updateProject, createNewProject, fetchToken} from '@/lib/actions'
import { SessionInterface, ProjectInterface, FormState } from '@/types'
import { FormField } from './FormField'

type ProjectFormProps = {
	type: string,
	session: SessionInterface,
	project?: ProjectInterface
}

export const ProjectForm = ({type, session, project}: ProjectFormProps) => {
	const router = useRouter()
	const [submitting, setSubmitting] = useState(false)
	const [form, setForm] = useState<FormState>({
		title: project?.title || '',
		description: project?.description || '',
		image: project?.image || '',
		liveSiteUrl: project?.liveSiteUrl || '',
		githubUrl: project?.githubUrl || '',
		category: project?.category || ''
	})

	const handleChange = (fieldName: keyof FormState, value: string) => {
		setForm(prev => ({
			...prev,
			[fieldName]: value
		}))
	}

	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()

		const file = e.target.files?.[0]

		if(!file)
			return

		if(!file.type.includes('image')) {
			alert('Please upload an image')

			return
		}

		const fileReader = new FileReader()

		FileReader.readAsDataURL(file)

		fileReader.onload = () => {
			const result = fileReader.result as string

			handleChange('image', result)
		}
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		setSubmitting(true)

		const {token} = await fetchToken()

		try{
			if(type === 'create'){
				await createNewProject(form, session?.user?.id, token)
				router.push('/')
			} else if (type === 'edit'){
				await updateProject(form, project?.id as string, token)
				router.push('/')
			}
		}catch(err){
			alert(`Failed to ${type === "create" ? "create" : "edit"} a project. Try again!`)
		}finally{
			setSubmitting(false)
		}
	}

	const contents = (
		<form
			className='flexStart form'
			onSubmit={handleSubmit}
		>
			<div className='flexStart form_image-container'>
				<label
					className='flexCenter form_image-label' 
					htmlFor="poster"
				>
					{!form.image && 'Choose a poster for your project'}
				</label>

				<input
					id='image'
					type='file'
					accept='iamge/*'
					required={type === 'create' ? true : false}
					className='form_image-input'
					onChange={e => handleChangeImage(e)}
				/>
				{form.image  && (
					<Image
						src={form?.image}
						fill
						className='sm:p-10 object-contain z-20'
						alt='image' 
					/>
				)}
			</div>

			<FormField 
				title='Title'
				state={form.title}
				placeholder='Flexibble'
				setState={(value) => handleChange('title', value)}
			/>

			<FormField
				type="url"
				title="Website URL"
				state={form.liveSiteUrl}
				placeholder="https://jsmastery.pro"
				setState={(value) => handleChange('liveSiteUrl', value)}
			/>

			<FormField
				type="url"
				title="GitHub URL"
				state={form.githubUrl}
				placeholder="https://github.com/adrianhajdin"
				setState={(value) => handleChange('githubUrl', value)}
			/>

			<CustomMenu
				title='category'
				state={form.category}
				filters={categoryFilters}
				setState={value => handleChange('category', value)} 
			/>

			<div className="flexStart w-full">
				<Button
					title={submitting ? `${type === "create" ? "Creating" : "Editing"}` : `${type === "create" ? "Create" : "Edit"}`}
					type='submit'
					leftIcon={submitting ? '' : '/plus.svg'}
					submitting={submitting}
				/>
			</div>		
		</form>
	)

	return contents
}