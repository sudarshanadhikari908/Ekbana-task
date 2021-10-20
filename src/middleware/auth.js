const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = async (req, res , next) =>{
  const authHeader =req.headers['authorization']
  const token = authHeader && authHeader.split(` `)[1]
  if(token === null) return res.sendStatus(401)
  jwt.verify(token, process.env.API_KEY, (err,user)=>{
      if (err) return res.sendStatus(403)
      req.user = user
      next()
  })
} 
module.exports = auth