import {GraphQLClient} from 'graphql-request'
import { createProjectMutation, createUserMutation, deleteProjectMutation, updateProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery } from "@/graphql";
import { ProjectForm } from '@/types'

const isProduction = process.env.NODE_ENV === 'production'
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql'
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'Ld+y3gphMy2Tw23vO0bBgt8/BxoLab4yQ6wO8LNdp+U='
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const client = new GraphQLClient(apiUrl)

export const fetchToken = async () => {
	try{
		const res = await fetch(`${serverUrl}/api/auth/token`)
		return res.json()
	}catch(err){
		throw err
	}
}

export const uploadImage = async (imagePath: string) => {
	try{
		const res = await fetch(`${serverUrl}/api/upload`, {
			method: 'POST',
			body: JSON.stringify({
				path: imagePath
			})
		})
		return res.json()
	} catch(err){
		throw err
	}
}

export const makeGraphQLRequest = async (query: string, variables = {}) => {
	try{
		return await client.request(query, variables)
	}catch(err){
		throw err
	}
}

export const fetchAllProjects = (category?: string | null, endcursor?: string | null) => {
	client.setHeader('x-api-key', apiKey)

	return makeGraphQLRequest(projectsQuery, {
		category,
		endcursor
	})
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
	const imageUrl = await uploadImage(form.image)

	if(imageUrl.url){
		client.setHeader('Authorization', `Bearer ${token}`)

		console.log(creatorId);

		const variables = {
			input: {
				...form,
				image: imageUrl.url,
				createdBy: {
					link: creatorId
				}
			}
		}

		return makeGraphQLRequest(createProjectMutation, variables)
	}
}

export const updateProject = async(form: ProjectForm, projectId: string, token: string) => {
	function isBase64DataUrl(value: string){
		const base64Regex = /^data:image\/[a-z]+;base64,/
    return base64Regex.test(value)
  }
	
	let updatedForm = {...form}

	const isUploadingNewImage = isBase64DataUrl(form.image)

	if(isUploadingNewImage){
		const imageUrl = await uploadImage(form.image)

		if(imageUrl.url){
			updatedForm = {
				...updatedForm,
				image: imageUrl.url
			}
		}
	}

	client.setHeader('Authorization', `Bearer ${token}`)

	const variables = {
		id: projectId,
		input: updatedForm
	}

	return makeGraphQLRequest(updateProjectMutation, variables)
}

export const deleteProject = (id: string, token: string) => {
	client.setHeader('Authorization', `Bearer ${token}`)

	return makeGraphQLRequest(deleteProjectMutation, {id})
}

export const getProjectDetails = (id: string) => {
	client.setHeader('x-api-key', apiKey)

	return makeGraphQLRequest(getProjectByIdQuery, {id})
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
	client.setHeader('x-api-key', apiKey)

	const variables = {
		input: {
			name,
			email,
			avatarUrl
		}
	}

	return makeGraphQLRequest(createUserMutation, variables)
}

export const getUserProjects = (id: string, last?: number) => {
	client.setHeader('x-api-key', apiKey)
	
	return makeGraphQLRequest(getProjectsOfUserQuery, {id, last})
}

export const getUser = (email: string) => {
	client.setHeader('x-api-key', apiKey)
	
	return makeGraphQLRequest(getUserQuery, {email})
}
