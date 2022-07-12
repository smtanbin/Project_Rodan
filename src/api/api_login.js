/*Environment Data*/
require("dotenv").config()
/* JSON Web Token
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way
for securely transmitting information between parties as a JSON object. This information can be
verified and trusted because it is digitally signed. JWTs can be signed using a secret
(with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
Link: https://jwt.io
*/
const jwt = require("jsonwebtoken")
/* JWTAUTHOKEY is the veriable for key
> require('crypto').randomBytes(64).toString('hex')
*/
const jwt_decode = require("jwt-decode")

const { oradb } = require("../api/db/oradb")

const verification = async (user, passwd) => {
  return new Promise(async (resolve, reject) => {
    sql = `SELECT USERNAME, ROLE FROM (SELECT UPPER (USERID) USERID,
                 USERNAME, UPASS, UPPER (ROLEID)     ROLE
              FROM AGENT_BANKING.USER_INFO
              UNION
              SELECT UPPER (MPHONE)     USERID,
              NAME               USERNAME,
              R.PIN_NO           UPASS,
              'AGENT'
              FROM AGENT_BANKING.REGINFO R
              WHERE R.CAT_ID = 'D')
              WHERE USERID = UPPER ('${user}') AND TANBIN.FUNC_GET_PIN (UPASS) = '${passwd}'`
    oradb(sql).then((data) => {
      if (data.length === 0) {
        reject("No matching User or Password found.")
      } else {
        resolve(data)
      }
    })
  })
}

/* Creating JWT token for ---------------------------------------------------*/
const find_token = ({ token, user }) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT TOKEN FROM TANBIN.JWT_TOKEN where STATUS = 1 and TOKEN = '${token}' and USER = ${user}`
    try {
      resolve(qurrythis(sql))
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
	STATUS,
	GEN_DATE)
VALUES(
'${token}',
'${user}',
1 ,
SYSDATE)`

    oradb(sql)
      .then((data) => resolve(data))
      .catch((e) => {
        reject(e)
      })
  })
}

const status_update = ({ token }) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE 
        TANBIN.JWT_TOKEN SET STATUS=0, EXP_DATE=sysdate
        WHERE USER = ${token}`
    try {
      resolve(qurrythis(sql))
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = { verification, find_token, status_update, insert_token }
