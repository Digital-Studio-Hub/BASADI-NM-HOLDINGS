(() => {
  const storageKey = "CONNECT_PORTAL_SESSION";

  const views = {
    login: document.getElementById("view-login"),
    verify: document.getElementById("view-verify"),
    dashboard: document.getElementById("view-dashboard"),
  };

  const ui = {
    globalMessage: document.getElementById("global-message"),
    loginEmail: document.getElementById("login-email"),
    loginPhone: document.getElementById("login-phone"),
    sendCodeBtn: document.getElementById("send-code-btn"),
    sendCodeSpinner: document.getElementById("send-code-spinner"),
    verifyChannel: document.getElementById("verify-channel"),
    otpCode: document.getElementById("otp-code"),
    verifyBtn: document.getElementById("verify-btn"),
    verifySpinner: document.getElementById("verify-spinner"),
    resendBtn: document.getElementById("resend-btn"),
    resendCountdown: document.getElementById("resend-countdown"),
    ordersBody: document.querySelector("#orders-table tbody"),
    invoicesBody: document.querySelector("#invoices-table tbody"),
    greeting: document.getElementById("greeting"),
    logoutBtn: document.getElementById("logout-btn"),
  };

  const state = {
    identifier: { email: "", phone: "" },
    channel: "",
    resendSecondsLeft: 0,
    resendTimer: null,
  };

  function showView(viewName) {
    Object.entries(views).forEach(([name, el]) => {
      el.classList.toggle("hidden", name !== viewName);
    });
  }

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

  function readSession() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.sessionToken || !parsed.expiresAt) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveSession(sessionToken, expiresAt) {
    localStorage.setItem(storageKey, JSON.stringify({ sessionToken, expiresAt }));
  }

  function clearSession() {
    localStorage.removeItem(storageKey);
  }

  function isSessionValid(expiresAt) {
    return Date.now() < new Date(expiresAt).getTime();
  }

  function formatMoney(value, currency) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "ZAR",
    }).format(Number(value || 0));
  }

  function formatDate(isoDate) {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  }

  function statusClass(status) {
    const value = String(status || "").toLowerCase();
    if (value.includes("paid") || value.includes("complete")) return "ok";
    if (value.includes("pending") || value.includes("open")) return "warn";
    if (value.includes("failed") || value.includes("cancel")) return "danger";
    return "warn";
  }

  function renderDashboard(data) {
    const contactName = data?.contact?.name || "Customer";
    ui.greeting.textContent = `Welcome, ${contactName}`;

    const orders = Array.isArray(data?.recentOrders) ? data.recentOrders : [];
    const invoices = Array.isArray(data?.outstandingInvoices)
      ? data.outstandingInvoices
      : [];

    ui.ordersBody.innerHTML = "";
    if (!orders.length) {
      ui.ordersBody.innerHTML = '<tr><td colspan="4" class="muted">No recent orders</td></tr>';
    } else {
      orders.forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${order.orderNumber || "-"}</td>
          <td>${formatDate(order.orderDate)}</td>
          <td><span class="badge ${statusClass(order.status)}">${order.status || "-"}</span></td>
          <td>${formatMoney(order.total, order.currency)}</td>
        `;
        ui.ordersBody.appendChild(row);
      });
    }

    ui.invoicesBody.innerHTML = "";
    if (!invoices.length) {
      ui.invoicesBody.innerHTML = '<tr><td colspan="4" class="muted">No outstanding invoices</td></tr>';
    } else {
      invoices.forEach((invoice) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${invoice.invoiceNumber || "-"}</td>
          <td>${formatDate(invoice.dueDate)}</td>
          <td><span class="badge ${statusClass(invoice.status)}">${invoice.status || "-"}</span></td>
          <td>${formatMoney(invoice.total, invoice.currency)}</td>
        `;
        ui.invoicesBody.appendChild(row);
      });
    }
  }

  function startResendCooldown(seconds = 60) {
    state.resendSecondsLeft = seconds;
    ui.resendBtn.disabled = true;

    if (state.resendTimer) {
      clearInterval(state.resendTimer);
    }

    state.resendTimer = setInterval(() => {
      state.resendSecondsLeft -= 1;
      ui.resendCountdown.textContent =
        state.resendSecondsLeft > 0 ? `Resend in ${state.resendSecondsLeft}s` : "";

      if (state.resendSecondsLeft <= 0) {
        clearInterval(state.resendTimer);
        state.resendTimer = null;
        ui.resendBtn.disabled = false;
      }
    }, 1000);
  }

  async function fetchProfile(sessionToken) {
    const response = await fetch("/api/connect/portal/me", {
      headers: {
        "X-Portal-Token": sessionToken,
        Accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorCode = data?.error;
      if (errorCode === "session_expired" || errorCode === "invalid_session") {
        clearSession();
        showView("login");
        setMessage("error", "Your session has expired");
        return null;
      }
      throw new Error(data?.message || "Could not load profile");
    }

    return data;
  }

  async function sendCode() {
    const email = ui.loginEmail.value.trim();
    const phone = ui.loginPhone.value.trim();

    if (!email && !phone) {
      setMessage("error", "Please enter email or phone");
      return;
    }

    setMessage("", "");
    setLoading(ui.sendCodeBtn, ui.sendCodeSpinner, true);

    try {
      const response = await fetch("/api/connect/portal/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email || undefined, phone: phone || undefined }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const code = data?.error;
        if (code === "contact_not_found") {
          setMessage("error", "No contact found for that email or phone");
          return;
        }
        if (code === "rate_limited") {
          setMessage("error", "Too many code requests. Please try again later");
          return;
        }
        if (code === "delivery_failed") {
          setMessage("error", "Could not send code right now. Please retry");
          return;
        }
        setMessage("error", data?.message || "Unable to send code");
        return;
      }

      state.identifier = { email, phone };
      state.channel = data?.channel || "email";
      ui.verifyChannel.textContent = `Code sent via ${state.channel}`;
      showView("verify");
      ui.otpCode.value = "";
      ui.otpCode.focus();
      startResendCooldown(60);
    } catch {
      setMessage("error", "Unable to send code. Please try again.");
    } finally {
      setLoading(ui.sendCodeBtn, ui.sendCodeSpinner, false);
    }
  }

  async function verifyCode() {
    const code = ui.otpCode.value.trim();
    if (!/^\d{6}$/.test(code)) {
      setMessage("error", "Enter a valid 6-digit code");
      return;
    }

    setMessage("", "");
    setLoading(ui.verifyBtn, ui.verifySpinner, true);

    try {
      const response = await fetch("/api/connect/portal/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: state.identifier.email || undefined,
          phone: state.identifier.phone || undefined,
          code,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const codeValue = data?.error;
        if (codeValue === "invalid_code" || codeValue === "expired") {
          setMessage("error", "The code is invalid or expired");
          return;
        }
        if (codeValue === "too_many_attempts") {
          setMessage("error", "Too many attempts. Request a new code");
          return;
        }
        setMessage("error", data?.message || "Could not verify code");
        return;
      }

      saveSession(data.sessionToken, data.expiresAt);
      const profile = await fetchProfile(data.sessionToken);
      if (!profile) {
        return;
      }
      renderDashboard(profile);
      showView("dashboard");
    } catch {
      setMessage("error", "Could not verify code. Please try again");
    } finally {
      setLoading(ui.verifyBtn, ui.verifySpinner, false);
    }
  }

  async function resendCode() {
    if (ui.resendBtn.disabled) return;
    await sendCode();
  }

  async function restoreSession() {
    const saved = readSession();
    if (!saved || !isSessionValid(saved.expiresAt)) {
      clearSession();
      showView("login");
      return;
    }

    try {
      const profile = await fetchProfile(saved.sessionToken);
      if (!profile) return;
      renderDashboard(profile);
      showView("dashboard");
    } catch {
      clearSession();
      showView("login");
      setMessage("error", "Could not restore your session");
    }
  }

  function logout() {
    clearSession();
    showView("login");
    setMessage("success", "You have been logged out");
  }

  ui.sendCodeBtn.addEventListener("click", sendCode);
  ui.verifyBtn.addEventListener("click", verifyCode);
  ui.resendBtn.addEventListener("click", resendCode);
  ui.logoutBtn.addEventListener("click", logout);

  ui.otpCode.addEventListener("input", () => {
    ui.otpCode.value = ui.otpCode.value.replace(/\D/g, "").slice(0, 6);
  });

  restoreSession();
})();
