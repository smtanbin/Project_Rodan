/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json")
myHeaders.append("Access-Control-Allow-Origin", "*")

const smslog = async () => {
  const url = `${apiserver}/smslog`

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      if (payload.length === 0) {
        document.getElementById("tbody_output").innerHTML = `
			<tr><td colspan="3"> No Data Found!</td></tr>`
      } else {
        payload.map(({ MPHONE, BODY, TIME }, index) => {
          document.getElementById(
            "tbody_output"
          ).innerHTML += `<tr><td>${MPHONE}</td><td>${BODY}</td><td>${TIME}</td></tr>`
        })
      }
    })
}

const sentsms = async (autho) => {
  let sender = document.getElementById("sms_to").value
  let msgBody = document.getElementById("sms_body").value
  if (sender != undefined || sender != "") {
    sender = sender.split(";")
    // console.log(sender);
    let uniqueChars = sender.filter((c, index) => {
      return sender.indexOf(c) === index
    })
    // console.log(uniqueChars);
    for (i = 0; i < sender.length; i++) {
      if (uniqueChars[i] != undefined || uniqueChars[i] != null) {
        const url = `${apiserver}/sentsms`
        // const res = encodeURI(msgBody)
        const raw = JSON.stringify({
          to: `88${uniqueChars[i]}`,
          body: `${msgBody}`,
          autho: `${autho}`,
        })

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
        try {
          await fetch(url, requestOptions)
            .then((response) => response.json())
            .then((payload) => {
              if (payload === "201") {
                document.getElementById(
                  "toast_rail"
                ).innerHTML += `<div id="${uniqueChars[i]}" class="toast toast-success m-2">
                                <button class="btn btn-clear float-right" onclick="toast_exit('${uniqueChars[i]}')"></button>
                                <p id="toast_msg">
                                    Massage sended to ${uniqueChars[i]} Sucessfully.
                                </p>
                            </div>`
              } else {
                document.getElementById(
                  "toast_rail"
                ).innerHTML += `<div id="${uniqueChars[i]}" class="toast toast-error m-2">
                                <button class="btn btn-clear float-right" onclick="toast_exit('${uniqueChars[i]}')"></button>
                                <p id="toast_msg">
                                    Massage failed to send at no ${uniqueChars[i]}.
                                </p>
                            </div>`
              }
            })
        } catch (e) {
          console.log(e)
        }
      } else {
        alert("error")
        console.log(sender)
      }
    }
  }
}

const toast_exit = (id) => {
  document.getElementById(id).classList.add("d-none")
}
