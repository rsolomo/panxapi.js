var settings = require('../../settings')
var panxapi = require('../../client')

describe('request', function() {
  it('should generate an api request, that returns a hostname', function(done) {
    var client = panxapi.createPanClient(settings)
    var params = {
      type : 'config',
      action : 'get',
      xpath : '/config/devices/entry/deviceconfig/system/hostname'
    }
    client.keygen(function() {
      client.request(params, function(err, xml, etree) {
        console.log('\n' + xml)
        done(err)
      })
    })
  })
})
