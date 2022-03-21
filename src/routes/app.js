const { Router } = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = Router()

// Cors Config
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accepcact')
	res.header('Access-Control-Allow-Methods', [ 'GET', 'POST', 'PATCH', 'DELETE' ])
	next()
})

const jwt_decode = require('jwt-decode')
const darkModeCon = false
const { roleCheck } = require('../apps/roles')
// Visual Viewport Api
/*********************************************************************************/
app.get('/', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	// if (data != null || data != 'unfed') {
	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			title: 'Home'
		}

		if (ROLE === 'ADMIN' || ROLE === 'APPROVAL') {
			res.render('./admin/index', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
		} else {
			res.render('./common/index', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
		}
	})
	// } else {
	// res.locals = {
	// title: '404'
	// }
	// res.render('./pages/404')
	// }
})

app.get('/timeline', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	// if (data != null || data != 'unfed') {
	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Timeline'
		}
		res.render('./pages/timeline', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})

app.get('/customerInfo', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Customer Info'
		}
		res.render('./pages/customerInfo', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})
// Report Panal
/********************************************************************************
 */
app.get('/report/accountStatment', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Account Statment'
		}
		res.render('./pages/statement', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})
app.get('/report/remittanceReport', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Remittance Report'
		}
		res.render('./pages/remittanceReport', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})
app.get('/report/utilityreport', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Utility Report'
		}
		res.render('./pages/utilityreport', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})

app.get('/report/transactionsReport', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Transactions Report'
		}
		res.render('./pages/transactionsReport', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})
app.get('/report/accountInfo', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Account Information'
		}
		res.render('./pages/accountInfo', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})
app.get('/report/businessinfo', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Business Information'
		}
		res.render('./pages/businessinfo', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})
app.get('/report/mis', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'MIS'
		}
		res.render('./pages/mis', { role: ROLE, userid: USERNAME, darkmode: darkModeCon })
	})
})

module.exports = app
