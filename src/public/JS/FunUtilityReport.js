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

/* This function get the PBS statment base on key value from database 
It connect via url which request recived by routes/index as rest Post request
Then it call api_utilitybill from apps folder.
*/
const utilityinfo = async () => {
	/*Constracting Url*/
	const url = `${apiserver}/utilityinfodtl`

	const key = document.getElementById('uvanls').value
	const fromdate = document.getElementById('fromdate').value
	const todate = document.getElementById('todate').value

	/*Current date & time*/
	const printday = Date()

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
	let sl = 0 //Genarate Serial No
	/* Totals*/
	let TRANS_AMT_TOTAL = 0
	let VAT_AMT_TOTAL = 0

	let STAMP_AMT_TOTAL = 0 //Stumps counter

	/* Prints Head portation 
	'output2' is responsiable for table printing.
	'billsummary' is for summery.
	*/
	document.getElementById('output').innerHTML += `<div class="card col-12 p-2">
	<div class="p-2">
	   <div class="container">
		  <div class="columns col-sm-12">
			 <div class="columns col-12">
				<h2 class="p-centered">Standard Bank Limited</h2>
				<h6 class="p-centered">Agent Banking Division</h6>
				</div>
				<div class="card p-2 w100 columns col-12 p-2">
				<div class="col-12 row">
				<h6 class="p-centered">Utility Colllection Report</h6>
				   <div class="columns col-6 float-left">
				   			     
				   <p>Vendor : ${key}<br/>
				   Date : From ${fromdate} To ${todate} <br/>
				   Print Date: ${printday}
				   </p>
				   </div>   
				   
				   <div class="col-6 float-righ" id="billsummary">
				  
				   </div>
				</div>
			 </div>
			 <div class="columns col-12">
				<table class="table">
				   <thead>
					  <tr>
						 <th>SL.</th>
						 <th>Date</thclass=>
						 <th>Trans NO</thclass=>
						 <th>Net Bill</th>
						 <th>Vat</th>
						 <th>Rev.Stamp</th>
						 <th>ACNO</th>
						 <th>Book No</th>
						 <th>Month</th>
					  </tr>
				   </thead>
				   <tbody id="output2"></tbody>
				</table>
				
			 </div>
		  </div>
		  <div class="col-12 w100 p-centered p-2 mt-2">
			 <p>Standard Bank Agent Banking Division Head Office<br/>
				Metropolitan Chamber Building (3rd Floor)
				122-124 Motijheel C/A, Dhaka-1000, Bangladesh<br/>
				Telephone +8802223358385 ,+8802223385106 ,+8802223357913
			 </p>
		  </div>
	   </div>
	</div>
 </div>`
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const { ENTRY_DATE, TRANS_NO, TRANS_AMT, VAT_AMT, STAMP_AMT, ACNO, BOOKNO, MONTH } = data

			sl += 1 //Serialing Start with map loop
			document.getElementById('output2').innerHTML += `<tr>
				<td>${sl}<td/>
				<td>${ENTRY_DATE}</tdclass=>
				<td>${TRANS_NO}</td>
				<td>${TRANS_AMT}</td>
				<td>${VAT_AMT}</td>
				<td>${STAMP_AMT}</td>
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
   		Total Bill Collected: ${sl} <br/>	
   		Total Net Bill Amount: ${TRANS_AMT_TOTAL} .BDT<br/>
   		Total Vat Amount:${VAT_AMT_TOTAL} .BDT<br/>
   		Total Stamp Used: ${STAMP_AMT_TOTAL}<br/>
   		Total Payable: ${TRANS_AMT_TOTAL - VAT_AMT_TOTAL} .BDT<br/>
		</p>`
	})
	/* for table footer*/
	document.getElementById('output2').lastElementChild.innerHTML = `
	<tr class="active">
	<td style="width:inherit">&nbsp;</td>
	<td style="width:inherit">Total</td>
	<td style="width:inherit">${TRANS_AMT_TOTAL}</td>
	<td style="width:inherit">${VAT_AMT_TOTAL}</td>
	<td style="width:inherit">${STAMP_AMT_TOTAL}</td>
	<td style="width:inherit">&nbsp;</td>
	<td style="width:inherit">&nbsp;</td>
	<td style="width:inherit">&nbsp;</td>
	</tr>`
}
