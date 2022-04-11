/*api server url is in environment file*/
//const apiserver = '/api/'

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

const getkyc = async () => {
	let param = document.getElementById('acno').value

	/* Post request body content*/
	const url = `${apiserver}/getkyc`
	const raw = JSON.stringify({
		param: `${param}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	try {
		await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
			payload.map(({ NAME, CUST_ID, AC_TYPE_CODE, PURPS_AC_OPN, SOURCE_OFFUND, CODE }, index) => {
				document.getElementById('output').innerHTML = `
                <div class="card w100 col-12 p-centered">

  <div class="card-titel text-primary bg-gray w100 h2" style="padding: 1rem;"><i class="icon icon-people"></i> Update
    Info for ${param}</div>
  <div class="card-body columns my-2">
    <form class=" p-2 form-horizontal col-12 col-sm-12">
      <!-- titel -->
      <div class="form-group col-12">
        <div class="col-3 col-sm-12">
          <label class="form-label" for="input-example-1">Titel</label>
        </div>
        <div class="col-9 col-sm-12">
        <p class="text-bold text-primary">: ${NAME}</p>
        </div>
      </div>
      <!-- cin -->
      <div class="form-group">
        <div class="col-3 col-sm-12">
          <label class="form-label" for="input-example-1">CIN</label>
        </div>
        <div class="col-9 col-sm-12">
        <p class="text-bold">: ${CUST_ID}</p>
     

        </div>
      </div>
      <!-- Account Type  -->
      <div class="form-group">
        <div class="col-3 col-sm-12">
          <label class="form-label" for="input-example-1">Type</label>
        </div>
        <div class="col-9 col-sm-12">
        <p class="text-bold">: ${AC_TYPE_CODE}</p>
        <!--<input class="form-input disabled" type="text" placeholder="${AC_TYPE_CODE}"/>-->
        </div>
      </div>


      <!-- Purpose of Account Opening  -->
      <div class="form-group">
        <div class="col-3 col-sm-12">
          <label class="form-label" for="input-example-1">Purpose of Account Opening</label>
        </div>
        <div class="col-9 col-sm-12">
        <p class="text-bold">: ${PURPS_AC_OPN}</p>
          
          </div>
          </div>
          <!-- Source Of Fund   -->
          <div class="form-group">
          <div class="col-3 col-sm-12">
          <label class="form-label" for="input-example-1">Source Of Fund </label>
          </div>
          <div class="input-group col-9 col-sm-12">
          <p class="text-bold">: ${SOURCE_OFFUND}</p>
        </div>
      </div>
      <!-- Source Of Fund   -->
      <div class="form-group">
        <div class="col-3 col-sm-12">
          <label class="form-label" for="input-example-1">Eco Sector Code </label>
        </div>
        <div class="input-group col-9 col-sm-12">
        <p class="text-primary text-bold">: ${CODE}</p>
        
         
        </div>
      </div>
    </form>

  </div>

  <div class="card-footer bg-gray">
    <div class="input-group">
      <span class="input-group-addon">Set Code</span>
      <!-- dropdown -->
      <select class="form-select" id="sbscode">
      </select>

      </div>
      <div class="toast d-invisible my-1" id="success">
      
    </div>
      <button onclick="addCode('${param}')" class="btn btn-primary input-group-btn mt-2 w100">Save</button>
  
      </div>
      
 
</div>`
			})
		})
	} catch (e) {
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
        
        <h4 class="empty-title h2 text-error">Stop Code 404</h4>
        <p class="empty-title h2 text-error">Fail to get Header</p>
        <p class="empty-subtitle">${e}</p>
        
        </div>`
	}
	sectorCodeList()
}

/* This is the main function that generated the statement.
*/
const sectorCodeList = async () => {
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}
	try {
		await fetch(`${apiserver}/sectorcodelist`, requestOptions)
			.then((response) => response.json())
			.then(async (payload) => {
				payload.map(({ CODE, DESCRIPTION }) => {
					if (output != 0) {
						document.getElementById(
							'sbscode'
						).innerHTML += `<option value='${CODE}'>${DESCRIPTION}</option>`
					} else {
						document.getElementById(
							'sbscode'
						).innerHTML += `<option class="text-ellipsis col-6">List is empty</option>`
					}
				})
			})
	} catch (e) {
		document.getElementById('btn-loading').classList.remove('loading')
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		<h4 class="empty-title h2 text-error">Error Stop code 404!</h4>
		<p class="empty-title h2 text-error">${e}.</p>
	</div>`
	}
}
const addCode = async (param) => {
	let code = document.getElementById('sbscode').value

	/* Post request body content*/
	const url = `${apiserver}/addkyc`
	const raw = JSON.stringify({
		acno: `${param}`,
		code: `${code}`
	})

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}
	try {
		// await fetch(url, requestOptions).then((response) => response.json())
		await fetch(url, requestOptions).then((response) => {
			const ele = document.getElementById('success')
			if (response.status === 302) {
				ele.classList.remove('d-invisible')
				ele.classList.add('toast-error')
				ele.textContent = 'Value already present'
			}
			if (response.status === 201) {
				ele.classList.remove('d-invisible')
				ele.classList.add('toast-success')
				ele.textContent = 'Success'
			}
		})
	} catch (e) {
		document.getElementById('btn-loading').classList.remove('loading')
		document.getElementById('output').innerHTML = `<div class="empty col-12 w100">
		<h4 class="empty-title h2 text-error">Error Stop code 404!</h4>
		<p class="empty-title h2 text-error">${e}.</p>
	</div>`
	}
}
