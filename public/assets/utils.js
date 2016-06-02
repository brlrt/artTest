/* globals DEBUG, $ */
var DEBUG = true
var app = app || {}
app.version = 'v 0.0.7'

app.urlParam = function (name) {
  var results = new RegExp('[?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href)
  if (results) return results[1] || 0
}

app.debug = function (text) {
  $('.debug').html(text)
}

$('a').on('touchstart', function (event) {
  event.preventDefault()
  app.curlLink = $(this).attr('href')
  // window.location.href = $(this).attr('href')
  app.startTime = new Date()
  if (DEBUG) {
    app.debug($(this).attr('href') + app.curTime)
  }
})

$('a').on('touchend', function (event) {
  event.preventDefault()
  if (DEBUG) {
    app.curTime = new Date()
    var clickTime = app.curTime - app.startTime
    app.debug($(this).attr('href') + 'touch len = ' + clickTime)
  }
  window.location.href = $(this).attr('href')
})

app.debug(app.version)
