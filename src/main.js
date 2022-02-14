const express = require('express')
// require('dotenv').config();
const app = express()
const path = require('path')
const cors = require('cors')
const apipath = require('./routes/index')
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, '/views'))
// set the view engine to ejs
app.set('view engine', 'ejs')
// use res.render to load up an ejs view file
let autho = false




// Middelwears
app.use(cors(corsOptions))

app.get('/', function(req, res, next) {
	if (autho === true) {
		res.locals = {
			title: 'Login'
		}
		res.render('login')
	} else {
		next()
	}
})

app.get('/login', function(req, res) {
	res.locals = {
		title: 'Login'
	}
	res.render('login')
})
/** 
 **Routes**
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
		title: 'Account Report'
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

// API
app.use('/api', apipath)

const port = 80
app.listen(port)
console.log('Server is listening on port ' + port)
