const { oradb } = require("./db/oradb")
const CryptoJS = require("crypto-js")
const request = require("request")

const sendsms = (to, body, username) => {
  return new Promise(async (resolve, reject) => {
    /* This request use nodejs request*/
    const url = `http://192.168.200.40/SBL_SMS/sendsms.php?u_name=standardbankagent&pass=std@123&msisdn=`
    const enbody = encodeURI(body)
    let hash = CryptoJS.SHA3(JSON.stringify(body + to + username), { outputLength: 256 })
    hash = hash.toString(CryptoJS.enc.Base64)
    hash = hash.toString(CryptoJS.enc.Hex)


    const options = {
      method: "GET",
      url: `${url}${to}&msg_body=${enbody}&msg_in_id=${hash}`,
      headers: {
        "User-Agent": "request",
        "Access-Control-Allow-Origin": "*",
      },
    }

    await request(options, async (error, response) => {
      if (error) {
        console.error(error)
        reject(false)
      }
      let token = response.body
      token = token.split(",")
      console.log("Massage sent to " + token[3] + " Delevery Code: " + token[1] + "Hash: " + token[2]);
      await addsmslog(token[3], body, token[1], token[2], username).then((payload) => {
        resolve(token[3])
      })

    })

  }).catch((err) => { reject({ "contact": to } + err) })
}



const addsmslog = (to, body, sucessid, hash, autho) => {
  return new Promise(async (resolve, reject) => {
    sql = `begin TANBIN.p_sms_log(${to},'${body}','${sucessid}','Y','${hash}', '0','${autho}'); end;`
    await oradb(sql).then(() => { resolve(true) }).catch((err) => {
      reject(false)
    })
  })
}

const smslog = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT MPHONE,OUT_MSG BODY,OUT_TIME TIME FROM TANBIN.TANBIN_OUTBOX WHERE STATUS = 'Y'
ORDER BY OUT_TIME DESC`
    await oradb(sql).then((data) => {
      resolve(data)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
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
    return await oradb(sql)
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
    return await oradb(sql)
  } catch (e) {
    console.log("Error in syssmslog" + e)
    return null
  }
}

module.exports = { sendsms, smslog, syssmslog, findsms }
