const qurrythis = require('./db')
const { oracleDate } = require('./FunCore')

const remittancehouselist = async () => {
	try {
		const sql = `  SELECT NAME_OF_MTC
		FROM AGENT_BANKING.REMITTANCE_INFO
	   WHERE NAME_OF_MTC is NOT NULL
	GROUP BY NAME_OF_MTC
	order by NAME_OF_MTC`
		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

const remittance = async (fromdate, todate, key) => {
	try {
		fromdate = oracleDate(fromdate)
		todate = oracleDate(todate)

		if (key == 'ALL') {
			const sql = `SELECT NAME_OF_MTC "NAME_OF_EXCHANGE_HOUSE",PIN_S_CODE "RefNo_TT_NO",TO_CHAR (AUTHO_DATE)  "DATE_OF_ORGINATING_REMITTANCE", BEN_NAME "NAME", (SELECT TYPE_NAME FROM AGENT_BANKING.PHOTO_ID_TYPE_LIST C WHERE C.ID = P.PHOTO_ID_TYPE_CODE) "DOCUMENT_TYPE", BEN_PHOTO_ID "NID_NO_PASSPORT_NO", SEN_NAME "SENDER_NAME",'NULL' AS Occupation, SEN_COUNTRY_ORGIN "SOURCE_COUNTRY", SEN_REM_AMT "AMOUNT_REMITTED_BDT",CASE WHEN INCEN_AMT IS NULL THEN (SELECT AMT FROM (SELECT INCEN_AMT "AMT", PIN_S_CODE "PIN" FROM AGENT_BANKING.REMITTANCE_INFO_INC WHERE STATUS = 'P') WHERE P.PIN_S_CODE = PIN) WHEN INCEN_AMT IS NOT NULL THEN INCEN_AMT	END	"AMOUNT_OF_INCENTIVE_BDT", CASE WHEN INCEN_AMT IS NULL AND (SELECT AMT	FROM (SELECT INCEN_AMT "AMT", PIN_S_CODE "PIN" FROM AGENT_BANKING.REMITTANCE_INFO_INC WHERE STATUS = 'P') WHERE P.PIN_S_CODE = PIN) IS NULL THEN '' WHEN INCEN_AMT IS NOT NULL THEN TO_CHAR (AUTHO_DATE) END	"DATE_OF_PAYMENT_OF_INCENTIVE"
		FROM AGENT_BANKING.REMITTANCE_INFO P 
		WHERE TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}' AND STATUS = 'A' 
		ORDER BY NAME_OF_MTC, AUTHO_DATE DESC`
			return await qurrythis(sql)
		} else {
			const sql = `SELECT NAME_OF_MTC "NAME_OF_EXCHANGE_HOUSE",PIN_S_CODE "RefNo_TT_NO",TO_CHAR (AUTHO_DATE) "DATE_OF_ORGINATING_REMITTANCE", BEN_NAME "NAME", (SELECT TYPE_NAME FROM AGENT_BANKING.PHOTO_ID_TYPE_LIST C WHERE C.ID = P.PHOTO_ID_TYPE_CODE) "DOCUMENT_TYPE", BEN_PHOTO_ID "NID_NO_PASSPORT_NO", SEN_NAME "SENDER_NAME",'NULL' AS Occupation, SEN_COUNTRY_ORGIN "SOURCE_COUNTRY", SEN_REM_AMT "AMOUNT_REMITTED_BDT",CASE WHEN INCEN_AMT IS NULL THEN (SELECT AMT FROM (SELECT INCEN_AMT "AMT", PIN_S_CODE "PIN" FROM AGENT_BANKING.REMITTANCE_INFO_INC WHERE STATUS = 'P') WHERE P.PIN_S_CODE = PIN) WHEN INCEN_AMT IS NOT NULL THEN INCEN_AMT	END	"AMOUNT_OF_INCENTIVE_BDT", CASE WHEN INCEN_AMT IS NULL AND (SELECT AMT	FROM (SELECT INCEN_AMT "AMT", PIN_S_CODE "PIN" FROM AGENT_BANKING.REMITTANCE_INFO_INC WHERE STATUS = 'P') WHERE P.PIN_S_CODE = PIN) IS NULL THEN '' WHEN INCEN_AMT IS NOT NULL THEN TO_CHAR (AUTHO_DATE) END	"DATE_OF_PAYMENT_OF_INCENTIVE"
	 FROM AGENT_BANKING.REMITTANCE_INFO P 
	 WHERE TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}' AND STATUS = 'A' AND NAME_OF_MTC = '${key}' 
	 ORDER BY NAME_OF_MTC, AUTHO_DATE DESC`

			return await qurrythis(sql)
		}
	} catch (e) {
		console.log(e)
		return 'Stop code: Qurry miss'
	}
}
const remittancesummary = async (fromdate, todate) => {
	try {
		fromdate = oracleDate(fromdate)
		todate = oracleDate(todate)

		const sql = `SELECT 
			MPHONE                         "PMPHONE",
			NAME,
			NVL (
				(SELECT ROUND (SUM (SEN_REM_AMT), 2)
				   FROM AGENT_BANKING.REMITTANCE_INFO AR
				  WHERE     TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}'
						AND STATUS = 'A'
						AND REC_AGENT_ACC = R.MPHONE),
				0)                         "REMITTANCE",
			NVL (
				(SELECT COUNT (REM_ID)
				   FROM AGENT_BANKING.REMITTANCE_INFO AR
				  WHERE     TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}'
						AND STATUS = 'A'
						AND REC_AGENT_ACC = R.MPHONE),
				0)                         "REMINO",
			NVL (
				(SELECT ROUND (SUM (INCEN_AMT), 2)
				   FROM AGENT_BANKING.REMITTANCE_INFO AR
				  WHERE     TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}'
						AND STATUS = 'A'
						AND REC_AGENT_ACC = R.MPHONE),
				0)                         "INCE",
			NVL (
				(SELECT COUNT (INCEN_AMT)
				   FROM AGENT_BANKING.REMITTANCE_INFO AR
				  WHERE     TRUNC (ENTRY_DATE) BETWEEN '${fromdate}' AND '${todate}'
						AND STATUS = 'A'
						AND REC_AGENT_ACC = R.MPHONE),
				0)                         "INCNO"
	   FROM AGENT_BANKING.REGINFO R
	  WHERE CAT_ID = 'D' AND STATUS != 'C'`

		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return 'Stop code: Qurry miss'
	}
}

const remittanceRequest = async () => {
	try {
		sql = `/* Formatted on 2/23/2022 10:04:17 AM (QP5 v5.374) */
	SELECT rim.NAME_OF_MTC,
		   BEN_NAME,ENTRY_DATE,
		   SEN_REM_AMT,AUTHO_DATE,
		   (SELECT name
			  FROM agent_banking.reginfo
			 WHERE mphone = REC_AGENT_ACC)    REC_AGENT_ACC
	  FROM AGENT_BANKING.REMITTANCE_INFO rim where STATUS is null`
		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return 404
	}
}

module.exports = { remittancehouselist, remittance, remittancesummary, remittanceRequest }
