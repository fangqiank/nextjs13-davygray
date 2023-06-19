 import {getAllQuotes} from './getAllQuotes'

 const prevQuoteObj = {
	prev: 1,
	setPrev: function (num: number) { this.prev = num }
 }

 export const getRandomQuote = async (): Promise<Quote> => {
	const results = await getAllQuotes()

	let randomInd = prevQuoteObj.prev

	while(randomInd === prevQuoteObj.prev){
		randomInd = Math.floor(Math.random() * results.length)
	}

	prevQuoteObj.setPrev(randomInd)

	return results[randomInd]
 }