const express = require('express')
const Usercontroller = require('../controllers/Usercontroller.js')

let router = express.Router()

router.post("/register",Usercontroller.register)
router.post("/login",Usercontroller.login)
router.put("/updateuser/:id",Usercontroller.updateUserName)
router.delete("/deleteuser/:id",Usercontroller.deleteUser)

module.exports = router;