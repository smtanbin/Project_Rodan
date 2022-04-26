/* Printing Dialog and window genarated by this function. 
Remember: #output must be loaded
*/
const printArea = async (titel) => {
	const printday = Date()
	if (titel === null) {
		titel = `Download ${printday}`
	}

	const username = document.getElementById('username').getAttribute('data-content')

	const head = `
	
	<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>
	  ${titel}
	</title>
	<link rel="stylesheet" href="/style/styles.css">
	<link rel="stylesheet" href="/style/spectre/spectre.css">
	<link rel="stylesheet" href="/style/spectre/spectre-icons.css">
	<link rel="stylesheet" href="/style/spectre/spectre-exp.css">


	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
	integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
	crossorigin="anonymous" referrerpolicy="no-referrer" defar></script>


  </head>
  <body class="m-2" id="renderthis">
  <div class="columns">
  <div class="column col-8">
<img src="/img/Standardbankltd.png" style="hight:" 35px";" class="img-responsive py-2 column col-8">
  </div>
  <div class="column col-4"><div class="column" style="roght=0"><div class="text-tiny"><b>Agent Banking Division</b><br/>
  <small>Standard Bank Ltd, Head Office<br/> Islam Chamber Building (8th Floor) 125/A Motijheel C/A, Dhaka-1000, Bangladesh <br/>Tel:+8802-9578385, 9612316428 +8801709654772-3 <br/>Email:agentbanking@standardbankbd.com <br/> www.standardbankbd.com</small>
  </div>
  </div></div>
</div>`

	const footer = `<div class="col-12 w100  p-2 mt-2 text-tiny">
	<b>Genarated by Id:</b> ${username}
	<b>Print Date:</b> ${printday}
	<p class="p-centered text-small">This is an electronically generated report, hence does not require a signature.</p>
	</div>
	<div class="text-center p-centered">
	
	<h6 class="text-bold h6">Thanks for banking with us.</h6>
	<p class="text-tiny p-2 text-left text-break">The Customer should examine promptly the statement received and notify the bank in writing within 15 calendar days after the statement is mailed,
   transmitted, or otherwise made available to customer of any errors, discrepancies or irregularities detected, failing which the statement will deem to
   be correct.This is an electronically generated report, hence does not require a signature.
   </p>
   <br/><a href="https://www.standardbankbd.com" class="text-gray text-tiny">Copyright © 2022 Standard Bank Ltd</a>
   </div>
  
 <script> 
	const load = () => {
		focus()
		print() 
		} 
	window.onload = load; 
 </script>
</body>`
	const printContent = document.getElementById('output')
	const WinPrint = window.open('', '', 'width=2480px,height=3508px')
	WinPrint.document.write(head + printContent.innerHTML + footer)
	WinPrint.document.close()
	WinPrint.focus()

	//Bring out the print popup
}
const pdfdl = async () => {
	const printday = Date()
	const username = document.getElementById('username').getAttribute('data-content')

	const head = `
	<print id="print'>
	<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>
	  Download ${printday}
	</title>
	<link rel="stylesheet" href="/style/styles.css">
	<link rel="stylesheet" href="/style/spectre/spectre.css">
	<link rel="stylesheet" href="/style/spectre/spectre-icons.css">
	<link rel="stylesheet" href="/style/spectre/spectre-exp.css">


	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
	integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
	crossorigin="anonymous" referrerpolicy="no-referrer" defar></script>


  </head>
  <body class="m-2" id="renderthis">
  <div class="columns">
  <div class="column col-8">
<img src="/img/Standardbankltd.png" style="hight:" 35px";" class="img-responsive py-2 column col-8">
  </div>
  <div class="column col-4"><div class="column" style="roght=0"><div class="text-tiny"><b>Agent Banking Division</b><br/>
  <small>Standard Bank Ltd, Head Office<br/> Islam Chamber Building (8th Floor) 125/A Motijheel C/A, Dhaka-1000, Bangladesh <br/>Tel:+8802-9578385, 9612316428 +8801709654772-3 <br/>Email:agentbanking@standardbankbd.com <br/> www.standardbankbd.com</small>
  </div>
  </div></div>
</div>`

	const footer = `<div class="col-12 w100  p-2 mt-2 text-tiny">
	<b>Genarated by Id:</b> ${username}
	<b>Print Date:</b> ${printday}
	<p class="p-centered text-small">This is an electronically generated report, hence does not require a signature.
	</p>
 </div>
 <div class="text-center p-centered">
	<h6 class="text-bold h6">Thanks for banking with us.</h6>
	<p class="text-tiny text-left text-break">The Customer should examine promptly the statement received and notify the bank in writing within 15 calendar days after the statement is mailed,
	   transmitted, or otherwise made available to customer of any errors, discrepancies or irregularities detected, failing which the statement will deem to
	   be correct.This is an electronically generated report, hence does not require a signature. 
	</p>
	<div class="card bg-gray w100">
	   <br/><a href="https://www.standardbankbd.com" class="text-gray text-tiny">Copyright © 2022 Standard Bank Ltd</a>
	</div>
 </div>

 <script> 
		let element = document.getElementById('renderthis');
		html2pdf(element, {
		  margin:       10,
		  filename:     'Download ${printday}.pdf',
		  image:        { type: 'png', quality: 1 },
		  html2canvas:  { scale: 2, logging: true, dpi: 192 },
		  jsPDF:        { unit: 'mm', format: 'A4', orientation: 'portrait' }
		}).set({
			pagebreak: { mode: 'avoid-all',before: 'tr' }
		  });
 </script>
</body>
</print>
`
	const printContent = document.getElementById('output')
	const WinPrint = window.open('', '', 'width=2480px,height=3508px')
	WinPrint.document.write(head + printContent.innerHTML + footer)
	WinPrint.document.close()

	//Bring out the print popup
}

const showmore = (id) => {
	if (document.getElementById(id).style.display === 'none') {
		document.getElementById(id).style.display = 'block'
	} else {
		document.getElementById(id).style.display = 'none'
	}
}
// const showless = (id) => {
// 	document.getElementById(id).classList.remove('displaynull')
// }

const bellIcon = (notificationcount) => {
	// notificationcount += notificationcount
	// if (notificationcount === 0 || notificationcount === null) {

	if (notificationcount === 0 || notificationcount === undefined) {
		document.getElementById('navbtn').innerHTML = `<i class="material-icons">notifications_none</i>`
	} else {
		document.getElementById('navbtn').innerHTML = `<i class="material-icons">notifications_active</i>`
	}

}
bellIcon()

const logout = () => {
	document.cookie = 'auth' + '=; Max-Age=-99999999;'
	window.location.href = '/'
}

/*
Browser compatibility Issue  bug 1578503
https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter

	"backdrop-filter" not working

	To solve it bg-frost replaced with bg-gray
*/

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
	// window.alert('Firefox not supported')
	document.getElementById('navbar').classList.remove('bg-frost')
	document.getElementById('navbar').classList.add('bg-gray')
}

const sendNotification = (titel, subtitel, time, body, action) => {
	if (titel === null || titel === body) {
		document.getElementById('panel-body').innerHTML = ` `
	} else if (action === null) {
		document.getElementById('panel-body').innerHTML += `<div class="tile">
		<div class="tile-icon">
		<!-- <figure class="avatar avatar-lg"><img src="../img/avatar-3.png" alt="Avatar"></figure> -->
		</div>
		<div class="tile-content">
		<small class="text-primary">${time}</small>
		  <p class="tile-title">${titel}</p>
		  <sup>${subtitel}</sup>
		  <p class="tile-subtitle">${body}</p>
		  <div class="tile-action">
		  </div>
		</div>
	  </div>`
	} else {
		document.getElementById('panel-body').innerHTML += `<div class="tile">
		<div class="tile-icon">
		<!-- <figure class="avatar avatar-lg"><img src="../img/avatar-3.png" alt="Avatar"></figure> -->
		</div>
		<div class="tile-content">
		<small class="text-primary">${time}</small>
		  <p class="tile-title">${titel}</p>
		  <sup>${subtitel}</sup>
		  <p class="tile-subtitle">${body}</p>
		  <div class="tile-action">
		  ${action}
		  </div>
		</div>
	  </div>`
	}
}

const notificationFun = () => {
	try {
		dpsMaturity()
		cashnotification()
		reminotification()
		notificationFun()
	} catch (e) {
		console.log('Error in notification function init ' + e)
	}
}
