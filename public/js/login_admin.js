document.getElementById("adminForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value;
    const errorMsg = document.getElementById("errorMsg");
    const loginBtn = document.getElementById("loginBtn");

    errorMsg.textContent = "";

    if (!username || !password) {
        errorMsg.textContent = "Please enter both username and password.";
        return;
    }

    loginBtn.disabled  = true;
    loginBtn.innerHTML = `<span class="spinner"></span> Signing in…`;

    try {
        const res = await fetch("/api/admin/login", {
            method:      "POST",
            credentials: "include",
            headers:     { "Content-Type": "application/json" },
            body:        JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent = data.message || "Invalid credentials.";
            loginBtn.disabled    = false;
            loginBtn.textContent = "Sign In";
            return;
        }

        // success → redirect to admin dashboard
        window.location.href = "/admin/dashboard";

    } catch (err) {
        errorMsg.textContent = "Something went wrong. Please try again.";
        loginBtn.disabled    = false;
        loginBtn.textContent = "Sign In";
    }
});
