/*
 * This is an integration test suite. It attempts to apply several of the API
 * client's methods to a live firewall. A panxapi_test address object will be
 * created and modified.
 */

/*
 * The hostname, username, and password variables below should be changed.
 */
var hostname = '127.0.0.1'
var username = 'admin'
var password = 'admin'


var panxapi = require('panxapi')
var assert = require('assert')
var client = new panxapi.Client()
var completed = {
  keygen : false,
  set : false
}

describe('panxapi', function() {
  describe('#keygen()', function() {
    it('should return callback(null, key) on success with key.', function(done) {
      var callback = function(err, key) {
        assert.equal(err, null)
        assert.ok(key)
        console.log('\n' + key)
        done()
      }
      client.keygen({
        hostname : hostname,
        username : username,
        password : password
      }, callback)
    })
  })
  describe('#show()', function() {
    before(function(done) {
      while (!client.key);
      done()
    })
    it('should return callback(null, xml) on success', function(done) {
      var callback = function(err, xml) {
        if (err)
          throw err
        assert.equal(err, null)
        assert.ok(xml)
        console.log('\n' + xml)
        done()
      }
      client.show({
        xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='test']"
      }, callback)
    })
  })
  describe('#get()', function() {
    before(function(done) {
      while (!client.key);
      done()
    })
    it('should return callback(null, xml) on success', function(done) {
      var callback = function(err, xml) {
        assert.equal(err, null)
        assert.ok(xml)
        console.log('\n' + xml)
        done()
      }
      client.get({
        xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='test']"
      }, callback)
    })
  })
  describe('#set()', function() {
    before(function(done) {
      while (!client.key);
      completed.set = true
      done()
    })
    it('should return callback(null, xml) on success', function(done) {
      var callback = function(err, xml) {
        if (err)
          throw err
        assert.equal(err, null)
        assert.ok(xml)
        console.log('\n' + xml)
        done()
      }
      client.set({
        xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='test']",
        element : '<ip-netmask>1.3.2.4</ip-netmask>'
      }, callback)
    })
  })
  describe('#edit()', function() {
    before(function(done) {
      while (!client.key);
      while (!completed.set);
      done()
    })
    it('should return callback(null, xml) on success', function(done) {
      var callback = function(err, xml) {
        if (err)
          throw err
        assert.equal(err, null)
        assert.ok(xml)
        console.log('\n' + xml)
        done()
      }
      client.edit({
        xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='test']",
        element : '<entry name="test"><ip-netmask>1.1.1.1</ip-netmask></entry>'
      }, callback)
    })
  })
  describe('#op()', function() {
    before(function(done) {
      while (!client.key);
      done()
    })
    it('should return callback(null, xml) on success', function(done) {
      var callback = function(err, xml) {
        if (err)
          throw err
        assert.equal(err, null)
        assert.ok(xml)
        console.log('\n' + xml)
        done()
      }
      client.op({
        cmd : '<show><system><info></info></system></show>'
      }, callback)
    })
  })
  describe('#commit()', function() {
    before(function(done) {
      while (!client.key);
      done()
    })
    it('should return callback(null, xml) on success', function(done) {
      var callback = function(err, xml) {
        if (err)
          throw err
        assert.equal(err, null)
        assert.ok(xml)
        console.log('\n' + xml)
        done()
      }
      client.commit({
        cmd : '<commit></commit>'
      }, callback)
    })
  })
})