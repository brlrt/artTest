require('dotenv').config()
var debug = require('debug')('main')
var webserver = require('./webserver')
var io = require('socket.io')(webserver)
var artNet = require('./artnet')
var wrt = artNet.wrt
var port = process.env.WEBP || 3000


function init () {
  artNet.init()
  io.on('connection', function (socket) {
    socket.on('zone', function (data) {
      // dvc.lightOff()
      console.log(data)
      // io.emit(zoneLine,data)
    })
  })
  // artNet.fade()
  webserver.listen(port)
  console.log('webserver spawned, listening to port', port)
}

init()

