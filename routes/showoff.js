//서버 역할을 수행할 자바스크립트 코드
const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.cookies.userid) {
    fs.readFile("./static/html/showoff.html", (err, data) => {
      if (err) {
        res.send("error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" }); //뒤에 오는 코드가 다 html이에욤
        res.write(data);
        res.end();
      }
    });
  } else {
    res.send("권한이 없어용");
  }
});

module.exports = router;
