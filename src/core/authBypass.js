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
    request(options, function (error, response) {
      if (error) {
        reject(error)
        return
      }
      let php_sessoin = response.headers["set-cookie"]
      php_sessoin = php_sessoin.toString()
      php_sessoin = php_sessoin.split("=")
      php_sessoin = php_sessoin[1].split(";")
      php_sessoin = php_sessoin[0]
      php_sessoin = php_sessoin.toString()
      resolve(php_sessoin)
    })
  }).catch((e) => { return e })
}

module.exports = { getSectionKey }
