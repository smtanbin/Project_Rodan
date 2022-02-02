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

module.exports = { oracleDate }
