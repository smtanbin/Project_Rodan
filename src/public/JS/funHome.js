/*api server url is in environment file*/
const apiserver = '/api/'

/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

const pichat = async () => {
	/* Post request body content*/
	const url = `${apiserver}pichart`
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}
	let xValues = []

	let yValues = []

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		console.log(payload)

		payload.map(({ TYPE, BALANCE }) => {
			xValues += `${TYPE},`
			yValues += `${BALANCE},`
		})
		const barColors = [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'#b91d47',
			'#00aba9',
			'#2b5797',
			'#e8c3b9',
			'#1e7145',
			'rgba(105, 010, 034, 1)'
		]
		const xaxe = xValues.split(',')
		const yaxe = yValues.split(',')

		// const myChart = document.getElementById('myChart')
		console.log(typeof xValues)
		console.log(yValues)
		new Chart('Chart', {
			type: 'doughnut',
			data: {
				labels: xaxe,
				datasets: [
					{
						backgroundColor: barColors,
						data: yaxe,
						radius: '50%'
					}
				]
			},
			options: {
				title: {
					display: true,
					text: 'Balance'
				}
			}
		})
	})
}

pichat()
