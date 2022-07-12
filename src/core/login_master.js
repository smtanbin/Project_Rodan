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
const {
  verification,
  find_token,
  status_update,
  insert_token,
} = require("../api/api_login")

const token_verification = (token, user) => {
  return new Promise((resolve, rejects) => {
    /*Verifying If provied token valid*/
    jwt.verify(token, process.env.JWTAUTHOKEY, async (err) => {
      if (err /*Token is not valid*/) {
        rejects("405")
      } else {
        /*JWT autho token present in env file*/
        const { user, refrashtoken } = jwt_decode(token)
        const ref_token = await find_token(refrashtoken, user)
        if (ref_token === refrashtoken) {
          resolve("302")
        } else {
          rejects("404")
        }
      }
    })
  })
}

const gen_token = ({ user, passwd }) => {
  return new Promise(async (resolve, rejects) => {
    const status = verification(user, passwd)

    if (status === "404") {
      rejects("404")
    } else {
      const rtoken = jwt.sign({ user }, process.env.JWTREFRASHKEY)
      // Creating Cluster
      const inputs = { user, refrashtoken: rtoken }
      // Keeping token to Database
      try {
        await insert_token(rtoken, user)
      } catch (e) {
        console.log("Error adding token" + e)
        rejects("500")
      }
      const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
        expiresIn: "13m", // expires in 1 hours
      })
      resolve(token)
    }
  })
}
const make_token = (user) => {
  return new Promise((resolve, rejects) => {
    const rtoken = jwt.sign({ user }, process.env.JWTREFRASHKEY)
    const inputs = { user, refrashtoken: rtoken }
    insert_token(rtoken, user)
      .then(() => {
        const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
          expiresIn: "13000m",
        })
        resolve(token)
      })
      .catch((e) => rejects("Error genataring token" + e))
  }).catch((e) => "Error Make token. Error => " + e)
}

const { logger } = require("../api/api_log")

const gen_login = (user, passwd, hostname) => {
  //Perfect 11/7/2022
  return new Promise(async (resolve, reject) => {
    if (user === undefined || passwd === undefined) {
      console.log("user or password undefined in gen_login")
      reject("user or password undefined in gen_login")
    }

    // verification will take user and password, & return error code or username
    verification(user, passwd)
      .then((reply) => {
        const token = make_token(user)
        if (token === "500" || token == undefined) {
          reject("token replay undefined")
        } else {
          reply.map(async ({ USERNAME }) => {
            //Log the activity
            logger(USERNAME, hostname + "api/login", `Login Sucessfull`)
              .then(() => {
                resolve(token)
              })
              .catch((err) => {
                "Loging Failed in Login Master Token Making Error=>" + err
              })
          })
        }
      })
      .catch((err) => {
        reject("Verification Failed")
      })
  })
}

const func_approve = (token) => {
  return new Promise(async (resolve, reject) => {
    if (token === undefined) {
      reject(["403", "No Token found"])
    } else {
      await jwt.verify(token, process.env.JWTAUTHOKEY, (err) => {
        if (err /*Token is not valid*/) {
          reject(["403", err])
        } else {
          resolve(["202", "Grated"])
        }
      })
    }
  }).catch((e) => {
    return e
  })
}
module.exports = { make_token, token_verification, func_approve, gen_login }
