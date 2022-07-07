/*Global Veriable Storage*/

/* Api Server Path*/
const apiserver = '/api'

/* Requesting part start here. */
const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json")
myHeaders.append("Access-Control-Allow-Origin", "*")
myHeaders.append("Token", getCookie('auth'))



function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) { res = val.substring(name.length) }
    })
    return res
}



