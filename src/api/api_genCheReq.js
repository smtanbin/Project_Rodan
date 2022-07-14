const { oradb } = require("./db/oradb")
const { getSectionKey } = require("../core/authBypass")
const { chq_request } = require("./lib/chaque")

const genarateRequest = (mphone) => {
  return new Promise(async (resolve, reject) => {
    let sql = `SELECT r.PMPHONE,r.MPHONE,regexp_replace(r.ACCOUNT_NAME, ' ', '+') NAME,
       (SELECT TANBIN.FUNC_GET_PIN (r2.PIN_NO) FROM AGENT_BANKING.REGINFO r2 WHERE mphone = r.PMPHONE)    pin,
       (SELECT NVL (A.CHQ_PREFIX, 0) SHORT_NAME FROM agent_banking.AC_TYPE_LIST A, agent_banking.PRODUCT_SETUP P
           WHERE A.ID = P.ACC_TYPE_CODE AND P.CHEQUE_BOOK_FACILITY = 'Y' AND A.ID = r.AC_TYPE_CODE
        GROUP BY A.CHQ_PREFIX)        AC_TYPE,
       nvl(r.WFPIN_NO,'system') WFPIN_NO
  FROM agent_banking.reginfo r
 WHERE mphone = ${mphone}`

    // return new Promise(async (resolve, reject) => {
    const data = await oradb(sql)
      .then((data) => {
        return data
      })
      .then((data) => {
        data.map(async ({ PMPHONE, MPHONE, NAME, PIN, AC_TYPE, WFPIN_NO }) => {
          NAME = NAME.toString()
          const sectionid = await getSectionKey(PMPHONE, PIN)
            .then(async () => {
              let page = 10
              if (AC_TYPE === "CD") {
                page = 25
              } else {
                page = 10
              }
              await chq_request(
                sectionid,
                PMPHONE,
                MPHONE,
                page,
                NAME,
                WFPIN_NO
              )
                .then((data) => {
                  return data
                })
                .catch((err) => {
                  reject(err)
                })
            })
            .catch((err) => {
              reject(err)
            })
        })
      })
    resolve(data)
  })
}


const check_req = (mphone) => {

  return new Promise(async (resolve, reject) => {
    let sql = `SELECT	TRANS_DATE FROM	(	SELECT TRANS_DATE,TRANS_FROM FROM	AGENT_BANKING.GL_TRANS_MST_OLD gtmo
	WHERE	PARTICULAR = 'Cheque Book Fee' UNION SELECT	TRANS_DATE,	TRANS_FROM	FROM	AGENT_BANKING.GL_TRANS_MST gtmo
	WHERE	PARTICULAR = 'Cheque Book Fee') WHERE	TRANS_FROM = ${mphone}`

    oradb(sql).then((data) => {

      if (data.length === 0) {

        reject(404)
      }
      else {
        resolve(data)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = { genarateRequest, check_req }
