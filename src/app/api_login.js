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

const qurrythis = require("./db")
// const { logger } = require("../api/api_log")

const verification = async (user, passwd) => {
  try {
    sql = `SELECT USERNAME, ROLE
				FROM (SELECT UPPER (USERID)     USERID,
							 USERNAME,
							 UPASS,
							 UPPER (ROLEID)     ROLE
						FROM AGENT_BANKING.USER_INFO
					  UNION
					  SELECT UPPER (MPHONE)     USERID,
							 NAME               USERNAME,
							 R.PIN_NO           UPASS,
							 'AGENT'
						FROM AGENT_BANKING.REGINFO R
					   WHERE R.CAT_ID = 'D')
			   WHERE USERID = UPPER ('${user}') AND TANBIN.FUNC_GET_PIN (UPASS) = '${passwd}'`

    const data = await qurrythis(sql)
    if (data.length === 0) {
      //   await logger(user, req.hostname + req.originalUrl, "Failed to login")
      return false
    } else {
      //   await logger(user, req.hostname + req.originalUrl, "Logon")
      return data
    }
  } catch (e) {
    console.log(e)
    return e
  }
}
/* Creating JWT token for ------------------------------------------------------
 */
const createToken = async (userid, roll) => {
  // Creating Refrash Token
  const rtoken = jwt.sign({ user: userid }, process.env.JWTREFRASHKEY)
  // Creating Cluster
  const inputs = { user: userid, role: roll, refrashtoken: rtoken }
  // Keeping token to Database
  const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
    expiresIn: "5s", // expires in 1 hours
  })
  return token
}
//-----------------------------------End-------------------------------------------

const createRefrashToken = (userid, roll, refrashtoken) => {
  jwt.verify(token, process.env.JWTREFRASHKEY, async (err) => {
    if (!err) {
      // Creating SQL
      const checking = await qurrythis(
        `SELECT count(TOKEN) FROM TANBIN.JWT WHERE TOKEN = ${refrashtoken}`
      )
      /*Checking If recort found?
       */
      if (checking !== 0) {
        const inputs = { user: userid, role: roll, refrashtoken: refrashtoken }
        const token = jwt.sign(inputs, process.env.JWTREFRASHKEY, {
          expiresIn: "5s", // expires in 1 hours
        })

        await qurrythis(
          /* Keeping token to Database*/
          `INSERT INTO TANBIN.JWT (USERID, TOKEN,ORGDATE) VALUES ('${userid}', '${token}', (SELECT CURRENT_TIMESTAMP FROM dual)); commit`
        )
        return token
      } else {
        return "Invalid"
      }
    } else console.log("Verification " + err)
  })
}

module.exports = { verification, createToken, createRefrashToken }
