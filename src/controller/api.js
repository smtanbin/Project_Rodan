const { Router } = require("express")
const { doexist } = require("../api/api.js")
const { logger, log } = require("../api/api_log")
const {
  pbslist,
  utilityinfohead,
  utilityinfodtl,
  utilityinfosummary,
} = require("../api/api_utilitybill.js")
const { transactionsreport } = require("../api/api_transactionsreport")
const { statementHead, statementBody } = require("../api/apiStatement")
const { accountInfo } = require("../api/api_accountInfo")
/*Environment Data*/
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
const cookieParser = require("cookie-parser")
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
api.use(cookieParser())
api.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accepcact"
  )
  res.header("Access-Control-Allow-Methods", ["GET", "POST", "PATCH", "DELETE"])
  next()
})

/****************** Login ****************/
const login = require("./routes/api_routes/login")
api.use("/login", login)

/*
 *************** Middelware **************/

const { func_approve } = require("../core/login_master")

api.get("/*", async (req, res, next) => {
  let token = req.cookies.auth
  let user = jwt_decode(token)
  user = Object.values(user)

  const status = await func_approve(token)
  if (status[0] === "202") {
    // logger(user[0], req.path, "accessed").then(() => {
    //   next()
    // })
    next()
  } else {
    res.status(403).json({ message: status[1] })
  }
})

const agent = require("./routes/api_routes/agent")
api.use("/agent", agent)
const charts = require("./routes/api_routes/charts")
api.use("/charts", charts)
const kyc = require("./routes/api_routes/kyc")
api.use("/kyc", kyc)
const timeline = require("./routes/api_routes/timeline")
api.use("/timeline", timeline)
const sms = require("./routes/api_routes/sms")
api.use("/sms", sms)
const chaque = require("./routes/api_routes/fund/chaque")
api.use("/chaque", chaque)
const loging = require("./routes/api_routes/loger")
api.use("/log", loging)





/*********************************************************************
 * 
 *  Old Staff
 * 
 * /









api.post("/accountInfo", async (req, res) => {
  res.status(200)
  try {
    const data = await accountInfo(req.body.key)
    // console.log(data)
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})
/************************************** End ******************************************/

/* businessInfo  Api*/

/************************************** Start ******************************************/

const {
  businessinfo,
  sbs2,
  businessinfoheader,
} = require("../api/api_businessinfo")
api.post("/businessinfo", async (req, res) => {
  try {
    const data = await businessinfo(req.body.frommonth, req.body.tomonth)
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send("Stop by error! Check if its help:" + e)
    res.status(400)
  }
})
api.post("/businessinfoheader", async (req, res) => {
  res.status(200)
  try {
    const data = await businessinfoheader(req.body.from, req.body.to)

    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})
api.post("/sbs", async (req, res) => {
  res.status(200)
  try {
    const data = await sbs2(req.body.fromdate, req.body.todate, req.body.key)
    // console.log(data)
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})

/* Utility info All utility realated apis data 
functions are currently imported from api_utilitybill.js */

/* This will bring the list for dropdown*/
api.get("/utilityreportpbslist", async (req, res) => {
  const data = await pbslist()
  res.send(data)
})
/* Give the summary data */
api.post("/utilityinfo", async (req, res) => {
  const from = req.body.from
  const to = req.body.to
  const acno = req.body.acno
  res.send(data)
})
/* Give the deteals data */
api.post("/utilityinfohead", async (req, res) => {
  try {
    const data = await utilityinfohead(req.body.date, req.body.key)
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e + data)
  }
})
api.post("/utilityinfodtl", async (req, res) => {
  res.status(200)
  try {
    const data = await utilityinfodtl(
      req.body.fromdate,
      req.body.todate,
      req.body.key
    )
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})
api.post("/utilityinfosummary", async (req, res) => {
  res.status(200)
  try {
    const data = await utilityinfosummary(req.body.fromdate, req.body.todate)
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})

/*Remittance*/
const {
  remittancehouselist,
  remittance,
  remittancesummary,
  remittanceRequestList,
  getSingleeRequest,
} = require("../api/api_remittance")
api.get("/remittanceRequest", async (req, res) => {
  const data = await remittanceRequestList()
  res.send(data)
})
api.get("/remittancehouselist", async (req, res) => {
  const data = await remittancehouselist()
  res.send(data)
})

api.post("/remittance", async (req, res) => {
  const fromdate = req.body.fromdate
  const todate = req.body.todate
  const key = req.body.key
  const data = await remittance(fromdate, todate, key)
  res.send(data)
})

api.post("/getRequest", async (req, res) => {
  const param = req.body.param
  const data = await getSingleeRequest(param)
  res.send(data)
})
api.post("/remittancesummary", async (req, res) => {
  const fromdate = req.body.fromdate
  const todate = req.body.todate
  const data = await remittancesummary(fromdate, todate)
  res.send(data)
})

/* This will check if account existed */
api.post("/doexist", async (req, res) => {
  const key = req.body.key
  const data = await doexist(key)
  res.send(data)
})

/* Account Statment Part
 */

/* Give the summary data */
api.post("/statementhead", async (req, res) => {
  const date = req.body.date
  const key = req.body.key
  const data = await statementHead(date, key)
  res.send(data)
})
/* Give the deteals data */

api.post("/statementbody", async (req, res) => {
  res.status(200)
  try {
    const data = await statementBody(
      req.body.fromdate,
      req.body.todate,
      req.body.key
    )
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})

/* transactionsreport*/

api.post("/transactionsreport", async (req, res) => {
  res.status(200)
  try {
    const data = await transactionsreport(req.body.key)
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})
/* ***************************************************************

            Customer Information 

******************************************************************/

const {
  customerinfo,
  customerallac,
  customernom,
  getimage,
} = require("../api/api_customerinfo")

api.post("/customerinfo", async (req, res) => {
  const data = await customerinfo(req.body.id)
  res.send(data)
})
api.post("/customeracinfo", async (req, res) => {
  const data = await customerallac(req.body.id)
  res.send(data)
})
api.post("/customernom", async (req, res) => {
  const data = await customernom(req.body.id)
  res.send(data)
})
api.post("/getimage", async (req, res) => {
  const data = await getimage(req.body.id)
  res.send(data)
})

const { recon } = require("../api/api_Reconciliation")
api.get("/recon", async (req, res) => {
  try {
    const data = await recon()
    res.send(data)
  } catch (e) {
    res.send(e)
  }
})

const { monthly_data } = require("../api/api_mis")

api.post("/monthly_data", async (req, res) => {
  try {
    const data = await monthly_data(req.body.date)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})



/* Admin Routing Api*/
const {
  routelist,
  updateroutelist,
  routelistSearch,
  getlimited,
} = require("../api/api_routing")
api.get("/routing/get", async (req, res) => {
  try {
    const data = await routelist()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.post("/routing/getlimited", async (req, res) => {
  try {
    const data = await getlimited(req.body.indexfrom, req.body.indexto)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/routing/refresh", async (req, res) => {
  try {
    const data = await updateroutelist()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.post("/routing/search", async (req, res) => {
  try {
    await logger(
      user,
      req.hostname + req.originalUrl,
      "/routing/search Api callled"
    )
    const data = await routelistSearch(req.body.param)
    res.send(data)
  } catch (e) {
    res.send(data)
    console.log("Unable to log data. Error => " + e)
    res.status(404)
  }
})

/* APi server Status*/
// const { cpu } = require('../api/api')
// api.get('/cpu', async (req, res) => {
// 	res.send(cpu)
// })

/*  MIS Api */

const { getmis, generatedata } = require("../api/api_mis")
api.post("/mis/getmis", async (req, res) => {
  // const token = req.cookies.auth
  // const { user } = jwt_decode(token)
  // await logger(user, req.hostname + req.originalUrl, "/mis/getmis Api callled")
  try {
    res.send(await getmis(req.body.param_month, req.body.param_year))
  } catch (e) {
    res.status(404)
  }
})

api.post("/mis/generatedata", async (req, res) => {
  try {
    await generatedata(req.body.param).then((payload) => {
      if (!payload) {
        res.sendStatus(301)
        res.status(301)
      } else {
        res.res.sendStatus(201)
        res.status(201)
      }
    })
  } catch (e) {
    res.status(404)
  }
})
const { pendingEftSumm, pendingEftList } = require("../api/api_fundManagement")
api.get("/fundmanagement/pendingEftList", async (req, res) => {
  try {
    const data = await pendingEftList()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/fundmanagement/pendingEftSumm", async (req, res) => {
  try {
    const data = await pendingEftSumm()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})

// chaque

// const { genarateRequest } = require("../api/api_genCheReq")
// api.post("/chaque/add", async (req, res) => {
//   try {
//     const data = await genarateRequest(req.body.mphone)
//     res.send(data)
//   } catch (e) {
//     console.log("Unable to log data. Error => " + e)
//     res.status(404).json(e)
//   }
// })

/************** Test **********************/
const { img } = require("../api/imgtest")
api.get("/img", async (req, res) => {
  try {
    const data = await img()
    const b64 = Buffer.from(data).toString("base64")
    const mimeType = "image/jpg"
    res.send(`<img src="data:${mimeType};base64,${b64}" />`)
  } catch (e) {
    res.status(404)
  }
})

api.get("/", async (req, res) => {
  res.json("Welcome to Restful API Power by Tanbin Hassan Bappi")
})
api.get("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
api.post("/*", async (req, res) => {
  res.status(404).json({ Error: "Invalid Address" })
})
module.exports = api
