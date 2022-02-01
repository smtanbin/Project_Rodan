let sidenavstate
function sideNavTigger() {
	if (sidenavstate === 1) {
		document.getElementById(sidenav).style.display = 'none'
		sidenavstate = 0
	} else {
		document.getElementById(sidenav).style.display = 'block'
		sidenavstate = 1
	}
}
