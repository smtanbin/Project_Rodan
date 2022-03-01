const qurrythis = require('../apps/db')

const dailydrcr = async () => {
	try {
		const sql = `/* Formatted on 3/1/2022 3:28:05 PM (QP5 v5.374) */
		SELECT CURRENT_HOUR HOUR, SUM (DR_AMT) DR, SUM (CR_AMT) CR
		  FROM (SELECT BALANCE_MPHONE,
					   CR_AMT,
					   DR_AMT,
					   TO_CHAR (TRANS_DATE, 'HH24') || ':00'     AS CURRENT_HOUR
				  FROM AGENT_BANKING.GL_TRANS_DTL X
				 WHERE BALANCE_MPHONE IS NOT NULL)
	  GROUP BY CURRENT_HOUR
	  ORDER BY CURRENT_HOUR`
		// console.log(sql)
		return qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const drcragent = async (key) => {
	try {
		const sql = `/* Formatted on 3/1/2022 3:40:28 PM (QP5 v5.374) */
		SELECT CURRENT_HOUR "DAY", SUM (DR_AMT) DR, SUM (CR_AMT) CR
		  FROM (SELECT BALANCE_MPHONE,
					   ROUND (CR_AMT, 2)                         CR_AMT,
					   ROUND (DR_AMT, 2)                         DR_AMT,
					   TO_CHAR (TRANS_DATE, 'dd')     AS CURRENT_HOUR
				  FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL
						UNION
						SELECT * FROM AGENT_BANKING.GL_TRANS_DTL_OLD) X
				 WHERE     BALANCE_MPHONE = ${key}
					   AND TRUNC (TRANS_DATE) BETWEEN (SELECT TRUNC (
																	LAST_DAY (
																		SYSDATE)
																  - 1,
																  'mm')
														 FROM DUAL)
												  AND (SELECT SYSDATE FROM DUAL))
	  GROUP BY CURRENT_HOUR
	  ORDER BY CURRENT_HOUR`
		// console.log(sql)
		return qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

module.exports = { dailydrcr, drcragent }
