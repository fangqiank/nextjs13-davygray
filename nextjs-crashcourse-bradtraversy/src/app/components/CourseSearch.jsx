import {useState} from 'react'

export const CourseSearch = ({getResults}) => {
	const [query, setQuery] = useState('')

	const handleSubmit = async e => {
		e.preventDefault()

		const res = await fetch(`/api/courses/search?query=${query}`)
		const courses = await res.json()
		getResults(courses)
	} 

	return (
		<form onSubmit={handleSubmit} className='search-form'>
			<input 
				type="text"
				className='search-input'
				placeholder='Search courses...'
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>

			<button className='search-button' type="submit">
				Search
			</button>
		</form>
	)
}
