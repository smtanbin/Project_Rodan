
const qurrythis = require('./db')
const { oracleDate } = require('./FunCore')

const transactionsreport = async () => {
	try {
		const sql = `  SELECT NAME_OF_MTC
		FROM AGENT_BANKING.REMITTANCE_INFO
	   WHERE NAME_OF_MTC is NOT NULL
	GROUP BY NAME_OF_MTC
	order by NAME_OF_MTC`
		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

module.exports = { transactionsreport}
