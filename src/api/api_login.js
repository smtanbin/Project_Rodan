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

const roleCheck = async (user) => {
  sql = `

  SELECT USERNAME, ROLE,ROOT
    FROM (
        (SELECT UPPER (USERID)     USERID,
        USERNAME,
        UPASS,
        UPPER (ROLEID)     ROLE,
        'null' ROOT
        FROM AGENT_BANKING.USER_INFO)
      
        UNION
      
        (SELECT UPPER (MPHONE)     USERID,
             NAME               USERNAME,
             R.PIN_NO           UPASS,	
             'AGENT' ROLE,
             MPHONE ROOT
             FROM AGENT_BANKING.REGINFO R)
             
             UNION
             
             (SELECT UPPER (EMPID)     USERID,
             NAME               USERNAME,
             E.PIN_NO         UPASS,	
             'USER' ROLE,
             CREATE_BY ROOT
             FROM AGENT_BANKING.EMPINFO E
             WHERE STATUS = 'A')
             )
             WHERE USERID = UPPER ('${user}')
             ORDER BY ROLE DESC`
  try {
    return await oradb(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}

module.exports = {
  verification,
  find_token,
  roleCheck,
}
