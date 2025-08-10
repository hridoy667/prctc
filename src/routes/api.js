const express = require('express')
const Usercontroller = require('../controllers/Usercontroller.js')

let router = express.Router()

router.post("/register",Usercontroller.register)
router.post("/login",Usercontroller.login)

module.exports = router;