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

function numDigits(x) {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1
}

api.post("/sentsms", async (req, res) => {
  const return_data = new Promise(async (resolved, reject) => {
    // Checking empty sender
    if (req.body.to === "" || req.body.to === undefined)
      reject("Sender not found")
    if (req.body.body === "" || req.body.body === undefined)
      reject("Body not found")
    // Checking interger
    const nocheck = /^\d+$/.test(req.body.to)
    /* Checking cell no */
    let prefix = req.body.to.slice(2, 5)

    if (prefix >= "013" && prefix <= "019") {
      prefix = true
    }
    // Finale checker

    if (nocheck === true && numDigits(req.body.to) >= 13 && prefix === true) {
      // main function
      await sendsms(req.body.to.slice(2, 15), req.body.body, req.body.autho)
        .then((payload) => {
          if (payload === true) {
            resolved("201")
          } else {
            resolved("404")
          }
        })
        .catch((e) => {
          console.log(e)
          reject(e)
        })
    }
  }).catch((e) => {
    res.sendStatus(e)
  })

  res.sendStatus(return_data)
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
