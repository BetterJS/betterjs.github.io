var server = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mime = require('./mime').types;

var port = 8082;

server.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = '.' + pathname;
    realPath += /\/$/.test(realPath) ? 'index.html' : '';
    fs.exists(realPath, function(exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/html;charset=utf-8'
            });
            response.end('404');
        }

        fs.readFile(realPath, function(err, file) {
            if (err) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.end('404');
            } else {
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'html';
                var contentType = mime[ext] || 'text/plain';
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.write(file);
                response.end();
            }
        });
    });
}).listen(port);

console.log('Server is listening port ' + port + '...');
