const qurrythis = require('./db')

const timeline = async () => {
	try{

		const sql = `SELECT TRANS_NO,TRANS_DATE,TRANS_FROM,TRANS_TO,REF_PHONE,PAY_AMT,MERCHANT_SNAME,MSG_AMT,SCHARGE_AMT,PARTICULAR,CODE,NOTE
		FROM AGENT_BANKING.GL_TRANS_MST
		ORDER BY TRANS_NO DESC`
		return qurrythis(sql)
	} catch (e){
		return e

	}
}

module.exports = {timeline}