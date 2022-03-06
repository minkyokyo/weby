const express = require("express");
const fs = require("fs");

const router = express.Router();

//클라이언트에서 보내는 데이터 응답
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  if (req.cookies.userid) {
    fs.readFile("./static/html/attendance.html", (err, data) => {
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

router.post("/", (req, res) => {
  if (req.cookies.userid) {
    let now = new Date();
    let date = now.getDate(); // 현재 날짜 및 시간

    const content = fs.readFileSync("./static/file/attendance.txt");
    attendArray = content.toString().split("\n");
    attendArray[0] = attendArray[0].split(",");
    attendArray[0][date - 1] = 1;

    const text = attendArray[0] + "\nend";
    fs.writeFileSync("./static/file/attendance.txt", text, {
      encoding: "utf8",
    });
    res.redirect("/attend");
  } else {
    res.send("권한이 없습니다");
  }
});

module.exports = router;
