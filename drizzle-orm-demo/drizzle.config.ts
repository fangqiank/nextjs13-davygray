import type {Config} from 'drizzle-kit'
import dotnev from 'dotenv'
dotnev.config({
	path: '.env.local'
})

export default {
	schema: "./db/schema.ts",
	out: "./drizzle",
  connectionString: process.env.DATABASE_URL,
} satisfies Config