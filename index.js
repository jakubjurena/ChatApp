const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const path = require("path");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

http.listen(80, function(err) {
  if (err) throw Error("Cannot start server on port 80");
  console.log("Listening on port 80");
});
