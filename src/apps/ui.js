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
