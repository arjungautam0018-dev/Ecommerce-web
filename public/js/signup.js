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