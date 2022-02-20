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
const agentstatus = async () => {
	try {
		sql = `/* Formatted on 2/20/2022 10:27:22 AM (QP5 v5.374) */
		SELECT MPHONE,
			   r.ACCOUNT_NAME,
			   BALANCE_M
				   TODAY,
			   TANBIN.GET_ACC_BALANC (
				   MPHONE,
				   (SELECT TO_DATE (CURRENT_DATE - 1) AS yesterday_date FROM DUAL))
				   YESTERDAY,
			   (SELECT SUM (BALANCE_m)
				  FROM AGENT_BANKING.REGINFO R2
				 WHERE R2.MPHONE IN (SELECT MPHONE
									   FROM AGENT_BANKING.reginfo
									  WHERE pmphone = r.mphone))
				   CUSTOMER_CURRENT,
			   (SELECT SUM (db.BALANCE)
				  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW db
				 WHERE     db.MPHONE IN (SELECT MPHONE
										   FROM AGENT_BANKING.reginfo
										  WHERE pmphone = r.mphone)
					   AND TRUNC (db.BALANCE_DATE) =
						   (SELECT TO_DATE (CURRENT_DATE - 1)     AS yesterday_date
							  FROM DUAL))
				   CUSTOMER_YESTERDAY
		  FROM AGENT_BANKING.REGINFO r
		 WHERE r.CAT_ID = 'D' AND r.STATUS != 'C'
	  ORDER BY TODAY`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

module.exports = { pichart, agentstatus }
