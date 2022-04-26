/*Global Veriable Storage*/

/* Api Server Path*/
const apiserver = '/api'



/*
Loading Screen
*/
const removeLoading = () => {
    document.getElementById('loaderAnim').classList.remove("d-none")
    document.getElementById('loadingAnim').classList.add("d-none")

}

const wait = (delay = 0) =>
    new Promise(resolve => setTimeout(resolve, delay));

const init = () => {
    document.addEventListener('DOMContentLoaded', () =>
        wait(3000).then(() => { removeLoading() })
    )
}
init()


