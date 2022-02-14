/*api server url is in environment file*/
const apiserver = '/api/'
/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Access-Control-Allow-Origin', '*')

const timeline = async () => {
	



	
	const url = `${apiserver}/timeline`
	
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}

	await fetch(url, requestOptions).then((response) => response.json()).then((payload) => {
		if (payload === null){
			document.getElementById('timeline').innerHTML += `
			<tr>
			<td colspan="14"> No Data Found!</td>
			
			</tr>`
		} else{
		payload.map((data) => {
			const {
				TRANS_NO,
				TRANS_DATE,
				TRANS_FROM,
				TRANS_TO,
				REF_PHONE,
				PAY_AMT,
				MERCHANT_SNAME,
				MSG_AMT,
				SCHARGE_AMT,
				PARTICULAR,
				CODE,
				NOTE,
				FROM_GL,
				TO_GL
			} = data

			document.getElementById('timeline').innerHTML += `
			<tr>
			<td class="text-tiny">${new Date(TRANS_DATE).toDateString()}</td>
			<td class="text-tiny text-primary">${TRANS_NO}</td>
			<td class="text-tiny">${CODE}</td>
			<td class="text-tiny" py-1>${TRANS_FROM}</td>
			<td class="text-tiny" py-1>${FROM_GL}</td>
			<td class="text-tiny" py-1>${TRANS_TO}</td>
			<td class="text-tiny" py-1>${TO_GL}</td>
			<td class="text-tiny">${PAY_AMT}</td>
			<td class="text-tiny text-success">${MSG_AMT}</td>
			<td class="text-tiny text-warning">${SCHARGE_AMT}</td>
			<td class="text-tiny">${MERCHANT_SNAME}</td>
			<td class="text-tiny">${REF_PHONE}</td>
			<td class="text-tiny">${NOTE}</td>
			<td class="text-tiny">${PARTICULAR}</td>
			</tr>`
		})
	}
	})
document.getElementById('loading').remove()
}


timeline()


// search function for contact
const search = () =>  {
	let input, UpperCasefilter, table, tr, td, i, txtValue
	input = document.getElementById('search')
	UpperCasefilter = input.value.toUpperCase()
	table = document.getElementById('timeline')
	tr = table.getElementsByTagName('tr')
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName('td')[0]
		if (td) {
			txtValue = td.textContent || td.innerText
			if (txtValue.toUpperCase().indexOf(UpperCasefilter) > -1) {
				tr[i].style.display = ''
			} else {
				tr[i].style.display = 'none'
			}
		}
	}
}