var db = require('./db.js');
var template = require('./Module.js');
var queryData = require('../mainMysql.js');
var urlm = require('url');
var qs = require('node:querystring');
var mysql = require('mysql');

module.exports = {
  home : function  (req, res) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      db.query(`SELECT * FROM author`, function (error, authors) {
        var title = 'author';
        var description = 'Hello, Node.js';
        var list = template.LIST(topics);
        var authorTable = template.authorTable(authors);
        var html = template.HTML(title, list,
          `${authorTable}
           <style>
             table { 
               border-collapse: collapse;
             }
             td { 
               border: 1px solid black;
             }
           </style>
           <form action="/author/create_process" method="post">
             <p>
               <input type="text" name="name" placeholder="name">
             </p>
             <p>
               <textarea name="profile" placeholder="description"></textarea>
             </p>
             <p>
               <input type="submit">
             </p>
           </form>`,
          ``);
          res.writeHead(200);
          res.end(html);
      });
    });
  },
  create_process : function (req, res) {
    var body = '';
    req.on('data', function (data) {
      body = body + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`INSERT INTO author (name, profile) 
                    VALUES(?, ?)`,
                    [post.name, post.profile], function (error) {
                      if (error) {
                        throw error;
                      }
                      res.writeHead(302, {Location: ('/author')});
                      res.end();
      });
    });
  },
  update : function (req, res) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      db.query(`SELECT * FROM author`, function (error, authors) {
        var _url = req.url;
        var queryData = urlm.parse(_url, true).query;
        db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function (error, author) {
          var title = "author";
          var authorTable = template.authorTable(authors);
          var list = template.LIST(topics);
          var html = template.HTML(title, list,
            `${authorTable}
             <style>
               table { 
                 border-collapse: collapse;
               }
               td { 
                 border: 1px solid black;
               }
             </style>
             <form action="/author/update_process" method="post">
               <input type="hidden" name="id" value="${queryData.id}">
               <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
               <p>
                 <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
               </p>
               <p>
                 <input type="submit" value="update">
               </p>
             </form>`,
            ``);
            res.writeHead(200);
            res.end(html);
        });
      });
    });
  },
  update_process : function (req, res) {
    var body = '';
    req.on('data', function (data) {
      body = body  + data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
          [post.name, post.profile, post.id], 
          function (error, result) {
            if (error) {
              throw error;
            }
            res.writeHead(302, {Location: (`/author`)});
            res.end();
      });
    });
  },
  delete_process : function (req, res) {
    var body = '';
      req.on('data', function (data) {
        body = body + data;
      });
      req.on('end', function () {
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], 
          function (error1, result1) {
            if (error1) {
              throw error1;
            }
            db.query(`DELETE FROM author WHERE id=?`, [post.id],
              function (error, result) {
                if (error) {
                  throw error;
                }
                res.writeHead(302, {Location: (`/author`)});
                res.end();
              });
        });
      });
  }
}