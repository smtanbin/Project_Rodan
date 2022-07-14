const table_dtl = async () => {
  const url = `${apiserver}/fundmanagement/pendingEftList`
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      payload.sort()
      let total = 0
      payload.map(
        (
          {
            ACTNUM,
            RECIVER,
            ABS_AC_TITEL,
            AMOUNT,
            ORIG_BANK_NAME,
            ORIG_BRANCH_NAME,
            SENDER,
            NOTE,
          },
          index
        ) => {
          document.getElementById("table_cell_dtl").innerHTML += `
          <tr>
          <td class="text-tiny">${index + 1}
          <td class="text-tiny text-clip text-left text-black">${ACTNUM}
          <td class="text-tiny ">${RECIVER}
          <td class="text-tiny text-break">${ABS_AC_TITEL}
          <td class="text-tiny text-center ">${ORIG_BANK_NAME}
          <td class="text-tiny text-center">${ORIG_BRANCH_NAME}
          <td class="text-tiny text-ellipsis text-lowercase">${SENDER}
          <td class="text-tiny text-clip text-right text-black">${AMOUNT.toLocaleString(
            "en-BD",
            {
              maximumFractionDigits: 2,
            }
          )}
          <td class="text-tiny text-break text-center ">${NOTE}
          </td>
          </tr>`
          total += AMOUNT
        }
      )
      document.getElementById("table_cell_dtl").innerHTML += `
          <tr class="active">
          <td colspan="7"> Total</td>
          
          <td class="text-tiny text-clip text-right text-black">${total.toLocaleString(
        "en-BD",
        {
          maximumFractionDigits: 2,
        }
      )}
            
            </td>
            <td colspan="1"></td>
          </tr>`
    })
  document.getElementById("table_dtl").classList.remove("d-none")
  document.getElementById("progress").classList.add("d-none")
}

const beftninit = async () => {
  let currentdate = Date()
  // currentdate = moment(currentdate).format("lll")

  document.getElementById("output").innerHTML = `
        
 
      <small class="text-bold text-center text-primary text-uppercase">Pending eft list ${moment(
    currentdate
  ).format("ll")}</small>


      <table class="col-4 table table-striped table-cluster d-none" id="table_summery">
      <thead class="text-black">
      <tr colspan="3">
      Summery
      </tr>
      <tr>
      <th class="text-small text-left">Product</th>
      <th class="text-small text-center">Type</th>
      <th class="text-small text-right">Amount</th>
      </tr></thead>
      <tbody id="table_cell_summery">
      
      </tbody>
      </table>
<br/>
    <table class="m-2 table table-striped table-cluster d-none" id="table_dtl">
      <thead>
      <tr colspan="8" class="text-center text-bold">Detail List
      </tr>
      <tr class="text-black  active">
   
        <th class="text-tiny">SL</th>
        <th class="text-tiny text-clip text-left">Account No</th>
        <th class="text-tiny text-left">Reciver</th>
        <th class="text-tiny text-break">ABS Account Titel</th>
        <th class="text-tiny text-center">Origin Bank</th>
        <th class="text-tiny">Origin Branch</th>
        <th class="text-tiny">Sender</th>
        <th class="text-tiny text-clip text-right">Amount</th>
        <th class="text-tiny text-break">Note</th>
        </tr></thead>
        <tbody id="table_cell_dtl"></tbody>
    </table>`
  /* Post request body content*/
  let url = `${apiserver}/fundmanagement/pendingEftSumm`

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }
  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      if (payload.length === 0) {
        document.getElementById("output").innerHTML = `
        <div class="empty"><div class="empty-icon"><i class="icon icon-people"></i> </div>
        <p class="empty-title h5">404</p>
        <p class="empty-subtitle">No pending request. Tyr refrash or came bark later.</p>
        <div class="empty-action"><button class="btn" onclick="init()">Reload</button></div></div>`
        document.getElementById("progress").classList.add("d-none")
      } else {
        payload.map(({ TYPE, COUNT, SUM }) => {
          document.getElementById("table_cell_summery").innerHTML += `
          <tr>
          <td class="text-tiny text-left">${TYPE}
          <td class="text-tiny text-center">${COUNT}
          <td class="text-tiny text-clip text-right text-black">${SUM.toLocaleString(
            "en-BD",
            {
              maximumFractionDigits: 2,
            }
          )}
          </tr>`
        })
        table_dtl()
        document.getElementById("table_summery").classList.remove("d-none")
      }
    })
}

const printAreafundmng = async (titel) => {
  const printday = Date()
  if (titel === null) {
    titel = `Download ${printday}`
  }

  const username = document
    .getElementById("username")
    .getAttribute("data-content")

  const head = `<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    ${titel}
  </title>
  <link rel="apple-touch-icon" sizes="57x57" href="/img/favicon/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/img/favicon/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/img/favicon/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/img/favicon/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/img/favicon/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/img/favicon/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/img/favicon/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/img/favicon/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="144x144" href="/img/favicon/android-icon-144x144.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/img/favicon/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/img/favicon/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png">
  <link rel="manifest" href="/img/favicon/manifest.json">
  <meta name="msapplication-TileImage" content="/img/favicon/ms-icon-144x144.png">

  <link rel="stylesheet" href="/style/styles.css">
  
      <link rel="stylesheet" href="/style/spectre/bright/spectre.css">
      <link rel="stylesheet" href="/style/spectre/bright/spectre-icons.css">
      <link rel="stylesheet" href="/style/spectre/bright/spectre-exp.css">
      <link rel="stylesheet" href="/style/spectre/bright/background.css">

	  	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
	integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
	crossorigin="anonymous" referrerpolicy="no-referrer" defar></script>

</head>





  <body class="m-2" id="renderthis">
  <img src="/img/Standardbankltd.png" style="height:30px;" class="p-centered img-responsive ">
  </div>
</div>`

  const footer = `<div class="col-12 w100  p-2 mt-2 text-tiny">
	<b>Genarated by Id:</b> ${username}
	<b>Print Date:</b> ${printday}
	<p class="p-centered text-small">This is an electronically generated report, hence does not require a signature.</p>
	</div>
	<div class="text-center p-centered">

<a href="https://www.standardbankbd.com" class="text-gray text-tiny">Copyright © 2022 Standard Bank Ltd</a>
   </div>
  
 <script> 
	const load = () => {
		focus()
		print() 
		} 
	window.onload = load; 
 </script>
</body>`
  const printContent = document.getElementById("output")
  const WinPrint = window.open("", "", "width=2480px,height=3508px")
  WinPrint.document.write(head + printContent.innerHTML + footer)
  WinPrint.document.close()
  WinPrint.focus()

  //Bring out the print popup
}

beftninit()
