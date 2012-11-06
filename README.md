# panxapi.js

panxapi.js is a simple [Node.js](http://nodejs.org/) client for Palo Alto Networks firewall API.

## Dependencies

 - PANOS 4.1 or greater
 - Node.js

## Installation

    npm install panxapi

## Getting started

We'll create a new client. You can optionally specify a hostname and key here.

    var panxapi = require('panxapi')
    
    var client = new panxapi.Client({hostname: 'example.com' key : 'key'})

An alternative is to generate the key based with a username and password.
The key will be set, and a callback function will execute once a response
has been recieved.

    var client = new panxapi.Client()
    
    client.keygen({
      hostname : 'example.com',
      username : 'admin',
      password : 'yourpass'
    }, function(err, key) {
      // Do more stuff here
    })

Once the client has a hostname and key set, we can then make use of the other
methods available.

    var client = new panxapi.Client({hostname: 'example.com', key : 'key'})
    
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

Copyright (c) 2012 Ray Solomon <<raybsolomon@gmail.com>>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.