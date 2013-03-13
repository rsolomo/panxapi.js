[![Build Status](https://travis-ci.org/rsolomo/panxapi.js.png)](https://travis-ci.org/rsolomo/panxapi.js)

# panxapi.js

panxapi.js is a simple [Node.js](http://nodejs.org/) client for Palo Alto Networks firewall API.

## Usage

A key can be specified, during creation of the client like this:

```javascript

var client = panxapi.createPanClient({
  host : 'firewall.example.com',
  key : 'yourkey',    // optional
  protocol : 'https'  // optional
})

```

Or it can be generated with the keygen method:

```javascript

var client = panxapi.createPanClient({
  host : 'firewall.example.com'
})

client.keygen('username', 'password', function(err, xml, etree) {
  if (err) throw err
  console.log(client.key) // outputs URI decoded key
  console.log(xml)        // outputs XML
})

```

In addition to the XML response, an [elementtree](https://github.com/racker/node-elementtree) object is provided as a
convenience.

Once the client has a key, you can make further API requests. You'll want to
review the vendor's documentation for more info on the parameters, but here is
an example of retrieving the hostname for a firewall's configuration :

```javascript
// ... remember to create the client and set the key first ...

var params = {
  type : 'config',
  action : 'get',
  xpath : '/config/devices/entry/deviceconfig/system/hostname'
}

client.request(params, function(err, xml, etree) {
  console.log(xml)  // outputs XML response
})

```

## Installation

    $ npm install panxapi

## Running tests

Most of the test can be run with:

    $ npm test

Running the acceptance tests requires having access to a Palo Alto firewall
and having a filled settings.json similar to the example-settings.json.
Once you have that, you can run :

    $ mocha -R spec test/acceptance/*

## License  

MIT