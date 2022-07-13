const { oradb } = require("../api/db/oradb")
const find_token = ({ token, user }) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT TOKEN FROM TANBIN.JWT_TOKEN where STATUS = 1 and TOKEN = '${token}' and USER = ${user}`
    try {
      resolve(oradb(sql))
    } catch (e) {
      reject(e)
    }
  })
}

const insert_token = (token, user) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT
    INTO
	TANBIN.JWT_TOKEN (
	TOKEN,
	"USER",

	GEN_DATE)
VALUES(
'${token}',
'${user}',
SYSDATE)`

    oradb(sql)
      .then((data) => resolve(data))
      .catch((e) => {
        reject(e)
      })
  })
}
const status_update = (token) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE 
        TANBIN.JWT_TOKEN SET STATUS = 'F', EXP_DATE=sysdate
        WHERE TOKEN = '${token}'`
    oradb(sql)
      .then(async () => {
        sql = `SELECT 
          case when count(STATUS) = 0 then 'logout' 
          when count(STATUS) != 0 then 'login' end
        STATUS FROM TANBIN.JWT_TOKEN WHERE TOKEN = '${token}' and STATUS = 'T'`
        let data = await oradb(sql)
        data = JSON.parse(data)
        console.log(data.STATUS)
        resolve(data.STATUS)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

module.exports = { find_token, status_update, insert_token }
