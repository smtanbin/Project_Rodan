const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
let autho = false

const path = require('path')
const cors = require('cors')

const { login } = require('./apps/api_login')
const { setCookie, getCookie, eraseCookie } = require('./apps/FunCore')
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

app.post('/oauth', async (req, res) => {
	const user = req.body.user
	const passwd = req.body.passwd
	try {
		// let res = await login(user, passwd)
		console.log(user)
		console.log(passwd)
		res.send(await login(user, passwd))
		// const token = jwt.sign('user', '774gsg342%%#sgsrq2234')

		// res.cookie('auth', token)
		// res.json(token)
		// res.send()
		// setCookie('auth', 'token', 7)

		// res.send(data)
	} catch (e) {
		console.log(e)
		res.send(e)
		res.status(403)
	}
})

app.get('/', (req, res, next) => {
	// console.log(getCookie('auth'))
	// console.log(req.headers)
	// const authoHeader = req.headers['authorization']
	// const token = authoHeader && authoHeader.split(' ')[1]
	// if (autho == null) {
	// 	res.locals = {
	// 		title: 'Login'
	// 	}
	// 	res.render('login')
	// } else {
	// 	jwt.verify(token, '774gsg342%%#sgsrq2234', (err, user) => {
	// 		if (err) return res.sendStatus(403)
	// 		req.user = user
	next()
	// 	})
	// }
})
/** 
 Routes
 **/
// index page
app.get('/', function(req, res) {
	res.locals = {
		title: 'Home'
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
app.use('/api', apipath)

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
