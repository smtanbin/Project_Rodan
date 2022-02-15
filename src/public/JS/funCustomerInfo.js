/*api server url is in environment file*/
const apiserver = '/api/'
/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

const custsearch = async () => {
	document.getElementById('btn-loading').classList.add('loading')
	const url = `${apiserver}/customerinfo`
	let id = document.getElementById('acno').value
	console.log(id)

	const raw = JSON.stringify({
		id: `${id}`
	})
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
				LINK_AC,
				TIN_NO,
				RELIGION
			} = data

			document.getElementById('output').innerHTML = `

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
								Photo: <img src:"${IMGAE}">
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
						Link Account: ${LINK_AC}}<br/>
						Agent: ${AGENT}[${AGENTAC}]
						</p>

						</div>
						
					</div>
					
				</div>
				
				<div class="column col-sm-6 hide-sm">
				<br />
				<h3 >
				Balance : <span class="text-success">${(BALANCE - LIEN_M).toLocaleString('en-BD', {
					maximumFractionDigits: 2,
					style: 'currency',
					currency: 'BDT'
				})}</span> 
				</h3>
				<p><span  class="text-error">Blocked Amount:${LIEN_M.toLocaleString('en-BD', {
					maximumFractionDigits: 2,
					style: 'currency',
					currency: 'BDT'
				})}<br/></span>
				<span>Total Amount: </span>${BALANCE.toLocaleString('en-BD', {
					maximumFractionDigits: 2,
					style: 'currency',
					currency: 'BDT'
				})}
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
						Photo: <img src:"${IMGAE}">
				</div>
			</div>
		</div>
	</div>
</div>

`
		})
	})

	document.getElementById('btn-loading').classList.remove('loading')
	document.getElementById('btnprint').classList.remove('disabled')
}
