var panxapi = require('../lib/panxapi')
var libxmljs = require('libxmljs')
var assert = require('assert')
var client

describe('panxapi', function() {
  beforeEach(function() {
    client = new panxapi.Client()
    client.hostname = 'fakeHostname'
    client.key = 'fakeKey'
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
      assert.throws(function() {
        client.keygen({
          hostname : 'dummyHostname',
          password : 'dummyPassword',
          request : requestSuccess
        }, function() {
        })
      }, /options\.username/)
    })
    it('should throw an exception if options.password is not present', function() {
      assert.throws(function() {
        client.keygen({
          hostname : 'dummyHostname',
          username : 'dummyUsername',
          request : requestSuccess
        }, function() {
        })
      }, /options\.password/)
    })
    it('should throw an exception if the hostname is not defined', function() {
      var client = new panxapi.Client();
      assert.throws(function() {
        client.keygen({
          username : 'dummyUsername',
          password : 'dummyPassword',
          request : requestSuccess
        }, function() {
        })
      }, /hostname/)
    })
    it('should set key and hostname on success', function(done) {
      var callback = function(err, key) {
        assert.equal(client.hostname, 'dummy_hostname')
        assert.equal(client.key, 'wLdwbgfBxWZ%yj7y%2Bf=')
        done()
      }
      client.keygen({
        hostname : 'dummy_hostname',
        username : 'dummy_username',
        password : 'dummy_password',
        request : requestSuccess
      }, callback)
    })
    it('should return callback(null, key) on success with key.', function(done) {
      var callback = function(err, key) {
        assert.equal(null, err)
        assert.equal(key, 'wLdwbgfBxWZ%yj7y%2Bf=')
        done()
      }
      client.keygen({
        hostname : 'dummy_hostname',
        username : 'dummy_username',
        password : 'dummy_password',
        request : requestSuccess
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
      client.keygen({
        hostname : 'dummyHostname',
        username : 'dummyUsername',
        password : 'dummyPassword',
        request : request
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
      client.keygen({
        hostname : 'dummyHostname',
        username : 'dummyUsername',
        password : 'dummyPassword',
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
      client.keygen({
        hostname : 'dummy_host',
        username : 'dummy_username',
        password : 'dummy_password',
        request : request
      }, callback)
    })
  })
  describe('#config()', function() {
    it('should return callback(null, xml) on success', function(done) {
      var request = function(url, callback) {
        var body = '<response status="success"><result><entry>dummyentry</entry></result></response>'
        var err = null
        var response = {
          statusCode : 200
        }
        return callback(err, response, body)
      }
      var callback = function(err, xml) {
        assert.equal(err, null)
        assert.equal( typeof xml, 'string')
        done()
      }
      client.config({
        action : 'show',
        xpath : '/config',
        request : request
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
      client.config({
        action : 'show',
        xpath : '/config',
        request : request
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
      client.config({
        action : 'show',
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
      client.config({
        action : 'show',
        xpath : '/config',
        request : request
      }, callback)
    })
  })
  describe('#show()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.show({
        }, function() {
        })
      }, /xpath/)
    })
  })
  describe('#get()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.get({
        }, function() {
        })
      }, /xpath/)
    })
  })
  describe('#set()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.set({
          element : '<ip-netmask>1.1.1.1</ip-netmask>'
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if element is not present', function() {
      assert.throws(function() {
        client.set({
          xpath : '/config/devices/entry[@name=\'localhost.localdomain\']/vsys/entry[@name=\'vsys1\']/address/entry[@name=\'test\']'
        }, function() {
        })
      }, /element/)
    })
  })
  describe('#edit()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.edit({
          element : '<entry name="test"><ip-netmask>1.1.1.1</ip-netmask></entry>'
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if element is not present', function() {
      assert.throws(function() {
        client.edit({
          xpath : '/config/devices/entry[@name=\'localhost.localdomain\']/vsys/entry[@name=\'vsys1\']/address/entry[@name=\'test\']'
        }, function() {
        })
      }, /element/)
    })
  })
  describe('#del()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.del({
        }, function() {
        })
      }, /xpath/)
    })
  })
  describe('#rename()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.rename({
        }, function() { newname :'new_test'
        })
      }, /xpath/)
    })
    it('should throw an exception if newname is not present', function() {
      assert.throws(function() {
        client.rename({
          xpath : '/config/devices/entry[@name=\'localhost.localdomain\']/vsys/entry[@name=\'vsys1\']/address/entry[@name=\'test\']'
        }, function() {
        })
      }, /newname/)
    })
  })
  describe('#clone()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.clone({
          newname : 'new_test'
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if newname is not present', function() {
      assert.throws(function() {
        client.clone({
          xpath : '/config/devices/entry[@name=\'localhost.localdomain\']/vsys/entry[@name=\'vsys1\']/address/entry[@name=\'test\']'
        }, function() {
        })
      }, /newname/)
    })
  })
  describe('#move()', function() {
    it('should throw an exception if xpath is not present', function() {
      assert.throws(function() {
        client.move({
          where : 'after',
          dst : 'rule2'
        }, function() {
        })
      }, /xpath/)
    })
    it('should throw an exception if where is not present', function() {
      assert.throws(function() {
        client.move({
          xpath : '/config/devices/entry[@name=\'localhost.localdomain\']/vsys/entry[@name=\'vsys1\']/rulebase/security/rules/entry[@name=\'rule1\']',
          dst : 'rule2'
        }, function() {
        })
      }, /where/)
    })
    it('should throw an exception if dst is not present', function() {
      assert.throws(function() {
        client.move({
          xpath : '/config/devices/entry[@name=\'localhost.localdomain\']/vsys/entry[@name=\'vsys1\']/rulebase/security/rules/entry[@name=\'rule1\']',
          where : 'after'
        }, function() {
        })
      }, /dst/)
    })
  })
  describe('#commit()', function() {
    it('should throw an exception if cmd is not present', function() {
      assert.throws(function() {
        client.commit({
        }, function() {
        })
      }, /cmd/)
    })
    it('should return callback(null, xml) on success', function(done) {
      var request = function(url, callback) {
        var body = '<response status="success" code="19"><result><msg><line>Commit job enqueued with jobid 1</line></msg><job>5</job></result></response>'
        var err = null
        var response = {
          statusCode : 200
        }
        return callback(err, response, body)
      }
      var callback = function(err, xml) {
        assert.equal(err, null)
        assert.equal( typeof xml, 'string')
        done()
      }
      client.commit({
        cmd : '<commit></commit>',
        request : request
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
      client.commit({
        cmd : '<commit></commit>',
        request : request
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
      client.commit({
        cmd : '<commit></commit>',
        request : request
      }, callback)
    })
    it('should return callback(err) containing the response, if response status attribute value is not "success"', function(done) {
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
      client.commit({
        cmd : '<commit></commit>',
        request : request
      }, callback)
    })
  })
  describe('#op()', function() {
    it('should throw an exception if cmd is not present', function() {
      assert.throws(function() {
        client.op({
        }, function() {
        })
      }, /cmd/)
    })
    it('should return callback(null, xml) on success', function(done) {
      var request = function(url, callback) {
        var body = '<response status="success" code="19"><result><msg><line>Commit job enqueued with jobid 1</line></msg><job>5</job></result></response>'
        var err = null
        var response = {
          statusCode : 200
        }
        return callback(err, response, body)
      }
      var callback = function(err, xml) {
        assert.equal(err, null)
        assert.equal( typeof xml, 'string')
        done()
      }
      client.op({
        cmd : '<show><system><info></info></system></show>',
        request : request
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
      client.op({
        cmd : '<show><system><info></info></system></show>',
        request : request
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
      client.op({
        cmd : '<show><system><info></info></system></show>',
        request : request
      }, callback)
    })
    it('should return callback(err) containing the response, if response status attribute value is not "success"', function(done) {
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
      client.op({
        cmd : '<show><system><info></info></system></show>',
        request : request
      }, callback)
    })
  })
})