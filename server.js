const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const moment = require("moment");
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.static(path.join(__dirname + "/public")));
const history = [];
// when user is created frist time
io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit(
      "update",
      username + " " + " joined the conversation"
    );
  });
  // when user is left  that time call

  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " " + " left the conversation");
  });
  // when creating chat is called that time

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
    history.push(message);
  });
});
const port = process.env.VERCEL_URL ? process.env.VERCEL_URL : 3000;
server.listen(port, (token) => {
  console.log(`listening on *:${port}`);
});
