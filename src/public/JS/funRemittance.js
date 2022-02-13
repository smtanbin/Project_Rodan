// /*api server url is in environment file*/
// require('dotenv').config()
// const apiserver = process.env.apiurl
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
	const WinPrint = window.open('', '', 'width=2480px,height=3508px')
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
const remittance = async () => {
	// removeing old data if there just in case
	document.getElementById('output').remove
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

	try {

		let AMOUNT_REMITTED_BDT_TOTAL = 0
		let AMOUNT_OF_INCENTIVE_BDT_TOTAL = 0
			document.getElementById('output').innerHTML += `<div class="col-12 p-2">
    <div class="p-2 container p-centered">
        <div class="card w100 columns col-12 p-2">
            <img src="/img/sblnewfull.png" style="hight:" 25px";" class="img-responsive column p-centered col-3">
            <h5 class="p-centered text-small">Agent Banking Division</h5>
            <h6 class="p-centered text-tiny my-2">Remittance Report</h6>
			
			 
			 <p>		
			<b>From :</b> ${new Date(fromdate
).toDateString()} To :</b> ${new Date(todate).toDateString()}</p>
                    <table class="table table-striped table-cluster">
                        <thead>
                            <tr>
							<th class="text-tiny">SL</th>
							<th class="text-tiny">Name of Exchange House</th>
                                <th class="text-tiny">Ref.No./TT NO</th>
                                <th class="text-tiny">Date of Orginating Remittance</th>
                                <th class="text-tiny">Name</th>
                                <th class="text-tiny">Document Type</th>
                                <th class="text-tiny">NID NO./PASSPORT NO.</th>
                                
                                <th class="text-tiny">Sender Name</th>
                                <th class="text-tiny">Source Country</th>
                                <th class="text-tiny">Amount Remitted (BDT)</th>
                                <th class="text-tiny">Amount of Incentive (BDT)</th>
                                <th class="text-tiny">Date of Payment of Incentive</th>
                                
                  
                            </tr>
                        </thead>
                        <tbody class="" id="output2"></tbody>
                    </table>

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


	
		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			if (payload === null){
				document.getElementById('output2').innerHTML += 
				`<tr>
				<td class="text-tiny text-break" colspan="9">No Bill Found</td>
				</tr>`
			} else{
			payload.map(({ NAME_OF_EXCHANGE_HOUSE, RefNo_TT_NO, DATE_OF_ORGINATING_REMITTANCE, NAME,
				DOCUMENT_TYPE, NID_NO_PASSPORT_NO, SENDER_NAME, SOURCE_COUNTRY,AMOUNT_REMITTED_BDT,AMOUNT_OF_INCENTIVE_BDT,DATE_OF_PAYMENT_OF_INCENTIVE }, index) => {
				document.getElementById('output2').innerHTML += `<tr>
				<td>${index + 1}</td>
				<td class="text-tiny text-break">${NAME_OF_EXCHANGE_HOUSE}</td>
				<td class="text-tiny text-break">${RefNo_TT_NO}</td>
				<td class="text-tiny text-break">${DATE_OF_ORGINATING_REMITTANCE}</td>
				<td class="text-tiny">${NAME}</td>
				<td class="text-tiny">${DOCUMENT_TYPE}</td>
				<td class="text-tiny">${NID_NO_PASSPORT_NO}</td>
			
				<td class="text-tiny">${SENDER_NAME}</td>
				<td class="text-tiny">${SOURCE_COUNTRY}</td>
				<td class="text-tiny">${AMOUNT_REMITTED_BDT.toFixed(2)}</td>
				<td class="text-tiny">${AMOUNT_OF_INCENTIVE_BDT.toFixed(2)}</td>
				<td class="text-tiny">${DATE_OF_PAYMENT_OF_INCENTIVE}</td>
				
		 	</tr>`

				/* Calculatation*/
				AMOUNT_REMITTED_BDT_TOTAL += AMOUNT_REMITTED_BDT
				AMOUNT_OF_INCENTIVE_BDT_TOTAL += AMOUNT_OF_INCENTIVE_BDT
		
			})
			
		}
		})
		/* for table footer*/
		document.getElementById('output2').lastElementChild.innerHTML = `
		<tr class="active text-bold">
		<td class="text-bold" colspan="9">Total</td>
		<td class="text-bold">${AMOUNT_REMITTED_BDT_TOTAL.toFixed(2)}</td>
		<td class="text-bold">${AMOUNT_OF_INCENTIVE_BDT_TOTAL.toFixed(2)}</td>
		<td class="text-bold" colspan="1"></td>
		
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
