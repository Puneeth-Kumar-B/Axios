const express = require('express')
const router = express.Router()
const user = require("../model/user")

const authController = require('../controller/user')

router.get("/", async(req, res) => {
    const allUsers = await user.find()
    return res.json(allUsers)
});
router.get('/:id', authController.getUser)
router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router