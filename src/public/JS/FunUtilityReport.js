/*api server url is in environment file*/
const apiserver = 'http://127.0.0.1/api'

/* This function get the PBS list from database 
It connect via url which request recived by routes/index as rest Get request
Then it call api_utilitybill from apps folder.
*/
const getuvanls = async () => {
	const url = `${apiserver}/utilityreportpbslist`
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	/* It also work without it its here just for corns problem
	*/
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
const utilityinfo = async () => {
	// removeing old data if there just in case
	document.getElementById('output').remove
	/*Constracting Url*/
	const url = `${apiserver}/utilityinfodtl`

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

	/*This valus make the summary part.
	yes its made by by application. not DB yes!!!! >_<
	*/
	/* Totals*/
	let TRANS_AMT_TOTAL = 0
	let VAT_AMT_TOTAL = 0

	let STAMP_AMT_TOTAL = 0 //Stumps counter

	/* Prints Head portation 
	'output2' is responsiable for table printing.
	'billsummary' is for summery.
	*/
	document.getElementById('output').innerHTML += `<div class="col-12 p-2">
	
	<div class="p-2 container p-centered">
	
	
	
	<div class="card p-2 w100 columns col-12 p-2 bg-gray">
	<img src="/img/sblnewfull.png" style="hight:"35px";" class="img-responsive column p-centered col-4">
					<h5 class="p-centered mt-2">Agent Banking Division</h5>
					<h6 class="p-centered text-small my-2">Utility Colllection Report</h6>
					<div class="columns">
						<div class="column float-left">
							<p><b>Marchent :</b> ${key}<br/><b>From :</b> ${new Date(fromdate).toDateString()} <br/><b>To :</b> ${new Date(
		todate
	).toDateString()} <br/><b>Print Date:</b> ${printday}</p>							</div>
						<div class="divider-vert">
						</div>
						<div class="column float-righ" id="billsummary"">
						<!-- Summery content content --> 
						</div>
					</div>
			</div>
			
			 <div class="columns col-12 card p-1">
				<table class="table table-striped">
				   <thead>
					  <tr>
						 <th>SL.</th>
						 <th>Date</th>
						 <th>Trans NO</th>
						 <th class="text-small">Revenue</th>
						 <th>Vat</th>
						 <th>Stamp</th>
						 <th>Total</th>
						 <th>ACNO</th>
						 <th>Book No</th>
						 <th>Month</th>
					  </tr>
				   </thead>
				   <tbody id="output2"></tbody>
				</table>
				
			 </div>
		  </div>
		  <div class="col-12 w100  p-2 mt-2">
			 <p class="p-centered">Standard Bank Ltd. <br/>Agent Banking Division <br/> Head Office<br/>
				Metropolitan Chamber Building (3rd Floor)
				122-124 Motijheel C/A, Dhaka-1000, Bangladesh<br/>
				Telephone +8802223358385 ,+8802223385106 ,+8802223357913
				Email:agentbanking@standardbankbd.com <br/>
				Web: www.standardbankbd.com
			 </p>
		  </div>
		  <h6>This is an electronically generated report, hence does not require a signature.
		  </h6>
		  Copyright © Standard Bank Ltd.
	   </div>
	
 </div>`
	try {
		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			payload.map(({ ENTRY_DATE, TRANS_NO, TRANS_AMT, VAT_AMT, STAMP_AMT, ACNO, BOOKNO, MONTH }, index) => {
				document.getElementById('output2').innerHTML += `<tr>
				<td>${index + 1}</td>
				<td class="text-small">${new Date(ENTRY_DATE).toDateString()}</td>
				<td class="text-small text-break">${TRANS_NO}</td>
				<td class="float-righ">${(TRANS_AMT - VAT_AMT).toFixed(2)}</td>
				<td class="float-righ">${VAT_AMT.toFixed(2)}</td>
				<td class="float-righ">${STAMP_AMT}</td>
				<td class="float-righ">${TRANS_AMT.toFixed(2)}</td>
				<td>${ACNO}</td>
				<td>${BOOKNO}</td>
				<td>${MONTH}</td>
		 	</tr>`

				/* Calculatation*/
				TRANS_AMT_TOTAL += TRANS_AMT
				VAT_AMT_TOTAL += VAT_AMT
				if (STAMP_AMT !== null && STAMP_AMT != 0) {
					STAMP_AMT_TOTAL += 1
				}
			})

			/* Bill Summary */

			document.getElementById('billsummary').innerHTML = `
		
		<p>
   		Total Bill Collected: ${payload.length} <br/>	
   		Total Net Bill Amount: ${TRANS_AMT_TOTAL.toFixed(2)}<br/>
   		Total Vat Amount:${VAT_AMT_TOTAL.toFixed(2)}<br/>
   		Total Stamp Used: ${STAMP_AMT_TOTAL}<br/>
   		Total Payable: ${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toFixed(2)}<br/>
		</p>`
		})
		/* for table footer*/
		document.getElementById('output2').lastElementChild.innerHTML = `
	<tr class="active text-bold">
	<td class="text-bold" colspan="3">Total</td>
	
	<td class="text-bold float-righ">${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toFixed(2)}</td>
	<td class="text-bold float-righ">${VAT_AMT_TOTAL.toFixed(2)}</td>
	<td colspan="1"></td>
	<td class="text-bold float-righ">${TRANS_AMT_TOTAL.toFixed(2)}</td>
	
	<td colspan="3"></td>
	

	</tr>`
		printArea()
		// document.getElementById('printbtn').classList.remove('disabled')
	} catch (e) {
		document.getElementById('output').remove
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		
		<p class="empty-title h2 text-error">Stop Code 404</p>
		<p class="empty-subtitle">${e}</p>

	  </div>`
	}
}
