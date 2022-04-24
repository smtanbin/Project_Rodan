const qurrythis = require('../core/db')
const { oracleDate } = require('../core/FunCore')

const pbslist = async () => {
	try {
		const sql = `SELECT TRANS_SNAME
	FROM AGENT_BANKING.UTILITY_PAYMENT_INFO u
	where status = 'S'
	GROUP BY TRANS_SNAME
	ORDER BY TRANS_SNAME ASC`
		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const utilityinfohead = async (date, key) => {
	try {
		date = oracleDate(date)

		const sql = `/* Formatted on 2/3/2022 1:50:51 PM (QP5 v5.374) */
		SELECT (SELECT NAME
			FROM AGENT_BANKING.REGINFO
			WHERE MPHONE = C.MPHONE)                                 "TITEL",
			MPHONE                                                     "REVAC",
			VAT_MPHONE                                                 "VATAC",
			ROUND(TANBIN.GETBALANCE (MPHONE,'${date}'),2)        "REVBAL",
			ROUND(TANBIN.GETBALANCE (VAT_MPHONE,'${date}'),2)    "VATBAL",
			BILL_TITLE_1,
			BILL_TITLE_2,
			BILL_TITLE_3,
			SNAME
			FROM AGENT_BANKING.MERCHANT_CONFIG C
			WHERE SNAME = '${key}'`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return 'Stop code: Qurry miss'
	}
}
const utilityinfodtl = async (fromdate, todate, key) => {
	fromdate = oracleDate(fromdate)
	todate = oracleDate(todate)
	if (key == 'ALL') {
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
	  and TRANS_SNAME = '${key}' order by ENTRY_DATE`
		return await qurrythis(sql)
	} else {
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
	  order by ENTRY_DATE`
		return await qurrythis(sql)
	}
}

const utilityinfosummary = async (fromdate, todate) => {
	fromdate = oracleDate(fromdate)
	todate = oracleDate(todate)
	const sql = `/* Formatted on 2/2/2021 4:45:50 PM (QP5 v5.326) */
	SELECT
	  ENTRY_BY PMPHONE,
	  (
	  SELECT
		  name
	  FROM
		  agent_banking.reginfo
	  WHERE
		  mphone = upi.ENTRY_BY) "NAME",
		   COUNT (ID) "BILLNO",
	  TRANS_SNAME "MERCHANT",
	  TRANS_TO "REVAC",
	  (SELECT VAT_MPHONE FROM AGENT_BANKING.MERCHANT_CONFIG mc WHERE mc.MPHONE = upi.TRANS_TO) "VATAC",
  
	  SUM (VAT_AMT) "VAT",
	  SUM (STAMP_AMT) "STMP",
	  COUNT (TRANS_AMT) "COUNT",
	  SUM (TRANS_AMT) "TOTAL"
  
  FROM
	  AGENT_BANKING.UTILITY_PAYMENT_INFO upi
  WHERE
	  STATUS != 'R'
	  AND TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}'
  GROUP BY
	  ENTRY_BY,
	  TRANS_SNAME,
	  TRANS_TO
  ORDER BY
	  ENTRY_BY
  `
	return await qurrythis(sql)
}
module.exports = { pbslist, utilityinfohead, utilityinfodtl, utilityinfosummary }
