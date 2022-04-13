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

const sidenav = document.getElementById('sidenav')

const sidenavopen = () => {
	sidenav.style.opacity = '100'
	sidenav.style.visibility = 'visible'
	sidenav.style.pointerEvents = 'auto'
	sidenav.style.userSelect = 'auto'
}
const sidenavclose = () => {
	sidenav.style.opacity = '0'
	sidenav.style.visibility = 'hidden'
	sidenav.style.pointerEvents = 'none'
	sidenav.style.userSelect = 'none'
}
const notification = document.getElementById('notification')

const notificationopen = () => {
	notification.style.opacity = '100'
	notification.style.visibility = 'visible'
	notification.style.pointerEvents = 'auto'
	notification.style.userSelect = 'auto'
}
const notificationclose = () => {
	notification.style.opacity = '0'
	notification.style.visibility = 'hidden'
	notification.style.pointerEvents = 'none'
	notification.style.userSelect = 'none'
}
