/* Shared site JS (no frameworks) */

const PHONE = "9043375600";
const WHATSAPP_NUMBER = "919043375600"; // +91 without plus
const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

function qs(sel, root = document) {
  return root.querySelector(sel);
}

// Mobile navigation toggle
function initMobileNav() {
  const toggle = qs("[data-menu-toggle]");
  const nav = qs("[data-primary-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a link
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

// FAQ accordion behavior
function initAccordion() {
  const items = Array.from(document.querySelectorAll("[data-accordion-item]"));
  if (items.length === 0) return;

  for (const item of items) {
    const button = qs("[data-accordion-button]", item);
    const panel = qs("[data-accordion-panel]", item);
    if (!button || !panel) continue;

    // Ensure state is consistent on load
    const open = item.getAttribute("data-open") === "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;

    button.addEventListener("click", () => {
      const currentlyOpen = item.getAttribute("data-open") === "true";

      // Close all items (single-open accordion)
      for (const other of items) {
        other.setAttribute("data-open", "false");
        const otherButton = qs("[data-accordion-button]", other);
        const otherPanel = qs("[data-accordion-panel]", other);
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
      }

      // Toggle selected item
      const nextOpen = !currentlyOpen;
      item.setAttribute("data-open", String(nextOpen));
      button.setAttribute("aria-expanded", String(nextOpen));
      panel.hidden = !nextOpen;
    });
  }
}

// Contact form => open WhatsApp with prefilled message
function initContactForm() {
  const form = qs("#contact-form");
  if (!form) return;

  const status = qs("#form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (qs("[name='name']", form)?.value || "").trim();
    const phone = (qs("[name='phone']", form)?.value || "").trim();
    const service = (qs("[name='service']", form)?.value || "").trim();
    const message = (qs("[name='message']", form)?.value || "").trim();

    // Build a readable multi-line WhatsApp message (encode at the end).
    const baseText = "Hi, I need monitor repair service.\n";
    const details = [
      name ? `Name: ${name}` : null,
      phone ? `Phone: ${phone}` : null,
      service ? `Service: ${service}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean);

    const text =
      baseText +
      details.join("\n") +
      `\n\n(Preferred contact: ${PHONE})`;

    const url = `${WA_BASE}?text=${encodeURIComponent(text)}`;

    if (status) status.textContent = "Opening WhatsApp…";
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();

    // Keep UX feedback even if popup is blocked
    setTimeout(() => {
      if (status) status.textContent = "If WhatsApp didn't open, please try again or call us.";
    }, 2500);
  });
}

function initYear() {
  const yearEl = qs("[data-year]");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

function init() {
  initMobileNav();
  initAccordion();
  initContactForm();
  initYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

