/*api server url is in environment file*/
const apiserver = 'http://127.0.0.1/api'

/* This function get the PBS list from database 
It connect via url which request recived by routes/index as rest Get request
Then it call api_utilitybill from apps folder.
*/

/* Printing Dialog and window genarated by this function. 
Remember: #output must be loaded
*/
const printArea = () => {
	const head = `        <head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="/style/aos/aos.css" rel="stylesheet">
	<link rel="stylesheet" href="/style/styles.css">
	<link rel="stylesheet" href="/style/spectre/spectre.min.css">
	<link rel="stylesheet" href="/style/spectre/spectre-icons.min.css">
	<link rel="stylesheet" href="/style/spectre/spectre-exp.min.css">
  </head>`
	const printContent = document.getElementById('output')
	const WinPrint = window.open('', '', 'width=3508px,height=2480px')
	WinPrint.document.write(head + printContent.innerHTML)
	WinPrint.document.close()
	WinPrint.focus()
	//Bring out the print popup
	WinPrint.print()
}

/* This function get the PBS statment base on key value from database 
It connect via url which request recived by routes/index as rest Post request
Then it call api_utilitybill from apps folder.
*/
const accountStmt = async () => {
	// removeing old data if there just in case
	document.getElementById('output').remove
	/*Checking account*/

	const key = document.getElementById('acno').value
	/* Post request body content*/
	const initurl = `${apiserver}/isaccountexist
`
	const inithead = JSON.stringify({
		key: `${key}`
	})

	const initrequestOptions = {
		method: 'GET',
		headers: myHeaders,
		body: inithead,
		redirect: 'follow'
	}

	await fetch(initurl, initrequestOptions).then((response) => response.json()).then((payload) => console.log(payload))
	// {
	// 	payload.map(({ REG_STATUS }, index) => {
	// 		if REG_STATUS === true{

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
	const urlhead = `${apiserver}/accountStatmentHead
`
	const rawhead = JSON.stringify({
		key: `${key}`
	})

	const headrequestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: rawhead,
		redirect: 'follow'
	}
	/* Post request body content*/
	const urlbody = `${apiserver}/accountStatmentBody`
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
	let oprningbalance = 0
	let total_dr = 0
	let total_cr = 0

	/* Prints Head portation 
    'output2' is responsiable for table printing.
    'billsummary' is for summery.utilityinfohead
    */

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

					document.getElementById('output').innerHTML += `<div class="col-12 p-2">
    <div class="p-2 container p-centered">
        <div class="card w100 columns col-12 p-1 bg-gray">
            <img src="/img/sblnewfull.png" style="hight:" 30px";" class="img-responsive column p-centered col-4">
            <h5 class="p-centered text-small">Agent Banking Division</h5>
            <h6 class="p-centered text-tiny my-2">Account Statment</h6>
			
            <div class="columns px-2">
			<p>Statement of Account for the Period: ${new Date(fromdate).toDateString()} <b>To </b> ${new Date(
						todate
					).toDateString()}</p>
                <div class="column float-left text-tiny ">
                    <p><b>Titel :</b> ${ACCOUNT_NAME}<br />
					<b>Address :</b> ${ADDR}<br />
					<b>Contact :</b> +88${CON_MOB}<br />
					<b>Status :</b>${STATUS}</p>
                </div>
                <div class="divider-vert">
                </div>
                <div class="column float-right text-tiny">
				<p>
				<b>Account No: </b>${MPHONE} <br/>	
				<b>Account Type:</b>${TYPE}<br/>
				<b>Customer ID: </b>${CUST_ID}<br/>
				<b>Opening Date: </b>${REG_DATE}<br/>
				<b>Maturity Date: </b>${MATURITY_DATE}<br/>
				<b>Agent: </b>${PMPHONE}
				
				</p>
						</div>
					</div>
			</div>
			 <div class=" columns col-12 card p-1">
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
							<td colspan="5"></td>
							<td class="text-tiny">${oprningbalance}</td>
							<td colspan="1"></td>
                  
                            </tr>
                        </thead>
                        <tbody class="" id="output2">
						
						</tbody>
                    </table>

                </div>
            </div>
            <div class="col-12 w100  p-2 mt-2 text-tiny">
			<b>Print Date:</b> ${printday}
                <p class="p-centered text-small">Standard Bank Ltd. <br />Agent Banking Division, Head Office
                    Metropolitan Chamber Building (3rd Floor) 122-124 Motijheel C/A, Dhaka-1000, Bangladesh<br />
                    Telephone +8802223358385 ,+8802223385106 Email:agentbanking@standardbankbd.com Web: www.standardbankbd.com
                </p>
            </div>
            <h6 class="p-centered text-tiny">This is an electronically generated report, hence does not require a signature.
            </h6>
            Copyright © Standard Bank Ltd.
        </div>

    </div>`
				}
			)
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
			payload.map(({ TRANS_NO, TRANS_DATE, DR_AMT, CR_AMT, PARTICULAR }, index) => {
				/* Calculatation*/
				oprningbalance += CR_AMT
				oprningbalance -= DR_AMT

				document.getElementById('output2').innerHTML += `<tr>
				<td>${index + 1}</td>
				<td class="text-micro text-break">${new Date(TRANS_DATE).toDateString()}</td>
				<td class="text-micro text-break">${TRANS_NO}</td>
				<td class="text-tiny">${DR_AMT.toFixed(2)}</td>
				<td class="text-tiny">${CR_AMT.toFixed(2)}</td>
				<td class="text-tiny">${oprningbalance.toFixed(2)}</td>
				<td class="text-tiny">${PARTICULAR}</td>
		 	</tr>`
				total_dr += DR_AMT
				total_cr += CR_AMT
			})

			/* for table footer*/
			document.getElementById('output2').lastElementChild.innerHTML = `
	<tr class="active text-bold">
	<td class="text-bold" colspan="3">Total</td>
	<td class="text-bold">${total_dr.toFixed(2)}</td>
	<td class="text-bold">${total_cr.toFixed(2)}</td>
	<td class="text-bold">${oprningbalance.toFixed(2)}</td>
	
	<td colspan="1"></td>
		</tr>`
			printArea()
			// document.getElementById('printbtn').classList.remove('disabled')
		})
	} catch (e) {
		document.getElementById('output').remove
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		
		<p class="empty-title h2 text-error">Stop Code 404</p>
		<p class="empty-subtitle">${e}</p>

	  </div>`
	}
}
