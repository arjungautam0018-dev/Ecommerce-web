document.addEventListener("DOMContentLoaded", async () => {


/* ============================================================
   SECTION 1 — AUTH-AWARE FETCH
   All API calls go through apiFetch.
   401 → redirect to /login immediately.
   ============================================================ */

    async function apiFetch(url, options = {}) {
        const res = await fetch(url, { credentials: "include", ...options });
        if (res.status === 401) {
            window.location.href = "/login";
            throw new Error("Unauthenticated");
        }
        return res;
    }


/* ============================================================
   SECTION 2 — THEME TOGGLE
   Reads from localStorage, applies on load, toggles on click.
   ============================================================ */

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

    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
        const iconContainer = themeButton.querySelector(".icon");
        const savedTheme    = localStorage.getItem("theme") || "light";
        applyTheme(savedTheme);

        themeButton.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.toggle("theme-dark");
            const newTheme = document.body.classList.contains("theme-dark") ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            applyTheme(newTheme);
        });

        function applyTheme(theme) {
            if (theme === "dark") {
                document.body.classList.add("theme-dark");
                if (iconContainer) iconContainer.innerHTML = ICONS.moon;
            } else {
                document.body.classList.remove("theme-dark");
                if (iconContainer) iconContainer.innerHTML = ICONS.sun;
            }
        }
    }


/* ============================================================
   SECTION 3 — HAMBURGER MENU
   Toggles .show on .quickies, closes on outside click.
   ============================================================ */

    const hamburger = document.querySelector(".hamburger");
    const navMenu   = document.querySelector(".quickies");

    if (hamburger) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("show");
        });
    }

    document.addEventListener("click", (e) => {
        if (navMenu && hamburger && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove("show");
        }
    });


/* ============================================================
   SECTION 4 — PROFILE DATA FETCH
   GET /api/profile → normalized flat object from DB.
   ============================================================ */

    async function getProfile() {
        const res = await apiFetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
    }

    let profile, pendingProfile;

    try {
        profile        = await getProfile();
        pendingProfile = { ...profile };
    } catch (err) {
        console.error("[profile] load failed:", err);
        return;
    }


/* ============================================================
   SECTION 5 — HEADER / AVATAR SYNC
   Updates name, email, avatar letter, account type label.
   ============================================================ */

    function syncHeader(p) {
        const nameEl   = document.getElementById("profileNameHeading");
        const emailEl  = document.getElementById("profileEmailHeading");
        const avatarEl = document.getElementById("profileAvatarLetter");
        const roleEl   = document.getElementById("accountTypeText");

        if (nameEl)   nameEl.textContent   = p.fullName || "—";
        if (emailEl)  emailEl.textContent  = p.email    || "—";
        if (avatarEl) avatarEl.textContent = (p.fullName || "A")[0].toUpperCase();
        if (roleEl && p.role) {
            roleEl.innerText = "Account type: " + p.role.charAt(0).toUpperCase() + p.role.slice(1);
        }
    }

    syncHeader(profile);


/* ============================================================
   SECTION 6 — INLINE EDIT (personal info fields)
   .field-view elements are contentEditable.
   Any change populates pendingProfile and shows the save bar.
   ============================================================ */

    document.querySelectorAll(".field-view").forEach(el => {
        const key      = el.dataset.field;
        el.textContent = profile[key] || "—";
        el.contentEditable = true;

        el.addEventListener("input", () => {
            pendingProfile[key] = el.textContent.trim();
            showSaveBar();
        });
    });


/* ============================================================
   SECTION 7 — FLOATING SAVE BAR
   Hidden by default. Appears on any field change.
   Save → PUT /api/profile. Discard → re-fetch from DB.
   ============================================================ */

    let saveBar = document.getElementById("_floatingSaveBar");
    if (!saveBar) {
        saveBar = document.createElement("div");
        saveBar.id = "_floatingSaveBar";
        saveBar.innerHTML = `
            <button id="_discardBtn">Discard</button>
            <button id="_saveBtn">Save changes</button>
        `;
        document.body.appendChild(saveBar);
    }

    hideSaveBar();

    function showSaveBar() { saveBar.style.display = "flex"; }
    function hideSaveBar()  { saveBar.style.display = "none"; }

    const saveBtn    = saveBar.querySelector("#_saveBtn");
    const discardBtn = saveBar.querySelector("#_discardBtn");

    saveBtn.addEventListener("click", async () => {
        saveBtn.disabled    = true;
        saveBtn.textContent = "Saving…";
        try {
            const res = await apiFetch("/api/profile", {
                method:  "PUT",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(pendingProfile)
            });
            if (!res.ok) throw new Error("Save failed");
            profile = { ...pendingProfile };
            syncHeader(profile);
            hideSaveBar();
        } catch (err) {
            console.error("[save] error:", err);
            alert("Could not save changes. Please try again.");
        } finally {
            saveBtn.disabled    = false;
            saveBtn.textContent = "Save changes";
        }
    });

    discardBtn.addEventListener("click", async () => {
        try {
            profile        = await getProfile();
            pendingProfile = { ...profile };

            document.querySelectorAll(".field-view").forEach(el => {
                el.textContent = profile[el.dataset.field] || "—";
            });
            syncHeader(profile);

            // restore address dropdowns
            if (provinceSelect)     provinceSelect.value     = profile.province       || "";
            if (districtSelect)     districtSelect.value     = profile.district       || "";
            if (municipalitySelect) municipalitySelect.value = profile.municipality   || "";
            if (wardInput)          wardInput.value          = profile.ward           || "";
            if (detailsInput)       detailsInput.value       = profile.addressDetails || "";
            if (profile.province)   populateDistricts(profile.province);
            if (profile.district)   populateMunicipalities(profile.province, profile.district);
            updateAddressStatus();

            hideSaveBar();
        } catch (err) {
            console.error("[discard] error:", err);
        }
    });


/* ============================================================
   SECTION 8 — ACCOUNT TYPE SWITCH POPUP
   Shows a modal asking for new role details + current password.
   Fields shown depend on target role (freelancer/studio need
   extra fields: pan, location; customer just needs basics).
   On confirm → PUT /api/profile/role → re-fetch profile.
   ============================================================ */

    // new role fields per target role
    const ROLE_FIELDS = {
        customer: [
            { key: "fullName", label: "Full Name",    type: "text",     placeholder: "Your full name" },
            { key: "email",    label: "Email",        type: "email",    placeholder: "your@email.com" },
            { key: "phone",    label: "Phone",        type: "tel",      placeholder: "+977 98XXXXXXXX" },
            { key: "password", label: "New Password", type: "password", placeholder: "Password for new account" },
        ],
        freelancer: [
            { key: "fullName", label: "Full Name",    type: "text",     placeholder: "Your full name" },
            { key: "email",    label: "Email",        type: "email",    placeholder: "your@email.com" },
            { key: "phone",    label: "Phone",        type: "tel",      placeholder: "+977 98XXXXXXXX" },
            { key: "pan",      label: "PAN Number",   type: "text",     placeholder: "e.g. 123456789" },
            { key: "location", label: "Location",     type: "text",     placeholder: "City, District" },
            { key: "password", label: "New Password", type: "password", placeholder: "Password for new account" },
        ],
        studio: [
            { key: "fullName", label: "Studio Name",  type: "text",     placeholder: "Your studio name" },
            { key: "email",    label: "Studio Email", type: "email",    placeholder: "studio@email.com" },
            { key: "phone",    label: "Studio Phone", type: "tel",      placeholder: "+977 98XXXXXXXX" },
            { key: "pan",      label: "PAN Number",   type: "text",     placeholder: "e.g. 123456789" },
            { key: "location", label: "Location",     type: "text",     placeholder: "City, District" },
            { key: "password", label: "New Password", type: "password", placeholder: "Password for new account" },
        ],
    };

    function buildRolePopup(targetRole) {
        const existing = document.getElementById("_rolePopupOverlay");
        if (existing) existing.remove();

        const label      = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
        const newFields  = ROLE_FIELDS[targetRole] || [];

        const newFieldsHTML = newFields.map(f => `
            <div class="popup-field">
                <label class="popup-label">${f.label}</label>
                <input class="popup-input field-input" type="${f.type}" data-key="${f.key}" placeholder="${f.placeholder}" />
            </div>
        `).join("");

        const overlay = document.createElement("div");
        overlay.id        = "_rolePopupOverlay";
        overlay.className = "popup-overlay";
        overlay.innerHTML = `
            <div class="popup-card" role="dialog" aria-modal="true">

                <div class="popup-header">
                    <h3 class="popup-title">Switch to ${label}</h3>
                    <p class="popup-subtitle">Verify your identity, then fill in your new account details. Your current account will be deleted.</p>
                </div>

                <div class="popup-body">

                    <div class="popup-section-label">Verify current account</div>
                    <div class="popup-field">
                        <label class="popup-label">Current Password</label>
                        <input class="popup-input field-input" type="password" id="_currentPasswordInput" placeholder="Enter your current password" />
                    </div>

                    <div class="popup-divider"></div>

                    <div class="popup-section-label">New ${label} account details</div>
                    ${newFieldsHTML}

                    <p class="popup-warning">⚠ This will permanently delete your current account and create a new one.</p>
                </div>

                <div class="popup-footer">
                    <button class="popup-btn-cancel" id="_popupCancel">Cancel</button>
                    <button class="popup-btn-confirm" id="_popupConfirm">Switch Account</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById("_popupCancel").addEventListener("click", () => overlay.remove());

        document.getElementById("_popupConfirm").addEventListener("click", async () => {
            const confirmBtn      = document.getElementById("_popupConfirm");
            const currentPassword = document.getElementById("_currentPasswordInput").value.trim();
            const roleData        = {};

            overlay.querySelectorAll(".popup-input[data-key]").forEach(inp => {
                roleData[inp.dataset.key] = inp.value.trim();
            });

            // validation
            if (!currentPassword) {
                document.getElementById("_currentPasswordInput").focus();
                return;
            }
            if (!roleData.email || !roleData.password) {
                alert("Email and new password are required.");
                return;
            }

            confirmBtn.disabled    = true;
            confirmBtn.textContent = "Switching…";

            try {
                const res = await apiFetch("/api/profile/switch-role", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ newRole: targetRole, currentPassword, ...roleData })
                });

                if (!res.ok) {
                    const err = await res.json();
                    // show error near current password field if wrong password
                    if (res.status === 401) {
                        const pwInput = document.getElementById("_currentPasswordInput");
                        pwInput.style.borderColor = "#ef4444";
                        pwInput.style.boxShadow   = "0 0 0 3px rgba(239,68,68,0.2)";
                        pwInput.placeholder       = err.message;
                        pwInput.value             = "";
                        pwInput.focus();
                    } else {
                        alert(err.message || "Failed to switch account.");
                    }
                    confirmBtn.disabled    = false;
                    confirmBtn.textContent = "Switch Account";
                    return;
                }

                overlay.remove();
                document.getElementById("accountMenu")?.classList.remove("show");

                // re-fetch profile with new account data
                profile        = await getProfile();
                pendingProfile = { ...profile };
                document.querySelectorAll(".field-view").forEach(el => {
                    el.textContent = profile[el.dataset.field] || "—";
                });
                syncHeader(profile);

            } catch (err) {
                console.error("[roleSwitch] error:", err);
                confirmBtn.disabled    = false;
                confirmBtn.textContent = "Switch Account";
            }
        });
    }

    window.toggleAccountDropdown = function () {
        document.getElementById("accountMenu")?.classList.toggle("show");
    };

    window.changeAccountType = function (type) {
        const roleMap = { "Customer": "customer", "Freelancer": "freelancer", "Studio": "studio" };
        const newRole = roleMap[type];
        if (!newRole || newRole === profile.role) return;
        document.getElementById("accountMenu")?.classList.remove("show");
        buildRolePopup(newRole);
    };


/* ============================================================
   SECTION 9 — STATS (cart count, account age)
   Cart count from /api/cart. Age from profile.createdAt.
   ============================================================ */

    async function loadStats() {
        try {
            const res = await apiFetch("/api/cart");
            if (res.ok) {
                const { cart } = await res.json();
                const total = (cart?.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
                const el = document.getElementById("statOrders");
                if (el) el.textContent = total;
            }
        } catch (e) { /* handled by apiFetch */ }

        try {
            if (profile.createdAt) {
                const months = Math.max(1, Math.round(
                    (Date.now() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24 * 30)
                ));
                const el = document.getElementById("statAge");
                if (el) el.textContent = months === 1 ? "1 month" : months + " months";
            }
        } catch (e) { /* ignore */ }
    }

    await loadStats();


/* ============================================================
   SECTION 10 — DELIVERY ADDRESS
   Fetches saved address from /api/address/fetch.
   Loads province/district/municipality from /api/nepal-data.
   Cascades dropdowns. Saves via /api/address/save.
   Changes trigger the floating save bar.
   ============================================================ */

    const provinceSelect     = document.getElementById("provinceInput");
    const districtSelect     = document.getElementById("districtInput");
    const municipalitySelect = document.getElementById("municipalityInput");
    const wardInput          = document.getElementById("wardInput");
    const detailsInput       = document.getElementById("detailsInput");
    const addressStatus      = document.getElementById("addressStatus");

    let addressData    = [];
    let savedAddress   = {};
    let pendingAddress = {};

    function updateAddressStatus() {
        const filled = provinceSelect?.value && districtSelect?.value && municipalitySelect?.value;
        if (addressStatus) {
            addressStatus.textContent      = filled ? "Saved"   : "Missing";
            addressStatus.style.background = filled ? "#dcfce7" : "";
            addressStatus.style.color      = filled ? "#16a34a" : "";
        }
    }

    function populateDistricts(provinceName) {
        const province = addressData.find(p => p.name === provinceName);
        districtSelect.innerHTML     = `<option value="">Select District</option>`;
        municipalitySelect.innerHTML = `<option value="">Select Municipality</option>`;
        province?.districtList.forEach(d => {
            const opt = document.createElement("option");
            opt.value = opt.textContent = d.name;
            districtSelect.appendChild(opt);
        });
    }

    function populateMunicipalities(provinceName, districtName) {
        const province = addressData.find(p => p.name === provinceName);
        const district = province?.districtList.find(d => d.name === districtName);
        municipalitySelect.innerHTML = `<option value="">Select Municipality</option>`;
        district?.municipalityList.forEach(m => {
            const opt = document.createElement("option");
            opt.value = opt.textContent = m.name;
            municipalitySelect.appendChild(opt);
        });
    }

    async function loadAddress() {
        try {
            // load nepal geo data
            const geoRes  = await fetch("/api/nepal-data");
            const geoData = await geoRes.json();
            addressData   = geoData.provinceList || [];

            provinceSelect.innerHTML = `<option value="">Select Province</option>`;
            addressData.forEach(p => {
                const opt = document.createElement("option");
                opt.value = opt.textContent = p.name;
                provinceSelect.appendChild(opt);
            });

            // fetch saved address from DB
            const addrRes  = await apiFetch("/api/address/fetch");
            const addrData = await addrRes.json();
            savedAddress   = addrData.deliveryAddress || {};
            pendingAddress = { ...savedAddress };

            // restore saved values
            if (savedAddress.province) {
                provinceSelect.value = savedAddress.province;
                populateDistricts(savedAddress.province);
            }
            if (savedAddress.district) {
                districtSelect.value = savedAddress.district;
                populateMunicipalities(savedAddress.province, savedAddress.district);
            }
            if (savedAddress.municipality) municipalitySelect.value = savedAddress.municipality;
            if (savedAddress.ward)         wardInput.value          = savedAddress.ward;
            if (savedAddress.addressDetails) detailsInput.value     = savedAddress.addressDetails;

            updateAddressStatus();
        } catch (err) {
            console.error("[loadAddress] error:", err);
        }
    }

    // address save bar (separate from profile save bar)
    let addrSaveBar = document.getElementById("_addrSaveBar");
    if (!addrSaveBar) {
        addrSaveBar = document.createElement("div");
        addrSaveBar.id = "_addrSaveBar";
        addrSaveBar.innerHTML = `
            <span class="addr-save-label">Delivery address changed</span>
            <button id="_addrDiscardBtn">Discard</button>
            <button id="_addrSaveBtn">Save Address</button>
        `;
        document.body.appendChild(addrSaveBar);
    }
    addrSaveBar.style.display = "none";

    function showAddrBar() { addrSaveBar.style.display = "flex"; }
    function hideAddrBar() { addrSaveBar.style.display = "none"; }

    document.getElementById("_addrSaveBtn").addEventListener("click", async () => {
        const btn = document.getElementById("_addrSaveBtn");
        btn.disabled    = true;
        btn.textContent = "Saving…";
        try {
            const res = await apiFetch("/api/address/save", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(pendingAddress)
            });
            if (!res.ok) throw new Error("Address save failed");
            savedAddress = { ...pendingAddress };
            updateAddressStatus();
            hideAddrBar();
        } catch (err) {
            console.error("[address save] error:", err);
            alert("Could not save address. Please try again.");
        } finally {
            btn.disabled    = false;
            btn.textContent = "Save Address";
        }
    });

    document.getElementById("_addrDiscardBtn").addEventListener("click", () => {
        pendingAddress = { ...savedAddress };
        provinceSelect.value     = savedAddress.province       || "";
        districtSelect.value     = savedAddress.district       || "";
        municipalitySelect.value = savedAddress.municipality   || "";
        wardInput.value          = savedAddress.ward           || "";
        detailsInput.value       = savedAddress.addressDetails || "";
        if (savedAddress.province) populateDistricts(savedAddress.province);
        if (savedAddress.district) populateMunicipalities(savedAddress.province, savedAddress.district);
        updateAddressStatus();
        hideAddrBar();
    });

    provinceSelect?.addEventListener("change", () => {
        populateDistricts(provinceSelect.value);
        pendingAddress.province     = provinceSelect.value;
        pendingAddress.district     = "";
        pendingAddress.municipality = "";
        showAddrBar();
        updateAddressStatus();
    });

    districtSelect?.addEventListener("change", () => {
        populateMunicipalities(provinceSelect.value, districtSelect.value);
        pendingAddress.district     = districtSelect.value;
        pendingAddress.municipality = "";
        showAddrBar();
        updateAddressStatus();
    });

    municipalitySelect?.addEventListener("change", () => {
        pendingAddress.municipality = municipalitySelect.value;
        showAddrBar();
        updateAddressStatus();
    });

    wardInput?.addEventListener("input", () => {
        pendingAddress.ward = wardInput.value;
        showAddrBar();
    });

    detailsInput?.addEventListener("input", () => {
        pendingAddress.addressDetails = detailsInput.value;
        showAddrBar();
    });

    await loadAddress();


});
