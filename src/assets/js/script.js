const URL = "https://ha-slutuppgift-chat-do.westling.workers.dev/api";

addEventListener("DOMContentLoaded", () => {
  getBearerToken();
  loadUsername();
  loadMessages();
});

function save(key, value) {
  localStorage.setItem(key, value);
}

function load(key) {
  return localStorage.getItem(key);
}

function getBearerToken() {
  fetch("./assets/token.data")
    .then((response) => response.text())
    .then((token) => save("bearerToken", token))
    .catch((e) => console.log(`Error: Failed to load token!\n${e}`));
}

function loadMessages(last = "", limit = 30, reverse = false) {
  fetch(`${URL}/messages`, {
    method: "POST",
    headers: { Authorization: load("bearerToken") },
    body: JSON.stringify({ last, limit, reverse }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        save("latestMessage", data.last);
        showMessages(data.messages);
      }
    })
    .catch((e) =>
      console.log(
        `Error: Failed while fetching data from ${URL_GET_MESSAGES}\n${e}`
      )
    );
}

function refrechMessages(last = load("latestMessage")) {
  fetch(`${URL}/messages/updated`, {
    method: "POST",
    headers: { Authorization: load("bearerToken") },
    body: JSON.stringify({ last }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Updated is always false if the "last" timestamp is past to body.
      // Need to +1 the time to not fetch the same massage again.
      if (!data.updated) loadMessages(parseInt(last) + 1);
    })
    .catch((e) =>
      console.log(
        `Error: Failed while fetching data from ${URL_GET_UPDATED}\n${e}`
      )
    );
}

function sendMessage() {
  const message = getMessageBody();

  if (message !== undefined) {
    fetch(`${URL}/messages/append`, {
      method: "POST",
      headers: { Authorization: load("bearerToken") },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) refrechMessages();
      })
      .catch((e) =>
        console.log(
          `Error: Failed to append message to ${URL_APPEND_MESSAGE}\n${e}`
        )
      );
  }

  setElementValueById("messageInput", "");
}

function showMessages(messages) {
  const fragment = new DocumentFragment();

  messages
    .slice()
    .reverse()
    .forEach((message) => {
      const article = document.createElement("article");

      article.classList.add("message");
      article.innerHTML = messageTemplate(message);
      fragment.appendChild(article);
    });

  document.querySelector(".chat").appendChild(fragment);
  autoScroll(document.getElementById("chat"));
}

function getMessageBody() {
  if (getValueFromElementById("messageInput") !== "") {
    if (load("username") !== null && load("username") !== "") {
      return {
        user: load("username"),
        message: getValueFromElementById("messageInput"),
      };
    } else {
      return {
        message: getValueFromElementById("messageInput"),
      };
    }
  }
}

function messageTemplate({ user, message, timestamp }) {
  return `
    <p>${message}</p>
    <section class="info">
      <p class="name">${user}</p>
      <p class="time">${convertFromUnixTime(timestamp)}</p>
    </section>
    `;
}

function loadUsername() {
  const username = load("username");
  if (username !== null && username !== "")
    setElementInnerTextById("username", username);
  else setElementInnerTextById("username", "Anonymous");
}

function setElementInnerTextById(id, value) {
  document.getElementById(id).innerText = value;
}

function setElementValueById(id, value) {
  document.getElementById(id).value = value;
}

function getValueFromElementById(id) {
  return document.getElementById(id).value;
}

function convertFromUnixTime(unixTime) {
  const date = new Date(unixTime);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${(
    "0" + date.getHours()
  ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
}

function autoGrow(element) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}

function autoScroll(element) {
  element.scrollTop = element.scrollHeight;
}

function changeUsername() {
  save("username", getValueFromElementById("assign-username"));
  setElementInnerTextById(
    "username",
    getValueFromElementById("assign-username")
  );
  hideOverlay();
}

function goAnonymous() {
  save("username", "");
  setElementInnerTextById("username", "Anonymous");
  hideOverlay();
}

function extendSidebar() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("sidebar").style.opacity = "0.9";
}

function shrinkSidebar() {
  document.getElementById("sidebar").style.width = "85px";
  document.getElementById("sidebar").style.opacity = "1";
}

function showOverlay() {
  document.getElementById("overlay").style.display = "flex";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}
