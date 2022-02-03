const qurrythis = require('./db')
const { oracleDate } = require('./FunCore')



const accountStatmentHead = async (date, key) => {
	try{
	fromdate = oracleDate(fromdate)
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
	} catch (e){
		return e
	}
}
const accountStatmentBody = async (fromdate, todate, key) => {
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

module.exports = { accountInfo }
