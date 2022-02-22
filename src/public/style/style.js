// const sidenav = document.getElementById('sidenav').classList
const sidenav = document.getElementById('sidenav').style
const sidenavopen = () => {
	sidenav.opacity = '100'
	sidenav.visibility = 'visible'
	sidenav.pointerEvents = 'auto'
	sidenav.userSelect = 'auto'
}
const sidenavclose = () => {
	sidenav.opacity = '0'
	sidenav.visibility = 'hidden'
	sidenav.pointerEvents = 'none'
	sidenav.userSelect = 'none'
}

// module.exports = { setnotificationcount }
