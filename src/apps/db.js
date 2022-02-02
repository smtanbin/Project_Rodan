/* Calling Oracle Database*/
const oracledb = require('oracledb')
let connection

/* This one very importent. In make sure the output.
*/
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

async function qurrythis(sqlqurry) {
	try {
		connection = await oracledb.getConnection({
			user: 'tanbin',
			password: '@urA774234',
			connectString: '10.130.102.103:1525/SBLABS'
		})
		const result = await connection.execute(sqlqurry)
		return result.rows
	} catch (err) {
		console.error(err)
	} finally {
		if (connection) {
			try {
				await connection.close()
			} catch (err) {
				console.error(err)
			}
		}
	}
}
module.exports = qurrythis
