const qurrythis = require("./db/db")

const sectorCodeList = async () => {
  try {
    let sql = `/* Formatted on 4/10/2022 1:14:06 PM (QP5 v5.381) */
        SELECT CODE, '[' || CODE || '] ' || DESCRIPTION DESCRIPTION
          FROM TANBIN.SECTOR_CODE SC
         WHERE SC.STATUS = 'A'
      ORDER BY CODE DESC`
    // console.log(sql)
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in function accountInfo " + e)
    return e
  }
}
const getkyc = async (key) => {
  try {
    let sql = `SELECT NAME,
        CUST_ID,
        (SELECT P.ACC_TYPE_NAME
           FROM AGENT_BANKING.PRODUCT_SETUP P
          WHERE P.ACC_TYPE_CODE = R.AC_TYPE_CODE)    AC_TYPE_CODE,
        R.PURPS_AC_OPN,
        R.SOURCE_OFFUND,
        NVL((SELECT SBSCODE FROM TANBIN.ADD_REGINFO WHERE MPHONE = R.MPHONE),'Code Not Set') CODE
   FROM AGENT_BANKING.REGINFO R
  WHERE MPHONE = ${key}`
    // console.log(sql)
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in function accountInfo " + e)
    return e
  }
}
const addEcoSectorCode = async (acno, code) => {
  let state
  try {
    let sql = `select count(mphone) count from TANBIN.ADD_REGINFO where mphone = ${acno}`
    const temp = await qurrythis(sql)
    temp.map(async ({ COUNT }) => {
      if (COUNT > 0) {
        state = 302

        // return 302
      } else {
        sql = `BEGIN
			INSERT INTO TANBIN.ADD_REGINFO AR (AR.MPHONE, AR.SBSCODE, AR.UPDATE_DATE)
			VALUES ('${acno}', '${code}', (SELECT SYSDATE FROM DUAL));
			COMMIT;
			END;`
        await qurrythis(sql)
        state = 201
      }
    })
  } catch (e) {
    console.log("Error in function accountInfo " + e)
    return e
  }
  return state
}
const dpdateEcoSectorCode = async (acno, code) => {
  try {
    let sql = `SELECT NAME,
        CUST_ID,
        (SELECT P.ACC_TYPE_NAME
           FROM AGENT_BANKING.PRODUCT_SETUP P
          WHERE P.ACC_TYPE_CODE = R.AC_TYPE_CODE)    AC_TYPE_CODE,
        R.PURPS_AC_OPN,
        R.SOURCE_OFFUND,
        NVL((SELECT SBSCODE FROM TANBIN.ADD_REGINFO WHERE MPHONE = R.MPHONE),'Code Not Set') CODE
   FROM AGENT_BANKING.REGINFO R
  WHERE MPHONE = ${key}`
    // console.log(sql)
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in function accountInfo " + e)
    return e
  }
}
module.exports = { sectorCodeList, getkyc, addEcoSectorCode }
