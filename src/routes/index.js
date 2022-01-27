const { Router } = require('express')
const { reginfo, nooftrans, customerinfo } = require('../apps/api.js')
const app = Router()

app.get('/reginfo', async (req, res) => {
	const data = await reginfo()
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
	const data = await customerinfo(10833000003)
	res.send(data)
})

app.post('/customerinfo', async (req, res) => {
	// const data = await customerinfo(res.body.id)
	const data = await customerinfo(res.body)
	console.log(res.body)
	res.send(data)
})

app.get('/', async (req, res) => {
	res.send('Welcome to Restful API Power by Tanbin Hassan Bappi')
})

module.exports = app
