document.onreadystatechange = function() {
	document.getElementById('loader').style.display =
		document.getElementById('loader').style.display === 'none' ? '' : 'none'
	document.getElementById('loading').style.display = 'none'
}
