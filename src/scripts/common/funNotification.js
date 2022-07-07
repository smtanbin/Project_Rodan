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

						return `<div class="tile bg-gray p-2 my-1">
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
		if (payload != null) {
			payload.map(({ NAME_OF_MTC, BEN_NAME, STATUS, SEN_REM_AMT, REC_AGENT_ACC, ENTRY_DATE }, index) => {
				const titel = 'Remittance Request'
				const body = `A remittance request for remittance exchaange house<span class="text-primary text-bold"> ${NAME_OF_MTC} </span> with amount of ${SEN_REM_AMT.toLocaleString(
					'en-BD',
					{
						maximumFractionDigits: 2,
						style: 'currency',
						currency: 'BDT'
					}
				)}  have been requested by ${REC_AGENT_ACC}
					at ${moment(ENTRY_DATE).format('LLL')} for  ${BEN_NAME}`
				const time = moment(ENTRY_DATE).format('llll')
				const subtitel = STATUS

				bellIcon(index + 1)
				sendNotification(titel, subtitel, time, body, null)
			})
		}
	})
}

const dpsMaturity = async () => {
	const url = `${apiserveralt}dpsMaturity`
	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload != null) {
			payload.map(({ MPHONE, MATURITY_DATE, DOB, BALANCE_M, ENTRY_DATE, STATUS }, index) => {
				const titel = 'Mature TDR'
				const body = `${MPHONE}</span> is mature on <span class="text-bold">${moment(MATURITY_DATE).format(
					'L'
				)}</span> account Date of birth is <span class="text-bold">${moment(DOB).calendar()}</span>
				  
				& account Balance is ${BALANCE_M}.`
				const time = moment(ENTRY_DATE).format('llll')
				const subtitel = STATUS

				bellIcon(index + 1)
				sendNotification(titel, subtitel, time, body, null)
			})
		}

		// if (payload === null) {
		// 	document.getElementById('panel-body').innerHTML = ` `
		// } else {
		// 	document.getElementById('panel-body').innerHTML += payload
		// 		.map(({ MPHONE, MATURITY_DATE, DOB, BALANCE_M }, index) => {
		// 			bellIcon(index + 1)
		// 			return `<div class="tile bg-gray p-2 my-1">
		// 			<div class="tile-icon">
		// 			  <!-- <figure class="avatar avatar-lg"><img src="../img/avatar-2.png" alt="Avatar"></figure> -->
		// 			</div>
		// 			<div class="tile-content">
		// 			  <h6 class="tile-title text-primary h6 text-bold">Mature Request</h6>
		// 			  <p class="tile-subtitle text-tiny">
		// 			  <span class="text-primary text-bold">${MPHONE}</span> is mature on <span class="text-bold">${moment(
		// 				MATURITY_DATE
		// 			).format('L')}</span> account Date of birth is <span class="text-bold">${moment(
		// 				DOB
		// 			).calendar()}</span>

		// 			& account Balance is ${BALANCE_M}.
		// 			</p>
		// 			</div>

		// 		  </div>`
		// 		})
		// 		.join('')
		// }
	})
}
