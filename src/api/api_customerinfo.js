const qurrythis = require('../apps/db')

const customerinfo = async (key) => {
	try {
		let output
		let sql = `/* Formatted on 2/17/2022 10:33:25 AM (QP5 v5.374) */
		SELECT /* --------------  CUSTID FINDER --------------- */
		
			   NVL (
				   (CASE
						WHEN AC_TYPE_CODE IN ('4',
											  '5',
											  '3',
											  '8')
						THEN
							R.CUST_ID
						/* FIND REGULER ACCOUNT */
						WHEN AC_TYPE IS NULL
						THEN
							R.CUST_ID
						/* FOR PROPRIETORSHIP AND JOIN ACCOUNT GENDER WILL BE 1ST APPLICENT(1ST CUSTOMER ID) */
						WHEN AC_TYPE IN ('J', 'S')
						THEN
							(CASE
								 WHEN (SELECT CUST_ID_TYPE_TXT
										 FROM AGENT_BANKING.CUSTIDINFO C1
										WHERE C1.CUST_ID = R.CUST_ID) IN
										  ('PROPRIETORSHIP', 'INDIVIDUAL')
								 THEN
									 (SUBSTR (R.LINK_CUST_IDS, 4, 9))
								 WHEN (SELECT CUST_ID_TYPE_TXT
										 FROM AGENT_BANKING.CUSTIDINFO C1
										WHERE C1.CUST_ID = R.CUST_ID) NOT IN
										  ('Proprietorship', 'Individual')
								 THEN
									 R.CUST_ID
							 END)
						WHEN R.CAT_ID IN ('U', 'V')
						THEN
							R.CUST_ID
						/* LOOKING FOR ACCOUNT SET AS INDIVISUAL BUT THEY ARE PROPITERSHIP */
						WHEN UPPER (R.NAME) LIKE '%ENTERPRISE%'
						THEN
							(CASE
								 WHEN AC_TYPE = 'J'
								 THEN
									 R.CUST_ID
								 WHEN AC_TYPE = 'S'
								 THEN
									 (SUBSTR (R.LINK_CUST_IDS, 4, 9))
							 END)
						WHEN UPPER (R.NAME) LIKE '%TRADRS%'
						THEN
							(CASE
								 WHEN AC_TYPE = 'J'
								 THEN
									 R.CUST_ID
								 WHEN AC_TYPE = 'S'
								 THEN
									 (SUBSTR (R.LINK_CUST_IDS, 4, 9))
							 END)
					END),
				   R.CUST_ID)    "CUST_ID"
		  FROM AGENT_BANKING.REGINFO R
		 WHERE MPHONE = 10834000598`
		const custid = await qurrythis(sql)
		sql = `
		/* Formatted on 2/16/2022 6:14:18 PM (QP5 v5.374) */
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
			   UPPER (NVL ((SELECT R.NAME
							  FROM AGENT_BANKING.AC_STATUS
							 WHERE S_NAME = R.STATUS),
						   STATUS))                       STATUS,
			   UPPER ((SELECT CATDESC
						 FROM AGENT_BANKING.CATEGORY
						WHERE CATID = CAT_ID))            "CATEGORY",
			   AC_TYPE_CODE,
			   MPHONE,
			   UPPER (NVL ((SELECT R.NAME
							  FROM AGENT_BANKING.REGINFO C
							 WHERE MPHONE = R.PMPHONE),
						   R.NAME))                       "AGENT",
			   R.PMPHONE                                  "AGENTAC",
			   ROUND (BALANCE_M)                          BALANCE,
			   LIEN_M,       
			   LINK_AC                                    TIN_NO,
			   FORM_SERIAL,
			   LAST_TRANS_DATE,
			   ACCOUNT_NAME,
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
		  FROM AGENT_BANKING.REGINFO R
		 WHERE MPHONE = ${key}`
		output = await qurrythis(sql)

		sql = `/* Formatted on 2/17/2022 10:36:26 AM (QP5 v5.374) */
		SELECT ca.REG_DATE,
		ca.CUST_ID,
			   ca.NAME    "CUSTOMER_NAME",
			   ca.FATHER_NAME,
			   ca.MOTHER_NAME,
			   ca.SPOUSE_NAME,
			   ca.DOB,
			   ca.CON_MOB,
			   ca.TIN_NO,
			   ca.OCCUPATION,
			   ca.BLOOD_GROUP,
			   (CASE
					WHEN ca.RELIGION = 'I' THEN 'Islam'
					WHEN ca.RELIGION = 'H' THEN 'Hinduism'
					WHEN ca.RELIGION = 'C' THEN 'Christianity'
					WHEN ca.RELIGION = 'B' THEN 'Buddhism'
					WHEN ca.RELIGION = 'A' THEN 'Atheists'
					WHEN ca.RELIGION = 'O' OR ca.RELIGION IS NULL THEN 'Unknown'
				END)      "RELIGION",
			   (CASE
					WHEN ca.GENDER = 'F' THEN 'Female'
					WHEN ca.GENDER = 'M' THEN 'Male'
					WHEN ca.GENDER = 'O' THEN 'Other'
				END)      "GENDER",
			   ca.PMPHONE
		  FROM AGENT_BANKING.CUSTIDINFO ca
		 WHERE CUST_ID = ${custid[0].CUST_ID}`
		const customerInfo = await qurrythis(sql)

		const returner = output.concat(customerInfo)

		return returner
	} catch (e) {
		console.log('Error in function customerinfo ' + e)
		return e
	}
}
module.exports = { customerinfo }
