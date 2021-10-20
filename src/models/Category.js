
const mongoose = require('mongoose')
const validator = require('validator')

const categorySchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true
       
    },
 

},{
    timestamps: true
})
// categorySchema.virtual('companies',{
//     ref:'Company',
//     localField: '_id',
//     // foreignField: 'cat_id'
// })

const Company_Category = mongoose.model('Category', categorySchema)


module.exports = Company_Category