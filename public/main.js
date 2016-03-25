console.log('v0.0.1')
var socket = io('http://127.0.0.1:3000')
socket.on('connect', function () {
  console.log('socket connected', socket)
})
document.getElementById('zone1').addEventListener('click', function (event) {
  socket.emit('zone', 'DERIVES_LATERALES')
  console.log('zone emmited')
}, false)

document.getElementById('zone2').addEventListener('click', function (event) {
  socket.emit('zone', 'PIED_DE_MAT')
  console.log('zone emmited')
}, false)
document.getElementById('on').addEventListener('click', function (event) {
  socket.emit('light', 255)
  console.log('light emmited on')
}, false)
document.getElementById('off').addEventListener('click', function (event) {
  socket.emit('light', 0)
  console.log('light emmited off')
}, false)
