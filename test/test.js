var panxapi = require('../lib/panxapi')
var assert = require('assert')
var sinon = require('sinon')

describe('panxapi', function() {
  var client, panxapiTest
  beforeEach(function() {
    client = panxapi.createClient()
    client.hostname = 'tstHostname'
    panxapiTest = "/config/devices/entry/vsys/entry/address/entry[@name='panxapi.js_test']"
  })
  describe('#createClient', function() {
    it('should return a new Client', function() {
      var client1 = panxapi.createClient()
      var client2 = panxapi.createClient()
      assert.notEqual(client1, client2)
    })
  })
  describe('#keygen()', function() {
    var requestSuccess = function(url, callback) {
      var body = '<response status="success"><result><key>wLdwbgfBxWZ%yj7y%2Bf=</key></result></response>'
      var err = null
      var response = {
        statusCode : 200
      }
      return callback(err, response, body)
    }
    it('should throw an exception if options.username is not present', function() {
      client.rq = requestSuccess
      assert.throws(function() {
        client.keygen({
          hostname : 'tstHostname',
          password : 'tstPassword'
        }, function() {
        })
      }, /options\.username/)
    })
    it('should throw an exception if options.password is not present', function() {
      client.rq = requestSuccess
      assert.throws(function() {
        client.keygen({
          hostname : 'tstHostname',
          username : 'tstUsername'
        }, function() {
        })
      }, /options\.password/)
    })
    it('should throw an exception if the hostname is not defined', function() {
      client.hostname = undefined
      assert.throws(function() {
        client.keygen({
          username : 'tstUsername',
          password : 'tstPassword'
        }, function() {
        })
      }, /hostname/)
    })
    it('should set key and hostname on success', function(done) {
      client.rq = requestSuccess
      var callback = function(err, key) {
        assert.equal(client.hostname, 'tstHostname')
        assert.equal(client.key, 'wLdwbgfBxWZ%yj7y%2Bf=')
        done()
      }
      client.keygen({
        hostname : 'tstHostname',
        username : 'tstUsername',
        password : 'tstPassword'
      }, callback)
    })
    it('should return callback(null, key) on success with key.', function(done) {
      client.rq = requestSuccess
      var callback = function(err, key) {
        assert.equal(null, err)
        assert.equal(key, 'wLdwbgfBxWZ%yj7y%2Bf=')
        done()
      }
      client.keygen({
        hostname : 'tstHostname',
        username : 'tstUsername',
        password : 'tstPassword'
      }, callback)
    })
    it('should return callback(err) on failed response', function(done) {
      var callback = function(err) {
        assert.ok(err)
        done()
      }
      var request = function(url, callback) {
        var err = new Error()
        var response, body = null
        return callback(err, response, body)
      }
      client.rq = request
      client.keygen({
        hostname : 'tstHostname',
        username : 'tstUsername',
        password : 'tstPassword'
      }, callback)
    })
    it('should return callback(err) on 40x and 50x responses', function(done) {
      var callback = function(err) {
        assert.ok(err)
        done()
      }
      var request = function(url, callback) {
        var response = {
          statusCode : 500
        }
        var err, body = null
        return callback(err, response, body)
      }
      client.rq = request
      client.keygen({
        hostname : 'tstHostname',
        username : 'tstUsername',
        password : 'tstPassword',
        request : request
      }, callback)
    })
    it('should return an error containing the msg, if response status attribute value is not "success"', function(done) {
      var request = function(url, callback) {
        var body = '<response status="error"><result><msg>Authentication failed: Invalid username or password </msg></result></response>'
        var err = null
        var response = {
          statusCode : 200
        }
        return callback(err, response, body)
      }
      var callback = function(err, key) {
        assert.throws(function() {
          throw err
        }, /Authentication failed/)
        done()
      }
      client.rq = request
      client.keygen({
        hostname : 'tstHostname',
        username : 'tstUsername',
        password : 'tstPassword'
      }, callback)
    })
  })
  describe('#createUrl()', function() {
    var xpath
    before(function() {
      xpath = '/config/devices/entry/deviceconfig/system/hostname'
    })
    it('should return callback(null, xml) on success', function(done) {
      var request = function(url, callback) {
        var body = '<response status="success"><result><hostname>lab</hostname></result></response>'
        var err = null
        var response = {
          statusCode : 200
        }
        return callback(err, response, body)
      }
      var callback = function(err, xml) {
        assert.equal(err, null)
        assert.equal(typeof xml, 'string')
        done()
      }
      client.rq = request
      client.createUrl({
        action : 'show',
        xpath : xpath
      }, callback)
    })
    it('should return callback(err) on failed response', function(done) {
      var callback = function(err) {
        assert.ok(err)
        done()
      }
      var request = function(url, callback) {
        var err = new Error()
        var response, body = null
        return callback(err, response, body)
      }
      client.rq = request
      client.createUrl({
        action : 'show',
        xpath : xpath
      }, callback)
    })
    it('should return callback(err) on 40x and 50x responses', function(done) {
      var callback = function(err) {
        assert.ok(err)
        done()
      }
      var request = function(url, callback) {
        var response = {
          statusCode : 500
        }
        var err, body = null
        return callback(err, response, body)
      }
      client.rq = request
      client.createUrl({
        action : 'show',
        xpath : xpath,
        request : request
      }, callback)
    })
    it('should return an error containing the response, if response status attribute value is not "success"', function(done) {
      var request = function(url, callback) {
        var body = '<response status="unauth" code="16"><msg><line>Unauthorized request</line></msg></response>'
        var err = null
        var response = {
          statusCode : 200
        }
        return callback(err, response, body)
      }
      var callback = function(err, key) {
        assert.throws(function() {
          throw err
        }, /Unauthorized request/)
        done()
      }
      client.rq = request
      client.createUrl({
        action : 'show',
        xpath : xpath,
        request : request
      }, callback)
    })
  })
  describe('#show()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.show({}, function() {})
      }, /xpath/)
    })
  })
  describe('#get()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.get({}, function() {})
      }, /xpath/)
    })
    it('should call createUrl', function() {
      client.get({ xpath : panxapiTest })
      assert.ok(client.createUrl.called)
    })
  })
  describe('#set()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.set({
          element : '<ip-netmask>192.0.2.1</ip-netmask>'
        }, function() {})
      }, /xpath/)
    })
    it('should throw an exception if element is not present', function() {
      assert.throws(function() {
        client.set({
          xpath : panxapiTest
        }, function() {})
      }, /element/)
    })
    it('should call createUrl', function() {
      client.set({
        element : '<ip-netmask>192.0.2.1</ip-netmask>',
        xpath : panxapiTest
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#edit()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.edit({
          element : '<entry name="panxapi.js_test"><ip-netmask>192.0.2.1</ip-netmask></entry>'
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if element is not present', function() {
      assert.throws(function() {
        client.edit({
          xpath : panxapiTest
        }, function() {
        })
      }, /element/)
    })
    it('should call createUrl', function() {
      client.edit({
        element : '<entry name="panxapi.js_test"><ip-netmask>192.0.2.1</ip-netmask></entry>',
        xpath : panxapiTest
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#del()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.del({
        }, function() {
        })
      }, /xpath/)
    })
    it('should call createUrl', function() {
      client.del({
        element : '<entry name="panxapi.js_test"><ip-netmask>192.0.2.1</ip-netmask></entry>',
        xpath : panxapiTest
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#rename()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.rename({
        }, function() { newname :'panxapi.js_test_new'
        })
      }, /xpath/)
    })
    it('should throw an exception if newname is not present', function() {
      assert.throws(function() {
        client.rename({
          xpath : panxapiTest
        }, function() {
        })
      }, /newname/)
    })
    it('should call createUrl', function() {
      client.rename({
        newname : 'panxapi.js_test_new',
        xpath : panxapiTest
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#clone()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.clone({
          newname : 'panxapi.js_test_clone',
          from : panxapiTest
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if newname is not present', function() {
      assert.throws(function() {
        client.clone({
          xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address",
          from : panxapiTest,
        }, function() {
        })
      }, /newname/)
    })
    it('should throw an exception if from is not present', function() {
      assert.throws(function() {
        client.clone({
          xpath : panxapiTest,
          newname : 'panxapi.js_test_clone'
        })
      })
    })
    it('should call createUrl', function() {
      client.clone({
        newname : 'panxapi.js_test_new',
        from :  panxapiTest,
        xpath : panxapiTest
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#move()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.move({
          where : 'after',
          dst : 'panxapi.js_test_clone'
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if where is not present', function() {
      assert.throws(function() {
        client.move({
          xpath : panxapiTest,
          dst : 'rule2'
        }, function() {
        })
      }, /where/)
    })
    it('should throw an exception if dst is not present', function() {
      assert.throws(function() {
        client.move({
          xpath : panxapiTest,
          where : 'after'
        }, function() {
        })
      }, /dst/)
    })
    it('should call createUrl', function() {
      client.move({
        newname : 'panxapi.js_test_new',
        xpath : panxapiTest,
        where : 'after',
        dst : 'rule2'
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#commit()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if cmd is not present', function() {
      assert.throws(function() {
        client.commit({
        }, function() {
        })
      }, /cmd/)
    })
    it('should call createUrl', function() {
      client.commit({
        cmd : '<commit></commit>'
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
  describe('#op()', function() {
    beforeEach(function() {
      sinon.stub(client, 'createUrl')
    })
    it('should throw an exception if cmd is not present', function() {
      assert.throws(function() {
        client.op({
        }, function() {
        })
      }, /cmd/)
    })
    it('should call createUrl', function() {
      client.op({
        cmd : '<show><jobs><pending></pending></jobs></show>'
      }, function() {})
      assert.ok(client.createUrl.called)
    })
  })
})