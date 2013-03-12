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