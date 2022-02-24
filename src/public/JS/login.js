const login = async () => {
	const user = document.getElementById('user').value
	const passwd = document.getElementById('passwd').value

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')
	myHeaders.append('Access-Control-Allow-Origin', '*')
	const url = `/oauth`

	const raw = JSON.stringify({
		user: `${user}`,
		passwd: `${passwd}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		console.log(payload)
	})
}
