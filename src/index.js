const app = require('../src/app')
const port = process.env.PORT

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })



// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|pdf)$/)){
//            return cb (new Error('upload doc or pdf '))
//         }

//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res)=>{
//     res.send()
// },(error, req, res, next)=>{
//     res.status(400).send({error:error.message})
// }
// )

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()

// const Task = require('./models/task')
// const User = require('./models/user')
// const tasks = async ()=>{
//     const task =await Task.findOne({owner: '5debe2200e9fa750a9d768a8'})
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)
// }
// const users = async()=>{
//     const user = await User.findById('5debe2200e9fa750a9d768a8')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// users()
// tasks()

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

