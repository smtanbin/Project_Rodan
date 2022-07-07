const request = require("request")
require("dotenv").config()

const chq_request = (sectionid, pmphone, mphone, page, actitel, WFPIN_NO) => {
  return new Promise((resolve, reject) => {
    const request = require("request")
    const options = {
      method: "POST",
      url: `${process.env.SEMICONAPI}/includes/curl_chq_request.php`,
      headers: {
        Cookie: `PHPSESSID=${sectionid}`,
      },

      formData: {
        cbs: "0",
        accno: mphone,
        cardno: actitel,
        leaf_no: page,
        book_no: "1",
        amnt: "6",
        remarks: "",
        pin: "7878",
        MOD_AC_OPRN: "S",
        fpin_2: "",
        n_op: "1",
        fpin_ck_1: "1",
        fpin_ck_2: "0",
        acc_found: "Y",
        fpin: WFPIN_NO,
        user_id: pmphone,
      },
    }
    request(options, function (error, response) {
      if (error) {
        console.log("request error =>" + error)
        reject(error)
        return
      }
      resolve(response.body)
    })
  })
}

module.exports = { chq_request }
