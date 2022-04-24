// /*api server url is in environment file*/
// require('dotenv').config()
// const apiserver = process.env.apiurl
/*api server url is in environment file*/
//const apiserver = '/api/'

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
//auto function calling can be find in esfile

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
	document.getElementById('output').innerHTML = `
	<div class="col-12 p-2 container m-2">
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
                                <th class="text-tiny">Doc Type</th>
                                <th class="text-tiny">Photo ID No</th>
                                <th class="text-tiny">Sender Name</th>
                                <th class="text-tiny">Source Country</th>
                                <th class="text-tiny text-right">Amount </th>
                                <th class="text-tiny text-center">Date of Payment of Incentive</th>
                                <th class="text-tiny text-right">Amount of Incentive</th>
                            </tr>
                        </thead>
                        <tbody class="" id="output2"></tbody>
			
                    </table>
                </div>
                </div>`
	// try {
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
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
							DATE_OF_PAYMENT_OF_INCENTIVE
						},
						index
					) => {
						/* Calculatation*/
						AMOUNT_REMITTED_BDT_TOTAL += AMOUNT_REMITTED_BDT
						AMOUNT_OF_INCENTIVE_BDT_TOTAL += AMOUNT_OF_INCENTIVE_BDT
						if (AMOUNT_OF_INCENTIVE_BDT === 0) {
							AMOUNT_OF_INCENTIVE_BDT = ' '
							DATE_OF_PAYMENT_OF_INCENTIVE = ' '
						} else {
							DATE_OF_PAYMENT_OF_INCENTIVE = moment(DATE_OF_PAYMENT_OF_INCENTIVE).format('ll')
						}

						return `<tr>
						<td>${index + 1}</td>
						<td class="text-tiny text-break">${NAME_OF_EXCHANGE_HOUSE}</td>
						<td class="text-tiny text-break">${RefNo_TT_NO}</td>
						
						<td class="text-tiny text-break">${moment(DATE_OF_ORGINATING_REMITTANCE).format('ll')}</td>
						<td class="text-tiny">${NAME}</td>
						<td class="text-tiny">${DOCUMENT_TYPE}</td>
						<td class="text-tiny">${NID_NO_PASSPORT_NO}</td>
						<td class="text-tiny">${SENDER_NAME}</td>
						<td class="text-tiny">${SOURCE_COUNTRY}</td>
						<td class="text-tiny text-right">${AMOUNT_REMITTED_BDT.toLocaleString('en-BD', {
							maximumFractionDigits: 2
						})}</td>
						<td class="text-tiny text-center">${DATE_OF_PAYMENT_OF_INCENTIVE}</td>
						<td class="text-tiny text-right">${AMOUNT_OF_INCENTIVE_BDT.toLocaleString('en-BD', {
							maximumFractionDigits: 2
						})}</td>
						
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
		<td class="text-bold text-tiny text-right">${AMOUNT_REMITTED_BDT_TOTAL.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
		<td class="text-bold" colspan="1"></td>
		<td class="text-bold text-tiny text-right">${AMOUNT_OF_INCENTIVE_BDT_TOTAL.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
		
		</tr>`

	document.getElementById('btn-print').classList.remove('disabled')
	// document.getElementById('btn-csv').classList.remove('disabled')
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

const getCSV = async () => {
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
	try {
		/* Requesting part start here. */

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

		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			const download = new CSVExport(payload)
			return false
		})
	} catch (e) {
		document.getElementById('output').innerHTML = `<div class="empty">
		<div class="empty-icon w100">
		</div>
		<p class="empty-title h5 text-error">Error!</p>
		<p class="empty-subtitle">Process stop with a error</p>
		<div class="empty-action">
	${e}
		</div>
	  </div>`
	}
}

const showRequest = async () => {
	const url = `${apiserver}/remittanceRequest`

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload.length === 0) {
			document.getElementById('output').innerHTML = `<div class="empty">
			<div class="empty-icon">
			  <i class="icon icon-people"></i>
			</div>
			<p class="empty-title h5">You have no new request</p>
			
			<div class="empty-action">
		
			</div>
		  </div>`
		} else {
			payload.map(
				(
					{
						REM_ID,
						REM_TT_NO,
						NAME_OF_MTC,
						BEN_NAME,
						REC_AGENT_ACC,
						ENTRY_DATE,
						SEN_REM_AMT,
						STATUS,
						COMMENTS
					},
					index
				) => {
					let styleclass = 'text-primary'
					if (STATUS === 'P') {
						styleclass = 'text-success'
					}
					document.getElementById('troutput').innerHTML += `<tr onclick="remittancedtl('${REM_ID}')">
						<td class="text-tiny text-break">${REM_ID}</td>
						<td class="text-tiny text-break">${moment(ENTRY_DATE).startOf('minute').fromNow()}</td>
						<td class="text-tiny text-break">${REC_AGENT_ACC}</td>
						<td class="text-tiny text-break">${REM_TT_NO}</td>
						<td class="text-tiny text-break">${NAME_OF_MTC}</td>
						<td class="text-tiny text-break">${BEN_NAME}</td>
						<td class="text-tiny text-break">${SEN_REM_AMT.toLocaleString('en-BD', {
						maximumFractionDigits: 2
					})}</td>
						<td class="text-tiny ${styleclass} text-break">${COMMENTS}</td>
						</tr>`
				}
			)
			document.getElementById('table').classList.remove('d-none')
			document.getElementById('progress').remove()
		}
	})
}

const remittancedtl = async (param) => {
	document.getElementById('modal-id').classList.add('active')
	const url = `${apiserver}/getRequest`

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
		payload.map(
			(
				{
					REM_TT_NO,
					NAME_OF_MTC,
					BEN_NAME,
					ENTRY_DATE,
					SEN_REM_AMT,
					BEN_FATH_HB_NAME,
					BEN_MOTHER_NAME,
					BEN_ADDRESS,
					BEN_ACC_NO,
					BEN_PHOTO_ID,
					BEN_DOB,
					BEN_PURPOSE_TR,
					BEN_PHONE_NO,
					BEN_MOBILE_NO,
					RELATION_WITH_SENDER,
					SEN_NAME,
					SEN_CONTACT_NO,
					SEN_COUNTRY_ORGIN,
					REC_AGENT_ACC,
					REMARKS,
					SENDER_ID,
					SENDER_ADDRESS,
					INCENT_PERCENT,
					PIN_S_CODE,
					INCEN_AMT
				},
				index
			) => {
				document.getElementById('modal-container').innerHTML = `
				<div class="modal-header">
				<a onclick="closeModel()" class="btn btn-clear float-right" aria-label="Close"></a>
					
					<div class="modal-title h3 text-bold text-primary">
					${NAME_OF_MTC}
					</div>
					
					<div class="flexing-model">
						<div class="card-subtitle text-gray">
						<h4 class="h4 text-dark">Secreat Pin : ${PIN_S_CODE}</h4>
						Document No: ${REM_TT_NO}
						</div>
						<div class="card-subtitle text-secondary">
						${moment(ENTRY_DATE).startOf('minute').fromNow()}
						</div>
					</div>
				</div>

				<div class="modal-body">
					<div class="content flexing-model">
						<div class="card noboder">
							<div class="card-header">
	  							<div class="card-title text-primary h5">Reciver Information</div>
							</div>
						<div class="card-body">
	  						<b>Name :</b> ${BEN_NAME}<br/>
	  						<b>Father Name:</b> ${BEN_FATH_HB_NAME}<br/>
	  						<b>Mother Name:</b> ${BEN_MOTHER_NAME}<br/>
	  						<b>Address:</b> ${BEN_ADDRESS}<br/>
	  						<b>PhotoID No:</b> ${BEN_PHOTO_ID}<b class="ml-2">Date of Birth:</b> ${moment(BEN_DOB).format('ll')} <br/>
	  						<b>Account No:</b> ${BEN_ACC_NO}  <b>Contact:</b> ${BEN_PHONE_NO}<br/>
	  						<b>Purpose of Remittance:</b> ${BEN_PURPOSE_TR}<br/>
	  						<b>Relationship:</b> ${RELATION_WITH_SENDER}<br/>
	  						
						</div>
					</div>
					<div class="card noboder">
  						<div class="card-header">
    						<div class="card-title text-primary h5">Sender Information</div>
  						</div>
  						<div class="card-body">
  							<b>Name :</b> ${SEN_NAME}<br/>
  							<b>PhotoID No:</b> ${SENDER_ID}<b class="ml-2">Date of Birth:</b> ${BEN_DOB} <br/>
  							<b>Address:</b> ${SENDER_ADDRESS}<br/>
  							<b>Account No:</b> ${BEN_ACC_NO}  <b>Contact:</b> ${SEN_CONTACT_NO}<br/>
  							<b>Origin Country:</b> ${SEN_COUNTRY_ORGIN}<br/>
						</div>
					</div>
				</div>
				<div class="card noboder">
				<div class="card-header">
				  <div class="card-title text-primary h5">Payment Info</div>
				</div>
				<div class="card-body">
				<div class="input-group">
				<span class="input-group-addon addon-lg">Amount</span>
				<input type="text" class="form-input input-lg" placeholder="${SEN_REM_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2,
					style: 'currency',
					currency: 'BDT'
				})}">
				<div class="input-group">
				<span class="input-group-addon addon-lg">Bonus ${INCENT_PERCENT}% </span>
				<input type="text" class="form-input input-lg" placeholder="${INCEN_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2,
					style: 'currency',
					currency: 'BDT'
				})}">
				</div>
				</div><br/>
				<b>OTP No:</b> ${BEN_MOBILE_NO}<br/>
				<b>Agent:</b> ${REC_AGENT_ACC}<br/>
				<b>Remarks:</b> ${REMARKS}<br/>

					
			
		  </div>
			
			<div class="modal-footer col-6">
				<div class="btn-group btn-group-block">
  					<button class="btn btn-success">Approved</button>
  					<button class="btn">Back to Sender</button>
  					<button class="btn btn-error">Reject</button>
				</div> 
			</div>`
			}
		)
	})
}
const closeModel = () => {
	document.getElementById('modal-id').classList.remove('active')
}
