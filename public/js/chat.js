const socket = io();
let username;

function onSetUsername() {
  try {
    setUsername();
  } catch (e) {
    throw new Error(e.message);
  }
  return false;
}

function setUsername() {
  socket.emit("setUsername", {
    username: document.getElementById("username").value
  });
}

function showInitError(data) {
  document.getElementById("init-error-text").innerHTML = data.message;
  document.getElementById("init-error").style.opacity = 1;
}

function onSendMessage() {
  try {
    sendMessage();
  } catch (e) {
    throw new Error(e.message);
  }
  return false;
}

function sendMessage() {
  if (username) {
    element = document.getElementById("input-message");
    if (element.value === "") return;
    socket.emit("sendMessage", {
      message: element.value,
      username: username
    });
    element.value = "";
  }
}

function chatToBottom() {
  alert("Scrolling to bottom ...");
  window.scrollTo(0, document.querySelector("#message-container").scrollHeight);
}

socket.on("usernameExists", function(data) {
  showInitError(data);
});

socket.on("usernameSet", function(data) {
  username = data.username;
  document.getElementById("profile").innerHTML = "Logged ad: " + username;
  document.getElementById("init").innerHTML = "";
  document.getElementById("chat").style.display = "block";
});

socket.on("userJoin", function(data) {
  document.getElementById("messages").innerHTML +=
    "<div class='joined-user'><strong>" +
    data.username.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
    "</strong> joined room </div>";
});

socket.on("userDisconnect", function(data) {
  document.getElementById("messages").innerHTML +=
    "<div class='discinect-user'><strong>" +
    data.username.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
    "</strong> disconnected </div>";
});

socket.on("newMessage", function(data) {
  console.log(JSON.stringify(data));
  if (username) {
    document.getElementById("messages").innerHTML +=
      "<div class='message'><strong>" +
      data.username.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
      ": </strong>" +
      data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
      "</div>";
  }
});
