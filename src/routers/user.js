const express = require('express')
var multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')


const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user, token })
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send()
    }

})

router.post('/users/logout',auth, async (req, res, next)=>{
    
    try{
        
        req.user.tokens = req.user.tokens.filter((token)=>{
        console.log(token.token !== req.token)
        return token.token !== req.token
    })
    await req.user.save()
    res.send()

    }catch(e){
        res.status(500).send()
    }

})

router.post('/users/logoutAll', auth, async (req, res, next)=>{
    try{

        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return (cb(new Error('Please upload JPEG, JPG, PNG format')))
        }
        cb(undefined, true)
    }
    
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async ( req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.file)
},(error, req , res, next)=>{
    res.status(400).send({error:error.message})
})

router.delete('users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(500).send(e.message)
    }
})

// router.patch('/upload', auth, upload.single('avatar'), async (req, res) => {
//     try{
//         req.user.avatar = undefined
//         req.user.avatar = req.file.buffer
//         await req.user.save()
//         res.send(req.user)

//     }catch(e){
//         res.status(500).send(e.message)
//     }
// })

router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user =await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        console.log(e)
        res.status(404).send(e.message)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
