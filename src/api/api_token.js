const qurrythis = require("./db/db")

const find_token = ({ token, user }) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT TOKEN FROM TANBIN.JWT_TOKEN where STATUS = 1 and TOKEN = '${token}' and USER = ${user}`
        try {
            resolve(qurrythis(sql))
        } catch (e) {
            reject(e)
        }
    })
}

const insert_token = ({ token, user, }) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT
	INTO
	TANBIN.JWT_TOKEN (
	TOKEN,
	"USER",
	STATUS,
	GEN_DATE)
VALUES(
'${token}',
'${user}',
1 ,
SYSDATE)`
        try {
            resolve(qurrythis(sql))
        } catch (e) {
            reject(e)
        }
    })
}
const status_update = ({ token, }) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE 
        TANBIN.JWT_TOKEN SET STATUS=0, EXP_DATE=sysdate
        WHERE USER = ${token}`
        try {
            resolve(qurrythis(sql))
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = { find_token, status_update, insert_token }