const qurrythis = require('../apps/db')

const accountInfo = async (key) => {
	try {
		let sql = `/* Formatted on 2/28/2022 7:49:59 PM (QP5 v5.374) */
		SELECT r.MPHONE                      MPHONE,
			   r.ACCOUNT_NAME                NAME,
			   r.CUST_ID                     CUSTOMERID,
			   CASE
				   WHEN r.STATUS = 'F' THEN 'FREEZE'
				   WHEN r.STATUS = 'A' THEN 'ACTIVE'
				   WHEN r.STATUS = 'C' THEN 'CLOSE'
			   END                           ACSTATUS,
			   CASE
				   WHEN r.REG_STATUS = 'P' THEN 'APPROVED'
				   WHEN r.REG_STATUS = 'L' THEN 'PAINDING'
				   WHEN r.REG_STATUS = 'R' THEN 'REJECTED'
			   END                           REGSTATUS,
			   r.CON_MOB                     CONTACT,
			   r.FORM_SERIAL                 SLNO,
			   r.AC_OPEN_DATE                OPENINGDATE,
			   r.RENEW_DATE                  RENEWDATE,
			   r.MATURITY_DATE               MATURITYDATE,
			   r.INSTL_AMT                   INSTALLMENTAMOUNT,
			   r.INSTL_DUE_COUNT             DUE,
			   (SELECT SUM ((INSTL_AMT + PENALTY_AMT) * INSTL_DUE_COUNT)
				  FROM AGENT_BANKING.REGINFO
				 WHERE MPHONE = r.MPHONE)    PAYABLE
		  FROM AGENT_BANKING.REGINFO r
		 WHERE PMPHONE = ${key} AND R.REG_STATUS NOT IN ('R') AND R.STATUS NOT IN ('C') AND AC_TYPE_CODE IN ('3','8','4')
	  ORDER BY FORM_SERIAL DESC`
		// console.log(sql)
		return await qurrythis(sql)
	} catch (e) {
		console.log('Error in function accountInfo ' + e)
		return e
	}
}
module.exports = { accountInfo }
