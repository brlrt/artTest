require('dotenv').config()
var debug = require('debug')('artnet')
var options = {}
options.host = process.env.SERVER_IP || '127.0.0.1'
var artnet = require('artnet')(options)
var dvc = require('./devices/rogueMod')

var currMsg = dvc.dfltMsg
var pan = dvc.pan
var tilt = dvc.tilt
var lOn = dvc.lightOn
var lOff = dvc.lightOff


function testArtnet () {
  artnet.set(2, 1, [null], function (err, res) {
    if (err) {
      debug('arnet not found, check your configuration \n', err)
      return false
    // artnet.close()
    } else {
      debug('connected to the arnet server at', options.host)
      return true
    }
  })
}

function init () {
  testArtnet()
}

function wrt (msg) {
  artnet.set(2, 1, msg, function (err, res) {
    if (err) {
      debug('arnet not found', err)
    // artnet.close()
    } else {
      currMsg = msg
    }
  })
  return currMsg
}


function fade (from, to, chans) {
  var i = from || 0
  if (!to) to = 255

  var fadeInc = function () {
    
    if (i > to) {
      return clearInterval(interval)
    }
    wrt([i, i, i, i])
    debug('fade', i, currMsg)
    i++
  }
  var interval = setInterval(fadeInc, 500)
}

var aNet = {
  artnet: artnet,
  init: init,
  wrt: wrt,
  fade: fade
}

module.exports = aNet
