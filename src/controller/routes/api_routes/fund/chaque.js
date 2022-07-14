const { Router } = require("express")
const api = Router()

const { genarateRequest, check_req } = require("../../../../api/api_genCheReq")

api.post("/add", async (req, res) => {
  console.log('add');
  genarateRequest(req.body.mphone)
    .then((data) => {
      res.send(data)
    })
    .catch((e) => {
      console.log("Error in Chaque request api => " + e)
      res.json(e).sendStatus(404)
    })
})
api.post("/search", async (req, res) => {

  await check_req(req.body.mphone)
    .then((data) => {
      if (data != 404) {
        res.send(data)
      } else {
        res.sendStatus(404)
      }
    })
    .catch((e) => {
      console.log("Error => " + e)
      res.json(e)
    })
})

api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
