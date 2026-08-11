(() => {
  "use strict";

  const ACCESS_CODE = "666";
  const SESSION_KEY = "econwm-atlas-access";
  const root = document.documentElement;
  const gate = document.querySelector("#access-gate");
  const content = document.querySelector("#atlas-content");
  const form = document.querySelector("#access-form");
  const input = document.querySelector("#access-password");
  const error = document.querySelector("#access-error");

  const unlock = () => {
    root.classList.remove("atlas-locked");
    root.classList.add("atlas-unlocked");
    gate.setAttribute("hidden", "");
    content.removeAttribute("inert");
    content.removeAttribute("aria-hidden");
  };

  if (sessionStorage.getItem(SESSION_KEY) === "granted") {
    unlock();
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value === ACCESS_CODE) {
      sessionStorage.setItem(SESSION_KEY, "granted");
      unlock();
      return;
    }

    error.textContent = "口令不正确，请重新输入。";
    input.value = "";
    input.focus();
  });

  input.addEventListener("input", () => {
    error.textContent = "";
  });
})();
