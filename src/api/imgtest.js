const qurryBlob = require("./db/db_blop")

const img = async () => {
  const sql = `select data from AGENT_BANKING.IMAGE_DATA where ac_no = 10834000393 and IMAGE_TYPE_ID =1`
  try {
    const data = await qurryBlob(sql)
    return data
  } catch (e) {
    console.log(e)
  }
}
module.exports = { img }
