var Promise = require('bluebird');
var artnet = require('artnet')(options);

var options = {
    host: '192.168.1.95'
};

var plConf={
  uni:2,
  channels:{
    pan:1,
    fPan:2,
    tilt:3,
    fTilt:4,
    ptSpeed:5,
    dimmer:6,
    shutter:7,
    color:8,
    glb1:9,
    glb1R:10,
    glb2:11,
    focus:12,
    prism:13,
    prismR:14,
    iris:15,
    control:16
  },
  shCtrl:{
    open:5,
    close:0
  },
  colours:{
    white:0,
    red:7,
    orange:14,
    green:21,
    yellow:28,
    blue:35,
    cto:42,
    magenta:49,
    purple:56
  },
  irisRange:[0,63]
};
var d = {
  uni:plConf.uni,
  dP:plConf.channels.pan,
  dFP:plConf.channels.fPan,
  dT:plConf.channels.tilt,
  dFT:plConf.channels.fTilt,
  dim:plConf.channels.dimmer,
  shut:plConf.channels.shutter,
  shutO:plConf.shCtrl.open,
  shutC:plConf.shCtrl.close,
  f:plConf.channels.focus,
  c:plConf.colours
};

function setAllChan(val){
  var allChanArr =[];
  for (var i = 0; i < 16; i++) {
    allChanArr[i] = val;
  }
  return allChanArr;
}
//console.log(setAllChan(null));

var blankMsg=setAllChan(null);
var zeroMsg=setAllChan(0);
var fullMsg=setAllChan(255);

var setupMsg=[
  0,      // pan
  0,        // fine pan
  120,      // tilt
  0,        // fine Tilt
  0,      // pan tilt speed : 0 = MAXED !!!
  0,      // dimmer : half power
  255,      // shutter : no BLINK allowed
  0,        // color : white
  0,        // globo wheel 1
  0,        // globo wheel 1 rotation speed
  0,        // globo 2
  86,      // focus
  0,        // prism : disabled
  0,        // prism rotation
  35,       // iris width : wide opened
  0         // program : none
];

var dvc = {
  init:function(){
    artnet.set(2,1,setupMsg, function (err, res) {
      if (err){
        console.log('err',err);
        artnet.close();
      }
    });
  },
  pTo:function(pan,msg,cb){
    if(!msg){
      console.log('new message init');
      var msg= setAllChan(null);
    }
    if(Array.isArray(pan)===true){
      msg[0]=pan[0];
      msg[1]=pan[1];
    }
    else{
      msg[0]=pan[0];
    }

    return msg;
  },
  tTo:function(tilt,msg){
    if(!msg){
      console.log('new message init');
      var msg= setAllChan(null);
    }
    if(Array.isArray(tilt)===true){
      msg[2]=tilt[0];
      msg[3]=tilt[1];
    }
    else{
      msg[2]=tilt[0];
    }

    return msg;
  },
  ptTo:function(pan,tilt,msg){
    if(!msg){
      console.log('new message init');
      var msg= setAllChan(null);
    }
    msg = dvc.pTo(pan,msg);
    msg = dvc.tTo(tilt,msg);
    console.log(msg)
    return msg;
  }
}

console.log(dvc.ptTo([0,1],[3,4]));
// console.log(device.panTo([0,1]));
// console.log(blankMsg.length)




function resetDevice(){}

function initDevice(){
  artnet.set(2,1,setupMsg, function (err, res) {
    if (err){artnet.close();}
  });
}

/**
 * wrMsg : send dmx data to the artnet node
 * msg :[array] dmx info for all channel
 * device :[object] device controll chanel list, see plConf and d obj
 */
function wrMsg(msg,device){

}
wrMsg();

var http = require('http');
var static = require('node-static');
var path = require('path');
var file = new static.Server(path.join(process.cwd(), 'public'));
var httpServ = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
  });

var io = require('socket.io')(httpServ);
var port = 4000;
httpServ.listen(port);
console.log('webserver listening on port:', port);

io.on('connection', function (socket) {
  console.log('something connected',socket.id);
  socket.emit('ready', { hello: 'world' });
  socket.on('pos', function (data) {
    console.log(data);
    io.emit('pos:send',data);
  });
  socket.on('light', function (data) {
    console.log(data);
    io.emit('light:send',data);
  });
  socket.on('zone', function (data) {
    console.log(data);
    var zoneLine = 'zone:'+data;
    io.emit(zoneLine,data);
  });
});




// set channel 1 to 255 and disconnect afterwards.
artnet.set(2,1, 255, function (err, res) {
    //artnet.close();
});
