const qurrythis = require('../apps/db')

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
			   TANBIN.GETBALANCE (
				   MPHONE,
				   (SELECT TO_DATE (CURRENT_DATE - 1) AS yesterday_date FROM DUAL))
				   YESTERDAY

		  FROM AGENT_BANKING.REGINFO r
		 WHERE r.CAT_ID = 'D' AND r.STATUS != 'C'
	  ORDER BY TODAY`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const customerstatus = async () => {
	try {
		sql = `/* Formatted on 2/20/2022 10:27:22 AM (QP5 v5.374) */
		SELECT MPHONE,
			   r.ACCOUNT_NAME,

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
		 ORDER BY MPHONE
		
	  `

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const accountStatus = async () => {
	try {
		sql = `/* Formatted on 2/23/2022 4:38:56 PM (QP5 v5.374) */
		SELECT PMPHONE,
			   NVL (SUM (ALLAC), 0)          ALLACCOUNT,
			   NVL (SUM (TODAY), 0)          OPENTODAY,
			   NVL (SUM (YESTERDAY), 0)      OPENYESTERDAY,
			   NVL (SUM (CLOSETDAY), 0)      CLOSETODAY,
			   NVL (SUM (CLOASEYDAY), 0)     CLOSEYESTERDAY
		  FROM (SELECT DISTINCT
					   PMPHONE,
					   NVL (
						   CASE
							   WHEN RDATE = 'Y' THEN ACNO
							   WHEN RDATE != 'Y' THEN 0
						   END,
						   0)    "YESTERDAY",
					   NVL (
						   CASE
							   WHEN RDATE = 'CT' THEN ACNO
							   WHEN RDATE != 'CT' THEN 0
						   END,
						   0)    "CLOSETDAY",
					   NVL (
						   CASE
							   WHEN RDATE = 'CY' THEN ACNO
							   WHEN RDATE != 'CY' THEN 0
						   END,
						   0)    "CLOASEYDAY",
					   NVL (
						   CASE
							   WHEN RDATE = 'T' THEN ACNO
							   WHEN RDATE != 'T' THEN 0
						   END,
						   0)    "TODAY",
					   NVL (
						   CASE
							   WHEN RDATE = 'A' THEN ACNO
							   WHEN RDATE != 'A' THEN 0
						   END,
						   0)    "ALLAC"
				  FROM (  SELECT COUNT (MPHONE) ACNO, PMPHONE, RDATE
							FROM (SELECT MPHONE,
										 NVL (PMPHONE, MPHONE)     "PMPHONE",
										 'A'                       RDATE
									FROM AGENT_BANKING.REGINFO R
								   WHERE REG_STATUS != 'R' AND STATUS != 'C'
								  UNION
								  --                    rej
								  SELECT AC_NO,
										 (SELECT PMPHONE
											FROM AGENT_BANKING.REGINFO C
										   WHERE C.MPHONE = RX.AC_NO)    "PMPHONE",
										 'CT'                            RDATE
									FROM AGENT_BANKING.ACC_CLOSING RX
								   WHERE     STATUS = 'S'
										 AND TRUNC (CREATE_DATE) =
											 (SELECT TO_DATE (CURRENT_DATE) FROM DUAL)
								  UNION
								  SELECT AC_NO,
										 (SELECT PMPHONE
											FROM AGENT_BANKING.REGINFO C
										   WHERE C.MPHONE = RX.AC_NO)    "PMPHONE",
										 'CY'                            RDATE
									FROM AGENT_BANKING.ACC_CLOSING RX
								   WHERE     STATUS = 'S'
										 AND TRUNC (CREATE_DATE) =
											 (SELECT TO_DATE (CURRENT_DATE - 1)
												FROM DUAL)
								  UNION
								  SELECT MPHONE,
										 NVL (PMPHONE, MPHONE)     "PMPHONE",
										 'T'                       RDATE
									FROM AGENT_BANKING.REGINFO R
								   WHERE     STATUS != 'C'
										 AND REG_STATUS != 'R'
										 AND STATUS != 'C'
										 AND TRUNC (REG_DATE) =
											 (SELECT TO_DATE (CURRENT_DATE) FROM DUAL)
								  UNION
								  SELECT MPHONE,
										 NVL (PMPHONE, MPHONE)     "PMPHONE",
										 'Y'                       RDATE
									FROM AGENT_BANKING.REGINFO R
								   WHERE     STATUS != 'C'
										 AND REG_STATUS != 'R'
										 AND STATUS != 'C'
										 AND TRUNC (REG_DATE) =
											 (SELECT TO_DATE (CURRENT_DATE - 1)
												FROM DUAL))
						GROUP BY PMPHONE, RDATE))
	  GROUP BY PMPHONE
	  ORDER BY PMPHONE`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const cashEntry = async () => {
	try {
		sql = `/* Formatted on 2/20/2022 4:28:54 PM (QP5 v5.374) */
	SELECT TRANS_NO,
		   AC_NO,
		   TRACER_NO,
		   ADVICE_NO,
		   AMOUNT,
		   TRANS_DATE,
		   CREATE_USER,
		
		   nvl(CHECKED_USER,'Waiting for Chackerd') CHECKED_USER,
		   CHECKED_DATE,
	
		
		   nvl(CASE
			   WHEN CHECKED_USER IS NULL THEN 'Waiting for Chackerd'
			   WHEN APPROVED_USER IS NULL THEN 'Waiting for Approvel'
		   END,'Unknown') MSG
	  FROM agent_banking.TBL_CASH_ENTRY
	 WHERE STATUS = 'A'`

		return await qurrythis(sql)
	} catch (e) {
		console.log('api function cashEntry' + e)
		return e
	}
}
const monthlyActivity = async (mphone) => {
	try {
		sql = `SELECT
		TRANS_DATE,DR_AMT,CR_AMT,BALANCE_MPHONE MPHONE
	FROM
		( /* Core Qurry*/
		SELECT
			*
		FROM
			AGENT_BANKING.GL_TRANS_DTL gtd
	UNION
		SELECT
			*
		FROM
			AGENT_BANKING.GL_TRANS_DTL_OLD gtdo
		WHERE
			BALANCE_MPHONE = ${mphone} )
			WHERE trunc(TRANS_DATE) BETWEEN (select trunc(last_day(sysdate)-1, 'mm') from dual) AND (select sysdate from dual) `

		return await qurrythis(sql)
	} catch (e) {
		console.log('api function cashEntry' + e)
		return e
	}
}
const dpsMaturity = async () => {
	try {
		sql = `/* Formatted on 2/28/2022 1:06:07 PM (QP5 v5.374) */
		SELECT MPHONE,
			   MATURITY_DATE,
			   R.BALANCE_M,
			   DOB
		  FROM AGENT_BANKING.REGINFO R
		 WHERE     TRUNC (MATURITY_DATE) <= (SELECT SYSDATE FROM DUAL)
			   AND RENWL_WIT IS NULL
			   AND RENWAL_PRINCIPLE IS NULL
			   --       AND R.STATUS not in ('C','F')
			   AND R.STATUS = 'M'
			   AND R.REG_STATUS != 'R'`

		return await qurrythis(sql)
	} catch (e) {
		console.log('api function dpsMaturity' + e)
		return e
	}
}

module.exports = { pichart, agentstatus, cashEntry, dpsMaturity, customerstatus, accountStatus, monthlyActivity }
