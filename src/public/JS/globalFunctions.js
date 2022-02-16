/* Printing Dialog and window genarated by this function. 
Remember: #output must be loaded
*/
const printArea = async () => {
	const printday = Date()
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
