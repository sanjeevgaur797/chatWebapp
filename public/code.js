(function () {
  //   console.log("opioioio ");
  const app = document.querySelector(".app");
  // const socket = io("https://chat-webapp-agup.vercel.app");
  const socket = io();

  let uname;
  // join screen
  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      //   alert(username);
      console.log("======", username);
      if (username.length == 0) {
        alert("please enter message");
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

  // chatscreen is
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      let time = new Date().getTime();
      let timestamp = moment(time);
      //   console.log(moment(time), "timetimetimetimetimetime");
      if (message.length == 0) {
        alert("please enter message");
        return;
      }
      const date = moment(timestamp);
      let currentDate = date.format("h:mm a");

      renderMessage("my", {
        username: uname,
        text: message,
        time: currentDate,
      });

      socket.emit("chat", {
        username: uname,
        text: message,
        time: currentDate,
      });

      app.querySelector(".chat-screen #message-input").value = "";
    });

  // exit chat is
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
       
          <div class="text">${message.text}</div>
      <div class="time">${message.time}</div>

        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");

      el.innerHTML = `<div>
      <div class="name">${message.username}</div>
      <div class="text">${message.text}</div>
      <div class="time">${message.time}</div>

    </div>`;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.style.color = "red";
      el.style.justifyContent = "center";
      el.style.alignItems = "center";
      el.style.display = "flex";

      el.setAttribute("class", "update");
      el.innerHTML = message;
      messageContainer.appendChild(el);
    }
    // scroll to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;

    // messageContainer.scrollTop = messageContainer.scrollHeight;
    console.log(
      messageContainer.scrollTop,
      "==-=-  messageContainer.scrollTop"
    );
  }
})();
