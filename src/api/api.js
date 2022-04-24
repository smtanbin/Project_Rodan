const qurrythis = require('../core/db')
const { oracleDate } = require('../core/FunCore')

async function reginfo() {
	const sql = `SELECT MPHONE "ACNO",NVL(PMPHONE,MPHONE) "AGENT",REG_STATUS,STATUS,BALANCE_M FROM AGENT_BANKING.reginfo`
	return qurrythis(sql)
}
async function timeline() {
	try {
		const sql = `SELECT TRANS_NO,TRANS_DATE,TRANS_FROM,TRANS_TO,REF_PHONE,PAY_AMT,MERCHANT_SNAME,MSG_AMT,SCHARGE_AMT,PARTICULAR,CODE,NOTE
		FROM AGENT_BANKING.GL_TRANS_MST
		ORDER BY TRANS_NO DESC`
		return qurrythis(sql)
	} catch (e) {
		return e
	}
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

const agentlist = async (id) => {
	try {
		const sql = `SELECT MPHONE,NAME FROM AGENT_BANKING.REGINFO WHERE CAT_ID = 'D' AND STATUS NOT IN ('R','C')`
		return await qurrythis(sql)
	} catch (e) {
		return e
	}
}
const doexist = async (key) => {
	try {
		let sql = `/* Formatted on 2/6/2022 8:04:29 AM (QP5 v5.374) */
	SELECT COUNT (*) "output"
	  FROM (SELECT REG_STATUS
			  FROM AGENT_BANKING.REGINFO R
			 WHERE MPHONE =  '${key}' AND REG_STATUS != 'R')`
		return await qurrythis(sql)
	} catch (e) {
		return e
	}
}

const holyday = async () => {
	const { HolidayAPI } = require('holidayapi')

	const key = `d520f718-97ae-4fac-bb4b-dadfefff82bd`
	const holidayApi = new HolidayAPI({ key })
	return holidayApi.holidays({
		country: 'BD',
		year: '2021'
	})
}

module.exports = { doexist, holyday, agentlist }
