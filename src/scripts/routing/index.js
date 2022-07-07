/*api server url is in environment file*/
//const apiserver = '/api/'
/* Requesting part start here. */
localStorage.clear()

const test = async (indexfrom) => {
  const url = `${apiserver}/img`
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }

  // console.log(requestOptions)
  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      console.log(payload)
      document.getElementById("test").innerHTML = payload
    })
}

test()

const routinglist = async (indexfrom) => {
  document.getElementById("progress").classList.remove("d-none")
  // console.log(indexfrom, indexto)

  const url = `${apiserver}/routing/getlimited`

  if (indexfrom === null || indexfrom === undefined) {
    indexfrom = 0
  }
  indexfrom = parseInt(indexfrom)
  const raw = JSON.stringify({
    indexfrom: `${indexfrom}`,
    indexto: `${indexfrom + 50}`,
  })
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }
  try {
    // console.log(requestOptions)
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((payload) => {
        if (payload.length === 0) {
          document.getElementById("routinglist").innerHTML = `
			<tr>
			<td colspan="14"> No Data Found!</td>
			</tr>`
        } else {
          // console.log(payload)

          payload.map(({ ROUTING_NO, BANK, BRANCH, UPDATE_DATE }, index) => {
            document.getElementById("routinglist").innerHTML += `
            <tr>
            <td class="text-tiny">${indexfrom + index + 1}</td>
            <td class="text-tiny">${ROUTING_NO}</td>
            <td class="text-tiny text-normal text-capitalize">${BANK}</td>
            <td class="text-tiny text-normal text-capitalize">${BRANCH}</td>
            <td class="text-tiny">${moment(UPDATE_DATE)
                .startOf("minute")
                .fromNow()}</td>
            </tr>
            `
          })
          // document.getElementById(
          //   "limit"
          // ).innerHTML = `From <span id="from" data-from="${indexfrom}">${indexfrom}</span> To <span id="to" data-to="${indexto}">${indexto}</span>`
        }
      })
  } catch (e) {
    document.getElementById(
      "routinglist"
    ).innerHTML = `<tr><td colspan="14"> Error! <br/> Massage: ${e}</td></tr>`
  }
  document.getElementById("progress").classList.add("d-none")
}

// routinglist()

const nextopt = async () => {
  // console.log(localStorage.getItem("count"))
  let previous_from = 0
  if (localStorage.getItem("count") === null) {
    previous_from = 0
  } else {
    previous_from = parseInt(localStorage.getItem("count"))
  }
  // console.log(previous_from)
  await routinglist(previous_from)
  // localStorage.removeItem("count")
  previous_from = previous_from + 50
  localStorage.setItem("count", previous_from)
}
nextopt()

// search function for contact
const search = () => {
  let input, UpperCasefilter, table, tr, td, i, txtValue
  input = document.getElementById("search")
  UpperCasefilter = input.value.toUpperCase()
  table = document.getElementById("routinglist")
  tr = table.getElementsByTagName("tr")
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1]

    if (td) {
      txtValue = td.textContent || td.innerText
      if (txtValue.toUpperCase().indexOf(UpperCasefilter) > -1) {
        tr[i].style.display = ""
      } else {
        tr[i].style.display = "none"
      }
    }
  }
}
