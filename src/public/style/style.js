// const sidenav = document.getElementById('sidenav').classList
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

// module.exports = { setnotificationcount }
