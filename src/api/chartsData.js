const qurrythis = require('../apps/db')

const balancePerformance = async () => {
	try {
		const sql = `/* Formatted on 3/1/2022 5:56:13 PM (QP5 v5.374) */
		SELECT old.HOUR,
			   NVL (TDR, 0)     TDR,
			   NVL (PDR, 0)     PDR,
			   NVL (TCR, 0)     TCR,
			   NVL (PCR, 0)     PCR
		  FROM (  SELECT CURRENT_HOUR "HOUR", SUM (DR_AMT) TDR, SUM (CR_AMT) TCR
					FROM (SELECT BALANCE_MPHONE,
								 ROUND (CR_AMT, 2)                        CR_AMT,
								 ROUND (DR_AMT, 2)                        DR_AMT,
								 TO_CHAR (TRANS_DATE, 'HH24') || ':00'    AS CURRENT_HOUR
								 FROM (SELECT * FROM AGENT_BANKING.GL_TRANS_DTL
									UNION
									SELECT * FROM AGENT_BANKING.GL_TRANS_DTL_OLD)
						   WHERE BALANCE_MPHONE IS NOT NULL AND TRUNC (TRANS_DATE) <=
						   (SELECT TRUNC (SYSDATE) FROM DUAL))
				GROUP BY CURRENT_HOUR) new
			   FULL OUTER JOIN
			   ((  SELECT CURRENT_HOUR "HOUR", SUM (DR_AMT) PDR, SUM (CR_AMT) PCR
					 FROM (SELECT BALANCE_MPHONE,
								  ROUND (CR_AMT, 2)                        CR_AMT,
								  ROUND (DR_AMT, 2)                        DR_AMT,
								  TO_CHAR (TRANS_DATE, 'HH24') || ':00'    AS CURRENT_HOUR
							 FROM AGENT_BANKING.GL_TRANS_DTL_OLD
							WHERE     BALANCE_MPHONE IS NOT NULL
								  AND TRUNC (TRANS_DATE) <=
									  (SELECT TRUNC (SYSDATE - 1) FROM DUAL))
				 GROUP BY CURRENT_HOUR)) old
				   ON new.HOUR = old.HOUR
	  --GROUP BY HOUR
	  ORDER BY HOUR`
		// console.log(sql)
		return qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
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
const previousdrcr = async () => {
	try {
		const sql = `/* Formatted on 3/1/2022 3:28:05 PM (QP5 v5.374) */
		SELECT CURRENT_HOUR HOUR, SUM (DR_AMT) DR, SUM (CR_AMT) CR
		  FROM (SELECT BALANCE_MPHONE,
					   CR_AMT,
					   DR_AMT,
					   TO_CHAR (TRANS_DATE, 'HH24') || ':00'     AS CURRENT_HOUR
				  FROM AGENT_BANKING.GL_TRANS_DTL_old X
				 WHERE BALANCE_MPHONE IS NOT NULL AND TRUNC (TRANS_DATE) = (SELECT SYSDATE-1 FROM DUAL))
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

module.exports = { dailydrcr, drcragent, balancePerformance, previousdrcr }
