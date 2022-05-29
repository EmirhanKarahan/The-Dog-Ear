const navPopup = [...document.getElementsByClassName("header__nav-popup")][0];
const navButton = document.getElementById("nav-button");
const homeSearch = document.getElementById("home-search");
const searchForm = document.getElementById("search-form");
const settingsPopup = document.getElementById("settings-popup");
const settingsButton = document.getElementById("settings-button");
const settingQuit = document.getElementById("quit-button");

navButton.addEventListener("click", () => {
  navPopup.classList.toggle("d-flex");
});

settingsButton.addEventListener("click", () => {
  settingsPopup.classList.toggle("d-block");
});

settingQuit.addEventListener("click", () => {
  settingsPopup.classList.toggle("d-block");
});

homeSearch.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchForm.submit();
  }
});
