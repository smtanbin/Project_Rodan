const qurrythis = require("../core/db")
const { oracleDate } = require("../core/FunCore")

const monthly_data = async (date) => {
  try {
    const sql = `/* Formatted on 5/17/2022 10:42:12 AM (QP5 v5.381) */
  SELECT PMPHONE,
         COUNT (NO_OF_AC)              "NO_AC",
         SUM (BALANCE)                 "BALANCE",
         '${oracleDate(date)}'                 "RDATE"
    FROM (/* Sub Qurry */
          SELECT NVL (R.PMPHONE, MPHONE)                                    "PMPHONE",
                 (MPHONE)                                                   "NO_OF_AC",
                 ROUND ((TANBIN.GETBALANCE (R.MPHONE, '${oracleDate(
                   date
                 )}')), 2)    "BALANCE"
            FROM AGENT_BANKING.REGINFO R
           WHERE     TRUNC (REG_DATE) <= '${oracleDate(date)}'
                 AND MPHONE IN
                         (SELECT MPHONE
                            FROM AGENT_BANKING.REGINFO AC_FILTER
                           WHERE     TRUNC (AC_FILTER.REG_DATE) <=
                                     TO_DATE ( '${oracleDate(
                                       date
                                     )}', 'DD/MM/YYYY')
                                 AND AC_FILTER.REG_STATUS != 'R'
                                 AND AC_FILTER.MPHONE NOT IN
                                         (SELECT AC_NO
                                            FROM AGENT_BANKING.ACC_CLOSING
                                           WHERE     STATUS = 'S'
                                                 AND TRUNC (CREATE_DATE) <=
                                                     TO_DATE ( '${oracleDate(
                                                       date
                                                     )}',
                                                              'DD/MM/YYYY'))))
GROUP BY PMPHONE
ORDER BY PMPHONE`
    // console.log(sql)
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in callback function " + e)
    return e
  }
}

module.exports = { monthly_data }
