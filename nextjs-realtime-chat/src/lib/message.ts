import {z} from 'zod'

export const messageValidator = z.object({
	id: z.string(),
	senderId: z.string(),
	text: z.string(),
	timeStamp: z.number()
})

export const messageArrayValidate = z.array(messageValidator)

export type Message = z.infer<typeof messageValidator>