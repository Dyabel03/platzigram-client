'use strict'

const request = require('request-promise')
const Promise = require('bluebird')

class Client {
  constructor (options) {
    this.options = options || {
      enpoints: {
        pictures: 'http://platzigram.com/picture',
        users: 'http://platzigram.com/user',
        auth: 'http://platzigram.com/auth'
      }
    }
  }

  getPicture (id, callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.enpoints.pictures}/${id}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  savePicture (picture, token, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.enpoints.pictures}/`,
      body: picture,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  likePicture (id, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.enpoints.pictures}/${id}/like`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  listPictures (callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.enpoints.pictures}/list`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  listPicturesByTag (tag, callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.enpoints.pictures}/tag/${tag}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  saveUser (user, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.enpoints.users}/`,
      body: user,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  getUser (username, callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.enpoints.users}/${username}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  auth (username, password, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.enpoints.auth}/`,
      body: {
        username,
        password
      },
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }
}

module.exports = Client
