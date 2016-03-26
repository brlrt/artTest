// rogue DMX controlled light config

var rogueInfo = {
  uni: 2,
  channels: {
    pan: 1,
    fPan: 2,
    tilt: 3,
    fTilt: 4,
    ptSpeed: 5,
    dimmer: 6,
    shutter: 7,
    color: 8,
    glb1: 9,
    glb1R: 10,
    glb2: 11,
    focus: 12,
    prism: 13,
    prismR: 14,
    iris: 15,
    control: 16
  },
  shCtrl: {
    open: 5,
    close: 0
  },
  colors: {
    white: 0,
    red: 7,
    orange: 14,
    green: 21,
    yellow: 28,
    blue: 35,
    cto: 42,
    magenta: 49,
    purple: 56
  },
  irisRange: [0, 63]
}

var baseMsg = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
baseMsg[6] = 255 // light




function pan (val, msg) {
  if (!msg) return console.error('you should provide a message')
  if (Array.isArray(val) === true) {
    msg[0] = val[0]
    msg[1] = val[1]
  } else {
    msg[0] = val
  }
  console.log(msg)
  return msg
}

function tilt (val, msg) {
  if (!msg) return console.error('you should provide a message')
  if (Array.isArray(val) === true) {
    msg[2] = val[0]
    msg[3] = val[1]
  } else {
    msg[0] = val
  }
  console.log(msg)
  return msg
}

function lightOn (val, msg) {
  if (!msg) return console.error('you should provide a message')
  msg[5] = val || 255
  msg[6] = 255
}

var rogue = {
  rogueInfo: rogueInfo,
  pan: pan,
  tilt: tilt,
  lightOn: lightOn
}

pan([20, 20], baseMsg)
tilt([10, 10], baseMsg)

module.export = rogue

