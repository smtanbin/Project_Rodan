const qurrythis = require("./db/db")
const { oracleDate } = require("./db/db_apps")

const businessinfo = async (frommonth, tomonth) => {
  tomonth = oracleDate(tomonth)
  let sql = ""
  if (frommonth === "false") {
    /* If there no start date spicify*/
    sql = ` SELECT
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
  } else {
    /*Start mont spify but not agent*/
    frommonth = oracleDate(frommonth)
    sql = `/* Formatted on 3/14/2022 3:17:22 PM (QP5 v5.374) */
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
			  FROM ((SELECT PMPHONE,
							SIM_NO,
							MPHONE,
							DOB,
							NAME,
							REG_DATE
					   FROM AGENT_BANKING.REGINFO C
					  WHERE     CAT_ID <> 'D'
							AND TRUNC (C.REG_DATE) BETWEEN '${frommonth}'
													   AND '${tomonth}'
							AND C.REG_STATUS <> 'R'
							AND C.MPHONE NOT IN
									(SELECT AC_NO
									   FROM AGENT_BANKING.ACC_CLOSING
									  WHERE     STATUS = 'S'
											AND TRUNC (CREATE_DATE) BETWEEN '${frommonth}'
																		AND '${tomonth}'))
					UNION ALL
					(SELECT MPHONE     PMPHONE,
							SIM_NO,
							MPHONE,
							DOB,
							NAME,
							REG_DATE
					   FROM AGENT_BANKING.REGINFO C
					  WHERE     CAT_ID = 'D'
							AND TRUNC (C.REG_DATE) BETWEEN '${frommonth}'
													   AND '${tomonth}'
							AND C.REG_STATUS <> 'R'
							AND C.MPHONE NOT IN
									(SELECT AC_NO
									   FROM AGENT_BANKING.ACC_CLOSING
									  WHERE     STATUS = 'S'
											AND TRUNC (CREATE_DATE) BETWEEN '${frommonth}'
																		AND '${tomonth}')))R`
  }
  try {
    // console.log(sql)
    return await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}

const businessinfoheader = async (frommonth, tomonth) => {
  tomonth = oracleDate(tomonth)

  let sql = ""
  if (frommonth === "false") {
    sql = `/* Formatted on 3/14/2022 3:30:06 PM (QP5 v5.374) */
	SELECT COUNT (MPHONE)    MPHONE,
		   SIM_NO,
		   SUM (
			   ROUND (
				   NVL (
					   (SELECT DB.BALANCE
						  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB
						 WHERE     DB.MPHONE = R.MPHONE
							   AND TRUNC (DB.BALANCE_DATE) =
								   (SELECT LAST_DAY ('${tomonth}') FROM DUAL)),
					   0),
				   2))       BALANCE
	  FROM ((SELECT PMPHONE,
					SIM_NO,
					MPHONE,
					DOB,
					NAME,
					REG_DATE
			   FROM AGENT_BANKING.REGINFO C
			  WHERE     CAT_ID <> 'D'
					AND TRUNC (C.REG_DATE) <='${tomonth}'
					AND C.REG_STATUS <> 'R'
					AND C.MPHONE NOT IN
							(SELECT AC_NO
							   FROM AGENT_BANKING.ACC_CLOSING
							  WHERE     STATUS = 'S'
									AND TRUNC (CREATE_DATE) <= '${tomonth}'))
			UNION ALL
			(SELECT MPHONE     PMPHONE,
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
									AND TRUNC (CREATE_DATE) <= '${tomonth}')))
		   R
  GROUP BY SIM_NO`
  } else {
    frommonth = oracleDate(frommonth)
    sql = `/* Formatted on 3/14/2022 3:30:06 PM (QP5 v5.374) */
	SELECT COUNT (MPHONE)    MPHONE,
		   SIM_NO,
		   SUM (
			   ROUND (
				   NVL (
					   (SELECT DB.BALANCE
						  FROM AGENT_BANKING.DAILY_BALANCE_BAPPY_NEW DB
						 WHERE     DB.MPHONE = R.MPHONE
							   AND TRUNC (DB.BALANCE_DATE) =
								   (SELECT LAST_DAY ('${tomonth}') FROM DUAL)),
					   0),
				   2))       BALANCE
	  FROM ((SELECT PMPHONE,
					SIM_NO,
					MPHONE,
					DOB,
					NAME,
					REG_DATE
			   FROM AGENT_BANKING.REGINFO C
			  WHERE     CAT_ID <> 'D'
					AND TRUNC (C.REG_DATE) BETWEEN '${frommonth}'
											   AND '${tomonth}'
					AND C.REG_STATUS <> 'R'
					AND C.MPHONE NOT IN
							(SELECT AC_NO
							   FROM AGENT_BANKING.ACC_CLOSING
							  WHERE     STATUS = 'S'
									AND TRUNC (CREATE_DATE) BETWEEN '${frommonth}'
																AND '${tomonth}'))
			UNION ALL
			(SELECT MPHONE     PMPHONE,
					SIM_NO,
					MPHONE,
					DOB,
					NAME,
					REG_DATE
			   FROM AGENT_BANKING.REGINFO C
			  WHERE     CAT_ID = 'D'
					AND TRUNC (C.REG_DATE) BETWEEN '${frommonth}'
											   AND '${tomonth}'
					AND C.REG_STATUS <> 'R'
					AND C.MPHONE NOT IN
							(SELECT AC_NO
							   FROM AGENT_BANKING.ACC_CLOSING
							  WHERE     STATUS = 'S'
									AND TRUNC (CREATE_DATE) BETWEEN '${frommonth}'
																AND '${tomonth}')))
		   R
  GROUP BY SIM_NO`
  }

  try {
    return await qurrythis(sql)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { businessinfo, businessinfoheader }
