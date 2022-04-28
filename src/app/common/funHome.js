/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

const redAlart = (input) => {
	if (input > 10000) {
		return text - error
	}
}

/* This is a color chart for pie chat*/
const barColors = [ '#F50F0F', '#2285F5', '#9064F5', '#24F490', '#F5BC58', '#F59FD7', '#AA9FF5', '#2596be', '#A9016E' ]

/* Pie Chart*/

const pichat = async (param) => {
	/* Post request body content*/
	const url = `${apiserver}/pichart`
	const raw = JSON.stringify({
		param: `${param}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
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
			type: 'doughnut',
			data: {
				labels: xaxe,
				datasets: [
					{
						backgroundColor: barColors,
						borderWidth: 1,
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

const agentstatus = async (param) => {

	document.getElementById("agent_banlance").innerHTML=`<div class="card noboder p-2 m-1">
	<div class="card-header">
	  <div class="card-title text-primary h5">Agent Balance</div>

	</div>
	<canvas data-aos="fade-right" id="agentChart" style="width:100%;max-width:800px"></canvas>
	<button class="btn btn-link" onclick="showmore('agent')"><i class="icon icon-more-horiz"></i></button>

	<table data-aos="fade-right" id="agent" class="table table-striped table-cluster p-1"
	  style="display: none;">
	  <thead>
		<tr>
		  <th class="text-tiny text-bold ">AC</th>
		  <th class="text-tiny text-bold text-ellipsis w100">Name</th>
		  <th class="text-tiny text-bold ">Today</th>
		  <th class="text-tiny text-bold ">Yesterday</th>
		</tr>
	  </thead>
	  <tbody id="agentInfo">

	  </tbody>
	</table>
  </div>`


	const url = `${apiserver}/agentstatus`
	const raw = JSON.stringify({
		param: `${param}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	let loacl_today = []
	let local_yesterday = []

	let style = 'text-dark'

	let todaysbar = '#288bfc'
	let yesterdaybar = '#859b97'

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		/*Contracting a string with , to separate value*/
		payload.map(({ YESTERDAY, TODAY }) => {
			if (YESTERDAY > TODAY) {
				style = 'text-error'
			} else if (TODAY > YESTERDAY) {
				style = 'text-success'
			} else {
				style = 'text-dark'
			}
			if (TODAY <= 500000) {
				todaysbar = '#ff6347'
			}
			if (YESTERDAY <= 500000) {
				yesterdaybar = '#E52B50'
			}
			loacl_today += `${TODAY.toFixed(2)},`
			local_yesterday += `${YESTERDAY.toFixed(2)},`

			document.getElementById('agentInfo').innerHTML += `			<tr>
					
			<td class=" ${style} text-left">${TODAY.toLocaleString('en-BD', {
				maximumFractionDigits: 2
			})}</td>
			<td class=" text-right ">${YESTERDAY.toLocaleString('en-BD', {
				maximumFractionDigits: 2
			})}</td>
		  </tr>`
		})

		// turning INTO ARRAY
		const intloacl_today = loacl_today.split(',')
		const intlocal_yesterday = local_yesterday.split(',')

		new Chart('agentChart', {
			type: 'bar',
			data: {
				datasets: [
					{
						data: intloacl_today,
						label: 'Today',
						backgroundColor: todaysbar,
						fill: false
					},
					{
						data: intlocal_yesterday,
						label: 'Yesterday',

						backgroundColor: yesterdaybar,
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
				},
				scales: {
					yAxes: [
						{
							ticks: {
								suggestedMin: 0,
								suggestedMax: 500000
							}
						}
					]
				}
			}
		})
	})
}
/*






*/
const customerstatus = async (param) => {

	document.getElementById("customer_banlance").innerHTML=`              <div class="card-header">
	<div data-aos="fade-up" class="card-title text-primary h5">Customer Balance</div>
  </div>
  <canvas data-aos="fade-right" id="customerChart" style="width:100%;max-width:800px"></canvas>

  <button class="btn btn-link" onclick="showmore('customer')"><i class="icon icon-more-horiz"></i></button>
  <table data-aos="fade-right" id="customer" class="table table-striped table-cluster p-1"
	style="display: none;">
	<thead>
	  <tr>
		<th class="text-tiny text-bold ">Agent</th>
		<th class="text-tiny text-bold text-ellipsis w100">Name</th>
		<th class="text-tiny text-bold ">Today</th>
		<th class="text-tiny text-bold ">Yesterday</th>
	  </tr>
	</thead>
	<tbody id="customerInfo">
	</tbody>
  </table>`



	let local_mphone = []
	let loacl_cc = []
	let loacl_cy = []
	/* Post request body content*/

	const url = `${apiserver}/customerstatus`
	const raw = JSON.stringify({
		param: `${param}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		/*Contracting a string with , to separate value*/
		let localCustomerToday = 0
		let localCustomerYday = 0
		let style = 'text-dark'
		payload.map(({ AC_TYPE_CODE, CUSTOMER_CURRENT, CUSTOMER_YESTERDAY }) => {
			local_mphone += `${AC_TYPE_CODE},`
			loacl_cc += `${CUSTOMER_CURRENT.toFixed(2)},`
			loacl_cy += `${CUSTOMER_YESTERDAY.toFixed(2)},`
			localCustomerToday += CUSTOMER_CURRENT
			localCustomerYday += CUSTOMER_YESTERDAY

			if (CUSTOMER_YESTERDAY > CUSTOMER_CURRENT) {
				style = 'text-error'
			} else if (CUSTOMER_CURRENT > CUSTOMER_YESTERDAY) {
				style = 'text-success'
			} else {
				style = 'text-dark'
			}

			document.getElementById('customerInfo').innerHTML += `<tr>
			<td class="text-tiny w100">${AC_TYPE_CODE}</td>

			<td class="text-tiny ${style} text-right">${CUSTOMER_CURRENT.toLocaleString('en-BD', {
				maximumFractionDigits: 2
			})}</td>
			<td class="text-tiny text-right">${CUSTOMER_YESTERDAY.toLocaleString('en-BD', {
				maximumFractionDigits: 2
			})}</td>
		  </tr>`
		})
		document.getElementById('customerInfo').innerHTML += `<tr>
		<td class="text-tiny text-primary text-bold" colspan="1">Total </td>

		<td class="text-tiny text-right text-primary text-bold">${localCustomerToday.toLocaleString('en-BD', {
			maximumFractionDigits: 2
		})}</td>
		<td class="text-tiny text-right text-primary text-bold">${localCustomerYday.toLocaleString('en-BD', {
			maximumFractionDigits: 2
		})}</td>
	  </tr>`
		// turning INTO ARRAY
		local_mphone = local_mphone.split(',')
		loacl_cc = loacl_cc.split(',')
		loacl_cy = loacl_cy.split(',')

		local_mphone.sort()

		new Chart('customerChart', {
			type: 'bar',
			data: {
				labels: local_mphone,
				datasets: [
					{
						data: loacl_cc,
						label: 'Today',
						backgroundColor: '#288bfc'
					},
					{
						data: loacl_cy,
						label: 'Yesterday',
						backgroundColor: '#859b97'
					}
				]
			},
			options: {
				legend: {
					display: true
				},
				title: {
					display: false,
					position: 'top',
					text: 'Customer Balance'
				}
			}
		})
	})
	// document.getElementById('loading').remove()
}
/*





*/
const balancePerformance = async () => {
	let hour = []
	let today = []
	let yesterday = []

	/* Post request body content*/
	const url = `${apiserver}/balancePerformance`
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		/*Contracting a string with , to separate value*/
		// payload.map(({ HOUR, TDR, TCR, PDR, PCR }) => {
		payload.map(({ PTIME, CDAY, YDAY }) => {
			hour += `${PTIME},`
			today += `${CDAY},`
			yesterday += `${YDAY},`
		})

		// turning INTO ARRAY
		hour = hour.split(',')
		today = today.split(',')
		yesterday = yesterday.split(',')
		moment(hour).format('T')

		new Chart('dailydrcr', {
			type: 'line',

			data: {
				labels: hour,

				datasets: [
					{
						data: today,
						// label: 'Today DR',
						borderColor: '#288bfc',
						backgroundColor: '#288bfc40',
						label: 'Today',
						fill: true
					},
					{
						data: yesterday,
						label: 'Yesterday',
						// borderColor: '#0e3150',
						borderColor: '#859b97',
						// backgroundColor: '#0e315040',
						backgroundColor: '#859b9740',
						fill: true
					}
				]
			},
			options: {
				legend: {
					display: true
				},
				title: {
					display: false,
					position: 'top',
					text: 'Customer Balance'
				}
			}
		})
	})
}

const openModel = () => {
	document.getElementById('homeModel').classList.add('active')
}
const closeModel = () => {
	document.getElementById('homeModel').classList.remove('active')
}

/******************************************************************************************
*							
*
									Indiviual Agent balance chart
*
*
*******************************************************************************************/

const agentBalancePerformance = async (mphone) => {
	openModel()
	let local_DAY = []
	let loacl_DR = []
	let loacl_CR = []
	/* Post request body content*/
	const url = `${apiserver}/agentBalancePerformance`
	const raw = JSON.stringify({ key: `${mphone}` })
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map(({ DAY, DR, CR }) => {
			local_DAY += `${DAY},`
			loacl_DR += `${DR.toFixed(2)},`
			loacl_CR += `${CR.toFixed(2)},`
		})

		// turning INTO ARRAY
		local_DAY = local_DAY.split(',')
		loacl_DR = loacl_DR.split(',')
		loacl_CR = loacl_CR.split(',')

		new Chart('dailydrcragent', {
			type: 'line',
			data: {
				labels: days,
				datasets: [
					{
						data: dr,
						label: 'DR',
						borderColor: '#288bfc',
						fill: false
					},
					{
						data: cr,
						label: 'CR',
						borderColor: '#859b97',
						fill: false
					}
				]
			},
			options: {
				legend: {
					display: true
				},
				title: {
					display: false,
					position: 'top',
					text: 'Agent Balance'
				}
			}
		})
	})
}

/******************************************************************************************
*							
*
									Timer Widget code 
*
*
*******************************************************************************************/

const timer = () => {
	let now = new Date()
	let hour = now.getHours()
	hour = hour * 60
	let minute = now.getMinutes()
	let remaintime = hour + minute - 540

	if (remaintime > 960 - 540) {
		document.getElementById('remainer').setAttribute('value', remaintime)
		document.getElementById('remainer-text').classList.remove('text-primary')
		document.getElementById('remainer-body').classList.add('bg-warning')
		document.getElementById('remainer-text').textContent = 'Transaction time over'
	}
	// if (remaintime > 1020 - 540) {
	if (remaintime > 990 - 540) {
		document.getElementById('remainer').setAttribute('value', remaintime)
		document.getElementById('remainer-text').classList.remove('text-primary')
		document.getElementById('remainer-body').classList.add('bg-error')
		document.getElementById('remainer-text').textContent = 'System Ready to Day Close'
	} else {
		document.getElementById('remainer').setAttribute('value', remaintime)
	}
}

/******************************************************************************************
*							
*
									Function Init
*
*/

const owner = document.currentScript.getAttribute('param')
/* Timeer Function*/
timer()
/* Timeer Function*/
pichat(owner)
/* Function replaced*/
// dailydrcr()
/* Agent Status Function*/
agentstatus(owner)

/* Balance Comparidun Function*/
balancePerformance()
/* 
Customer calling
! Always buttom
*/
customerstatus(owner)
setInterval(function() {
	location.reload()
}, 780000)
