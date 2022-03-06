const fs = require("fs");
const http = require("http");

//설치한 express 모듈 불러오기
const express = require("express");
//설치한 socket.io 모듈 불러오기
const socket = require("socket.io");
//express 객체 생성
const app = express();
//express 서버 생성
const server = http.createServer(app);
//생성된 서버를 소켓 아이오에 바인딩
const io = socket(server);

//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//cookie 모듈
const cookie = require("cookie");

//클라이언트에서 보내는 데이터 응답을 위해 모듈 얻기
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/img", express.static("./static/img")); // static안에있는 img로 가거라! /img는 실제로는 /static/img를 의미.
app.use("/file", express.static("./static/file")); // static안에있는 file로 가거라! /file는 실제로는 /static/file를 의미.
app.use("/label", express.static("./static/html/label")); // static안에있는 label로 가거라!

const mainRouter = require("./routes/main");
const conversationRouter = require("./routes/conversation");
const showoffRouter = require("./routes/showoff");
const attendanceRouter = require("./routes/attend");
const registerRouter = require("./routes/register");
const marketRouter = require("./routes/market");

//라우터 연결
app.use("/main", mainRouter);
app.use("/conversation", conversationRouter);
app.use("/showoff", showoffRouter);
app.use("/attend", attendanceRouter);
app.use("/register", registerRouter);
app.use("/market", marketRouter);

let user = {};

app.get("/", (req, res) => {
  //쿠키가 존재할 시
  if (req.cookies.userid) {
    //main으로 리디렉션
    res.redirect("/main");
  } else {
    fs.readFile("./static/html/index.html", (err, data) => {
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

app.post("/login", (req, res) => {
  //form으로 입력한 데이터를 받아온다.
  let inputid = req.body.userId;
  let inputpw = req.body.userPW;

  //포문으로 파일을 읽어온다.
  const article = fs.readFileSync("./static/file/user.txt");
  userInfoArray = article.toString().split("\n");
  for (let i = 0; i < userInfoArray.length; i++) {
    userInfoArray[i] = userInfoArray[i].split(",");
    if (userInfoArray[i][0] == inputid) {
      if (userInfoArray[i][1] == inputpw) {
        //로그인 성공
        res.cookie("userid", inputid, {
          maxAge: 60 * 60 * 1000,
          path: "/",
        });
        res.cookie("intimacy", userInfoArray[i][2]);
        res.cookie("index", i);
        res.redirect("/main");
        return;
      }
    }
  }
  //로그인 실패
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write("<script>alert('로그인 실패')</script>");
  res.write('<script>window.location="/"</script>');
});

//로그아웃 쿠키 제거
app.get("/logout", (req, res) => {
  res.clearCookie("intimacy");
  res.clearCookie("socket.id");
  res.clearCookie("userid");
  res.clearCookie("index");
  res.redirect("/");
});

io.sockets.on("connection", (socket) => {
  user[socket.id] = {};
  io.to(socket.id).emit("SendSocketId", {
    id: socket.id,
    message: "ID를 받으세요",
  });

  io.sockets.emit("userListPrint", {
    users: user,
    message: "ㅎㅎ",
  });

  socket.on("input", (data) => {
    io.sockets.emit("msg", {
      id: socket.id,
      message: data,
    });

    let a = socket.request.headers.cookie;
    let b = cookie.parse(a); //does not translate
    if (b.intimacy > 200) {
      io.sockets.emit("webResponse", {
        message: socket.id + "짱짱!!!",
      });
    } else {
      io.sockets.emit("webNoResponse", {
        message: socket.id + "...",
      });
    }
  });

  socket.on("disconnect", () => {
    delete user[socket.id];
    io.sockets.emit("userListPrint", {
      users: user,
      message: "ㅎㅎ",
    });
  });
});

server.listen(80, () => {
  console.log("listening on port 8080");
});
