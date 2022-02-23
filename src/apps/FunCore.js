// Core Functions

const oracleDate = (date) => {
	const payload = new Date(date)
	const day = payload.getDate()
	const month = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ][
		payload.getMonth()
	]
	const output = day + '-' + month + '-' + payload.getFullYear()

	return output
}
const binSearch = (arr, x, start, end) => {
	// Base Condition
	if (start > end) return false

	// Find the middle index
	let mid = Math.floor((start + end) / 2)

	// Compare mid with given key x
	if (arr[mid] === x) return true

	// If element at mid is greater than x,
	// search in the left half of mid
	if (arr[mid] > x) return recursiveFunction(arr, x, start, mid - 1)
	else
		// If element at mid is smaller than x,
		// search in the right half of mid
		return recursiveFunction(arr, x, mid + 1, end)
}

function setCookie(name, value, days) {
	var expires = ''
	if (days) {
		var date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toUTCString()
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
function getCookie(name) {
	var nameEQ = name + '='
	var ca = document.cookie.split(';')
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == ' ') c = c.substring(1, c.length)
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
	}
	return null
}
function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

module.exports = { oracleDate, binSearch, setCookie, getCookie, eraseCookie }
