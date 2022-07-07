const qurrythis = require("./db/db")

const routelist = async () => {
  try {
    const sql = `SELECT * FROM TANBIN.BANK_ROUTING`
    return qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}
const updateroutelist = async (key) => {
  try {
    const sql = `begin TANBIN.P_UPDATE_ROUTE; end;`
    return qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}
const routelistSearch = async (key) => {
  try {
    const sql = `SELECT * FROM TANBIN.BANK_ROUTING WHERE ROUTING_NO = ${key}`
    return qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}
const getlimited = async (from, to) => {
  try {
    const sql = `SELECT *
  FROM (SELECT R.*, ROWNUM RANGE
          FROM TANBIN.BANK_ROUTING R order by ROUTING_NO asc)
 WHERE RANGE BETWEEN ${from} AND ${to} `
    return qurrythis(sql)
  } catch (e) {
    console.log(e)
    return e
  }
}

module.exports = { routelist, updateroutelist, routelistSearch, getlimited }
