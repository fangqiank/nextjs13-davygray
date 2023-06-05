'use client'

import { RootState, AppDispatch } from "@/store"
import { fetchUsers, increment } from "@/store/userSlice"
import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"

export const UserList = () => {
	const {entities, loading, value} = useSelector((state: RootState) => state.user)
	const userRef = useRef(false)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		if(userRef.current === false) {
			dispatch(fetchUsers())
		}
		
		return () => {
			userRef.current = true
		}
	}, [])

	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				entities?.map((user: any) => <div key={user.id}>{user.name}</div> )
			)}

			<button onClick={() => dispatch(increment(5))}>
				call me
			</button>
			<span>{value}</span>
		</>
	)
}