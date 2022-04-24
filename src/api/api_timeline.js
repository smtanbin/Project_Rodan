const qurrythis = require('../core/db')

const timeline = async () => {
	try {
		const sql = `SELECT
		TRANS_NO,
		TRANS_DATE,
		TRANS_FROM,
		(
		SELECT
			gc.COA_CODE
		FROM
			AGENT_BANKING.GL_COA gc
		WHERE
			gc.SYS_COA_CODE = m.FROM_SYS_COA_CODE) FROM_GL,
		(
		SELECT
			gc.COA_CODE
		FROM
			AGENT_BANKING.GL_COA gc
		WHERE
			gc.SYS_COA_CODE = m.TO_SYS_COA_CODE) TO_GL ,
		TRANS_TO,
		REF_PHONE,
		PAY_AMT,
		MERCHANT_SNAME,
		PARTICULAR

	FROM
		AGENT_BANKING.GL_TRANS_MST m
	ORDER BY
		TRANS_NO DESC
		FETCH NEXT 100 ROWS ONLY`
		// console.log(sql)
		return qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
const trSearch = async (key) => {
	try {
		const sql = `SELECT
		gtm.TRANS_NO,
		gtm.TRANS_DATE,
		gtm.TRANS_FROM,
		(
		SELECT
			ps.ACC_TYPE_NAME
		FROM
			AGENT_BANKING.PRODUCT_SETUP ps
		WHERE
			ps.ACC_TYPE_CODE = gtm.FROM_AC_TYPE_CODE) FROM_AC_TYPE_CODE,
		(
		SELECT
				gc.COA_CODE
		FROM
				AGENT_BANKING.GL_COA gc
		WHERE
				gc.SYS_COA_CODE = gtm.FROM_SYS_COA_CODE) FROM_GL,
					(
		SELECT
				gc.SHORT_NAME
		FROM
				AGENT_BANKING.GL_COA gc
		WHERE
				gc.SYS_COA_CODE = gtm.FROM_SYS_COA_CODE) FROM_GL_NAME,
		gtm.TRANS_TO,
		(
		SELECT
			ps.ACC_TYPE_NAME
		FROM
			AGENT_BANKING.PRODUCT_SETUP ps
		WHERE
			ps.ACC_TYPE_CODE = gtm.TO_AC_TYPE_CODE) TO_AC_TYPE_CODE,
		(
		SELECT
				gc.COA_CODE
		FROM
				AGENT_BANKING.GL_COA gc
		WHERE
				gc.SYS_COA_CODE = gtm.TO_SYS_COA_CODE) TO_GL,
				(
		SELECT
				gc.SHORT_NAME
		FROM
				AGENT_BANKING.GL_COA gc
		WHERE
				gc.SYS_COA_CODE = gtm.TO_SYS_COA_CODE) TO_GL_NAME,
		gtm.ENTRY_USER,
		gtm.ENTRY_DATE,
		gtm.CHECK_USER,
		gtm.CHECK_DATE,
		gtm.UPDATE_USER,
		gtm.UPDATE_DATE,
		PAY_AMT,
		MSG_AMT,
		SCHARGE_AMT,
		VAT_AMT,
		BILLNO,
		REF_PHONE,
		MERCHANT_SNAME,
		PARTICULAR,
		CODE,
		HOTKEY,
		NOTE
	FROM
		(
		SELECT
			*
		FROM
			AGENT_BANKING.GL_TRANS_MST
	UNION
		SELECT
			*
		FROM
			AGENT_BANKING.GL_TRANS_MST) gtm
	WHERE
		TRANS_NO = ${key}`
		// console.log(sql)
		return qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}

module.exports = { timeline, trSearch }
