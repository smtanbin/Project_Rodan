const utilityinfosummary = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/utilityinfosummary`
	let fromdate = document.getElementById('fromdate').value
	let todate = document.getElementById('todate').value
	let acno = document.getElementById('acno').value
	console.log(fromdate)
	console.log(todate)
	console.log(acno)

	let printday = Date()
	document.getElementById('printday').innerHTML = printday
	// request
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		acno: `${acno}`,
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

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const {
				REG_DATE,
				REG_STATUS,
				AUTHO_BY,
				UPDATE_BY,
				UPDATE_DATE,
				STATUS,
				CATEGORY,
				AC_TYPE_CODE,
				MPHONE,
				AGENT,
				AGENTAC,
				BALANCE,
				LIEN_M,
				NAME,
				IMGAE,
				FATHER_NAME,
				MOTHER_NAME,
				SPOUSE_NAME,
				DATE_OF_BIRTH,
				SIM_NO,
				TIN_NO,
				RELIGION
			} = data

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
											<th>Bill Date</th>
											<th>No Of Bill</th>
											<th>Net Bill</th>
											<th>Vat/th>
											<th>Rev.Stamp</th>
											<th>Total
											</th>
										</tr>
									</thead>
									<tbody>
										<tr class="active">
											<td>The Shawshank Redemption</td>
											<td>Crime, Drama</td>
											<td>14 October 1994</td>
											<td>The Shawshank Redemption</td>
											<td>Crime, Drama</td>
											<td>14 October 1994</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>



`
		})
	})
}
