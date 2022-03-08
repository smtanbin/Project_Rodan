const removeError = () => {
	document.getElementById('error').style.opacity = 0
	document.getElementById('error-input').classList.remove('has-error')
}
const authorized = async () => {
	const user = document.getElementById('user').value
	const passwd = document.getElementById('passwd').value

	if (!user) {
		alert('User cannot be null')
	} else if (!passwd) {
		alert('You cannot have blink passsword')
	} else {
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
		try {
			await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
				if (payload === false) {
					document.getElementById('error').style.opacity = 100
					document.getElementById('error-input').classList.toggle('has-error')
				} else {
					window.location.href = '/'
					console.log(payload)
				}
			})
		} catch (e) {
			document.getElementById('error').style.opacity = 100
			console.log('error:' + e)
		}
		// window.location.replace('/')
	}
}

addEventListener('keypress', function(e) {
	if (e.key === 'Enter') {
		authorized()
	}
})
