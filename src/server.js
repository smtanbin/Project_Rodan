/*MIT License
Copyright (c) 2022 Tanbin
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
/*Environment Data*/
require("dotenv").config()
/* JSON Web Token
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way
for securely transmitting information between parties as a JSON object. This information can be
verified and trusted because it is digitally signed. JWTs can be signed using a secret
(with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
Link: https://jwt.io
*/
const jwt = require("jsonwebtoken")
/* JWTAUTHOKEY is the veriable for key
> require('crypto').randomBytes(64).toString('hex')
*/
const jwt_decode = require("jwt-decode")

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const ejs = require("ejs")
/* EJS also supports caching by using LRU. 
The LRU Cache will cache intermediate JavaScript functions used to render template.*/
const LRU = require("lru-cache")

// At least one of 'max', 'ttl', or 'maxSize' is required, to prevent
// unsafe unbounded storage.
// In most cases, it's best to specify a max for performance, so all
// the required memory allocation is done up-front.
const options = {
  // the number of most recently used items to keep.
  // note that we may store fewer items than this if maxSize is hit.

  max: 500, // <-- Technically optional, but see "Storage Bounds Safety" below

  // if you wish to track item size, you must provide a maxSize
  // note that we still will only keep up to max *actual items*,
  // so size tracking may cause fewer than max items to be stored.
  // At the extreme, a single item of maxSize size will cause everything
  // else in the cache to be dropped when it is added.  Use with caution!
  // Note also that size tracking can negatively impact performance,
  // though for most cases, only minimally.
  maxSize: 5000,

  // function to calculate size of items.  useful if storing strings or
  // buffers or other items where memory size depends on the object itself.
  // also note that oversized items do NOT immediately get dropped from
  // the cache, though they will cause faster turnover in the storage.
  sizeCalculation: (value, key) => {
    // return an positive integer which is the size of the item,
    // if a positive integer is not returned, will use 0 as the size.
    return 1
  },

  // function to call when the item is removed from the cache
  // Note that using this can negatively impact performance.
  dispose: (value, key) => {
    freeFromMemoryOrWhatever(value)
  },

  // max time to live for items before they are considered stale
  // note that stale items are NOT preemptively removed by default,
  // and MAY live in the cache, contributing to its LRU max, long after
  // they have expired.
  // Also, as this cache is optimized for LRU/MRU operations, some of
  // the staleness/TTL checks will reduce performance, as they will incur
  // overhead by deleting items.
  // Must be a positive integer in ms, defaults to 0, which means "no TTL"
  ttl: 1000 * 60 * 5,

  // return stale items from cache.get() before disposing of them
  // boolean, default false
  allowStale: false,

  // update the age of items on cache.get(), renewing their TTL
  // boolean, default false
  updateAgeOnGet: false,

  // update the age of items on cache.has(), renewing their TTL
  // boolean, default false
  updateAgeOnHas: false,
}

ejs.cache = new LRU(options)

// set the view engine to ejs
app.set("view engine", "ejs")
// page viwes
app.set("views", path.join(__dirname, "/assets/views"))
// public folder
app.use(express.static(__dirname + "/assets/Public"))

// javascripts
app.use("/JS", express.static(__dirname + "/scripts"))
// use res.render to load up an ejs view file
app.use(express.json())

// Middelwears
app.use(cors(corsOptions))

const { logger } = require("./api/api_log")

/*And Every apis path here*/
const apipath = require("./controller/api")
app.use("/api", apipath)

app.get("/login", async (req, res) => {
  await logger(
    "anonymous",
    req.hostname + req.originalUrl,
    "Visited Login Page"
  )
  res.locals = {
    title: "Login",
  }
  res.render("login")
})

/* ---------------------------------- Authorization and verification --------------------------------------
 *
 *
 */

/* Api
 tokenadd(), tokenver() */
// need cookieParser middleware before we can do anything with cookies
const cookieParser = require("cookie-parser")
app.use(cookieParser())

/* -----------------------------------------------------------------------
*
*						Middelware & Verification
*
--------------------------------------------------------------------------*/
// app.get("/*", async (req, res, next) => {
//   const token = req.cookies.auth
//   if (!token) {
//     res.locals = {
//       title: "Login",
//     }
//     res.render("login") //Page Rend ,0p.[/-erd
//   } else {
//     next()
//   }
// })

// const { redisdb } = require("./cache/cachedb")
// app.get("/*", async (req, res, next) => {
//   await redisdb(() => { next() })

// })
// app.get("/*", async (req, res, next) => {
//   const token = req.cookies.auth
//   res.set('Token', token)
//   console.log(res);
// })

/*******************************************************************
 *
 * 								Routes
 *
 * ******************************************************************/
/*Every Application page path location in */
const apppath = require("./controller/routes")
app.use("/", apppath)
const { resolve } = require("dns")
const { rejects } = require("assert")

/*If Page not found (404) this path handels it*/
app.get("*", function (req, res) {
  res.locals = {
    title: "404!",
  }
  res.render("pages/404")
  res.status(404)
})

/********************************************************************
 *
 * 		Express Config
 *
 *********************************************************************/
/* Port come from env file if fail so it will run at 3000 port*/
const port = process.env.PORT || 3000
/* Express Init*/
app.listen(port)
console.log("Server is listening on port: " + port)
