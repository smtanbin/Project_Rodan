const { Router } = require("express")
const bodyParser = require("body-parser")
const api = Router()
const { log } = require("../../../api/api_log")
// Middlewares

api.use(bodyParser.json())

api.post("/add", async (req, res) => {
  const data = await log(req.body.user, req.body.location, req.body.info).then((data) => {

    if (data === 1) {
      res.status(201).json({ "massage": "Success", "status": "201" })

    } else {
      res.status(404).json({ "massage": "Failed", "status": "404" })

    }
  }).catch((e) => {
    console.log("Unable to log data. Error => " + e)
    res.status(404).json({ "massage": "Failed", "status": "404" })
  })
})

api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
