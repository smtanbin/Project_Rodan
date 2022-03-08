const qurrythis = require('./db')

const verification = async (user, passwd) => {
	try {
		sql = `SELECT USERNAME, ROLE
				FROM (SELECT UPPER (USERID)     USERID,
							 USERNAME,
							 UPASS,
							 UPPER (ROLEID)     ROLE
						FROM AGENT_BANKING.USER_INFO
					  UNION
					  SELECT UPPER (MPHONE)     USERID,
							 NAME               USERNAME,
							 R.PIN_NO           UPASS,
							 'AGENT'
						FROM AGENT_BANKING.REGINFO R
					   WHERE R.CAT_ID = 'D')
			   WHERE USERID = UPPER ('${user}') AND TANBIN.FUNC_GET_PIN (UPASS) = '${passwd}'`
		const data = await qurrythis(sql)
		if (data.length === 0) {
			return false
		} else {
			return data
		}
	} catch (e) {
		console.log(e)
		return e
	}
}
const tokenadd = async (user, token) => {
	try {
		sql = `INSERT INTO TANBIN.JWT (USERID, TOKEN,ORGDATE)
		VALUES (${user}, ${token}, (SELECT
			CURRENT_TIMESTAMP
		  FROM
			dual))`
		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const tokenver = async (user) => {
	try {
		sql = `SELECT TOKEN FROM TANBIN.JWT WHERE USERID = ${user}`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

module.exports = { verification, tokenadd, tokenver }
