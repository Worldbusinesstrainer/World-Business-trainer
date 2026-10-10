/* ============================================================
   World Business Trainer — main.js
   ------------------------------------------------------------
   ⚙️ CONFIGURACIÓN RÁPIDA:
   Cambiá las dos constantes de abajo por tus datos reales.
   El número de WhatsApp debe ir en formato internacional,
   sin espacios, sin "+" y sin guiones.
   Ejemplo Costa Rica: 50688887777
   ============================================================ */

const WHATSAPP_NUMBER = "50600000000"; // ⚙️ REEMPLAZAR
const CONTACT_EMAIL   = "contacto@tudominio.com"; // ⚙️ REEMPLAZAR

const WHATSAPP_MESSAGE = "Hola, estoy interesado en conocer los servicios de World Business Trainer para mi negocio.";

/* ---------- Construir enlaces de WhatsApp ---------- */
(function setupWhatsAppLinks() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll("[data-wa]").forEach(el => {
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
})();

/* ---------- Año dinámico en el footer ---------- */
(function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- Menú móvil ---------- */
(function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Cerrar al hacer clic en un enlace
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

/* ---------- Validación del formulario ---------- */
(function setupForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s()+\-.]{7,}$/;

  function showError(field, message) {
    const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
    if (errorEl) errorEl.textContent = message;
    field.classList.toggle("invalid", Boolean(message));
  }

  function validateField(field) {
    const value = (field.value || "").trim();
    if (field.required && !value) {
      showError(field, "Este campo es obligatorio.");
      return false;
    }
    if (field.type === "email" && value && !emailRegex.test(value)) {
      showError(field, "Ingresá un correo electrónico válido.");
      return false;
    }
    if (field.type === "tel" && value && !phoneRegex.test(value)) {
      showError(field, "Ingresá un número de teléfono válido.");
      return false;
    }
    showError(field, "");
    return true;
  }

  form.querySelectorAll("input, select, textarea").forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    const allValid = fields.every(validateField);

    if (!allValid) {
      status.classList.add("error");
      status.textContent = "Revisá los campos marcados antes de enviar.";
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Armamos un mensaje con los datos del formulario y lo enviamos por WhatsApp
    const data = {
      nombre:   form.nombre.value.trim(),
      empresa:  form.empresa.value.trim(),
      email:    form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      servicio: form.servicio.value,
      mensaje:  form.mensaje.value.trim()
    };

    const texto =
      `Hola, quiero solicitar una cotización.%0A%0A` +
      `*Nombre:* ${data.nombre}%0A` +
      (data.empresa ? `*Empresa:* ${data.empresa}%0A` : "") +
      `*Correo:* ${data.email}%0A` +
      `*Teléfono:* ${data.telefono}%0A` +
      `*Servicio de interés:* ${data.servicio}%0A` +
      (data.mensaje ? `*Mensaje:* ${data.mensaje}%0A` : "");

    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

    status.classList.add("success");
    status.textContent = "¡Gracias! Te estamos redirigiendo a WhatsApp para completar el envío…";

    // Abrimos WhatsApp en una nueva pestaña
    window.open(waURL, "_blank", "noopener");

    // Opcional: también podemos ofrecer envío por correo
    // form.reset();
  });
})();
