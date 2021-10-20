const express = require('express')
const multer = require('multer')
const sharp = require('sharp') 
const Company = require('../models/Company')
const auth = require('../middleware/auth')
const Category = require('../models/Category')



const router = new express.Router()


router.get('/api/company',auth,  async (req, res)=>{
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


        const companies = await  Company.find().limit(limit).skip(skip)
        res.send({
            page,
            size,
            data: companies
        })
    }catch(e){
        res.status(500).send()
    }
})

router.get('/api/company/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try{
const company = await  Company.findById(_id)

if(!company){
    return res.status(404).send()
}
await company.populate('cat_id').execPopulate()
res.send(company)
    }
    catch(e){
        res.status(500).send()
    }

})

router.post('/api/company',auth,  async (req, res)=>{
    const company = new Company({
        ...req.body,
        cat_id: req.category._id
    })
    try{
        await company.save()
        res.status(201).send(company)

    }
    catch(e){
        await res.status(400).send(e)
    }
})

router.patch('/api/company/:id' ,auth, async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'status', 'updated']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update) )
    if (!isValidOperation){
        return res.status(400).send({error: "Invalid Updates"})
    }
    try{
        const company = await Company.findById(req.params.id)
        updates.forEach((update)=>  company[update] = req.body[update])
        await company.save()

        if(!company){
            return res.status(404).send()
        }
        res.send(company)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/api/company/:id',auth, async (req, res)=>{
    try{
        const company = await Company.findByIdAndDelete(req.params.id)
        if(!company){
            return res.status(404).send()
        }
        res.send(company)

    }catch(e){
        res.status(500).send()
    }
})
const upload = multer({
    
    limits: {
        filesize: 2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})


router.post('/api/company/upload', auth, upload.single('image'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.company.images=buffer
    await req.company.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/api/company/upload', auth, async(req, res)=>{
    req.company.images = undefined
    await req.company.save()
    res.send()
})

router.get('/api/company/upload/:id', async(req, res)=>{
    try{

        const company = await Company.findById(req.params.id)
        if(!company || company.images){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(company.images)


    }catch(e){
        res.status(404).send()
    }
})


module.exports = router
