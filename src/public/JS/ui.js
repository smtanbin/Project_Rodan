// function getCookie(name) {
// 	var dc = document.cookie
// 	var prefix = name + '='
// 	var begin = dc.indexOf('; ' + prefix)
// 	if (begin == -1) {
// 		begin = dc.indexOf(prefix)
// 		if (begin != 0) return null
// 	} else {
// 		begin += 2
// 		var end = document.cookie.indexOf(';', begin)
// 		if (end == -1) {
// 			end = dc.length
// 		}
// 	}
// 	// because unescape has been deprecated, replaced with decodeURI
// 	//return unescape(dc.substring(begin + prefix.length, end));
// 	return decodeURI(dc.substring(begin + prefix.length, end))
// }

const darkmode = () => {
	let myCookie = Cookies.get('darkmode')
	console.log(myCookie)
	if (myCookie === undefined || myCookie === null) {
		document.getElementById('darkmode').setAttribute('checked', 'YES')
		Cookies.set('darkmode', 'true', { path: '/' })
		location.reload()
	} else {
		document.getElementById('darkmode').removeAttribute('checked')
		Cookies.remove('darkmode')
		// Cookies.set('darkmode', 'false', { path: '/' })
		location.reload()
	}
}

const appinit = () => {
	let darkmodeCookie = Cookies.get('darkmode')
	if (darkmodeCookie != undefined || darkmodeCookie != null) {
		document.getElementById('darkmode').setAttribute('checked', 'YES')
	} else {
		document.getElementById('darkmode').removeAttribute('checked')
	}
}

appinit()
