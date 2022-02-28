/*api server url is in environment file*/
const apiserveralt = '/api/'

/* Requesting part start here. */
const newHeaders = new Headers()
newHeaders.append('Content-Type', 'application/json')
newHeaders.append('Access-Control-Allow-Origin', '*')
const requestOptions = {
	method: 'GET',
	headers: newHeaders,
	redirect: 'follow'
}

const nvl = (data, alternative) => {
	if ((data = null)) {
		return alternative
	} else {
		return data
	}
}

const cashnotification = async () => {
	const url = `${apiserveralt}cashEntry`

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('panel-body').innerHTML = ` `
		} else {
			document.getElementById('panel-body').innerHTML += payload
				.map(
					(
						{
							MSG,
							TRANS_NO,
							AC_NO,
							TRACER_NO,
							ADVICE_NO,
							AMOUNT,
							TRANS_DATE,
							CREATE_USER,
							CHECKED_USER,
							CHECKED_DATE
						},
						index
					) => {
						// index += notificationcount
						bellIcon(index + 1)

						return `<div class="tile bg-gray p-2">
					<div class="tile-icon">
					  <!-- <figure class="avatar avatar-lg"><img src="../img/avatar-2.png" alt="Avatar"></figure> -->
					</div>
					<div class="tile-content">
					  <h6 class="tile-title text-primary h6 text-bold">Cash Load</h6>
					  <p class="tile-subtitle text-tiny">
					  Amount of <span class="text-primary text-bold">${AMOUNT.toLocaleString('en-BD', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						})} </span> have been created by ${nvl(CREATE_USER, 0)}
                      at ${nvl(
							moment(TRANS_DATE).format('LLL'),
							0
						)} with Tr no. ${TRANS_NO}; Tracer No: ${TRACER_NO} and Advice No: ${ADVICE_NO} for <span class="text-primary">${AC_NO}<span/>
                      <br/>
					  Item Check By: ${nvl(CHECKED_USER, 0)} at ${nvl(CHECKED_DATE, 0)}

					  </p>
					  <h5>${MSG}</h5>
					  <p>
					  
					  <!-- button class="btn btn-primary btn-sm">Join</button> -->
					  <!-- button class="btn btn-sm">Contact</button> -->
					  </p>
					</div>

				  </div>`
					}
				)
				.join('')
		}
	})
}

const reminotification = async () => {
	const url = `${apiserveralt}remittanceRequest`
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('panel-body').innerHTML = ` `
		} else {
			document.getElementById('panel-body').innerHTML += payload
				.map(({ NAME_OF_MTC, BEN_NAME, AUTHO_DATE, SEN_REM_AMT, REC_AGENT_ACC }, index) => {
					bellIcon(index + 1)

					return `<div class="tile bg-gray p-2">
					<div class="tile-icon">
					  <!-- <figure class="avatar avatar-lg"><img src="../img/avatar-2.png" alt="Avatar"></figure> -->
					</div>
					<div class="tile-content">
					  <h6 class="tile-title text-primary h6 text-bold">Remittance Request</h6>
					  <p class="tile-subtitle text-tiny">
					  A remittance request for remittance exchaange house<span class="text-primary text-bold"> ${NAME_OF_MTC} with amount of ${SEN_REM_AMT.toLocaleString(
						'en-BD',
						{
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'BDT'
						}
					)} </span> have been requested by ${REC_AGENT_ACC}
                      at ${moment(AUTHO_DATE).format('LLL')} for  ${BEN_NAME}
					  
			
					  </p>
					</div>

				  </div>`
				})
				.join('')
		}
	})
}
const dpsMaturity = async () => {
	const url = `${apiserveralt}dpsMaturity`
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('panel-body').innerHTML = ` `
		} else {
			document.getElementById('panel-body').innerHTML += payload
				.map(({ MPHONE, MATURITY_DATE, DOB, BALANCE_M }, index) => {
					bellIcon(index + 1)
					return `<div class="tile bg-frost p-2">
					<div class="tile-icon">
					  <!-- <figure class="avatar avatar-lg"><img src="../img/avatar-2.png" alt="Avatar"></figure> -->
					</div>
					<div class="tile-content">
					  <h6 class="tile-title text-primary h6 text-bold">Mature Request</h6>
					  <p class="tile-subtitle text-tiny">
					  <span class="text-primary text-bold">${MPHONE}</span> is mature on <span class="text-bold">${moment(
						MATURITY_DATE
					).format('LLL')}</span>  account Date of birth is ${moment(DOB).format('LLL')}
					  
					Account Balance is ${BALANCE_M}
					</p>
					</div>

				  </div>`
				})
				.join('')
		}
	})
}

const bellIcon = (notificationcount) => {
	// notificationcount += notificationcount
	if (notificationcount === 0) {
		document.getElementById('navbtn').innerHTML = `
        <i class="material-icons">notifications</i>
        `
	} else {
		document.getElementById('navbtn').innerHTML = ` <span class="badge" data-badge="${notificationcount}">
        <i class="material-icons">notifications_active</i>
        </span>`
	}
}

const notificationFun = () => {
	try {
		dpsMaturity()
		cashnotification()
		reminotification()
		bellIcon()
	} catch (e) {
		console.log('Error in notification function init ' + e)
	}
}
notificationFun()
