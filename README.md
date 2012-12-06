[![Build Status](https://travis-ci.org/rsolomo/panxapi.js.png)](https://travis-ci.org/rsolomo/panxapi.js)

# panxapi.js

panxapi.js is a simple [Node.js](http://nodejs.org/) client for Palo Alto Networks firewall API.

## Dependencies

 - PAN-OS 4.0 or greater
 - Node.js

## Installation

    npm install panxapi

## Getting started

Let's create a new client. You can optionally specify a hostname and key here.

    var panxapi = require('panxapi')
    
    var client = panxapi.createClient({hostname: 'example.com' key : 'key'})

An alternative is to generate the key based with a username and password.
The key will be set, and a callback function will execute once a response
has been recieved.

    var client = panxapi.createClient()
    
    client.keygen({
      hostname : 'example.com',
      username : 'admin',
      password : 'yourpass'
    }, function(err, key) {
      // Do more stuff here
    })

Once the client has a hostname and key set, we can then make use of the other
methods available.

    var client = panxapi.createClient({hostname: 'example.com', key : 'key'})
    
    client.show({xpath: '<show><system><info></info></system></show>'}, function(err, xml) {
      // Outputs xml response of 'show system info'
      console.log(xml)
    })

The parts of the Palo Alto API supported currently are:

- keygen
- commit
- op
- show
- get
- edit
- set
- delete (renamed to del)
- rename
- clone
- move

## Development
Run the following command, within the repository, to install dev dependencies.

    npm install

Then run the tests...

    make test

## Further reading

Reviewing Palo Alto's documentation on their API is recommended.

## License  

MIT