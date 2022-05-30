const { Router } = require("express")
const { doexist, holyday, agentlist } = require("../api/api.js")
const { logger } = require("../api/api_log")
const {
  pbslist,
  utilityinfohead,
  utilityinfodtl,
  utilityinfosummary,
} = require("../api/api_utilitybill.js")
const { transactionsreport } = require("../api/api_transactionsreport")
const { statementHead, statementBody } = require("../api/apiStatement")
const { accountInfo } = require("../api/api_accountInfo")

const bodyParser = require("body-parser")
const cors = require("cors")
const app = Router()

// Cors Config
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middlewares
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.use((req, res, next) => {
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

app.get("/holyday", async (req, res) => {
  const data = await holyday()
  res.send(data)
})
app.get("/agentlist", async (req, res) => {
  const data = await agentlist()
  res.send(data)
})

/************************************** End ******************************************/

// Chart Api
/**************************************** Start ****************************************
 Importing
 */
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
} = require("../api/chartsData")

/* 	Get Requests
 */
app.get("/dailydrcr", async (req, res) => {
  const data = await dailydrcr()
  res.send(data)
})

app.get("/balancePerformance", async (req, res) => {
  const data = await balancePerformance(0)
  res.send(data)
})
app.post("/balancePerformance", async (req, res) => {
  const data = await balancePerformance(req.body.param)
  res.send(data)
})

app.get("/dpsMaturity", async (req, res) => {
  try {
    const data = await dpsMaturity()

    res.send(data)
  } catch (e) {
    return e
  }
})

app.get("/teventoutput", async (req, res) => {
  try {
    const data = await teventoutput()
    res.send(data)
  } catch (e) {
    return e
  }
})
app.get("/peventoutput", async (req, res) => {
  try {
    const data = await peventoutput()
    res.send(data)
  } catch (e) {
    return e
  }
})
app.get("/mseventoutput", async (req, res) => {
  try {
    const data = await mseventoutput()
    res.send(data)
  } catch (e) {
    return e
  }
})
app.get("/pichart", async (req, res) => {
  try {
    const data = await pichart()
    res.send(data)
  } catch (e) {
    return e
  }
})
app.post("/pichart", async (req, res) => {
  try {
    const data = await pichart(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})

app.get("/cashEntry", async (req, res) => {
  try {
    const data = await cashEntry()

    res.send(data)
  } catch (e) {
    return e
  }
})

app.get("/agentstatus", async (req, res) => {
  try {
    const data = await agentstatus()

    res.send(data)
  } catch (e) {
    return e
  }
})
app.post("/agentstatus", async (req, res) => {
  try {
    const data = await agentstatus(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})

app.get("/customerstatus", async (req, res) => {
  try {
    const data = await customerstatus()

    res.send(data)
  } catch (e) {
    return e
  }
})
app.post("/customerstatus", async (req, res) => {
  try {
    const data = await customerstatus(req.body.param)

    res.send(data)
  } catch (e) {
    return e
  }
})

/* 	Post Requests
 */
app.post("/agentBalancePerformance", async (req, res) => {
  const data = await drcragent(req.body.key)
  res.send(data)
  console.log(data)
})

/* KYC */

const { sectorCodeList, getkyc, addEcoSectorCode } = require("../api/api_kyc")
app.get("/sectorcodelist", async (req, res) => {
  try {
    const data = await sectorCodeList()
    res.send(data)
  } catch (e) {
    return e
  }
})
app.post("/getkyc", async (req, res) => {
  try {
    const data = await getkyc(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})
app.post("/addkyc", async (req, res) => {
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

/************************************** End ******************************************/

/* timeline Api*/
/************************************** Start *****************************************
 *
 */
const { timeline, trSearch } = require("../api/api_timeline")

app.get("/timeline", async (req, res) => {
  const data = await timeline()
  res.send(data)
})
app.post("/trsearch", async (req, res) => {
  const key = req.body.key
  try {
    const data = await trSearch(key)
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
    res.status(403)
  }
})
/************************************** End ******************************************/

/* Account Api*/

/************************************** Start ******************************************/

app.post("/accountInfo", async (req, res) => {
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
app.post("/businessinfo", async (req, res) => {
  try {
    const data = await businessinfo(req.body.frommonth, req.body.tomonth)
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send("Stop by error! Check if its help:" + e)
    res.status(400)
  }
})
app.post("/businessinfoheader", async (req, res) => {
  res.status(200)
  try {
    const data = await businessinfoheader(req.body.from, req.body.to)

    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e)
  }
})
app.post("/sbs", async (req, res) => {
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
app.get("/utilityreportpbslist", async (req, res) => {
  const data = await pbslist()
  res.send(data)
})
/* Give the summary data */
app.post("/utilityinfo", async (req, res) => {
  const from = req.body.from
  const to = req.body.to
  const acno = req.body.acno
  res.send(data)
})
/* Give the deteals data */
app.post("/utilityinfohead", async (req, res) => {
  try {
    const data = await utilityinfohead(req.body.date, req.body.key)
    res.send(data)
  } catch (e) {
    res.status(400)
    res.send("Stop by error! Check if its help:" + e + data)
  }
})
app.post("/utilityinfodtl", async (req, res) => {
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
app.post("/utilityinfosummary", async (req, res) => {
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
app.get("/remittanceRequest", async (req, res) => {
  const data = await remittanceRequestList()
  res.send(data)
})
app.get("/remittancehouselist", async (req, res) => {
  const data = await remittancehouselist()
  res.send(data)
})

app.post("/remittance", async (req, res) => {
  const fromdate = req.body.fromdate
  const todate = req.body.todate
  const key = req.body.key
  const data = await remittance(fromdate, todate, key)
  res.send(data)
})

app.post("/getRequest", async (req, res) => {
  const param = req.body.param
  const data = await getSingleeRequest(param)
  res.send(data)
})
app.post("/remittancesummary", async (req, res) => {
  const fromdate = req.body.fromdate
  const todate = req.body.todate
  const data = await remittancesummary(fromdate, todate)
  res.send(data)
})

/* This will check if account existed */
app.post("/doexist", async (req, res) => {
  const key = req.body.key
  const data = await doexist(key)
  res.send(data)
})

/* Account Statment Part
 */

/* Give the summary data */
app.post("/statementhead", async (req, res) => {
  const date = req.body.date
  const key = req.body.key
  const data = await statementHead(date, key)
  res.send(data)
})
/* Give the deteals data */

app.post("/statementbody", async (req, res) => {
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

app.post("/transactionsreport", async (req, res) => {
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

app.post("/customerinfo", async (req, res) => {
  const data = await customerinfo(req.body.id)
  res.send(data)
})
app.post("/customeracinfo", async (req, res) => {
  const data = await customerallac(req.body.id)
  res.send(data)
})
app.post("/customernom", async (req, res) => {
  const data = await customernom(req.body.id)
  res.send(data)
})
app.post("/getimage", async (req, res) => {
  const data = await getimage(req.body.id)
  res.send(data)
})

app.post("/monthlyActivity", async (req, res) => {
  const data = await monthlyActivity(req.body.key)
  res.send(data)
})
app.get("/accountStatus", async (req, res) => {
  try {
    const data = await accountStatus()
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})

const { recon } = require("../api/api_Reconciliation")
app.get("/recon", async (req, res) => {
  try {
    const data = await recon()
    res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})
const { sendsms, smslog } = require("../api/api_sms")

function numDigits(x) {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1
}

app.post("/sentsms", async (req, res) => {
  console.log("Api" + req.body)

  /* Checking empty string*/

  // Checking empty sender
  if (req.body.to === "" || req.body.to === undefined) {
    // res.send("Sender not found")
    res.sendStatus(412)

    // Checking empty body
  } else if (req.body.body === "" || req.body.body === undefined) {
    // res.send("Body not found")
    res.sendStatus(412)

    // Checking empty authorizer
  } else if (req.body.autho === "" || req.body.autho === undefined) {
    res.sendStatus(401)

    /* Main function */
  } else {
    // Checking interger
    const nocheck = /^\d+$/.test(req.body.to)

    console.log(numDigits(req.body.to), req.body.to, req.body.autho)

    /* Checking cell no */
    let prefix = req.body.to.slice(2, 5)

    console.log(req.body.to.slice(2, 5))
    if (prefix >= "013" && prefix <= "019") {
      prefix = true
    }

    // Finale checker

    if (nocheck === true && numDigits(req.body.to) >= 13 && prefix === true) {
      try {
        // main function

        const data = await sendsms(
          req.body.to.slice(2, 15),
          req.body.body,
          req.body.autho
        )
        if (data === true) {
          res.json("201")
        } else {
          res.send("404")
        }
      } catch (e) {
        console.log(e)
        res.send(e)
      }
    } else {
      res.sendStatus(400)
    }
    // } else { res.sendStatus(400)}
  }
})
const { monthly_data } = require("../api/api_mis")

app.post("/monthly_data", async (req, res) => {
  try {
    const data = await monthly_data(req.body.date)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
app.get("/smslog", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  // await logger(user, req.hostname + req.originalUrl, "SMS Api callled")

  try {
    const data = await smslog()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
app.post("/addlog", async (req, res) => {
  try {
    const data = await logger(req.body.user, req.body.location, req.body.info)

    if (data === 1) {
      res.status(201)
      res.send("Success")
    } else {
      res.send("Failed")
      res.status(404)
    }
  } catch (e) {
    res.send(data)
    console.log("Unable to log data. Error => " + e)
    res.status(404)
  }
})

/* APi server Status*/
// const { cpu } = require('../api/app')
// app.get('/cpu', async (req, res) => {
// 	res.send(cpu)
// })

app.get("/", async (req, res) => {
  res.send("Welcome to Restful API Power by Tanbin Hassan Bappi")
})

module.exports = app
