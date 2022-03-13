const businessinfo = async () => {
	document.getElementById('btn-loading').classList.add('loading')
	// document.getElementById('output').style.display = 'none'
	document.getElementById('output').innerHTML = `
	<div id="note" class="card w100 m-2 p-2 col-12">
	
	</div>
	
	<table id="pageTable" class="w100 p-1 table table-striped table-hover table-cluster">
	<thead>
	  <tr>
	  <th>SL</th>
	  <th>Account No</th>
	  <th>Agent</th>
	  <th>Title</th>

	  <th>DOB</th>
	  <th>Gender</th>
	  <th>Balance</th>
	  </tr>
	</thead>
	<tbody id="tableOutput">
	</tbody>
  </table>
	`
	/*Constracting Url*/
	let frommonth = document.getElementById('frommonth').value
	let tomonth = document.getElementById('tomonth').value
	let keydata = document.getElementById('key').value
	/*Current date & time*/
	const printday = Date()
	var date = new Date()
	/*Current date & time*/
	if (keydata === null || keydata === '') {
		keydata = false
	}
	if (frommonth === null || frommonth === '') {
		frommonth = false
	} else {
		frommonth = `${frommonth}-01`
	}
	if (tomonth === null || tomonth === '') {
		tomonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
	} else {
		tomonth = `${tomonth}-01`
	}
	// console.log(month)

	/*api server url is in environment file*/
	const apiserver = '/api/'

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')
	myHeaders.append('Access-Control-Allow-Origin', '*')

	/* Post request body content*/
	const url = `${apiserver}/businessinfo`
	// previousmonth = moment(previousmonth).format('MMMM Do YYYY, h:mm:ss a')
	// console.log(previousmonth)
	// console.log(month)
	const raw = JSON.stringify({
		frommonth: `${frommonth}`,
		tomonth: `${tomonth}`,
		key: `${keydata}`
	})
	// key: `${key}`
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	let gender = ''
	let TotalMale = 0
	let TotalFemale = 0
	let TotalOther = 0
	let TotalBalance = 0
	let TotalMaleAmount = 0
	let TotalFemaleAmount = 0
	let TotalOtherAmount = 0
	let TotalAC = 1

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('output2').innerHTML = `<tr>
					<td class="text-tiny text-break" colspan="9">Null Found</td>
					</tr>`
		} else {
			payload.map(({ SIM_NO, BALANCE }, index) => {
				if (SIM_NO === 'M') {
					TotalMale += 1
					gender = 'Male'
					TotalMaleAmount += BALANCE
				}
				if (SIM_NO === 'F') {
					TotalFemale += 1
					gender = 'Female'
					TotalFemaleAmount += BALANCE
				}
				if (SIM_NO === 'O') {
					TotalOther += 1
					gender = 'Other'
					TotalOtherAmount += BALANCE
				}
				TotalBalance += BALANCE
				TotalAC = index
			})
			renderTable(payload)
			// document.getElementById('tableOutput').innerHTML = payload
			// 	.map(({ MPHONE, NAME, DOB, PMPHONE, SIM_NO, BALANCE }, index) => {
			// if (SIM_NO === 'M') {
			// 	TotalMale += 1
			// 	gender = 'Male'
			// 	TotalMaleAmount += BALANCE
			// }
			// if (SIM_NO === 'F') {
			// 	TotalFemale += 1
			// 	gender = 'Female'
			// 	TotalFemaleAmount += BALANCE
			// }
			// if (SIM_NO === 'O') {
			// 	TotalOther += 1
			// 	gender = 'Other'
			// 	TotalOtherAmount += BALANCE
			// }
			// TotalBalance += BALANCE
			// TotalAC = index
			// 	console.log(payload)
			// 	return `<tr>
			// 		<td class="text-tiny">${index + 1}</td>
			// 		<td class="text-tiny">${PMPHONE}</td>
			// 		<td class="text-tiny">${MPHONE}</td>
			// 		<td class="text-tiny">${NAME}</td>
			// 		<td class="text-tiny">${moment(DOB).format('ll')}</td>
			// 		<td class="text-tiny">${gender}</td>
			// 		<td class="text-tiny">${BALANCE.toLocaleString('en-BD', {
			// 			maximumFractionDigits: 2,
			// 			style: 'currency',
			// 			currency: 'BDT'
			// 		})}</td>
			// 		</tr>`
			// })
			// .join('')
			// 			document.getElementById('note').innerHTML = `

			//   <div class="columns">
			//   <div class="column">
			//   Total ACCOUNT = ${TotalAC + 1}<br/>
			//   Total Male = ${TotalMale} <br/>
			//   Total Female = ${TotalFemale} <br/>
			//   Total Other = ${TotalOther} <br/>
			//   </div>
			//   <div class="divider"></div>
			//   <div class="column">

			//   Total Male Deposit = ${TotalMaleAmount.toLocaleString('en-BD', {
			// 		maximumFractionDigits: 2,
			// 		style: 'currency',
			// 		currency: 'BDT'
			// 	})} <br/>
			//   Total Female Deposit = ${TotalFemaleAmount.toLocaleString('en-BD', {
			// 		maximumFractionDigits: 2,
			// 		style: 'currency',
			// 		currency: 'BDT'
			// 	})} <br/>
			//   Total Other Deposit = ${TotalOtherAmount.toLocaleString('en-BD', {
			// 		maximumFractionDigits: 2,
			// 		style: 'currency',
			// 		currency: 'BDT'
			// 	})} <br/>
			//   Total Balance = ${TotalBalance.toLocaleString('en-BD', {
			// 		maximumFractionDigits: 2,
			// 		style: 'currency',
			// 		currency: 'BDT'
			// 	})} <br/>
			//   </div>
			// </div>`
		}
	})
}
document.getElementById('btn-loading').classList.remove('loading')
document.getElementById('btnprint').classList.remove('disabled')
// document.getElementById('output').style.display = ''

const enablePreviousMonth = () => {
	const id = document.getElementById('frommonth')
	id.style.display = window.getComputedStyle(id).display === 'none' ? 'block' : 'none'
}

const renderTable = (payload) => {
	const mytable = document.getElementById('pageTable')
	payload.forEach((payload) => {
		let newRow = document.createElement('tr')
		Object.values(payload).forEach((value) => {
			let cell = document.createElement('td')
			cell.innerText = value
			newRow.appendChild(cell)
		})
		mytable.appendChild(newRow)
	})
}
