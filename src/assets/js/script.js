var folded = true;

function toggleSidebar() {
  if (folded) {
    console.log("Opening sidebar");
    document.getElementById("sidebar").style.width = "250px";
    this.folded = false;
  } else {
    console.log("Closing sidebar");
    document.getElementById("sidebar").style.width = "85px";
    this.folded = true;
  }
}

function autoGrow(element) {
  element.style.height = "10px";
  element.style.height = element.scrollHeight + "px";
}
