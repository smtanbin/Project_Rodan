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




// Visual Viewport Api
/**************************************** Start ****************************************
 */


/*
*
*   Authorization Panal
*
*/
// All needed function are in api_login
// const { verification } = require("../api/api_login")
const { make_token, gen_login } = require("../core/login_master")

// Api function Start

api.post("/login/make_token", async (req, res /* res will send user & password */) => {

  const { user, passwd } = req.body
  const reply = await gen_login(user, passwd)
  console.log(reply);
  if (reply === '403' || reply === '500') {
    res.status(reply)
  } else {
    res.status(reply)
  }

})

api.post("/login/refrash_token", (req, res) => {
  res.send(new Promise(async (resolve, reject) => {
    const { token, user } = req.body
    let state = await token_verification(token, user)
    if (state === '403') {
      reject(state)
    } else {
      const token = make_token(user)
      if (token === 500) {
        reject(500)
      } else {
        state.map(async ({ USERNAME }) => {
          await logger(USERNAME, req.hostname + req.originalUrl, `Login Sucessfull`)
        })
        resolve(token)
      }
    }
  })
  )
})

api.post("/login/make_guest_token", (req, res) => {
  res.send(new Promise(async (resolve, reject) => {
    const { user } = req.body
    if (state === '403') {
      reject(state)
    } else {
      const token = make_token(user)
      if (token === 500) {
        reject(500)
      } else {
        await logger("Guest", req.hostname + req.originalUrl, `Guest login Sucessfull`)
        resolve(token)
      }
    }
  })
  )
})



/***********************Start****************************
* Middelware
* *************************************************/


// api.get("/*", (req, res, next) => {
//   const token = req.headers['token'];
//   console.log(token);
//   if (token === undefined) {

//     res.status(403).json({ message: "No Token found", status: 403 })
//   } else {
//     jwt.verify(token, process.env.JWTAUTHOKEY, async (err) => {
//       if (err /*Token is not valid*/) {
//         res.status(403).json({ error: err, status: 403 })
//       } else {
//         next()
//       }
//     })
//   }
// })


/***************************************************
* Middelware
* **********************END***************************/

api.get("/holyday", async (req, res) => {
  const data = await holyday()
  res.send(data)
})
api.get("/agentlist", async (req, res) => {
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

/* KYC */

const { sectorCodeList, getkyc, addEcoSectorCode } = require("../api/api_kyc")
api.get("/sectorcodelist", async (req, res) => {
  try {
    const data = await sectorCodeList()
    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/getkyc", async (req, res) => {
  try {
    const data = await getkyc(req.body.param)
    res.send(data)
  } catch (e) {
    return e
  }
})
api.post("/addkyc", async (req, res) => {
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

api.get("/timeline", async (req, res) => {
  const data = await timeline()
  res.send(data)
})
api.post("/trsearch", async (req, res) => {
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

const { recon } = require("../api/api_Reconciliation")
api.get("/recon", async (req, res) => {
  try {
    const data = await recon()
    res.send(data)
  } catch (e) {
    console.log(e)
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
const { sendsms, smslog, syssmslog, findsms } = require("../api/api_sms")

function numDigits(x) {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1
}

api.post("/sms/sentsms", async (req, res) => {
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

api.get("/sms/smslog", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(user, req.hostname + req.originalUrl, "smslog Api callled")

  try {
    const data = await smslog()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.post("/sms/findsms", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(user, req.hostname + req.originalUrl, "syssmslog Api callled")

  try {
    const data = await findsms(req.body.param)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/sms/syssmslog", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(user, req.hostname + req.originalUrl, "syssmslog Api callled")

  try {
    const data = await syssmslog()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.post("/addlog", async (req, res) => {
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

/* Admin Routing Api*/
const {
  routelist,
  updateroutelist,
  routelistSearch,
  getlimited,
} = require("../api/api_routing")
api.get("/routing/get", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(user, req.hostname + req.originalUrl, "routing/get Api callled")

  try {
    const data = await routelist()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.post("/routing/getlimited", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(user, req.hostname + req.originalUrl, "routing/get Api callled")

  try {
    const data = await getlimited(req.body.indexfrom, req.body.indexto)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/routing/refresh", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(
    user,
    req.hostname + req.originalUrl,
    "/routing/refresh Api callled"
  )

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
  // const token = req.cookies.auth
  // const { user } = jwt_decode(token)
  // await logger(
  //   user,
  //   req.hostname + req.originalUrl,
  //   "/mis/generatedata Api callled"
  // )
  try {
    await generatedata(req.body.param).then((payload) => {
      console.log("api: " + payload)
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
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(
    user,
    req.hostname + req.originalUrl,
    "/mis/generatedata Api callled"
  )
  try {
    const data = await pendingEftList()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})
api.get("/fundmanagement/pendingEftSumm", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  await logger(
    user,
    req.hostname + req.originalUrl,
    "/mis/generatedata Api callled"
  )
  try {
    const data = await pendingEftSumm()
    res.send(data)
  } catch (e) {
    res.status(404)
  }
})

// chaque

const { genarateRequest } = require("../api/api_genCheReq")
api.post("/chaque/add", async (req, res) => {
  try {
    await logger(
      "system",
      req.hostname + req.originalUrl,
      "/chaque/add Api callled"
    )
    const data = await genarateRequest(req.body.mphone)
    res.send(data)
  } catch (e) {
    console.log("Unable to log data. Error => " + e)
    res.status(404).json(e)
  }
})

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

module.exports = api
