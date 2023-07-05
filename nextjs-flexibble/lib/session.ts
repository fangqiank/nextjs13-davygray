import {getServerSession} from 'next-auth/next'
import type {NextAuthOptions, User} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import jsonWebToken from 'jsonwebtoken'
import {JWT} from 'next-auth/jwt'
import {createUser, getUser} from './actions'
import { SessionInterface, UserProfile } from '@/types'
import CredentialsProvider  from 'next-auth/providers/credentials'
import { data } from 'autoprefixer'

export const authOptions: NextAuthOptions ={
	providers:[
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),

		// GitHubProvider({
		// 	clientId: process.env.GITHUB_CLIENT_ID!,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET!
		// }),

		// CredentialsProvider({
		// 	name: 'Credentials',
		// 	credentials: {
		// 		username: {
		// 			label: 'Username',
		// 			type: 'text',
		// 			placeholder: 'your username'
		// 		},
		// 		password: {
		// 			label: 'Password',
		// 			type: 'password',
		// 			placeholder: 'your password'
		// 		}
		// 	},
			
		// 	async authorize(config){
		// 		const user = {
		// 			id: '0fc4b477-1816-4743-9a7c-ed546123c6a0',
		// 			name: 'zhangsan',
		// 			password: 'password'
		// 		}

		// 		return (config?.username === user.name && config?.password === user.password) 
		// 			? user 
		// 			: null
		// 	},
		// })
	],

	jwt: {
		encode: ({secret, token}) => {
			const encodedToken = jsonWebToken.sign({
				...token,
				iss: 'grafbase',
				exp: Math.floor(Date.now() / 1000)  + 60 * 60 
			},
			secret
			)

			return encodedToken
		},

		decode: async ({secret, token}) => {
			const decodedToken = jsonWebToken.verify(token!, secret)
			return decodedToken as JWT
		}
	},

	theme: {
		colorScheme: 'auto',
		logo: '/logo.svg'
	},

	callbacks: {
		async session({session}) {
			const email = session?.user?.email as string
			
			try{
				const data = await getUser(email) as {user?: UserProfile}

				const newSession = {
					...session,
					user: {
						...session.user,
						...data?.user
					}
				}

				return newSession
			}catch(error: any){
				console.error("Error retrieving user data: ", error.message)
				return session
			}
		},

		async signIn({user}: {
			user: AdapterUser | User
		}) {
			try{
				const userExists = await getUser(user?.email as string) as {user?: UserProfile}

				if(!userExists.user){
					await createUser(user.name as string, user.email as string, user.image as string)
				}

				return true
			}catch(error: any){
				console.error("Error checking if user exists: ", error.message)
				return false
			}
		}
	}
}

export const getCurrentUser = async () => {
	const session = await getServerSession(authOptions) as SessionInterface
	return session
}