Template = {
  HTML: function (title, list, body, control) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>WEB1 - ${title}</title>
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html> ` ;
  },
  LIST: function (topics) {
    var list = '<ul>';
    var i = 0;
    while (i < topics.length) {
      list = list + `<li><a href="/page/${topics[i].id}"}>${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  },
  authorSelect: function (authors, author_id) {
    var tag = '';
    var i = 0;
    while (i < authors.length) {
      var selected = '';
      if (authors[i].id === author_id) {
        selected = 'selected';
      }
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  },
  authorTable: function (authors) {
    var tag = '<table>';
    var i = 0;
    while (i < authors.length) {
      tag += `
          <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td>
              <a href="/author/update?id=${authors[i].id}">update</a>
            </td>
            <td>
              <form action="/author/delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
                <input type="hidden" name"id" value="${authors[i].id}">
                <input type="submit" value="delete">
              </form>
            </td>
          </tr>`
      i++;
    }
    tag += '</table>'
    return tag;
  }
}
module.exports = Template;