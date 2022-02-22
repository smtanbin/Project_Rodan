let notificationcount = 0
/*api server url is in environment file*/
const apiserveralt = '/api/'

/* Requesting part start here. */
const xHeaders = new Headers()
xHeaders.append('Content-Type', 'application/json')
xHeaders.append('Access-Control-Allow-Origin', '*')
const nvl = (data, alternative) => {
	if ((data = null)) {
		return alternative
	} else {
		return data
	}
}

const notification = async () => {
	const url = `${apiserveralt}cashEntry`

	const requestOptions = {
		method: 'GET',
		headers: xHeaders,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('panel-body').innerHTML = ` `
		} else {
			document.getElementById('panel-body').innerHTML = payload
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
						notificationcount += 1

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
							TRANS_DATE,
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
notification()
