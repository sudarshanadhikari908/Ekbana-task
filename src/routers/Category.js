const express = require('express')
const jwt = require('jsonwebtoken')

const auth = require('../middleware/auth')
const Company_Category = require('../models/Category')

const router = new express.Router()


router.get('/api/category', auth,  async (req, res)=>{
    try{
        let {page, size} = req.query
        if(!page){
            page=1
        }
        if(!size){
            size = 10
        }
        const limit = parseInt(size)
        const skip = (page -1) * size


        const categories = await  Company_Category.find().limit(limit).skip(skip)
        res.send({
            page,
            size,
            data: categories
        })
    }catch(e){
        res.status(500).send()
    }
})


router.get('/api/category/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try{
const category = await  Company_Category.findById(_id)
if(!category){
    return res.status(404).send()
}
res.send(category)
    }
    catch(e){
        res.status(500).send()
    }
 

})




router.post('/api/category',auth,  async (req, res)=>{
    const category = new Company_Category(req.body)
    try{
        await category.save()
        res.status(201).send(category)

    }
    catch(e){
        await res.status(400).send(e)
    }
 
})
router.patch('/api/category/:id' ,auth, async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'updated']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update) )
    if (!isValidOperation){
        return res.status(400).send({error: "Invalid Updates"})
    }
    try{
        const category = await Company_Category.findById(req.params.id)
        updates.forEach((update)=>  category[update] = req.body[update])
        await category.save()

        if(!category){
            return res.status(404).send()
        }
        res.send(category)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/api/category/:id',auth, async (req, res)=>{
    try{
        const category = await Company_Category.findByIdAndDelete(req.params.id)
        if(!category){
            return res.status(404).send()
        }
        res.send(category)

    }catch(e){
        res.status(500).send()
    }
})

module.exports = router