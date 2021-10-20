const express = require('express')

require('./db/mongoose')
const Company_Category = require('./models/Category')
const Company = require('./models/Company')
const companyRouter = require('./routers/Company')
const company_category = require('./routers/Category')
const user = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(companyRouter)
app.use(company_category)
app.use(user)



app.listen(port,()=>{
    console.log('Server is up on port' + port)
   

})