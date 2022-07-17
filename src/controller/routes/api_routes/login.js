const { Router } = require("express")
const { logger } = require("../../../api/api_log")
require("dotenv").config()
/* JSON Web Token
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way
for securely transmitting information between parties as a JSON object. This information can be
verified and trusted because it is digitally signed. JWTs can be signed using a secret
(with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
Link: https://jwt.io
*/
// const jwt = require("jsonwebtoken")
/* JWTAUTHOKEY is the veriable for key
> require('crypto').randomBytes(64).toString('hex')
*/
const jwt_decode = require("jwt-decode")
const bodyParser = require("body-parser")
const cors = require("cors")
const api = Router()

// Cors Config
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middlewares
api.use(cors(corsOptions))
api.use(bodyParser.json())

api.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accepcact"
  )
  res.header("Access-Control-Allow-Methods", ["GET", "POST", "PATCH", "DELETE"])
  next()
})

// Visual Viewport Api
/**************************************** Start ****************************************
 */

/*
 *
 *   Authorization Panal
 *
 */
// All needed function are in api_login
const { gen_login, refresh_token } = require("../../../core/login_master")
const { roleCheck } = require("../../../api/api_login")
/* Working on itt*/
api.post("/auth", async (req, res /* res will send user & password */) => {
  const auth = req.headers["authorization"]
  if (!auth) {
    // No Authorization header was passed in so it's the first time the browser hit us
    // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
    // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
    res.statusCode = 401
    // res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"')
  } else if (auth) {
    // The Authorization was passed in so now we validate it
    const tmp = auth.split(" ") // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
    if (tmp[1] == undefined) {
      console.log("Autho type error")
      res.json({ Error: "Invalid Data Please use HTML Basic Auth" })
    } else {
      const plain_auth = Buffer.from(tmp[1], "base64").toString("utf8") // At this point plain_auth = "username:password"
      const creds = plain_auth.split(":") // split on a ':'
      gen_login(creds[0], creds[1], req.hostname)
        .then((token) => {
          res.cookie(`auth`, token[0], { expire: 200 + Date.now() })
          res.cookie(`token`, token[1], { expire: 999 + Date.now() })
          // res.send(token)
        })
        .catch((e) => {
          res.status(404).json({
            "Error:": "Error from /auth " + e, status: 404
          })
        })
    }
  }
})

api.post("/refresh", async (req, res) => {
  await refresh_token(req.body.token).then((payload) => {
    res.cookie(`auth`, payload, { expire: 999 + Date.now() })
  }).catch((e) => { res.json({ "Error": e }).statusCode(404) })
})

api.post("/make_guest_token", (req, res) => {
  res.send(
    new Promise(async (resolve, reject) => {
      const { user } = req.body
      if (state === "403") {
        reject(state)
      } else {
        const token = make_token(user)
        if (token === 500) {
          reject(500)
        } else {
          await logger(
            "Guest",
            req.hostname + req.originalUrl,
            `Guest login Sucessfull`
          )
          resolve(token)
        }
      }
    })
  )
})

const { status_update } = require("../../../api/api_token")

api.post("/logout", (req, res) => {
  status_update(req.cookies.auth)
    .then(() => {
      document.cookie = "auth" + "=; Max-Age=-99999999;"
      window.location.href = "/"
    })
    .then(() => {
      res.status(200)
    })
    .catch((e) => {
      res.status(405).json(e)
    })
})

api.post("/role", async (req, res) => {
  const load = await roleCheck(req.body.username)
    .then(async (payload) => {
      await logger(
        req.body.username,
        req.hostname + req.originalUrl,
        `Role checked`
      )
      return payload
    })
    .catch((e) => {
      return false
    })

  if (load != false) {
    res.json(load).status(200)
  } else res.status(404).json({ Error: "Not Found", status: "404" })
})
api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
