// const e = require('cors')

/*api server url is in environment file*/
const apiserver = '/api/'

/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')
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
		payload.map(({ TYPE, BALANCE }) => {
			xValues += `${TYPE},`
			yValues += `${BALANCE},`
		})

		const xaxe = xValues.split(',')
		const yaxe = yValues.split(',')

		new Chart('Chart', {
			type: 'pie',
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
					display: false,
					text: 'Balance',
					position: 'top'
				}
			}
		})
	})
}
const agentstatus = async () => {
	/* Post request body content*/
	const url = `${apiserver}agentstatus`
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	let local_mphone = []
	let loacl_today = []
	let local_yesterday = []
	let loacl_cc = []
	let loacl_cy = []

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map(({ MPHONE, ACCOUNT_NAME, YESTERDAY, TODAY, CUSTOMER_CURRENT, CUSTOMER_YESTERDAY }) => {
			local_mphone += `${MPHONE},`
			loacl_today += `${TODAY.toFixed(2)},`
			local_yesterday += `${YESTERDAY.toFixed(2)},`
			loacl_cc += `${CUSTOMER_CURRENT.toFixed(2)},`
			loacl_cy += `${CUSTOMER_YESTERDAY.toFixed(2)},`
		})
		local_mphone = local_mphone.split(',')
		loacl_today = loacl_today.split(',')
		local_yesterday = local_yesterday.split(',')
		loacl_cc = loacl_cc.split(',')
		loacl_cy = loacl_cy.split(',')

		new Chart('agentChart', {
			type: 'bar',
			data: {
				labels: local_mphone,
				datasets: [
					{
						data: loacl_today,

						backgroundColor: 'dodgerblue',
						fill: false
					},
					{
						data: local_yesterday,
						text: 'Previous Day',
						backgroundColor: 'tomato',
						fill: false
					}
				]
			},
			options: {
				legend: { display: true, text: 'Today' },
				title: {
					display: false,
					position: 'top',
					text: 'Agent Balance'
				}
			}
		})
		new Chart('customerChart', {
			type: 'bar',
			data: {
				labels: local_mphone,
				datasets: [
					{
						data: loacl_cc,
						backgroundColor: '#6495ED',
						fill: false
					},
					{
						data: loacl_cy,
						backgroundColor: 'tomato',
						fill: false
					}
				]
			},
			options: {
				legend: {
					display: true,
					labels: {
						text: 'Yesterday',
						color: 'rgb(255, 99, 132)'
					}
				},
				title: {
					display: false,
					position: 'top',
					text: 'Customer Balance'
				}
			}
		})
	})
	document.getElementById('loading').remove()
}

setInterval(() => {
	let now = new Date()
	let hour = now.getHours()
	hour = hour * 60
	let minute = now.getMinutes()
	let remaintime = hour + minute

	// var distance = countDownDate - now
	// var days = Math.floor(distance / (1000 * 60 * 60 * 24))
	// var showhours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	// var showminutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
	// var showseconds = Math.floor((distance % (1000 * 60)) / 1000)

	// document.getElementById('remainer-text').innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '

	if (remaintime >= 960) {
		document.getElementById('remainer').setAttribute('value', remaintime)
		document.getElementById('remainer').classList.add('bg-warning')
		document.getElementById('remainer-text').classList.add('text-warning')
	} else if (remaintime >= 1020) {
		document.getElementById('remainer').setAttribute('value', remaintime)
		document.getElementById('remainer').classList.add('bg-error')
		document.getElementById('remainer-text').classList.add('text-error')
	} else {
		document.getElementById('remainer').setAttribute('value', remaintime)
	}
}, 1000)

pichat()
agentstatus()
