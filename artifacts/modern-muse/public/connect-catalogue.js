(() => {
  const elements = {
    workspaceName: document.getElementById("workspace-name"),
    workspaceMeta: document.getElementById("workspace-meta"),
    workspaceLogo: document.getElementById("workspace-logo"),
    deliveryBanner: document.getElementById("delivery-banner"),
    categoryTabs: document.getElementById("category-tabs"),
    productsGrid: document.getElementById("products-grid"),
    loadingState: document.getElementById("loading-state"),
    contentState: document.getElementById("content-state"),
    errorState: document.getElementById("error-state"),
    errorMessage: document.getElementById("error-message"),
    retryButton: document.getElementById("retry-button"),
    cardTemplate: document.getElementById("product-card-template"),
  };

  const state = {
    workspace: null,
    categories: [],
    products: [],
    activeCategoryId: "all",
  };

  function setViewMode(mode) {
    const isLoading = mode === "loading";
    const isError = mode === "error";
    const isContent = mode === "content";

    elements.loadingState.hidden = !isLoading;
    elements.errorState.hidden = !isError;
    elements.contentState.hidden = !isContent;
    elements.productsGrid.setAttribute("aria-busy", String(isLoading));
  }

  function renderSkeletons(count = 8) {
    elements.loadingState.innerHTML = "";

    for (let i = 0; i < count; i += 1) {
      const card = document.createElement("article");
      card.className = "skeleton-card";
      card.innerHTML = `
        <div class="skeleton-media"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      `;
      elements.loadingState.appendChild(card);
    }
  }

  function getCurrencyFormatter(currencyCode) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode || "ZAR",
        minimumFractionDigits: 2,
      });
    } catch {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "ZAR",
        minimumFractionDigits: 2,
      });
    }
  }

  function formatAmountInCents(cents, formatter) {
    if (typeof cents !== "number") {
      return null;
    }
    return formatter.format(cents / 100);
  }

  function renderHeader(workspace) {
    elements.workspaceName.textContent = workspace?.name || "Products";

    const address = workspace?.address
      ? [
          workspace.address.city,
          workspace.address.province,
          workspace.address.postalCode,
        ]
          .filter(Boolean)
          .join(", ")
      : null;

    elements.workspaceMeta.textContent = address || "Browse available products";

    if (workspace?.logo) {
      elements.workspaceLogo.src = workspace.logo;
      elements.workspaceLogo.hidden = false;
    } else {
      elements.workspaceLogo.hidden = true;
      elements.workspaceLogo.removeAttribute("src");
    }
  }

  function renderDeliveryBanner(workspace, formatter) {
    const shipping = workspace?.shipping;

    if (!shipping?.enabled || typeof shipping.flatRateCents !== "number") {
      elements.deliveryBanner.hidden = true;
      elements.deliveryBanner.textContent = "";
      return;
    }

    const flatRateText = formatAmountInCents(shipping.flatRateCents, formatter);
    const thresholdText = formatAmountInCents(
      shipping.freeThresholdCents,
      formatter,
    );

    const parts = [`Delivery: ${flatRateText}`];
    if (thresholdText) {
      parts.push(`Free over ${thresholdText}`);
    }

    elements.deliveryBanner.textContent = parts.join(" - ");
    elements.deliveryBanner.hidden = false;
  }

  function createCategoryTabs() {
    elements.categoryTabs.innerHTML = "";

    const tabs = [{ id: "all", name: "All" }, ...state.categories];
    tabs.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-tab";
      button.dataset.categoryId = category.id;
      button.textContent = category.name;

      if (state.activeCategoryId === category.id) {
        button.classList.add("is-active");
      }

      button.addEventListener("click", () => {
        state.activeCategoryId = category.id;
        createCategoryTabs();
        renderProducts();
      });

      elements.categoryTabs.appendChild(button);
    });
  }

  function getFilteredProducts() {
    if (state.activeCategoryId === "all") {
      return state.products;
    }

    return state.products.filter((product) =>
      product.categories?.some((category) => category.id === state.activeCategoryId),
    );
  }

  function renderProducts() {
    const products = getFilteredProducts();
    const formatter = getCurrencyFormatter(state.workspace?.currency);
    elements.productsGrid.innerHTML = "";

    if (!products.length) {
      const note = document.createElement("p");
      note.className = "empty-note";
      note.textContent = "No products found for this category.";
      elements.productsGrid.appendChild(note);
      return;
    }

    products.forEach((product) => {
      const card = elements.cardTemplate.content.cloneNode(true);
      const image = card.querySelector(".product-image");
      const placeholder = card.querySelector(".image-placeholder");
      const stockBadge = card.querySelector(".stock-badge");
      const name = card.querySelector(".product-name");
      const price = card.querySelector(".product-price");

      name.textContent = product.name;
      price.textContent = formatter.format(product.price);

      if (product.imageUrl) {
        image.src = product.imageUrl;
        image.alt = product.name;
        image.hidden = false;
        placeholder.hidden = true;
      }

      if (!product.inStock) {
        stockBadge.hidden = false;
      }

      elements.productsGrid.appendChild(card);
    });
  }

  function renderFromPayload(payload) {
    state.workspace = payload.workspace || null;
    state.categories = Array.isArray(payload.categories) ? payload.categories : [];
    state.products = Array.isArray(payload.products) ? payload.products : [];
    state.activeCategoryId = "all";

    const formatter = getCurrencyFormatter(state.workspace?.currency);

    renderHeader(state.workspace);
    renderDeliveryBanner(state.workspace, formatter);
    createCategoryTabs();
    renderProducts();
  }

  async function fetchCatalogue() {
    setViewMode("loading");
    renderSkeletons(8);

    try {
      const response = await fetch("/api/connect-feed?published=true", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      renderFromPayload(payload);
      setViewMode("content");
    } catch (error) {
      elements.errorMessage.textContent =
        "We could not load the product feed. Please check your connection and try again.";
      if (error instanceof Error && /500|502/.test(error.message)) {
        elements.errorMessage.textContent =
          "The catalogue service is temporarily unavailable. Please retry in a moment.";
      }
      setViewMode("error");
    }
  }

  elements.retryButton.addEventListener("click", fetchCatalogue);

  fetchCatalogue();
})();