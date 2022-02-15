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

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

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
    yes its made by by application. not DB yes!!!! >_<
    */
	/* Totals*/
	let TRANS_AMT_TOTAL = 0
	let VAT_AMT_TOTAL = 0
	let REVBAL_TOTAL = 0
	let VATBAL_TOTAL = 0

	let STAMP_AMT_TOTAL = 0 //Stumps counter

	/* Prints Head portation 
    'output2' is responsiable for table printing.
    'billsummary' is for summery.utilityinfohead
    */

	try {
		await fetch(urlhead, headrequestOptions).then((response) => response.json()).then((payload) => {
			payload.map(({ TITEL, REVAC, VATAC, REVBAL, VATBAL, BILL_TITLE_1, BILL_TITLE_2, BILL_TITLE_3 }, index) => {
				REVBAL_TOTAL = REVBAL
				VATBAL_TOTAL = VATBAL
				document.getElementById('output').innerHTML = `<div class="col-12 p-2">
				<div class="px-2 container">
							
							
				<div class="container">
				<div class="columns">
				<div class="column col-9">
				<img src="/img/Standardbankltd-color.svg" style="hight:" 25px";" class="img-responsive py-2 column col-5">
				</div>
				<div class="column col-3"><div class="column" style="roght=0"><h5 class="text-clip h5">Agent Banking</h5></div></div>
			  </div>
            <h6 class="p-centered text-tiny my-2">Utility Colllection Report</h6>
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
                                <th class="text-tiny">Trans NO</th>
                                <th class="text-tiny">Revenue</th>
                                <th class="text-tiny">Vat</th>
                                <th class="text-tiny">Stamp</th>
                                <th class="text-tiny">Total</th>
                                <th class="text-tiny">${BILL_TITLE_1}</th>
                                <th class="text-tiny">${BILL_TITLE_2}</th>
                                <th class="text-tiny">${BILL_TITLE_3}</th>
                  
                            </tr>
                        </thead>
                        <tbody class="" id="output2"></tbody>
                    </table>

                </div>
            </div>
        
			<div class="col-12 w100  p-2 mt-2 text-tiny">
			<b>Print Date:</b> ${moment(printday).format('LLL')}
			<p class="p-centered text-small">This is an electronically generated report, hence does not require a signature.
			</p>
		 </div>
		 
		 <div class="text-center p-centered">
		 <h6 class="text-bold h6">Thanks for banking with us.</h6>
		 <p class="text-tiny text-left text-break">The Customer should examine promptly the statement received and notify the bank in writing within 15 calendar days after the statement is mailed,
		 transmitted, or otherwise made available to customer of any errors, discrepancies or irregularities detected, failing which the statement will deem to
		 be correct.This is an electronically generated report, hence does not require a signature. 
		 </p>
		 
		 <div class="card bg-gray w100">
		 <span class="text-tiny">
		 Agent Banking Division <br/>
		 Standard Bank Ltd. Head Office, Metropolitan Chamber Building (3rd Floor) 122-124 Motijheel C/A, Dhaka-1000, Bangladesh <br/>Tel:+8802-9578385 +8802 9612-316428 +8801 709-654772 +8801 709-654773 Email: agentbanking@standardbankbd.com
		 </span>
		 <br/><a href="https://www.standardbankbd.com" class="text-gray text-tiny">Copyright © 2022 Standard Bank Ltd</a></div>
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
						if (STAMP_AMT !== null && STAMP_AMT != 0) {
							STAMP_AMT_TOTAL += 1
						}

						return `<tr>
				<td>${index + 1}</td>
				<td class="text-tiny text-break">${moment(ENTRY_DATE).format('LLL')}</td>
				<td class="text-tiny text-break">${TRANS_NO}</td>
				<td class="text-tiny">${(TRANS_AMT - VAT_AMT).toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny">${VAT_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny">${STAMP_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny">${TRANS_AMT.toLocaleString('en-BD', {
					maximumFractionDigits: 2
				})}</td>
				<td class="text-tiny">${BOOKNO}</td>
				<td class="text-tiny">${ACNO}</td>
				<td class="text-tiny">${MONTH}</td>
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
			<b>Total Stamp Used: </b>${STAMP_AMT_TOTAL}<br/>
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
		
		<td class="text-bold">${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		<td class="text-bold">${VAT_AMT_TOTAL.toLocaleString('en-BD', {
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'BDT'
		})}</td>
		<td colspan="1"></td>
	<td class="text-bold">${TRANS_AMT_TOTAL.toLocaleString('en-BD', {
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
