/*
 * This test suite attempts to apply several of the API client's methods to a
 * live firewall. Multiple panxapijs_test* address objects will be created
 * and manipulated. A commit will be executed during the test. Using a
 * lab/development firewall for testing is highly recommended.
 */

var program = require('commander')
var panxapi = require('../../lib/panxapi')
var panxapiTest = "/config/devices/entry/vsys/entry/address/entry[@name='panxapi.js_test']"
var client = panxapi.createClient()
var hostname, username, password

init()

function init() {
  console.log('\n'
    + 'This test suite attempts to apply several of the API client\'s methods to a\n'
    + 'live firewall. Multiple panxapijs_test* address objects will be created\n'
    + 'and manipulated. A commit will be executed during the test. Using a\n'
    + 'lab/development firewall for testing is highly recommended.\n')
  getHost()
}

function getHost() {
  program.prompt('Hostname: ', function(input) {
    hostname = input
    getUser()
  })
}

function getUser() {
  program.prompt('Username: ', function(input) {
    username = input
    getPass()
  })
}

function getPass() {
  program.password('Password: ', function(input) {
    password = input
    process.stdin.destroy()
    keygen()
  })
}

function keygen() {
  console.log('#keygen response:')
  client.keygen({
    hostname : hostname,
    username : username,
    password : password
  }, op)
}

function op(err, key) {
  if (err) console.error(err)
  console.log(key)
  console.log('\n#op response:')
  client.op({
    cmd : '<show><system><info></info></system></show>'
  }, set)
}

function set(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#set response:')
  client.set({
    xpath : panxapiTest,
    element : '<ip-netmask>192.0.2.1</ip-netmask>'
  }, clone)
}

function clone(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#clone response:')
  client.clone({
    xpath : "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address",
    from : panxapiTest,
    newname : 'panxapi.js_test_clone'
  }, rename)
}

function rename(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\#rename response:')
  client.rename({
    xpath : "/config/devices/entry/vsys/entry/address/entry[@name='panxapi.js_test_clone']",
    newname : 'panxapi.js_test_rename'
  }, get)
}

function get(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#get response:')
  client.get({
    xpath : panxapiTest,
    element : '<ip-netmask>192.0.2.1</ip-netmask>'
  }, edit)
}

function edit(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#edit response:')
  client.edit({
    xpath : panxapiTest,
    element : '<entry name="panxapi.js_test"><ip-netmask>192.0.2.2</ip-netmask></entry>'
  }, move)
}

function move(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#move response:')
  client.move({
    xpath : panxapiTest,
    where : 'after',
    dst : 'panxapi.js_test_rename'
  }, del)
}

function del(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#del response:')
  client.del({
    xpath : panxapiTest
  }, function() {
    client.del({
      xpath : "/config/devices/entry/vsys/entry/address/entry[@name='panxapi.js_test_rename']"
    }, commit)
  })
}

function commit(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#commit response:')
  client.commit({
    cmd : '<commit></commit>'
  }, show)
}

// Using relative xpath for #show to allow 4.0 support
function show(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#show response:')
  client.show({
    xpath : 'devices/entry/deviceconfig/system/hostname'
  }, report)
}

function report(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\n#report response:')
  client.report({
    reporttype : 'dynamic',
    reportname : 'acc-summary'
  }, done)
}

function done(err, xml) {
  if (err) console.error(err)
  console.log(xml)
  console.log('\nDone')
}
