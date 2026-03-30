const accountDropdown = document.getElementById("account_type");

// Use querySelector to get the single element directly
const customerForm = document.querySelector(".customerForm");
const studioForm = document.querySelector(".studioForm");
const freelancerForm = document.querySelector(".freelancerForm");

// Create an array to manage them easily
const forms = [customerForm, studioForm, freelancerForm];

accountDropdown.addEventListener("change", function() {
    const value = this.value;

    // 1. Hide all forms
    forms.forEach(form => {
        if(form) form.style.display = "none";
    });

    // 2. Show the selected form
    if (value === "customer") customerForm.style.display = "flex";
    else if (value === "studio") studioForm.style.display = "flex";
    else if (value === "freelancer") freelancerForm.style.display = "flex";
});


// Show toast function
function showToast(message, type = "info", duration = 3000) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.className = `toast ${type}`;
  toast.style = `
    margin-top: 10px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    background-color: ${type === "success" ? "green" : type === "error" ? "red" : "blue"};
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  document.getElementById("toast-container").appendChild(toast);

  // Fade in
  setTimeout(() => toast.style.opacity = 1, 50);

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    // ✅ Password match check
    let allMatch = true;
    const passwordFields = document.querySelectorAll(".password-input");
    const confirmFields = document.querySelectorAll(".confirm-password-input");

    confirmFields.forEach(confirmField => {
        const pairId = confirmField.dataset.pair;
        const passwordField = document.querySelector(`.password-input[data-pair="${pairId}"]`);
        const errorMsg = confirmField.nextElementSibling;

        if(passwordField.value !== confirmField.value) {
            allMatch = false;
            errorMsg.style.display = "block";
        } else {
            errorMsg.style.display = "none";
        }
    });

    if(!allMatch){
        alert("Please make sure all passwords match!");
        return; // stop submission
    }

    // ✅ Form submission via fetch
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        showToast(result.message, result.type, 4000);

        if(result.redirect){
            setTimeout(() => window.location.href = result.redirect, result.delay || 3000);
        }
    } catch(err) {
        showToast("Failed to submit form.", "error", 4000);
        console.error(err);
    }
});