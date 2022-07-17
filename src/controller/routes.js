const { Router } = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const router = Router()
const { role, logger, refresh_call } = require("./controller")
const request = require("request")
// Cors Config
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
router.use(cors(corsOptions))
router.use(bodyParser.json())
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accepcact"
  )
  res.header("Access-Control-Allow-Methods", ["GET", "POST", "PATCH", "DELETE"])
  next()
})
const jwt = require("jsonwebtoken")
const jwt_decode = require("jwt-decode")
const { roleCheck } = require("../core/roles")

/* -----------------------------------------------------------------------
*
*						Middelware & Verification
*
--------------------------------------------------------------------------*/
router.get("/*", async (req, res, next) => {
  //Importing token from cookies
  const token = req.cookies.auth
  const rtoken = req.cookies.token


  if (!token || !rtoken) {
    await logger(
      "Anonymous",
      req.hostname + req.originalUrl,
      `Login Page Visited`
    )
    /*Init Login Page*/
    res.locals = {
      title: "Login",
    }
    res.render("login") //Page Rend ,0p.[/-erd
  } else {

    try {
      jwt.verify(token, process.env.JWTAUTHOKEY, { complete: true }, async (error, decoded) => {

        if (error) {
          console.log("exp" + error);
          await refresh_call(rtoken)
            .then((new_token) => {
              console.log(new_token);
            })
            .catch((err) => {
              console.log("Error during making  token" + err);
            })
          next()
        } else {
          console.log("Not exp ");
          next()
        }
      })

    } catch (e) {
      console.log("Middelware Error" + e);
      res.locals = {
        title: "Login",
      }
      res.render("login")
    }
  }
})

// Visual Viewport Api
/*********************************************************************************/
router.get("/", async (req, res) => {
  const darkModeCon = req.cookies.darkmode
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  await role(username).then((data) => {

    if (data === "Not Found" || data.error) {
      res.render("./pages/404").statusCode(404)
    } else {
      data.map(({ USERNAME, ROLE, ROOT }) => {
        const temp_userid = USERNAME
        const temp_role = ROLE
        const temp_owner = ROOT
        if (request.statusCode == 404) {
          console.log("Error: " + data.Error)
        } else {
          res.locals = {
            title: "Home",
          }
          const darkModeCon = req.cookies.darkmode
          if (temp_role === "ADMIN" || temp_role === "APPROVAL") {
            res.render("./admin/index", {
              role: temp_role,
              userid: temp_userid,
              owner: temp_owner,
              darkmode: darkModeCon,
            })
          } else {
            res.render("./common/index", {
              role: temp_role,
              userid: temp_userid,
              owner: temp_owner,
              darkmode: darkModeCon,
            })
          }
        }
      })
    }
  }).catch((e) => {
    console.log("Home page error: " + e);
  }).finally(() => {
    logger(username, req.hostname + req.originalUrl, "Visited").catch((e) => {
      console.log("Loging error " + e);
    })
  })
})


/************************    application  *******************************/
const pages = require("./routes/page/index")
router.use("/page", pages)

router.get("/kycupdate", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: USERNAME,
      title: "Customer Info",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/kycupdate", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})


router.get("/sms", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: USERNAME,
      title: "Customer Info",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/sms", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/remittanceProcessing", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: USERNAME,
      title: "Remittance",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/remittanceProcessing", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/requestRemittance", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: USERNAME,
      title: "Remittance Request",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/requestRemittance", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/reconciliation", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Reconciliation",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/reconciliation", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})

/* Admin Panal*/

router.get("/admin/routing", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Account Statment",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/routing", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
// Report Panal
/********************************************************************************
 */
router.get("/report/accountStatment", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Account Statment",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/statement", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/report/remittanceReport", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Remittance Report",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/remittanceReport", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/report/utilityreport", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Utility Report",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/utilityreport", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})

router.get("/report/transactionsReport", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Transactions Report",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/transactionsReport", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/report/accountInfo", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Account Information",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/accountInfo", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/report/businessinfo", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Business Information",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/businessinfo", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/report/mis", async (req, res) => {
  const token = req.cookies.auth
  const { username } = jwt_decode(token)
  const data = await roleCheck(username)
  await logger(username, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "MIS",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/mis", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})


/*Every Application page path location in */
const fund_mng = require("./routes/page/app/fund_manage")
router.use("/app/fund", fund_mng)



module.exports = router
