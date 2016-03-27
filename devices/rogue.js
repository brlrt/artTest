// rogue DMX controlled light config
module.exports = {
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
