const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const path = require("path");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

let users = [];

io.on("connection", function(socket) {
  console.log("User is connected.");

  socket.on("setUsername", function(data) {
    console.log("Try set username: " + JSON.stringify(data));

    if (users.indexOf(data.username) > -1) {
      socket.emit("usernameExists", {
        type: "error",
        message: data.username + " username is taken! Try some other username."
      });
    } else {
      users.push(data.username);
      socket.emit("usernameSet", { type: "success", username: data.username });
    }
  });

  socket.on("sendMessage", function(data) {
    console.log("Message: " + JSON.stringify(data));
    io.sockets.emit("newMessage", data);
  });
});

http.listen(80, function(err) {
  if (err) throw Error("Cannot start server on port 80");
  console.log("Listening on port 80");
});
