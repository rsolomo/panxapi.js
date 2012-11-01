/*
 * This suite attempts to apply several of the API client's methods to a live
 * firewall. A panxapijs_test address object will be created and manipulated.
 * Using a lab/development firewall for testing is highly recommended.
 */

/*
 * The hostname, username, and password variables below should be changed.
 * Further modifications to this suite may be neccessary depending on your
 * environment.
 */
var hostname = '127.0.0.1'
var username = 'admin'
var password = 'admin'

var assert = require('assert')
var panxapi = require('../../lib/panxapi')
var panxapiTest = "/config/devices/entry/vsys/entry/address/entry[@name='panxapi.js_test']"
var panxapiTestClone = "/config/devices/entry/vsys/entry/address/entry[@name='panxapi.js_test_clone']"
var client = new panxapi.Client()

start()

function start() {
  console.log('#keygen response:')
  client.keygen({
    hostname : hostname,
    username : username,
    password : password
  }, op)
}

function op(err, key) {
  assert.ifError(err)
  console.log(key)
  console.log('\n#op response:')
  client.op({
    cmd : '<show><system><info></info></system></show>'
  }, set)
}

function set(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#set response:')
  client.set({
    xpath : panxapiTest,
    element : '<ip-netmask>192.0.2.1</ip-netmask>'
  }, clone)
}

function clone(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#clone response:')
  client.clone({
    xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address",
    from : panxapiTest,
    newname : 'panxapi.js_test_clone'
  }, get)
}

function get(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#get response:')
  client.get({
    xpath : panxapiTest,
    element : '<ip-netmask>192.0.2.1</ip-netmask>'
  }, edit)
}

function edit(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#edit response:')
  client.edit({
    xpath : panxapiTest,
    element : '<entry name="panxapi.js_test"><ip-netmask>192.0.2.2</ip-netmask></entry>'
  }, move)
}

function move(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#move response:')
  client.move({
    xpath : panxapiTest,
    where : 'after',
    dst : 'panxapi.js_test_clone'
  }, del)
}

function del(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#del response:')
  client.del({
    xpath : panxapiTest
  }, function() {
    client.del({
      xpath : panxapiTestClone
    }, commit)
  })
}

function commit(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#commit response:')
  client.commit({
    cmd : '<commit></commit>'
  }, show)
}

function show(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\n#show response:')
  client.show({
    xpath : "/config/devices/entry/deviceconfig/system/hostname"
  }, done)
}

function done(err, xml) {
  assert.ifError(err)
  console.log(xml)
  console.log('\nDone')
}
