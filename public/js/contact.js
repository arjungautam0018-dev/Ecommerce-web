// ============================================================
// NAV MENU
// ============================================================

window.toggleMenu = function toggleMenu() {
  const menu = document.querySelector(".quickies");
  if (menu) menu.classList.toggle("show");
};

function setupMenuClose() {
  document.addEventListener("click", (event) => {
    const menu = document.querySelector(".quickies");
    const hamburger = document.querySelector(".hamburger");
    if (!menu || !hamburger) return;

    if (!hamburger.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove("show");
    }
  });
}

// ============================================================
// ICONS / THEME — handled by /js/theme.js
// ============================================================

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  setupMenuClose();
});


  // Toast function
  function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // Prevent form submission and show toast
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name    = form.querySelector('[name="name"]')?.value.trim();
    const email   = form.querySelector('[name="email"]')?.value.trim();
    const subject = form.querySelector('[name="subject"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        showToast("✅ Message sent successfully");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast("❌ " + (data.error || data.message || "Failed to send message"));
      }
    } catch (err) {
      showToast("❌ Network error. Please try again.");
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send Message"; }
    }
  });