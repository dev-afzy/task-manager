const app = require('../src/app')
const request = require('supertest')

test('checking user post router', async()=>{
    await request(app).post('/users').send({
        name:"afeesudhn",
        email:"afees@gmail.com",
        password:"My1691981"
    }).expect(201)
})