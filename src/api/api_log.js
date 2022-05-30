const qurrythis = require("../core/db")

const logger = async (user, location, info) => {
  //   console.log("log access")
  location = encodeURI(location)
  sql = `begin tanbin.p_app_log('${user}','${location}','${info}'); end;`

  try {
    // console.log(sql)
    await qurrythis(sql)
    return 1
  } catch (e) {
    console.log(e)
    return e
  }
}

module.exports = { logger }
/* for geting location window.location.href*/
