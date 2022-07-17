const request = require("request")
require("dotenv").config()

const role = async (user) => {
    const options = {
        method: "POST",
        url: `${process.env.API + ':' + process.env.API_PORT + process.env.API_FOLDER}/login/role`,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: user,
        }),
    }
    return new Promise(async (resolve, reject) => {
        request(options, (err, request) => {
            if (err) {
                reject(err)
            } else {
                let data = request.body
                data = JSON.parse(data)
                if (request.statusCode == 404) {
                    reject(data.Error)
                } else {
                    resolve(data)
                }
            }
        })
    }).catch((err) => {
        console.log("Error From Role:" + err);
        return err
    })

}

/* * * * * * * * * * * * * * * * * 
           refresh_call        
* * * * * * * * * * * * * * * * */

const refresh_call = async (token) => {
    if (token != undefined) {
        const options = {
            method: "POST",
            url: `${process.env.API + ':' + process.env.API_PORT + process.env.API_FOLDER}/login/refresh`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token
            }),
        }

        return new Promise(async (resolve, reject) => {
            request(options, (err, request) => {
                if (err) {
                    console.log("refresh_call rejected call " + err);
                    reject(err)
                } else {
                    let data = request.body
                    // data = JSON.parse(data)
                    resolve(data)
                }
            })
        }).catch((err) => {
            console.log("Error From refresh_token:" + err);
            return err
        })
    } else {
        return "Incomplite Information"
    }


}
const logger = async (user, location, info) => {
    const options = {
        method: "POST",
        url: `${process.env.API + ':' + process.env.API_PORT + process.env.API_FOLDER}/log/add`,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: user,
            location: location,
            info: info,
        }),
    }
    return new Promise((resolve, reject) => {
        request(options, (err, request) => {
            if (err) {
                reject(err)
            } else {
                let data = request.body
                data = JSON.parse(data)
                if (request.statusCode == 404) {
                    reject(data.Error)
                } else {
                    resolve(data)
                }
            }
        })
    }).catch((err) => {
        console.log("Error From Role:" + err);
        return err
    })

}

module.exports = { role, logger, refresh_call }