const app = require('../src/app')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')

const userOneId = mongoose.Types.ObjectId()
const userone = {
  _id: userOneId,
  name: 'afees',
  email: 'afees1@gmail.com',
  password: 'pass123',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany()
  await new User(userone).save()
})

test('checking user creation ', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'afeesudhn',
      email: 'afees@gmail.com',
      password: 'My1691981'
    }).expect(201)
})

test('checking login', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userone.email,
      password: userone.password
    }).expect(200)
})

test('checking login', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userone.email,
      password: '2345'
    }).expect(400)
})

test('checking getting profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)
})

test('un autherized', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('checking delete', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)
})

test('un autherized', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
