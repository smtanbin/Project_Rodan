const { Router } = require("express")
const router = Router()
const jwt_decode = require("jwt-decode")
const { role, logger } = require("../../../controller")

router.get("/transfer", async (req, res) => {
    const darkModeCon = req.cookies.darkmode

    res.render("./pages/routing", {
        darkmode: darkModeCon,
    })
})


router.get("/chaque_req", async (req, res) => {
    res.locals = {
        title: "Pending Eft",
    }
    const darkModeCon = req.cookies.darkmode
    const token = req.cookies.auth
    const { username } = jwt_decode(token)
    await role(username).then((data) => {
        if (data === "Not Found" || data.error) {
            res.render("./pages/404").statusCode(404)
        } else {
            data.map(({ USERNAME, ROLE, ROOT }) => {
                const temp_userid = USERNAME
                const temp_role = ROLE
                const temp_owner = data.ROOT

                res.render("./pages/fund_mng/chaque_req", {
                    role: ROLE,
                    userid: USERNAME,
                    owner: ROOT,
                    darkmode: darkModeCon,
                })

            })
        }


    }).catch((e) => {
        console.log(e);
    }).finally(() => {
        logger(username, req.hostname + req.originalUrl, "Visited").catch((e) => {
            console.log("Loging error " + e);
        })
    })
})

router.get("/pendingbeftn", async (req, res) => {
    res.locals = {
        title: "Pending Eft",
    }
    const darkModeCon = req.cookies.darkmode
    const token = req.cookies.auth
    const { username } = jwt_decode(token)
    await role(username).then((data) => {
        if (data === "Not Found" || data.error) {
            res.render("./pages/404").statusCode(404)
        } else {
            data.map(({ USERNAME, ROLE, ROOT }) => {
                const temp_userid = USERNAME
                const temp_role = ROLE
                const temp_owner = data.ROOT

                res.render("./pages/fund_mng/pending_eft.ejs", {
                    role: ROLE,
                    userid: USERNAME,
                    owner: ROOT,
                    darkmode: darkModeCon,
                })

            })
        }


    }).catch((e) => {
        console.log(e);
    }).finally(() => {
        logger(username, req.hostname + req.originalUrl, "Visited").catch((e) => {
            console.log("Loging error " + e);
        })
    })
})









module.exports = router