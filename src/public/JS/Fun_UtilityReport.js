const uvanls = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/uvanls`
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		ID: 'autho'
	})
	console.log(raw)
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const { TRANS_SNAME } = data

			document.getElementById('uvanls').innerHTML += `<option>${TRANS_SNAME}</option>`
		})
	})
}

const custPrint = async () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/customerinfo`
	let id = document.getElementById('acno').value
	console.log(id)

	// request
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')

	const raw = JSON.stringify({
		id: `${id}`
	})
	console.log(raw)
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		payload.map((data) => {
			const {
				REG_DATE,
				REG_STATUS,
				AUTHO_BY,
				UPDATE_BY,
				UPDATE_DATE,
				STATUS,
				CATEGORY,
				AC_TYPE_CODE,
				MPHONE,
				AGENT,
				AGENTAC,
				BALANCE,
				LIEN_M,
				NAME,
				IMGAE,
				FATHER_NAME,
				MOTHER_NAME,
				SPOUSE_NAME,
				DATE_OF_BIRTH,
				SIM_NO,
				TIN_NO,
				RELIGION
			} = data

			var myWindow = window.open('', 'MsgWindow')
			myWindow.document.write(`
			<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		  
			<link href="/style/aos/aos.css" rel="stylesheet">
			<link rel="stylesheet" href="/style/styles.css">
			<link rel="stylesheet" href="/style/spectre/spectre.min.css">
			<link rel="stylesheet" href="/style/spectre/spectre-icons.min.css">
			<link rel="stylesheet" href="/style/spectre/spectre-exp.min.css">
		  </head>
<!-- grid nesting example -->
<div class="card bg-gray col-12 p-2">
	<div class="p-2">
		<div class="container">
			<div class="columns col-sm-12">
				<div class="column col-sm-6">
					<h2 class="text-bold text-primary">${NAME}</h2>
					<h6 class="text-small">Status: ${STATUS}</h6>
		
					<div class="columns">
						<div class="column col-12 show-sm">
						<br />
						<h3 >
						Balance : <span class="text-success">BDT. ${BALANCE - LIEN_M}</span> 
						</h3>
						<p class="text-warning"><span  class="text-error">Blocked Amount: BDT. ${LIEN_M}<br/></span>
						<span>Total Amount: </span>BDT. ${BALANCE}
						</p>
						<br />
							<h4 class="text-bold mt-2">KYC</h4>
							<p>Father Name: ${FATHER_NAME}<br />
								Mother Name: ${MOTHER_NAME}<br />
								Spouse Name: ${SPOUSE_NAME}<br />
								Date Of Birth: ${DATE_OF_BIRTH}<br />
								Gender:${SIM_NO}<br />
								ID :<br />
								TIN :,${TIN_NO}<br />
								Religion: ${RELIGION}</p>
						</div>
						<div class="column col-12">
						<br />
						<h4>Reg Status</h4>
						Reg Status: ${REG_STATUS}<br />
						Reg date: ${REG_DATE}<br/>
						<p>Authorized By: ${AUTHO_BY}<br/>
						Last Updated By: ${UPDATE_BY} At ${UPDATE_DATE}</p>

						</div>
						<div class="column col-12">
						<br />
						<h4>Account Information</h4>

						Account Type: ${CATEGORY}<br />
						Account No: <spam class="text-bold text-primary">${MPHONE} </spam><br/>
						<p>Product Code: ${AC_TYPE_CODE}<br/>
						Agent: ${AGENT}[${AGENTAC}]</p>

						</div>
					</div>
					
				</div>
				
				<div class="column col-sm-6 hide-sm">
				<br />
				<h3 >
				Balance : <span class="text-success">BDT. ${BALANCE - LIEN_M}</span> 
				</h3>
				<p><span  class="text-error">Blocked Amount: BDT. ${LIEN_M}<br/></span>
				<span>Total Amount: </span>BDT. ${BALANCE}
				</p>
				<br />
					<h4 class="text-bold mt-2">KYC</h4>
					<p>Father Name: ${FATHER_NAME}<br />
						Mother Name: ${MOTHER_NAME}<br />
						Spouse Name: ${SPOUSE_NAME}<br />
						Date Of Birth: ${DATE_OF_BIRTH}<br />
						Gender:${SIM_NO}<br />
						ID :<br />
						TIN :,${TIN_NO}<br />
						Religion: ${RELIGION}</p>
				</div>
			</div>
		</div>
	</div>
</div>

`)
		})
	})
}
