var et = require('elementtree')
var superagent = require('superagent')

exports.createPanClient = createPanClient

function createPanClient(opts) {
  return new PanClient(opts)
}

function PanClient(opts) {
  opts = opts || {}
  this.protocol = opts.protocol || 'https'
  this.key = opts.key
  this.api = opts.api || 'esp/restapi.esp'
  this.host = opts.host
  this.user = opts.user
  this.password = opts.password

  if (opts.port) {
    this.port = opts.port
  } else if (this.protocol === 'http') {
    this.port = 80
  } else {
    this.port = 443
  }
}

PanClient.prototype.keygen = function keygen(callback) {
  var self = this
  var url = this.protocol + '://' + this.host
    + ':' + this.port + '/' + this.api

  superagent
  .post(url)
  .query({ type : 'keygen', user : this.user, password : this.password })
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

function ok(res, etree) {
  if (!res.ok) return false
  if (!etree) return false
  if (etree.find('.').attrib.status !== 'success') return false
  return true
}