const express = require("express");
const fs = require("fs");

const router = express.Router();
//클라이언트에서 보내는 데이터 응답
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  if (req.cookies.userid) {
    res.send("잘못된 접근");
  } else {
    fs.readFile("./static/html/register.html", (err, data) => {
      if (err) {
        res.send("error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" }); //뒤에 오는 코드가 다 html이에욤
        res.write(data);
        res.end();
      }
    });
  }
});

router.post("/", (req, res) => {
  //form으로 입력한 데이터를 받아온다.
  let inputid = req.body.userId;
  let inputpw = req.body.userPW;

  //포문으로 파일을 읽어온다.
  const article = fs.readFileSync("./static/file/user.txt");
  userInfoArray = article.toString().split("\n");
  for (let i = 0; i < userInfoArray.length; i++) {
    userInfoArray[i] = userInfoArray[i].split(",");
    //회원가입 실패
    if (userInfoArray[i][0] == inputid) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<script>alert('회원가입 실패')</script>");
      res.write('<script>window.location="/register"</script>');
      return;
    }
  }
  //회원가입 성공

  let text = "";
  for (let i = 0; i < userInfoArray.length - 1; i++) {
    text = text + userInfoArray[i] + "\n";
  }
  text = text + inputid + "," + inputpw + "," + "0" + "," + "f\n";
  text = text + "end,0,0,0,f";
  fs.writeFileSync("./static/file/user.txt", text, {
    encoding: "utf8",
  });
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write("<script>alert('회원가입 성공')</script>");
  res.write('<script>window.location="/"</script>');
});

module.exports = router;
