const { Router } = require("express")
const router = Router()
const bodyParser = require("body-parser")
const cors = require("cors")
const { logger } = require("../api/api_log")
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
  // res.header("Access-Control-Allow-Methods", ["GET", "POST", "PATCH", "DELETE"])
  next()
})

const jwt_decode = require("jwt-decode")
const { roleCheck } = require("../core/roles")

// router.get("/*", (req, res, next) => {
//   console.log(req.url);
//   next()
// })

// Visual Viewport Api
/*********************************************************************************/
router.get("/", async (req, res) => {
  let jwt_token = req.cookies.auth
  jwt_token = jwt_decode(jwt_token)
  const user = jwt_token.user

  // if (token === undefined) {
  //   data = "guest"
  //   const darkModeCon = req.cookies.darkmode
  //   res.locals = {
  //     title: "Home",
  //   }
  //   res.render("./guest/index", {
  //     role: "GUEST",
  //     userid: "GUEST",
  //     owner: "GUEST",
  //     darkmode: darkModeCon,
  //   })
  // } else {
  const options = {
    method: "POST",
    url: `${process.env.API}/login/role`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "username": user
    })
  }

  await request(options, (err, request) => {
    if (err) {
      console.log("Error: " + err)
    } else {
      let data = request.body
      data = JSON.parse(data)
      data.map(({ USERNAME, ROLE, ROOT }) => {
        const temp_userid = USERNAME
        const temp_role = ROLE
        const temp_owner = ROOT

        if (request.statusCode == 404) {
          console.log("Error: " + data.Error)
        } else {
          res.locals = {
            title: "Dashboard",
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
  })
  // }
})

/************************    application  *******************************/
const pages = require("./routes/page/index")
router.use("/page", pages)
const test = require("./tokening")
router.use("/test", test)
// customernom
router.get("/customerinfo", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: USERNAME,
      title: "Customer Info",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/customerInfo", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})
router.get("/kycupdate", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: USERNAME,
      title: "Sector Code Update",
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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

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
router.get("/app/pendingbeftn", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  const data = await roleCheck(user)
  await logger(user, req.hostname + req.originalUrl, "Visited")

  data.map(({ ROLE, USERNAME, ROOT }) => {
    res.locals = {
      userid: req.cookies.USERNAME,
      title: "Pending EFT Request",
    }
    const darkModeCon = req.cookies.darkmode
    res.render("./pages/fundmng", {
      role: ROLE,
      userid: USERNAME,
      owner: ROOT,
      darkmode: darkModeCon,
    })
  })
})

module.exports = router
