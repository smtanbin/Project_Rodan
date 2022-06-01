const qurrythis = require("../core/db")
const CryptoJS = require("crypto-js")
const request = require("request")

const sendsms = async (to, body, autho) => {
  /* This request use nodejs request*/

  const url = `http://192.168.200.40/SBL_SMS/sendsms.php?u_name=standardbankagent&pass=std@123&msisdn=`
  // const url = encodeURI(enl)
  const sha256 = CryptoJS.HmacSHA256(JSON.stringify(body), to)
  const sl = CryptoJS.enc.Base64.stringify(sha256)

  const options = {
    method: "GET",
    url: `${url}${to}&msg_body=${body}&msg_in_id=${sl}`,
    headers: {
      "User-Agent": "request",
      "Access-Control-Allow-Origin": "*",
    },
  }
  // console.log(url)
  // console.log(options)
  await request(options, async (error, response) => {
    if (error) throw new Error(error)

    // console.log(response.body);
    let token = response.body
    // console.log(token);
    token = token.split(",")
    // console.log(token);
    await addsmslog(token[3], body, token[1], token[2], autho)
  })
}

const addsmslog = async (to, body, sucessid, hash, autho) => {
  sql = `begin TANBIN.p_sms_log(${to},'${body}','${sucessid}','Y','${hash}', '0','${autho}'); end;`

  try {
    await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return null
  }
  return true
}

const smslog = async () => {
  const sql = `SELECT MPHONE,OUT_MSG BODY,OUT_TIME TIME FROM TANBIN.TANBIN_OUTBOX WHERE STATUS = 'Y'
ORDER BY OUT_TIME DESC`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return null
  }
}
const syssmslog = async () => {
  const sql = `SELECT *
  FROM (  SELECT MPHONE,
                 IN_TIME,
                 OUT_MSG,
                 SSL_REF_NUM
            FROM AGENT_BANKING.OUTBOX
           WHERE STATUS = 'Y'
        ORDER BY IN_TIME DESC)
 WHERE ROWNUM <= 25`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in syssmslog" + e)
    return null
  }
}
const findsms = async (param) => {
  const sql = `SELECT *
  FROM (SELECT MPHONE,
                 IN_TIME,
                 OUT_MSG,
                 SSL_REF_NUM
            FROM AGENT_BANKING.OUTBOX
           WHERE STATUS = 'Y' and MPHONE = '${param}'
        ORDER BY IN_TIME DESC)
 WHERE ROWNUM <= 100`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log("Error in syssmslog" + e)
    return null
  }
}

module.exports = { sendsms, smslog, syssmslog, findsms }
