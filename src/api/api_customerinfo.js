const qurrythis = require("./db/db")

const customerinfo = async (key) => {
  try {
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
		 WHERE MPHONE = ${key}`

    const custid = await qurrythis(sql)

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
			   ca.EDUCATION,
			   ca.MARITAL_STATUS,
			   ca.RESIDENCE_STATUS,
			   ca.NID_NO,
			   ca.PASSPORT_NO,
			   ca.PASSPORT_NO_VALIDITY,
			   ca.DRIVING_NO,
			   ca.EMAIL,
			   PRE_VILLAGE
				|| ', '
				|| PRE_ROAD
				|| ', '
				|| PRE_POST
				|| ', '
				|| (SELECT    name
						   || ', '
						   || (SELECT    name
									  || ', '
									  || (SELECT    name
												 || ', '
												 || (SELECT name
													   FROM agent_banking.DISTHANA
													  WHERE code = f.parent)
											FROM agent_banking.DISTHANA f
										   WHERE code = e.parent)
								 FROM agent_banking.DISTHANA e
								WHERE code = d.parent)
					  FROM agent_banking.DISTHANA d
					 WHERE code = PRE_THANA) 
				   ADDR,
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

    const data = await qurrythis(sql)
    return data
  } catch (e) {
    console.log("Error in function customerinfo " + e)
    return e
  }
}

const getimage = async (param) => {
  sql = `SELECT DATA FROM AGENT_BANKING.IMAGE_DATA WHERE AC_NO = ${param} AND SL_NO = 1`
  try {
    const data = await qurrythis(sql)
    return data
  } catch (e) {
    console.log("Error in function customerinfo " + e)
    return e
  }
}

const customerallac = async (key) => {
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
		 WHERE MPHONE = ${key}`

    const custid = await qurrythis(sql)

    if (custid !== "" || custid !== null) {
      sql = `/* Formatted on 3/22/2022 5:48:58 PM (QP5 v5.381) */
SELECT MPHONE,
			   REG_DATE,
			   (select NAME FROM AGENT_BANKING.AC_STATUS WHERE S_NAME = r.STATUS)STATUS,
			   BALANCE_M,
			   LIEN_M,
			   (SELECT p.ACC_TYPE_NAME
				FROM AGENT_BANKING.PRODUCT_SETUP p
			   WHERE p.ACC_TYPE_CODE = r.AC_TYPE_CODE)    AC_TYPE_CODE,
			
			   PMPHONE,
			   FORM_SERIAL,
			   DR_LINK_ACC,
			   (SELECT INT_PER FROM AGENT_BANKING.PRODUCT_SLAB_DTL WHERE SL_NO = SLAB_SL_NO)*100 PROFIT,
			   LAST_TRANS_DATE,
			   AUTHO_BY,
			   AUTHO_DATE
			   FROM agent_banking.reginfo r
			   WHERE CUST_ID = ${custid[0].CUST_ID}`
      const data = await qurrythis(sql)
      return data
    } else {
      return null
    }
  } catch (e) {
    console.log("Error in function customerinfo " + e)
    return e
  }
}
const customernom = async (param) => {
  try {
    let sql = `SELECT * FROM AGENT_BANKING.NOMINEE_INFO where AC_NO = '${param}'`

    const data = await qurrythis(sql)
    return data
  } catch (e) {
    console.log("Error in function customernom " + e)
    return e
  }
}
module.exports = { customerinfo, getimage, customerallac, customernom }
