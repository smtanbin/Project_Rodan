const qurrythis = require("../core/db")
const { oracleDate } = require("../core/FunCore")

const misreg = async (param) => {
  const sql = `/* Formatted on 5/18/2022 10:29:50 AM (QP5 v5.381) */
SELECT CURRENT_MONTH.PMPHONE PMPHONE,
    CURRENT_MONTH.CAR_NO_AC CURAC,
    ROUND (CURRENT_MONTH.CURL_BALANCE, 2) CURBAL,
    PREVIOUS_MONTH.PRE_NO_AC PMONAC,
    ROUND (PREVIOUS_MONTH.PRE_BALANCE, 2) PMONBAL
FROM (
        SELECT COUNT (MPHONE) CAR_NO_AC,
            NVL (PMPHONE, MPHONE) PMPHONE,
            SUM (
                TANBIN.GETBALANCE (
                    MPHONE,
                    (
                        SELECT '1' || '-JAN-' || (
                                SELECT EXTRACT (
                                        YEAR
                                        FROM TO_DATE (
                                                '${param}',
                                                'DD-MON-RR'
                                            )
                                    )
                                FROM DUAL
                            )
                        FROM DUAL
                    )
                )
            ) CURL_BALANCE
        FROM AGENT_BANKING.REGINFO R1
        WHERE TRUNC (R1.REG_DATE) <= '${param}'
            AND R1.REG_STATUS != 'R'
            AND R1.STATUS != 'C'
            AND MPHONE NOT IN (
                SELECT MPHONE
                FROM AGENT_BANKING.REGINFO AC_FILTER
                WHERE TRUNC (AC_FILTER.REG_DATE) <= TO_DATE (
                        (
                            SELECT LAST_DAY ('${param}')
                            FROM DUAL
                        ),
                        'DD/MM/YYYY'
                    )
            )
        GROUP BY NVL (PMPHONE, MPHONE)
    ) CURRENT_MONTH
    FULL OUTER JOIN (
        SELECT COUNT (MPHONE) PRE_NO_AC,
            NVL (PMPHONE, MPHONE) PMPHONE,
            SUM (
                TANBIN.GETBALANCE (
                    MPHONE,
                    (
                        SELECT LAST_DAY (ADD_MONTHS ('${param}', -1))
                        FROM DUAL
                    )
                )
            ) PRE_BALANCE
        FROM AGENT_BANKING.REGINFO R2
        WHERE TRUNC (R2.REG_DATE) <= (
                SELECT LAST_DAY (ADD_MONTHS ('${param}', -1))
                FROM DUAL
            )
            AND R2.REG_STATUS != 'R'
            AND R2.STATUS != 'C'
            AND MPHONE NOT IN (
                SELECT MPHONE
                FROM AGENT_BANKING.REGINFO AC_FILTER
                WHERE TRUNC (AC_FILTER.REG_DATE) <= TO_DATE (
                        (
                            SELECT '1' || '-JAN-' || (
                                    SELECT EXTRACT (
                                            YEAR
                                            FROM TO_DATE (
                                                    '${param}',
                                                    'DD-MON-RR'
                                                )
                                        )
                                    FROM DUAL
                                )
                            FROM DUAL
                        ),
                        'DD/MM/YYYY'
                    )
            )
        GROUP BY NVL (PMPHONE, MPHONE)
    ) PREVIOUS_MONTH ON CURRENT_MONTH.PMPHONE = PREVIOUS_MONTH.PMPHONE
ORDER BY PMPHONE`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in callback function " + e)
    return e
  }
}
const misremi = async (param) => {
  const sql = `/* Formatted on 5/18/2022 10:29:50 AM (QP5 v5.381) */
SELECT CURRENT_MONTH.PMPHONE PMPHONE,
    CURRENT_MONTH.CAR_NO_AC CURAC,
    ROUND (CURRENT_MONTH.CURL_BALANCE, 2) CURBAL,
    PREVIOUS_MONTH.PRE_NO_AC PMONAC,
    ROUND (PREVIOUS_MONTH.PRE_BALANCE, 2) PMONBAL
FROM (
        SELECT COUNT (MPHONE) CAR_NO_AC,
            NVL (PMPHONE, MPHONE) PMPHONE,
            SUM (
                TANBIN.GETBALANCE (
                    MPHONE,
                    (
                        SELECT '1' || '-JAN-' || (
                                SELECT EXTRACT (
                                        YEAR
                                        FROM TO_DATE (
                                                '${param}',
                                                'DD-MON-RR'
                                            )
                                    )
                                FROM DUAL
                            )
                        FROM DUAL
                    )
                )
            ) CURL_BALANCE
        FROM AGENT_BANKING.REGINFO R1
        WHERE TRUNC (R1.REG_DATE) <= '${param}'
            AND R1.REG_STATUS != 'R'
            AND R1.STATUS != 'C'
            AND MPHONE NOT IN (
                SELECT MPHONE
                FROM AGENT_BANKING.REGINFO AC_FILTER
                WHERE TRUNC (AC_FILTER.REG_DATE) <= TO_DATE (
                        (
                            SELECT LAST_DAY ('${param}')
                            FROM DUAL
                        ),
                        'DD/MM/YYYY'
                    )
            )
        GROUP BY NVL (PMPHONE, MPHONE)
    ) CURRENT_MONTH
    FULL OUTER JOIN (
        SELECT COUNT (MPHONE) PRE_NO_AC,
            NVL (PMPHONE, MPHONE) PMPHONE,
            SUM (
                TANBIN.GETBALANCE (
                    MPHONE,
                    (
                        SELECT LAST_DAY (ADD_MONTHS ('${param}', -1))
                        FROM DUAL
                    )
                )
            ) PRE_BALANCE
        FROM AGENT_BANKING.REGINFO R2
        WHERE TRUNC (R2.REG_DATE) <= (
                SELECT LAST_DAY (ADD_MONTHS ('${param}', -1))
                FROM DUAL
            )
            AND R2.REG_STATUS != 'R'
            AND R2.STATUS != 'C'
            AND MPHONE NOT IN (
                SELECT MPHONE
                FROM AGENT_BANKING.REGINFO AC_FILTER
                WHERE TRUNC (AC_FILTER.REG_DATE) <= TO_DATE (
                        (
                            SELECT '1' || '-JAN-' || (
                                    SELECT EXTRACT (
                                            YEAR
                                            FROM TO_DATE (
                                                    '${param}',
                                                    'DD-MON-RR'
                                                )
                                        )
                                    FROM DUAL
                                )
                            FROM DUAL
                        ),
                        'DD/MM/YYYY'
                    )
            )
        GROUP BY NVL (PMPHONE, MPHONE)
    ) PREVIOUS_MONTH ON CURRENT_MONTH.PMPHONE = PREVIOUS_MONTH.PMPHONE
ORDER BY PMPHONE`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in callback function " + e)
    return e
  }
}

module.exports = { misreg, misremi }
