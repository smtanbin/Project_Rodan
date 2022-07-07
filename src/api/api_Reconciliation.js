const qurrythis = require("./db/db")

const recon = async () => {
  try {
    const sql = `/* Formatted on 4/26/2022 12:15:01 PM (QP5 v5.381) */
        SELECT *
          FROM (  SELECT ACCTCODE,
            COA_DESC,
                         COA_CODE,
                         ROUND (C.CBSGL, 4)               CBSGL,
                         ROUND (A.ABSGL, 4)               ABSGL,
                         ROUND (A.ABSGL - C.CBSGL, 4)     DIF
                    FROM (SELECT COA_CODE,
                                 TANBIN.FUNC_GET_GL_BALANCE (SYS_COA_CODE)     ABSGL,
                                 a.COA_DESC
                            FROM AGENT_BANKING.GL_COA a) A
                         FULL OUTER JOIN
                         (  SELECT ACCTCODE, SUM (CREDIT_LCBL - DEBIT_LCBL) CBSGL
                              FROM AGENT_BANKING.MV_GL_DAILY_SUMMARY
                          GROUP BY ACCTCODE) C
                             ON A.COA_CODE = C.ACCTCODE
                   WHERE COA_CODE IS NOT NULL AND ACCTCODE IS NOT NULL
                ORDER BY ACCTCODE)
         WHERE DIF != 0`
    return await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}

module.exports = { recon }
