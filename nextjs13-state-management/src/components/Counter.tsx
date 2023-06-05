'use client'

import { useDispatch, useSelector } from "react-redux"
import {RootState, AppDispatch} from '@/store'
import {increment, decrement, incrementByAmount} from '../store/counterSlice'
import Button from 'react-bootstrap/Button'

export const Counter = () => {
	const dispatch = useDispatch<AppDispatch>()
	
	const count = useSelector((state: RootState) => 
		state.counter.value
	)

	return (
		<div>
			<span>{count}</span>
			<Button
				variant="outline-primary"
				onClick={() => dispatch(increment())}
			>
				Increment
			</Button>
	
			<Button
				variant="outline-primary"
				onClick={() => dispatch(decrement())}
			>
				Decrement
			</Button>

			<Button
				variant="outline-primary"
				onClick={() => dispatch(incrementByAmount(2))}
			>
				Increment 2
			</Button>
		</div>
	)
}