var socket = io('http://localhost:4000');
socket.on('connect', function () {

  console.log('socket connected', socket);
});
document.getElementById("zone1").addEventListener("click", function( event ) {

    socket.emit('zone', 'DERIVES_LATERALES');
    console.log('zone emmited');
  }, false);
