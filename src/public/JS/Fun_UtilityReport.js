const getuvanls = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/uvanls`
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		ID: 'autho'
	})
	// console.log(raw)
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
const utilityinfo = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url2 = `${apiserver}/utilityinfodtl`
	const uvanls = document.getElementById('uvanls')
	let key = uvanls.value
	let fromdate = document.getElementById('fromdate').value
	let todate = document.getElementById('todate').value
	let printday = Date()
	// request
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		key: `${key}`,
		from: `${fromdate}`,
		to: `${todate}`
	})
	console.log(raw)
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}
<<<<<<< HEAD
	let sl = 0
	let TRANS_AMT_TOTAL = 0
	let VAT_AMT_TOTAL = 0
	let STAMP_AMT_TOTAL = 0
	document.getElementById('output').innerHTML += `
=======
>>>>>>> 77cd0010920a8c1072f2571ae104bd9231fe57d9

	document.getElementById('output').innerHTML = `<!-- grid nesting example -->
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
						<p>Summery of Electricity Bill Colllection Report : ${key}</p>
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
								<tr><th>SL.</th>
									<th>Date</th>
									<th>Trans NO</th>
									<th>Net Bill</th>
									<th>Vat</th>
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

<<<<<<< HEAD
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
=======
	await fetch(url2, requestOptions).then((response) => response.json()).then((payload) => {
>>>>>>> 77cd0010920a8c1072f2571ae104bd9231fe57d9
		payload.map((data) => {
			const { ENTRY_DATE, TRANS_NO, TRANS_AMT, VAT_AMT, STAMP_AMT, ACNO, BOOKNO, MONTH } = data
			document.getElementById('output2').innerHTML += `
							
								<tr>
								<td>${sl}<td/>
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
			sl += 1
			TRANS_AMT_TOTAL = TRANS_AMT_TOTAL + TRANS_AMT
			VAT_AMT_TOTAL = VAT_AMT_TOTAL + VAT_AMT
			STAMP_AMT_TOTAL = STAMP_AMT_TOTAL + STAMP_AMT
		})
	})
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const { TRANS_AMT, VAT_AMT, STAMP_AMT } = data
			document.getElementById('output2').lastChild.innerHTML = `
							
								<tr class="active">
									<td>${sl}</td>
									<td></td>
									<td></td>
									<td>${TRANS_AMT}</td>
									<td>${VAT_AMT}</td>
									<td>${STAMP_AMT}</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							`
		})
	})
}
