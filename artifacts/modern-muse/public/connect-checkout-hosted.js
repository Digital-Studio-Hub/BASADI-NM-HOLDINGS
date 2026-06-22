(() => {
  const STEPS = ["cart", "shipping", "customer", "confirmation"];
  const ORDER_SESSION_KEY = "CONNECT_HOSTED_LAST_ORDER";

  const ui = {
    stepBar: document.getElementById("step-bar"),
    globalMessage: document.getElementById("global-message"),
    views: {
      cart: document.getElementById("step-cart"),
      shipping: document.getElementById("step-shipping"),
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
    toCustomerBtn: document.getElementById("to-customer-btn"),
    customerName: document.getElementById("customer-name"),
    customerEmail: document.getElementById("customer-email"),
    customerPhone: document.getElementById("customer-phone"),
    summaryBox: document.getElementById("summary-box"),
    backToShippingBtn: document.getElementById("back-to-shipping-btn"),
    payBtn: document.getElementById("pay-btn"),
    paySpinner: document.getElementById("pay-spinner"),
    confirmationMessage: document.getElementById("confirmation-message"),
    confirmationSummary: document.getElementById("confirmation-summary"),
    redeemCode: document.getElementById("redeem-code"),
    redeemBtn: document.getElementById("redeem-btn"),
    redeemSpinner: document.getElementById("redeem-spinner"),
    redeemMessage: document.getElementById("redeem-message"),
  };

  const state = {
    currentStep: "cart",
    currency: "ZAR",
    workspace: null,
    products: [],
    cart: [],
    shippingAddress: {
      streetAddress: "",
      suburb: "",
      city: "",
      province: "",
      postalCode: "",
    },
    shippingMode: "none",
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
  };

  function setMessage(kind, text) {
    if (!text) {
      ui.globalMessage.classList.add("hidden");
      ui.globalMessage.textContent = "";
      return;
    }
    ui.globalMessage.className = `message ${kind}`;
    ui.globalMessage.textContent = text;
    ui.globalMessage.classList.remove("hidden");
  }

  function setLoading(button, spinner, loading) {
    button.disabled = loading;
    spinner.classList.toggle("hidden", !loading);
  }

  function subtotalCents() {
    return state.cart.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  }

  function requiresShipping() {
    return state.cart.some((item) => item.requiresShipping);
  }

  function totalCents() {
    return subtotalCents() + state.shippingCents;
  }

  function money(cents) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: state.currency,
    }).format((cents || 0) / 100);
  }

  function renderStepBar() {
    ui.stepBar.innerHTML = "";
    STEPS.forEach((step) => {
      if (step === "shipping" && !requiresShipping()) return;
      const pill = document.createElement("span");
      pill.className = `step-pill ${state.currentStep === step ? "active" : ""}`;
      pill.textContent = step.toUpperCase();
      ui.stepBar.appendChild(pill);
    });
  }

  function setStep(step) {
    state.currentStep = step;
    Object.entries(ui.views).forEach(([key, el]) => {
      el.classList.toggle("hidden", key !== step);
    });
    renderStepBar();
    renderSummary();
  }

  function deliveryConfig() {
    return state.workspace?.shipping || {};
  }

  function renderProducts() {
    ui.productGrid.innerHTML = "";
    state.products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="media">${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}"/>` : "No image"}</div>
        <div class="body">
          <h3>${product.name}</h3>
          <p class="muted">${money(product.priceInCents)}</p>
          <button class="btn" ${product.inStock ? "" : "disabled"}>${product.inStock ? "Add" : "Out of stock"}</button>
        </div>
      `;

      card.querySelector("button").addEventListener("click", () => {
        const existing = state.cart.find((item) => item.productId === product.id);
        if (existing) existing.quantity += 1;
        else {
          state.cart.push({
            productId: product.id,
            variantId: null,
            name: product.name,
            quantity: 1,
            priceInCents: product.priceInCents,
            requiresShipping: !!product.requiresShipping,
          });
        }
        renderCart();
      });

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
          <span>${item.name} x ${item.quantity}</span>
          <span>${money(item.quantity * item.priceInCents)}</span>
        `;
        ui.cartItems.appendChild(row);
      });
    }

    ui.cartSubtotal.innerHTML = `<span>Subtotal</span><span>${money(subtotalCents())}</span>`;
    renderSummary();
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

  function readAddressForm() {
    state.shippingAddress.streetAddress = document.getElementById("ship-street").value.trim();
    state.shippingAddress.suburb = document.getElementById("ship-suburb").value.trim();
    state.shippingAddress.city = document.getElementById("ship-city").value.trim();
    state.shippingAddress.province = document.getElementById("ship-province").value.trim();
    state.shippingAddress.postalCode = document.getElementById("ship-postal").value.trim();
  }

  async function renderShippingStep() {
    renderShippingAddressForm();
    ui.shippingActions.innerHTML = "";
    ui.shippingOptions.innerHTML = "";
    ui.toCustomerBtn.disabled = false;

    if (!requiresShipping()) {
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "No shipping is required for this order.";
      return;
    }

    const cfg = deliveryConfig();

    if (!cfg.enabled) {
      state.shippingMode = "collection";
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "Collection only";
      return;
    }

    state.shippingMode = "courier";

    if (typeof cfg.flatRateCents === "number") {
      const free = typeof cfg.freeThresholdCents === "number" && subtotalCents() >= cfg.freeThresholdCents;
      state.shippingCents = free ? 0 : cfg.flatRateCents;
      ui.shippingDescription.textContent = free
        ? "Free delivery applies"
        : `Flat shipping fee: ${money(cfg.flatRateCents)}`;
      return;
    }

    if (!cfg.shipLogicEnabled) {
      state.shippingCents = 0;
      ui.shippingDescription.textContent = "Contact the store for delivery rates.";
      ui.toCustomerBtn.disabled = true;
      return;
    }

    ui.shippingDescription.textContent = "Get live courier rates.";

    const quoteBtn = document.createElement("button");
    quoteBtn.className = "btn";
    quoteBtn.type = "button";
    quoteBtn.innerHTML = '<span class="spinner hidden"></span><span>Get quote</span>';
    const quoteSpinner = quoteBtn.querySelector(".spinner");

    quoteBtn.addEventListener("click", async () => {
      readAddressForm();
      if (!state.shippingAddress.city || !state.shippingAddress.postalCode) {
        setMessage("error", "City and postal code are required for quote");
        return;
      }

      setMessage("", "");
      setLoading(quoteBtn, quoteSpinner, true);

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
          setMessage("error", data?.message || "Could not fetch quote");
          return;
        }

        state.shippingQuote = data;
        const rates = Array.isArray(data.rates) ? data.rates : [];
        ui.shippingOptions.innerHTML = "";

        rates.forEach((rate) => {
          const row = document.createElement("label");
          row.className = "summary-row";
          const rateCents = data.freeDeliveryApplies ? 0 : Number(rate.rateCents || 0);
          row.innerHTML = `
            <span><input type="radio" name="hosted-rate" /> ${rate.serviceName}</span>
            <span>${
              data.freeDeliveryApplies
                ? `<s>${money(rate.rateCents)}</s> <strong>Free delivery</strong>`
                : money(rateCents)
            }</span>
          `;

          row.querySelector("input").addEventListener("change", () => {
            state.shippingSelection = {
              quoteId: data.quoteId,
              serviceCode: rate.serviceCode,
              serviceId: rate.serviceId,
              rateCents,
            };
            state.shippingCents = rateCents;
            ui.toCustomerBtn.disabled = false;
            renderSummary();
          });

          ui.shippingOptions.appendChild(row);
        });

        ui.toCustomerBtn.disabled = !state.shippingSelection;
      } catch {
        setMessage("error", "Could not fetch quote");
      } finally {
        setLoading(quoteBtn, quoteSpinner, false);
      }
    });

    ui.shippingActions.appendChild(quoteBtn);
    ui.toCustomerBtn.disabled = !state.shippingSelection;
  }

  function renderSummary() {
    const lines = state.cart
      .map(
        (item) => `<div class="summary-row"><span>${item.name} x ${item.quantity}</span><span>${money(item.priceInCents * item.quantity)}</span></div>`,
      )
      .join("");

    ui.summaryBox.innerHTML = `
      ${lines}
      <div class="summary-row"><span>Subtotal</span><span>${money(subtotalCents())}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${money(state.shippingCents)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(totalCents())}</span></div>
    `;
  }

  function validateCustomer() {
    const name = ui.customerName.value.trim();
    if (!name) {
      setMessage("error", "Customer name is required");
      return false;
    }
    return true;
  }

  function buildReturnUrl(status) {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("payment", status);
    return url.toString();
  }

  async function startHostedPayment() {
    if (!validateCustomer()) return;

    setMessage("", "");
    setLoading(ui.payBtn, ui.paySpinner, true);

    try {
      const checkoutItems = state.cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceInCents: item.priceInCents,
      }));

      if (state.shippingCents > 0) {
        checkoutItems.push({
          name: "Delivery",
          quantity: 1,
          priceInCents: state.shippingCents,
        });
      }

      const response = await fetch("/api/connect/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          customer: {
            name: ui.customerName.value.trim(),
            email: ui.customerEmail.value.trim() || undefined,
            phone: ui.customerPhone.value.trim() || undefined,
          },
          returnUrl: buildReturnUrl("success"),
          cancelUrl: buildReturnUrl("cancelled"),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 402) {
          setMessage(
            "error",
            "Online payment is not available for this store yet. Please use the contact form.",
          );
          return;
        }

        setMessage("error", data?.message || "Could not start checkout. Please retry.");
        return;
      }

      sessionStorage.setItem(
        ORDER_SESSION_KEY,
        JSON.stringify({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          shippingCents: state.shippingCents,
          subtotalCents: subtotalCents(),
          totalCents: totalCents(),
          shippingSelection: state.shippingSelection,
        }),
      );

      window.location.href = data.paymentUrl;
    } catch {
      setMessage("error", "Something went wrong. Please retry.");
    } finally {
      setLoading(ui.payBtn, ui.paySpinner, false);
    }
  }

  function showRedeemMessage(kind, text) {
    ui.redeemMessage.className = `message ${kind}`;
    ui.redeemMessage.textContent = text;
    ui.redeemMessage.classList.remove("hidden");
  }

  async function redeemGiftCard() {
    const orderRaw = sessionStorage.getItem(ORDER_SESSION_KEY);
    if (!orderRaw) {
      showRedeemMessage("error", "No order context available for gift card redemption");
      return;
    }

    const code = ui.redeemCode.value.trim();
    if (!code) {
      showRedeemMessage("error", "Enter a gift card code");
      return;
    }

    let order;
    try {
      order = JSON.parse(orderRaw);
    } catch {
      showRedeemMessage("error", "Order context is invalid");
      return;
    }

    setLoading(ui.redeemBtn, ui.redeemSpinner, true);

    try {
      const response = await fetch("/api/connect/gift-cards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          orderId: order.orderId,
          code,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const messageByCode = {
          already_redeemed: "This gift card has already been redeemed",
          order_already_paid_in_full: "Order is already paid in full",
          gift_card_not_found: "Gift card not found",
          order_not_found: "Order not found",
          card_expired: "Gift card expired",
          card_cancelled: "Gift card cancelled",
          insufficient_balance: "Insufficient gift card balance",
        };
        showRedeemMessage("error", messageByCode[data?.error] || "Could not redeem gift card");
        return;
      }

      if (!data.success) {
        showRedeemMessage("error", "Could not redeem gift card");
        return;
      }

      showRedeemMessage(
        "success",
        `Gift card applied - ${money((data.redeemedCents || 0))} redeemed. New total: ${new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: state.currency,
        }).format(Number(data.newOrderTotal || 0))}`,
      );
    } catch {
      showRedeemMessage("error", "Could not redeem gift card");
    } finally {
      setLoading(ui.redeemBtn, ui.redeemSpinner, false);
    }
  }

  function maybeHandleReturn() {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return false;

    const raw = sessionStorage.getItem(ORDER_SESSION_KEY);
    if (!raw) {
      setMessage("error", "No recent order found for this payment return");
      setStep("cart");
      return true;
    }

    const order = JSON.parse(raw);
    if (payment === "cancelled") {
      setMessage("error", "Payment was cancelled. You can try again.");
      setStep("customer");
      return true;
    }

    if (payment === "success") {
      ui.confirmationMessage.textContent = `Order ${order.orderNumber} is being processed.`;
      ui.confirmationSummary.innerHTML = `
        <div class="summary-row"><span>Subtotal</span><span>${money(order.subtotalCents)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${money(order.shippingCents)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${money(order.totalCents)}</span></div>
      `;
      state.cart = [];
      setStep("confirmation");
      return true;
    }

    return false;
  }

  async function init() {
    const handled = maybeHandleReturn();
    if (handled) {
      return;
    }

    try {
      const response = await fetch("/api/connect/feed?published=true", {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage("error", "Failed to load feed");
        return;
      }

      state.workspace = data.workspace || {};
      state.currency = data.workspace?.currency || "ZAR";
      state.products = Array.isArray(data.products) ? data.products : [];

      renderProducts();
      renderCart();
      setStep("cart");
    } catch {
      setMessage("error", "Failed to load feed");
    }
  }

  ui.toShippingBtn.addEventListener("click", async () => {
    if (!state.cart.length) return;
    await renderShippingStep();
    setStep("shipping");
  });

  ui.backToCartBtn.addEventListener("click", () => setStep("cart"));

  ui.toCustomerBtn.addEventListener("click", () => {
    if (requiresShipping() && state.shippingMode === "courier") {
      const cfg = deliveryConfig();
      if (cfg.enabled && cfg.flatRateCents == null && cfg.shipLogicEnabled && !state.shippingSelection) {
        setMessage("error", "Select a shipping option to continue");
        return;
      }
    }
    setStep("customer");
  });

  ui.backToShippingBtn.addEventListener("click", () => setStep("shipping"));
  ui.payBtn.addEventListener("click", startHostedPayment);
  ui.redeemBtn.addEventListener("click", redeemGiftCard);

  init();
})();
