const getMonth = (param) => {
  if (param < 9) {
    param = param.slice(1, 2)
  }

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August ",
    "September",
    "October",
    "November",
    "December",
  ]
  return month[param]
}

const nullfilder = (param) => {
  if (param === 0 || param === -0) {
    return "-"
  } else return param
}

const mis_part1 = async () => {
  const fig_in_lac = 100000
  let param = document.getElementById("param").value.split("-")
  let temp_year = param[0]
  let temp_month = param[1]
  const current_month = current_date.getMonth() + 1
  const current_year = current_date.getFullYear()
  if (current_month <= temp_month && current_year <= temp_year) {
    alert("Report Must be Previous Month")
  } else {
    // ;<h4 class="h4 text-bold text-small mt-2">Authorised Signature</h4>
    document.getElementById("progress").classList.remove("d-hide")
    document.getElementById(
      "output"
    ).innerHTML = `<div class="columns m-2 w100">

    <div class="columns w100 col-12">
  <div class="column col-9 float-left">
    <img src="/img/Standardbankltd.png" class="mb-1 float-left img-responsive col-4">
  </div>
  
  <div class="column col-3 float-right">
  <span class=" float-left" style="font-Size:11px;">
  <span class="text-bold float-left text-black ">Agent Banking Division</span> <br/>
  Standard Bank Ltd, Head Office Islam Chamber Building (8th Floor) 125/A Motijheel C/A, Dhaka-1000, Bangladesh Tel:+8802-9578385, 9612316428 +8801709654772-3 Email: agentbanking@standardbankbd.com www.standardbankbd.com</span>
  </div>
  </div>
                                          
                    <table class="table text-black  table-claster table-striped text-tiny m-2 p-1" 
                    >
                        <thead>

                            <tr>
                           
                            <th  colspan="19" class="text-black text-center bg-none" style="border:0;" >
                            Agent Wise Comparative Business Performance for ${getMonth(
      temp_month
    )}, ${current_year}
                            </th>
                            </tr>
                            <tr>
                            <th colspan="19" class="text-small text-left">(Figure In Lac)</th>
                            
                            
                            </tr>
                        <tr class="active bg-gray">
                                <th rowspan="2" class=" text-center text-small ">Sl</th>
                                <th rowspan="2" class=" text-small text-left text-clip  w100">Name of Agent</th>
                                <th rowspan="2" class=" text-small text-center">Date of Opening</th>
                                <th colspan="3" class=" text-center">No of Accounts</th>
                                <th colspan="3" class=" text-center">Deposit</th>
                                <th colspan="3" class=" text-center">F. Remittance</th>
                                <th colspan="3" class=" text-center">Utility</th>
                                <th colspan="3" class="text-center">Commision</th>
                                <th rowspan="2" colspan="3" class=" text-small text-left">Remarks</th>
                            </tr>
                            <tr class="bg-gray">
                                
                                <th class="text-tiny text-right">Previous</th>
                                <th class="text-tiny text-right">Current</th>
                                <th class="text-tiny text-right">Possition</th>
                                <th class="text-tiny text-right">Previous</th>
                                <th class="text-tiny text-right ">Current</th>
                                <th class="text-tiny text-right">Possition</th>
                                <th class="text-tiny text-right">Previous</th>
                                <th class="text-tiny text-right">Current</th>
                                <th class="text-tiny text-right">Possition</th>
                                <th class="text-tiny text-right">Previous</th>
                                <th class="text-tiny text-right">Current</th>
                                <th class="text-tiny text-right">Possition</th>
                                <th class="text-tiny text-right">Previous</th>
                                <th class="text-tiny text-right">Current</th>
                                <th class="text-tiny text-right">Possition</th>
                            </tr>
                        </thead>

                        <tbody id="table_output">
                        </tbody>

                    </table>
                  </div>`

    let temp_current_bill_amount = 0,
      temp_current_com = 0,
      temp_current_deposit = 0,
      temp_current_no_of_account = 0,
      temp_current_remi_amount = 0,
      temp_privious_bill_amount = 0,
      temp_privious_com = 0,
      temp_privious_deposit = 0,
      temp_privious_no_of_account = 0,
      temp_privious_remi_amount = 0

    const url = `${apiserver}/mis/getmis`
    let raw = JSON.stringify({
      param_year: `${temp_year}`,
      param_month: `${temp_month}`,
    })
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    }
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((payload) => {
        // console.log(payload)

        payload.map(
          (
            {
              CURRENT_BILL_AMOUNT,
              CURRENT_COM,
              CURRENT_DEPOSIT,
              CURRENT_NO_OF_ACCOUNT,
              CURRENT_REMI_AMOUNT,
              NAME,
              OPEN_DATE,
              PRIVIOUS_BILL_AMOUNT,
              PRIVIOUS_COM,
              PRIVIOUS_DEPOSIT,
              PRIVIOUS_NO_OF_ACCOUNT,
              PRIVIOUS_REMI_AMOUNT,
            },
            index
          ) => {
            temp_current_bill_amount += CURRENT_BILL_AMOUNT
            temp_current_com += CURRENT_COM
            temp_current_deposit += CURRENT_DEPOSIT
            temp_current_no_of_account += CURRENT_NO_OF_ACCOUNT
            temp_current_remi_amount += CURRENT_REMI_AMOUNT
            temp_privious_bill_amount += PRIVIOUS_BILL_AMOUNT
            temp_privious_com += PRIVIOUS_COM
            temp_privious_deposit += PRIVIOUS_DEPOSIT
            temp_privious_no_of_account += PRIVIOUS_NO_OF_ACCOUNT
            temp_privious_remi_amount += PRIVIOUS_REMI_AMOUNT

            document.getElementById("table_output").innerHTML += `
                     <tr>
                     <td class="text-small text-left ">${index + 1}</td>
                     <td class="text-tiny text-left w100 ">${NAME}</td>
                     <td class="text-small text-center text-clip">${moment(
              OPEN_DATE
            ).format("ll")}</td>
                     
                     <td class="text-small text-right">${nullfilder(
              PRIVIOUS_NO_OF_ACCOUNT
            )}</td>
                     <td class="text-small text-right">${nullfilder(
              CURRENT_NO_OF_ACCOUNT
            )}</td>
                     <td class="text-small text-right text-bold">${nullfilder(
              CURRENT_NO_OF_ACCOUNT - PRIVIOUS_NO_OF_ACCOUNT
            )}</td>
                     <td class="text-small text-right">${nullfilder(
              (PRIVIOUS_DEPOSIT / fig_in_lac).toLocaleString("en-BD", {
                maximumFractionDigits: 2,
              })
            )}</td>
                     <td class="text-small text-right">${nullfilder(
              (CURRENT_DEPOSIT / fig_in_lac).toLocaleString("en-BD", {
                maximumFractionDigits: 2,
              })
            )}</td>
                     <td class="text-small text-bold">${(
                CURRENT_DEPOSIT / fig_in_lac -
                PRIVIOUS_DEPOSIT / fig_in_lac
              ).toFixed(2)}</td>
                     <td class="text-small text-right">${nullfilder(
                (PRIVIOUS_REMI_AMOUNT / fig_in_lac).toLocaleString(
                  "en-BD",
                  {
                    maximumFractionDigits: 2,
                  }
                )
              )}</td>
                     <td class="text-small text-right">${nullfilder(
                (CURRENT_REMI_AMOUNT / fig_in_lac).toLocaleString(
                  "en-BD",
                  {
                    maximumFractionDigits: 2,
                  }
                )
              )}</td>
                     <td class="text-small text-right text-bold">${nullfilder(
                (
                  CURRENT_REMI_AMOUNT / fig_in_lac -
                  PRIVIOUS_REMI_AMOUNT / fig_in_lac
                ).toLocaleString("en-BD", {
                  maximumFractionDigits: 2,
                })
              )}</td>
 
                     <td class="text-small text-right">${nullfilder(
                (PRIVIOUS_BILL_AMOUNT / fig_in_lac).toLocaleString(
                  "en-BD",
                  {
                    maximumFractionDigits: 2,
                  }
                )
              )}</td>
                     <td class="text-small text-right">${nullfilder(
                (CURRENT_BILL_AMOUNT / fig_in_lac).toLocaleString(
                  "en-BD",
                  {
                    maximumFractionDigits: 2,
                  }
                )
              )}</td>
                     <td class="text-small text-bold text-right">${nullfilder(
                (
                  CURRENT_BILL_AMOUNT / fig_in_lac -
                  PRIVIOUS_BILL_AMOUNT / fig_in_lac
                ).toLocaleString("en-BD", {
                  maximumFractionDigits: 2,
                })
              )}</td>
                     <td class="text-small text-right">${nullfilder(
                (PRIVIOUS_COM / fig_in_lac).toLocaleString("en-BD", {
                  maximumFractionDigits: 4,
                })
              )}</td>
                     <td class="text-small text-right">${nullfilder(
                (CURRENT_COM / fig_in_lac).toLocaleString("en-BD", {
                  maximumFractionDigits: 4,
                })
              )}</td>
                     <td class="text-small text-bold text-right">${nullfilder(
                (
                  CURRENT_COM / fig_in_lac -
                  PRIVIOUS_COM / fig_in_lac
                ).toLocaleString("en-BD", {
                  maximumFractionDigits: 4,
                })
              )}</td>
                     <td colspan="3">&nbsp;</td>
                 
                     </tr>`
          }
        )
        document.getElementById("table_output").innerHTML += `
                     <tr class="bg-gray">
                     <td class="text-small w100 text-bold text-Left" colspan="3">Total</td>
                     <td class="text-small text-bold text-right">${temp_privious_no_of_account}</td>
                     <td class="text-small text-bold text-right">${temp_current_no_of_account}</td>
                     <td class="text-small text-bold text-right">${temp_current_no_of_account - temp_privious_no_of_account
          }</td>
                     <td class="text-small text-bold text-right">${(
            temp_privious_deposit / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            temp_current_deposit / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            (temp_current_deposit - temp_privious_deposit) /
            fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            temp_privious_remi_amount / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            temp_current_remi_amount / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            (temp_current_remi_amount - temp_privious_remi_amount) /
            fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            temp_privious_bill_amount / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td>
                     <td class="text-small text-bold text-right">${(
            temp_current_bill_amount / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td> 
                     <td class="text-small text-bold text-right">${(
            (temp_current_bill_amount - temp_privious_bill_amount) /
            fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 2,
          })}</td> 
                     <td class="text-small text-bold text-right">${(
            temp_privious_com / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 4,
          })}</td> 
                     <td class="text-small text-bold text-right">${(
            temp_current_com / fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 4,
          })}</td> 
                     <td class="text-small text-bold text-right">${(
            (temp_current_com - temp_privious_com) /
            fig_in_lac
          ).toLocaleString("en-BD", {
            maximumFractionDigits: 4,
          })}</td>
                     <td colspan="3">&nbsp;</td>
                   </tr>`
      })
    document.getElementById("table_output").innerHTML += `
                               <tr>
                               <td colspan="19" class=" w100">
                               <br/>
                               <br/>
                      <h4 class="h4 text-bold text-small mt-2 float-right">Authorised Signature</h4>
                               </td>
                             </tr>`
    document.getElementById("output").classList.remove("d-hide")
    document.getElementById("progress").classList.add("d-hide")
    document.getElementById("btnprint").classList.remove("disabled")
  }
}

const printAreaSys = async () => {
  const head = `<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>
    MIS
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

  
  
      <link rel="stylesheet" href="/style/spectre/bright/spectre.css">
      <link rel="stylesheet" href="/style/spectre/bright/spectre-icons.css">
      <link rel="stylesheet" href="/style/spectre/bright/spectre-exp.css">
      <link rel="stylesheet" href="/style/spectre/bright/background.css">
      <style>
      width:3508px;
      height:2480px;
      @page {
        size: landscape;
        margin: 10mm;
}
    table.print-friendly tr td, table.print-friendly tr th {
        page-break-inside: avoid;
    }
    
      </style>

	  	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
	integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
	crossorigin="anonymous" referrerpolicy="no-referrer" defar></script>
</head>
  <body class="m-2" id="renderthis">
</div>`

  const footer = ` 
 <script> 
	const load = () => {
		focus()
		print() 
		} 
	window.onload = load; 
 </script>
</body>`
  const printContent = document.getElementById("output")
  const WinPrint = window.open("", "", "width=3508px,height=2480px")
  WinPrint.document.write(head + printContent.innerHTML + footer)
  WinPrint.document.close()
  WinPrint.focus()

  //Bring out the print popup
}

const modelexit = () => {
  document.getElementById("modal-id").classList.remove("active")
}
const modeladd = () => {
  document.getElementById("modal-id").classList.add("active")
}

const gendata = async () => {
  document.getElementById("btn_loading").classList.add("loading")
  const param_date = document.getElementById("gen_date").value
  const url = `${apiserver}/mis/generatedata`
  let raw = JSON.stringify({
    param: `${param_date}`,
  })
  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }
  /*
  Example of ststus check:
  ref:https://developer.mozilla.org/en-US/docs/Web/API/Response/status
  */

  await fetch(url, requestOptions).then((response) => {
    if (response.status === 201) {
      document.getElementById("modal_body_output").innerHTML = `
                    <div class="content">
                    <h4 class="text-success text-bold">Data Added successfully</h4>
                         ${payload}
                    </div>
                `
      document.getElementById("btn_loading").classList.remove("btn-primary")
      document.getElementById("btn_loading").classList.add("btn-success")
      document.getElementById("btn_loading").classList.remove("loading")
    }
    if (response.status === 301) {
      document.getElementById("modal_body_output").innerHTML = `
                    <div class="content">
                    <h4 class="text-error text-bold">Data Added failed</h4>    
                    </div>
               `
      document.getElementById("btn_loading").classList.remove("btn-primary")
      document.getElementById("btn_loading").classList.add("btn-error")
      document.getElementById("btn_loading").classList.remove("loading")
    }
  })
}

// /mis/generatedata
