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
const getuvanls = async () => {
	const url = `${apiserver}/utilityreportpbslist`

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
//auto function calling
getuvanls()

// const printArea = require(globalFunctik)

/* This function get the PBS statment base on key value from database 
It connect via url which request recived by routes/index as rest Post request
Then it call api_utilitybill from apps folder.
*/
const utilityinfo = async () => {
	document.getElementById('btn-loading').classList.add('loading')

	/*Constracting Url*/

	const key = document.getElementById('uvanls').value
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
	const urlhead = `${apiserver}/utilityinfohead`
	const rawhead = JSON.stringify({
		key: `${key}`,
		date: `${fromdate}`
	})

	const headrequestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: rawhead,
		redirect: 'follow'
	}
	/* Post request body content*/
	const urlbody = `${apiserver}/utilityinfodtl`
	const rawbody = JSON.stringify({
		key: `${key}`,
		fromdate: `${fromdate}`,
		todate: `${todate}`
	})

	const bodyrequestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: rawbody,
		redirect: 'follow'
	}

	/*This valus make the summary part.
    yes its made by by application.
    */
	/* Totals*/
	let TRANS_AMT_TOTAL = 0
	let VAT_AMT_TOTAL = 0
	let REVBAL_TOTAL = 0
	let VATBAL_TOTAL = 0
	let STAMP_COUNT = 0 //Stumps counter
	let STAMP_AMT_TOTAL = 0

	/* Prints Head portation 
    'output2' is responsiable for table printing.
    'billsummary' is for summery.utilityinfohead
    */

	try {
		await fetch(urlhead, headrequestOptions).then((response) => response.json()).then((payload) => {
			payload.map(({ TITEL, REVAC, VATAC, REVBAL, VATBAL, BILL_TITLE_1, BILL_TITLE_2, BILL_TITLE_3 }, index) => {
				REVBAL_TOTAL = REVBAL
				VATBAL_TOTAL = VATBAL
				document.getElementById('output').innerHTML = `
	<div class="col-12 p-2 container">
		<div class="p-2 p-centered text-center container">
            <h5 class="text-tiny my-2 p-centered w100 text-bold h5">Utility Colllection Report</h5>
            </div>
			<div class="columns px-2">
                <div class="column float-left text-tiny ">
                    <p><b>Marchent :</b> ${TITEL}<br />
					<b>Revenue Account:</b> ${REVAC}<br />
					<b>VAT Account :</b> ${VATAC}<br />
					
					<b>From :</b> ${moment(fromdate).format('LLL')} <br /><b>To :</b> ${moment(todate).format('LLL')}</p>
                </div>
                <div class="divider-vert">
                </div>
                <div class="column float-right text-tiny" id="billsummary"">
						<!-- Summery content content --> 
						</div>
					</div>
			</div>
			
			<div class=" columns col-12 card p-1">
                    <table class="table table-striped table-cluster">
                        <thead>
                            <tr>
							<th class="text-tiny">SL.</th>
                                <th class="text-tiny">Date</th>
                                <th class="text-tiny text-left">Trans NO</th>
                                <th class="text-tiny text-right text-ellipsis">Revenue</th>
                                <th class="text-tiny text-right">Vat</th>
                                <th class="text-tiny text-right">Stamp</th>
                                <th class="text-tiny text-right">Total</th>
                                <th class="text-tiny">${BILL_TITLE_1}</th>
                                <th class="text-tiny">${BILL_TITLE_2}</th>
                                <th class="text-tiny">${BILL_TITLE_3}</th>
                  
                            </tr>
                        </thead>
                        <tbody class="" id="output2"></tbody>
                    </table>
            </div>

        
    </div>`
			})
		})
	} catch (e) {
		document.getElementById('output').remove
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		
		<h4 class="empty-title h2 text-error">Stop Code 404</h4>
		<p class="empty-title h2 text-error">Fail to get Header</p>
		<p class="empty-subtitle">${e}</p>

	  </div>`
	}
	try {
		await fetch(urlbody, bodyrequestOptions).then((response) => response.json()).then((payload) => {
			if (payload === null) {
				document.getElementById('output2').innerHTML = `<tr>
				<td class="text-tiny text-break" colspan="9">No Bill Found</td>
				</tr>`
			} else {
				document.getElementById('output2').innerHTML = payload
					.map(({ ENTRY_DATE, TRANS_NO, TRANS_AMT, VAT_AMT, STAMP_AMT, ACNO, BOOKNO, MONTH }, index) => {
						/* Calculatation*/
						TRANS_AMT_TOTAL += TRANS_AMT
						VAT_AMT_TOTAL += VAT_AMT
						STAMP_AMT_TOTAL += STAMP_AMT
						if (STAMP_AMT !== null && STAMP_AMT != 0) {
							STAMP_COUNT += 1
						}

						return `<tr>
				<td class="text-tiny">${index + 1}</td>
				<td class="text-tiny text-break">${moment(ENTRY_DATE).format('lll')}</td>
				<td class="text-tiny text-break text-left">${TRANS_NO}</td>
				<td class="text-tiny text-right">${(TRANS_AMT - VAT_AMT).toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny text-right">${VAT_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny text-right">${STAMP_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny text-right">${TRANS_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny">${BOOKNO}</td>
				<td class="text-tiny">${ACNO}</td>
				<td class="text-tiny text-break">${MONTH}</td>
		 	</tr>`
					})
					.join('')

				/* Bill Summary */

				document.getElementById('billsummary').innerHTML = `
			
			<p>
			<b>Total Bill Collected: </b>${payload.length} <br/>	
			<b>Total Net Bill Amount: </b>${TRANS_AMT_TOTAL.toLocaleString('en-BD', {
				maximumFractionDigits: 2,
				style: 'currency',
				currency: 'BDT'
			})} <br/>
			<b>Total Vat Amount:</b>${VAT_AMT_TOTAL.toLocaleString('en-BD', {
				maximumFractionDigits: 2,
				style: 'currency',
				currency: 'BDT'
			})} <br/>
			<b>Total Stamp Used: </b>${STAMP_COUNT} Ps<br/>
			<b>Total Payable: </b>${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toLocaleString('en-BD', {
				maximumFractionDigits: 2,
				style: 'currency',
				currency: 'BDT'
			})}<br/>
			<b>Revenue Balance: </b>${REVBAL_TOTAL.toLocaleString('en-BD', {
				maximumFractionDigits: 2,
				style: 'currency',
				currency: 'BDT'
			})}<br/>
			<b>VAT Balance: </b>${VATBAL_TOTAL.toLocaleString('en-BD', {
				maximumFractionDigits: 2,
				style: 'currency',
				currency: 'BDT'
			})}
			</p>`
			}
		})
		/* for table footer*/
		document.getElementById('output2').innerHTML += `
		<tr class="active text-bold">
		<td class="text-bold" colspan="3">Total</td>
		
		<td class="text-bold text-tiny">${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		<td class="text-bold text-tiny">${VAT_AMT_TOTAL.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		
	<td class="text-bold text-tiny">${STAMP_AMT_TOTAL.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
	<td class="text-bold text-tiny">${TRANS_AMT_TOTAL.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
	
	<td colspan="3"></td>
	

	</tr>`
		document.getElementById('btn-loading').classList.remove('loading')
		document.getElementById('btn-print').classList.remove('disabled')
	} catch (e) {
		document.getElementById('output').remove
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		
		<p class="empty-title h2 text-error">Stop Code 404</p>
		<p class="empty-subtitle">${e}</p>

	  </div>`
	}
}
const utilitySummary = async () => {
	document.getElementById('btn-loading-1').classList.add('loading')

	/*Constracting Url*/

	let fromdate = document.getElementById('fromdate').value
	let todate = document.getElementById('todate').value
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
	const url = `${apiserver}/utilityinfosummary`
	const raw = JSON.stringify({
		todate: `${todate}`,
		fromdate: `${fromdate}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	let TRANS_AMT_TOTAL = 0
	let VAT_AMT_TOTAL = 0
	let STAMP_AMT_TOTAL = 0

	/* Prints Head portation 
    'output2' is responsiable for table printing.
    'billsummary' is for summery.utilityinfohead
    */

	try {
		document.getElementById('output').innerHTML = `
		<div class="col-12 p-2 m-2 container">
		<div class="p-2 p-centered text-center container">
            <h5 class="my-2 p-centered w100 text-bold h5">Utility Colllection Report</h5>
            </div>
		
						 
						 <p>		
						 <b>From :</b> ${moment(fromdate).format('LLL')} <b>To :</b> ${moment(todate).format('LLL')}</p>
								<table class="table table-striped table-cluster">
									<thead>
										<tr>
										<th class="text-tiny">Agent No</th>
										<th class="text-tiny">Agent Name</th>
										<th class="text-tiny">Merchant</th>
										<th class="text-tiny">Revenue Account</th>
										<th class="text-tiny">VAT Account</th>
										<th class="text-tiny text-right">Net Amount</th>
										<th class="text-tiny text-right">VAT Amount</th>
										<th class="text-tiny text-right">Stamp Amount</th>
										<th class="text-tiny text-right">Total Amount</th>
										</tr>
									</thead>
									<tbody class="" id="output2"></tbody>
									
								</table>
			
							</div>
				</div>`

		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			if (payload === null) {
				document.getElementById('output2').innerHTML = `<tr>
				<td class="text-tiny text-break" colspan="9">No Bill Found</td>
				</tr>`
			} else {
				document.getElementById('output2').innerHTML = payload
					.map(({ PMPHONE, NAME, MERCHANT, REVAC, VATAC, VAT, STMP, TOTAL }) => {
						/* Calculatation*/
						TRANS_AMT_TOTAL += TOTAL
						VAT_AMT_TOTAL += VAT
						STAMP_AMT_TOTAL += STMP

						return `<tr>
				<td class="text-tiny">${PMPHONE}</td>
				<td class="text-tiny">${NAME}</td>
				<td class="text-tiny">${MERCHANT}</td>
				<td class="text-tiny">${REVAC}</td>
				<td class="text-tiny">${VATAC}</td>
				<td class="text-tiny text-right">${(TOTAL - VAT).toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny text-right">${VAT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny text-right">${STMP.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny text-bold text-right">${TOTAL.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				
		 	</tr>`
					})
					.join('')
			}
		})
		/* for table footer*/
		document.getElementById('output2').innerHTML += `
		<tr class="active text-bold">
		<td class="text-bold" colspan="5">Total</td>
		
		<td class="text-bold text-tiny">${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		<td class="text-bold text-tiny">${VAT_AMT_TOTAL.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		
	<td class="text-bold text-tiny">${STAMP_AMT_TOTAL.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
	<td class="text-bold text-tiny">${TRANS_AMT_TOTAL.toLocaleString('en-BD', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'BDT'
	})}</td>
	</tr>`
		document.getElementById('btn-loading-1').classList.remove('loading')
		document.getElementById('btn-print').classList.remove('disabled')
	} catch (e) {
		document.getElementById('output').remove
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		
		<p class="empty-title h2 text-error">Stop Code 404</p>
		<p class="empty-subtitle">${e}</p>

	  </div>`
	}
}
