/* ============================================================
   navbar.js — shared across all pages
   Checks session via GET /api/profile.
   - Logged in  → profile icon stays → /serve/profile
   - Not logged → replaces profile icon with a Login button
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    const profileLink =
        document.querySelector('a[href="/serve/profile"][aria-label="Profile"]') ||
        document.querySelector('a[href="/serve/profile"]');

    if (!profileLink) return;

    try {
        const res = await fetch("/api/profile", { credentials: "include" });

        if (res.status === 401 || !res.ok) {
            // replace profile icon with a Login button
            const loginBtn = document.createElement("a");
            loginBtn.href      = "/login";
            loginBtn.className = "nav-login-btn";
            loginBtn.textContent = "Login";
            loginBtn.setAttribute("aria-label", "Login");
            profileLink.replaceWith(loginBtn);
        }

    } catch (e) {
        // network error — leave as-is
    }

});
