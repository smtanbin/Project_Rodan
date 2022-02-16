// /*api server url is in environment file*/
// require('dotenv').config()
// const apiserver = process.env.apiurl
/*api server url is in environment file*/
const apiserver = '/api/'

/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')
// myHeaders.append('Access-Control-Allow-Origin', '*')

/* This function get the PBS list from database 
It connect via url which request recived by routes/index as rest Get request
Then it call api_utilitybill from apps folder.
*/
const remittancehouselist = async () => {
	const url = `${apiserver}/remittancehouselist`

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const { NAME_OF_MTC } = data
			document.getElementById('list').innerHTML += `<option value="${NAME_OF_MTC}">${NAME_OF_MTC}</option>`
		})
	})
}
//auto function calling
remittancehouselist()

/* Printing Dialog and window genarated by this function. 
Remember: #output must be loaded
*/

/* This function get the PBS statment base on key value from database 
It connect via url which request recived by routes/index as rest Post request
Then it call api_utilitybill from apps folder.
*/
const remittance = async () => {
	/*Constracting Url*/

	const key = document.getElementById('list').value
	let fromdate = document.getElementById('fromdate').value
	let todate = document.getElementById('todate').value
	const printday = Date()

	/*Current date & time*/
	if (fromdate === null || fromdate === '') {
		fromdate = printday
	}
	if (todate === null || todate === '') {
		todate = printday
	}

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	/* Post request body content*/
	const url = `${apiserver}/remittance`
	const raw = JSON.stringify({
		key: `${key}`,
		fromdate: `${fromdate}`,
		todate: `${todate}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	let AMOUNT_REMITTED_BDT_TOTAL = 0
	let AMOUNT_OF_INCENTIVE_BDT_TOTAL = 0
	document.getElementById('output').innerHTML = `<div class="col-12 p-2 container m-2">

	<h5 class="p-centered text-center text-bold my-2 h5">Remittance Report</h5>
			 <p class="text-tiny">			
			 <b>From :</b> ${moment(fromdate).format('LLL')} <b>To :</b> ${moment(todate).format('LLL')}</p>
                    <table class="table table-striped table-cluster">
                        <thead>
                            <tr>
							<th class="text-tiny">SL</th>
							<th class="text-tiny">Name of Exchange House</th>
                                <th class="text-tiny">Ref.No./TT NO</th>
                                <th class="text-tiny">Date of Orginating Remittance</th>
                                <th class="text-tiny">Name</th>
                                <th class="text-tiny">Document Type</th>
                                <th class="text-tiny">NID/PASSPORT NO.</th>
                                
                                <th class="text-tiny">Sender Name</th>
                                <th class="text-tiny">Source Country</th>
                                <th class="text-tiny text-right">Amount Remitted</th>
                                <th class="text-tiny text-right">Amount of Incentive</th>
                                <th class="text-tiny">Date of Payment of Incentive</th>
                                <th class="text-tiny">Comments</th>
                                
                  
                            </tr>
                        </thead>
                        <tbody class="" id="output2"></tbody>
						
                    </table>

                </div>
                </div>`
	// try {
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		console.log(payload)
		if (payload === null) {
			document.getElementById('output2').innerHTML = `<tr>
				<td class="text-tiny text-break" colspan="9">Null Found</td>
				</tr>`
		} else {
			document.getElementById('output2').innerHTML = payload
				.map(
					(
						{
							NAME_OF_EXCHANGE_HOUSE,
							RefNo_TT_NO,
							DATE_OF_ORGINATING_REMITTANCE,
							NAME,
							DOCUMENT_TYPE,
							NID_NO_PASSPORT_NO,
							SENDER_NAME,
							SOURCE_COUNTRY,
							AMOUNT_REMITTED_BDT,
							AMOUNT_OF_INCENTIVE_BDT,
							DATE_OF_PAYMENT_OF_INCENTIVE,
							COMMENTS
						},
						index
					) => {
						/* Calculatation*/
						AMOUNT_REMITTED_BDT_TOTAL += AMOUNT_REMITTED_BDT
						AMOUNT_OF_INCENTIVE_BDT_TOTAL += AMOUNT_OF_INCENTIVE_BDT

						return `<tr>
						<td>${index + 1}</td>
						<td class="text-tiny text-break">${NAME_OF_EXCHANGE_HOUSE}</td>
						<td class="text-tiny text-break">${RefNo_TT_NO}</td>
						<td class="text-tiny text-break">${DATE_OF_ORGINATING_REMITTANCE}</td>
						<td class="text-tiny">${NAME}</td>
						<td class="text-tiny">${DOCUMENT_TYPE}</td>
						<td class="text-tiny">${NID_NO_PASSPORT_NO}</td>
						<td class="text-tiny">${SENDER_NAME}</td>
						<td class="text-tiny">${SOURCE_COUNTRY}</td>
						<td class="text-tiny text-right">${AMOUNT_REMITTED_BDT.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})}</td>
						<td class="text-tiny text-right">${AMOUNT_OF_INCENTIVE_BDT.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})}</td>
						<td class="text-tiny">${DATE_OF_PAYMENT_OF_INCENTIVE}</td>
						<td class="text-tiny">${COMMENTS}</td>
					 </tr>`
					}
				)
				.join('')
		}
	})
	/* for table footer*/
	document.getElementById('output2').innerHTML += `
		<tr class="active text-bold" id="output3">
		<td class="text-bold" colspan="9">Total</td>
		<td class="text-bold text-right">${AMOUNT_REMITTED_BDT_TOTAL.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		<td class="text-bold text-right">${AMOUNT_OF_INCENTIVE_BDT_TOTAL.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		<td class="text-bold" colspan="2"></td>
		</tr>`

	// printArea()
	document.getElementById('btn-print').classList.remove('disabled')
	// } catch (e) {

	// 	document.getElementById('output').innerHTML = `<div class="empty col-12 w100">

	// 	<p class="empty-title h2 text-error">Stop Code 404</p>
	// 	<p class="empty-subtitle">${e}</p>

	//   </div>`
	// }
}
const remittancesummary = async () => {
	/*Constracting Url*/
	let fromdate = document.getElementById('fromdate').value
	let todate = document.getElementById('todate').value
	let totalremi = 0
	let tremino = 0

	let tincno = 0
	let totalinc = 0
	const printday = Date()
	var date = new Date()

	/*Current date & time*/
	if (fromdate === null || fromdate === '') {
		fromdate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
	}
	if (todate === null || todate === '') {
		todate = new Date(date.getFullYear(), date.getMonth(), 0)
	}

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	/* Post request body content*/
	const url = `${apiserver}/remittancesummary`
	const raw = JSON.stringify({
		fromdate: `${fromdate}`,
		todate: `${todate}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	document.getElementById('output').innerHTML = `<div class="col-12 p-2 container m-2">

	<h5 class="p-centered h5 text-center text-bold my-2">Remittance Summary Report</h5>
			 <p class="text-tiny">		
			 <b>From :</b> ${moment(fromdate).format('LLL')} <b>To :</b> ${moment(todate).format('LLL')}</p>
                    <table class="table table-striped table-cluster">
                        <thead>
                            <tr>
							<th class="text-tiny">Agent No</th>
							<th class="text-tiny">Agent Name</th>
							<th class="text-tiny">No Of Remittance</th>
							<th class="text-tiny text-right">Total Remittance Amount</th>
							<th class="text-tiny">No Of Incentive</th>
							<th class="text-tiny text-right">Total Incentive Amount</th>
                            </tr>
                        </thead>
                        <tbody class="" id="output2"></tbody>
						
                    </table>

                </div>
    </div>`
	// try {
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		console.log(payload)
		if (payload === null) {
			document.getElementById('output2').innerHTML = `<tr>
				<td class="text-tiny text-break" colspan="9">Null Found</td>
				</tr>`
		} else {
			document.getElementById('output2').innerHTML = payload
				.map(({ PMPHONE, NAME, REMITTANCE, REMINO, INCNO, INCE }) => {
					totalremi += REMITTANCE
					tremino += REMINO

					tincno += INCNO
					totalinc += INCE

					return `<tr>
						
					

						<td class="text-tiny">${PMPHONE}</td>
						<td class="text-tiny">${NAME}</td>
						<td class="text-tiny">${REMINO}</td>
						<td class="text-tiny text-right">${REMITTANCE.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})}</td>
						<td class="text-tiny">${INCNO}</td>
						<td class="text-tiny text-right">${INCE.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})}</td>

					 </tr>`
				})
				.join('')
		}
	})
	document.getElementById('output2').innerHTML += `<tr>
						
	<td class="text-bold" colspan="2">Total</td>
	<td class="text-tiny">${tremino}</td>
	<td class="text-tiny">${totalremi.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
	<td class="text-tiny">${tincno}</td>
	<td class="text-tiny">${totalinc.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>

 </tr>`

	document.getElementById('btn-print').classList.remove('disabled')
	// } catch (e) {

	// 	document.getElementById('output').innerHTML = `<div class="empty col-12 w100">

	// 	<p class="empty-title h2 text-error">Stop Code 404</p>
	// 	<p class="empty-subtitle">${e}</p>

	//   </div>`
	// }
}
