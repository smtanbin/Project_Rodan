const qurrythis = require("./db/db")
const { getSectionKey } = require("../core/authBypass")
const { chq_request } = require("./lib/chaque")

const genarateRequest = (mphone) => {

  return new Promise(async (resolve, reject) => {



    try {
      let sql = `SELECT r.PMPHONE,r.MPHONE,regexp_replace(r.ACCOUNT_NAME, ' ', '+') NAME,
       (SELECT TANBIN.FUNC_GET_PIN (r2.PIN_NO) FROM AGENT_BANKING.REGINFO r2 WHERE mphone = r.PMPHONE)    pin,
       (SELECT NVL (A.CHQ_PREFIX, 0) SHORT_NAME FROM agent_banking.AC_TYPE_LIST A, agent_banking.PRODUCT_SETUP P
           WHERE A.ID = P.ACC_TYPE_CODE AND P.CHEQUE_BOOK_FACILITY = 'Y' AND A.ID = r.AC_TYPE_CODE
        GROUP BY A.CHQ_PREFIX)        AC_TYPE,
       nvl(r.WFPIN_NO,'system') WFPIN_NO
  FROM agent_banking.reginfo r
 WHERE mphone = ${mphone}`

      const data = await qurrythis(sql)
      data.map(async ({ PMPHONE, MPHONE, NAME, PIN, AC_TYPE, WFPIN_NO }) => {
        const sectionid = await getSectionKey(PMPHONE, PIN)
        NAME = JSON.stringify(NAME)
        let page = 10
        if (AC_TYPE === "CD") {
          page = 25
        } else {
          page = 10
        }
        const data_cqe = await chq_request(
          sectionid,
          PMPHONE,
          MPHONE,
          page,
          NAME,
          WFPIN_NO
        )

        JSON.stringify(data_cqe)
        resolve(data_cqe)
      })
    } catch (err) {
      reject(err)
    }
  })
}


module.exports = { genarateRequest }
