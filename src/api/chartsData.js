const qurrythis = require("./db/db")
const { oradb } = require("./db/oradb")

const balancePerformance = async (param) => {
	let sql = ""
	if (param === 0) {
		sql = `/* Formatted on 4/17/2022 1:55:40 PM (QP5 v5.381) */
	SELECT NVL (TIME, PTIME)            PTIME,
			   ROUND (NVL (CDAY, 0), 2)     CDAY,
			   ROUND (NVL (YDAY, 0), 2)     YDAY
			   FROM (  SELECT TIME, NVL (SUM (BALANCE), 0) CDAY
					FROM (SELECT TO_CHAR (TRANS_DATE, 'HH24') TIME, PAY_AMT AS BALANCE
					FROM (AGENT_BANKING.GL_TRANS_MST))
				GROUP BY TIME) C
				FULL JOIN
				(  SELECT TIME PTIME, NVL (SUM (BALANCE), 0) YDAY
				FROM (SELECT TO_CHAR (TRANS_DATE, 'HH24') TIME, PAY_AMT AS BALANCE
				FROM AGENT_BANKING.GL_TRANS_MST_OLD
				WHERE TRUNC (TRANS_DATE) =
				(SELECT *
					FROM (  SELECT (TO_CHAR (TRANS_DATE, 'DD-Mon-YYYY'))
					FROM AGENT_BANKING.GL_TRANS_MST_OLD
					ORDER BY TRANS_DATE DESC)
					WHERE ROWNUM = 1))
				GROUP BY TIME) Y
				ON Y.PTIME = C.TIME
				ORDER BY PTIME`
	} else {
		sql = `/* Formatted on 5/29/2022 3:55:41 PM (QP5 v5.381) */
  SELECT NVL (TIME, PTIME)            PTIME,
         ROUND (NVL (CDAY, 0), 2)     CDAY,
         ROUND (NVL (YDAY, 0), 2)     YDAY
    FROM (  SELECT TIME, NVL (SUM (BALANCE), 0) CDAY
              FROM (SELECT TO_CHAR (TRANS_DATE, 'HH24') TIME, PAY_AMT AS BALANCE
                      FROM AGENT_BANKING.GL_TRANS_MST
                     WHERE    TRANS_TO IN (SELECT MPHONE
                                             FROM AGENT_BANKING.REGINFO
                                            WHERE PMPHONE = ${param})
                           OR TRANS_FROM IN (SELECT MPHONE
                                               FROM AGENT_BANKING.REGINFO
                                              WHERE PMPHONE = ${param}))
          GROUP BY TIME) C
         FULL JOIN
         (  SELECT TIME PTIME, NVL (SUM (BALANCE), 0) YDAY
              FROM (SELECT TO_CHAR (TRANS_DATE, 'HH24') TIME, PAY_AMT AS BALANCE
                      FROM AGENT_BANKING.GL_TRANS_MST_OLD
                     WHERE TRUNC (TRANS_DATE) =
                           (SELECT *
                              FROM (  SELECT (TO_CHAR (TRANS_DATE, 'DD-Mon-YYYY'))
                                        FROM AGENT_BANKING.GL_TRANS_MST_OLD
                                       WHERE    TRANS_TO IN
                                                    (SELECT MPHONE
                                                       FROM AGENT_BANKING.REGINFO
                                                      WHERE PMPHONE = ${param})
                                             OR TRANS_FROM IN
                                                    (SELECT MPHONE
                                                       FROM AGENT_BANKING.REGINFO
                                                      WHERE PMPHONE = ${param})
                                    ORDER BY TRANS_DATE DESC)
                             WHERE ROWNUM = 1))
          GROUP BY TIME) Y
             ON Y.PTIME = C.TIME
ORDER BY PTIME`
	}

	try {
		return await oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const dailydrcr = async () => {
	try {
		const sql = `/* Formatted on 3/1/2022 3:28:05 PM (QP5 v5.374) */
		SELECT CURRENT_HOUR HOUR, SUM (DR_AMT) DR, SUM (CR_AMT) CR
		  FROM (SELECT BALANCE_MPHONE,
					   CR_AMT,
					   DR_AMT,
					   TO_CHAR (TRANS_DATE, 'HH24') || ':00'     AS CURRENT_HOUR
				  FROM AGENT_BANKING.GL_TRANS_DTL X
				 WHERE BALANCE_MPHONE IS NOT NULL)
	  GROUP BY CURRENT_HOUR
	  ORDER BY CURRENT_HOUR`
		// console.log(sql)
		return oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const previousdrcr = async () => {
	try {
		const sql = `/* Formatted on 3/1/2022 3:28:05 PM (QP5 v5.374) */
		SELECT CURRENT_HOUR HOUR, SUM (DR_AMT) DR, SUM (CR_AMT) CR
		  FROM (SELECT BALANCE_MPHONE,
					   CR_AMT,
					   DR_AMT,
					   TO_CHAR (TRANS_DATE, 'HH24') || ':00'     AS CURRENT_HOUR
				  FROM AGENT_BANKING.GL_TRANS_DTL_old X
				 WHERE BALANCE_MPHONE IS NOT NULL AND TRUNC (TRANS_DATE) = (SELECT SYSDATE-1 FROM DUAL))
	  GROUP BY CURRENT_HOUR
	  ORDER BY CURRENT_HOUR`
		// console.log(sql)
		return oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const drcragent = async (key) => {
	try {
		const sql = `/* Formatted on 3/1/2022 3:40:28 PM (QP5 v5.374) */
		SELECT CURRENT_HOUR "DAY", SUM (DR_AMT) DR, SUM (CR_AMT) CR
		  FROM (SELECT BALANCE_MPHONE,
					   ROUND (CR_AMT, 2)                         CR_AMT,
					   ROUND (DR_AMT, 2)                         DR_AMT,
					   TO_CHAR (TRANS_DATE, 'dd')     AS CURRENT_HOUR
				  FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL
						UNION
						SELECT * FROM AGENT_BANKING.GL_TRANS_DTL_OLD) X
				 WHERE     BALANCE_MPHONE = ${key}
					   AND TRUNC (TRANS_DATE) BETWEEN (SELECT TRUNC (
																	LAST_DAY (
																		SYSDATE)
																  - 1,
																  'mm')
														 FROM DUAL)
												  AND (SELECT SYSDATE FROM DUAL))
	  GROUP BY CURRENT_HOUR
	  ORDER BY CURRENT_HOUR`
		// console.log(sql)
		return oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const pichart = async (param) => {
	let sql = ""
	if (param === undefined || param === "") {
		sql = `select round(sum(r.BALANCE_M),2) balance, (select p.ACC_TYPE_SHORT_NAME from AGENT_BANKING.PRODUCT_SETUP p where p.ACC_TYPE_CODE = r.AC_TYPE_CODE) TYPE from agent_banking.reginfo r group by AC_TYPE_CODE`
	} else {
		sql = `SELECT ROUND (SUM (r.BALANCE_M), 2)                 balance,
		(SELECT p.ACC_TYPE_SHORT_NAME
		   FROM AGENT_BANKING.PRODUCT_SETUP p
		  WHERE p.ACC_TYPE_CODE = r.AC_TYPE_CODE)    TYPE
   FROM agent_banking.reginfo r where pmphone = ${param}
GROUP BY AC_TYPE_CODE`
	}
	try {
		return await oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const agentstatus = async (param) => {
	let sql = ""
	if (param === undefined || param === "") {
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
	} else {
		sql = `/* Formatted on 5/29/2022 4:54:14 PM (QP5 v5.381) */
  SELECT ROUND (BALANCE_M, 2)    TODAY,
         ROUND (
             TANBIN.GETBALANCE (
                 MPHONE,
                 (SELECT TO_DATE (CURRENT_DATE - 1) AS yesterday_date FROM DUAL)),
             2)                  YESTERDAY
    FROM AGENT_BANKING.REGINFO r
   WHERE r.CAT_ID = 'D' AND r.STATUS != 'C' AND MPHONE = ${param}
ORDER BY TODAY`
	}

	try {
		return await oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const customerstatus = async (param) => {
	let sql = ""
	if (param === undefined || param === "") {
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
		 ORDER BY MPHONE`
	} else {
		sql = `/* Formatted on 3/22/2022 12:54:51 PM (QP5 v5.381) */
		SELECT (SELECT p.ACC_TYPE_SHORT_NAME
				  FROM AGENT_BANKING.PRODUCT_SETUP p
				 WHERE p.ACC_TYPE_CODE = R.AC_TYPE_CODE)    AC_TYPE_CODE,
			   round(SUM (BALANCE_M),2)                              CUSTOMER_CURRENT,
			   round(SUM (
				   (SELECT DB.BALANCE
					  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB
					 WHERE     DB.MPHONE = R.MPHONE
						   AND TRUNC (DB.BALANCE_DATE) =
							   (SELECT TO_DATE (CURRENT_DATE - 1)    AS YESTERDAY_DATE
								  FROM DUAL))),2)              CUSTOMER_YESTERDAY
		  FROM AGENT_BANKING.REGINFO R
		 WHERE R.STATUS != 'C' AND PMPHONE = ${param}
	  GROUP BY AC_TYPE_CODE`
	}

	try {
		return await oradb(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const accountOpenCloseStatus = async () => {
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

		return await oradb(sql)
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

		return await oradb(sql)
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

		return await oradb(sql)
	} catch (e) {
		console.log("api function cashEntry" + e)
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

		return await oradb(sql)
	} catch (e) {
		console.log("api function cashEntry" + e)
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

		return await oradb(sql)
	} catch (e) {
		console.log("api function dpsMaturity" + e)
		return e
	}
}
const peventoutput = async () => {
	try {
		sql = `SELECT * FROM AGENT_BANKING.D_TRANSACTIONINFO`

		return await oradb(sql)
	} catch (e) {
		console.log("api function cashEntry" + e)
		return e
	}
}
const teventoutput = async () => {
	try {
		sql = `/* Formatted on 4/26/2022 2:51:27 PM (QP5 v5.381) */
		(  SELECT PARTICULAR, COUNT (TRANS_NO) NO, SUM (M.PAY_AMT) AMT
			 FROM AGENT_BANKING.GL_TRANS_MST M
			WHERE PARTICULAR IN ('Cash Withdrawal',
								 'Online Cheque  Payment',
								 'Cheque Book Fee',
								 'Cash Deposit',
								 'Outward BEFTN',
								 'Inward BEFTN',
								 'Utility Payment',
								 'Instant Inward Foreign Remittance')
		 GROUP BY PARTICULAR)
		UNION
		(SELECT 'Account Opened' "EVENT", COUNT (MPHONE) NO, SUM (BALANCE_M) AMT
		   FROM AGENT_BANKING.REGINFO R
		  WHERE     TRUNC (R.REG_DATE) = (SELECT TRUNC (SYSDATE) FROM DUAL)
				AND STATUS != 'R')
		UNION
		(SELECT 'Remittance' "EVENT", COUNT (R.REM_ID) NO, SUM (R.SEN_REM_AMT) AMT
		   FROM AGENT_BANKING.REMITTANCE_INFO R
		  WHERE     TRUNC (R.AUTHO_DATE) = (SELECT TRUNC (SYSDATE) FROM DUAL)
				AND STATUS != 'R')`

		return await oradb(sql)
	} catch (e) {
		console.log("api function cashEntry" + e)
		return e
	}
}
const mseventoutput = async () => {
	try {
		sql = `select * from agent_banking.D_REG_MASTERINFO`

		return await oradb(sql)
	} catch (e) {
		console.log("api function cashEntry" + e)
		return e
	}
}

module.exports = {
	cashEntry,
	dpsMaturity,
	customerstatus,
	accountStatus,
	pichart,
	agentstatus,
	customerstatus,
	accountOpenCloseStatus,
	monthlyActivity,
	peventoutput,
	dailydrcr,
	drcragent,
	balancePerformance,
	previousdrcr,
	teventoutput,
	mseventoutput,
}
