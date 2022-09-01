/*api server url is in environment file*/
//const apiserver = '/api/'

const getNomi = async (param) => {
	const raw = JSON.stringify({
		id: `${param}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	try {
		await fetch(`${apiserver}/pages/customernom`, requestOptions).then((response) => response.json()).then((payload) => {
			payload.map((data) => {
				const {
					AC_NO,
					NAME,
					FATHER_NAME,
					MOTHER_NAME,
					ADDRESS,
					CONTACT_NO,
					NID_BIRTH_CERT,
					DOB,
					RELATION,
					PERCENTAGE
				} = data

				document.getElementById('nom').innerHTML += `<tr>
					<td class="text-tiny">${AC_NO}</td>
			<td class="text-tiny">${NAME}</td>
			<td class="text-tiny">${FATHER_NAME}</td>
			<td class="text-tiny">${MOTHER_NAME}</td>
			<td class="text-tiny">${ADDRESS}</td>
			<td class="text-tiny">${CONTACT_NO}</td>
			<td class="text-tiny">${NID_BIRTH_CERT}</td>
			<td class="text-tiny">${moment(DOB).format('ll')}</td>
			<td class="text-tiny">${RELATION}</td>
			<td class="text-tiny">${PERCENTAGE * 100}%</td>
			</tr>`
			})
		})
	} catch (error) {
		console.log(error)
	}
}
const getimage = async (param) => {
	const raw = JSON.stringify({
		id: `${param}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	try {
		await fetch(`${apiserver}//getimage`, requestOptions).then((response) => response.blob()).then((payload) => {
			console.log(payload)
			const img = document.createElement('img')
			const objectURL = URL.createObjectURL(payload)
			img.src = objectURL
			document.getElementById('img').appendChild(img)
		})
	} catch (error) {
		console.log(error)
	}
}

const custsearch = async () => {
	document.getElementById('btn-loading').classList.add('loading')
	let id = document.getElementById('acno').value

	document.getElementById('output').innerHTML = `        <div class="container p-2">
	<h5 class="text-center w100 text-bold p-2">Customer Information
	</h5>
	<div class="columns">
	  <div class="column col-8 w100 card noboder bg-gray p-2 " id="custinfo">
		<div class="loading" id="custinfoloading"></div>
	  </div>
	  <div class="column col-4 card noboder bg-gray p-2 w100">
		<h5 class="h5 text-primary text-clip">Image</h5>
		<div id="img"></div>
	  </div>
	</div>
	<div class="columns">


	  <div class="column col-12 card noboder bg-gray p-2 w100">
		<h5 class="h5 text-primary text-clip">Account Information</h5>
		<table class="table table-striped">
		  <thead>
			<tr>

			  <th class="text-tiny text-bold">AC No</th>
			  <th class="text-tiny text-bold">Reg Date</th>
			  <th class="text-tiny text-bold">Type</th>
			  <th class="text-tiny text-bold">Status</th>
			  <th class="text-tiny text-bold">Balance</th>
			  <th class="text-tiny text-bold">Lien</th>
			  <th class="text-tiny text-bold">Last Trans Date</th>
			  <th class="text-tiny text-bold">Link AC</th>
			  <th class="text-tiny text-bold">Profit</th>
			  <th class="text-tiny text-bold">Form Sl</th>
			  <th class="text-tiny text-bold">Agent</th>
			  <th class="text-tiny text-bold">Autho By</th>
			  <th class="text-tiny text-bold">Autho Date</th>
			</tr>
		  </thead>
		  <tbody id="acinfo">
		  </tbody>
		</table>


	  </div>
	  <div class="column col-12 card noboder bg-gray p-2 w100">


		<h5 class="h5 text-primary text-clip p-2">Nominee Information</h5>
		<table class="table table-striped">
		  <thead>
			<tr>
			  <th class="text-tiny text-bold">For AC</th>
			  <th class="text-tiny text-bold">Name</th>
			  <th class="text-tiny text-bold">Father Name</th>
			  <th class="text-tiny text-bold">Mother Name</th>
			  <th class="text-tiny text-bold">Address</th>
			  <th class="text-tiny text-bold">Contact Info</th>
			  <th class="text-tiny text-bold">UID</th>
			  <th class="text-tiny text-bold">Date of Birth</th>
			  <th class="text-tiny text-bold">Relation</th>
			  <th class="text-tiny text-bold">Share</th>
			</tr>
		  </thead>
		  <tbody id="nom">
		  </tbody>
		</table>


		<div class="column col-12">
		  <div class="columns">
			<!-- <div class="column col-6">
			  <h5 class="h5 text-primary text-clip">Authorization Information</h5>

			  <span class="text-tiny" id="autho">
				<div class="loading" id="autholoading"></div>
			  </span> -->
			<!-- </div>
			<div class="column col-6">
			  <h5 class="h5 text-primary text-clip">Introducer Information</h5>
			  <p class="text-tiny" id="intro">
			  <div class="loading" id="introloading"></div>
			  </p>
			</div> -->
		  </div>
		</div>
	  </div>
	</div>
  </div>
</div>
</div>

`

	const raw = JSON.stringify({
		id: `${id}`
	})
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}
	await getimage(id)
	try {
		await fetch(`${apiserver}//customerinfo`, requestOptions)
			.then((response) => response.json())
			.then((payload) => {
				payload.map((data) => {
					const {
						CUSTOMER_NAME,
						FATHER_NAME,
						MOTHER_NAME,
						SPOUSE_NAME,
						NID_NO,
						DOB,
						RELIGION,
						BLOOD_GROUP,
						OCCUPATION,
						TIN_NO,
						CON_MOB,
						PASSPORT_NO,
						PASSPORT_NO_VALIDITY,
						DRIVING_NO,
						ADDR,
						EMAIL,
						MARITAL_STATUS
					} = data

					document.getElementById('custinfo').innerHTML = `
			<h6 class="h6 text-primary">Genaral Information<h5/>
			<p class="text-tiny">
			Customer Name: ${CUSTOMER_NAME}<br/>
			Father Name: ${FATHER_NAME}<br/>
			Mother Name: ${MOTHER_NAME}<br/>
			Spouse Name: ${SPOUSE_NAME}<br/>
			NID: ${NID_NO}<br/>
			Birthday: ${moment(DOB).format('ll')}<br/>
			</p>
			<h6 class="h6 text-primary">Additional Information<h5/>
			<p class=" text-tiny">
			Religion: ${RELIGION}<br/>
			Blood Group: ${BLOOD_GROUP}<br/>
			Marital Status: ${MARITAL_STATUS}<br/>
			Occupation: ${OCCUPATION}<br/>
			Tin: ${TIN_NO}<br/>
			</p>
			<h6 class="h6  text-primary">Contact Information<h5/>
			<p class="text-tiny">
			Cell: +88${CON_MOB}<br/>
			Email: ${EMAIL}<br/>
			Passport: ${PASSPORT_NO} Valid untill ${PASSPORT_NO_VALIDITY}<br/>
			Driving permit no: ${DRIVING_NO}<br/>
			Address: ${ADDR}<br/>
			</p><br/>
			`
				})
			})
	} catch (error) {
		console.log(error)
	}
	// url = `${apiserver}//customeracinfo`
	try {
		await fetch(`${apiserver}//customeracinfo`, requestOptions)
			.then((response) => response.json())
			.then((payload) => {
				payload.map((data) => {
					const {
						REG_DATE,
						MPHONE,
						STATUS,
						BALANCE_M,
						LIEN_M,
						AC_TYPE_CODE,
						PMPHONE,
						FORM_SERIAL,
						DR_LINK_ACC,
						PROFIT,
						LAST_TRANS_DATE,
						AUTHO_BY,
						AUTHO_DATE
					} = data
					getNomi(MPHONE)
					document.getElementById('acinfo').innerHTML += `<tr>
					<td class="text-tiny">${MPHONE}</td>
			<td class="text-tiny">${moment(REG_DATE).format('lll')}</td>
			<td class="text-tiny">${AC_TYPE_CODE}</td>
			<td class="text-tiny">${STATUS}</td>
			<td class="text-tiny">${BALANCE_M.toLocaleString('en-BD', {
						maximumFractionDigits: 2,
						style: 'currency',
						currency: 'BDT'
					})}</td>
			<td class="text-tiny text-error">${LIEN_M}</td>
			<td class="text-tiny">${moment(LAST_TRANS_DATE).format('ll')}</td>
			<td class="text-tiny">${DR_LINK_ACC}</td>
			<td class="text-tiny">${PROFIT}%</td>
			<td class="text-tiny">${FORM_SERIAL}</td>
			<td class="text-tiny">${PMPHONE}</td>
			<td class="text-tiny">${AUTHO_BY}</td>
			<td class="text-tiny">${moment(AUTHO_DATE).format('lll')}</td>
			</tr>`
				})
			})
	} catch (error) {
		console.log(error)
	}

	document.getElementById('btn-loading').classList.remove('loading')
	document.getElementById('output').style.removeProperty('display')
	document.getElementById('btnprint').classList.remove('disabled')
}
