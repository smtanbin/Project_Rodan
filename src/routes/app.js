const { Router } = require('express')
const bodyParser = require('body-parser')
const Cookies = require('js-cookie')
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
	res.header('Access-Control-Allow-Methods', ['GET', 'POST', 'PATCH', 'DELETE'])
	next()
})

const jwt_decode = require('jwt-decode')
const { roleCheck } = require('../core/roles')

// Visual Viewport Api
/*********************************************************************************/
app.get('/', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	// if (data != null || data != 'unfed') {
	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			title: 'Home'
		}
		const darkModeCon = req.cookies.darkmode
		if (ROLE === 'ADMIN' || ROLE === 'APPROVAL') {
			res.render('./admin/index', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
		} else {
			res.render('./common/index', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
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
	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Timeline'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/timeline', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})

app.get('/customerInfo', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Customer Info'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/customerInfo', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/kycupdate', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Customer Info'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/kycupdate', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/sms', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Customer Info'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/sms', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/remittanceProcessing', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Remittance'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/remittanceProcessing', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/requestRemittance', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: USERNAME,
			title: 'Remittance Request'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/requestRemittance', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/reconciliation', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Reconciliation'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/reconciliation', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})



// Report Panal
/********************************************************************************
 */
app.get('/report/accountStatment', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Account Statment'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/statement', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/report/remittanceReport', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Remittance Report'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/remittanceReport', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/report/utilityreport', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Utility Report'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/utilityreport', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})

app.get('/report/transactionsReport', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Transactions Report'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/transactionsReport', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/report/accountInfo', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Account Information'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/accountInfo', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/report/businessinfo', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'Business Information'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/businessinfo', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})
app.get('/report/mis', async (req, res) => {
	const token = req.cookies.auth
	const { user } = jwt_decode(token)
	const data = await roleCheck(user)

	data.map(({ ROLE, USERNAME, ROOT }) => {
		res.locals = {
			userid: req.cookies.USERNAME,
			title: 'MIS'
		}
		const darkModeCon = req.cookies.darkmode
		res.render('./pages/mis', { role: ROLE, userid: USERNAME, owner: ROOT, darkmode: darkModeCon })
	})
})


module.exports = app
