/* ============================================================
   payment_success.js
   Fetches real order data from DB using ?orderId= URL param.
   Populates order card with actual order details.
   ============================================================ */

// play ding sound
const playSuccessSound = () => {
    const sound = document.getElementById("success-sound");
    if (sound) {
        sound.volume = 0.5;
        sound.play().catch(() => {});
    }
};

window.addEventListener("load", playSuccessSound);
document.addEventListener("click", playSuccessSound, { once: true });

// hamburger
function toggleMenu() {
    document.querySelector(".quickies")?.classList.toggle("show");
}

// format date
function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-NP", {
        year: "numeric", month: "long", day: "numeric"
    });
}

// estimated delivery: 5 days from order date
function estimatedDelivery(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-NP", {
        year: "numeric", month: "long", day: "numeric"
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const params  = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (!orderId) return; // no orderId — static fallback already in HTML

    try {
        const res = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
        if (!res.ok) return;

        const { order } = await res.json();

        // order number
        const orderNumEl = document.getElementById("orderNumber");
        if (orderNumEl) orderNumEl.textContent = order.orderId || "—";

        // order date
        const orderDateEl = document.getElementById("orderDate");
        if (orderDateEl) orderDateEl.textContent = formatDate(order.createdAt);

        // estimated delivery
        const deliveryEl = document.getElementById("estimatedDelivery");
        if (deliveryEl) deliveryEl.textContent = estimatedDelivery(order.createdAt);

        // total
        const totalEl = document.getElementById("orderTotal");
        if (totalEl) totalEl.textContent = `Rs.${order.total?.toLocaleString() || "—"}`;

        // payment method
        const methodEl = document.getElementById("paymentMethod");
        if (methodEl) methodEl.textContent = order.paymentMethod?.toUpperCase() || "—";

        // view order details button
        const viewBtn = document.getElementById("viewOrderBtn");
        if (viewBtn) viewBtn.href = `/orders?id=${orderId}`;

    } catch (err) {
        console.error("[success] order fetch failed:", err);
    }
});
