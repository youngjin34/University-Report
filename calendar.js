var http = require('http');
var urlm = require('url');
var qs = require('node:querystring'); // URL querysring의 해석하거나 formatting 할 수 있음
var path = require('path');
var mysql = require('mysql');
var template2 = require('./lib/template.js');
var db = require('./lib/dbs.js');
var calendar = require('./lib/topics.js');


var app = http.createServer(function (req, res) {
  var _url = req.url;
  var queryData = urlm.parse(_url, true).query;
  var pathname = urlm.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      calendar.home(res);
    } else {
      calendar.page(req, res);
    }
  } else if (pathname === '/create') {
      calendar.create(req, res);
  } else if (pathname === '/create_process') {
      calendar.create_process(req, res)
  } else if (pathname === '/update') {
      calendar.update(req, res);
  } else if (pathname === '/update_process') {
      calendar.update_process(req, res);
  } else if (pathname === '/delete_process') {
      calendar.delete_process(req, res);
  } else {
      res.writeHead(404);
      res.end("Not found");
  }
});
app.listen(3000);