'use strict'

const test = require('ava')
const platzigram = require('../')
const fixtures = require('./fixtures')
const nock = require('nock')

let options = {
  enpoints: {
    pictures: 'http://platzigram.test/picture',
    users: 'http://platzigram.test/user',
    auth: 'http://platzigram.test/auth'
  }
}

test.beforeEach(t => {
  t.context.client = platzigram.createClient(options)
})

test('client', t => {
  const client = t.context.client

  t.is(typeof client.getPicture, 'function')
  t.is(typeof client.savePicture, 'function')
  t.is(typeof client.likePicture, 'function')
  t.is(typeof client.listPictures, 'function')
  t.is(typeof client.listPicturesByTag, 'function')
  t.is(typeof client.saveUser, 'function')
  t.is(typeof client.getUser, 'function')
  t.is(typeof client.auth, 'function')
})

test('getPicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()

  nock(options.enpoints.pictures)
    .get(`/${image.publicId}`)
    .reply(200, image)

  let result = await client.getPicture(image.publicId)
  t.deepEqual(image, result)
})

test('savePicture', async t => {
  const client = t.context.client

  let token = 'xxx-xxx-xxx'
  let image = fixtures.getImage()
  let newImage = {
    src: image.url,
    description: image.description
  }

  nock(options.enpoints.pictures, {
    reqheaders: {
      'Authorization': `Bearer ${token}`
    }
  })
    .post('/', newImage)
    .reply(201, image)

  let result = await client.savePicture(newImage, token)
  t.deepEqual(image, result)
})

test('likePicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()
  image.liked = true
  image.likes = 1

  nock(options.enpoints.pictures)
    .post(`/${image.publicId}/like`)
    .reply(200, image)

  let result = await client.likePicture(image.publicId)
  t.deepEqual(image, result)
})

test('listPictures', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)

  nock(options.enpoints.pictures)
    .get(`/list`)
    .reply(200, images)

  let result = await client.listPictures()
  t.deepEqual(images, result)
})

test('listPicturesByTag', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)
  let tag = 'platzi'

  nock(options.enpoints.pictures)
    .get(`/tag/${tag}`)
    .reply(200, images)

  let result = await client.listPicturesByTag(tag)
  t.deepEqual(images, result)
})

test('saveUser', async t => {
  const client = t.context.client

  let user = fixtures.getUser()
  let newUser = {
    username: user.username,
    name: user.name,
    email: 'test@test.com',
    password: 'asd123'
  }

  nock(options.enpoints.users)
    .post(`/`, newUser)
    .reply(201, user)

  let result = await client.saveUser(newUser)
  t.deepEqual(user, result)
})

test('getUser', async t => {
  const client = t.context.client

  let user = fixtures.getUser()

  nock(options.enpoints.users)
    .get(`/${user.username}`)
    .reply(200, user)

  let result = await client.getUser(user.username)
  t.deepEqual(user, result)
})

test('AUTH', async t => {
  const client = t.context.client

  let credentials = {
    username: 'freddier',
    password: 'pl4tzi'
  }

  let token = 'xxx-xxx-xxx'

  nock(options.enpoints.auth)
    .post(`/`, credentials)
    .reply(200, token)

  let result = await client.auth(credentials.username, credentials.password)
  t.deepEqual(result, token)
})
