/* ============================================================
   navbar.js — shared across all pages
   Checks session via GET /api/profile.
   - Logged in  → profile icon stays, cart icon stays
   - Not logged → profile icon → Login button, cart icon hidden
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    const profileLink =
        document.querySelector('a[href="/serve/profile"][aria-label="Profile"]') ||
        document.querySelector('a[href="/serve/profile"]');

    const cartLink =
        document.querySelector('a[href="/serve/cart"][aria-label="Cart"]') ||
        document.querySelector('a[href="/serve/cart"]');

    if (!profileLink) return;

    try {
        const res = await fetch("/api/profile", { credentials: "include" });

        if (res.status === 401 || !res.ok) {
            // not logged in — swap profile to Login button
            const loginBtn = document.createElement("a");
            loginBtn.href        = "/login";
            loginBtn.className   = "nav-login-btn";
            loginBtn.textContent = "Login";
            loginBtn.setAttribute("aria-label", "Login");
            profileLink.replaceWith(loginBtn);

            // hide cart icon
            if (cartLink) cartLink.style.display = "none";
        }

    } catch (e) {
        // network error — leave as-is
    }

});
