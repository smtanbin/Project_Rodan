const qurrythis = require('../apps/db')
const { oracleDate } = require('../apps/FunCore')

const businessinfo = async (frommonth, tomonth, key) => {
	tomonth = oracleDate(tomonth)
	if (key === 'false') {
		if (frommonth === 'false') {
			/* If there no start date spicify*/
			try {
				const sql = ` SELECT
				PMPHONE,
				NAME,
				DOB,
				SIM_NO,
				MPHONE,
				ROUND(NVL(
				(SELECT DB.BALANCE FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB WHERE DB.MPHONE = R.MPHONE AND TRUNC (DB.BALANCE_DATE) = (SELECT LAST_DAY ('${tomonth}') FROM DUAL)
				),0),2) BALANCE
			FROM
				(
				SELECT
					PMPHONE,
					SIM_NO,
					MPHONE,
					DOB,
					NAME,
					REG_DATE
				FROM
					AGENT_BANKING.REGINFO C
				WHERE
					CAT_ID <> 'D'
					AND TRUNC (C.REG_DATE) <= '${tomonth}'
						AND C.REG_STATUS <> 'R'
						AND C.MPHONE NOT IN
																					   (
						SELECT
							AC_NO
						FROM
							AGENT_BANKING.ACC_CLOSING
						WHERE
							STATUS = 'S'
							AND TRUNC (CREATE_DATE) <= '${tomonth}')
				UNION ALL
					SELECT
						MPHONE PMPHONE,
						SIM_NO,
						MPHONE,
						DOB,
						NAME,
						REG_DATE
					FROM
						AGENT_BANKING.REGINFO C
					WHERE
						CAT_ID = 'D'
						AND TRUNC (C.REG_DATE) <= '${tomonth}'
							AND C.REG_STATUS <> 'R'
							AND C.MPHONE NOT IN
																					   (
							SELECT
								AC_NO
							FROM
								AGENT_BANKING.ACC_CLOSING
							WHERE
								STATUS = 'S'
								AND TRUNC (CREATE_DATE) <= '${tomonth}')) R`
				return await qurrythis(sql)
			} catch (e) {
				console.log(e)
				return e
			}
		} else {
			/*Start mont spify but not agent*/
			frommonth = oracleDate(frommonth)
			try {
				const sql = `/* Formatted on 3/10/2022 5:08:53 PM (QP5 v5.374) */
				SELECT PMPHONE,
					   NAME,
					   DOB,
					   SIM_NO,
					   MPHONE,
					   ROUND (
						   NVL (
							   (SELECT DB.BALANCE
								  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB
								 WHERE     DB.MPHONE = R.MPHONE
									   AND TRUNC (DB.BALANCE_DATE) BETWEEN (SELECT TRUNC(LAST_DAY('${frommonth}')-1, 'mm') FROM DUAL) AND
										   (SELECT LAST_DAY ('${tomonth}') FROM DUAL)),
							   0),
						   2)    BALANCE
				  FROM (SELECT PMPHONE,
							   SIM_NO,
							   MPHONE,
							   DOB,
							   NAME,
							   REG_DATE
						  FROM AGENT_BANKING.REGINFO C
						 WHERE     CAT_ID <> 'D' 
							   AND TRUNC (C.REG_DATE) <= '${tomonth}'
							   AND C.REG_STATUS <> 'R'
							   AND C.MPHONE NOT IN
									   (SELECT AC_NO
										  FROM AGENT_BANKING.ACC_CLOSING
										 WHERE     STATUS = 'S'
											   AND TRUNC (CREATE_DATE) <= '${tomonth}')
						UNION ALL
						SELECT MPHONE     PMPHONE,
							   SIM_NO,
							   MPHONE,
							   DOB,
							   NAME,
							   REG_DATE
						  FROM AGENT_BANKING.REGINFO C
						 WHERE     CAT_ID = 'D'
							   AND TRUNC (C.REG_DATE) <= '${tomonth}'
							   AND C.REG_STATUS <> 'R'
							   AND C.MPHONE NOT IN
									   (SELECT AC_NO
										  FROM AGENT_BANKING.ACC_CLOSING
										 WHERE     STATUS = 'S'
											   AND TRUNC (CREATE_DATE) <= '${tomonth}')) R`

				return await qurrythis(sql)
			} catch (e) {
				console.log(e)
				return e
			}
		}
	} else {
		if (frommonth === false) {
			try {
				const sql = `/* Formatted on 3/10/2022 5:08:53 PM (QP5 v5.374) */
				SELECT PMPHONE,
					   NAME,
					   DOB,
					   SIM_NO,
					   MPHONE,
					   ROUND (
						   NVL (
							   (SELECT DB.BALANCE
								  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB
								 WHERE     DB.MPHONE = R.MPHONE
									   AND TRUNC (DB.BALANCE_DATE) =
										   (SELECT LAST_DAY ('${tomonth}') FROM DUAL)),
							   0),
						   2)    BALANCE
				  FROM (SELECT PMPHONE,
							   SIM_NO,
							   MPHONE,
							   DOB,
							   NAME,
							   REG_DATE
						  FROM AGENT_BANKING.REGINFO C
						 WHERE     CAT_ID <> 'D'  AND PMPHONE = ${key}
							   AND TRUNC (C.REG_DATE) <= '${tomonth}'
							   AND C.REG_STATUS <> 'R'
							   AND C.MPHONE NOT IN
									   (SELECT AC_NO
										  FROM AGENT_BANKING.ACC_CLOSING
										 WHERE     STATUS = 'S' AND PMPHONE = ${key}
											   AND TRUNC (CREATE_DATE) <= '${tomonth}')
						UNION ALL
						SELECT MPHONE     PMPHONE,
							   SIM_NO,
							   MPHONE,
							   DOB,
							   NAME,
							   REG_DATE
						  FROM AGENT_BANKING.REGINFO C
						 WHERE     CAT_ID = 'D' AND PMPHONE = ${key}
							   AND TRUNC (C.REG_DATE) <= '${tomonth}'
							   AND C.REG_STATUS <> 'R'
							   AND C.MPHONE NOT IN
									   (SELECT AC_NO
										  FROM AGENT_BANKING.ACC_CLOSING
										 WHERE     STATUS = 'S'
											   AND TRUNC (CREATE_DATE) <= '${tomonth}')) R`

				return await qurrythis(sql)
			} catch (e) {
				return e
			}
		} else {
			frommonth = oracleDate(frommonth)

			try {
				const sql = `/* Formatted on 3/10/2022 5:08:53 PM (QP5 v5.374) */
				SELECT PMPHONE,
					   NAME,
					   DOB,
					   SIM_NO,
					   MPHONE,
					   ROUND (
						   NVL (
							   (SELECT DB.BALANCE
								  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB
								 WHERE     DB.MPHONE = R.MPHONE
									   AND TRUNC (DB.BALANCE_DATE) BETWEEN (SELECT TRUNC(LAST_DAY('${frommonth}')-1, 'mm') FROM DUAL) AND
										   (SELECT LAST_DAY ('${tomonth}') FROM DUAL)),
							   0),
						   2)    BALANCE
				  FROM (SELECT PMPHONE,
							   SIM_NO,
							   MPHONE,
							   DOB,
							   NAME,
							   REG_DATE
						  FROM AGENT_BANKING.REGINFO C  AND PMPHONE = ${key}
						 WHERE     CAT_ID <> 'D'
							   AND TRUNC (C.REG_DATE) <= '${tomonth}'
							   AND C.REG_STATUS <> 'R'
							   AND C.MPHONE NOT IN
									   (SELECT AC_NO
										  FROM AGENT_BANKING.ACC_CLOSING
										 WHERE     STATUS = 'S'
											   AND TRUNC (CREATE_DATE) <= '${tomonth}')
						UNION ALL
						SELECT MPHONE     PMPHONE,
							   SIM_NO,
							   MPHONE,
							   DOB,
							   NAME,
							   REG_DATE
						  FROM AGENT_BANKING.REGINFO C
						 WHERE     CAT_ID = 'D'  AND PMPHONE = ${key}
							   AND TRUNC (C.REG_DATE) <= '${tomonth}'
							   AND C.REG_STATUS <> 'R'
							   AND C.MPHONE NOT IN
									   (SELECT AC_NO
										  FROM AGENT_BANKING.ACC_CLOSING
										 WHERE     STATUS = 'S'
											   AND TRUNC (CREATE_DATE) <= '${tomonth}')) R`

				return await qurrythis(sql)
			} catch (e) {
				console.log(e)
				return e
			}
		}
	}
}

module.exports = { businessinfo }
