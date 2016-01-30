var artnet = require('artnet')(options);
var _ = require('lodash');
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
  colors:{
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
  c:plConf.colors
};

function setAllChan(val){
  var allChanArr =[];
  for (var i = 0; i < 16; i++) {
    allChanArr[i] = val;
  }
  return allChanArr;
}

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
  pTo:function(pan,msg){
    if(!msg){
      console.log('new message init pan');
      msg= blankMsg;
    }
    if(Array.isArray(pan)===true){
      msg[0]=pan[0];
      msg[1]=pan[1];
    }
    else{
      msg[0]=pan;
    }

    return msg;
  },
  tTo:function(tilt,msg){
    if(!msg){
      console.log('new message init tilt');
      msg= blankMsg;
    }
    if(Array.isArray(tilt)===true){
      msg[2]=tilt[0];
      msg[3]=tilt[1];
    }
    else{
      msg[2]=tilt;
    }

    return msg;
  },
  ptTo:function(pan,tilt,msg){
    if(!msg){
      console.log('new message init pan and tilt');
      msg= blankMsg;
    }
    msg = dvc.pTo(pan,msg);
    msg = dvc.tTo(tilt,msg);

    return msg;
  },
  cTo:function(color,msg){
    if(!msg){
      console.log('new message init color');
      msg= blankMsg;
    }
    var val = searchMat(d.c,color);
    msg[7]=val;

    return msg;
  },
  lightOn:function(val,msg){
    if(!msg){
      console.log('new message init light on');
      msg= blankMsg;
    }
    if(!val){
      val = 255;
    }
    msg[5]=val;
    return msg;
  },
  lightOff:function(msg){
    if(!msg){
      console.log('new message init light off');
      msg= blankMsg;
    }

    msg[5]=0;
    return msg;
  },
  focus:function(val,msg){
    if(!msg){
      console.log('new message init focus');
      msg= blankMsg;
    }

    msg[11]=val;
    return msg;
  },
  iris:function(val,msg){
    if(!msg){
      console.log('new message init iris');
      msg= blankMsg;
    }

    msg[14]=val;
    return msg;
  },
  reset:function(){
    return blankMsg;
  }
};


var DERIVES_LATERALES = {
  pan:[112,113],
  tilt:[114,115],
  color:'red',
  focus:100,
  iris:20
};

function setZone(z){
  var msg = dvc.ptTo(z.pan,z.tilt);
  msg = dvc.focus(z.focus,msg);
  msg = dvc.iris(z.iris,msg);
  msg = dvc.cTo(z.color,msg);
  setTimeout(function(){
    msg = dvc.lightOn(255,msg);
    console.log(msg);
    return msg;
  },1000);
}

// function test(c){
//   msg = dvc.ptTo([0,1],[3,4]);
//   msg = dvc.focus(100,msg);
//   msg = dvc.iris(20,msg);
//   msg = dvc.lightOn(120,msg);
//   console.log(msg);
//
// }
//test();
function searchMat (list, mat) {
  // console.log(list);
  var val = _.filter(list,function (v,k) {
    return k === mat;
  });
  return val[0];
}

// console.log(dvc.reset());
// console.log(dvc.iris(200));
// console.log(dvc.focus(200));
// console.log(dvc.lightOff());
// console.log(dvc.lightOn());
// console.log(dvc.lightOn(200));
// console.log(dvc.cTo('red'));
// console.log(dvc.ptTo([0,1],[3,4]));
// console.log(device.panTo([0,1]));
// console.log(blankMsg.length)







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
    console.log('da zone',data);
    var zoneLine = 'zone:'+data;
    setZone(DERIVES_LATERALES);
    // io.emit(zoneLine,data);
  });
});
