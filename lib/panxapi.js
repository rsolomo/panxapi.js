var util = require('util')
var request = require('request')
var xml2js = require('xml2js')
var querystring = require('querystring')
var parser = new xml2js.Parser()

module.exports = new Client
module.exports.Client = Client

function Client(options) {
  var options = options || {}
  this.hostname = options.hostname
  this.key = options.key
  this.api_url = '/api/?'
}

/*
 * Generate key
 * @public
 */
Client.prototype.keygen = function(options, callback) {
  var self = this
  var hostname = options.hostname || self.hostname
  var queryObj = {
    type : 'keygen',
    user : options.username,
    password : options.password
  }
  var _request = options.request || request
  var query = querystring.stringify(queryObj)
  var url = 'https://' + hostname + self.api_url + query

  if ( typeof options.username === 'undefined') {
    throw new Error('options.username is a required argument')
  }
  if ( typeof options.password === 'undefined') {
    throw new Error('options.password is a required argument')
  }
  if ( typeof hostname === 'undefined') {
    throw new Error('hostname should be defined')
  }

  _request(url, function(err, response, body) {
    var xml, key, status
    if (err) {
      return callback(err)
    } else if (response.statusCode >= 400) {
      err = new Error(response.statusCode)
      return callback(err)
    } else {
      parser.parseString(body, function(err, xml) {
        if (err) {
          return callback(err, null)
        }

        status = xml.response.$.status
        if (status === 'success') {
          key = xml.response.result[0].key[0]
          self.hostname = hostname
          self.key = key
          return callback(err, self.key)
        } else {
          err = new Error(body)
          return callback(err, key)
        }
      })
    }
  })
}
/*
 * @public
 */
Client.prototype.show = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }
  options.action = 'show'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.get = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }

  options.action = 'get'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.edit = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }
  if ( typeof options.element === 'undefined') {
    throw new Error('options.element is a required argument')
  }

  options.action = 'edit'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.set = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }
  if ( typeof options.element === 'undefined') {
    throw new Error('options.element is a required argument')
  }

  options.action = 'set'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.del = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }

  options.action = 'delete'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.rename = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }
  if ( typeof options.newname === 'undefined') {
    throw new Error('options.newname is a required argument')
  }

  options.action = 'rename'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.clone = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }
  if ( typeof options.newname === 'undefined') {
    throw new Error('options.newname is a required argument')
  }
  if ( typeof options.from === 'undefined') {
    throw new Error('options.newname is a required argument')
  }

  options.action = 'clone'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.move = function(options, callback) {
  if ( typeof options.xpath === 'undefined') {
    throw new Error('options.xpath is a required argument')
  }
  if ( typeof options.where === 'undefined') {
    throw new Error('options.where is a required argument')
  }
  if ( typeof options.dst === 'undefined') {
    throw new Error('options.dst is a required argument')
  }

  options.action = 'move'
  this.config(options, callback)
}
/*
 * @public
 */
Client.prototype.commit = function(options, callback) {
  if ( typeof options.cmd === 'undefined') {
    throw new Error('options.cmd is a required argument')
  }
  var _request = options.request || this.request
  delete options.request
  options.type = 'commit'
  var query = querystring.stringify(options) + '&key=' + this.key
  var url = 'https://' + this.hostname + this.api_url + query
  this.req(url, {
    request : _request
  }, function(err, xml) {
    return callback(err, xml)
  })
}
/*
 * @public
 */
Client.prototype.op = function(options, callback) {
  if ( typeof options.cmd === 'undefined') {
    throw new Error('options.cmd is a required argument')
  }
  var _request = options.request || this.request
  delete options.request
  options.type = 'op'
  var query = querystring.stringify(options) + '&key=' + this.key
  var url = 'https://' + this.hostname + this.api_url + query
  this.req(url, {
    request : _request
  }, function(err, xml) {
    return callback(err, xml)
  })
}
/*
 * @private
 */
Client.prototype.config = function(options, callback) {
  var _request = options.request || this.request
  delete options.request
  options.type = 'config'
  var query = querystring.stringify(options) + '&key=' + this.key
  var url = 'https://' + this.hostname + this.api_url + query
  this.req(url, {
    request : _request
  }, function(err, xml) {
    return callback(err, xml)
  })
}
/*
 * @private
 */
Client.prototype.req = function(url, options, callback) {
  var _req = options.request || request
  _req(url, function(err, response, body) {
    var xml, status
    if (err) {
      return callback(err, null)
    } else if (response.statusCode >= 400) {
      err = new Error(response.statusCode)
      return callback(err, null)
    } else {
      parser.parseString(body, function(err, xml) {
        if (err) {
          return callback(err, null)
        }

        status = xml.response.$.status
        if (status === 'success') {
          return callback(null, body)
        } else {
          err = new Error(body)
          return callback(err, null)
        }
      })
    }
  })
}