// const base64 = require("/JS/lib/base64.js")

const removeError = () => {
  document.getElementById("error").style.opacity = 0
  document.getElementById("error-input").classList.remove("has-error")
}
const authorized = async () => {
  /* Importing Username @ Password*/
  const username = document.getElementById("user").value
  const password = document.getElementById("passwd").value

  if (!username) {
    alert("password cannot be null")
  } else if (!password) {
    alert("You cannot have blink passsword")
  } else {
    const header = new Headers()

    header.append("Content-Type", "application/json")
    header.append("Access-Control-Allow-Origin", "*")
    header.append(
      "Authorization",
      "Basic " + base64.encode(username + ":" + password)
    )

    const url = `${apiserver}/login/auth`
    const requestOptions = {
      method: "POST",
      headers: header,
      redirect: "follow",
    }
    try {
      let response = await fetch(url, requestOptions)
      // response = response.json()
      if (response.status == 404) {
        document.getElementById("error").style.opacity = 100
        document.getElementById("error-input").classList.toggle("has-error")
        // document.getElementById("errorInfo").innerText = response.statusText
      } else {
        window.location.href = "/"
      }
    } catch (e) {
      document.getElementById("error").style.opacity = 100
      document.getElementById("errorInfo").innerText = e
    }
  }
}

addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    authorized()
  }
})
