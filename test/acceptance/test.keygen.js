var settings = require('../../settings')
var panxapi = require('../../client')

describe('keygen', function() {
  it('should generate keys', function(done) {
    var client = panxapi.createPanClient(settings)
    client.keygen(function(err, xml, etree) {
      console.log('\n' + xml)
      done(err)
    })
  })
})