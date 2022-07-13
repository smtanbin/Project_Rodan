const { oradb } = require("./db/oradb")

const logger = async (user, location, info) => {
  if (process.env.ENVIRONMENT != "DEV") {
    //   console.log("log access")
    location = encodeURI(location)
    sql = `begin tanbin.p_app_log('${user}','${location}','${info}'); end;`

    try {
      await oradb(sql)
      return 1
    } catch (e) {
      console.log(e)
      return e
    }
  }
}

const log = async (user, location, info) => {
  return new Promise((resolve, reject) => {
    location = encodeURI(location)
    sql = `begin tanbin.p_app_log('${user}','${location}','${info}'); end;`
    oradb(sql)
      .then(() => {
        resolve(1)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

module.exports = { logger, log }
/* for geting location window.location.href*/
