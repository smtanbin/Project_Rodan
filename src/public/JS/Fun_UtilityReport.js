const getuvanls = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/uvanls`
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		ID: 'autho'
	})
	console.log(raw)
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const { TRANS_SNAME } = data
			document.getElementById('uvanls').innerHTML += `<option value="${TRANS_SNAME}">${TRANS_SNAME}</option>`
		})
	})
}
getuvanls()
const utilityinfosummary = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/utilityinfosummary`
	const uvanls = document.getElementById('uvanls')
	let id = uvanls.value

	// request
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		key: `${id}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}
	document.getElementById('output').innerHTML += `


	<!-- grid nesting example -->
	<div class="card col-12 p-2">
		<div class="p-2">
			<div class="container">
				<div class="columns col-sm-12">
					<div class="columns col-12">
						<h2 class="p-centered">Standard Bank Limited</h2>
					</div>
					<div class="columns col-12">
						<h4 class="p-centered">Agent Banking Division</h4>
					</div>
					<div class="columns col-sm-12">
						<p>Summery of Electricity Bill Colllection Report : ${acno}</p>
					</div>

					<div class="columns col-12">
						<div class="columns col-6 float-left">
							Date: From ${fromdate} To ${todate}
						</div>
						<div class="columns col-6 float-righ">
							Print Date: ${printday}
						</div>
					</div>

					<div class="columns col-12">
						<table class="table">
							<thead>
								<tr>
									<th>Date</th>
									<th>Trans NO</th>
									<th>Total</th>
									<th>Net Bill</th>
									<th>Vat/th>
									<th>Rev.Stamp</th>
									<th>ACNO</th>
									<th>Book No</th>
									<th>Month</th>
								</tr>
							</thead><tbody id="output2"></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>`
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const { ENTRY_DATE, TRANS_NO, TRANS_AMT, VAT_AMT, STAMP_AMT, ACNO, BOOKNO, MONTH } = data
			document.getElementById('output2').innerHTML += `
							
								<tr class="active">
									<td>${ENTRY_DATE}</td>
									<td>${TRANS_NO}</td>
									<td>${TRANS_AMT}</td>
									<td>${VAT_AMT}</td>
									<td>${STAMP_AMT}</td>
									<td>${ACNO}</td>
									<td>${BOOKNO}</td>
									<td>${MONTH}</td>
								</tr>
							`
		})
	})
}
