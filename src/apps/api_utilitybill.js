const qurrythis = require('./db')
const { oracledate } = require('./FunCore')

const utilityreportpbslist = async () => {
	const sql = `SELECT TRANS_SNAME
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
const utilityinfodtl = async (fromdate, todate, key) => {
	// fromdate = oracledate(fromdate)
	// todate = oracledate(todate)

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
	console.log(sql)
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
module.exports = { utilityreportpbslist, utilityinfodtl, urptsum }
