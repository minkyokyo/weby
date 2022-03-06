const e = require("express");
const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.cookies.userid) {
    userIntimay = req.cookies.intimacy;
    if (userIntimay > 200) {
      fs.readFile("./static/html/main3.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" }); //뒤에 오는 코드가 다 html이에욤
          res.write(data);
          res.end();
        }
      });
    } else if (userIntimay > 100) {
      fs.readFile("./static/html/main2.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" }); //뒤에 오는 코드가 다 html이에욤
          res.write(data);
          res.end();
        }
      });
    } else {
      fs.readFile("./static/html/main1.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" }); //뒤에 오는 코드가 다 html이에욤
          res.write(data);
          res.end();
        }
      });
    }
  } else {
    res.send("권한이 없어용");
  }
});

module.exports = router;
