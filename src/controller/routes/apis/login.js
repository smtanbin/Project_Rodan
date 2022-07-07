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
const { make_token, gen_login } = require("../../../core/login_master")

// Api function Start
api.post("/make_token", async (req, res /* res will send user & password */) => {
    const { user, passwd } = req.body
    const reply = await gen_login(user, passwd)
    console.log(reply);
    if (reply === '403' || reply === '500') {
        res.status(reply)
    } else {
        res.status(reply)
    }

})

api.post("/refrash_token", (req, res) => {
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

api.post("/make_guest_token", (req, res) => {
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

module.exports = api