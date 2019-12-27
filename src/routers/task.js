const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body, owner:req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks',auth, async (req, res) => {
    
    var sortBy = req.query.sortBy
    const match = {}
    const sort = {}

    if(req.query.completed) match.completed = req.query.completed === "true"
   
    if(sortBy){
        const parts = sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
        // const tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit) || 10,
                skip:parseInt(req.query.skip) || 0,
                // sort:{ [sortBy[0]]: sortBy[1] }
                sort
            }
            
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

router.get('/tasks.:id',auth, async (req, res) => {
    try {
        const tasks = await Task.find({_id: req.params.id, owner:req.user._id})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const task = await Task.findOne({_id:req.params.id, owner: req.user.id})
        
        if(!task){
            res.status(500).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {

    
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user.id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router