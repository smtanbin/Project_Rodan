const { Router } = require('express')
const { reginfo, nooftrans, customerinfo } = require('../apps/api.js')
const app = Router()
;(bodyParser = require('body-parser')), app.use(bodyParser.json())

// Utility info summery
app.post('/utilityinfosummary', async (req, res) => {
	const from = req.body.from
	const to = req.body.to
	const acno = req.body.acno
	res.send(data)
})

app.post('/numberoftrans', async (req, res) => {
	const from = req.body.from
	const to = req.body.to
	console.log(req)

	const data = await nooftrans(from, to)
	res.send(data)
})
app.get('/numberoftrans', async (req, res) => {
	console.log(req)

	const data = await nooftrans('01-dec-2021', '31-dec-2021')
	res.send(data)
})

app.get('/customerinfo', async (req, res) => {
	const data = await customerinfo(10834000654)
	res.send(data)
})

app.post('/customerinfo', async (req, res) => {
	const data = await customerinfo(req.body.id)
	console.log(req.body.id)
	res.send(data)
})

app.get('/', async (req, res) => {
	res.send('Welcome to Restful API Power by Tanbin Hassan Bappi')
})

module.exports = app
