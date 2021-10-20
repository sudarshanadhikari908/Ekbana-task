const mongoose = require('mongoose')
const validator = require('validator')




const companySchema = new mongoose.Schema ({

    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
        
      },
      title:{
          type: String,
          required: true
      },
      description:{
          type: String,
          
      },
      status:{
          type: Boolean
      },
      images:{
          type: Buffer
      }
    
},{
    timestamps: true
})


const Company = mongoose.model('Company', companySchema)

module.exports = Company