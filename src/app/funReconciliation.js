/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

const reconciliation = async () => {
	/* Post request body content*/
	const url = `${apiserver}/recon`

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	document.getElementById('output').innerHTML = `
	<div class="col-12 p-2 container m-2">
	<h5 class="p-centered text-center text-bold my-2 h5">Reconciliation Report</h5>
	
	<table class="table table-striped table-cluster">
	<thead>
	<tr>
	<th class="text-tiny">Sl</th>
	<th class="text-tiny">GL</th>
	<th class="text-tiny">GL Titel</th>
	<th class="text-tiny">CBS Balance</th>
	<th class="text-tiny">ABS Balance</th>
	<th class="text-tiny">Balance Difference</th>
	</tr>
	</thead>
	<tbody class="" id="tableoutput"></tbody>
	
	</table>
	</div>
	</div>`
	// <canvas id="chart" hight="5rem" width="5rem"></canvas>

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		let absbal_array = []
		let cbsbal_array = []
		let gl_array = []

		if (payload.lenth === 0) {
			document.getElementById('output').innerHTML = `<div class="empty">
			<div class="empty-icon"><i class="icon icon-stop"></i></div><p class="empty-title h5">No Data Found</p></div>`
		} else {
			payload.sort()
			let absbal = 0
			let cbsbal = 0

			document.getElementById('tableoutput').innerHTML = payload
				.map(
					({ ACCTCODE, COA_DESC, CBSGL, ABSGL, DIF }, index) => {

						let differclass = 'text-success'
						if (DIF < 0) {
							differclass = 'text-error'
						}
						absbal += CBSGL
						cbsbal += ABSGL
						// absbal_array += `${CBSGL.toFixed(2)},`
						// cbsbal_array += `${ABSGL.toFixed(2)},`
						// gl_array += `${COA_DESC}`
						return `<tr>
						<td class="text-tiny text-break">${index + 1}</td>
						<td class="text-tiny text-break">${ACCTCODE}</td>
						<td class="text-tiny text-break">${COA_DESC}</td>
						<td class="text-tiny text-break">${CBSGL.toLocaleString('en-BD', {
							maximumFractionDigits: 4
						})}</td>
						<td class="text-tiny text-break">${ABSGL.toLocaleString('en-BD', {
							maximumFractionDigits: 4
						})}</td>
						<td class="text-tiny text-break ${differclass}">${DIF.toLocaleString('en-BD', {
							maximumFractionDigits: 4
						})}</td>
					 </tr>`
					}

				)
				.join('')
			// document.getElementById('tableoutput').innerHTML += `<tr>
			// 	<td colspan="3" class="text-tiny text-bold">Total</td>
			// 	<td class="text-tiny text-bold">${absbal.toLocaleString('en-BD', {
			// 	maximumFractionDigits: 4
			// })}</td>

			// 			<td class="text-tiny text-bold">${cbsbal.toLocaleString('en-BD', {
			// 	maximumFractionDigits: 4
			// })}</td>
			// 	<td class="text-tiny text-bold">${(absbal - cbsbal)}</td>
			// 	</tr>`

			// absbal_array = absbal_array.split(',')
			// cbsbal_array = cbsbal_array.split(',')
			// gl_array = gl_array.split(',')
			// new Chart('chart', {
			// 	type: 'line',

			// 	data: {
			// 		labels: gl_array,

			// 		datasets: [
			// 			{
			// 				data: absbal_array,

			// 				borderColor: '#288bfc',
			// 				backgroundColor: '#288bfc40',
			// 				label: 'ABS',
			// 				fill: true
			// 			},
			// 			{
			// 				data: cbsbal_array,
			// 				label: 'CBS',
			// 				// borderColor: '#0e3150',
			// 				borderColor: '#859b97',
			// 				// backgroundColor: '#0e315040',
			// 				backgroundColor: '#859b9740',
			// 				fill: true
			// 			}
			// 		]
			// 	},
			// 	options: {
			// 		legend: {
			// 			display: true
			// 		},
			// 		title: {
			// 			display: true,
			// 			position: 'top',
			// 			text: 'Reconciliation Report'
			// 		}
			// 	}
			// })

		}
	})

}
reconciliation()
setInterval(() => {
	reconciliation()
}, 60000)