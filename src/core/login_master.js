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
const { verification, find_token, status_update, insert_token } = require('../api/api_login')


const token_verification = ({ token, user }) => {
    return new Promise((resolve, rejects) => {
        /*Verifying If provied token valid*/
        jwt.verify(token, process.env.JWTAUTHOKEY, async (err) => {
            if (err /*Token is not valid*/) {
                rejects('405')
            } else {
                /*JWT autho token present in env file*/
                const { user, refrashtoken } = jwt_decode(token)
                const ref_token = await find_token(refrashtoken, user)
                if (ref_token === refrashtoken) {
                    resolve('302')
                } else {
                    rejects('404')
                }
            }
        })
    })
}

const gen_token = ({ user, passwd }) => {
    return new Promise(async (resolve, rejects) => {

        const status = verification(user, passwd)

        if (status === '404') {
            rejects('404')
        } else {
            const rtoken = jwt.sign({ user }, process.env.JWTREFRASHKEY)
            // Creating Cluster
            const inputs = { user, refrashtoken: rtoken }
            // Keeping token to Database
            try {
                await insert_token(rtoken, user)
            } catch (e) {
                console.log('Error adding token' + e)
                rejects('500')
            }
            const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
                expiresIn: "13m", // expires in 1 hours
            })
            resolve(token)
        }
    })

}
const make_token = ({ user }) => {
    return new Promise(async (resolve, rejects) => {
        const rtoken = jwt.sign({ user }, process.env.JWTREFRASHKEY)
        const inputs = { user, refrashtoken: rtoken }
        try {
            await insert_token(rtoken, user)
        } catch (e) {
            console.log('Error adding token' + e)
            rejects('500')
        }
        const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
            expiresIn: "13m", // expires in
        })
        resolve(token)

    })
}

const { logger } = require("../api/api_log")

const gen_login = ({ user, passwd }) => {
    return new Promise(async (resolve, reject) => {
        if (user === undefined || passwd === undefined) {
            reject('203')
        }
        let state = ''
        try {
            // verification will take user and password, & return error code or username
            state = await verification(user, passwd)
        } catch (err) {
            reject(err)
        }
        // Status 403 means unverified
        if (state === '403') {
            reject(state)
        } else {
            const token = make_token(user)
            if (token === '500') {
                reject(token)
            } else {
                try {
                    state.map(async ({ USERNAME }) => {
                        //Log the activity
                        await logger(USERNAME, req.hostname + req.originalUrl, `Login Sucessfull`)
                    })
                    resolve(token) //Sending token
                } catch (err) {
                    reject(err)
                }
            }
        }
    })
}


const func_approve = (token) => {

    return new Promise(async (resolve, reject) => {
        if (token === undefined) {
            reject(["403", "No Token found"])
        } else {
            await jwt.verify(token, process.env.JWTAUTHOKEY, (err) => {
                if (err /*Token is not valid*/) {
                    reject(["403", err])
                } else {
                    resolve(["202", "Grated"])
                }
            })
        }
    }).catch((e) => {
        return e
    })

}
module.exports = { make_token, token_verification, func_approve, gen_login }
