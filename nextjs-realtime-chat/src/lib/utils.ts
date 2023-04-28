import {ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const toPusherKey = (key: string) => key.replace(/:/g, '_')

export const chatHrefConstructot = (id1: string, id2: string) => {
	const sortedIds = [id1, id2].sort()
	return `${sortedIds[0]}--${sortedIds[1]}`
}