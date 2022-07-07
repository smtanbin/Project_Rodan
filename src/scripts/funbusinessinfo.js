const businessinfo = async (fromm, tom) => {
	document.getElementById('btn-loading').classList.add('loading')
	/*Current date & time*/
	const printday = Date()
	var date = new Date()
	/*Current date & time*/

	if (fromm === null || fromm === '' || fromm === false) {
		fromm = false
	} else {
		fromm = `${fromm}`
	}
	if (tom === null || tom === '') {
		tom = new Date(date.getFullYear(), date.getMonth() - 1, 1)
	} else {
		tom = `${tom}`
	}

	/*api server url is in environment file*/
	const apiserver = ':3000/api/'

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')
	myHeaders.append('Access-Control-Allow-Origin', '*')
	cookies = cookies.split("=")
	myHeaders.append("Token", cookies[1])
	/* Post request body content*/
	const url = `${apiserver}///businessinfo`
	// previousmonth = moment(previousmonth).format('MMMM Do YYYY, h:mm:ss a')
	// console.log(previousmonth)
	// console.log(month)
	const raw = JSON.stringify({
		frommonth: `${fromm}`,
		tomonth: `${tom}`
	})
	// key: `${key}`
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	document.getElementById('pageTableOutput').innerHTML = `	
	<table id="pageTable" class="w100 p-1 table table-striped table-hover table-cluster">
	<thead>
	  <tr>
	  <th>SL.</th>
	  <th>Account No</th>
	  <th>Title</th>
	  <th>DOB</th>
	  <th>Gender</th>
	  <th>Agent</th>
	  <th>Balance</th>
	  </tr>
	</thead>
	<tbody id="pageTable">
	</tbody>
  </table>
	`

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('output').innerHTML = `<tr>
					<td class="text-tiny text-break" colspan="9">Null Found</td>
					</tr>`
		} else {
			payload.map(({ MPHONE, BALANCE, NAME, DOB, SIM_NO, PMPHONE }, index) => {
				let gender = 'O'
				switch (SIM_NO) {
					case 'M':
						gender = 'Male'
						break
					case 'F':
						gender = 'Female'
						break
					default:
						gender = 'Other'
				}

				if (index <= 299) {
					const mytable = document.getElementById('pageTable')
					let newRow = document.createElement('tr')
					let cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = index + 1
					cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = MPHONE
					cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = NAME
					cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = moment(DOB).format('ll')
					cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = gender
					cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = PMPHONE
					cell = document.createElement('td')
					newRow.appendChild(cell)
					cell.innerText = BALANCE
					mytable.appendChild(newRow)
				}
				// if (index === 49) document.getElementById('pageTable').innerHTML += `<tr><td><a>Load More</a></td></tr>`
			})
		}
	})

	document.getElementById('btn-loading').classList.remove('loading')
	document.getElementById('btnprint').classList.remove('disabled')
	document.getElementById('showmore').remove()
}
// document.getElementById('output').style.display = ''

/*************************************************************************************
 * 
 * Toggle Key
 * 
 * *********************************************************************************/

const enablePreviousMonth = () => {
	const inputtag = document.getElementById('frommonth')
	const spantag = document.getElementById('frommonthtext')
	inputtag.style.display = window.getComputedStyle(inputtag).display === 'none' ? 'block' : 'none'
	spantag.style.display = window.getComputedStyle(spantag).display === 'none' ? 'block' : 'none'
}

/*************************************************************************************
 * 
 * Busness Header
 * 
 * *********************************************************************************/

const businessinfoheader = async () => {
	document.getElementById('btn-loading').classList.add('loading')
	// document.getElementById('output').style.display = 'none'
	/*Constracting Url*/
	let frommonth = document.getElementById('frommonth').value
	let tomonth = document.getElementById('tomonth').value
	let keydata = document.getElementById('key').value

	var date = new Date()
	/*Current date & time*/
	if (keydata === null || keydata === '') {
		keydata = false
	}
	if (frommonth === null || frommonth === '') {
		frommonth = false
	} else {
		frommonth = `${frommonth}-01`
	}
	if (tomonth === null || tomonth === '') {
		tomonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
	} else {
		tomonth = `${tomonth}-01`
	}
	// console.log(month)

	/*api server url is in environment file*/
	const apiserver = ':3000/api/'

	/* Requesting part start here. */
	const myHeaders = new Headers()
	myHeaders.append('Content-Type', 'application/json')
	myHeaders.append('Access-Control-Allow-Origin', '*')

	/* Post request body content*/
	const url = `${apiserver}///businessinfoheader`
	// previousmonth = moment(previousmonth).format('MMMM Do YYYY, h:mm:ss a')
	// console.log(previousmonth)
	// console.log(month)
	const raw = JSON.stringify({
		from: `${frommonth}`,
		to: `${tomonth}`,
		key: `${keydata}`
	})
	// key: `${key}`
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	}

	let TotalAccount = 0
	let TotalBalance = 0

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null) {
			document.getElementById('output').innerHTML = `<tr>
					<td class="text-tiny text-break" colspan="9">Null Found</td>
					</tr>`
		} else {
			document.getElementById('output').innerHTML = `        <div class="card w100 p2">
			<h4 class="h4 text-bold text-center p-2 mt-2">
			  Account Opened Information
			</h4>
			<div class="columns col-gapless" >
			  <div class="column col-4 p-2" id="hedderdataleft">
			  </div>
			  <div class="column col-4 p-2" id="hedderdataright">
  
			  </div>
			  <div class="column col-12 p-2 w100">
				<button id="showmore" onclick="businessinfo(${frommonth},'${tomonth}',false)" class="btn btn-link p-centered" on>Show more</button>
			  </div>
			  <div class="container" id="pageTableOutput" id="btn-loading"></div>
			</div>
		  </div>`

			payload.map(({ MPHONE, BALANCE, SIM_NO }, index) => {
				TotalAccount += MPHONE
				TotalBalance += BALANCE
				let gender = 'O'
				switch (SIM_NO) {
					case 'M':
						gender = 'Male'
						break
					case 'F':
						gender = 'Female'
						break
					default:
						gender = 'Other'
				}
				document.getElementById('hedderdataleft').innerHTML += `
				<span class="text-bold">Total ${gender}: </span>${MPHONE}<br />`
				document.getElementById('hedderdataright').innerHTML += `
				<span class="text-bold">${gender} Balance: </span>${BALANCE}<br />
			  `
			})
			document.getElementById('hedderdataleft').innerHTML += `
			<span class="text-bold">Total Account:</span>${TotalAccount}<br />`

			document.getElementById('hedderdataright').innerHTML += `
			<span class="text-bold">Total Balance: </span>${TotalBalance}<br />`
		}
	})

	document.getElementById('btn-loading').classList.remove('loading')
	document.getElementById('btnprint').classList.remove('disabled')
}

// businessinfoheader

const renderTable = (payload) => {
	const mytable = document.getElementById('pageTable')
	payload.forEach((payload) => {
		let newRow = document.createElement('tr')
		Object.values(payload).forEach((value) => {
			let cell = document.createElement('td')
			cell.innerText = value
			newRow.appendChild(cell)
		})
		mytable.appendChild(newRow)
	})
}
