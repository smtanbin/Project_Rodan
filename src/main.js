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

const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
/*Environment Data*/
require('dotenv').config()
/* JSON Web Token
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way
for securely transmitting information between parties as a JSON object. This information can be
verified and trusted because it is digitally signed. JWTs can be signed using a secret
(with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
Link: https://jwt.io
*/
const jwt = require('jsonwebtoken')
/* JWTAUTHOKEY is the veriable for key
> require('crypto').randomBytes(64).toString('hex')
*/
const jwt_decode = require('jwt-decode')

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, '/views'))
// set the view engine to ejs
app.set('view engine', 'ejs')
// use res.render to load up an ejs view file
app.use(express.json())

// Middelwears
app.use(cors(corsOptions))

app.get('/login', function(req, res) {
	res.locals = {
		title: 'Login'
	}
	res.render('login')
})

/* ---------------------------------- Authorization and verification --------------------------------------
*
*
*/

/* Api
 tokenadd(), tokenver() */
// need cookieParser middleware before we can do anything with cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const { verification } = require('./apps/api_login')

app.post('/oauth', async (req, res) => {
	const userid = req.body.user
	const passwd = req.body.passwd
	try {
		let state = await verification(userid, passwd)
		if (state !== false) {
			state.map(async ({ USERNAME }) => {
				// const token = createToken(userid, ROLE)

				// Creating Refrash Token
				const rtoken = jwt.sign({ user: userid }, process.env.JWTREFRASHKEY)

				// Creating Cluster
				const inputs = { user: userid, refrashtoken: rtoken }
				// Keeping token to Database
				const token = jwt.sign(inputs, process.env.JWTAUTHOKEY, {
					expiresIn: '13m' // expires in 1 hours
				})
				res.setHeader('secret', token)
				res.cookie(`auth`, token, { expire: 200 + Date.now() })
				// let auth = req.cookies.auth
				res.send(state)
			})
		} else {
			res.send(state)
		}
	} catch (e) {
		console.log('otho error ' + e)
	}
})

/* -----------------------------------------------------------------------
*
*						Middelware & Verification
*
--------------------------------------------------------------------------*/
app.get('/*', (req, res, next) => {
	try {
		// console.log(req.headers)
		//Importing token from cookies
		const token = req.cookies.auth
		/*If there is no valid auth cookie present in browser*/
		if (!token /*token not found*/) {
			/*Init Login Page*/
			res.locals = {
				title: 'Login'
			}
			res.render('login') //Page Renderd
		} else {
			next()
		}
	} catch (e) {
		console.log('error: ' + e)
	}
})

// app.get('/', (req, res, next) => {
// 	console.log(res.cookies)
// 	try {
// 		//Importing token from cookies
// 		const token = req.cookies.auth
// 		/*If there is no valid auth cookie present in browser*/
// 		if (!token /*token not found*/) {
// 			/*Init Login Page*/
// 			res.locals = {
// 				title: 'Login'
// 			}
// 			res.render('login') //Page Renderd
// 		} else {
// 			/*If there is a auth cookie present in browser */

// 			/*Verifying If provied token valid*/
// 			jwt.verify(token, process.env.JWTAUTHOKEY, (err) => {
// 				/*JWT autho token present in env file*/
// 				if (!err /*Token is not valid*/) {
// 					const { user, role, refrashtoken } = jwt_decode(token)
// 					jwt.verify(token, process.env.JWTREFRASHKEY, async (err) => {
// 						if (!err) {
// 							/* Getting Database*/
// 							const qurrythis = require('./apps/db')
// 							// Creating SQL
// 							let sql = `SELECT count(TOKEN) FROM TANBIN.JWT WHERE TOKEN = ${refrashtoken}`
// 							// const checking = await qurrythis(sql)

// 							// if (checking !== 0 /*Checking If record found?*/) {
// 							const inputs = { user: userid, role: role, refrashtoken: refrashtoken }
// 							const token = jwt.sign(inputs, process.env.JWTREFRASHKEY, {
// 								expiresIn: '5s' // expires in 1 hours
// 							})
// 							await qurrythis(
// 								/* Keeping token to Database*/
// 								`INSERT INTO TANBIN.JWT (USERID, TOKEN,ORGDATE) VALUES ('${userid}', '${token}', (SELECT CURRENT_TIMESTAMP FROM dual)); commit`
// 							)
// 							res.cookie(`auth`, createRefrashToken(user, role, refrashtoken))
// 							next()
// 							// } else {
// 							// return 'Invalid'
// 							// }
// 						} else console.log(err)
// 					})
// 				} else {
// 					console.log('No Error Found')
// 					next()
// 				}
// 			})
// 		}
// 	} catch (e) {
// 		console.log('Error on middelware ' + e)
// 	}
// })

/*******************************************************************
 * 
 * 								Routes
 * 
 * ******************************************************************/
/*Every Application page path location in */
const apppath = require('./routes/app')
app.use('/', apppath)
/*And Every apis path here*/
const apipath = require('./routes/api')
app.use('/api', apipath)
/*If Page not found (404) this path handels it*/
app.get('*', function(req, res) {
	res.locals = {
		title: '404!'
	}
	res.render('pages/404')
	res.status('404')
})
const { isNullOrUndefined } = require('util')

/********************************************************************
 * 
 * 		Express Config
 * 
*********************************************************************/
/* Port come from env file if fail so it will run at 3000 port*/
const port = process.env.PORT || 3000
/* Express Init*/
app.listen(port)
console.log('Server is listening on port: ' + port)
