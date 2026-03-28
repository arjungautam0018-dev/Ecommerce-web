document.addEventListener("DOMContentLoaded", () => {
    // ─── Theme ───────────────────────────────────────────────────────────────
    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
        if (localStorage.getItem("theme") === "dark") document.body.classList.add("theme-dark");
        themeButton.addEventListener("click", function (event) {
            event.preventDefault();
            document.body.classList.toggle("theme-dark");
            localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
        });
    }

    // ─── Hamburger ───────────────────────────────────────────────────────────
    function toggleMenu() {
        document.querySelector(".quickies").classList.toggle("show");
    }
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) hamburger.addEventListener("click", toggleMenu);

    document.addEventListener("click", function (e) {
        const menu = document.querySelector(".quickies");
        const hamburger = document.querySelector(".hamburger");
        if (menu && hamburger && !hamburger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("show");
        }
    });

    // ─── Account Dropdown ────────────────────────────────────────────────────
    window.toggleAccountDropdown = function () {
        document.getElementById("accountMenu").classList.toggle("show");
    };
    window.changeAccountType = function (type) {
        const confirmChange = confirm(
            "⚠️ Changing account type may affect your features.\n\nAre you sure you want to switch to " + type + "?"
        );
        if (!confirmChange) return;
        document.getElementById("accountTypeText").innerText = "Account type: " + type;
        document.getElementById("accountMenu").classList.remove("show");
    };

    // ─── Storage helpers ─────────────────────────────────────────────────────
    const STORAGE_KEYS = { profile: "profile", cart: "cart", wishlist: "wishlist" };

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    }

    function writeJson(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
    }

    // ─── Default / Load profile ──────────────────────────────────────────────
    const defaultProfile = {
        fullName: "Abhishek",
        email: "abhishek@example.com",
        phone: "+977 98XXXXXXXX",
        address: "Kathmandu, Nepal",
        memberSince: "Feb 2026"
    };

    function getProfile() {
        const stored = readJson(STORAGE_KEYS.profile, null);
        if (!stored || typeof stored !== "object") return { ...defaultProfile };
        return { ...defaultProfile, ...stored };
    }

    // ─── Floating Save Bar ───────────────────────────────────────────────────
    // Created once, hidden until changes exist
    let saveBar = document.getElementById("_floatingSaveBar");
    if (!saveBar) {
        saveBar = document.createElement("div");
        saveBar.id = "_floatingSaveBar";
        saveBar.innerHTML = `
            <span style="font-size:0.9rem;font-weight:600;color:var(--fg,#021024)">You have unsaved changes</span>
            <div style="display:flex;gap:10px">
                <button id="_discardBtn" style="
                    padding:0 18px;height:40px;border-radius:12px;border:1px solid var(--border,rgba(2,16,36,0.10));
                    background:rgba(255,255,255,0.85);font-weight:650;cursor:pointer;font-size:0.88rem;
                ">Discard</button>
                <button id="_saveBtn" style="
                    padding:0 22px;height:40px;border-radius:12px;border:none;
                    background:linear-gradient(135deg,#021024,#052659,#5483B3);color:#fff;
                    font-weight:700;cursor:pointer;font-size:0.88rem;
                    box-shadow:0 8px 24px rgba(2,16,36,0.28);
                ">Save changes</button>
            </div>`;
        Object.assign(saveBar.style, {
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%) translateY(120%)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(2,16,36,0.10)",
            borderRadius: "18px",
            boxShadow: "0 18px 50px rgba(2,16,36,0.18)",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: "9999",
            transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)",
            whiteSpace: "nowrap"
        });
        document.body.appendChild(saveBar);
    }

    let hasChanges = false;

    function showSaveBar() {
        hasChanges = true;
        saveBar.style.transform = "translateX(-50%) translateY(0)";
    }

    function hideSaveBar() {
        hasChanges = false;
        saveBar.style.transform = "translateX(-50%) translateY(120%)";
    }

    // ─── Inline editable field factory ───────────────────────────────────────
    // Converts a .field-view element into a content-editable span that looks
    // identical to the read-only view but can be clicked to edit.
    function makeInlineEditable(viewEl, fieldKey, onChangeCallback) {
        viewEl.setAttribute("contenteditable", "true");
        viewEl.setAttribute("spellcheck", "false");
        viewEl.setAttribute("autocorrect", "off");

        // Subtle visual cue on hover/focus without breaking layout
        const hoverStyle = `
            cursor: text;
            transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        `;
        viewEl.setAttribute("style", hoverStyle);

        viewEl.addEventListener("mouseenter", () => {
            if (document.activeElement !== viewEl)
                viewEl.style.boxShadow = "inset 0 0 0 2px rgba(84,131,179,0.30)";
        });
        viewEl.addEventListener("mouseleave", () => {
            if (document.activeElement !== viewEl)
                viewEl.style.boxShadow = "";
        });
        viewEl.addEventListener("focus", () => {
            viewEl.style.boxShadow = "0 0 0 4px rgba(84,131,179,0.30)";
            viewEl.style.borderColor = "rgba(5,38,89,0.65)";
            viewEl.style.background = "rgba(255,255,255,0.95)";
            // Select all text on focus for easy replace
            const range = document.createRange();
            range.selectNodeContents(viewEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        });
        viewEl.addEventListener("blur", () => {
            viewEl.style.boxShadow = "";
            viewEl.style.borderColor = "";
            viewEl.style.background = "";
        });
        viewEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); viewEl.blur(); }
        });
        viewEl.addEventListener("input", () => {
            onChangeCallback(fieldKey, viewEl.textContent.trim());
            showSaveBar();
        });
    }

    // ─── Init personal info fields ───────────────────────────────────────────
    const profile = getProfile();
    let pendingProfile = { ...profile };

    // Sync heading + avatar letter
    function syncHeader(p) {
        const nameEl = document.getElementById("profileNameHeading");
        const emailEl = document.getElementById("profileEmailHeading");
        const letterEl = document.getElementById("profileAvatarLetter");
        if (nameEl) nameEl.textContent = p.fullName || "My Profile";
        if (emailEl) emailEl.textContent = p.email || "";
        if (letterEl) letterEl.textContent = ((p.fullName || p.email || "A").trim().charAt(0) || "A").toUpperCase();
    }

    // Find all personal info .field-view elements and wire them up
    const personalViews = document.querySelectorAll(".card .field-view, .fields-grid .field-view");
    personalViews.forEach(viewEl => {
        const key = viewEl.getAttribute("data-field");
        if (!key || !["fullName", "email", "phone", "address"].includes(key)) return;

        // Set initial value
        viewEl.textContent = profile[key] || "—";

        // Hide the paired hidden input (we no longer need it for input)
        const inputId = { fullName: "fullNameInput", email: "emailInput", phone: "phoneInput", address: "addressInput" }[key];
        const inputEl = inputId ? document.getElementById(inputId) : null;
        if (inputEl) inputEl.hidden = true;

        makeInlineEditable(viewEl, key, (k, val) => {
            pendingProfile[k] = val;
            // Live-update header if name/email changed
            if (k === "fullName" || k === "email") syncHeader(pendingProfile);
        });
    });

    // Initial header render
    syncHeader(profile);

    // ─── Stats ───────────────────────────────────────────────────────────────
    function updateStats() {
        const cart = readJson(STORAGE_KEYS.cart, []);
        const wishlist = readJson(STORAGE_KEYS.wishlist, []);
        const ordersEl = document.getElementById("statOrders");
        const wishlistEl = document.getElementById("statWishlist");
        if (ordersEl) ordersEl.textContent = String(Array.isArray(cart) ? cart.length : 0);
        if (wishlistEl) wishlistEl.textContent = String(Array.isArray(wishlist) ? wishlist.length : 0);
    }
    updateStats();

    // ─── Save / Discard ──────────────────────────────────────────────────────
    document.getElementById("_saveBtn").addEventListener("click", () => {
        writeJson(STORAGE_KEYS.profile, pendingProfile);
        syncHeader(pendingProfile);
        hideSaveBar();
    });

    document.getElementById("_discardBtn").addEventListener("click", () => {
        // Restore all personal info views to last saved
        const saved = getProfile();
        pendingProfile = { ...saved };
        personalViews.forEach(viewEl => {
            const key = viewEl.getAttribute("data-field");
            if (key && saved[key] !== undefined) viewEl.textContent = saved[key] || "—";
        });
        syncHeader(saved);

        // Restore address views
        restoreAddressViews();

        hideSaveBar();
    });

    // ─── Address section ─────────────────────────────────────────────────────
    const provinceSelect = document.getElementById("provinceInput");
    const districtSelect = document.getElementById("districtInput");
    const municipalitySelect = document.getElementById("municipalityInput");
    const wardInput = document.getElementById("wardInput");
    const detailsInput = document.getElementById("detailsInput");

    // The old Edit button — keep it but hide it (layout preserved, just invisible)
    const oldEditBtn = document.getElementById("editBtn");
    if (oldEditBtn) oldEditBtn.style.display = "none";

    // Remove old save button if rendered from previous session
    const oldSaveBtn = document.getElementById("saveBtn");
    if (oldSaveBtn) oldSaveBtn.style.display = "none";

    let addressData = [];
    let savedAddress = readJson("deliveryAddress", null);

    // Stored address state
    let pendingAddress = savedAddress ? { ...savedAddress } : {
        province: "", district: "", municipality: "", ward: "", addressDetails: ""
    };

    function getAddressView(field) {
        return document.querySelector(`.profile-section .field-view[data-field="${field}"]`);
    }

    function setAddressView(field, value) {
        const el = getAddressView(field);
        if (el) el.textContent = value || "Missing";
    }

    function restoreAddressViews() {
        const addr = savedAddress || { province: "", district: "", municipality: "", ward: "", addressDetails: "" };
        setAddressView("province", addr.province || "—");
        setAddressView("district", addr.district || "Missing");
        setAddressView("municipality", addr.municipality || "Missing");
        setAddressView("ward", addr.ward || "Missing");
        setAddressView("addressDetails", addr.addressDetails || "Missing");

        // Reset selects
        if (provinceSelect) provinceSelect.value = addr.province || "";
        if (districtSelect) districtSelect.value = addr.district || "";
        if (municipalitySelect) municipalitySelect.value = addr.municipality || "";
        if (wardInput) wardInput.value = addr.ward || "";
        if (detailsInput) detailsInput.value = addr.addressDetails || "";
    }

    // Make address view-spans inline-editable for ward & details (free text)
    // For province/district/municipality we show the select inline on click

    function makeAddressSelectEditable(viewEl, selectEl, field, onPopulate) {
        if (!viewEl || !selectEl) return;
        viewEl.style.cursor = "pointer";
        viewEl.style.transition = "box-shadow 0.2s, background 0.2s";
        viewEl.addEventListener("mouseenter", () => {
            viewEl.style.boxShadow = "inset 0 0 0 2px rgba(84,131,179,0.30)";
        });
        viewEl.addEventListener("mouseleave", () => {
            viewEl.style.boxShadow = "";
        });
        viewEl.addEventListener("click", () => {
            // Swap: hide span, show select, focus it
            viewEl.style.display = "none";
            selectEl.hidden = false;
            if (onPopulate) onPopulate();
            selectEl.focus();
            selectEl.addEventListener("blur", () => {
                selectEl.hidden = true;
                viewEl.style.display = "";
            }, { once: true });
        });
        selectEl.addEventListener("change", () => {
            setAddressView(field, selectEl.value);
            pendingAddress[field] = selectEl.value;
            showSaveBar();
        });
    }

    function makeAddressInputEditable(viewEl, inputEl, field) {
        if (!viewEl || !inputEl) return;
        makeInlineEditable(viewEl, field, (k, val) => {
            pendingAddress[k] = val;
            showSaveBar();
        });
        // Also wire the hidden input for sync
        inputEl.addEventListener("change", () => {
            setAddressView(field, inputEl.value);
            pendingAddress[field] = inputEl.value;
            showSaveBar();
        });
    }

    // Wire address selects as click-to-open selects
    makeAddressSelectEditable(
        getAddressView("province"), provinceSelect, "province",
        () => { /* already populated */ }
    );
    makeAddressSelectEditable(
        getAddressView("district"), districtSelect, "district",
        () => { /* already populated after province change */ }
    );
    makeAddressSelectEditable(
        getAddressView("municipality"), municipalitySelect, "municipality",
        () => { /* already populated after district change */ }
    );

    // Ward & address details — free text inline edit
    makeAddressInputEditable(getAddressView("ward"), wardInput, "ward");
    makeAddressInputEditable(getAddressView("addressDetails"), detailsInput, "addressDetails");

    // Province → districts
    if (provinceSelect) {
        provinceSelect.addEventListener("change", () => {
            const selectedProvince = addressData.find(p => p.name === provinceSelect.value);
            if (districtSelect) {
                districtSelect.innerHTML = "<option value='' disabled selected>Select District</option>";
            }
            if (municipalitySelect) {
                municipalitySelect.innerHTML = "<option value='' disabled selected>Select Municipality</option>";
            }
            if (selectedProvince && districtSelect) {
                selectedProvince.districtList.forEach(district => {
                    const opt = document.createElement("option");
                    opt.value = district.name;
                    opt.textContent = district.name;
                    districtSelect.appendChild(opt);
                });
            }
            setAddressView("province", provinceSelect.value);
            setAddressView("district", "Missing");
            setAddressView("municipality", "Missing");
            pendingAddress.province = provinceSelect.value;
            pendingAddress.district = "";
            pendingAddress.municipality = "";
            showSaveBar();
        });
    }

    // District → municipalities
    if (districtSelect) {
        districtSelect.addEventListener("change", () => {
            const selectedProvince = addressData.find(p => p.name === (provinceSelect ? provinceSelect.value : ""));
            const selectedDistrict = selectedProvince?.districtList.find(d => d.name === districtSelect.value);
            if (municipalitySelect) {
                municipalitySelect.innerHTML = "<option value='' disabled selected>Select Municipality</option>";
            }
            if (selectedDistrict && municipalitySelect) {
                selectedDistrict.municipalityList.forEach(muni => {
                    const opt = document.createElement("option");
                    opt.value = muni.name;
                    opt.textContent = muni.name;
                    municipalitySelect.appendChild(opt);
                });
            }
            setAddressView("district", districtSelect.value);
            setAddressView("municipality", "Missing");
            pendingAddress.district = districtSelect.value;
            pendingAddress.municipality = "";
            showSaveBar();
        });
    }

    if (municipalitySelect) {
        municipalitySelect.addEventListener("change", () => {
            setAddressView("municipality", municipalitySelect.value);
            pendingAddress.municipality = municipalitySelect.value;
            showSaveBar();
        });
    }

    // Wire ward & details inputs too
    if (wardInput) {
        wardInput.addEventListener("input", () => {
            setAddressView("ward", wardInput.value);
            pendingAddress.ward = wardInput.value;
            showSaveBar();
        });
    }
    if (detailsInput) {
        detailsInput.addEventListener("input", () => {
            setAddressView("addressDetails", detailsInput.value);
            pendingAddress.addressDetails = detailsInput.value;
            showSaveBar();
        });
    }

    // Also persist address on save
    const originalSaveClick = document.getElementById("_saveBtn").onclick;
    document.getElementById("_saveBtn").addEventListener("click", () => {
        savedAddress = { ...pendingAddress };
        writeJson("deliveryAddress", savedAddress);
        // Update address status badge
        const statusBadge = document.getElementById("addressStatus");
        const hasAddr = Object.values(pendingAddress).some(v => v && v !== "Missing");
        if (statusBadge) {
            statusBadge.textContent = hasAddr ? "Saved" : "Missing";
            statusBadge.style.background = hasAddr ? "#e0f2e9" : "#ffe5e5";
            statusBadge.style.color = hasAddr ? "#166534" : "#d33";
        }
    });

    // Load API address data
    async function loadAddress() {
        try {
            const response = await fetch("/api/nepal-data");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            addressData = data.provinceList;
            populateProvinces();
        } catch (err) {
            console.error("Error loading address data:", err);
        }
    }

    function populateProvinces() {
        if (!provinceSelect) return;
        provinceSelect.innerHTML = "<option value='' disabled selected>Select Province</option>";
        addressData.forEach(province => {
            const opt = document.createElement("option");
            opt.value = province.name;
            opt.textContent = province.name;
            provinceSelect.appendChild(opt);
        });
        // Restore saved selection
        if (savedAddress) {
            restoreAddressViews();
            if (provinceSelect && savedAddress.province) {
                provinceSelect.value = savedAddress.province;
                // Trigger district population
                const sel = addressData.find(p => p.name === savedAddress.province);
                if (sel && districtSelect) {
                    districtSelect.innerHTML = "<option value='' disabled selected>Select District</option>";
                    sel.districtList.forEach(d => {
                        const opt = document.createElement("option");
                        opt.value = d.name; opt.textContent = d.name;
                        districtSelect.appendChild(opt);
                    });
                    if (savedAddress.district) {
                        districtSelect.value = savedAddress.district;
                        const selD = sel.districtList.find(d => d.name === savedAddress.district);
                        if (selD && municipalitySelect) {
                            municipalitySelect.innerHTML = "<option value='' disabled selected>Select Municipality</option>";
                            selD.municipalityList.forEach(m => {
                                const opt = document.createElement("option");
                                opt.value = m.name; opt.textContent = m.name;
                                municipalitySelect.appendChild(opt);
                            });
                            if (savedAddress.municipality) municipalitySelect.value = savedAddress.municipality;
                        }
                    }
                }
            }
        }
    }

    loadAddress();

    // ─── Hide the old profile edit button & action buttons from HTML ──────────
    // (They still exist in the DOM for layout preservation, just hidden)
    ["editProfileBtn", "cancelEditBtn", "saveProfileBtn", "editActions"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
    });
    const cameraBtn = document.getElementById("avatarCameraBtn");
    if (cameraBtn) cameraBtn.hidden = false; // keep camera button visible
});