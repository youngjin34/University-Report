var qs = require('node:querystring');
var db = require('./db.js');
var Template = require('./Module.js');
var queryData = require('../mainMysql.js');
var urlm = require('url');
var mysql = require('mysql');

module.exports = {
  home : function (res) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = "Welcome";
    var description = "Hello, Node.js";
    var list = Template.LIST(topics);
    var template = Template.HTML(title, list, 
      `<h2>${title}</h2><p>${description}</p>`,
      `<a href="/create">create</a>`);
      res.writeHead(200);
      res.end(template);
    });
  },
  page : function (req, res) {
    var _url = req.url;
    var id = req.params.pageId;
    db.query(`SELECT * FROM topic`, function (error, topics) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [id], 
        function (error2, topic) {
          if (error2) {
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = Template.LIST(topics);
          var template = Template.HTML(title, list, `<h2>${title}</h2>
                                                    ${description}
                                                    <p>${topic[0].name}</p>`,
                                                   `<a href="/create">create</a>  
                                                    <a href="/update?id=${id}">update</a>
                                                    <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
                                                     <input type"hidden" name="id" value="${id}">
                                                     <input type="submit" value="delete">
                                                    </form>`
          );
          res.writeHead(200);
          res.end(template);
      });
    });
  },
  create : function (req, res) {
    db.query(`SELECT * FROM topic` ,function (error, topics) {
      db.query(`SELECT * FROM author`, function(error, authors) {
        var tag = '';
        var title = "Create";
        var list = Template.LIST(topics);
        var template = Template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><b>새글 작성</b></p>
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
            ${Template.authorSelect(authors)}
          <p>
            <input type="submit">
          </p>
        </form>
        `, 
        `<input type="button" value="홈페이지" placeholder="홈페이지" onclick="location.href='/create' ">`);
        res.writeHead(200);
        res.end(template);
      });
    })
  },
  create_process : function (req, res) {
    var body = '';
      req.on('data', function (data) {
        body = body + data;
      });
      req.on('end', function () {
        var post = qs.parse(body);
        db.query(`INSERT INTO topic (title, description, created, author_id) 
                      VALUES(?, ?, NOW(), ?)`,
                      [post.title, post.description, post.author], function (error, result) {
                        if (error) {
                          throw error;
                        }
                        res.writeHead(302, {Location: (`/?id=${result.insertId}`)});
                        res.end();
        });
      });
  },
  update : function (req, res) {
    var _url = req.url;
    var queryData = urlm.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (error, topics) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error, topic) {
        if (error) {
          throw error;
        }
        db.query(`SELECT * FROM author`, function (error, authors) {
          var list = Template.LIST(topics);
          var template = Template.HTML(topic[0].title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
                ${Template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a>  <a href="/update?id=${topic[0].id}">update</a>`);
          res.writeHead(200);
          res.end(template);
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
      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
          [post.title, post.description, post.author, post.id], function (error, result) {
          res.writeHead(302, {Location: (`/`)});
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
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (error, result) {
          if (error) {
            throw error;
          }
          res.writeHead(302, {Location: (`/`)});
          res.end();
        });
      });
  }
}
