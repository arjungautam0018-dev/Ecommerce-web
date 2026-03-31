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
// ICONS
// ============================================================


const ICONS = {
  sun: `
    <svg class="menu-item-icon" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <g fill="#ffe62e">
        <path d="M20.5 59.7l7-7.2c-2.5-.5-4.8-1.5-6.9-2.9l-.1 10.1"/>
        <path d="M43.5 4.3l-7 7.2c2.5.5 4.8 1.5 6.9 2.9l.1-10.1"/>
        <path d="M4.3 43.5l10.1-.1C13 41.3 12 39 11.5 36.5l-7.2 7"/>
        <path d="M59.7 20.5l-10.1.1c1.3 2.1 2.3 4.4 2.9 6.9l7.2-7"/>
        <path d="M4.3 20.5l7.2 7c.5-2.5 1.5-4.8 2.9-6.9l-10.1-.1"/>
        <path d="M59.7 43.5l-7.2-7c-.5 2.5-1.5 4.8-2.9 6.9l10.1.1"/>
        <path d="M20.5 4.3l.1 10.1c2.1-1.3 4.4-2.3 6.9-2.9l-7-7.2"/>
        <path d="M43.5 59.7l-.1-10.1C41.3 51 39 52 36.5 52.5l7 7.2"/>
      </g>
      <g fill="#ffce31">
        <path d="M14.8 44l-4 9.3l9.3-4C18 47.8 16.2 46 14.8 44"/>
        <path d="M49.2 20l4-9.3l-9.2 4c2 1.5 3.8 3.3 5.2 5.3"/>
        <path d="M11.4 28.3L2 32l9.4 3.7c-.3-1.2-.4-2.4-.4-3.7s.1-2.5.4-3.7"/>
        <path d="M52.6 35.7L62 32l-9.4-3.7c.2 1.2.4 2.5.4 3.7c0 1.3-.1 2.5-.4 3.7"/>
        <path d="M20 14.8l-9.3-4l4 9.3c1.5-2.1 3.3-3.9 5.3-5.3"/>
        <path d="M44 49.2l9.3 4l-4-9.3C47.8 46 46 47.8 44 49.2"/>
        <path d="M35.7 11.4L32 2l-3.7 9.4c1.2-.2 2.5-.4 3.7-.4s2.5.1 3.7.4"/>
        <path d="M28.3 52.6L32 62l3.7-9.4c-1.2.3-2.4.4-3.7.4s-2.5-.1-3.7-.4"/>
        <circle cx="32" cy="32" r="19"/>
      </g>
    </svg>`,
  moon: `
    <svg class="menu-item-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>`,
};
// ============================================================
// API (THEME)
// ============================================================

const API = {
  async getPreferences() {
    const res = await fetch("/api/user/preferences");
    if (!res.ok) throw new Error("No preferences");
    return res.json();
  },

  async saveTheme(theme) {
    await fetch("/api/user/preferences/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme })
    });
  }
};

// ============================================================
// THEME SYSTEM (PRO VERSION)
// ============================================================

function applyTheme(theme, iconContainer) {
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
    iconContainer.innerHTML = ICONS.sun; // show sun to switch back
  } else {
    document.body.classList.remove("theme-dark");
    iconContainer.innerHTML = ICONS.moon;
  }
}

async function setupThemeToggle() {
  const themeButton = document.querySelector(".theme-toggle");
  if (!themeButton) return;

  const iconContainer = themeButton.querySelector(".icon");
  if (!iconContainer) return;

  let currentTheme = "light";

  // 🔥 1. Try DB
  try {
    const prefs = await API.getPreferences();
    currentTheme = prefs.theme || "light";
  } catch {
    // 🔥 2. Fallback to localStorage
    const saved = localStorage.getItem("theme");
    if (saved) currentTheme = saved;

    // 🔥 3. System preference (first visit)
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      currentTheme = "dark";
    }
  }

  applyTheme(currentTheme, iconContainer);

  // ========================================================
  // CLICK TO TOGGLE
  // ========================================================

  themeButton.addEventListener("click", async (e) => {
    e.preventDefault();

    document.body.classList.toggle("theme-dark");
    const isDark = document.body.classList.contains("theme-dark");
    const newTheme = isDark ? "dark" : "light";

    // Update icon
    iconContainer.innerHTML = isDark ? ICONS.sun : ICONS.moon;

    // Save locally (instant)
    localStorage.setItem("theme", newTheme);

    // Save to DB (background)
    API.saveTheme(newTheme).catch(() => {});
  });
}

// ============================================================
// CONTACT FORM (optional basic)
// ============================================================



// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  setupMenuClose();
  setupContactForm();

  await setupThemeToggle(); // 👈 important
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
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // ✅ Prevent page refresh / navigation
    showToast("✅ Message sent successfully");

    // Optional: clear form fields
    form.reset();
  });