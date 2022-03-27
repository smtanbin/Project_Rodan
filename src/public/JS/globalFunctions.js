/* Printing Dialog and window genarated by this function. 
Remember: #output must be loaded
*/
const printArea = async () => {
	const printday = Date()
	const username = document.getElementById('username').getAttribute('data-content')

	const head = `<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>
	  download
	</title>

	<link rel="stylesheet" href="/style/styles.css">
	<link rel="stylesheet" href="/style/spectre/spectre.css">
	<link rel="stylesheet" href="/style/spectre/spectre-icons.css">
	<link rel="stylesheet" href="/style/spectre/spectre-exp.css">

  </head>
  <body class="m-2">
  
  `

	const header = `<div class="columns">
  <div class="column col-9">
  <img src="/img/Standardbankltd-color.svg" style="hight:" 25px";" class="img-responsive py-2 column col-5">
  </div>
  <div class="column col-3"><div class="column" style="roght=0"><h5 class="text-clip h5">Agent Banking</h5></div></div>
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
	   <span class="text-tiny">
	   Agent Banking Division <br/>
	   Standard Bank Ltd. Head Office, Metropolitan Chamber Building (3rd Floor) 122-124 Motijheel C/A, Dhaka-1000, Bangladesh <br/>Tel:+8802-9578385 +8802 9612-316428 +8801 709-654772 +8801 709-654773 Email: agentbanking@standardbankbd.com
	   </span>
	   <br/><a href="https://www.standardbankbd.com" class="text-gray text-tiny">Copyright © 2022 Standard Bank Ltd</a>
	</div>
 </div>
 <script> 
	const load = () => {
		focus()
		print() 
		} 
	window.onload = load; 
 </script>
</body>

`
	const printContent = document.getElementById('output')
	const WinPrint = window.open('', '', 'width=2480px,height=3508px')
	WinPrint.document.write(head + header + printContent.innerHTML + footer)
	WinPrint.document.close()
	// WinPrint.focus()

	//Bring out the print popup
}

// const loadingbtn = (state) =>{
//     if (state === 'on'){
//         document.getElementsById("btn-loading").classList.add("loading");
//     }else{
//         document.getElementsById('btn-loading').classList.remove('loading');

//     }
// }

const binSearch = (arr, x, start, end) => {
	// Base Condition
	if (start > end) return false

	// Find the middle index
	let mid = Math.floor((start + end) / 2)

	// Compare mid with given key x
	if (arr[mid] === x) return true

	// If element at mid is greater than x,
	// search in the left half of mid
	if (arr[mid] > x) return recursiveFunction(arr, x, start, mid - 1)
	else
		// If element at mid is smaller than x,
		// search in the right half of mid
		return recursiveFunction(arr, x, mid + 1, end)
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

// const bellIcon = (notificationcount) => {
// 	// notificationcount += notificationcount
// 	// if (notificationcount === 0 || notificationcount === null) {

// 	if (notificationcount === 0 || notificationcount === undefined) {
// 		document.getElementById(
// 			'navbtn'
// 		).innerHTML = `<div class="chip text-dark p-1"><i class="material-icons ">notifications_none</i></div>`
// 	} else {
// 		document.getElementById(
// 			'navbtn'
// 		).innerHTML = `<div class="chip text-error p-1"><i class="material-icons ">notifications_active</i> New Notification</div>`
// 	}
// 	// } else {
// 	// 	document.getElementById('navbtn').innerHTML = ` <span class="badge" data-badge="${notificationcount}">
// 	//     <i class="material-icons">notifications_active</i>
// 	//     </span>`
// 	// }
// }
// bellIcon()

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
