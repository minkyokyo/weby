const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.cookies.userid) {
    userIntimay = req.cookies.intimacy;
    if (userIntimay > 200) {
      fs.readFile("./static/html/conversation3.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    } else if (userIntimay > 100) {
      fs.readFile("./static/html/conversation2.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    } else {
      fs.readFile("./static/html/conversation1.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    }
  } else {
    res.send("권한이 없어용");
  }
});

router.post("/", (req, res) => {
  if (req.cookies.userid) {
    //포문으로 파일을 읽어온다.
    const article = fs.readFileSync("./static/file/user.txt");
    userInfoArray = article.toString().split("\n");
    for (let i = 0; i < userInfoArray.length; i++) {
      userInfoArray[i] = userInfoArray[i].split(",");
      //아이디 찾기
      if (userInfoArray[i][0] == req.cookies.userid) {
        //친밀도 올리기
        userInfoArray[i][2] = userInfoArray[i][2] * 1 + 50;
        break;
      }
    }
    //다시 파일에 반영
    let text = "";
    for (let i = 0; i < userInfoArray.length - 1; i++) {
      text = text + userInfoArray[i] + "\n";
    }
    text = text + "end,0,0,0,f";
    fs.writeFileSync("./static/file/user.txt", text, {
      encoding: "utf8",
    });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<script>alert('친밀도 +50')</script>");
    res.write('<script>window.location="/main"</script>');
  } else {
    res.send("권한이 없어용");
  }
});
module.exports = router;
