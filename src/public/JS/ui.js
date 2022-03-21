function getCookie(name) {
	var dc = document.cookie
	var prefix = name + '='
	var begin = dc.indexOf('; ' + prefix)
	if (begin == -1) {
		begin = dc.indexOf(prefix)
		if (begin != 0) return null
	} else {
		begin += 2
		var end = document.cookie.indexOf(';', begin)
		if (end == -1) {
			end = dc.length
		}
	}
	// because unescape has been deprecated, replaced with decodeURI
	//return unescape(dc.substring(begin + prefix.length, end));
	return decodeURI(dc.substring(begin + prefix.length, end))
}

const darkmode = () => {
	let myCookie = getCookie('darkmode')
	console.log(myCookie)
	if (myCookie === null) {
		document.getElementById('darkmode').setAttribute('checked', 'YES')
		document.cookie = 'darkmode' + '=' + 'true' + ';' + ';path=/'
	} else {
		document.getElementById('darkmode').removeAttribute('checked')
		document.cookie = 'darkmode' + '=; Max-Age=-99999999;'
	}
}

const appinit = () => {
	let x = getCookie('darkmode')
	console.log('value: ' + x)

	if (getCookie('darkmode') != true) {
		document.getElementById('darkmode').removeAttribute('checked')
	} else {
		document.getElementById('darkmode').setAttribute('checked', 'YES')
	}
}

appinit()
