// Side nav
function openNav() {
	document.getElementById('sidenavtigger').style.width = '250px'
	document.getElementById('main').style.marginLeft = '250px'
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
	document.getElementById('sidenavtigger').style.width = '0'
	document.getElementById('main').style.marginLeft = '0'
}

// botten
function createRipple(event) {
	const button = event.currentTarget

	const circle = document.createElement('span')
	const diameter = Math.max(button.clientWidth, button.clientHeight)
	const radius = diameter / 2

	circle.style.width = circle.style.height = `${diameter}px`
	circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
	circle.style.top = `${event.clientY - button.offsetTop - radius}px`
	circle.classList.add('ripple')

	const ripple = button.getElementsByClassName('ripple')[0]

	if (ripple) {
		ripple.remove()
	}

	button.appendChild(circle)
}

const buttons = document.getElementsByTagName('button')
for (const button of buttons) {
	button.addEventListener('click', createRipple)
}
