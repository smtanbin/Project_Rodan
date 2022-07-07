const qurrythis = require("./db/db")

const logger = async (user, location, info) => {

  if (process.env.ENVIRONMENT != "DEV") {
    //   console.log("log access")
    location = encodeURI(location)
    sql = `begin tanbin.p_app_log('${user}','${location}','${info}'); end;`

    try {
      await qurrythis(sql)
      return 1
    } catch (e) {
      console.log(e)
      return e
    }
  }
}

module.exports = { logger }
/* for geting location window.location.href*/
