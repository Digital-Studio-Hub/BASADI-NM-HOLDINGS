(() => {
  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-btn");
  const spinner = document.getElementById("submit-spinner");
  const message = document.getElementById("form-message");

  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    message: document.getElementById("message"),
  };

  const errorEls = {
    fullName: document.getElementById("fullName-error"),
    email: document.getElementById("email-error"),
    phone: document.getElementById("phone-error"),
    message: document.getElementById("message-error"),
  };

  function clearErrors() {
    Object.values(errorEls).forEach((el) => {
      el.textContent = "";
    });
  }

  function setLoading(loading) {
    submitButton.disabled = loading;
    spinner.classList.toggle("hidden", !loading);
  }

  function showMessage(kind, text) {
    message.className = `message ${kind}`;
    message.textContent = text;
    message.classList.remove("hidden");
  }

  function validate() {
    clearErrors();
    let isValid = true;

    const name = fields.fullName.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();

    if (!name) {
      errorEls.fullName.textContent = "Full name is required";
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEls.email.textContent = "Enter a valid email address";
      isValid = false;
    }

    if (phone && !/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
      errorEls.phone.textContent = "Enter a valid phone number";
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    message.classList.add("hidden");

    if (!validate()) {
      return;
    }

    setLoading(true);

    const payload = {
      name: fields.fullName.value.trim(),
      email: fields.email.value.trim() || undefined,
      phone: fields.phone.value.trim() || undefined,
      message: fields.message.value.trim() || undefined,
      sourceUrl: window.location.href,
    };

    try {
      const response = await fetch("/api/connect/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const serverMessage =
          typeof data.message === "string"
            ? data.message
            : "Something went wrong, please try again";
        showMessage("error", serverMessage);
        return;
      }

      showMessage(
        "success",
        "Thank you. Your message has been received and we will contact you soon.",
      );
      form.reset();
    } catch {
      showMessage("error", "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  }

  form.addEventListener("submit", handleSubmit);
})();
