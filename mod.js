console.log('mod.js v0.0.1')
require('dotenv').config()
var _ = require('lodash')

var options = {}
options.host = process.env.SERVER_IP || '127.0.0.1'
// host: '192.168.1.95'
var port = process.env.WEBP || 3000

console.log('env', process.env.NODE_ENV, ' host :', options.host)

var artnet = require('artnet')(options)

var z = require('./zones')

var plConf = require('./devices/rogue')

var timer
var timerDur = 10000


function setAllChan (val) {
  var allChanArr = []
  for (var i = 0; i < 16; i++) {
    allChanArr[i] = val
  }
  return allChanArr
}
var blankMsg = setAllChan(null)
var zeroMsg = setAllChan(0)
// var fullMsg = setAllChan(255)
var currMsg = blankMsg

var setupMsg = [
  0, // 01 pan
  0, // 02 fine pan
  120, // 03 tilt
  0, // 04 fine Tilt
  0, // 05 pan tilt speed : 0 = MAXED !!!
  0, // 06dimmer : half power
  255, // 07 shutter : no BLINK allowed
  0, // 08 color : white
  0, // 09globo wheel 1
  0, // 10 globo wheel 1 rotation speed
  0, // 11 globo 2
  86, // 12 focus
  0, // 13 prism : disabled
  0, // 14 prism rotation
  0, // 15 iris width : wide opened
  0 // 16 program : none
]

var dvc = {
  init: function () {
    artnet.set(2, 1, setupMsg, function (err, res) {
      if (err) {
        console.log('arnet not found', err)
      // artnet.close()
      } else {
        console.log('arnet init res', res)
      }
      return setupMsg
    })

  },
  reset: function () {
    return blankMsg
  }
}

// function zL () {
//   artnet.set(1, 255, function (err, res) {
//     // artnet.close()
//   })
// }

// var DERIVES_LATERALES = {
//   pan:[112,113],
//   tilt:[114,115],
//   color:'red',
//   focus:100,
//   iris:20
// }



function testArtnet (cb) {
  artnet.set(2, 1, setupMsg, function (err, res) {
    if (err) {
      console.log('arnet not found, check your configuration \n', err)
    // artnet.close()
    } else {
      console.log('connected to the arnet server at', options.host)
    }
  })
}
testArtnet()
// console.log(dvc.reset())
// console.log(dvc.iris(200))
// console.log(dvc.focus(200))
// console.log(dvc.lightOff())
// console.log(dvc.lightOn())
// console.log(dvc.lightOn(200))
// console.log(dvc.cTo('red'))
// console.log(dvc.ptTo([0,1],[3,4]))
// console.log(device.panTo([0,1]))
// console.log(blankMsg.length)

/**
 * wrMsg : send dmx data to the artnet node
 * msg :[array] dmx info for all channel
 * device :[object] device controll chanel list, see plConf and d obj
 */
function wrMsg (msg) {
  artnet.set(2, 1, msg, function (err, res) {
    if (err) {
      console.log('arnet not found', err)
    // artnet.close()
    } else {
      currMsg = msg
    }
  })
}

var http = require('http')
var serveStatic = require('node-static')
var path = require('path')
var file = new serveStatic.Server(path.join(process.cwd(), 'public'))
var httpServ = http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume()
})

function sleepTimer (timer, duration, msg) {
  clearTimeout(timer)
  timer = setTimeout(function(){
    dvc.lightOff(msg)
  },duration)
}

var io = require('socket.io')(httpServ)
httpServ.listen(port)
console.log('webserver listening on port:', port)

io.on('connection', function (socket) {
  console.log('something connected', socket.id)
  socket.emit('ready', { hello: 'world' })
  socket.on('pos', function (data) {
    console.log(data)
    io.emit('pos:send', data)
  })
  socket.on('light', function (data) {
    console.log(data)
    if (data === 0) {
      console.log('lightoff currmsg', currMsg)
      return dvc.lightOff(currMsg)
    } else {
      dvc.lightOn(data, currMsg)
    }
  // console.log('currmsg',currMsg)
  // io.emit('light:send',data)
  })
  socket.on('zone', function (data) {
    // dvc.lightOff()
    setZone(searchZone(z, data))
  // io.emit(zoneLine,data)
  })
})
