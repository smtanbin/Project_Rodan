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

module.exports = { role, logger }