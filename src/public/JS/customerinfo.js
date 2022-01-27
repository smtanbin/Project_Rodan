const custsearch = () => {
	const apiserver = 'http://127.0.0.1/api'
	const url = `${apiserver}/customerinfo`
	let id = document.getElementById('acno').value
	console.log(id)
	fetch(url, {
		method: 'POST',
		body: {
			id: `${id}`
		}
	})
		.then((response) => response.json())
		.then((payload) => {
			payload.map((data) => {
				const {
					REG_DATE,
					REG_STATUS,
					NAME,
					IMGAE,
					FATHER_NAME,
					MOTHER_NAME,
					SPOUSE_NAME,
					DATE_OF_BIRTH,
					RELIGION
				} = data

				document.getElementById('output').innerHTML += `
				<div class="card bg-gray col-12 p-2">
				<div class="p-2">
				<div class="column col-xs-6">
          <h4>Name: ${NAME}</h4>
          <h6>Status: ${REG_STATUS}</h6>
		  <h6>Reg date:${REG_DATE}</h6>
        </div>
        <div class="column col-xs-3">
		<img scr="${IMGAE}.jpg"/>
		</div>
        <div class="column col-12">
        
		  <p>Father Name: ${FATHER_NAME}<br/>
		  Mother Name: ${MOTHER_NAME}<br/>
		  Spouse Name: ${SPOUSE_NAME}<br/>
		  Date Of Birth: ${DATE_OF_BIRTH}<br/>
		  Religion: ${RELIGION}</p>	  
		 
          <div class="column col-3">col-xs-6</div>
          <div class="column col-3">col-xs-6</div></div></div>
                `
			})
		})
}
