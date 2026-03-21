window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

document.addEventListener("click", (event) => {
  const menu = document.querySelector(".quickies");
  const hamburger = document.querySelector(".hamburger");
  if (!menu || !hamburger) return;
  if (!hamburger.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.querySelector(".nav-bar-right a");
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("theme-dark");
  themeButton?.addEventListener("click", function(event){
    event.preventDefault();
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
  });

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = {
      name: document.getElementById("name")?.value || "",
      email: document.getElementById("email")?.value || "",
      subject: document.getElementById("subject")?.value || "",
      text: document.getElementById("message")?.value || "",
      createdAt: new Date().toISOString()
    };

    const old = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    old.push(message);
    localStorage.setItem("contact_messages", JSON.stringify(old));

    form.reset();
    alert("Message saved. We will get back to you soon.");
  });
});
