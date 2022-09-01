const requisition_menu = () => {
    const option = document.getElementById("requisitionValue").value
    const output = document.getElementById("output")
    if (option === "Chaque") {
        document.getElementById("banner_hero").classList.add("hero-sm")
        output.classList.remove("d-none")
        output.innerHTML = `
        <div class="hero hero-sm">
  <div class="hero-body">
    <h1>Chaque Requisition</h1>
    <p class="text-error">Warning make sure account is approved</p>
    <div class="input-group col-6">
  <span class="input-group-addon">Account No</span>
  <input type="text" class="form-input" placeholder="..." id="acno">
  <button class="btn btn-primary input-group-btn" onclick="chaqueReq()">Submit</button>
</div>
  </div>
<span id="output_msg"></span>
</div>`
    }
}


const chaqueReq = async () => {
    const acno = document.getElementById("acno").value

    const url = `${apiserver}/chaque/add`
    const raw = JSON.stringify({ mphone: `${acno}` })


    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    }

    await fetch(url, requestOptions)
        .then((response) => response.json())
        .then((payload) => {
            payload = JSON.stringify(payload)
            document.getElementById("output_msg").innerHTML
                += `<div class="hero hero-sm">${payload}</div>`
        })
}

