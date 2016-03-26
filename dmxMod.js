var webserver = require('./webserver')
var io = require('socket.io')(webserver)
var artNet = require('./artnet')



function init () {
  artNet.init()
  io.on('connection', function (socket) {
    socket.on('zone', function (data) {
      // dvc.lightOff()
      console.log(data)
      // io.emit(zoneLine,data)
    })
  })
  artNet.fade()
  webserver.listen(3000)
}

init()

