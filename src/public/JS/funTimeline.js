/*api server url is in environment file*/
//const apiserver = '/api/'
/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

const timeline = async () => {
	const url = `${apiserver}/timeline`

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}
	try {
		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			if (payload === null) {
				document.getElementById('timeline').innerHTML = `
			<tr>
			<td colspan="14"> No Data Found!</td>
			
			</tr>`
			} else {
				payload.map(
					(
						{
							TRANS_NO,
							TRANS_DATE,
							TRANS_FROM,
							TRANS_TO,
							REF_PHONE,
							PAY_AMT,
							MERCHANT_SNAME,
							PARTICULAR,
							FROM_GL,
							TO_GL
						},
						index
					) => {
						while (index > 1000) {
							const mytable = document.getElementById('timeline')
							let newRow = document.createElement('tr')
							let cell = document.createElement('td')
							cell.classList.add('text-tiny')
							cell.classList.add('text-clip')
							newRow.appendChild(cell)
							cell.innerText = moment(TRANS_DATE).startOf('minute').fromNow()

							cell = document.createElement('td')
							// cell.classList.add('text-tiny')
							let btn = document.createElement('button')
							btn.classList.add('btn')
							btn.classList.add('btn-link')
							btn.classList.add('text-tiny')
							btn.onclick = function() {
								model(TRANS_NO)
							}
							btn.innerText = TRANS_NO
							cell.appendChild(btn)
							newRow.appendChild(cell)
							// cell.innerText = TRANS_NO

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = TRANS_FROM

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = FROM_GL

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = TRANS_TO

							cell = document.createElement('td')
							cell.classList.add('text-tiny')

							newRow.appendChild(cell)
							cell.innerText = TO_GL

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = PAY_AMT.toLocaleString('en-BD', {
								maximumFractionDigits: 2,
								style: 'currency',
								currency: 'BDT'
							})

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = MERCHANT_SNAME

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = REF_PHONE

							cell = document.createElement('td')
							cell.classList.add('text-tiny')
							newRow.appendChild(cell)
							cell.innerText = PARTICULAR
							mytable.appendChild(newRow)
						}
					}
				)
			}
		})
	} catch (e) {
		document.getElementById('timeline').innerHTML = `
	<tr>
	<td colspan="14"> Error! <br/> Massage: ${e}</td>
	
	</tr>`
	}
	document.getElementById('loading').remove()
}

timeline()

const model = async (trno) => {
	const url = `${apiserver}trsearch`
	const raw = JSON.stringify({
		key: `${trno}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		document.getElementById('output').innerHTML = payload
			.map((data) => {
				const {
					TRANS_NO,
					TRANS_DATE,
					TRANS_FROM,
					FROM_AC_TYPE_CODE,
					FROM_GL,
					FROM_GL_NAME,
					TRANS_TO,
					TO_AC_TYPE_CODE,
					TO_GL,
					TO_GL_NAME,
					ENTRY_USER,
					ENTRY_DATE,
					CHECK_USER,
					CHECK_DATE,
					UPDATE_USER,
					UPDATE_DATE,
					PAY_AMT,
					MSG_AMT,
					SCHARGE_AMT,
					VAT_AMT,
					BILLNO,
					REF_PHONE,
					MERCHANT_SNAME,
					PARTICULAR,
					CODE,
					HOTKEY,
					NOTE
				} = data

				return `<div class="modal-header">
				<a onclick="closeModel()" class="btn btn-link float-right" aria-label="Close"><i class="material-icons">close</i></a>
				<a onclick="printArea()" class="btn btn-link float-right"><i class="material-icons">print</i></a>
	<div id="modal-title" class="modal-title text-primary h5">${TRANS_NO}</div>
	</div>
	<div class="modal-body">
	<div class="content">
	<h6 class="text-primary h6">Transaction Info</h6>
		<p>
		<b>Transaction No:</b> ${TRANS_NO}<br/>
		<b>Account:</b> ${TRANS_FROM} <i class="icon icon-forward"></i> ${TRANS_TO}<br/>
		<b>Account Type:</b> ${FROM_AC_TYPE_CODE} <i class="icon icon-forward"></i> ${TO_AC_TYPE_CODE}<br/>
		<b>Genaral Ledger:</b> ${FROM_GL} <i class="icon icon-forward"></i> ${TO_GL}<br/>
		<b>Genaral Ledger No:</b> ${FROM_GL_NAME} <i class="icon icon-forward"></i> ${TO_GL_NAME}<br/>
		</p>
		<h6 class="text-primary h6">Amount</h6>
		<p>
		<b>Total Amount:</b> ${PAY_AMT.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}<br/>
		<b>Amount:</b> ${MSG_AMT.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}<br/>
		<b>Charge:</b> ${SCHARGE_AMT.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}<br/>
		<b>Vat:</b> ${VAT_AMT.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}<br/>
		</p>
		<h6 class="text-primary h6">Authorization</h6>
		<p>
		<b>Entry User:</b> From: ${ENTRY_USER} At: ${moment(ENTRY_DATE).format('MMMM Do YYYY, h:mm:ss a')}<br/>
		<b>Checker User:</b> From: ${CHECK_USER} At: ${moment(CHECK_DATE).format('MMMM Do YYYY, h:mm:ss a')}<br/>
		<b>Approved User:</b> From: ${UPDATE_USER} At: ${moment(UPDATE_DATE).format('MMMM Do YYYY, h:mm:ss a')}<br/>
		</p>
		<h6 class="text-primary h6">Massage</h6>
		<p>
		<b>Bill No:</b> ${BILLNO} <br/>
		<b>Particular:</b> ${PARTICULAR} <br/>
		<b>Note:</b> ${NOTE} <br/>
		</p>
		<h6 class="text-primary h6">Info</h6>
		<p>
		<b>Agent:</b> ${REF_PHONE} <br/>
		<b>Merchant:</b> ${MERCHANT_SNAME} <br/>
		<b>Tr Code:</b> ${CODE} <br/>
		<b>Hotkey:</b> ${HOTKEY} <br/>
		</p>

	</div>
</div>
<div class="modal-footer">
<h6>Date: ${moment(TRANS_DATE).format('MMMM Do YYYY, h:mm:ss a')}</h6>
</div>`
			})
			.join('')
		document.getElementById('modal-id').classList.add('active')
	})
}
const closeModel = () => {
	document.getElementById('modal-id').classList.remove('active')
	// location.reload()
}

// search function for contact
const search = () => {
	let input, UpperCasefilter, table, tr, td, i, txtValue
	input = document.getElementById('search')
	UpperCasefilter = input.value.toUpperCase()
	table = document.getElementById('timeline')
	tr = table.getElementsByTagName('tr')
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName('td')[1]

		if (td) {
			txtValue = td.textContent || td.innerText
			if (txtValue.toUpperCase().indexOf(UpperCasefilter) > -1) {
				tr[i].style.display = ''
			} else {
				tr[i].style.display = 'none'
			}
		}
	}
}
