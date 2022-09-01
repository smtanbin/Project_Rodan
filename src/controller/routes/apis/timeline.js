const { Router } = require("express")
require("dotenv").config()
const api = Router()

const { timeline, trSearch } = require("../../../api/api_timeline")

api.get("/list", async (req, res) => {
  const data = await new Promise(async (resolve, reject) => {
    await timeline()
      .then((payload) => {
        resolve(payload)
      })
      .catch((error) => {
        reject(error)
      })
  })
  res.send(data)
})
api.get("/list/:param", async (req, res) => {
  let requestdata = req.params.param.split("&")
  console.log(requestdata)
  const data = await new Promise(async (resolve, reject) => {
    await timeline(requestdata[1], requestdata[0])
      .then((payload) => {
        resolve(payload)
      })
      .catch((error) => {
        reject(error)
      })
  })
  res.send(data)
})

api.get("/search/:trno", async (req, res) => {
  const trno = req.params.trno
  try {
    const data = await trSearch(trno)
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
    res.status(403)
  }
})
api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
