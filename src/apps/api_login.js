const login = (user, passwd) => {
	try {
		const qurrythis = require('./db')
		const pichart = async () => {
			try {
				sql = `SELECT nvl(u.USERNAME,'404')     "NAME"
				FROM AGENT_BANKING.USER_INFO u
			   WHERE     USERID = upper('${user}')
					 AND TANBIN.FUNC_GET_PIN (UPASS) = '${passwd}'`
				return await qurrythis(sql)
			} catch (e) {
				console.log(e)
				return e
			}
		}
	} catch (e) {
		console.log(e)
	}
}

module.exports = { login }
