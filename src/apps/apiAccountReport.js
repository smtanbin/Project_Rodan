const qurrythis = require('./db')
const { oracleDate } = require('./FunCore')



const accountStatmentHead = async (date, key) => {
	try {
		fromdate = oracleDate(fromdate)
		const sql = `/* Formatted on 2/6/2022 8:32:47 AM (QP5 v5.374) */
		SELECT MPHONE,
		( SELECT NAME FROM AGENT_BANKING.REGINFO WHERE MPHONE = r.PMPHONE) PMPHONE,
			   ACCOUNT_NAME,
			   (SELECT P.ACC_TYPE_NAME
				  FROM AGENT_BANKING.PRODUCT_SETUP P
				 WHERE P.ACC_TYPE_CODE = R.AC_TYPE_CODE)
				   TYPE,
			   (SELECT ST.NAME
				  FROM AGENT_BANKING.AC_STATUS ST
				 WHERE ST.S_NAME = R.STATUS)
				   STATUS,
			   TO_CHAR (REG_DATE, 'MONTH dd, YYYY')
				   REG_DATE,
			   TANBIN.GET_ACC_BALANC (r.MPHONE, (TO_DATE ('${fromdate}') - 1))
				   BALANCE, TO_CHAR (MATURITY_DATE, 'MONTH dd, YYYY') MATURITY_DATE,
				   CUST_ID,
			   CON_MOB,
			   'address'
				   ADDR
		  FROM AGENT_BANKING.REGINFO R
		 WHERE MPHONE = ${key}`

		return await qurrythis(sql)
	} catch (e) {
		return e
	}
}
const accountStatmentBody = async (fromdate, todate, key) => {
	fromdate = oracleDate(fromdate)
	todate = oracleDate(todate)

	const sql = `/* Formatted on 2/6/2022 6:52:24 AM (QP5 v5.374) */
	SELECT P.CR_AMT,
		   P.DR_AMT,
		   P.TRANS_NO,
		   P.TRANS_DATE,
	--       CODE,
		   (CASE
				WHEN CODE = 'RTGSC'
				THEN
					NVL (
						(SELECT    'RTGS Recived with Document ID '
								|| C.MSGID
								|| ' and '
								|| NVL (C.INSTRFORNXTAGT, 'null')
								|| 'as note'
						   FROM AGENT_BANKING.ABS_RTGS_TRANSACTION_DST C
						  WHERE C.ST_DOCNUM = P.TRANS_NO),
						'RTGS Recived From a Unknown Bank')
				WHEN CODE = 'EFTC'
				THEN
					NVL ((SELECT 'Eft Recived From Bank ' || ORBANKRT
							FROM AGENT_BANKING.BEFTN_PROCESS_INFO_IN C
						   WHERE C.TR_NO = P.TRANS_NO),
						 'Eft Recived From a Unknown Bank')
				WHEN CODE = 'CEFT'
				THEN
					NVL (
						(SELECT    'Eft Send To Bank '
								|| ROUTING_NO
								|| ' Account No '
								|| TRANS_TO
								|| '('
								|| NAME_TO
								|| ')'
						   FROM AGENT_BANKING.EFT_INFO C
						  WHERE C.TRANS_NO = P.TRANS_NO),
						'Eft Send To A Unknown Bank')
				WHEN CODE = 'CC'
				THEN
					NVL (
						(CASE
							 WHEN     (SELECT cc.HOTKEY
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cc
										WHERE cc.TRANS_NO = P.TRANS_NO) =
									  'INSTALLMENT'
								  AND (SELECT cd.TRANS_FROM
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cd
										WHERE cd.TRANS_NO = P.TRANS_NO) =
									  P.MPHONE
							 THEN
								 (SELECT    'Premium for Scheam account '
										 || TRANS_TO
									FROM (SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST
										  UNION
										  SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST_old)WHERE TRANS_NO = P.TRANS_NO)
							 WHEN     (SELECT cc.HOTKEY
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cc
										WHERE cc.TRANS_NO = P.TRANS_NO) =
									  'INSTALLMENT'
								  AND (SELECT cd.TRANS_TO
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cd
										WHERE cd.TRANS_NO = P.TRANS_NO) =
									  P.MPHONE
							 THEN
								 (SELECT 'Premium Recived from ' || TRANS_FROM
									FROM (SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST
										  UNION
										  SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST_old))
							 WHEN     (SELECT cc.HOTKEY
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cc
										WHERE cc.TRANS_NO = P.TRANS_NO) =
									  'MT'
								  AND (SELECT cd.TRANS_FROM
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cd
										WHERE cd.TRANS_NO = P.TRANS_NO) =
									  P.MPHONE
							 THEN
								 (SELECT    'Fund Transfer to account '
										 || TRANS_TO
									FROM (SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST
										  UNION
										  SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST_old)  WHERE TRANS_NO = P.TRANS_NO)
							 WHEN     (SELECT cc.HOTKEY
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cc
										WHERE cc.TRANS_NO = P.TRANS_NO) =
									  'MT'
								  AND (SELECT cd.TRANS_TO
										 FROM (SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST
											   UNION
											   SELECT *
												 FROM AGENT_BANKING.GL_TRANS_MST_old)
											  cd
										WHERE cd.TRANS_NO = P.TRANS_NO) =
									  P.MPHONE
							 THEN
								 (SELECT 'Fund Recived from ' || TRANS_FROM
									FROM (SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST
										  UNION
										  SELECT *
											FROM AGENT_BANKING.GL_TRANS_MST_old)  WHERE TRANS_NO = P.TRANS_NO)
						 END),
						P.PARTICULAR)
				WHEN CODE NOT IN ('EFTC',
								  'CEFT',
								  'RTGSC',
								  'CC')
				THEN
					P.PARTICULAR
			END)    PARTICULAR,note
	  FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL
			UNION
			SELECT * FROM AGENT_BANKING.GL_TRANS_DTL_OLD) P
	 WHERE MPHONE = '${key}'
	  and trunc(TRANS_DATE) between '${fromdate}' and '${todate}'`

	return await qurrythis(sql)
}

module.exports = { accountStatmentHead,accountStatmentBody }
