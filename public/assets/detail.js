/* global io $ _ */
var app = app || {}
var url = {}
var socket = io()
var isFixed = false
url.lang = app.urlParam('lang')
url.detail = app.urlParam('detail')
url.czone = app.urlParam('czone')
var zoneEvent = 'zone:' + url.detail
console.log(zoneEvent)

socket.on('ready', function () {
  console.log(url)
  console.log('socket connected')
  if (!url.czone) {
    console.log('regular zone')
    socket.emit('zone', url.detail)
  } else {
    console.log('custom zone')
    socket.emit('zone', url.czone)
  }
})

// socket.emit('zone', url.detail)

var pictArr = []
var curPict
var curCC
var panIndex = 0
var panoLen

var jsString = 'ajax/' + url.lang + '/' + url.detail + '.js'

$.getScript(jsString, function () {
  app.init()
  console.log('getscript called')
  if (pageInfo.hz === true) {
    $('.carrousel').addClass('hz')
  }
  $('.detailTitle').html(pageInfo.title)
  $('.detailTxt').html(pageInfo.txt)

  app.makePanoArr(pageInfo.imgs)
  app.initPano()
})

app.makePanoArr = function (imgObj) {
  // console.log(imgObj)
  _.each(imgObj, function (n, key) {
    // console.log(n, key)
    pictArr.push(n)
  })
}

app.initPano = function () {
  panoLen = pictArr.length
  // console.log('panoLen',panoLen)

  app.updateSlide()

  if (panoLen > 1) {
    // console.log('long Arr')
    app.initNav()
  }
// console.log(panoLen,curPict)
}

app.getSlide = function (index) {
  curPict = pictArr[index].url
  curCC = pictArr[index].cc
  curCap = pictArr[index].caption
}

app.updateSlide = function () {
  app.getSlide(panIndex)
  $('.carrouselCont').html('<img id="theImg" src="assets/hg/' + curPict + '" />').promise().done(function () {
    // console.log('yo')
    $('.carrouselCont').prepend('<span class="cc">' + curCC + '</span>')
    $('.carrTxt').html(curCap)
  })
}

app.initNav = function () {

  $('.carrControlCont').prepend('<div class="carrControls"><span class="carrBt prev"></span><span class="carrBt next"></span></div>').promise().done(function () {
    function prev () {
      app.debug('prev clicked')
      if (panIndex > 0) {
        console.log('panIndex', panIndex)
        --panIndex
        app.updateSlide(panIndex)
        console.log('panIndex', panIndex)
      } else {
        panIndex = panoLen - 1
        app.updateSlide(panIndex)
      }
    }

    function next () {
      app.debug('next clicked')
      if (panIndex === panoLen - 1) {
        console.log('panIndex', panIndex)
        panIndex = 0
        app.updateSlide(panIndex)
        console.log('panIndex', panIndex)
      } else {
        ++panIndex
        app.updateSlide(panIndex)
      }
    }

    if (isFixed === true) {
      $('.prev').click(function (event) {
        prev()
      })

      $('.next').click(function (event) {
        next()
      })
    }

    $('.prev').on('touchend', function (event) {
      prev()
    })

    $('.next').on('touchend', function (event) {
      next()
    })
  })
}

app.init = function () {
  var backURL = 'boat' + url.lang + '.html?lang=' + url.lang
  var btHtml = '<a class="backBt" href="' + backURL + '"></a>'
  $('.backBtCont').html(btHtml)
  app.debug('back Url' + backURL)
}
