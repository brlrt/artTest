function MakeSocket (server) {
  console.log('creating socket')
  var io = require('socket.io')(server)

  io.on('connection', function (socket) {
    socket.on('zone', function (data) {
      // dvc.lightOff()
      console.log(data)
      // io.emit(zoneLine,data)
    })
  })
  return io
}

module.exports = MakeSocket
