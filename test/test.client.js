var http = require('http')
var assert = require('assert')
var express = require('express')
var panxapi = require('../client')

describe('createPanClient', function() {
  it('default api url should be esp/restapi.esp', function() {
    var client = panxapi.createPanClient({ host : '127.0.0.1' })
    assert.equal(client.api, 'esp/restapi.esp')
  })

  it('default protocol should be https', function() {
    var client = panxapi.createPanClient({ host : '127.0.0.1' })
    assert.equal(client.protocol, 'https')
  })

  it('url should not include port, if the port is not specified', function() {
    var client = panxapi.createPanClient({
      protocol : 'http',
      host : '127.0.0.1'
    })
    assert.equal(client.url, 'http://127.0.0.1/esp/restapi.esp')
  })
})

describe('keygen', function() {
  var app, server, client, user, password
  beforeEach(function(done) {
    user = 'admin'
    password = 'admin'
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

    client.keygen(user, password, function(err, xml, etree) {
      assert.ifError(err)
      assert.equal(client.key, 'as$&a)#asdaui3')
      return done()
    })
  })

  it('should return (null, xml, elementtree) on success', function(done) {
    var xml1 = '<response status="success"><result><key>'
      + 'as%24%26a)%23asdaui3'
      + '</key></result></response>'
    app.post('/esp/restapi.esp', function(req, res) {
      res.end(xml1)
    })

    client.keygen(user, password, function(err, xml, etree) {
      assert.ifError(err)
      assert.equal(xml1, xml)
      assert.equal(typeof etree.find, 'function')
      return done()
    })
  })

  it('should return an Error, if xml cannot be parsed', function(done) {
    app.post('/esp/restapi.esp', function(req, res) {
      res.end('asdf')
    })

    client.keygen(user, password, function(err, xml, etree) {
      assert.ok(err instanceof Error)
      return done()
    })
  })

  it('should return an Error, if status is not "success"', function(done) {
    var xml = '<response status="error"><result><msg>'
      + 'Authentication failed: Invalid username or password '
      + '</msg></result></response>'
    app.post('/esp/restapi.esp', function(req, res) {
      res.end(xml)
    })

    client.keygen(user, password, function(err, xml, etree) {
      assert.ok(err instanceof Error)
      return done()
    })
  })
})

describe('request', function() {
  var app, server, client, params
  beforeEach(function(done) {
    params = {
      type : 'config',
      action : 'get',
      xpath : '/config/devices/entry/deviceconfig/system/hostname'
    }
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

  it('should return (null, xml, elementtree) on success', function(done) {
    var xml1 = '<response status="success" code="19">'
      + '<result total-count="1" count="1">'
      + '<hostname>lab-firewall</hostname></result></response>'
    app.post('/esp/restapi.esp', function(req, res) {
      res.end(xml1)
    })

    client.request(params, function(err, xml, etree) {
      assert.ifError(err)
      assert.equal(xml1, xml)
      assert.equal(typeof etree.find, 'function')
      return done()
    })
  })

  it('should return an Error, if status is not "success"', function(done) {
    var xml = '<response status="error" code="403"><result><msg>'
      + 'User not authorized to perform this operation.'
      + '</msg></result></response>'
    app.post('/esp/restapi.esp', function(req, res) {
      res.end(xml)
    })

    client.request(params, function(err, xml, etree) {
      assert.ok(err instanceof Error)
      return done()
    })
  })
})