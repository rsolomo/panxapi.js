var http = require('http')
var assert = require('assert')
var express = require('express')
var panxapi = require('../client')

describe('createPanClient', function() {
  it('default api url should be esp/restapi.esp', function() {
    var client = panxapi.createPanClient()
    assert.equal(client.api, 'esp/restapi.esp')
  })

  it('default https port should be 443', function() {
    var client = panxapi.createPanClient({ protocol : 'https' })
    assert.equal(client.port, 443)
  })

  it('default http port should be 80', function() {
    var client = panxapi.createPanClient({ protocol : 'http' })
    assert.equal(client.port, 80)
  })

  it('default protocol should be https', function() {
    var client = panxapi.createPanClient()
    assert.equal(client.protocol, 'https')
    assert.equal(client.port, 443)
  })
})

describe('keygen', function() {
  var app, server, client
  beforeEach(function(done) {
    app = express()
    server = http.createServer(app)
    server.listen(function(err) {
      client = panxapi.createPanClient({
        host : '127.0.0.1',
        user : 'admin',
        password : 'admin',
        protocol : 'http',
        port : server.address().port
      })
      return done(err)
    })
  })

  afterEach(function(done) {
    server.close(done)
  })

  it('should set client.key to a decoded key on success', function(done) {
    var xml = '<response status="success"><result><key>'
      + 'as%24%26a)%23asdaui3'
      + '</key></result></response>'
    app.post('/esp/restapi.esp', function(req, res) {
      res.end(xml)
    })

    client.keygen(function(err, xml, etree) {
      assert.ifError(err)
      assert.equal(client.key, 'as$&a)#asdaui3')
      return done()
    })
  })

  it('should return (null, xml, elementtree) on success', function(done) {
    var xml = '<response status="success"><result><key>'
      + 'as%24%26a)%23asdaui3'
      + '</key></result></response>'
    app.post('/esp/restapi.esp', function(req, res) {
      res.end(xml)
    })

    client.keygen(function(err, _xml, etree) {
      assert.ifError(err)
      assert.equal(xml, xml)
      assert.equal(typeof etree.find, 'function')
      return done()
    })
  })

  it('if xml cannot be parsed, an Error should be returned', function(done) {
    app.post('/esp/restapi.esp', function(req, res) {
      res.end('asdf')
    })

    client.keygen(function(err, xml, etree) {
      assert.ok(err instanceof Error)
      return done()
    })
  })
})