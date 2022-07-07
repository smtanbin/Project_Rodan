const history = async () => {
  const url = `${apiserver}/sms/smslog`

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }
  document.getElementById("output-history").innerHTML = `
  <progress class="progress" max="100" id="progress-history"></progress>
  <div class="timeline" id="timeline-history"></div>
  `

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      if (payload.length === 0) {
        document.getElementById(
          "output-history"
        ).innerHTML = `<div class="hero bg-gray">
  <div class="hero-body">
    <h1>404!</h1>
    <p>Not found</p>
  </div>
</div>`
      } else {
        payload.map(({ MPHONE, BODY, TIME }) => {
          document.getElementById("timeline-history").innerHTML += `
                        <div class="timeline-item">
                    <div class="timeline-left"><a class="timeline-icon icon-lg tooltip"
                            data-tooltip="${moment(TIME).format(
            "LL"
          )}"><i class="icon icon-check"></i></a></div>
                    <div class="timeline-content">
                        <div class="tile">
                            <div class="tile-content">
                            
                                <p class="tile-subtitle text-bold">${MPHONE}</p>
                                <p class="tile-title text-small">${BODY}</p>
                            </div>
                            <div class="tile-action">
                                <p class="text-tiny text-primary">Time: ${moment(
            TIME
          ).format("llll")}</p>
                            </div>
                        </div>
                    </div>
                </div>`
        })
        document.getElementById("progress-history").remove()
      }
    })
}

/*   System SMS */

const syssmslog = async () => {
  const url = `${apiserver}/sms/syssmslog`
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  }

  document.getElementById(
    "output-sysmsglog"
  ).innerHTML = `<progress class="progress" max="100" id="progress-sysmsglog"></progress>
  <div class="timeline" id="timeline-syssmslog"></div>`

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      if (payload.length === 0) {
        document.getElementById(
          "output-sysmsglog"
        ).innerHTML = `<div class="hero bg-gray">
  <div class="hero-body">
    <h1>No Data Found</h1>

  </div>
</div>`
      } else {
        payload.map(({ MPHONE, IN_TIME, OUT_MSG, SSL_REF_NUM }, index) => {
          let icon = "check"
          if (SSL_REF_NUM === "null") {
            icon = "time"
          }
          document.getElementById("timeline-syssmslog").innerHTML += `
                        <div class="timeline-item">
                    <div class="timeline-left"><a class="timeline-icon icon-lg tooltip"
                            data-tooltip="${moment(IN_TIME).format(
            "LL"
          )}"><i class="icon icon-${icon}"></i></a></div>
                    <div class="timeline-content">
                        <div class="tile">
                            <div class="tile-content">
                            
                                <p class="tile-subtitle text-bold">${MPHONE}</p>
                                <p class="tile-title text-small">${OUT_MSG}</p>
                            </div>
                            <div class="tile-action">
                                <p class="text-tiny text-primary">Time: ${moment(
            IN_TIME
          ).format("llll")}</p>
                            </div>
                        </div>
                    </div>
                </div>`
        })
      }
      document.getElementById("progress-sysmsglog").remove()
    })
}

/* Search SMS*/

const findsms = async () => {
  document.getElementById("msglog").classList.add("d-none")
  document.getElementById("sysmsglog").classList.add("d-none")
  document.getElementById("msgsearchtab").classList.add("active")
  document.getElementById("msglogtab").classList.remove("active")
  document.getElementById("sysmsglogtab").classList.remove("active")
  document.getElementById("msgsearch").classList.remove("d-none")

  document.getElementById("result_table_view_loading").classList.add("loading")
  const param = document.getElementById("result_table_view_value").value

  const url = `${apiserver}/sms/findsms`
  const raw = JSON.stringify({
    param: `${param}`,
  })

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }
  document.getElementById(
    "output"
  ).innerHTML = `<div class="timeline" id="timeline"></div>`

  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((payload) => {
      if (payload.length === 0) {
        document.getElementById(
          "output"
        ).innerHTML = `<div class="hero bg-gray">
  <div class="hero-body">
    <h1>No Data Found</h1>

  </div>
</div>`
      } else {
        payload.map(({ IN_TIME, OUT_MSG, SSL_REF_NUM }, index) => {
          let icon = "check"
          if (SSL_REF_NUM === "null") {
            icon = "time"
          }
          document.getElementById("timeline").innerHTML += `
                        <div class="timeline-item">
                    <div class="timeline-left"><a class="timeline-icon icon-lg tooltip"
                            data-tooltip="${moment(IN_TIME).format(
            "LL"
          )}"><i class="icon icon-${icon}"></i></a></div>
                    <div class="timeline-content">
                        <div class="tile">
                            <div class="tile-content">
                                <p class="tile-subtitle text-bold">${moment(
            IN_TIME
          ).format("llll")}</p>
                                <p class="tile-title text-small">${OUT_MSG}</p>
                            </div>
                            <div class="tile-action">
                                <p class="text-tiny">Autho: ${SSL_REF_NUM}</p>
                            </div>
                        </div>
                    </div>
                </div>`
        })
      }
      document
        .getElementById("result_table_view_loading")
        .classList.remove("loading")
    })
}

const initsms = async (autho) => {
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
        sentsms(autho, msgBody, uniqueChars[i])
      }
    }
  }
}

const sentsms = async (autho, msgBody, to) => {
  const url = `${apiserver}/sms/sentsms`
  // const res = encodeURI(msgBody)
  const raw = JSON.stringify({
    to: `88${to}`,
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
          ).innerHTML += `<div id="${to}" class="toast toast-success m-2">
                                <button class="btn btn-clear float-right" onclick="toast_exit('${to}')"></button>
                                <p id="toast_msg">
                                    Massage sended to ${to} Sucessfully.
                                </p>
                            </div>`
        } else {
          document.getElementById(
            "toast_rail"
          ).innerHTML += `<div id="${to}" class="toast toast-error m-2">
                                <button class="btn btn-clear float-right" onclick="toast_exit('${to}')"></button>
                                <p id="toast_msg">
                                    Massage failed to send at no ${to}.
                                </p>
                            </div>`
        }
      })
  } catch (e) {
    console.log(e)
  }
}

const tab_3 = (current_tab, previous_tab_1, previous_tab_2) => {
  document.getElementById(current_tab).classList.remove("d-none")
  document.getElementById(`${current_tab}tab`).classList.add("active")

  document.getElementById(previous_tab_1).classList.add("d-none")
  document.getElementById(`${previous_tab_1}tab`).classList.remove("active")

  document.getElementById(previous_tab_2).classList.add("d-none")
  document.getElementById(`${previous_tab_2}tab`).classList.remove("active")
}
// const msglog = () => {
// }
// const sysmsglog = () => {}
// const msgsearch = () => {}

// const toast_exit = (id) => {
//   document.getElementById(id).classList.add("d-none")
// }

// init
// smslog()
