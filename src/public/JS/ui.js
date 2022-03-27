/* #######################  Dark Mode ############################# */
/*Dark Mode Tigger Switch */
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

/*Dark Mode Check & update tigger */
const appinit = () => {
	let darkmodeCookie = Cookies.get('darkmode')
	if (darkmodeCookie != undefined || darkmodeCookie != null) {
		document.getElementById('darkmode').setAttribute('checked', 'YES')
		document.getElementById('navbar').classList.add('bg-frost-dark')
	} else {
		document.getElementById('darkmode').removeAttribute('checked')
		document.getElementById('navbar').classList.remove('bg-frost-dark')
	}
}

appinit()
