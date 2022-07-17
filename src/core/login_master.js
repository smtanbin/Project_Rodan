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
const { verification, find_token } = require("../api/api_login")
const { status_update, insert_token } = require("../api/api_token")

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

// const gen_token = ({ user, passwd }) => {

//   return new Promise(async (resolve, rejects) => {
//     const status = verification(user, passwd)

//     if (status === "404") {
//       rejects("404")
//     } else {
//       const rtoken = jwt.sign({ user }, process.env.JWTREFRASHKEY)
//       // Creating Cluster
//       const inputs = { user, refrashtoken: rtoken }
//       // Keeping token to Database
//       try {
//         await insert_token(rtoken, user)
//       } catch (e) {
//         console.log("Error adding token" + e)
//         rejects("500")
//       }
//       const jose = require("node-jose");
//       const keyStore = jose.JWK.createKeyStore();
//       const test = keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" })
//       console.log(test);
//       const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
//         expiresIn: "1m", // expires in 1 hours
//       })
//       resolve(token)
//     }
//   })
// }


const created_token = (user, expires) => {

  return new Promise((resolve) => {
    if (expires === true) {
      const token = jwt.sign({ "username": user }, process.env.JWTAUTHOKEY, { expiresIn: '30s' });
      resolve(token)
    }
    if (expires === false) {
      const token = jwt.sign({ "username": user }, process.env.JWTAUTHOKEY);
      resolve(token)
    }
  }).catch((e) => "Error Make token:" + e)
}



const { log } = require("../api/api_log")

const gen_login = (user, passwd, hostname) => {
  return new Promise(async (resolve, reject) => {
    if (user === undefined || passwd === undefined) {
      console.log("user or password undefined in gen_login")
      reject("user or password undefined in gen_login")
    }

    // verification will take user and password, & return error code or username

    verification(user, passwd)
      .then(async (reply) => {
        const arr = new Array()
        await created_token(user, true)
          .then((token) => {
            arr[0] = token
          })
          .catch((err) => { console.log("token " + err); reject(e) })

          .then(async () => {
            await created_token(user, false)
              .then((token) => {
                arr[1] = token
              })
              .catch((err) => { console.log("rtoken " + err); reject(e) })
          }).then(() => {
            reply.map(async ({ USERNAME }) => {
              log(USERNAME, hostname + "api/login", `Login Sucessfull`)
            })
          })
          .finally(() => {
            resolve(arr)
          })
          .catch((e) => { reject(e) })

      })
      .catch((err) => {
        reject("Verification Failed " + err)
      })
  })
}

const refresh_token = (token) => {
  return new Promise(async (resolve, reject) => {
    if (token === undefined) {
      reject(403)
    } else {
      try {
        await jwt.verify(token, process.env.JWTAUTHOKEY, async (err) => {
          if (!err) {
            const { username } = jwt_decode(token, process.env.JWTAUTHOKEY)
            await created_token(username, true).then((payload) => {
              resolve(payload)
            }).finally(async () => {
              await log(username, hostname + "api/login", `Token refrash Sucessfull`)
            })
          } else { reject(err) }
        })
      } catch (e) {
        reject(e)
      }
    }
  })
}
module.exports = { created_token, token_verification, refresh_token, gen_login }
