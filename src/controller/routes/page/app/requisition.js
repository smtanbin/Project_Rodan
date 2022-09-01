const { Router } = require("express")
require("dotenv").config()
const bodyParser = require("body-parser")
const cors = require("cors")
const router = Router()
const jwt_decode = require("jwt-decode")
const { roleCheck } = require("../../../../core/roles")
// Cors Config
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middlewares
router.use(cors(corsOptions))
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accepcact"
    )
    res.header("Access-Control-Allow-Methods", ["GET", "POST", "PATCH", "DELETE"])
    next()
})



router.get("/", async (req, res) => {
    const token = req.cookies.auth
    const { user } = jwt_decode(token)
    const data = await roleCheck(user)
    data.map(({ ROLE, USERNAME, ROOT }) => {
        res.locals = {
            userid: USERNAME,
            title: "Requisition",
        }
        const darkModeCon = req.cookies.darkmode
        res.render("./pages/requisition/index", {
            role: ROLE,
            userid: USERNAME,
            owner: ROOT,
            darkmode: darkModeCon,
        })
    })
})


module.exports = router