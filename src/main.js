"use strict"
const express = require("express"),
  app = express(),
  path = require("path"),
  cors = require("cors")
require("dotenv").config()
const jwt = require("jsonwebtoken"),
  jwt_decode = require("jwt-decode"),
  corsOptions = { origin: "*", optionsSuccessStatus: 200 },
  ejs = require("ejs"),
  LRU = require("lru-cache"),
  options = {
    max: 500,
    maxSize: 5e3,
    sizeCalculation: () => 1,
    dispose: (a) => {
      freeFromMemoryOrWhatever(a)
    },
    ttl: 300000,
    allowStale: !1,
    updateAgeOnGet: !1,
    updateAgeOnHas: !1,
  }
;(ejs.cache = new LRU(options)),
  app.set("view engine", "ejs"),
  app.set("views", path.join(__dirname, "/assets/views")),
  app.use(express.static(__dirname + "/assets/Public")),
  app.use("/JS", express.static(__dirname + "/App")),
  app.use(express.json()),
  app.use(cors(corsOptions)),
  app.get("/login", function (a, b) {
    ;(b.locals = { title: "Login" }), b.render("login")
  })
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const { verification } = require("./Api/api_login")
app.post("/oauth", async (a, b) => {
  const c = a.body.user,
    d = a.body.passwd
  try {
    let a = await verification(c, d)
    !1 === a
      ? b.send(a)
      : a.map(async ({ USERNAME: d }) => {
          const e = jwt.sign({ user: c }, process.env.JWTREFRASHKEY),
            f = jwt.sign(
              { user: c, refrashtoken: e },
              process.env.JWTAUTHOKEY,
              { expiresIn: "13m" }
            )
          b.setHeader("secret", f),
            b.cookie(`auth`, f, { expire: 200 + Date.now() }),
            b.send(a)
        })
  } catch (a) {
    console.log("otho error " + a)
  }
}),
  app.get("/*", (a, b, c) => {
    try {
      const d = a.cookies.auth
      d ? c() : ((b.locals = { title: "Login" }), b.render("login"))
    } catch (a) {
      console.log("error: " + a)
    }
  })
const apppath = require("./Routes/app")
app.use("/", apppath)
const apipath = require("./Routes/api")
app.use("/api", apipath),
  app.get("*", function (a, b) {
    ;(b.locals = { title: "404!" }), b.render("pages/404"), b.status("404")
  })
const port = process.env.PORT || 3e3
app.listen(port), console.log("Server is listening on port: " + port)
