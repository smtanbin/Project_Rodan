const { Router } = require("express")
require("dotenv").config()
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
  sectorCodeList,
  getkyc,
  addEcoSectorCode,
} = require("../../../api/api_kyc")
api.get("/sectorcodelist", async (req, res) => {
  try {
    const data = await sectorCodeList()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/get", async (req, res) => {
  try {
    const data = await getkyc(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/add", async (req, res) => {
  try {
    const resp = await addEcoSectorCode(req.body.acno, req.body.code)

    if (resp === 302) {
      res.sendStatus(302)
    } else {
      res.sendStatus(201)
    }
  } catch (e) {
    return e
  }
})
api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
