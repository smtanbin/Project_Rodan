// accountInfo
/*api server url is in environment file*/
//const apiserver = '/api/'

/* This function get the statement for customer 
It connect via url which request recived by routes/index as rest Get request
Then it call apistatement.js from apps folder.
*/

const agentList = async () => {
	/* Post request body content*/
	const url = `${apiserver}/agentlist`

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}
	// agentlist

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map(({ MPHONE, NAME }) => {
			document.getElementById(
				'agentList'
			).innerHTML += `<li class="menu-item text-tiny w100"><a onclick="getAccountinfo('${MPHONE}','${NAME}')">${NAME}</a></li>`
		})
	})
}

const getAccountinfo = async (value, titel) => {
	/* Post request body content*/
	const url = `${apiserver}//accountInfo`
	const rawhead = JSON.stringify({
		key: `${value}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: rawhead,
		redirect: 'follow'
	}

	document.getElementById('output').innerHTML = `<div class="col-12 container m-2 p-2">
    <div class="px-2 container">
       <div class="card w100 columns col-12 p-2  bg-gray">
          <h5 class="p-centered text-tiny text-bold my-2 h5">Term Account Information</h5>
          <div class="text-tiny">
          <b>Agent:</b> ${value}</div>
       </div>
       <div class="columns col-12 card p-1">
          <table class="table table-striped table-cluster">
             <thead>
                <tr>
                
                <th class="text-tiny">Form SL.</th>
                <th class="text-tiny">Opening Date</th>
                <th class="text-tiny">Account No</th>
                <th class="text-tiny">Name</th>
                <th class="text-tiny">Customer ID</th>
                <th class="text-tiny">Contact</th>
                <th class="text-tiny">Status</th>
                <th class="text-tiny">Reg Status</th>
                <th class="text-tiny">Maturity Date</th>
                <th class="text-tiny">Renew Date</th>
                <th class="text-tiny">Amount</th>
                <th class="text-tiny">Due</th>
                <th class="text-tiny">Total</th>
           
                </tr>
             </thead>
             <tbody id="output2"></tbody>
          </table>
       </div>
    </div>
 </div>`
	try {
		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			document.getElementById('output2').innerHTML += payload
				.map(
					(
						{
							SLNO,
							OPENINGDATE,
							MPHONE,
							NAME,
							CUSTOMERID,
							CONTACT,
							ACSTATUS,
							REGSTATUS,
							MATURITYDATE,
							RENEWDATE,
							INSTALLMENTAMOUNT,
							DUE,
							PAYABLE
						},
						index
					) => {
						return `<tr>
                    <td class="text-tiny">${SLNO}</td>
                    <td class="text-tiny">${moment(OPENINGDATE).format('ll')}</td>
                    <td class="text-tiny">${MPHONE}</td>
                    <td class="text-tiny">${NAME}</td>
                    <td class="text-tiny">${CUSTOMERID}</td>
                    <td class="text-tiny">+88${CONTACT}</td>
                    <td class="text-tiny">${ACSTATUS}</td>
                    <td class="text-tiny">${REGSTATUS}</td>
                    <td class="text-tiny">${moment(MATURITYDATE).format('ll')}</td>
                    <td class="text-tiny">${moment(RENEWDATE).format('ll')}</td>
                    <td class="text-tiny">${INSTALLMENTAMOUNT.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})}</td>
                    <td class="text-tiny">${DUE}</td>
                    <td class="text-tiny">${PAYABLE.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})}</td>
                    </tr>`
					}
				)
				.join('')
		})

		document.getElementById('btnprint').classList.remove('disabled')
	} catch (e) {
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
				
				<h4 class="empty-title h2 text-error">Stop Code 404</h4>
				<p class="empty-title h2 text-error">Fail to get data</p>
				<p class="empty-subtitle">${e}</p>

			</div>`
		console.log(e)
	}
}
