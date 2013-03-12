var assert = require('assert')
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