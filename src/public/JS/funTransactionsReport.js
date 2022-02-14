/*api server url is in environment file*/
const apiserver = '/api/'

/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')


const init = async () => {

    const url = `${apiserver}/transactionsreport`
	const rawhead = JSON.stringify({
		key: `${key}`,
		date: `${fromdate}`
	})

	const headrequestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: rawhead,
		redirect: 'follow'
	}

    await fetch(urlbody, bodyrequestOptions).then((response) => response.json()).then((payload) => {

    })
}