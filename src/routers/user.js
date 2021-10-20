const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/login', (req, res)=>{
   
    const username = req.body.username
 
    const user= {name: username}
    const accessToken =jwt.sign(user, process.env.API_KEY)
    res.json({accessToken: accessToken})
})


module.exports = router