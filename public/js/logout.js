// Shared logout — used by all pages.
// POSTs to /api/logout to destroy the session server-side,
// then redirects to /login.
async function logout() {
    try {
        await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (e) {
        // even if fetch fails, redirect anyway
    }
    window.location.href = "/login";
}

// Make .logout-btn look identical to the quickies <a> links
(function () {
    const style = document.createElement("style");
    style.textContent = `
        .logout-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            padding: 14px 16px;
            font-size: 0.8rem;
            font-family: inherit;
            text-decoration: none;
            color: #333;
            background: none;
            border: none;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            cursor: pointer;
            text-align: left;
        }
        .logout-btn:hover { background: #f5f5f5; }
        .logout-btn:active { background: #ececec; }
        body.theme-dark .logout-btn { color: #f87171; background: none; border-bottom-color: rgba(255,255,255,0.1); }
        body.theme-dark .logout-btn:hover { background: rgba(255,255,255,0.06); border-radius: 8px; }

        /* nav login button — shown when not logged in */
        .nav-login-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            background: linear-gradient(135deg, #021024, #5483B3);
            color: #fff !important;
            font-size: 0.85rem;
            font-weight: 700;
            font-family: inherit;
            border-radius: 10px;
            text-decoration: none;
            letter-spacing: 0.02em;
            transition: box-shadow 0.2s ease, transform 0.12s ease;
            box-shadow: 0 4px 14px rgba(2,16,36,0.25);
        }
        .nav-login-btn:hover {
            box-shadow: 0 8px 22px rgba(2,16,36,0.35);
            transform: translateY(-1px);
        }
        .nav-login-btn:active { transform: scale(0.97); }
        body.theme-dark .nav-login-btn {
            background: linear-gradient(135deg, #2563eb, #1e3a8a);
            box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        }
    `;
    document.head.appendChild(style);
})();
