var util = require('util')
var request = require('request')
var xml2js = require('xml2js')
var querystring = require('querystring')
var parser = new xml2js.Parser()

module.exports = Client
module.exports.createClient = createClient

/**
 * Creates a new Client
 * @constructor
 * @param {String} [options.hostname]
 * @key {String} [options.key]
 * @public 
 */
function Client(options) {
  if (! this instanceof Client) {
    return new Client
  }
  
  var options = options || {}
  this.hostname = options.hostname
  this.key = options.key
  this.protocol = 'https://'
  this.api_url = '/api/?'
}

function createClient(options) {
  return new Client(options)
}

/**
 * Generate key
 * @param options
 * @param {String} options.username
 * @param {String} [options.hostname] 
 * @param {String} options.password
 * @param {Function} callback
 * @return {Function}
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
  var rq = options.request || request
  var query = querystring.stringify(queryObj)
  var url = self.protocol + hostname + self.api_url + query

  if (typeof options.username === 'undefined') {
    throw new TypeError('options.username is a required argument')
  }
  if (typeof options.password === 'undefined') {
    throw new TypeError('options.password is a required argument')
  }
  if (typeof hostname === 'undefined') {
    throw new TypeError('hostname should be defined')
  }

  rq(url, function(err, response, body) {
    if (err) {
      return callback(err)
    } 
    if (response.statusCode >= 400) {
      err = new Error(response.statusCode)
      return callback(err)
    }

    parser.parseString(body, function(err, xml) {
      if (err) {
        return callback(err, null)
      }
      if (xml.response.$.status !== 'success') {
        err = new Error(body)
        return callback(err, xml)
      }

      self.hostname = hostname
      self.key = xml.response.result[0].key[0]
      return callback(err, self.key)
    })
  })
}

/**
 * Shows running configuration element
 * @param {String} options.xpath
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.show = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }

  options.action = 'show'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Shows candidate configuration element
 * @param {String} options.xpath
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.get = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }

  options.action = 'get'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Edit configuration element
 * @param {String} options.xpath
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.edit = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }
  if (typeof options.element === 'undefined') {
    throw new TypeError('options.element is a required argument')
  }

  options.action = 'edit'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Create configuration element
 * @param {String} options.xpath
 * @param {String} options.element
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.set = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }
  if (typeof options.element === 'undefined') {
    throw new TypeError('options.element is a required argument')
  }

  options.action = 'set'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Delete configuration element
 * @param {String} options.xpath
 * @public
 */
Client.prototype.del = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }

  options.action = 'delete'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Rename configuration element
 * @param {String} options.xpath
 * @param {String} options.newname
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.rename = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }
  if (typeof options.newname === 'undefined') {
    throw new TypeError('options.newname is a required argument')
  }

  options.action = 'rename'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Copy configuration element
 * @param {String} options.xpath
 * @param {String} options.newname
 * @param {String} options.from
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.clone = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }
  if (typeof options.newname === 'undefined') {
    throw new TypeError('options.newname is a required argument')
  }
  if (typeof options.from === 'undefined') {
    throw new TypeError('options.newname is a required argument')
  }

  options.action = 'clone'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Move configuration element
 * @param {String} options.xpath
 * @param {String} options.where
 * @param {String} options.dst
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.move = function(options, callback) {
  if (typeof options.xpath === 'undefined') {
    throw new TypeError('options.xpath is a required argument')
  }
  if (typeof options.where === 'undefined') {
    throw new TypeError('options.where is a required argument')
  }
  if (typeof options.dst === 'undefined') {
    throw new TypeError('options.dst is a required argument')
  }

  options.action = 'move'
  options.type = 'config'
  this.createUrl(options, callback)
}

/**
 * Commit configuration
 * @param {String} options.cmd
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.commit = function(options, callback) {
  if (typeof options.cmd === 'undefined') {
    throw new TypeError('options.cmd is a required argument')
  }

  options.type = 'commit'
  this.createUrl(options, callback)
}

/**
 * Run operation command
 * @param {String} options.cmd
 * @param {Function} callback
 * @return {Function}
 * @public
 */
Client.prototype.op = function(options, callback) {
  if (typeof options.cmd === 'undefined') {
    throw new TypeError('options.cmd is a required argument')
  }

  options.type = 'op'
  this.createUrl(options, callback)
}

/**
 * @private
 */
Client.prototype.createUrl = function(options, callback) {
  var rq = options.request || request
  delete options.request
  var query = querystring.stringify(options) + '&key=' + this.key
  var url = this.protocol + this.hostname + this.api_url + query
  this.req(url, {
    request : rq
  }, function(err, xml) {
    return callback(err, xml)
  })
}

/**
 * @private
 */
Client.prototype.req = function(url, options, callback) {
  var rq = options.request || request
  rq(url, function(err, response, body) {
    if (err) {
      return callback(err, null)
    } 
    if (response.statusCode >= 400) {
      err = new Error(response.statusCode)
      return callback(err, null)
    }

    parser.parseString(body, function(err, xml) {
      if (err) {
        return callback(err, null)
      }
      if (xml.response.$.status !== 'success') {
        err = new Error(body)
        return callback(err, null)
      }

      return callback(null, body)
    })
  })
}