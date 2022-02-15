/*api server url is in environment file*/
const apiserver = '/api/'

/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

/* This function get the statement for customer 
It connect via url which request recived by routes/index as rest Get request
Then it call apistatement.js from apps folder.
*/

/* Printing Dialog and window genarated by this function. 
globalFunction
*/

const getstatement = async (key) => {
	let fromdate = document.getElementById('fromdate').value
	let todate = document.getElementById('todate').value
	const printday = Date()
	// console.log(fromdate)

	/*Current date & time*/
	if (fromdate === null || fromdate === '') {
		fromdate = printday
	}
	if (todate === null || todate === '') {
		todate = printday
	}

	/* Post request body content*/
	const urlhead = `${apiserver}/statementhead`
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
	const urlbody = `${apiserver}/statementbody`
	const rawbody = JSON.stringify({ key: `${key}`, fromdate: `${fromdate}`, todate: `${todate}` })
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
	let oprningbalance = 0
	let total_dr = 0
	let total_cr = 0

	try {
		await fetch(urlhead, headrequestOptions).then((response) => response.json()).then((payload) => {
			payload.map(
				(
					{
						MPHONE,
						PMPHONE,
						ACCOUNT_NAME,
						TYPE,
						STATUS,
						REG_DATE,
						BALANCE,
						CON_MOB,
						ADDR,
						MATURITY_DATE,
						CUST_ID
					},
					index
				) => {
					oprningbalance = BALANCE

					document.getElementById('output').innerHTML = `<div class="col-12 p-2">
							<div class="px-2 container">
							<div class="container">
							<div class="columns">
							  <div class="column col-9">
							  <img src="/img/Standardbankltd-color.svg" style="hight:" 25px";" class="img-responsive py-2 column col-5">
							  </div>
							  <div class="column col-3"><div class="column" style="roght=0"><h5 class="text-clip h5">Agent Banking</h5></div></div>
							</div>
						  </div>

							   <div class="card w100 columns col-12 p-1 bg-gray">
								  <h6 class="p-centered text-tiny text-bold my-2">Account Statment</h6>
								  <div class="columns px-2">
									 <div class="column float-left text-tiny ">
									 
										<p><b>Titel :</b> ${ACCOUNT_NAME}<br />
										<b>Account No: </b>${MPHONE} <br/>	
										<b>Address :</b> ${ADDR}<br />
										<b>Contact :</b> +88${CON_MOB}<br />
										<b>Currency : </b>BDT<br />
										<b>Status : </b>${STATUS}
										</p>
										</div>
										<div class="divider-vert">
										</div>
										<div class="column float-right text-tiny">
										
										<p>
										<b>Branch: </b>Agent Banking<br/>	
										<b>Account Type:</b> ${TYPE}<br/>
										   <b>Customer ID: </b>${CUST_ID}<br/>
										   <b>Opening Date: </b>${REG_DATE}<br/>
										   <b>Expiry Date: </b>${MATURITY_DATE}<br/>
										   <b>Agent: </b>${PMPHONE}	
										</p>
									 </div>
								  </div>
								  <div class="text-tiny">Statement of Account for the Period: ${new Date(
										fromdate
									).toDateString()} <b> To </b> ${new Date(todate).toDateString()}
								 </div>
							   </div>
							   <div class="columns col-12 card p-1">
							 
								   <table class="table table-striped table-cluster">
									 <thead>
										<tr>
										   <th class="text-tiny">SL.</th>
										   <th class="text-tiny">Date</th>
										   <th class="text-tiny">Trans. Code / Chq No</th>
										   <th class="text-tiny">Debit Amount</th>
										   <th class="text-tiny">Credit Amount</th>
										   <th class="text-tiny">Balance</th>
										   <th class="text-tiny">Remarks</th>
										</tr>
										<tr>
										   <td colspan="5">Opening Balance</td>
										   <td class="text-tiny">${oprningbalance.toFixed(2)}</td>
										   <td colspan="1"></td>
										</tr>
									 </thead>
									 <tbody id="output2">
									 </tbody>
									 <tr id="output3"></tr>
								  </table>
							   </div>
							</div>
							<div class="col-12 w100  p-2 mt-2 text-tiny">
							   <b>Print Date:</b> ${printday}
							
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
				}
			)
		})
	} catch (e) {
		let idoutput = document.getElementById('output')
		if (idoutput.parentNode) {
			idoutput.parentNode.removeChild()
		}

		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
				
				<h4 class="empty-title h2 text-error">Stop Code 404</h4>
				<p class="empty-title h2 text-error">Fail to get Header</p>
				<p class="empty-subtitle">${e}</p>

			</div>`
	}
	// try {
	await fetch(urlbody, bodyrequestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('output2').innerHTML += `<tr>
						<td class="text-tiny text-break" colspan="7"></td>
						</tr>`
		} else {
			document.getElementById('output2').innerHTML = payload
				.map(({ TRANS_NO, TRANS_DATE, DR_AMT, CR_AMT, PARTICULAR }, index) => {
					/* Calculatation*/
					oprningbalance += CR_AMT
					oprningbalance -= DR_AMT
					total_dr += DR_AMT
					total_cr += CR_AMT

					return `<tr>
						<td>${index + 1}</td>
						<td class="text-tiny text-break">${moment(TRANS_DATE).format('lll')}</td>
						<td class="text-tiny text-clip">${TRANS_NO}</td>
						<td class="text-tiny">${DR_AMT.toLocaleString('en-BD', {
							maximumFractionDigits: 2
						})}</td>
						<td class="text-tiny">${CR_AMT.toLocaleString('en-BD', {
							maximumFractionDigits: 2
						})}</td>
						<td class="text-tiny ">${oprningbalance.toLocaleString('en-BD', {
							maximumFractionDigits: 2
						})}</td>
						<td class="text-tiny text-break">${PARTICULAR}</td>
						</tr>`
				})
				.join('')
			/* for table footer*/
			document.getElementById('output2').innerHTML += `<td class="text-bold" colspan="3">Total</td>
					<td class="text-bold text-tiny">${total_dr.toLocaleString('en-BD', {
						maximumFractionDigits: 2,
						style: 'currency',
						currency: 'BDT'
					})}</td>
					<td class="text-bold text-tiny">${total_cr.toLocaleString('en-BD', {
						maximumFractionDigits: 2,
						style: 'currency',
						currency: 'BDT'
					})}</td>
					<td class="text-bold text-tiny">${oprningbalance.toLocaleString('en-BD', {
						maximumFractionDigits: 2,
						style: 'currency',
						currency: 'BDT'
					})}</td>
					<td colspan="1"></td>`
		}

		document.getElementById('btn-loading').classList.remove('loading')
		document.getElementById('btnprint').classList.remove('disabled')
	})
	// } catch (e) {
	// 	document.getElementById("btn").classList.remove("loading");
	// 	document.getElementById('output').innerHTML = `<div class="empty col-12 w100">

	// 		<p class="empty-title h2 text-error">Stop Code 404</p>
	// 		<p class="empty-title h2 text-error">Fail to get Body</p>
	// 		<p class="empty-subtitle">${e}</p>

	// 	</div>`
	// }
}

/* This is the main function that generated the statement.
*/
const statement = async () => {
	/*Checking account is existed in database. rejacted account also not count as account api/doexisist return boolien data.//#endregion*/

	document.getElementById('btn-loading').classList.add('loading')
	const keyvalue = document.getElementById('key').value
	/* Post request body content*/
	const initurl = `${apiserver}/doexist`

	const inithead = JSON.stringify({
		key: `${keyvalue}`
	})

	const initrequestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: inithead,
		redirect: 'follow'
	}
	try {
		await fetch(initurl, initrequestOptions).then((response) => response.json()).then(async (payload) => {
			payload.map(({ output }) => {
				if (output != 0) {
					getstatement(keyvalue)
				} else {
					document.getElementById('btn-loading').classList.remove('loading')

					document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
				<h4 class="empty-title h2 text-error">Account not found.</h4>
				<p class="empty-title h2 text-error">You maybe miss spilled or account been rejected.</p>
			</div>`
				}
			})
		})
	} catch (e) {
		document.getElementById('output').removeChild(firstChild)
		document.getElementById('btn-loading').classList.remove('loading')
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		<h4 class="empty-title h2 text-error">Error Stop code 404!</h4>
		<p class="empty-title h2 text-error">${e}.</p>
	</div>`
	}
}
