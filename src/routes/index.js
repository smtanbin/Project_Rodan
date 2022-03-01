const { Router } = require('express')
const { doexist, holyday } = require('../apps/api.js')
const { customerinfo } = require('../apps/api_customerinfo')
const { timeline, trSearch } = require('../apps/api_timeline')
const { pbslist, utilityinfohead, utilityinfodtl, utilityinfosummary } = require('../apps/api_utilitybill.js')
const { remittancehouselist, remittance, remittancesummary, remittanceRequest } = require('../apps/api_remittance')
const { transactionsreport } = require('../apps/api_transactionsreport')
const { statementHead, statementBody } = require('../apps/apiStatement')
const { accountInfo } = require('../apps/api_accountInfo')
const {
	pichart,
	agentstatus,
	cashEntry,
	customerstatus,
	accountStatus,
	monthlyActivity,
	dpsMaturity
} = require('../apps/api_home')
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

// VisualViewport

app.get('/holyday', async (req, res) => {
	const data = await holyday()
	res.send(data)
})

/*Timeline*/

/* chart Api*/
const { dailydrcr } = require('../api/chartsData')
app.get('/dailydrcr', async (req, res) => {
	const data = await dailydrcr()
	res.send(data)
})

/* timeline Api*/
/* timeline Api*/
/* timeline Api*/
/* timeline Api*/
/* timeline Api*/
/* timeline Api*/

app.get('/timeline', async (req, res) => {
	const data = await timeline()
	res.send(data)
})
app.post('/trsearch', async (req, res) => {
	const key = req.body.key
	try {
		const data = await trSearch(key)
		res.send(data)
	} catch (e) {
		console.log(e)
		res.send(e)
		res.status(403)
	}
})

app.get('/dpsMaturity', async (req, res) => {
	try {
		const data = await dpsMaturity()

		res.send(data)
	} catch (e) {
		return e
	}
})
app.get('/pichart', async (req, res) => {
	try {
		const data = await pichart()

		res.send(data)
	} catch (e) {
		return e
	}
})
app.get('/cashEntry', async (req, res) => {
	try {
		const data = await cashEntry()

		res.send(data)
	} catch (e) {
		return e
	}
})
app.get('/agentstatus', async (req, res) => {
	try {
		const data = await agentstatus()

		res.send(data)
	} catch (e) {
		return e
	}
})
app.get('/customerstatus', async (req, res) => {
	try {
		const data = await customerstatus()

		res.send(data)
	} catch (e) {
		return e
	}
})

/* Account Api*/ accountInfo
app.post('/accountInfo', async (req, res) => {
	res.status(200)
	try {
		const data = await accountInfo(req.body.key)
		// console.log(data)
		res.send(data)
	} catch (e) {
		res.status(400)
		res.send('Stop by error! Check if its help:' + e)
	}
})

/* Utility info All utility realated apis data 
functions are currently imported from api_utilitybill.js */

/* This will bring the list for dropdown*/
app.get('/utilityreportpbslist', async (req, res) => {
	const data = await pbslist()
	res.send(data)
})
/* Give the summary data */
app.post('/utilityinfo', async (req, res) => {
	const from = req.body.from
	const to = req.body.to
	const acno = req.body.acno
	res.send(data)
})
/* Give the deteals data */
app.post('/utilityinfohead', async (req, res) => {
	try {
		const data = await utilityinfohead(req.body.date, req.body.key)
		res.send(data)
	} catch (e) {
		res.status(400)
		res.send('Stop by error! Check if its help:' + e + data)
	}
})
app.post('/utilityinfodtl', async (req, res) => {
	res.status(200)
	try {
		const data = await utilityinfodtl(req.body.fromdate, req.body.todate, req.body.key)
		res.send(data)
	} catch (e) {
		res.status(400)
		res.send('Stop by error! Check if its help:' + e)
	}
})
app.post('/utilityinfosummary', async (req, res) => {
	res.status(200)
	try {
		const data = await utilityinfosummary(req.body.fromdate, req.body.todate)
		res.send(data)
	} catch (e) {
		res.status(400)
		res.send('Stop by error! Check if its help:' + e)
	}
})

/*Remittance*/
app.get('/remittanceRequest', async (req, res) => {
	const data = await remittanceRequest()
	res.send(data)
})
app.get('/remittancehouselist', async (req, res) => {
	const data = await remittancehouselist()
	res.send(data)
})

app.post('/remittance', async (req, res) => {
	const fromdate = req.body.fromdate
	const todate = req.body.todate
	const key = req.body.key
	const data = await remittance(fromdate, todate, key)
	res.send(data)
})
app.post('/remittancesummary', async (req, res) => {
	const fromdate = req.body.fromdate
	const todate = req.body.todate
	const data = await remittancesummary(fromdate, todate)
	res.send(data)
})

/* This will check if account existed */
app.post('/doexist', async (req, res) => {
	const key = req.body.key
	const data = await doexist(key)
	res.send(data)
})

/* Account Statment Part
*/

/* Give the summary data */
app.post('/statementhead', async (req, res) => {
	const date = req.body.date
	const key = req.body.key
	const data = await statementHead(date, key)
	res.send(data)
})
/* Give the deteals data */

app.post('/statementbody', async (req, res) => {
	res.status(200)
	try {
		const data = await statementBody(req.body.fromdate, req.body.todate, req.body.key)
		res.send(data)
	} catch (e) {
		res.status(400)
		res.send('Stop by error! Check if its help:' + e)
	}
})

/* transactionsreport*/

app.post('/transactionsreport', async (req, res) => {
	res.status(200)
	try {
		const data = await transactionsreport(req.body.key)
		res.send(data)
	} catch (e) {
		res.status(400)
		res.send('Stop by error! Check if its help:' + e)
	}
})

app.post('/customerinfo', async (req, res) => {
	const data = await customerinfo(req.body.id)
	res.send(data)
})
app.post('/monthlyActivity', async (req, res) => {
	const data = await monthlyActivity(req.body.key)
	res.send(data)
})
app.get('/accountStatus', async (req, res) => {
	try {
		const data = await accountStatus()
		res.send(data)
	} catch (e) {
		console.log(e)
		res.send(e)
	}
})

/* APi server Status*/
// const { cpu } = require('../apps/app')
// app.get('/cpu', async (req, res) => {
// 	res.send(cpu)
// })

app.get('/', async (req, res) => {
	res.send('Welcome to Restful API Power by Tanbin Hassan Bappi')
})

module.exports = app
