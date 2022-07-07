const { Router } = require("express")
const api = Router()

const { genarateRequest } = require("../../../api/api_genCheReq")
api.post("/add", async (req, res) => {
  const data = await genarateRequest(req.body.mphone)
    .then((data) => {
      res.send(data)
    })
    .catch((e) => {
      console.log("Error => " + e)
      res.status(404).json(e)
    })
})

api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
