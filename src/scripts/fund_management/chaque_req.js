

const make_req = () => {
    const mphone = document.getElementById('input_mphone').value
    let url = `${apiserver}/chaque/add`
    const raw = JSON.stringify({
        mphone: mphone,
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    }
    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((payload) => {
            console.log(payload);
            document.getElementById("output").innerHTML =
                `<div class="hero">
  <div class="hero-body">
    <h1>Replay for ${mphone}</h1>
    <p>${payload}</p>
  </div>
</div>`


        })
}

const check_req = async () => {
    const mphone = document.getElementById('input_mphone').value
    /* Post request body content*/
    let url = `${apiserver}/chaque/search`
    const raw = JSON.stringify({
        mphone: mphone,
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    }
    await fetch(url, requestOptions)
        .then((response) => response.json()).then(async (payload) => {

            if (payload != 404) {
                payload.map(({ TRANS_DATE }) => {
                    // document.getElementById("output").classList.remove('d-none')
                    document.getElementById("output").innerHTML = `    <div class="hero p-2 m-2 p-centered">
      <div class="hero-body">
        <h1 class="text-warning">Worning!</h1>
        <p>Chaque Request Last placeled at <br>
          <ui id="list">
          </ui>
          <br>
          Do you like to confirmed?
        </p>
        <div class="my-2">

        </div>
        <div class="btn-group btn-group-block col-6">
          <button class="btn">Canceled</button>
          <button class="btn bg-primary" onclick="make_req()">Save</button>
        </div>
      </div>
    </div>`
                    document.getElementById("list").innerHTML += `<li>${moment(TRANS_DATE, "YYYYMMDD").fromNow()}</li>`
                })
            } else {
                await make_req()
            }
        })


}
    // if (response.status === '404') { return make_req() }