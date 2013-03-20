var et = require('elementtree')
var superagent = require('superagent')

exports.createPanClient = createPanClient
exports.PanClient = PanClient

function createPanClient(opts) {
  return new PanClient(opts)
}

function PanClient(opts) {
  if (! this instanceof PanClient) {
    return new PanClient(opts)
  }

  opts = opts || {}
  this.protocol = opts.protocol || 'https'
  this.key = opts.key
  this.api = opts.api || 'esp/restapi.esp'
  this.host = opts.host

  if (opts.port) {
    this.url = this.protocol + '://' + this.host
      + ':' + opts.port + '/' + this.api
  } else {
    this.url = this.protocol + '://' + this.host + '/' + this.api
  }
}

PanClient.prototype.keygen = function keygen(user, password, callback) {
  var self = this

  superagent
  .post(this.url)
  .query({ type : 'keygen', user : user, password : password })
  .buffer(true)
  .on('error', callback)
  .end(done)

  function done(res) {
    try {
      var etree = et.parse(res.text)
    } catch(err) {
      return callback(err, res.text, null)
    }

    if (ok(res, etree)) {
      var key = etree.findtext('./result/key')
      self.key = decodeURIComponent(key)
      return callback(null, res.text, etree)
    }
    return callback(new Error(res.text), res.text, null)
  }
}

PanClient.prototype.request = function request(params, callback) {
  params.key = this.key
  superagent
  .post(this.url)
  .query(params)
  .buffer(true)
  .on('error', callback)
  .end(done)

  function done(res) {
    try {
      var etree = et.parse(res.text)
    } catch(err) {
      return callback(err, res.text, null)
    }

    if (ok(res, etree)) {
      return callback(null, res.text, etree)
    }
    return callback(new Error(res.text), res.text, null)
  }
}

function ok(res, etree) {
  if (!res.ok) return false
  if (!etree) return false
  if (etree.find('.').attrib.status !== 'success') return false
  return true
}