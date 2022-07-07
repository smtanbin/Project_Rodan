const qurrythis = require("./db/db")
const { oracleDate } = require("./db/db_apps")

const getmis = async (month, year) => {
  const sql = `/* Formatted on 6/6/2022 10:34:36 AM (QP5 v5.381) */
SELECT CURRENT_PMPHONE                         AGENT,
       (SELECT R.NAME
          FROM AGENT_BANKING.REGINFO R
         WHERE R.MPHONE = CURRENT_PMPHONE)     NAME,
       (SELECT R.REG_DATE
          FROM AGENT_BANKING.REGINFO R
         WHERE R.MPHONE = CURRENT_PMPHONE)     OPEN_DATE,
       CURRENT_NO_OF_ACCOUNT,
       PRIVIOUS_NO_OF_ACCOUNT,
       CURRENT_DEPOSIT,
       PRIVIOUS_DEPOSIT,
       (CURRENT_DEPOSIT - PRIVIOUS_DEPOSIT)    ACC_DEPOSIT,
       CURRENT_REMI_AMOUNT,
       PRIVIOUS_REMI_AMOUNT,
       CURRENT_BILL_AMOUNT,
       PRIVIOUS_BILL_AMOUNT,
       CURRENT_COM,
       PRIVIOUS_COM
  FROM (SELECT PMPHONE           CURRENT_PMPHONE,
               NO_OF_ACCOUNT     CURRENT_NO_OF_ACCOUNT,
               DEPOSIT           CURRENT_DEPOSIT,
               REMI_AMOUNT       CURRENT_REMI_AMOUNT,
               BILL_AMOUNT       CURRENT_BILL_AMOUNT,
               COM               CURRENT_COM
          FROM TANBIN.MIS_DATA md
         WHERE md.LOGMONTH = ${month} AND md.LOG_YEAR = ${year}) A
       FULL OUTER JOIN
       (SELECT PMPHONE           PRIVIOUS_PMPHONE,
               NO_OF_ACCOUNT     PRIVIOUS_NO_OF_ACCOUNT,
               DEPOSIT           PRIVIOUS_DEPOSIT,
               REMI_AMOUNT       PRIVIOUS_REMI_AMOUNT,
               BILL_AMOUNT       PRIVIOUS_BILL_AMOUNT,
               COM               PRIVIOUS_COM
          FROM TANBIN.MIS_DATA md
         WHERE md.LOGMONTH = ${month} - 1 AND md.LOG_YEAR = ${year}) B
           ON A.CURRENT_PMPHONE = B.PRIVIOUS_PMPHONE`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in getmis function " + e)
    return e
  }
}

const updateData = async (date) => {
  sql = `/* Formatted on 6/6/2022 4:00:23 PM (QP5 v5.381) */
INSERT INTO TANBIN.MIS_DATA
      SELECT PMPHONE,
             EXTRACT (MONTH FROM TO_DATE ('${date}', 'DD-MM-YYYY'))
                 "MONTH",
             EXTRACT (YEAR FROM TO_DATE ('${date}', 'DD-MM-YYYY'))
                 "YEAR",
             MPHONE,
             NVL (BALANCE, 0),
             NVL (REM_ID, 0),
             NVL (SEN_REM_AMT, 0),
             NVL (BILL, 0),
             NVL (UTILITY, 0),
             NVL (COMMISSION, 0)
        FROM (SELECT *
                FROM (                         /*  NO OF ACCOUNT AND BALANCE*/
                        SELECT NVL (PMPHONE, MPHONE)    "PMPHONE",
                               COUNT (MPHONE)           "MPHONE",
                               ROUND (
                                   SUM (
                                       TANBIN.GETBALANCE (
                                           MPHONE,
                                           (LAST_DAY ('${date}')))),
                                   2)                   "BALANCE"
                          FROM AGENT_BANKING.REGINFO RG
                         WHERE MPHONE IN
                                   ((SELECT MPHONE
                                       FROM AGENT_BANKING.REGINFO AC_FILTER
                                      WHERE     TRUNC (AC_FILTER.REG_DATE) <=
                                                TO_DATE ('${date}',
                                                         'DD/MM/YYYY')
                                            AND AC_FILTER.REG_STATUS != 'R'
                                            AND AC_FILTER.MPHONE NOT IN
                                                    (SELECT AC_NO
                                                       FROM AGENT_BANKING.ACC_CLOSING
                                                      WHERE     STATUS = 'S'
                                                            AND TRUNC (
                                                                    CREATE_DATE) <=
                                                                TO_DATE (
                                                                    '${date}',
                                                                    'DD/MM/YYYY'))))
                      GROUP BY NVL (PMPHONE, MPHONE)) ACCOUNT
                     FULL OUTER JOIN
                     (                                       /*  REMITTANCE */
                        SELECT REC_AGENT_ACC,
                               COUNT (REM_ID)        "REM_ID",
                               SUM (SEN_REM_AMT)     "SEN_REM_AMT"
                          FROM AGENT_BANKING.REMITTANCE_INFO RM
                         WHERE     RM.STATUS != 'R'
                               AND TRUNC (RM.ENTRY_DATE) BETWEEN (SELECT TRUNC (
                                                                             TO_DATE (
                                                                                 '${date}',
                                                                                 'DD-MM-YYYY'),
                                                                             'month')
                                                                    FROM DUAL)
                                                             AND TO_DATE (
                                                                     '${date}',
                                                                     'DD/MM/YYYY')
                      GROUP BY REC_AGENT_ACC) REMITTANCE
                         ON ACCOUNT.PMPHONE = REMITTANCE.REC_AGENT_ACC) X
             FULL OUTER JOIN
             ((                                                 /*  UTILITY */
               SELECT TRANS_TO,
                      NVL (BILL, 0)          "BILL",
                      NVL (TRANS_AMT, 0)     "UTILITY",
                      COMMISSION
                 FROM (  SELECT TRANS_FROM,
                                COUNT (ID)          "BILL",
                                SUM (TRANS_AMT)     "TRANS_AMT"
                           FROM AGENT_BANKING.UTILITY_PAYMENT_INFO U
                          WHERE     STATUS = 'S'
                                AND TRUNC (U.ENTRY_DATE) BETWEEN (SELECT TRUNC (
                                                                             TO_DATE (
                                                                                 '${date}',
                                                                                 'DD-MM-YYYY'),
                                                                             'month')
                                                                    FROM DUAL)
                                                             AND TO_DATE (
                                                                     '${date}',
                                                                     'DD/MM/YYYY')
                       GROUP BY TRANS_FROM) UTILITY
                      FULL OUTER JOIN
                      (                                      /*  COMMISSION */
                         SELECT TRANS_TO, ROUND (SUM (PAY_AMT), 2) COMMISSION
                           FROM AGENT_BANKING.GL_TRANS_MST_OLD D
                          WHERE     TRUNC (TRANS_DATE) =
                                    (LAST_DAY ('${date}'))
                                AND HOTKEY IN ('COMMISSION', 'FLOAT_SHARES')
                       GROUP BY TRANS_TO) COMMISSION
                          ON UTILITY.TRANS_FROM = COMMISSION.TRANS_TO)) Y
                 ON X.PMPHONE = Y.TRANS_TO
        ORDER BY PMPHONE`

  try {
    await qurrythis(sql)
    return true
  } catch (e) {
    console.log("Error in getmis qurry this function " + e)
    return false
  }
}

const generatedata = async (input) => {
  let state = ""

  const param = oracleDate(input)
  let sql = `/* Formatted on 6/7/2022 5:10:15 PM (QP5 v5.381) */
SELECT COUNT (*) count
  FROM TANBIN.MIS_DATA
 WHERE     LOG_YEAR =
           EXTRACT (YEAR FROM TO_DATE ('${param}', 'DD-MM-YYYY'))
       AND LOGMONTH =
           EXTRACT (MONTH FROM TO_DATE ('${param}', 'DD-MM-YYYY'))`

  const eligibilityTest = await qurrythis(sql)
  console.log(eligibilityTest)
  eligibilityTest.map(async ({ COUNT }) => {
    if (COUNT === 0) {
      let update = await updateData(param)
      console.log(update)
      state = update
      return state
    } else {
      state = false
      return state
    }
  })
}

module.exports = { generatedata, getmis }
