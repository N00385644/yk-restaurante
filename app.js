/* Lógica de la web de YK — lee window.SITE_CONFIG (config.js). Sin dependencias. */
(() => {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const R = cfg.restaurante || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

  const icon = name => `<svg class="ui-icon" width="20" height="20" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;

  const norm = value => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const money = value => {
    const n = Number(value);
    return `S/ ${Number.isInteger(n) ? n.toLocaleString("es-PE") : n.toFixed(2)}`;
  };

  const phone = value => String(value || "").replace(/[^\d]/g, "");
  let waNumber = phone(R.whatsapp);
  if (waNumber.length === 9) waNumber = `51${waNumber}`;
  const hasWA = waNumber.length >= 11;
  const waLink = text => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

  const toastEl = $("#toast");
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  /* ---------- Datos comerciales ---------- */
  function horarioResumen() {
    const first = (R.horarios || [])[0];
    return first ? `${first.dias}: ${first.horas}` : "Horario por confirmar";
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el && value) el.textContent = value;
  }

  function paintConfig() {
    setText("#brandName", R.nombre);
    setText("#brandLogo", R.logoTexto);
    setText("#footName", R.nombre);

    $$("[data-cfg]").forEach(el => {
      const key = el.dataset.cfg;
      const value = key === "horarioResumen" ? horarioResumen() : R[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") el.textContent = value;
    });

    const resumen = horarioResumen();
    document.title = `${R.nombre || "YK"} | Desayunos y menú del día con delivery`;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = `${R.nombre || "YK"}: desayunos, menú del día y platos a la carta. ${resumen}. Delivery a domicilio.`;

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    // Teléfonos de información y delivery.
    const infoEl = $('[data-cfg="telefonoInfo"]');
    if (infoEl && R.telefonoInfo) {
      infoEl.innerHTML = `<a href="tel:${esc(phone(R.telefonoInfo))}">${esc(R.telefonoInfo)}</a>`;
    }
    const deliveryEl = $('[data-cfg="telefonoDelivery"]');
    if (deliveryEl && R.telefonoDelivery) {
      deliveryEl.innerHTML = `<a href="tel:${esc(phone(R.telefonoDelivery))}">${esc(R.telefonoDelivery)}</a>`;
    }

    const numbersConfirmed = Boolean(R.telefonoInfo && R.telefonoDelivery);
    const pending = $("#contactPending");
    if (pending) pending.hidden = numbersConfirmed;
    const numbersNote = $("#contactNumbersNote");
    if (numbersNote) numbersNote.hidden = numbersConfirmed;

    // Botones de WhatsApp: se activan solo cuando hay número configurado.
    const deliveryBtn = $("#deliveryWhatsapp");
    if (deliveryBtn) {
      if (hasWA) {
        deliveryBtn.href = waLink((cfg.whatsappMensajes || {}).general || "¡Hola! Quisiera consultar el menú.");
        deliveryBtn.target = "_blank";
        deliveryBtn.rel = "noopener";
        deliveryBtn.textContent = "Pedir por WhatsApp";
      } else {
        deliveryBtn.href = "#menu";
        deliveryBtn.textContent = "Armar mi pedido";
      }
    }

    const waFloat = $("#waFloat");
    if (waFloat) {
      if (hasWA) {
        waFloat.hidden = false;
        waFloat.href = waLink((cfg.whatsappMensajes || {}).general || "¡Hola! Quisiera consultar el menú.");
      } else {
        waFloat.hidden = true;
      }
    }
  }

  /* ---------- Menú ---------- */
  let activeCat = "todos";

  const priceLabel = p => {
    if (p.precioTexto) return p.precioTexto;
    if (Number(p.precio) > 0) return money(p.precio);
    return "Consultar";
  };

  function dishHTML(p) {
    const disponible = p.disponible !== false;
    const badge = p.etiqueta ? `<span class="badge">${esc(p.etiqueta)}</span>` : "";
    return `<article class="dish${disponible ? "" : " is-out"}">
      <div class="dish-top">
        <h4>${esc(p.nombre)}</h4>
        <span class="price">${esc(priceLabel(p))}</span>
      </div>
      ${p.descripcion ? `<p class="dish-desc">${esc(p.descripcion)}</p>` : ""}
      ${badge}
      <div class="dish-actions">
        ${disponible
          ? `<button class="btn-add" data-add="${esc(p.id)}" aria-label="Añadir ${esc(p.nombre)} al pedido">＋ Añadir</button>`
          : `<span class="badge no">Agotado hoy</span>`}
        <button class="btn-ask" data-ask="${esc(p.id)}" aria-label="Consultar por ${esc(p.nombre)}">Consultar</button>
      </div>
    </article>`;
  }

  function renderFilters() {
    const box = $("#filters");
    if (!box) return;
    box.innerHTML = (cfg.categorias || []).map(cat =>
      `<button class="filter" type="button" data-cat="${esc(cat.id)}" aria-pressed="${cat.id === activeCat}">${esc(cat.nombre)}</button>`
    ).join("");
  }

  function renderMenu() {
    const q = norm($("#searchInput") ? $("#searchInput").value : "");
    const categorias = (cfg.categorias || []).filter(cat => cat.id !== "todos");
    let items = cfg.menu || [];

    if (activeCat !== "todos") items = items.filter(p => p.categoria === activeCat);
    if (q) items = items.filter(p => norm(`${p.nombre} ${p.descripcion || ""}`).includes(q));

    const status = $("#menuStatus");
    if (status) {
      status.textContent = items.length
        ? `${items.length} plato${items.length === 1 ? "" : "s"} · precios en soles (S/)`
        : "No encontramos platos con esa búsqueda. Prueba con otra palabra o categoría.";
    }

    const html = categorias.map(cat => {
      const list = items.filter(p => p.categoria === cat.id);
      if (!list.length) return "";
      return `<section class="menu-group" aria-labelledby="grupo-${esc(cat.id)}">
        <div class="menu-group-head">
          <h3 id="grupo-${esc(cat.id)}">${esc(cat.nombre)}</h3>
          ${cat.descripcion ? `<p>${esc(cat.descripcion)}</p>` : ""}
        </div>
        <div class="dish-grid">${list.map(dishHTML).join("")}</div>
      </section>`;
    }).filter(Boolean).join("");

    const grid = $("#menuGrid");
    if (grid) {
      grid.innerHTML = html || `<div class="menu-empty"><p><strong>Sin resultados.</strong></p><p>Prueba con otro plato o revisa todas las categorías.</p><button class="btn btn-ghost btn-sm" type="button" data-reset-menu>Ver todo el menú</button></div>`;
    }
  }

  function renderFaq() {
    const box = $("#faqBox");
    if (!box) return;
    box.innerHTML = (cfg.faq || []).map((item, index) => `<div class="faq-item">
      <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-panel-${index}" id="faq-q-${index}">
        ${esc(item.p)}<span aria-hidden="true">＋</span>
      </button>
      <div class="faq-a" id="faq-panel-${index}" role="region" aria-labelledby="faq-q-${index}" hidden>${esc(item.r)}</div>
    </div>`).join("");
  }

  /* ---------- Carrito ---------- */
  const KEY = "yk_carrito_v1";
  const findP = id => (cfg.menu || []).find(p => p.id === id);

  let cart = [];
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (Array.isArray(stored)) cart = stored;
  } catch { cart = []; }
  cart = cart.filter(item => item && findP(item.id) && Number(item.qty) > 0);

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* modo privado */ }
  };
  const cartQty = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = () => cart.reduce((sum, item) => {
    const p = findP(item.id);
    return sum + (p && Number(p.precio) > 0 ? Number(p.precio) * item.qty : 0);
  }, 0);

  const unitLabel = p => {
    if (Number(p.precio) > 0) return `${money(p.precio)} c/u`;
    if (p.precioTexto) return p.precioTexto;
    return "Precio por confirmar";
  };

  function renderCart() {
    const count = $("#cartCount");
    if (count) count.textContent = cartQty();

    const box = $("#cartItems");
    if (box) {
      box.innerHTML = cart.length ? cart.map(item => {
        const p = findP(item.id);
        if (!p) return "";
        return `<div class="cart-item">
          <div class="cart-item-info">
            <strong>${esc(p.nombre)}</strong>
            <small>${esc(unitLabel(p))}</small>
          </div>
          <div class="qty">
            <button type="button" data-dec="${esc(p.id)}" aria-label="Quitar uno de ${esc(p.nombre)}">−</button>
            <strong>${item.qty}</strong>
            <button type="button" data-inc="${esc(p.id)}" aria-label="Añadir uno de ${esc(p.nombre)}">＋</button>
            <button type="button" class="qty-del" data-del="${esc(p.id)}" aria-label="Eliminar ${esc(p.nombre)}">${icon("trash")}</button>
          </div>
        </div>`;
      }).join("") : `<div class="cart-empty"><p>Tu carrito está vacío.</p><p>Elige tus platos en el menú y agrégalos aquí.</p><button class="btn btn-ghost btn-sm" type="button" data-close-cart>Ver el menú</button></div>`;
    }

    const total = $("#cartTotal");
    if (total) {
      const value = cartTotal();
      total.textContent = !cart.length ? "S/ 0.00" : value > 0 ? `${money(value)} (est.)` : "Por confirmar";
    }

    const select = $("#cliModalidad");
    if (select) {
      const previous = select.value;
      const mods = R.modalidades && R.modalidades.length ? R.modalidades : ["local", "delivery"];
      const labels = { local: "Comer en el local", recojo: "Recojo en el local", delivery: "Delivery" };
      select.innerHTML = mods.map(mod => `<option value="${esc(mod)}">${esc(labels[mod] || mod)}</option>`).join("");
      if (mods.includes(previous)) select.value = previous;
    }
    toggleDir();
  }

  function toggleDir() {
    const wrap = $("#dirWrap");
    const select = $("#cliModalidad");
    if (wrap && select) wrap.hidden = select.value !== "delivery";
  }

  let cartTrigger;
  function openCart(open = true) {
    const drawer = $("#cartDrawer");
    const overlay = $("#cartOverlay");
    if (!drawer || !overlay) return;
    if (open && !drawer.classList.contains("open")) cartTrigger = document.activeElement;
    const wasOpen = drawer.classList.contains("open");
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    drawer.inert = !open;
    $$(".header, main, .footer, .wa-float").forEach(el => { el.inert = open; });
    overlay.hidden = !open;
    document.body.classList.toggle("no-scroll", open);
    if (open) {
      const close = $("#cartClose");
      if (close) close.focus();
    } else if (wasOpen && cartTrigger?.isConnected) {
      cartTrigger.focus();
    }
  }

  function addToCart(id) {
    const p = findP(id);
    if (!p) return;
    if (p.disponible === false) { toast("Ese plato está agotado hoy."); return; }
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    save();
    renderCart();
    toast(`Añadido: ${p.nombre}`);
  }

  function changeQty(id, delta) {
    const item = cart.find(entry => entry.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(entry => entry.id !== id);
    save();
    renderCart();
  }

  function checkout() {
    const error = $("#cartError");
    if (error) error.textContent = "";
    if (!cart.length) {
      if (error) error.textContent = "El carrito está vacío.";
      return;
    }

    const nombre = ($("#cliNombre")?.value || "").trim();
    const telefono = ($("#cliTelefono")?.value || "").trim();
    const modalidad = ($("#cliModalidad")?.value || "local");
    const direccion = ($("#cliDireccion")?.value || "").trim();
    const observaciones = ($("#cliObs")?.value || "").trim();

    if (nombre.length < 2) {
      if (error) error.textContent = "Escribe tu nombre (mínimo 2 letras).";
      $("#cliNombre")?.focus();
      return;
    }
    if (telefono && !/^[0-9+ ]{7,15}$/.test(telefono)) {
      if (error) error.textContent = "Teléfono inválido (7 a 15 dígitos).";
      return;
    }
    if (modalidad === "delivery" && direccion.length < 5) {
      if (error) error.textContent = "Escribe tu dirección de entrega.";
      $("#cliDireccion")?.focus();
      return;
    }
    if (!hasWA) {
      if (error) error.textContent = "El WhatsApp de pedidos aún no está habilitado. Consulta el número en el local.";
      toast("WhatsApp de pedidos: por confirmar.");
      return;
    }

    const labels = { local: "Comer en el local", recojo: "Recojo en el local", delivery: "Delivery" };
    const lines = [
      (cfg.whatsappMensajes || {}).pedidoIntro || "Pedido web:",
      `👤 Cliente: ${nombre}${telefono ? ` (${telefono})` : ""}`,
      `🏠 Modalidad: ${labels[modalidad] || modalidad}`,
      ...(modalidad === "delivery" ? [`📍 Dirección: ${direccion}`] : []),
      "— — —",
      ...cart.map(item => {
        const p = findP(item.id);
        const price = Number(p.precio) > 0 ? ` — ${money(Number(p.precio) * item.qty)}` : ` — ${p.precioTexto || "precio por confirmar"}`;
        return `• ${item.qty}× ${p.nombre}${price}`;
      }),
      "— — —",
      cartTotal() > 0 ? `💰 Total estimado: ${money(cartTotal())}` : "💰 Total: por confirmar",
      ...(observaciones ? [`📝 Observaciones: ${observaciones}`] : []),
      "¿Me confirman disponibilidad, precio final y tiempo de entrega? ¡Gracias!"
    ];

    window.open(waLink(lines.join("\n")), "_blank");
    toast("Revisa y envía el mensaje en WhatsApp. Pedido pendiente de confirmación.");
  }

  /* ---------- Eventos ---------- */
  function bind() {
    const navToggle = $("#navToggle");
    if (navToggle) {
      navToggle.onclick = () => {
        const links = $("#navLinks");
        if (!links) return;
        const open = links.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
        navToggle.innerHTML = icon(open ? "close" : "menu");
      };
    }
    $$("#navLinks a").forEach(link => {
      link.addEventListener("click", () => {
        $("#navLinks")?.classList.remove("open");
        const toggle = $("#navToggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Abrir menú");
          toggle.innerHTML = icon("menu");
        }
      });
    });

    $("#filters")?.addEventListener("click", event => {
      const button = event.target.closest("[data-cat]");
      if (!button) return;
      activeCat = button.dataset.cat;
      renderFilters();
      renderMenu();
      $("#filters [aria-pressed='true']")?.focus();
    });

    $("#searchInput")?.addEventListener("input", renderMenu);
    $("#menuGrid")?.addEventListener("click", event => {
      if (event.target.closest("[data-reset-menu]")) {
        activeCat = "todos";
        const search = $("#searchInput");
        if (search) search.value = "";
        renderFilters();
        renderMenu();
      }
    });

    document.addEventListener("click", event => {
      const add = event.target.closest("[data-add]");
      if (add) { addToCart(add.dataset.add); return; }

      const ask = event.target.closest("[data-ask]");
      if (ask) {
        const p = findP(ask.dataset.ask);
        if (!p) return;
        const text = hasWA
          ? `¡Hola! Quisiera consultar por "${p.nombre}" — ¿está disponible hoy y cuál es su precio?`
          : `Consulta por "${p.nombre}" en YK. El WhatsApp de pedidos aún no está habilitado.`;
        if (hasWA) window.open(waLink(text), "_blank");
        else toast("El WhatsApp de pedidos aún no está habilitado.");
        return;
      }

      const inc = event.target.closest("[data-inc]");
      if (inc) { changeQty(inc.dataset.inc, 1); return; }

      const dec = event.target.closest("[data-dec]");
      if (dec) { changeQty(dec.dataset.dec, -1); return; }

      const del = event.target.closest("[data-del]");
      if (del) {
        cart = cart.filter(item => item.id !== del.dataset.del);
        save();
        renderCart();
        toast("Producto eliminado.");
        return;
      }

      const closeCart = event.target.closest("[data-close-cart]");
      if (closeCart) {
        openCart(false);
        $("#menu")?.scrollIntoView({ behavior: "smooth" });
      }
    });

    $("#cartOpenBtn")?.addEventListener("click", () => openCart(true));
    $("#cartClose")?.addEventListener("click", () => openCart(false));
    $("#cartOverlay")?.addEventListener("click", () => openCart(false));
    $("#contactWhatsappBtn")?.addEventListener("click", () => openCart(true));
    $("#deliveryWhatsapp")?.addEventListener("click", event => {
      if (!hasWA) {
        event.preventDefault();
        $("#menu")?.scrollIntoView({ behavior: "smooth" });
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") openCart(false);
      if (event.key === "Tab" && $("#cartDrawer")?.classList.contains("open")) {
        const controls = $$("button, input, select, textarea, a[href]", $("#cartDrawer"))
          .filter(el => !el.disabled && el.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });

    $("#cartSend")?.addEventListener("click", checkout);
    $("#cartClear")?.addEventListener("click", () => {
      cart = [];
      save();
      renderCart();
      toast("Carrito vaciado.");
    });
    $("#cliModalidad")?.addEventListener("change", toggleDir);

    $("#faqBox")?.addEventListener("click", event => {
      const button = event.target.closest(".faq-q");
      if (!button) return;
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!panel) return;
      const open = panel.hidden;
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Init ---------- */
  paintConfig();
  renderFilters();
  renderMenu();
  renderFaq();
  renderCart();
  bind();
})();
