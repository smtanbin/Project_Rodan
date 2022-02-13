/*api server url is in environment file*/
const apiserver = 'http://127.0.0.1:80/api/'
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
		date: `${fromdate}`,
		
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
			payload.map(({ TITEL,REVAC,VATAC,REVBAL,VATBAL,BILL_TITLE_1,BILL_TITLE_2,BILL_TITLE_3 }, index) => {
				REVBAL_TOTAL = REVBAL
				VATBAL_TOTAL = VATBAL
				document.getElementById('output').innerHTML += `<div class="col-12 p-2">
    <div class="p-2 container p-centered">
        <div class="card w100 columns col-12 p-1 bg-gray">
            <img src="/img/sblnewfull.png" style="hight:" 30px";" class="img-responsive column p-centered col-4">
            <h5 class="p-centered text-small">Agent Banking Division</h5>
            <h6 class="p-centered text-tiny my-2">Utility Colllection Report</h6>
            <div class="columns px-2">
                <div class="column float-left text-tiny ">
                    <p><b>Marchent :</b> ${TITEL}<br />
					<b>Revenue Account:</b> ${REVAC}<br />
					<b>VAT Account :</b> ${VATAC}<br />
					
					<b>From :</b> ${new Date(
		fromdate
	).toDateString()} <br /><b>To :</b> ${new Date(todate).toDateString()}</p>
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

    </div>`})

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
			if (payload === null){
				document.getElementById('output2').innerHTML += 
				`<tr>
				<td class="text-tiny text-break" colspan="9">No Bill Found</td>
				</tr>`
			} else{
			payload.map(({ ENTRY_DATE, TRANS_NO, TRANS_AMT, VAT_AMT, STAMP_AMT, ACNO, BOOKNO, MONTH }, index) => {
				document.getElementById('output2').innerHTML += `<tr>
				<td>${index + 1}</td>
				<td class="text-tiny text-break">${new Date(ENTRY_DATE).toDateString()}</td>
				<td class="text-tiny text-break">${TRANS_NO}</td>
				<td class="text-tiny">${(TRANS_AMT - VAT_AMT).toFixed(2)}</td>
				<td class="text-tiny">${VAT_AMT.toFixed(2)}</td>
				<td class="text-tiny">${STAMP_AMT}</td>
				<td class="text-tiny">${TRANS_AMT.toFixed(2)}</td>
				<td class="text-tiny">${BOOKNO}</td>
				<td class="text-tiny">${ACNO}</td>
				<td class="text-tiny">${MONTH}</td>
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
			<b>Total Bill Collected: </b>${payload.length} <br/>	
			<b>Total Net Bill Amount: </b>${TRANS_AMT_TOTAL.toFixed(2)} .BDT<br/>
			<b>Total Vat Amount:</b>${VAT_AMT_TOTAL.toFixed(2)} .BDT<br/>
			<b>Total Stamp Used: </b>${STAMP_AMT_TOTAL}<br/>
			<b>Total Payable: </b>${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toFixed(2)} .BDT<br/>
			<b>Revenue Balance: </b>${(REVBAL_TOTAL).toFixed(2)} .BDT<br/>
			<b>VAT Balance: </b>${(VATBAL_TOTAL).toFixed(2)} .BDT
			</p>`
		}
		})
		/* for table footer*/
		document.getElementById('output2').lastElementChild.innerHTML = `
		<tr class="active text-bold">
		<td class="text-bold" colspan="3">Total</td>
		
		<td class="text-bold">${(TRANS_AMT_TOTAL - VAT_AMT_TOTAL).toFixed(2)}</td>
		<td class="text-bold">${VAT_AMT_TOTAL.toFixed(2)}</td>
		<td colspan="1"></td>
	<td class="text-bold">${TRANS_AMT_TOTAL.toFixed(2)}</td>
	
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
