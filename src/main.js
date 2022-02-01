const express = require('express')
const app = express()
const path = require('path')
const apipath = require('./routes/index')
app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, '/views'))
// set the view engine to ejs
app.set('view engine', 'ejs')
// use res.render to load up an ejs view file
let autho = false
// Middelwears
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

app.get('/login', function(req, res) {
	res.locals = {
		title: 'Login'
	}
	res.render('pages/login')
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

// API
app.use('/api', apipath)

const port = 80
app.listen(port)
console.log('Server is listening on port ' + port)
