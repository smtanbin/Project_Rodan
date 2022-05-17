/*api server url is in environment file*/
//const apiserver = '/api/'
/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json")
myHeaders.append("Access-Control-Allow-Origin", "*")

const mis_part1 = async () => {
  let param = document.getElementById("param").value

  console.log(param.toString("-"))
  var d = new Date(param + 1, 0)
  console.log(d.toString("-"))
  param = "3/31/2022"
  const url = `${apiserver}/monthly_data`

  let value = ""
  let value2 = ""

  let raw = JSON.stringify({
    date: `${param}`,
  })
  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }
  var obj = new Object()
  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      console.log(payload)
      payload.map(({ PMPHONE, BALANCE, NO_AC }, index) => {
        value += `${index}:[{"PMPHONE":"${PMPHONE}","CUL_BAL":"${BALANCE}","PRE_BAL":"0","CUL_ACNO":"${NO_AC}"}]`
      })
    })

  // console.log(value)
  param = "4/30/2022"
  raw = JSON.stringify({
    date: `${param}`,
  })
  requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }
  // await fetch(url, requestOptions)
  //   .then((response) => response.json())
  //   .then((payload) => {
  //     payload.map(({ PMPHONE, BALANCE, NO_AC }) => {
  //       // if (value[0] === PMPHONE) {
  //            obj.CUL_BAL = BALANCE
  //            obj.CUL_ACNO = NO_AC
  //            value += JSON.stringify(obj)
  //       // }
  //     })
  //   })

  console.log(value)
}
