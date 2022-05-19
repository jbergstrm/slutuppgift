var sidebarFolded = true;
loadMessages();

function loadMessages() {
  fetch("../../token.txt")
    .then((response) => response.text())
    .then((token) => {
      fetch(
        "https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages",
        {
          method: "POST",
          headers: { Authorization: token },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const fragment = new DocumentFragment();
            const container = document.querySelector(".chat");

            data.messages.forEach((message) => {
              const article = document.createElement("article");
              article.innerHTML = projectTemplate(message);
              fragment.appendChild(article);
            });

            container.appendChild(fragment);
            autoScroll("chat");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function projectTemplate({ user, message, timestamp }) {
  return `
    <article class="message">
      <p class="text">${message}</p>
      <section class="info">
        <p class="name">${user}: </p>
        <p class="time">${convertFromUnixTime(timestamp)}</p>
      </section>
    </article>
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
