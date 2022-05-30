const URL_GET_MESSAGES =
  "https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages";
const URL_GET_UPDATED =
  "https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages/updated";
const URL_APPEND_MESSAGE =
  "https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages/append";

// Sidebar position if folded or not
let sidebarFolded = true;

// TODO: Hide
const bearerToken =
  "Bearer N31fRWVMZCtwU0JeZnBQdVBjTmlOImRzcTAxfl08cz1xR2lyWGFJfmo5JC5RNSc=";

window.onload = function () {
  loadSavedUsername();
  loadMessages();
};

function loadMessages(latest = "", limit = 30) {
  fetch(URL_GET_MESSAGES, {
    method: "POST",
    headers: { Authorization: bearerToken },
    body: JSON.stringify({ last: latest, limit: limit }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("loadMessage: " + data.last);
        localStorage.setItem("latestMessage", data.last);

        const fragment = new DocumentFragment();
        const container = document.querySelector(".chat");

        data.messages
          .slice()
          .reverse()
          .forEach((message) => {
            const article = document.createElement("article");

            article.classList.add("message");
            article.innerHTML = messageTemplate(message);
            fragment.appendChild(article);
          });

        container.appendChild(fragment);
        autoScroll("chat");
      }
    })
    .catch((err) =>
      console.log(
        `Error: Failed to fetch data from ${URL_GET_MESSAGES}\n${err}`
      )
    );
}

function refrechMessages() {
  fetch(URL_GET_UPDATED, {
    method: "POST",
    headers: { Authorization: bearerToken },
    body: JSON.stringify({
      last: localStorage.getItem("latestMessage"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (!data.updated) loadMessages(localStorage.getItem("latestMessage"));
    })
    .catch((err) =>
      console.log(`Error: Failed to fetch data from ${URL_GET_UPDATED}\n${err}`)
    );
}

function sendMessage() {
  let body = {};
  if (localStorage.getItem("username").length > 1) {
    body = {
      user: localStorage.getItem("username"),
      message: getMessageInput(),
    };
  } else {
    body = {
      message: getMessageInput(),
    };
  }

  console.log(body);

  fetch(URL_APPEND_MESSAGE, {
    method: "POST",
    headers: { Authorization: bearerToken },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        refrechMessages();
      }
      if (!data.success) {
        console.log("Failed to send!");
      }
    })
    .catch((err) =>
      console.log(
        `Error: Failed to send message to ${URL_APPEND_MESSAGE}\n${err}`
      )
    );

  document.getElementById("messageInput").value = "";
}

function loadSavedUsername() {
  const username = localStorage.getItem("username");
  if (username !== null && username !== "") loadUsernameToHTML(username);
  else loadUsernameToHTML("Anonymous");
}

function loadUsernameToHTML(username) {
  document.getElementById("chatUser").innerHTML = chatHeaderTemplate(username);
}

function getMessageInput() {
  return document.getElementById("messageInput").value;
}

function changeUsername() {
  const username = document.getElementById("assign-username").value;
  localStorage.setItem("username", username);
  loadUsernameToHTML(username);
  overlayHide();
}

function goAnonymous() {
  localStorage.setItem("username", "");
  loadUsernameToHTML("Anonymous");
  overlayHide();
}

function messageTemplate({ user, message, timestamp }) {
  return `
    <p class="text">${message}</p>
    <section class="info">
      <p class="name">${user}: </p>
      <p class="time">${convertFromUnixTime(timestamp)}</p>
    </section>
    `;
}

function chatHeaderTemplate(username) {
  return `
    <p>Username:</p>
    <h2 id="username">${username}</h2>
    <hr>
  `;
}

function convertFromUnixTime(unixTime) {
  const date = new Date(unixTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    day +
    "." +
    month +
    "." +
    year +
    " " +
    ("0" + hour).slice(-2) +
    ":" +
    ("0" + minute).slice(-2)
  );
}

function toggleSidebar() {
  if (sidebarFolded) {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("sidebar").style.opacity = "0.9";
    sidebarFolded = false;
  } else {
    document.getElementById("sidebar").style.width = "85px";
    document.getElementById("sidebar").style.opacity = "1";
    sidebarFolded = true;
  }
}

function autoGrow(element) {
  element.style.height = "10px";
  element.style.height = element.scrollHeight + "px";
}

function autoScroll(id) {
  var element = document.getElementById(id);
  element.scrollTop = element.scrollHeight;
}

function overlayShow() {
  document.getElementById("overlay").style.display = "flex";
}

function overlayHide() {
  document.getElementById("overlay").style.display = "none";
}
