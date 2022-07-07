const qurrythis = require("./db/db")
// const { oracleDate } = require("./db/db_apps")

const pendingEftSumm = async () => {
  const sql = `/* Formatted on 6/15/2022 2:25:11 PM (QP5 v5.381) */
  SELECT AC_TYPE_CODE "TYPE", COUNT (ACTNUM) "COUNT", SUM (AMOUNT) "SUM"
    FROM (  SELECT (CASE
                        WHEN SUBSTR (ACTNUM, 0, 3) = 001
                        THEN
                            SUBSTR (ACTNUM, 3, 13)
                        WHEN SUBSTR (ACTNUM, 0, 3) != 001
                        THEN
                            ACTNUM
                    END)             "ACTNUM",
                   (SELECT (SELECT P.ACC_TYPE_SHORT_NAME
                              FROM AGENT_BANKING.PRODUCT_SETUP P
                             WHERE P.ACC_TYPE_CODE = R1.AC_TYPE_CODE)
                      FROM AGENT_BANKING.REGINFO R1
                     WHERE MPHONE =
                           (CASE
                                WHEN SUBSTR (ACTNUM, 0, 3) = 001
                                THEN
                                    SUBSTR (ACTNUM, 3, 13)
                                WHEN SUBSTR (ACTNUM, 0, 3) != 001
                                THEN
                                    ACTNUM
                            END))    AC_TYPE_CODE,
                   AMOUNT            "AMOUNT"
              FROM BEFTN.BEFTN_PROCESS_INFO@SBL_DBL_IT
             WHERE     LTRIM (ACTNUM, '0') LIKE '108%'
                   AND TRUNC (SETTLEDATE) = TRUNC (SYSDATE)
                   AND SESSION_NO =
                       (CASE
                            WHEN TO_CHAR (SYSDATE, 'HH24') < 14 THEN 2
                            ELSE 1
                        END)
                   AND (CBS_STATUS IS NULL OR CBS_STATUS = 'E')
                   AND (HONOURED IS NULL OR HONOURED = 'N')
                   AND RETURNED IS NULL
                   AND SYS_NO NOT IN
                           (SELECT SYS_NO
                              FROM AGENT_BANKING.BEFTN_PROCESS_INFO_IN
                             WHERE     TRUNC (TIMSTAMP) = TRUNC (SYSDATE)
                                   AND CHK_STATUS IS NULL
                                   AND NVL (SUB_TRTYPE, 'ICE') <> 'IRE')
                   AND (CASE
                            WHEN SUBSTR (ACTNUM, 0, 3) = 001
                            THEN
                                SUBSTR (ACTNUM, 3, 13)
                            WHEN SUBSTR (ACTNUM, 0, 3) != 001
                            THEN
                                ACTNUM
                        END) IN
                           (SELECT MPHONE
                              FROM AGENT_BANKING.REGINFO R
                             WHERE R.REG_STATUS != 'R' AND STATUS != 'C')
          ORDER BY ACTNUM ASC)
GROUP BY AC_TYPE_CODE`
  try {
    return await qurrythis(sql)
  } catch (error) {
    console.log(error)
  }
}
const pendingEftList = async () => {
  const sql = `/* Formatted on 6/22/2022 10:34:28 AM (QP5 v5.381) */
  SELECT (CASE
              WHEN SUBSTR (ACTNUM, 0, 3) = 001 THEN SUBSTR (ACTNUM, 3, 13)
              WHEN SUBSTR (ACTNUM, 0, 3) != 001 THEN ACTNUM
          END)                         "ACTNUM",
         RECEIVERNAME                  RECIVER,
         NVL (
             (SELECT R.ACCOUNT_NAME
                FROM AGENT_BANKING.REGINFO R
               WHERE     R.STATUS != 'C'
                     AND R.REG_STATUS != 'R'
                     AND MPHONE =
                         (CASE
                              WHEN SUBSTR (ACTNUM, 0, 3) = 001
                              THEN
                                  SUBSTR (ACTNUM, 3, 13)
                              WHEN SUBSTR (ACTNUM, 0, 3) != 001
                              THEN
                                  ACTNUM
                          END)),
             'NOT FOUND')              "ABS_AC_TITEL",
         AMOUNT                        "AMOUNT",
         NVL ((SELECT BANKNM
                 FROM BEFTN.EFT_BANK@SBL_DBL_IT
                WHERE ROUTECODE = ORBANKRT),
              NVL ((SELECT BANK
                      FROM TANBIN.BANK_ROUTING
                     WHERE ROUTING_NO = ORBANKRT || ORBANKCHECKDG),
                   NVL ((SELECT BANK
                           FROM TANBIN.BANK_ROUTING
                          WHERE ROUTING_NO = ORBANKRT),
                        ORBANKRT)))    "ORIG_BANK_NAME",
         NVL ((SELECT BRNNAM
                 FROM BEFTN.EFT_branch@SBL_DBL_IT
                WHERE ROUTNO = ORBANKRT),
              NVL ((SELECT BRANCH
                      FROM TANBIN.BANK_ROUTING
                     WHERE ROUTING_NO = ORBANKRT || ORBANKCHECKDG),
                   ORBANKRT))          "ORIG_BRANCH_NAME",
         COMPANYNAME                   "SENDER",
         PAYMENTINFO                   "NOTE"
    FROM BEFTN.BEFTN_PROCESS_INFO@SBL_DBL_IT
   WHERE     LTRIM (ACTNUM, '0') LIKE '108%'
         AND TRUNC (SETTLEDATE) = TRUNC (SYSDATE)
         AND SESSION_NO =
             (CASE WHEN TO_CHAR (SYSDATE, 'HH24') < 14 THEN 2 ELSE 1 END)
         AND (CBS_STATUS IS NULL OR CBS_STATUS = 'E')
         AND (HONOURED IS NULL OR HONOURED = 'N')
         AND RETURNED IS NULL
         AND SYS_NO NOT IN
                 (SELECT SYS_NO
                    FROM AGENT_BANKING.BEFTN_PROCESS_INFO_IN
                   WHERE     TRUNC (TIMSTAMP) = TRUNC (SYSDATE)
                         AND CHK_STATUS IS NULL
                         AND NVL (SUB_TRTYPE, 'ICE') <> 'IRE')
         AND (CASE
                  WHEN SUBSTR (ACTNUM, 0, 3) = 001 THEN SUBSTR (ACTNUM, 3, 13)
                  WHEN SUBSTR (ACTNUM, 0, 3) != 001 THEN ACTNUM
              END) IN
                 (SELECT MPHONE
                    FROM AGENT_BANKING.REGINFO R
                   WHERE R.REG_STATUS != 'R' AND STATUS != 'C')
ORDER BY ACTNUM ASC`
  try {
    return await qurrythis(sql)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { pendingEftSumm, pendingEftList }
