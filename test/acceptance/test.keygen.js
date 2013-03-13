var settings = require('../../settings')
var panxapi = require('../../client')

describe('keygen', function() {
  it('should generate keys', function(done) {
    var client = panxapi.createPanClient({
      host : settings.host
    })
    client.keygen(settings.user, settings.password, function(err, xml, etree) {
      console.log('\n' + xml)
      done(err)
    })
  })
})