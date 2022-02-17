const qurrythis = require('./db')
const pichart = async () => {
	try {
		sql = `select round(sum(r.BALANCE_M),2) balance, (select p.ACC_TYPE_SHORT_NAME from AGENT_BANKING.PRODUCT_SETUP p where p.ACC_TYPE_CODE = r.AC_TYPE_CODE) TYPE from agent_banking.reginfo r group by AC_TYPE_CODE`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

module.exports = { pichart }
