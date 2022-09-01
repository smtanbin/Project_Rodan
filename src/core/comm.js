
const CryptoJS = require("crypto-js");
const request = require('request');

/* This request use nodejs request*/

const sms_request = async (to,body) => {
        const url = `http://192.168.200.40/SBL_SMS/sendsms.php?u_name=standardbankagent&pass=std@123&msisdn=`
        const sha256 = CryptoJS.HmacSHA256(JSON.stringify(body), to);
        const sl = CryptoJS.enc.Base64.stringify(sha256);
    
    
        const options = {
                'method': 'GET',
                'url': `${url}${to}&msg_body=${body}&msg_in_id=${sl}`,
                'headers': {
            'User-Agent': 'request',
            'Access-Control-Allow-Origin': '*'
        }
      };
    //   console.log(options);
    await request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);

            
          });

    
    }
    
    /* this opeation use fatch*/

const smsx = async (to,body) => {
    setTimeout(()=> {return '1,2022050816404519526774234,v%2FgDngG7ma1%2Fxi%2FS2SJRsbLWjzrUqaoTRjYIDgjo8Kg%3D,8801611774234'
        }, 5000);
    }
 
 
     





module.exports = { sms }
