const qurrythis = require("./db/db")
const { oracleDate } = require("./db/db_apps")

const statementHead = async (date, key) => {
  try {
    if (date === "null") {
      date = await qurrythis(`SELECT REG_DATE FROM AGENT_BANKING.REGINFO WHERE MPHONE = ${key}`)
      date = JSON.stringify(date[0])
      date = JSON.parse(date)
      date = date.REG_DATE
    }
    date = oracleDate(date)
    let sql = `/* Formatted on 2/6/2022 8:32:47 AM (QP5 v5.374) */
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
			   ROUND((TANBIN.GETBALANCE (r.MPHONE, (TO_DATE ('${date}') - 1))
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


    return await qurrythis(sql)
  } catch (e) {
    return e
  }
}
const statementBody = async (fromdate, todate, key) => {
  fromdate = oracleDate(fromdate)
  todate = oracleDate(todate)
  try {
    const sql = `/* Formatted on 5/30/2022 4:21:37 PM (QP5 v5.381) */
  SELECT NVL (P.CR_AMT, 0)    CR_AMT,
         NVL (P.DR_AMT, 0)    DR_AMT,
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
              WHEN CODE = 'DS'
              THEN
                  NVL ((SELECT 'Refund to Bank. Remarks: "' || REMARKS || '"'
                          FROM AGENT_BANKING.TBL_BD_STATUS TBL
                         WHERE TBL.TRANNO = P.TRANS_NO),
                       'Refund to Bank')
              WHEN CODE = 'EFTC'
              THEN
                  NVL ((SELECT    'Eft Recived From Bank '
                               || (SELECT BANK || ' ' || BRANCH
                                     FROM tanbin.BANK_ROUTING
                                    WHERE ROUTING_NO = ORBANKRT)
                               || '('
                               || ORBANKRT
                               || ')'
                          FROM AGENT_BANKING.BEFTN_PROCESS_INFO_IN C
                         WHERE C.TR_NO = P.TRANS_NO),
                       'Eft Recived From a Unknown Bank')
              WHEN CODE = 'CEFT'
              THEN
                  NVL ((SELECT    'Eft Send To Bank '
                               || (SELECT BANK || ' ' || BRANCH
                                     FROM tanbin.BANK_ROUTING
                                    WHERE ROUTING_NO = C.ROUTING_NO)
                               || '('
                               || ROUTING_NO
                               || ')'
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
                                    P.BALANCE_MPHONE
                           THEN
                               (SELECT    'Premium for Scheam account '
                                       || TRANS_TO
                                  FROM (SELECT *
                                          FROM AGENT_BANKING.GL_TRANS_MST
                                        UNION
                                        SELECT *
                                          FROM AGENT_BANKING.GL_TRANS_MST_old)
                                 WHERE TRANS_NO = P.TRANS_NO)
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
                                    P.BALANCE_MPHONE
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
                                    P.BALANCE_MPHONE
                           THEN
                               (SELECT 'Fund Transfer to account ' || TRANS_TO
                                  FROM (SELECT *
                                          FROM AGENT_BANKING.GL_TRANS_MST
                                        UNION
                                        SELECT *
                                          FROM AGENT_BANKING.GL_TRANS_MST_old)
                                 WHERE TRANS_NO = P.TRANS_NO)
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
                                    P.BALANCE_MPHONE
                           THEN
                               (SELECT 'Fund Recived from ' || TRANS_FROM
                                  FROM (SELECT *
                                          FROM AGENT_BANKING.GL_TRANS_MST
                                        UNION
                                        SELECT *
                                          FROM AGENT_BANKING.GL_TRANS_MST_old)
                                 WHERE TRANS_NO = P.TRANS_NO)
                       END),
                      P.PARTICULAR)
              WHEN CODE NOT IN ('EFTC',
                                'CEFT',
                                'RTGSC',
                                'CC')
              THEN
                  P.PARTICULAR
              WHEN CODE IS NULL
              THEN
                  P.PARTICULAR
          END)                PARTICULAR
    FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL
          UNION
          SELECT * FROM AGENT_BANKING.GL_TRANS_DTL_OLD) P
	 WHERE     BALANCE_MPHONE = '${key}'
		   AND TRUNC (TRANS_DATE) BETWEEN '${fromdate}' AND '${todate}' 
  ORDER BY TRANS_NO ASC`

    return await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}

module.exports = { statementHead, statementBody }
