var http = require('http')
var serveStatic = require('node-static')
var path = require('path')
var file = new serveStatic.Server(path.join(process.cwd(), 'public'))
var httpServ = http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume()
})

module.exports = httpServ

// httpServ.listen(port)
// console.log('webserver listening on port:', port)

