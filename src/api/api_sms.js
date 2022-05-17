const qurrythis = require("../core/db")
const CryptoJS = require("crypto-js")
const request = require("request")

const sendsms = async (to, body, autho) => {
  /* This request use nodejs request*/

  const enl = `http://192.168.200.40/SBL_SMS/sendsms.php?u_name=standardbankagent&pass=std@123&msisdn=`
  const url = encodeURI(enl)
  const sha256 = CryptoJS.HmacSHA256(JSON.stringify(body), to)
  const sl = CryptoJS.enc.Base64.stringify(sha256)

  console.log(url)
  //   const options = {
  //     method: "GET",
  //     url: `${url}${to}&msg_body=${enq}&msg_in_id=${sl}`,
  //     headers: {
  //       "User-Agent": "request",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   }
  //   console.log(options);
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
  const sql = `
    /* Formatted on 5/8/2022 4:13:43 PM (QP5 v5.381) */
 BEGIN
     INSERT INTO TANBIN.CUSTOM_OUTBOX (MPHONE,
                                   OUT_TIME,
                                   OUT_MSG,
                                   SSL_REF_NUM,
                                   STATUS,
                                   HASH,
                                   PRIORITY,AUTHO)
          VALUES (${to},
                  (SELECT SYSDATE FROM DUAL),
                  '${body}',
                  '${sucessid}',
                  'Y',
                  '${hash}',
                  '0','${autho}');
 
     COMMIT;
 END;`

  try {
    await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return null
  }
  return true
}

const smslog = async () => {
  const sql = `SELECT MPHONE,OUT_MSG BODY,OUT_TIME TIME FROM TANBIN.CUSTOM_OUTBOX WHERE STATUS = 'Y'
ORDER BY OUT_TIME`
  try {
    return await qurrythis(sql)
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = { sendsms, smslog }
