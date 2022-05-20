const URL_GET_MESSAGES =
  "https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages";

var sidebarFolded = true;

window.onload = function () {
  loadMessages();

  const username = window.localStorage.getItem("username");
  if (username !== null && username !== "") loadUsername(username);
  else loadUsername("Anonymous");
};

function loadMessages() {
  fetch("./assets/token.data")
    .then((response) => response.text())
    .then((token) => {
      fetch(URL_GET_MESSAGES, {
        method: "POST",
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const fragment = new DocumentFragment();
            const container = document.querySelector(".chat");

            data.messages.forEach((message) => {
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
            "Failed to fetch data from: " + URL_GET_MESSAGES + ". ERROR: " + err
          )
        );
    })
    .catch((err) => console.log("Failed to load bearer token. ERROR: " + err));
}

function loadUsername(username) {
  document.getElementById("chatUser").innerHTML = chatHeaderTemplate(username);
}

function changeUsername() {
  const username = document.getElementById("assign-username").value;
  window.localStorage.setItem("username", username);
}

function goAnonymous() {
  window.localStorage.setItem("username", "Anonymous");
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
    this.sidebarFolded = false;
  } else {
    document.getElementById("sidebar").style.width = "85px";
    this.sidebarFolded = true;
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
