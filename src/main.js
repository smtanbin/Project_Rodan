const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

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
require('dotenv').config()
/* Api
 tokenadd(), tokenver() */
// need cookieParser middleware before we can do anything with cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const { verification, tokenadd } = require('./apps/api_login')

app.post('/oauth', async (req, res, next) => {
	const userid = req.body.user
	const passwd = req.body.passwd

	try {
		let state = await verification(userid, passwd)
		if (state !== false) {
			state.map(async ({ USERNAME, ROLE }) => {
				const claims = { user: userid, role: ROLE, name: USERNAME }
				const token = jwt.sign(claims, process.env.JWTAUTHOKEY, {
					expiresIn: '10m' // expires in 1 hours
				})

				// await tokenadd(userid, token) //Add token to database
				console.log(token)
				res.cookie(`auth`, token)
				res.send(state)
			})
		} else {
			res.send(state)
		}
	} catch (e) {
		console.log('otho error ' + e)
	}
})

app.get('/', (req, res, next) => {
	// console.log(req.cookies)
	const token = req.cookies.auth
	jwt.verify(token, process.env.JWTAUTHOKEY, (err) => {
		if (err) {
			res.locals = {
				title: 'Login'
			}
			res.render('login')
		} else {
			next()
		}
	})
})
/** 
 Routes
 **/
// index page
const jwt_decode = require('jwt-decode')
app.get('/', function(req, res) {
	const token = req.cookies.auth
	const { name } = jwt_decode(token)

	res.locals = {
		title: 'Home',
		userid: name
	}
	res.render('index')
})

app.get('/timeline', function(req, res) {
	res.locals = {
		title: 'Timeline'
	}
	res.render('pages/timeline')
})

// registration
app.get('/report/customerInfo', function(req, res) {
	res.locals = {
		title: 'Customer Info'
	}
	res.render('pages/customerInfo')
})
app.get('/report/utilityreport', function(req, res) {
	res.locals = {
		title: 'Utility Report'
	}
	res.render('pages/utilityreport')
})
app.get('/report/accountStatment', function(req, res) {
	res.locals = {
		title: 'Account Statment'
	}
	res.render('pages/statement')
})
app.get('/report/remittanceReport', function(req, res) {
	res.locals = {
		title: 'Remittance Report'
	}
	res.render('pages/remittanceReport')
})
app.get('/report/transactionsReport', function(req, res) {
	res.locals = {
		title: 'Transactions Report'
	}
	res.render('pages/transactionsReport')
})
app.get('/report/accountInfo', function(req, res) {
	res.locals = {
		title: 'Account Information'
	}
	res.render('pages/accountInfo')
})

const apipath = require('./routes/index')
const { isNullOrUndefined } = require('util')
app.use('/api', apipath)

app.get('*', function(req, res) {
	res.locals = {
		title: '404!'
	}
	res.render('pages/404')
	res.send(404)
})

const port = process.env.PORT
app.listen(port)

// console.log(`MIT License
// Copyright (c) 2022 Tanbin
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.`)
console.log('Starting Morathi Server is listening on port' + port)
