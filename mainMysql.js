var http = require('http');
var urlm = require('url');
var qs = require('node:querystring');
var path = require('path');
var mysql = require('mysql');
var Template = require('./lib/Module.js')
var db = require('./lib/db.js');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');
const { update } = require('./lib/topic.js');
// const { delete_process } = require('./lib/topic.js');


var app = http.createServer(function (req, res) {
  var _url = req.url;
  var queryData = urlm.parse(_url, true).query;
  var pathname = urlm.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      topic.home(res);
    } else {
        topic.page(req, res);
    }
  } else if (pathname === '/create') { // select 결과가 topics에 저장
      topic.create(req, res);
  } else if (pathname === '/create_process') {
      topic.create_process(req, res);
  } else if (pathname === '/update') {
      topic.update(req, res);
  } else if (pathname === '/update_process') {
      topic.update_process(req, res);
  } else if (pathname === '/delete_process') {
      topic.delete_process(req, res);
  } else if (pathname === '/author') {
      author.home(req, res);
  } else if (pathname === '/author/create_process') {
      author.create_process(req, res);
  } else if (pathname === '/author/update') {
      author.update(req, res);
  } else if (pathname === '/author/update_process') {
      author.update_process(req, res);
  } else if (pathname === '/author/delete_process') {
      author.delete_process(req, res);
  } else {
      res.writeHead(404);
      res.end("Not found");
    }
});
app.listen(3000);