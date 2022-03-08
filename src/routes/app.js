const { Router } = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = Router()

// Cors Config
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middlewares
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accepcact')
	res.header('Access-Control-Allow-Methods', [ 'GET', 'POST', 'PATCH', 'DELETE' ])
	next()
})

// Visual Viewport Api
/**************************************** Start ****************************************
 */
app.get('/', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Home'
	}
	res.render('./index')
})

app.get('/timeline', function(req, res) {
	const name = req.cookies.USERNAME
	res.locals = {
		userid: name,
		title: 'Timeline'
	}
	res.render('./pages/timeline')
})

// registration
app.get('/report/customerInfo', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Customer Info'
	}
	res.render('./pages/customerInfo')
})
app.get('/report/utilityreport', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Utility Report'
	}
	res.render('./pages/utilityreport')
})
app.get('/report/accountStatment', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Account Statment'
	}
	res.render('./pages/statement')
})
app.get('/report/remittanceReport', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Remittance Report'
	}
	res.render('./pages/remittanceReport')
})
app.get('/report/transactionsReport', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Transactions Report'
	}
	res.render('./pages/transactionsReport')
})
app.get('/report/accountInfo', function(req, res) {
	res.locals = {
		userid: req.cookies.USERNAME,
		title: 'Account Information'
	}
	res.render('./pages/accountInfo')
})

module.exports = app
