/*api server url is in environment file*/
//const apiserver = '/api/'


const init = async () => {
	const url = `${apiserver}//transactionsreport`
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

	await fetch(urlbody, bodyrequestOptions).then((response) => response.json()).then((payload) => { })
}
