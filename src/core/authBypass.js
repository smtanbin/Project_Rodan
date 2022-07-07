const request = require("request")
require("dotenv").config()

const getSectionKey = (user, passswd) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: `${process.env.SEMICONAPI}/includes/login_check.php`,
      formData: {
        userid: `${user}`,
        password: `${passswd}`,
      },
    }
    console.log(options)
    request(options, function (error, response) {
      if (error) {
        reject(error)
        return
      }
      let retver = response.headers["set-cookie"]
      retver = retver.toString()
      retver = retver.split("=")
      retver = retver[1].split(";")
      retver = retver[0]
      retver = retver.toString()
      // console.log(">" + retver);
      resolve(retver)
    })
  })
}

module.exports = { getSectionKey }
