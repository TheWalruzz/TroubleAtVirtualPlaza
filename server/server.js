// import our modules
var nodeStatic = require('node-static');
var http = require('http');
var port = 5858;

// create our file server config
var file = new nodeStatic.Server('.', {
    cache: 0,
    gzip: true,
    indexFile: 'index.html'
});

// create our basic server
http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port, function () {
    console.log('Static server launched on port ' + port);
});
