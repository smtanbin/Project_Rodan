const qurrythis = require('./db')
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
		   LINK_AC
		   TIN_NO,
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
		console.log('Error in function customerinfo ' + e)
		return e
	}
}
module.exports = { customerinfo }
