(() => {
  const STEPS = ["cart", "shipping", "gift", "customer", "confirmation"];

  const ui = {
    stepBar: document.getElementById("step-bar"),
    globalMessage: document.getElementById("global-message"),
    views: {
      cart: document.getElementById("step-cart"),
      shipping: document.getElementById("step-shipping"),
      gift: document.getElementById("step-gift"),
      customer: document.getElementById("step-customer"),
      confirmation: document.getElementById("step-confirmation"),
    },
    productGrid: document.getElementById("product-grid"),
    cartItems: document.getElementById("cart-items"),
    cartEmpty: document.getElementById("cart-empty"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    toShippingBtn: document.getElementById("to-shipping-btn"),
    shippingDescription: document.getElementById("shipping-description"),
    shippingAddressForm: document.getElementById("shipping-address-form"),
    shippingActions: document.getElementById("shipping-actions"),
    shippingOptions: document.getElementById("shipping-options"),
    backToCartBtn: document.getElementById("back-to-cart-btn"),
    toGiftBtn: document.getElementById("to-gift-btn"),
    giftToggleBtn: document.getElementById("gift-toggle-btn"),
    giftPanel: document.getElementById("gift-panel"),
    giftCode: document.getElementById("gift-code"),
    giftApplyBtn: document.getElementById("gift-apply-btn"),
    giftSpinner: document.getElementById("gift-spinner"),
    giftMessage: document.getElementById("gift-message"),
    giftRemoveBtn: document.getElementById("gift-remove-btn"),
    backToShippingBtn: document.getElementById("back-to-shipping-btn"),
    toCustomerBtn: document.getElementById("to-customer-btn"),
    customerName: document.getElementById("customer-name"),
    customerEmail: document.getElementById("customer-email"),
    customerPhone: document.getElementById("customer-phone"),
    summaryBox: document.getElementById("summary-box"),
    backToGiftBtn: document.getElementById("back-to-gift-btn"),
    placeOrderBtn: document.getElementById("place-order-btn"),
    placeSpinner: document.getElementById("place-spinner"),
    confirmationOrder: document.getElementById("confirmation-order"),
    confirmationSummary: document.getElementById("confirmation-summary"),
  };

  const state = {
    currentStep: "cart",
    loading: false,
    feed: null,
    products: [],
    workspace: null,
    currency: "ZAR",
    cart: [],
    shippingMode: "none",
    shippingAddress: {
      streetAddress: "",
      suburb: "",
      city: "",
      province: "",
      postalCode: "",
    },
    shippingCents: 0,
    shippingSelection: null,
    shippingQuote: null,
    parcels: [
      {
        submitted_length_cm: 30,
        submitted_width_cm: 20,
        submitted_height_cm: 10,
        submitted_weight_kg: 1,
      },
    ],
    appliedGiftCardCode: null,
    giftCardDiscountCents: 0,
    pickupPointsLoaded: false,
    pickupPoints: [],
    confirmedOrder: null,
  };

  const pickupPointsCacheKey = "CONNECT_PICKUP_POINTS_CACHE_V1";

  function formatMoney(cents) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: state.currency,
    }).format((cents || 0) / 100);
  }

  function showMessage(kind, text) {
    if (!text) {
      ui.globalMessage.classList.add("hidden");
      ui.globalMessage.textContent = "";
      return;
    }
    ui.globalMessage.className = `message ${kind}`;
    ui.globalMessage.textContent = text;
    ui.globalMessage.classList.remove("hidden");
  }

  function setLoading(loading, button = null, spinner = null) {
    state.loading = loading;
    if (button) button.disabled = loading;
    if (spinner) spinner.classList.toggle("hidden", !loading);
  }

  function subtotalCents() {
    return state.cart.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  }

  function orderTotalCents() {
    return Math.max(0, subtotalCents() + state.shippingCents - state.giftCardDiscountCents);
  }

  function requiresShipping() {
    return state.cart.some((item) => item.requiresShipping);
  }

  function renderStepBar() {
    ui.stepBar.innerHTML = "";
    STEPS.forEach((step) => {
      if (step === "shipping" && !requiresShipping()) {
        return;
      }
      const el = document.createElement("span");
      el.className = `step-pill ${state.currentStep === step ? "active" : ""}`;
      el.textContent = step.toUpperCase();
      ui.stepBar.appendChild(el);
    });
  }

  function setStep(step) {
    state.currentStep = step;
    Object.entries(ui.views).forEach(([key, view]) => {
      view.classList.toggle("hidden", key !== step);
    });
    renderStepBar();
    renderSummary();
  }

  function incrementItem(productId) {
    const item = state.cart.find((entry) => entry.productId === productId);
    if (!item) return;
    item.quantity += 1;
    renderCart();
  }

  function decrementItem(productId) {
    const item = state.cart.find((entry) => entry.productId === productId);
    if (!item) return;
    item.quantity -= 1;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter((entry) => entry.productId !== productId);
    }
    renderCart();
  }

  function addProduct(product) {
    if (!product.inStock) return;
    const existing = state.cart.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        productId: product.id,
        variantId: null,
        name: product.name,
        quantity: 1,
        priceInCents: Number(product.priceInCents || 0),
        requiresShipping: Boolean(product.requiresShipping),
      });
    }
    renderCart();
  }

  function renderProducts() {
    ui.productGrid.innerHTML = "";
    state.products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "card";
      const imageHtml = product.imageUrl
        ? `<img src="${product.imageUrl}" alt="${product.name}"/>`
        : "No image";
      card.innerHTML = `
        <div class="media">${imageHtml}</div>
        <div class="body">
          <h3>${product.name}</h3>
          <p class="muted">${formatMoney(product.priceInCents)}</p>
          <button class="btn add-btn" ${product.inStock ? "" : "disabled"}>${
        product.inStock ? "Add to cart" : "Out of stock"
      }</button>
        </div>
      `;

      card.querySelector(".add-btn").addEventListener("click", () => addProduct(product));
      ui.productGrid.appendChild(card);
    });
  }

  function renderCart() {
    ui.cartItems.innerHTML = "";
    if (!state.cart.length) {
      ui.cartEmpty.classList.remove("hidden");
      ui.toShippingBtn.disabled = true;
    } else {
      ui.cartEmpty.classList.add("hidden");
      ui.toShippingBtn.disabled = false;
      state.cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "summary-row";
        row.innerHTML = `
          <div>
            <strong>${item.name}</strong><br/>
            <small class="muted">${formatMoney(item.priceInCents)} each</small>
          </div>
          <div style="display:flex;align-items:center;gap:.6rem;">
            <div class="qty">
              <button type="button" class="dec">-</button>
              <span>${item.quantity}</span>
              <button type="button" class="inc">+</button>
            </div>
            <strong>${formatMoney(item.priceInCents * item.quantity)}</strong>
          </div>
        `;
        row.querySelector(".inc").addEventListener("click", () => incrementItem(item.productId));
        row.querySelector(".dec").addEventListener("click", () => decrementItem(item.productId));
        ui.cartItems.appendChild(row);
      });
    }

    ui.cartSubtotal.innerHTML = `<span>Subtotal</span><span>${formatMoney(subtotalCents())}</span>`;

    if (!requiresShipping()) {
      state.shippingCents = 0;
    }

    if (state.appliedGiftCardCode) {
      state.giftCardDiscountCents = Math.min(state.giftCardDiscountCents, subtotalCents() + state.shippingCents);
      renderGiftMessage("success", `${state.appliedGiftCardCode} applied`);
    }

    renderSummary();
  }

  function deliveryConfig() {
    return state.workspace?.shipping || {
      enabled: false,
      flatRateCents: null,
      freeThresholdCents: null,
      shipLogicEnabled: false,
      collectionEnabled: false,
      ownDeliveryEnabled: false,
      collectionAddress: null,
    };
  }

  function renderShippingAddressForm() {
    ui.shippingAddressForm.innerHTML = `
      <label class="field"><span>Street address</span><input id="ship-street" value="${state.shippingAddress.streetAddress}"/></label>
      <label class="field"><span>Suburb</span><input id="ship-suburb" value="${state.shippingAddress.suburb}"/></label>
      <label class="field"><span>City</span><input id="ship-city" value="${state.shippingAddress.city}"/></label>
      <label class="field"><span>Province</span><input id="ship-province" value="${state.shippingAddress.province}"/></label>
      <label class="field"><span>Postal code</span><input id="ship-postal" value="${state.shippingAddress.postalCode}"/></label>
    `;
  }

  function readShippingAddressForm() {
    state.shippingAddress.streetAddress = document.getElementById("ship-street").value.trim();
    state.shippingAddress.suburb = document.getElementById("ship-suburb").value.trim();
    state.shippingAddress.city = document.getElementById("ship-city").value.trim();
    state.shippingAddress.province = document.getElementById("ship-province").value.trim();
    state.shippingAddress.postalCode = document.getElementById("ship-postal").value.trim();
  }

  async function ensurePickupPointsLoaded() {
    if (state.pickupPointsLoaded) return;

    const cached = sessionStorage.getItem(pickupPointsCacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        state.pickupPoints = Array.isArray(parsed.pickupPoints) ? parsed.pickupPoints : [];
      } catch {
        state.pickupPoints = [];
      }
      state.pickupPointsLoaded = true;
      return;
    }

    const response = await fetch("/api/connect/shipping/pickup-points", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      state.pickupPointsLoaded = true;
      return;
    }
    const data = await response.json();
    state.pickupPoints = Array.isArray(data.pickupPoints) ? data.pickupPoints : [];
    sessionStorage.setItem(
      pickupPointsCacheKey,
      JSON.stringify({ pickupPoints: state.pickupPoints }),
    );
    state.pickupPointsLoaded = true;
  }

  async function renderShippingStep() {
    renderShippingAddressForm();
    ui.shippingOptions.innerHTML = "";
    ui.shippingActions.innerHTML = "";
    ui.toGiftBtn.disabled = false;

    const cfg = deliveryConfig();

    if (!requiresShipping()) {
      state.shippingMode = "none";
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "No cart item requires shipping.";
      return;
    }

    const methodOptions = [];
    if (cfg.enabled) methodOptions.push({ value: "courier", label: "Courier delivery" });
    if (cfg.collectionEnabled) methodOptions.push({ value: "collection", label: "Collection" });
    if (cfg.ownDeliveryEnabled) methodOptions.push({ value: "own", label: "Own delivery" });

    if (!methodOptions.length) {
      state.shippingMode = "none";
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "Collection only";
      return;
    }

    if (!methodOptions.some((option) => option.value === state.shippingMode)) {
      state.shippingMode = methodOptions[0].value;
    }

    const selector = document.createElement("select");
    methodOptions.forEach((option) => {
      const el = document.createElement("option");
      el.value = option.value;
      el.textContent = option.label;
      if (option.value === state.shippingMode) el.selected = true;
      selector.appendChild(el);
    });

    selector.addEventListener("change", async () => {
      state.shippingMode = selector.value;
      state.shippingSelection = null;
      await renderShippingStep();
      renderSummary();
    });

    const label = document.createElement("label");
    label.className = "field";
    label.style.maxWidth = "320px";
    label.innerHTML = "<span>Delivery method</span>";
    label.appendChild(selector);
    ui.shippingActions.appendChild(label);

    if (state.shippingMode === "collection") {
      state.shippingCents = 0;
      const address = cfg.collectionAddress || state.workspace?.address;
      const parts = [address?.street, address?.city, address?.province, address?.postalCode]
        .filter(Boolean)
        .join(", ");
      ui.shippingDescription.textContent =
        `Collect your order from: ${parts || "store address"}. Bring your order confirmation when collecting.`;
      ui.shippingAddressForm.classList.add("hidden");
      return;
    }

    ui.shippingAddressForm.classList.remove("hidden");

    if (state.shippingMode === "own") {
      state.shippingCents = 0;
      ui.shippingDescription.textContent =
        "Store driver delivery. Provide your address so we can arrange delivery.";
      return;
    }

    await ensurePickupPointsLoaded();

    if (!cfg.enabled) {
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "Courier shipping is not enabled.";
      return;
    }

    if (typeof cfg.flatRateCents === "number") {
      const freeApplies =
        typeof cfg.freeThresholdCents === "number" && subtotalCents() >= cfg.freeThresholdCents;
      state.shippingCents = freeApplies ? 0 : cfg.flatRateCents;
      ui.shippingDescription.textContent = freeApplies
        ? `Free delivery applies over ${formatMoney(cfg.freeThresholdCents)}`
        : `Flat delivery fee: ${formatMoney(cfg.flatRateCents)}`;
      return;
    }

    if (!cfg.shipLogicEnabled) {
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "Contact the store for delivery rates.";
      ui.toGiftBtn.disabled = true;
      return;
    }

    ui.shippingDescription.textContent =
      "Get a live courier quote by entering your city and postal code.";

    const quoteBtn = document.createElement("button");
    quoteBtn.className = "btn";
    quoteBtn.type = "button";
    quoteBtn.innerHTML = '<span class="spinner hidden"></span><span>Get live quote</span>';
    const quoteSpinner = quoteBtn.querySelector(".spinner");

    quoteBtn.addEventListener("click", async () => {
      readShippingAddressForm();
      if (!state.shippingAddress.city || !state.shippingAddress.postalCode) {
        showMessage("error", "City and postal code are required for a live quote");
        return;
      }

      showMessage("", "");
      setLoading(true, quoteBtn, quoteSpinner);

      try {
        const response = await fetch("/api/connect/shipping/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            delivery_address: {
              street_address: state.shippingAddress.streetAddress || undefined,
              local_area: state.shippingAddress.suburb || undefined,
              city: state.shippingAddress.city,
              zone: state.shippingAddress.province || undefined,
              code: state.shippingAddress.postalCode,
              country: "ZA",
            },
            parcels: state.parcels,
            declared_value: subtotalCents() / 100,
            cart_value_cents: subtotalCents(),
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          showMessage("error", data?.message || "Could not fetch shipping quote");
          return;
        }

        state.shippingQuote = data;
        const rates = Array.isArray(data.rates) ? data.rates : [];

        if (!rates.length && !data.freeDeliveryApplies) {
          showMessage("error", "No courier options available for this address");
          ui.toGiftBtn.disabled = true;
          return;
        }

        ui.shippingOptions.innerHTML = "";
        const wrap = document.createElement("div");
        wrap.className = "panel";
        wrap.style.padding = "0.6rem";

        if (data.freeDeliveryApplies) {
          const note = document.createElement("p");
          note.className = "message success";
          note.textContent = "Free delivery applies";
          wrap.appendChild(note);
        }

        rates.forEach((rate) => {
          const row = document.createElement("label");
          row.className = "summary-row";
          const original = Number(rate.rateCents || 0);
          const applied = data.freeDeliveryApplies ? 0 : original;
          row.innerHTML = `
            <span>
              <input type="radio" name="ship-rate" value="${rate.serviceCode}" />
              ${rate.serviceName}
            </span>
            <span>
              ${
                data.freeDeliveryApplies
                  ? `<s>${formatMoney(original)}</s> <strong>${formatMoney(0)}</strong>`
                  : formatMoney(applied)
              }
            </span>
          `;

          row.querySelector("input").addEventListener("change", () => {
            state.shippingSelection = {
              quoteId: data.quoteId || null,
              serviceCode: rate.serviceCode,
              serviceId: rate.serviceId,
              rateCents: applied,
              originalRateCents: original,
            };
            state.shippingCents = applied;
            ui.toGiftBtn.disabled = false;
            renderSummary();
          });
          wrap.appendChild(row);
        });

        ui.shippingOptions.appendChild(wrap);
        ui.toGiftBtn.disabled = !state.shippingSelection;
      } catch {
        showMessage("error", "Network error while fetching quote. Please retry.");
      } finally {
        setLoading(false, quoteBtn, quoteSpinner);
      }
    });

    ui.shippingActions.appendChild(quoteBtn);
    ui.toGiftBtn.disabled = !state.shippingSelection;
  }

  function renderGiftMessage(kind, text) {
    ui.giftMessage.className = `message ${kind}`;
    ui.giftMessage.textContent = text;
    ui.giftMessage.classList.remove("hidden");
  }

  async function applyGiftCard() {
    const raw = ui.giftCode.value.trim();
    if (!raw) {
      renderGiftMessage("error", "Enter a gift card code");
      return;
    }

    setLoading(true, ui.giftApplyBtn, ui.giftSpinner);
    ui.giftMessage.classList.add("hidden");

    try {
      const response = await fetch(
        `/api/connect/gift-cards/validate?code=${encodeURIComponent(raw)}`,
        { headers: { Accept: "application/json" } },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data?.error === "not_found") {
          renderGiftMessage("error", "This gift card is invalid or has already been used");
          return;
        }
        renderGiftMessage("error", "Something went wrong, please try again");
        return;
      }

      if (!data.valid || ["redeemed", "cancelled"].includes(data.status)) {
        renderGiftMessage("error", "This gift card is invalid or has already been used");
        return;
      }

      if (data.status === "expired") {
        const d = data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : "unknown";
        renderGiftMessage("error", `This gift card expired on ${d}`);
        return;
      }

      const available = Number(data.balanceCents || 0);
      const deduction = Math.min(available, subtotalCents() + state.shippingCents);
      const remainingDue = subtotalCents() + state.shippingCents - deduction;

      state.appliedGiftCardCode = data.code;
      state.giftCardDiscountCents = deduction;
      ui.giftRemoveBtn.classList.remove("hidden");

      if (deduction < subtotalCents() + state.shippingCents) {
        renderGiftMessage(
          "success",
          `${formatMoney(available)} available - ${formatMoney(deduction)} will be deducted. Remaining due: ${formatMoney(
            remainingDue,
          )}`,
        );
      } else {
        renderGiftMessage(
          "success",
          `${formatMoney(available)} available - ${formatMoney(deduction)} will be deducted`,
        );
      }
      renderSummary();
    } catch {
      renderGiftMessage("error", "Something went wrong, please try again");
    } finally {
      setLoading(false, ui.giftApplyBtn, ui.giftSpinner);
    }
  }

  function removeGiftCard() {
    state.appliedGiftCardCode = null;
    state.giftCardDiscountCents = 0;
    ui.giftCode.value = "";
    ui.giftMessage.classList.add("hidden");
    ui.giftRemoveBtn.classList.add("hidden");
    renderSummary();
  }

  function renderSummary() {
    const subtotal = subtotalCents();
    const shipping = state.shippingCents;
    const gift = state.giftCardDiscountCents;
    const total = orderTotalCents();

    const lineItems = state.cart
      .map(
        (item) =>
          `<div class="summary-row"><span>${item.name} x ${item.quantity}</span><span>${formatMoney(
            item.priceInCents * item.quantity,
          )}</span></div>`,
      )
      .join("");

    ui.summaryBox.innerHTML = `
      ${lineItems}
      <div class="summary-row"><span>Subtotal</span><span>${formatMoney(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${formatMoney(shipping)}</span></div>
      ${
        gift > 0
          ? `<div class="summary-row"><span>Gift card</span><span>- ${formatMoney(gift)}</span></div>`
          : ""
      }
      <div class="summary-row total"><span>Total</span><span>${formatMoney(total)}</span></div>
    `;
  }

  function validCustomer() {
    const name = ui.customerName.value.trim();
    const email = ui.customerEmail.value.trim();
    if (!name) {
      showMessage("error", "Customer name is required");
      return false;
    }
    if (!email) {
      showMessage("error", "Customer email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("error", "Enter a valid customer email");
      return false;
    }
    return true;
  }

  function randomPlatformOrderId() {
    return `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  async function placeOrder() {
    if (!validCustomer()) {
      return;
    }

    if (requiresShipping() && state.shippingMode === "courier") {
      const cfg = deliveryConfig();
      const liveMode = cfg.enabled && cfg.flatRateCents == null && cfg.shipLogicEnabled;
      if (liveMode && !state.shippingSelection) {
        showMessage("error", "Please select a courier shipping option");
        return;
      }
    }

    setLoading(true, ui.placeOrderBtn, ui.placeSpinner);
    showMessage("", "");

    try {
      readShippingAddressForm();

      const payload = {
        customerName: ui.customerName.value.trim(),
        customerEmail: ui.customerEmail.value.trim() || undefined,
        customerPhone: ui.customerPhone.value.trim() || undefined,
        platform: "website",
        platformOrderId: randomPlatformOrderId(),
        paymentStatus: "paid",
        items: state.cart.map((item) => ({
          description: item.name,
          quantity: item.quantity,
          unitPriceInCents: item.priceInCents,
          productId: item.productId,
          variantId: item.variantId || undefined,
        })),
        shippingCost: state.shippingCents,
        shippingAddress: state.shippingAddress.streetAddress || undefined,
        shippingCity: state.shippingAddress.city || undefined,
        shippingProvince: state.shippingAddress.province || undefined,
        shippingPostalCode: state.shippingAddress.postalCode || undefined,
        shipLogicQuoteId: state.shippingSelection?.quoteId || undefined,
        shipLogicServiceCode: state.shippingSelection?.serviceCode || undefined,
        shipLogicServiceId: state.shippingSelection?.serviceId || undefined,
        shipLogicRate:
          typeof state.shippingSelection?.rateCents === "number"
            ? state.shippingSelection.rateCents / 100
            : undefined,
        parcels: state.shippingSelection ? state.parcels : undefined,
        lekkerGiftCardCode: state.appliedGiftCardCode || undefined,
        lekkerGiftCardAmountCents: state.appliedGiftCardCode
          ? state.giftCardDiscountCents
          : undefined,
      };

      const response = await fetch("/api/connect/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status >= 500) {
          showMessage("error", "Server error. Please retry.");
          return;
        }

        if (data?.error === "product_not_found") {
          showMessage("error", "One or more products are unavailable. Please refresh cart.");
          return;
        }

        showMessage("error", data?.message || "Could not place order");
        return;
      }

      state.confirmedOrder = {
        ...data,
        subtotalCents: subtotalCents(),
        shippingCents: state.shippingCents,
        giftCardDiscountCents: state.giftCardDiscountCents,
        totalCents: orderTotalCents(),
      };

      renderConfirmation();
      state.cart = [];
      state.appliedGiftCardCode = null;
      state.giftCardDiscountCents = 0;
      setStep("confirmation");
    } catch {
      showMessage("error", "Network error. Please retry.");
    } finally {
      setLoading(false, ui.placeOrderBtn, ui.placeSpinner);
    }
  }

  function renderConfirmation() {
    const c = state.confirmedOrder;
    if (!c) return;

    ui.confirmationOrder.textContent = `Order number: ${c.orderNumber}`;

    ui.confirmationSummary.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${formatMoney(c.subtotalCents)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${formatMoney(c.shippingCents)}</span></div>
      ${
        c.giftCardDiscountCents > 0
          ? `<div class="summary-row"><span>Gift card applied</span><span>- ${formatMoney(c.giftCardDiscountCents)}</span></div>`
          : ""
      }
      <div class="summary-row total"><span>Total</span><span>${formatMoney(c.totalCents)}</span></div>
      ${
        c.giftCardRedeemedCents
          ? `<p class="message success">Gift card applied - ${formatMoney(c.giftCardRedeemedCents)} redeemed</p>`
          : ""
      }
    `;
  }

  async function fetchFeed() {
    showMessage("", "");
    try {
      const response = await fetch("/api/connect/feed?published=true", {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        showMessage("error", "Could not load catalogue feed");
        return;
      }

      state.feed = data;
      state.workspace = data.workspace || {};
      state.currency = data.workspace?.currency || "ZAR";
      state.products = Array.isArray(data.products) ? data.products : [];
      renderProducts();
      renderCart();
      renderStepBar();
      await ensurePickupPointsLoaded();
    } catch {
      showMessage("error", "Could not load catalogue feed");
    }
  }

  ui.toShippingBtn.addEventListener("click", async () => {
    if (!state.cart.length) return;
    await renderShippingStep();
    setStep("shipping");
  });

  ui.backToCartBtn.addEventListener("click", () => setStep("cart"));

  ui.toGiftBtn.addEventListener("click", () => {
    if (requiresShipping() && state.shippingMode === "courier") {
      const cfg = deliveryConfig();
      if (cfg.enabled && cfg.flatRateCents == null && cfg.shipLogicEnabled && !state.shippingSelection) {
        showMessage("error", "Select a courier option before continuing");
        return;
      }
    }
    setStep("gift");
  });

  ui.backToShippingBtn.addEventListener("click", () => setStep("shipping"));

  ui.giftToggleBtn.addEventListener("click", () => {
    ui.giftPanel.classList.toggle("hidden");
  });

  ui.giftApplyBtn.addEventListener("click", applyGiftCard);
  ui.giftRemoveBtn.addEventListener("click", removeGiftCard);

  ui.toCustomerBtn.addEventListener("click", () => setStep("customer"));
  ui.backToGiftBtn.addEventListener("click", () => setStep("gift"));
  ui.placeOrderBtn.addEventListener("click", placeOrder);

  fetchFeed();
})();
(() => {
  const stepOrder = ["cart", "shipping", "gift", "customer", "confirmation"];
  const portalSessionKey = "CONNECT_PORTAL_SESSION";

  const ui = {
    globalMessage: document.getElementById("global-message"),
    stepBar: document.getElementById("step-bar"),
    sections: {
      cart: document.getElementById("step-cart"),
      shipping: document.getElementById("step-shipping"),
      gift: document.getElementById("step-gift"),
      customer: document.getElementById("step-customer"),
      confirmation: document.getElementById("step-confirmation"),
    },
    productGrid: document.getElementById("product-grid"),
    cartItems: document.getElementById("cart-items"),
    cartEmpty: document.getElementById("cart-empty"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    toShippingBtn: document.getElementById("to-shipping-btn"),
    shippingDescription: document.getElementById("shipping-description"),
    shippingAddressForm: document.getElementById("shipping-address-form"),
    shippingActions: document.getElementById("shipping-actions"),
    shippingOptions: document.getElementById("shipping-options"),
    backToCartBtn: document.getElementById("back-to-cart-btn"),
    toGiftBtn: document.getElementById("to-gift-btn"),
    giftToggleBtn: document.getElementById("gift-toggle-btn"),
    giftPanel: document.getElementById("gift-panel"),
    giftCode: document.getElementById("gift-code"),
    giftApplyBtn: document.getElementById("gift-apply-btn"),
    giftSpinner: document.getElementById("gift-spinner"),
    giftRemoveBtn: document.getElementById("gift-remove-btn"),
    giftMessage: document.getElementById("gift-message"),
    backToShippingBtn: document.getElementById("back-to-shipping-btn"),
    toCustomerBtn: document.getElementById("to-customer-btn"),
    customerName: document.getElementById("customer-name"),
    customerEmail: document.getElementById("customer-email"),
    customerPhone: document.getElementById("customer-phone"),
    summaryBox: document.getElementById("summary-box"),
    backToGiftBtn: document.getElementById("back-to-gift-btn"),
    placeOrderBtn: document.getElementById("place-order-btn"),
    placeSpinner: document.getElementById("place-spinner"),
    confirmationOrder: document.getElementById("confirmation-order"),
    confirmationSummary: document.getElementById("confirmation-summary"),
  };

  const state = {
    currentStep: "cart",
    feed: null,
    products: [],
    shippingConfig: null,
    pickupPoints: [],
    pickupPointsLoaded: false,
    cart: [],
    selectedRate: null,
    quoteResult: null,
    shippingCents: 0,
    parcels: [
      {
        submitted_length_cm: 30,
        submitted_width_cm: 20,
        submitted_height_cm: 10,
        submitted_weight_kg: 1,
      },
    ],
    address: {
      streetAddress: "",
      suburb: "",
      city: "",
      province: "",
      postalCode: "",
    },
    gift: {
      code: null,
      discountCents: 0,
    },
  };

  const currencyFormat = (value, currency = "ZAR") =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value / 100);

  function showMessage(kind, text) {
    if (!text) {
      ui.globalMessage.classList.add("hidden");
      ui.globalMessage.textContent = "";
      return;
    }
    ui.globalMessage.className = `message ${kind}`;
    ui.globalMessage.textContent = text;
    ui.globalMessage.classList.remove("hidden");
  }

  function setStep(step) {
    state.currentStep = step;
    Object.entries(ui.sections).forEach(([name, section]) => {
      section.classList.toggle("hidden", name !== step);
    });

    ui.stepBar.innerHTML = "";
    stepOrder.forEach((name) => {
      if (name === "shipping" && !cartRequiresShipping()) return;
      const pill = document.createElement("span");
      pill.className = `step-pill ${name === step ? "active" : ""}`;
      pill.textContent = name.toUpperCase();
      ui.stepBar.appendChild(pill);
    });
  }

  function cartRequiresShipping() {
    return state.cart.some((item) => item.requiresShipping);
  }

  function subtotalCents() {
    return state.cart.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  }

  function orderTotalCents() {
    return Math.max(0, subtotalCents() + state.shippingCents - state.gift.discountCents);
  }

  function activeCurrency() {
    return state.feed?.workspace?.currency || "ZAR";
  }

  function fetchJson(url, options) {
    return fetch(url, options).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data?.message || data?.error || `Request failed (${response.status})`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    });
  }

  function upsertCartItem(product, variant) {
    const variantId = variant?.id || null;
    const key = `${product.id}:${variantId || "base"}`;
    const existing = state.cart.find((item) => item.key === key);

    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        key,
        productId: product.id,
        variantId,
        name: variant ? `${product.name} (${variant.name})` : product.name,
        priceInCents: variant?.priceInCents ?? product.priceInCents,
        quantity: 1,
        requiresShipping: !!product.requiresShipping,
      });
    }

    renderCart();
    renderSummary();
  }

  function renderProducts() {
    ui.productGrid.innerHTML = "";
    state.products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "card";
      const defaultVariant = Array.isArray(product.variants) && product.variants.length
        ? product.variants.find((v) => v.inStock) || product.variants[0]
        : null;

      card.innerHTML = `
        <div class="media">
          ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" />` : "No image"}
        </div>
        <div class="body">
          <h3>${product.name}</h3>
          <p class="muted">${currencyFormat(product.priceInCents, activeCurrency())}</p>
          <button class="btn add-btn" type="button" ${!product.inStock ? "disabled" : ""}>Add to cart</button>
        </div>
      `;

      card.querySelector(".add-btn").addEventListener("click", () => {
        upsertCartItem(product, defaultVariant);
      });

      ui.productGrid.appendChild(card);
    });
  }

  function renderCart() {
    ui.cartItems.innerHTML = "";
    const hasItems = state.cart.length > 0;
    ui.cartEmpty.classList.toggle("hidden", hasItems);
    ui.toShippingBtn.disabled = !hasItems;

    state.cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "summary-row";
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <div class="muted">${currencyFormat(item.priceInCents, activeCurrency())}</div>
        </div>
        <div>
          <span class="qty">
            <button type="button" class="minus">-</button>
            <span>${item.quantity}</span>
            <button type="button" class="plus">+</button>
          </span>
          <button type="button" class="btn link remove">Remove</button>
        </div>
      `;

      row.querySelector(".minus").addEventListener("click", () => {
        item.quantity = Math.max(1, item.quantity - 1);
        renderCart();
        renderSummary();
      });

      row.querySelector(".plus").addEventListener("click", () => {
        item.quantity += 1;
        renderCart();
        renderSummary();
      });

      row.querySelector(".remove").addEventListener("click", () => {
        state.cart = state.cart.filter((entry) => entry.key !== item.key);
        renderCart();
        renderSummary();
      });

      ui.cartItems.appendChild(row);
    });

    ui.cartSubtotal.innerHTML = `<span>Subtotal</span><span>${currencyFormat(subtotalCents(), activeCurrency())}</span>`;
  }

  function renderAddressForm() {
    ui.shippingAddressForm.innerHTML = "";
    const fields = [
      ["streetAddress", "Street address"],
      ["suburb", "Suburb"],
      ["city", "City *"],
      ["province", "Province"],
      ["postalCode", "Postal code *"],
    ];

    fields.forEach(([key, label]) => {
      const container = document.createElement("label");
      container.className = "field";
      container.innerHTML = `<span>${label}</span><input data-key="${key}" value="${state.address[key] || ""}" />`;
      const input = container.querySelector("input");
      input.addEventListener("input", () => {
        state.address[key] = input.value;
      });
      ui.shippingAddressForm.appendChild(container);
    });
  }

  function renderShippingOptions(rates, freeDeliveryApplies) {
    ui.shippingOptions.innerHTML = "";
    if (!rates?.length) {
      ui.shippingOptions.innerHTML = '<p class="muted">No courier rates found yet.</p>';
      return;
    }

    rates.forEach((rate) => {
      const row = document.createElement("label");
      row.className = "summary-row";
      const checked = state.selectedRate?.serviceCode === rate.serviceCode ? "checked" : "";
      const basePrice = currencyFormat(rate.rateCents, activeCurrency());
      const shownPrice = freeDeliveryApplies ? currencyFormat(0, activeCurrency()) : basePrice;
      row.innerHTML = `
        <span>
          <input type="radio" name="shipping-rate" value="${rate.serviceCode}" ${checked} />
          ${rate.serviceName}
        </span>
        <span>
          ${freeDeliveryApplies ? `<s>${basePrice}</s> <strong>Free delivery</strong>` : shownPrice}
        </span>
      `;

      row.querySelector("input").addEventListener("change", () => {
        state.selectedRate = {
          ...rate,
          rateCents: freeDeliveryApplies ? 0 : rate.rateCents,
        };
        state.shippingCents = state.selectedRate.rateCents;
        renderSummary();
        validateShippingStep();
      });

      ui.shippingOptions.appendChild(row);
    });
  }

  function computeFlatRateShipping() {
    const config = state.shippingConfig;
    if (!config?.enabled || config.flatRateCents == null) {
      state.shippingCents = 0;
      return;
    }

    const freeApplies =
      typeof config.freeThresholdCents === "number" && subtotalCents() >= config.freeThresholdCents;
    state.shippingCents = freeApplies ? 0 : config.flatRateCents;
  }

  function validateAddressForQuote() {
    if (!state.address.city.trim() || !state.address.postalCode.trim()) {
      showMessage("error", "City and postal code are required to quote shipping");
      return false;
    }
    return true;
  }

  async function maybePrefillFromPortal() {
    try {
      const raw = localStorage.getItem(portalSessionKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed?.sessionToken || Date.now() >= new Date(parsed.expiresAt).getTime()) {
        return;
      }

      const profile = await fetchJson("/api/connect/portal/me", {
        headers: { "X-Portal-Token": parsed.sessionToken, Accept: "application/json" },
      });

      const defaultAddress = profile?.contact?.shippingAddresses?.find((a) => a.isDefault)
        || profile?.contact?.shippingAddresses?.[0];
      if (defaultAddress) {
        state.address.streetAddress = defaultAddress.street1 || "";
        state.address.suburb = defaultAddress.suburb || "";
        state.address.city = defaultAddress.city || "";
        state.address.province = defaultAddress.province || "";
        state.address.postalCode = defaultAddress.postalCode || "";
      }

      if (state.shippingConfig?.enabled && state.shippingConfig?.flatRateCents == null && state.shippingConfig?.shipLogicEnabled) {
        const ratesData = await fetchJson(`/api/connect/shipping/rates?cart_value_cents=${subtotalCents()}`, {
          headers: { "X-Portal-Token": parsed.sessionToken, Accept: "application/json" },
        });
        if (Array.isArray(ratesData.rates)) {
          state.quoteResult = ratesData;
          renderShippingOptions(ratesData.rates, ratesData.freeDeliveryApplies);
          ui.shippingDescription.textContent =
            ratesData.source === "cache"
              ? "Using cached rates from your saved address."
              : "Live rates loaded.";
        }
      }
    } catch {
      // Non-blocking enhancement.
    }
  }

  function renderShippingStep() {
    ui.shippingActions.innerHTML = "";
    ui.shippingOptions.innerHTML = "";

    if (!cartRequiresShipping()) {
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "No shipping is required for your cart.";
      ui.shippingAddressForm.innerHTML = "";
      validateShippingStep();
      return;
    }

    renderAddressForm();

    const shipping = state.shippingConfig;
    if (!shipping?.enabled) {
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "Collection only. No delivery fee applies.";
      validateShippingStep();
      return;
    }

    if (typeof shipping.flatRateCents === "number") {
      computeFlatRateShipping();
      const free = state.shippingCents === 0 && shipping.freeThresholdCents != null;
      ui.shippingDescription.textContent = free
        ? "Free delivery applies to this order."
        : `Flat delivery fee applies: ${currencyFormat(shipping.flatRateCents, activeCurrency())}`;
      validateShippingStep();
      return;
    }

    if (shipping.shipLogicEnabled) {
      ui.shippingDescription.textContent =
        "Enter your address and request live courier rates.";

      const quoteButton = document.createElement("button");
      quoteButton.type = "button";
      quoteButton.className = "btn";
      quoteButton.innerHTML = '<span class="spinner hidden dark"></span>Get courier quote';
      const quoteSpinner = quoteButton.querySelector(".spinner");

      quoteButton.addEventListener("click", async () => {
        showMessage("", "");
        if (!validateAddressForQuote()) return;

        quoteButton.disabled = true;
        quoteSpinner.classList.remove("hidden");

        try {
          const quote = await fetchJson("/api/connect/shipping/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              delivery_address: {
                street_address: state.address.streetAddress || undefined,
                local_area: state.address.suburb || undefined,
                city: state.address.city,
                zone: state.address.province || undefined,
                code: state.address.postalCode,
                country: "ZA",
              },
              parcels: state.parcels,
              declared_value: subtotalCents() / 100,
              cart_value_cents: subtotalCents(),
            }),
          });

          state.quoteResult = quote;
          renderShippingOptions(quote.rates, quote.freeDeliveryApplies);
          validateShippingStep();
        } catch (error) {
          showMessage("error", error.message || "Failed to fetch courier rates");
        } finally {
          quoteButton.disabled = false;
          quoteSpinner.classList.add("hidden");
        }
      });

      ui.shippingActions.appendChild(quoteButton);
      validateShippingStep();
      return;
    }

    ui.shippingDescription.textContent = "Contact the store for delivery rates.";
    ui.toGiftBtn.disabled = true;
  }

  function validateShippingStep() {
    const shipping = state.shippingConfig;

    if (!cartRequiresShipping()) {
      ui.toGiftBtn.disabled = false;
      return;
    }

    if (!shipping?.enabled) {
      ui.toGiftBtn.disabled = false;
      return;
    }

    if (typeof shipping.flatRateCents === "number") {
      const hasAddress = state.address.city.trim() && state.address.postalCode.trim();
      ui.toGiftBtn.disabled = !hasAddress;
      return;
    }

    if (shipping.shipLogicEnabled) {
      ui.toGiftBtn.disabled = !state.selectedRate;
      return;
    }

    ui.toGiftBtn.disabled = true;
  }

  function renderSummary() {
    const subtotal = subtotalCents();
    const shipping = state.shippingCents;
    const total = orderTotalCents();

    ui.summaryBox.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${currencyFormat(subtotal, activeCurrency())}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${currencyFormat(shipping, activeCurrency())}</span></div>
      <div class="summary-row"><span>Gift card</span><span>-${currencyFormat(state.gift.discountCents, activeCurrency())}</span></div>
      <div class="summary-row total"><span>Total</span><span>${currencyFormat(total, activeCurrency())}</span></div>
    `;
  }

  function formatDateLong(isoDate) {
    const date = new Date(isoDate);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
  }

  async function applyGiftCard() {
    const code = ui.giftCode.value.trim();
    if (!code) {
      ui.giftMessage.className = "message error";
      ui.giftMessage.textContent = "Enter a gift card code first";
      ui.giftMessage.classList.remove("hidden");
      return;
    }

    ui.giftApplyBtn.disabled = true;
    ui.giftSpinner.classList.remove("hidden");
    ui.giftMessage.classList.add("hidden");

    try {
      const data = await fetchJson(`/api/connect/gift-cards/validate?code=${encodeURIComponent(code)}`);
      if (!data.valid || data.error === "not_found" || ["redeemed", "cancelled"].includes(data.status)) {
        ui.giftMessage.className = "message error";
        ui.giftMessage.textContent = "This gift card is invalid or has already been used";
        ui.giftMessage.classList.remove("hidden");
        return;
      }

      if (data.status === "expired") {
        ui.giftMessage.className = "message error";
        ui.giftMessage.textContent = `This gift card expired on ${formatDateLong(data.expiresAt)}`;
        ui.giftMessage.classList.remove("hidden");
        return;
      }

      const maxDiscount = Math.min(Number(data.balanceCents || 0), subtotalCents() + state.shippingCents);
      state.gift.code = data.code;
      state.gift.discountCents = maxDiscount;
      ui.giftRemoveBtn.classList.remove("hidden");

      const remainingDue = Math.max(0, subtotalCents() + state.shippingCents - maxDiscount);
      const message = `R ${Number(data.balanceCents / 100).toFixed(2)} available - R ${Number(maxDiscount / 100).toFixed(2)} will be deducted. Remaining due: ${currencyFormat(remainingDue, activeCurrency())}`;
      ui.giftMessage.className = "message success";
      ui.giftMessage.textContent = message;
      ui.giftMessage.classList.remove("hidden");

      renderSummary();
    } catch {
      ui.giftMessage.className = "message error";
      ui.giftMessage.textContent = "Something went wrong, please try again";
      ui.giftMessage.classList.remove("hidden");
    } finally {
      ui.giftApplyBtn.disabled = false;
      ui.giftSpinner.classList.add("hidden");
    }
  }

  function removeGiftCard() {
    state.gift.code = null;
    state.gift.discountCents = 0;
    ui.giftCode.value = "";
    ui.giftMessage.classList.add("hidden");
    ui.giftRemoveBtn.classList.add("hidden");
    renderSummary();
  }

  async function placeOrder() {
    const name = ui.customerName.value.trim();
    const email = ui.customerEmail.value.trim();

    if (!name || !email) {
      showMessage("error", "Name and email are required");
      return;
    }

    showMessage("", "");
    ui.placeOrderBtn.disabled = true;
    ui.placeSpinner.classList.remove("hidden");

    const platformOrderId = `web-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    const payload = {
      customerName: name,
      customerEmail: email,
      customerPhone: ui.customerPhone.value.trim() || undefined,
      platform: "website",
      platformOrderId,
      paymentStatus: "paid",
      shippingCost: state.shippingCents,
      items: state.cart.map((item) => ({
        description: item.name,
        quantity: item.quantity,
        unitPriceInCents: item.priceInCents,
        productId: item.productId,
        variantId: item.variantId || undefined,
      })),
      shippingAddress: state.address.streetAddress || undefined,
      shippingCity: state.address.city || undefined,
      shippingProvince: state.address.province || undefined,
      shippingPostalCode: state.address.postalCode || undefined,
      shipLogicQuoteId: state.quoteResult?.quoteId || undefined,
      shipLogicServiceCode: state.selectedRate?.serviceCode || undefined,
      shipLogicServiceId: state.selectedRate?.serviceId || undefined,
      shipLogicRate:
        typeof state.selectedRate?.rateCents === "number"
          ? state.selectedRate.rateCents / 100
          : undefined,
      parcels: state.quoteResult?.quoteId ? state.parcels : undefined,
      lekkerGiftCardCode: state.gift.code || undefined,
      lekkerGiftCardAmountCents: state.gift.code ? state.gift.discountCents : undefined,
    };

    try {
      const data = await fetchJson("/api/connect/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      ui.confirmationOrder.textContent = `Order ${data.orderNumber} placed successfully.`;
      ui.confirmationSummary.innerHTML = `
        <div class="summary-row"><span>Items</span><span>${state.cart.length}</span></div>
        <div class="summary-row"><span>Total paid</span><span>${currencyFormat(orderTotalCents(), activeCurrency())}</span></div>
        ${state.selectedRate ? `<div class="summary-row"><span>Shipping service</span><span>${state.selectedRate.serviceName}</span></div>` : ""}
        ${typeof data.giftCardRedeemedCents === "number" ? `<div class="summary-row"><span>Gift card applied</span><span>${currencyFormat(data.giftCardRedeemedCents, activeCurrency())}</span></div>` : ""}
      `;
      state.cart = [];
      renderCart();
      renderSummary();
      setStep("confirmation");
    } catch (error) {
      const msg = error.status >= 500
        ? "The server could not complete your order. Please retry."
        : (error.message || "Could not submit your order");
      showMessage("error", msg);
    } finally {
      ui.placeOrderBtn.disabled = false;
      ui.placeSpinner.classList.add("hidden");
    }
  }

  function nextFromCart() {
    if (!state.cart.length) return;
    if (!cartRequiresShipping()) {
      state.shippingCents = 0;
      setStep("gift");
      return;
    }
    renderShippingStep();
    setStep("shipping");
  }

  function nextFromShipping() {
    if (ui.toGiftBtn.disabled) return;
    setStep("gift");
    renderSummary();
  }

  function nextFromGift() {
    setStep("customer");
    renderSummary();
  }

  async function init() {
    try {
      const [feed, pickupPoints] = await Promise.all([
        fetchJson("/api/connect/feed?published=true"),
        fetchJson("/api/connect/shipping/pickup-points").catch(() => ({ pickupPoints: [] })),
      ]);

      state.feed = feed;
      state.products = Array.isArray(feed.products) ? feed.products : [];
      state.shippingConfig = feed.workspace?.shipping || null;
      state.pickupPoints = Array.isArray(pickupPoints.pickupPoints) ? pickupPoints.pickupPoints : [];
      state.pickupPointsLoaded = true;

      renderProducts();
      renderCart();
      renderSummary();
      renderAddressForm();
      await maybePrefillFromPortal();
      setStep("cart");
    } catch {
      showMessage("error", "Could not load checkout data. Please refresh.");
    }
  }

  ui.toShippingBtn.addEventListener("click", nextFromCart);
  ui.backToCartBtn.addEventListener("click", () => setStep("cart"));
  ui.toGiftBtn.addEventListener("click", nextFromShipping);
  ui.backToShippingBtn.addEventListener("click", () => setStep("shipping"));
  ui.toCustomerBtn.addEventListener("click", nextFromGift);
  ui.backToGiftBtn.addEventListener("click", () => setStep("gift"));
  ui.placeOrderBtn.addEventListener("click", placeOrder);

  ui.giftToggleBtn.addEventListener("click", () => {
    ui.giftPanel.classList.toggle("hidden");
  });
  ui.giftApplyBtn.addEventListener("click", applyGiftCard);
  ui.giftRemoveBtn.addEventListener("click", removeGiftCard);

  init();
})();
