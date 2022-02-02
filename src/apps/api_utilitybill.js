const moment = require('moment')
const oracledb = require('oracledb')
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
let connection
// oracle working db
async function qurrythis(sqlqurry) {
	try {
		connection = await oracledb.getConnection({
			user: 'tanbin',
			password: '@urA774234',
			connectString: '10.130.102.103:1525/SBLABS'
		})
		const result = await connection.execute(sqlqurry)
		// console.log(result.rows)
		return result.rows
	} catch (err) {
		console.error(err)
	} finally {
		if (connection) {
			try {
				await connection.close()
			} catch (err) {
				console.error(err)
			}
		}
	}
}

const uvanls = async () => {
	const sql = `/* Formatted on 2/1/2022 3:19:21 PM (QP5 v5.374) */
	SELECT TRANS_SNAME
	  FROM AGENT_BANKING.UTILITY_PAYMENT_INFO u
	  where status = 'S'
	  GROUP BY TRANS_SNAME
	  ORDER BY TRANS_SNAME ASC`
	return await qurrythis(sql)
}
const urptsum = async (from, to, key) => {
	const sql = `SELECT * from AGENT_BANKING.UTILITYREPORT`
	return await qurrythis(sql)
}
const utilityinfodtl = async (from, to, key) => {
	let fromdate = '02-feb-2022' //moment().format('DD-MMM-YYYY')

	let todate = '02-feb-2022' //.moment().format('DD-MMM-YYYY')
	console.log(key)

	const sql = `/* Formatted on 2/1/2022 3:19:21 PM (QP5 v5.374) */
	SELECT u.ENTRY_DATE,
		   u.TRANS_NO,
		   ROUND (u.TRANS_AMT, 2) TRANS_AMT,
		   ROUND (VAT_AMT, 2) VAT_AMT,
		   ROUND (STAMP_AMT, 2) STAMP_AMT,
		   u.BILL_INFO_1 ACNO,
		   u.BILL_INFO_2 BOOKNO,
		   UPPER(u.BILL_INFO_3) MONTH
	  FROM AGENT_BANKING.UTILITY_PAYMENT_INFO u
	  where status = 'S' and trunc(entry_date) between '${fromdate}' and '${todate}'
	  and TRANS_SNAME = '${key}'`
	return await qurrythis(sql)
}
const utilityinfosummary = async (from, to, key) => {
	const sql = `/* Formatted on 2/1/2022 3:19:21 PM (QP5 v5.374) */
	SELECT u.ENTRY_DATE,
		   u.TRANS_NO,
		   ROUND (u.TRANS_AMT, 2) TRANS_AMT,
		   ROUND (VAT_AMT, 2) VAT_AMT,
		   ROUND (STAMP_AMT, 2) STAMP_AMT,
		   u.BILL_INFO_1 ACNO,
		   u.BILL_INFO_2 BOOKNO,
		   UPPER(u.BILL_INFO_3) MONTH
	  FROM AGENT_BANKING.UTILITY_PAYMENT_INFO u
	  where status = 'S' and trunc(entry_date) between ${from} and ${to}
	  --and TRANS_SNAME = ${key}`
	return await qurrythis(sql)
}
module.exports = { uvanls, utilityinfodtl, urptsum }
