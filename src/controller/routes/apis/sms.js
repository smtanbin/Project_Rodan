const { Router } = require("express")

const bodyParser = require("body-parser")
const cors = require("cors")
const api = Router()
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
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

const { sendsms, smslog, syssmslog, findsms } = require("../../../api/api_sms")
const { default: jwtDecode } = require("jwt-decode")

function numDigits(x) {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1
}

api.post("/request", async (req, res) => {
  const username = jwtDecode(req.headers.token)
  // Checking empty sender
  if (req.body.to === "" || req.body.to === undefined) {
    res.status(404).json({ "Error": "Invalid sender" })
    return
  }
  if (req.body.body === "" || req.body.body === undefined) {
    res.status(404).json({ "Error": "Invalid content " })
    return
  }
  // Checking interger
  const nocheck = /^\d+$/.test(req.body.to)
  /* Checking cell no */
  let prefix = req.body.to.slice(2, 5)

  if (prefix >= "013" && prefix <= "019") {
    prefix = true
  }
  // Finale checker
  if (nocheck === true && numDigits(req.body.to) >= 13 && prefix === true) {
    /*
    Main Function
   */
    try {
      res.send(await sendsms(req.body.to.slice(2, 15), req.body.body, username.user))
    } catch (err) {
      console.log("Error while sending. Error:[Internal error catch from fx sendsms]" + err)
    }
  } else { res.status(404).json({ "Error": "Invalid Contact No. " }) }
})

api.get("/smslog", async (req, res) => {
  try {
    const data = await smslog()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.post("/findsms", async (req, res) => {
  try {
    const data = await findsms(req.body.param)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/syssmslog", async (req, res) => {
  try {
    const data = await syssmslog()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
