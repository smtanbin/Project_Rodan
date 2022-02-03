const qurrythis = require('./db')
const { oracleDate } = require('./FunCore')

const utilityreportpbslist = async () => {
	const sql = `SELECT TRANS_SNAME
	  FROM AGENT_BANKING.UTILITY_PAYMENT_INFO u
	  where status = 'S'
	  GROUP BY TRANS_SNAME
	  ORDER BY TRANS_SNAME ASC`
	return await qurrythis(sql)
}

const utilityinfohead = async (date,key) => {
	
	try{
		// console.log(date+"now")
		date = oracleDate(date)
		// console.log(date+"after")

		const sql = `/* Formatted on 2/3/2022 1:50:51 PM (QP5 v5.374) */
		SELECT (SELECT NAME
			FROM AGENT_BANKING.REGINFO
			WHERE MPHONE = C.MPHONE)                                 "TITEL",
			MPHONE                                                     "REVAC",
			VAT_MPHONE                                                 "VATAC",
			ROUND(TANBIN.GET_ACC_BALANC (MPHONE,'${date}'),2)        "REVBAL",
			ROUND(TANBIN.GET_ACC_BALANC (VAT_MPHONE,'${date}'),2)    "VATBAL",
			BILL_TITLE_1,
			BILL_TITLE_2,
			BILL_TITLE_3,
			SNAME
			FROM AGENT_BANKING.MERCHANT_CONFIG C
			WHERE SNAME = '${key}'`
			console.log(sql)
	return await qurrythis(sql)
} catch (e){
	return 'Stop code: Qurry miss'
}
}
const utilityinfodtl = async (fromdate, todate, key) => {
	fromdate = oracleDate(fromdate)
	todate = oracleDate(todate)

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
module.exports = { utilityreportpbslist, utilityinfohead, utilityinfodtl }
