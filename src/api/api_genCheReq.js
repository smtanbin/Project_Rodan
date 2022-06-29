const qurrythis = require('../core/db')
const { getSectionKey, chq_request } = require("../core/loginHelper")

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
        let data = ''
        try {
            data = await qurrythis(sql)
        }
        catch (e) {
            reject(e)
        }
        // console.log(data);
        data.map(async ({ PMPHONE, MPHONE, NAME, PIN, AC_TYPE, WFPIN_NO }) => {
            NAME = NAME.toString()
            const sectionid = await getSectionKey(PMPHONE, PIN)
            let page = 10
            if (AC_TYPE === 'CD') {
                page = 25
            } else { page = 10 }
            // console.log("Section ID" + sectionid);
            const returnCall = await chq_request(sectionid, PMPHONE, MPHONE, page, NAME, WFPIN_NO)
            resolve(returnCall)
        })
    })
}

module.exports = { genarateRequest }