import React, {ReactNode, useEffect, useState} from 'react'
import type {ToastActionElement, ToastProps} from '../components/ui/Toast'
import { type } from 'os'
import { Toast } from '@radix-ui/react-toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
	id: string,
	title?: ReactNode,
	description?: ReactNode,
	action?: ToastActionElement
}

const actionType = {
	ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0
const genId = () => {
	count = (count + 1) % Number.MAX_VALUE
	return count.toString()
}

type ActionType = typeof actionType

type Action = {
	type: ActionType['ADD_TOAST'],
	toast: ToasterToast
} | {
	type: ActionType["UPDATE_TOAST"],
  toast: Partial<ToasterToast>
} | {
	type: ActionType["DISMISS_TOAST"],
  toastId?: ToasterToast["id"]
} | {
	type: ActionType["REMOVE_TOAST"],
  toastId?: ToasterToast["id"]
}

interface State {
	toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRomoveQueue = (toastId: string) => {
	if(toastTimeouts.has(toastId))
		return 
	
	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId)
		dispatch({
			type: 'REMOVE_TOAST',
			toastId
		})
	}, TOAST_REMOVE_DELAY)

	toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
	switch(action.type){
		case 'ADD_TOAST':
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
			}
		
		case 'UPDATE_TOAST':
			return {
				...state, 
				toasts: state.toasts.map(t => t.id === action.toast.id ? {...t, ...action.toast} : t)
			}

		case 'DISMISS_TOAST': {
			const {toastId} = action

			if(toastId)
				addToRomoveQueue(toastId)
			else
				state.toasts.forEach(t => addToRomoveQueue(t.id))

				return {
					...state,
					toasts: state.toasts.map(toast =>
						toast.id === toastId || toastId === undefined
							? {
									...toast,
									open: false,
								}
							: toast
					),
				}
		} 

		case 'REMOVE_TOAST': {
			if(action.toastId === undefined){
				return {
					...state,
					toasts: []
				}
			}

			return {
				...state,
				toasts: state.toasts.filter(toast => toast.id !== action.toastId)
			}
		}
	}
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = {toasts: []}

const dispatch = (action: Action) => {
	memoryState = reducer(memoryState, action)
	listeners.forEach(listener => listener(memoryState))
}

type Toast = Omit<ToasterToast, 'id'>

export const toast = ({...props}: Toast) => {
	const id = genId()

	const update = (props: ToasterToast) => dispatch({
			type: 'UPDATE_TOAST',
			toast: {...props, id}
		})

	const dismiss = () => dispatch({
		type: 'DISMISS_TOAST',
		toastId: id
	})

	dispatch({
		type: 'ADD_TOAST',
		toast: {
			...props,
			id, 
			open: true,
			onChange: open => {
				if(!open)
					dismiss()
			}
		}
	})

	return {
		id,
		dismiss,
		update
	}
}

export const useToast = () => {
	const [state, setState] = useState<State>(memoryState)

	useEffect(() => {
		listeners.push(setState)

		return () => {
			const idx = listeners.indexOf(setState)
			if(idx > -1)
				listeners.splice(idx, 1)
		}
	}, [state])

	return {
		...state,
		toast, 
		dismiss: (toastId?: string) => dispatch({
			type: 'DISMISS_TOAST',
			toastId
		})
	}
}
