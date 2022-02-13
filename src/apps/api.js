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

async function reginfo() {
	const sql = `SELECT MPHONE "ACNO",NVL(PMPHONE,MPHONE) "AGENT",REG_STATUS,STATUS,BALANCE_M FROM AGENT_BANKING.reginfo`
	return qurrythis(sql)
}
async function nooftrans(FROM, TO) {
	const sql = `(SELECT TRANS_FROM "PMPHONE",COUNT (TRANS_NO) "NO OF",SUM(PAY_AMT) "BALANCE",'PAYMENT' TYPE FROM AGENT_BANKING.GL_TRANS_MST_OLD GLD WHERE TRUNC (TRANS_DATE) BETWEEN '${FROM}' AND '${TO}' AND TRANS_FROM IN (  SELECT PMPHONE
		FROM AGENT_BANKING.REGINFO GROUP BY PMPHONE) AND FROM_CAT_ID = 'D' AND TO_CAT_ID = 'U' GROUP BY TRANS_FROM)UNION ALL(SELECT TRANS_FROM "PMPHONE",COUNT (TRANS_NO),SUM (PAY_AMT) "BALANCE",'DEPOSIT' TYPE FROM AGENT_BANKING.GL_TRANS_MST_OLD GLD
		WHERE TRUNC (TRANS_DATE) BETWEEN '${FROM}' AND '${TO}' AND TRANS_FROM IN (SELECT PMPHONE FROM AGENT_BANKING.REGINFO GROUP BY PMPHONE) AND FROM_CAT_ID = 'D' AND TO_CAT_ID = 'C'
		 GROUP BY TRANS_FROM) UNION ALL( 
		   SELECT TRANS_TO          PMPHONE,
				  COUNT (TRANS_NO),
				  SUM (PAY_AMT)     BALANCE,
				  'WITHDRAW'        TYPE
			 FROM AGENT_BANKING.GL_TRANS_MST_OLD GLD
			WHERE     TRUNC (TRANS_DATE) BETWEEN '${FROM}' AND '${TO}'
				  AND TRANS_TO IN (  SELECT PMPHONE
									   FROM AGENT_BANKING.REGINFO
								   GROUP BY PMPHONE)
				  AND FROM_CAT_ID = 'C'
				  AND TO_CAT_ID = 'D'
		 GROUP BY TRANS_TO)
		UNION ALL
		( /* Looking for all transfer except 'Outward BEFTN','Fund Transfer','Outward Fund Transfer to SBL branch') */
		   SELECT REF_PHONE,
				  COUNT (TRANS_NO),
				  SUM (PAY_AMT)     BALANCE,
				  UPPER (PARTICULAR)
			 FROM AGENT_BANKING.GL_TRANS_MST_OLD GLD
			WHERE     TRUNC (TRANS_DATE) BETWEEN '${FROM}' AND '${TO}'
				  AND REF_PHONE IN (  SELECT PMPHONE
										FROM AGENT_BANKING.REGINFO
									GROUP BY PMPHONE)
				  AND PARTICULAR IN
						  ('Outward BEFTN',
						   'Fund Transfer',
						   'Outward Fund Transfer to SBL branch')
		 GROUP BY REF_PHONE, PARTICULAR)
		UNION ALL
		(                                    /* Looking for inter outlet transfer ) */
		   SELECT PMPHONE,
				  COUNT (TRANS_NO),
				  SUM (BALANCE),
				  'CASH TRANSFER'     TYPE
			 FROM (SELECT (SELECT PMPHONE
							 FROM AGENT_BANKING.REGINFO
							WHERE MPHONE = GLD.TRANS_FROM)    PMPHONE,
						  TRANS_NO,
						  PAY_AMT                             BALANCE
					 FROM AGENT_BANKING.GL_TRANS_MST_OLD GLD
					WHERE     TRUNC (TRANS_DATE) BETWEEN '${FROM}' AND '${TO}'
						  AND FROM_CAT_ID = 'C'
						  AND TO_CAT_ID = 'EFT')
		 GROUP BY PMPHONE)
		UNION ALL
		(                                               /* Looking for INWARD BEFTN */
		   SELECT PMPHONE,
				  COUNT (TRANS_NO),
				  SUM (BALANCE),
				  'INWARD BEFTN'     TYPE
			 FROM (SELECT (SELECT PMPHONE
							 FROM AGENT_BANKING.REGINFO
							WHERE MPHONE = GLD.TRANS_TO)    PMPHONE,
						  TRANS_NO,
						  PAY_AMT                           BALANCE
					 FROM AGENT_BANKING.GL_TRANS_MST_OLD GLD
					WHERE     TRUNC (TRANS_DATE) BETWEEN '${FROM}' AND '${TO}'
						  AND FROM_CAT_ID = 'EFT'
						  AND TO_CAT_ID = 'C')
		 GROUP BY PMPHONE)
		UNION ALL
		/* Remittance & incentive */
		(  SELECT REC_AGENT_ACC         PMPHONE,
				  COUNT (REM_ID)        "NO OF",
				  SUM (SEN_REM_AMT)     BALANCE,
				  'REMITTANCE'          TYPE
			 FROM AGENT_BANKING.REMITTANCE_INFO
			WHERE STATUS = 'A' AND TRUNC (ENTRY_DATE) BETWEEN '${FROM}' AND '${TO}'
		 GROUP BY REC_AGENT_ACC)
		UNION ALL
		(  SELECT REC_AGENT_ACC,
				  COUNT (REM_ID)      "NO OF",
				  SUM (INCEN_AMT)     BALANCE,
				  'INCENTIVE'         TYPE
			 FROM AGENT_BANKING.REMITTANCE_INFO
			WHERE STATUS = 'A' AND TRUNC (ENTRY_DATE) BETWEEN '${FROM}' AND '${TO}'
		 GROUP BY REC_AGENT_ACC)
		ORDER BY PMPHONE DESC, TYPE ASC`
	return await qurrythis(sql)
}

const customerinfo = async (id) => {
	try {
	const sql = `/* Formatted on 1/27/2022 6:36:03 PM (QP5 v5.374) */
	SELECT TO_CHAR (R.REG_DATE, 'MM/DD/YYYY')         REG_DATE,
		   UPPER (
			   CASE
				   WHEN r.REG_STATUS = 'R' THEN 'Rejected'
				   WHEN r.REG_STATUS = 'L' THEN 'Pending'
				   WHEN r.REG_STATUS = 'P' THEN 'Approved'
				   WHEN r.REG_STATUS NOT IN ('R', 'L', 'P') THEN r.REG_STATUS
			   END)                                   "REG_STATUS",
		   R.AUTHO_BY,
		   R.ENTRY_DATE,
		   R.UPDATE_BY,
		   R.UPDATE_DATE,
		   UPPER (NVL ((SELECT NAME
						  FROM AGENT_BANKING.AC_STATUS
						 WHERE S_NAME = R.STATUS),
					   STATUS))                       STATUS,
		   UPPER ((SELECT CATDESC
					 FROM AGENT_BANKING.CATEGORY
					WHERE CATID = CAT_ID))            "CATEGORY",
		   AC_TYPE_CODE,
		   MPHONE,
		   UPPER (NVL ((SELECT NAME
						  FROM AGENT_BANKING.REGINFO C
						 WHERE MPHONE = R.PMPHONE),
					   R.NAME))                       "AGENT",
		   R.PMPHONE                                  "AGENTAC",
		   ROUND (BALANCE_M)                          BALANCE,
		   LIEN_M,
		   UPPER (R.NAME)                             NAME,
		   R.OCCUPATION                               OCCUPATION,
		   C.NAME                                     NAME,
		   C.FATHER_NAME                              FATHER_NAME,
		   C.MOTHER_NAME                              MOTHER_NAME,
		   C.SPOUSE_NAME                              SPOUSE_NAME,
		   C.RELIGION                                 RELIGION,
		   C.DOB                                      DOB,
		   C.EDUCATION,
		   SIM_NO,
		   R.TIN_NO,
		   FORM_SERIAL,
		   FIRST_NOMINEE_NAME,
		   SECOND_NOMINEE_NAME,
		   THIRD_NOMINEE_NAME,
		   LAST_TRANS_DATE,
		   ACCOUNT_NAME,
		   C.CUST_ID,
		   MATURITY_DATE,
		   CASE
			   WHEN WFPIN_NO IS NOT NULL
			   THEN
				   (CASE
						WHEN WFPIN_NO_2 IS NULL
						THEN
							'SINGLE BIOMATRIC IMAGE FOUND'
						WHEN WFPIN_NO_2 IS NOT NULL
						THEN
							'JOIN BIOMATRIC IMAGE FOUND'
					END)
			   WHEN WFPIN_NO IS NULL
			   THEN
				   'NO BIOMATRIC DATA FOUND'
		   END                                        BIOMATRIC,
		   MOD_AC_OPRN,
		   SOURCE_OFFUND,
		   LINK_AC,
		   AC_TYPE,
		   SLAB_SL_NO,
		   DR_LINK_ACC,
		   MCHARGE_FLAG,
		   EXCISE_DUE,
		   (SELECT AC_IMG
			FROM AGENT_BANKING.IMAGE_REGINFO
		   WHERE SL_NO = 1 AND AC_NO = R.MPHONE)    "IMGAE",
		   COMPANY_AC_TYPE
	  FROM AGENT_BANKING.REGINFO  R
		   FULL OUTER JOIN AGENT_BANKING.CUSTIDINFO C ON R.CUST_ID = C.CUST_ID
	 WHERE MPHONE = ${id}`
	return await qurrythis(sql)
} catch (e) {
	return e
}
}
const doexist = async (key) => {
	try {
		let sql = `/* Formatted on 2/6/2022 8:04:29 AM (QP5 v5.374) */
	SELECT COUNT (*)
	  FROM (SELECT REG_STATUS
			  FROM AGENT_BANKING.REGINFO R
			 WHERE MPHONE =  '${key}' AND REG_STATUS != 'R')`
		if ((await qurrythis(sql)) === 0) {
			return false
		} else {
			return true
		}
	} catch (e) {
		return e
	}
}

module.exports = { reginfo, nooftrans, customerinfo,doexist }
