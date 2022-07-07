const { Router, application } = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const router = Router()
const { logger } = require("../api/api_log")

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

const jwt_decode = require("jwt-decode")
const { roleCheck } = require("../core/roles")



// router.get("/*", (req, res, next) => {
//   console.log(req.url);
//   next()
// })


// Visual Viewport Api
/*********************************************************************************/
router.get("/", async (req, res) => {
  const token = req.cookies.auth
  const { user } = jwt_decode(token)
  let data
  if (user === "guest") {
    data = "guest"

    const darkModeCon = req.cookies.darkmode

    await logger(user, req.hostname + req.originalUrl, "Visited")

    res.locals = {
      title: "Home",
    }
    res.render("./guest/index", {
      role: "GUEST",
      userid: "GUEST",
      owner: "GUEST",
      darkmode: darkModeCon,
    })
  } else {
    data = await roleCheck(user)
    // if (data != null || data != 'unfed') {
    data.map(async ({ ROLE, USERNAME, ROOT }) => {
      res.locals = {
        title: "Home",
      }
      const darkModeCon = req.cookies.darkmode

      await logger(user, req.hostname + req.originalUrl, "Visited")

      if (ROLE === "ADMIN" || ROLE === "APPROVAL") {
        res.render("./admin/index", {
          role: ROLE,
          userid: USERNAME,
          owner: ROOT,
          darkmode: darkModeCon,
        })
      } else {
        res.render("./common/index", {
          role: ROLE,
          userid: USERNAME,
          owner: ROOT,
          darkmode: darkModeCon,
        })
      }
    })
  }

  // } else {
  // res.locals = {
  // title: '404'
  // }
  // res.render('./pages/404')
  // }
})


/************************    application  *******************************/
const pages = require("./routes/page/index")
router.use("/page", pages)


router.get("/kycupdate", async (req, res) => {
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
