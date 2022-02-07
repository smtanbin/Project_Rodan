const qurrythis = require('./db')
const { oracleDate } = require('./FunCore')



const statementHead = async (date, key) => {
	try {
		date = oracleDate(date)
		const sql = `/* Formatted on 2/6/2022 8:32:47 AM (QP5 v5.374) */
		SELECT MPHONE,
		NVL(( SELECT NAME FROM AGENT_BANKING.REGINFO WHERE MPHONE = R.PMPHONE),MPHONE) PMPHONE,
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
			   ROUND((TANBIN.GET_ACC_BALANC (r.MPHONE, (TO_DATE ('${date}') - 1))
				   ),2)BALANCE, TO_CHAR (MATURITY_DATE, 'MONTH dd, YYYY') MATURITY_DATE,
				   CUST_ID,
			   CON_MOB,
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
					 WHERE code = (SELECT SUBSTR (LOCATION_CODE, 0, 6)    
									 FROM agent_banking.reginfo
									WHERE mphone = r.mphone)) 
				   ADDR
		  FROM AGENT_BANKING.REGINFO R
		 WHERE MPHONE = ${key}`
		//  console.log(sql)
		return await qurrythis(sql)
	} catch (e) {
		return e
	}
}
const statementBody = async (fromdate, todate, key) => {
	fromdate = oracleDate(fromdate)
	todate = oracleDate(todate)

	const sql = `/* Formatted on 2/6/2022 6:52:24 AM (QP5 v5.374) */
	SELECT P.CR_AMT,
		   P.DR_AMT,
		   P.TRANS_NO,
		   P.TRANS_DATE,
	
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
			END)    PARTICULAR
	  FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL
			UNION
			SELECT * FROM AGENT_BANKING.GL_TRANS_DTL_OLD) P
	 WHERE MPHONE = '${key}' and code is not null and code not in ('GLGL')
	  and trunc(TRANS_DATE) between '${fromdate}' and '${todate}' order by TRANS_DATE asc`
// console.log(sql)
const test = `/* Formatted on 2/6/2022 5:42:50 PM (QP5 v5.374) */
SELECT D.BALANCE_MPHONE                         MPHONE,
       D.TRANS_DATE                             "DATE",
       TO_CHAR (D.TRANS_DATE, 'DD/MM/YY')       TRANS_DATE,
       TO_CHAR (D.TRANS_DATE, 'HH:MI:SS AM')    TRANS_TIME,
       D.TRANS_NO,
      
       CASE
           WHEN D.CODE = 'CCCQ'
           THEN
                  D.PARTICULAR
               || ' , Chq No '
               || (SELECT SUBSTR (BILLNO, -7)
                     FROM AGENT_BANKING.GL_TRANS_MST
                    WHERE TRANS_NO = D.TRANS_NO)
           WHEN D.CODE = 'CACQ'
           THEN
                  D.PARTICULAR
               || ' , Chq No '
               || (SELECT SUBSTR (BILLNO, 1, 7)
                     FROM AGENT_BANKING.GL_TRANS_MST
                    WHERE TRANS_NO = D.TRANS_NO)
           ELSE
               D.PARTICULAR
       END                                      PARTICULAR,
       D.TRANS_REF_NO,
       D.VALUE_DATE,
       D.DR_AMT,
       D.CR_AMT
   
  FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL UNION SELECT * FROM AGENT_BANKING.GL_TRANS_DTL) D
 WHERE     D.BALANCE_TYPE = 'M'
       AND TO_DATE (TO_CHAR (D.TRANS_DATE, 'DD/MON/RRRR'), 'DD/MM/RRRR') BETWEEN '${fromdate}'
                                                                             AND '${todate}'
       AND D.BALANCE_MPHONE = ${key}

ORDER BY 3, TRANS_DATE ASC
--ORDER BY 3, TRANS_SL_NO ASC`
	return await qurrythis(sql)
}

module.exports = { statementHead, statementBody }
