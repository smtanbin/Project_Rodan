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


const sidebar = () => {
	const element = document.getElementById('sidebar')

	if (element.classList.contains("hide-md") === true) {
		element.classList.remove('hide-md');
		document.getElementById('sidebarhead').classList.remove('col-2')
		document.getElementById('contenthead').classList.remove('col-12')
		document.getElementById('contenthead').classList.add('col-10')
	} else {
		element.classList.add('hide-md');
		document.getElementById('sidebarhead').classList.add('col-2')
		document.getElementById('contenthead').classList.remove('col-10')
		document.getElementById('contenthead').classList.add('col-12')
	}
	// sidebar.classList.remove('hide-md');
}




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

const showRequestPanal = () => {
	document.getElementById('mkrequest').classList.add('d-none')
	document.getElementById('progressline').classList.remove('d-none')
	document.getElementById('progresslinetab').classList.add('active')
	document.getElementById('mkrequesttab').classList.remove('active')
}

const mkrequest = () => {
	document.getElementById('progressline').classList.add('d-none')
	document.getElementById('mkrequest').classList.remove('d-none')
	document.getElementById('mkrequesttab').classList.add('active')
	document.getElementById('progresslinetab').classList.remove('active')
}
