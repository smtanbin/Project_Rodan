const login = (user, passwd) => {
	if ((user = 'z')) {
		passwd = 'z'
		return true
	} else {
		return false
	}
}

module.exports = { login }
