const { oradb } = require("./db/oradb")

const timeline = async (what, which) => {
	let sql = `
	select * 
	from (	
		SELECT
		TRANS_NO TRANS_NO,
		TRANS_DATE Time,
		TRANS_FROM From_Account,
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
		TRANS_TO To_Account,
		REF_PHONE ACCOUNT,
		PAY_AMT AMOUNT,
		MERCHANT_SNAME Merchant,
		PARTICULAR

	FROM
		AGENT_BANKING.GL_TRANS_MST m
		ORDER BY
			TRANS_NO DESC
			FETCH NEXT 100 ROWS ONLY
		)
	WHERE 
		${what} like '%${which}%' or ${what} = '${which}'
		`

	if (what === undefined || which === undefined) {
		sql = `
	select * 
	from (	
		SELECT
		TRANS_NO TRANS_NO,
		TRANS_DATE Time,
		TRANS_FROM From_Account,
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
		TRANS_TO To_Account,
		REF_PHONE ACCOUNT,
		PAY_AMT AMOUNT,
		MERCHANT_SNAME Merchant,
		PARTICULAR

	FROM
		AGENT_BANKING.GL_TRANS_MST m
		ORDER BY
			TRANS_NO DESC
			FETCH NEXT 100 ROWS ONLY
		)
		`
	}
	return new Promise(async (resolve, reject) => {
		await oradb(sql).then((payload) => {
			resolve(payload)
		}).catch((e) => { reject(e) })

	})

}
const trSearch = async (key) => {
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
	return new Promise(async (resolve, reject) => {
		await oradb(sql).then((payload) => {
			resolve(payload)
		}).catch((e) => { reject(e) })

	})
}

module.exports = { timeline, trSearch }
