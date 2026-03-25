document.addEventListener("DOMContentLoaded",()=>{
const themeButton = document.querySelector(".theme-toggle");  if (!themeButton) return;
    if (localStorage.getItem("theme") === "dark") document.body.classList.add("theme-dark");
    themeButton?.addEventListener("click", function(event){
        event.preventDefault();
        document.body.classList.toggle("theme-dark");
        localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
    });

    function toggleMenu() {
        document.querySelector(".quickies").classList.toggle("show");
    }
    document.querySelector(".hamburger").addEventListener('click', toggleMenu);
    
    document.addEventListener("click", function(e){
        const menu = document.querySelector(".quickies");
        const hamburger = document.querySelector(".hamburger");
        
        if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("show");
        }
    });

    const STORAGE_KEYS = {
        profile: "profile",
        cart: "cart",
        wishlist: "wishlist"
    };

    const elements = {
        editBtn: document.getElementById("editProfileBtn"),
        cancelBtn: document.getElementById("cancelEditBtn"),
        saveBtn: document.getElementById("saveProfileBtn"),
        editActions: document.getElementById("editActions"),
        cameraBtn: document.getElementById("avatarCameraBtn"),

        nameHeading: document.getElementById("profileNameHeading"),
        emailHeading: document.getElementById("profileEmailHeading"),
        avatarLetter: document.getElementById("profileAvatarLetter"),

        statOrders: document.getElementById("statOrders"),
        statWishlist: document.getElementById("statWishlist"),
        statAge: document.getElementById("statAge"),

        inputs: {
            fullName: document.getElementById("fullNameInput"),
            email: document.getElementById("emailInput"),
            phone: document.getElementById("phoneInput"),
            address: document.getElementById("addressInput")
        },

        views: Array.from(document.querySelectorAll(".field-view")),
        inputEls: Array.from(document.querySelectorAll(".field-input"))
    };

    const defaultProfile = {
        fullName: "Abhishek",
        email: "abhishek@example.com",
        phone: "+977 98XXXXXXXX",
        address: "Kathmandu, Nepal",
        memberSince: "Feb 2026"
    };

    function readJson(key, fallback){
        try{
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        }catch{
            return fallback;
        }
    }

    function writeJson(key, value){
        try{
            localStorage.setItem(key, JSON.stringify(value));
        }catch{
            // ignore storage quota / privacy mode failures
        }
    }

    function getProfileFromStorage(){
        const stored = readJson(STORAGE_KEYS.profile, null);
        if (!stored || typeof stored !== "object") return { ...defaultProfile };
        return { ...defaultProfile, ...stored };
    }

    function setInputs(profile){
        if (elements.inputs.fullName) elements.inputs.fullName.value = profile.fullName || "";
        if (elements.inputs.email) elements.inputs.email.value = profile.email || "";
        if (elements.inputs.phone) elements.inputs.phone.value = profile.phone || "";
        if (elements.inputs.address) elements.inputs.address.value = profile.address || "";
    }

    function getInputs(){
        return {
            fullName: (elements.inputs.fullName ? elements.inputs.fullName.value : "").trim(),
            email: (elements.inputs.email ? elements.inputs.email.value : "").trim(),
            phone: (elements.inputs.phone ? elements.inputs.phone.value : "").trim(),
            address: (elements.inputs.address ? elements.inputs.address.value : "").trim()
        };
    }

    function renderProfile(profile){
        const safeName = profile.fullName || "My Profile";
        const safeEmail = profile.email || "";

        if (elements.nameHeading) elements.nameHeading.textContent = safeName;
        if (elements.emailHeading) elements.emailHeading.textContent = safeEmail;

        const letterSource = (profile.fullName || profile.email || "A").trim();
        const letter = letterSource ? letterSource.charAt(0).toUpperCase() : "A";
        if (elements.avatarLetter) elements.avatarLetter.textContent = letter;

        const fields = {
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            address: profile.address
        };

        elements.views.forEach(viewEl => {
            const key = viewEl.getAttribute("data-field");
            if (!key) return;
            viewEl.textContent = fields[key] ? String(fields[key]) : "—";
        });
    }

    function updateStats(){
        const cart = readJson(STORAGE_KEYS.cart, []);
        const wishlist = readJson(STORAGE_KEYS.wishlist, []);

        const totalOrders = Array.isArray(cart) ? cart.length : 0;
        const wishlistItems = Array.isArray(wishlist) ? wishlist.length : 0;

        if (elements.statOrders) elements.statOrders.textContent = String(totalOrders);
        if (elements.statWishlist) elements.statWishlist.textContent = String(wishlistItems);

        if (elements.statAge){
            // Keep your current placeholder unless you add real dates later
            if (!elements.statAge.textContent || elements.statAge.textContent.trim() === "") {
                elements.statAge.textContent = "1 month";
            }
        }
    }

    let isEditing = false;
    let lastSavedProfile = getProfileFromStorage();

    function setEditing(on){
        isEditing = on;

        if (elements.editBtn) elements.editBtn.hidden = on;
        if (elements.editActions) elements.editActions.hidden = !on;
        if (elements.cameraBtn) elements.cameraBtn.hidden = !on;

        elements.views.forEach(el => { el.hidden = on; });
        elements.inputEls.forEach(el => { el.hidden = !on; });

        if (on && elements.inputs.fullName) elements.inputs.fullName.focus();
    }

    function saveProfile(){
        const inputValues = getInputs();
        const merged = { ...lastSavedProfile, ...inputValues };
        lastSavedProfile = merged;

        writeJson(STORAGE_KEYS.profile, merged);
        renderProfile(merged);
        setEditing(false);
    }

    function cancelEdit(){
        setInputs(lastSavedProfile);
        renderProfile(lastSavedProfile);
        setEditing(false);
    }

    function initProfile(){
        const profile = getProfileFromStorage();
        lastSavedProfile = profile;

        setInputs(profile);
        renderProfile(profile);
        updateStats();
        setEditing(false);
    }

    if (elements.editBtn) elements.editBtn.addEventListener("click", function(){ setEditing(true); });
    if (elements.cancelBtn) elements.cancelBtn.addEventListener("click", cancelEdit);
    if (elements.saveBtn) elements.saveBtn.addEventListener("click", saveProfile);

    elements.inputEls.forEach(function(input){
        input.addEventListener("input", function(){
            if (!isEditing) return;
            renderProfile(getInputs());
        });
    });

    if (elements.cameraBtn){
        elements.cameraBtn.addEventListener("click", function(){
            // Placeholder for photo upload flow
            elements.cameraBtn.blur();
        });
    }

    initProfile();
})