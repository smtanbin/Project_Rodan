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

const {
  cashEntry,
  dpsMaturity,
  accountStatus,
  pichart,
  agentstatus,
  customerstatus,
  peventoutput,
  monthlyActivity,
  dailydrcr,
  drcragent,
  balancePerformance,
  teventoutput,
  mseventoutput,
} = require("../../../api/chartsData")

/* 	Get Requests
 */
api.get("/dailydrcr", async (req, res) => {
  const data = await dailydrcr()
  res.send(data)
})

api.get("/balancePerformance", async (req, res) => {
  const data = await balancePerformance(0)
  res.send(data)
})
api.post("/balancePerformance", async (req, res) => {
  const data = await balancePerformance(req.body.param)
  res.send(data)
})

api.get("/dpsMaturity", async (req, res) => {
  try {
    const data = await dpsMaturity()
    res.send(data)
  } catch (e) {
    return e
  }
})

api.get("/teventoutput", async (req, res) => {
  try {
    const data = await teventoutput()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.get("/peventoutput", async (req, res) => {
  try {
    const data = await peventoutput()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.get("/mseventoutput", async (req, res) => {
  try {
    const data = await mseventoutput()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.get("/pichart", async (req, res) => {
  try {
    const data = await pichart()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/pichart", async (req, res) => {
  try {
    const data = await pichart(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})

api.get("/cashEntry", async (req, res) => {
  try {
    const data = await cashEntry()

    res.send(data)
  } catch (e) {
    return e
  }
})

api.get("/agentstatus", async (req, res) => {
  try {
    const data = await agentstatus()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/agentstatus", async (req, res) => {
  try {
    const data = await agentstatus(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})

api.get("/customerstatus", async (req, res) => {
  try {
    const data = await customerstatus()

    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/customerstatus", async (req, res) => {
  try {
    const data = await customerstatus(req.body.param)

    res.send(data)
  } catch (e) {
    return e
  }
})

/* 	Post Requests
 */
api.post("/agentBalancePerformance", async (req, res) => {
  const data = await drcragent(req.body.key)
  res.send(data)
  console.log(data)
})

api.post("/monthlyActivity", async (req, res) => {
  const data = await monthlyActivity(req.body.key)
  res.send(data)
})
api.get("/accountStatus", async (req, res) => {
  try {
    const data = await accountStatus()
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})
api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
