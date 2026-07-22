const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.end("<p>Hello Server!</p>");
  })
  .listen(8080, () => [console.log("8080번 포트에서 연결 대기 중입니다!")]);
