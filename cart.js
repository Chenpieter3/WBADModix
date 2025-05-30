// cart.js

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const summarySubtotalElement = document.getElementById("summary-subtotal");
  const summaryTotalElement = document.getElementById("summary-total");
  const cartItemCountElement = document.getElementById("cart-item-count");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // Function to format number as Rupiah
  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  }

  function getCart() {
    try {
      const cartData = localStorage.getItem("cart");
      return cartData ? JSON.parse(cartData) : [];
    } catch (e) {
      console.error("Error parsing cart from localStorage", e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCartBadge();
    renderCart();
  }

  function showToast(msg = "Cart updated!") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function updateHeaderCartBadge() {
    const cart = getCart();
    const cartBadge = document.getElementById("cart-badge");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartBadge) {
      if (totalItems > 0) {
        cartBadge.textContent = totalItems > 9 ? "9+" : totalItems;
        cartBadge.style.display = "inline-block";
      } else {
        cartBadge.style.display = "none";
      }
    }
  }

  function renderCartItem(item) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.dataset.itemId = item.id;

    const itemSubtotal = item.price * item.quantity;

    // Resolve image path correctly - assuming 'assets' is at the same level or accessible from root
    // If mainImage.src on product page is like "./assets/Celana/Chino Formal/chino-pants-1.jpg"
    // And cart.html is at the root with product-celana-detail.html, this might need adjustment
    // For robustness, you might want to store a more absolute-like path or a base path.
    // For now, assume item.image is a usable path from cart.html's location.
    let imagePath = item.image;
    // Example: if item.image is "http://localhost:xxxx/assets/Celana/..." it's fine.
    // If it's "./assets/Celana/..." and cart.html is in the root, it should also be fine.

    itemElement.innerHTML = `
            <img src="${imagePath}" alt="${item.name}" class="cart-item-image"/>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p class="cart-item-price">${formatRupiah(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <label>Quantity</label>
                <div class="quantity-controls">
                    <button class="qty-btn qty-decrease" data-id="${
                      item.id
                    }">-</button>
                    <input type="number" value="${
                      item.quantity
                    }" min="1" max="10" readonly />
                    <button class="qty-btn qty-increase" data-id="${
                      item.id
                    }">+</button>
                </div>
            </div>
            <div class="cart-item-subtotal">
                <p>${formatRupiah(itemSubtotal)}</p>
            </div>
            <button class="cart-item-remove" data-id="${
              item.id
            }"><i class="fas fa-trash-alt"></i></button>
        `;

    itemElement
      .querySelector(".qty-decrease")
      .addEventListener("click", () => updateQuantity(item.id, -1));
    itemElement
      .querySelector(".qty-increase")
      .addEventListener("click", () => updateQuantity(item.id, 1));
    itemElement
      .querySelector(".cart-item-remove")
      .addEventListener("click", () => removeItem(item.id));

    return itemElement;
  }

  function updateQuantity(itemId, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex((i) => i.id === itemId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      if (cart[itemIndex].quantity < 1) {
        cart[itemIndex].quantity = 1;
      } else if (cart[itemIndex].quantity > 10) {
        // Max 10
        cart[itemIndex].quantity = 10;
        showToast("Maximum quantity per item is 10.");
      }
      saveCart(cart);
      if (cart[itemIndex].quantity < 10 || change < 0) {
        // Don't show toast if already at max and trying to increase
        showToast("Quantity updated!");
      }
    }
  }

  function removeItem(itemId) {
    let cart = getCart();
    cart = cart.filter((i) => i.id !== itemId);
    saveCart(cart);
    showToast("Item removed from cart.");
  }

  function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal; // Assuming no shipping/taxes for now

    if (summarySubtotalElement)
      summarySubtotalElement.textContent = formatRupiah(subtotal);
    if (summaryTotalElement)
      summaryTotalElement.textContent = formatRupiah(total);
    if (cartItemCountElement)
      cartItemCountElement.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
    }
  }

  function renderCart() {
    const cart = getCart();
    if (!cartItemsContainer) return; // Guard clause
    cartItemsContainer.innerHTML = "";

    const cartItemsSectionTitle = document.querySelector(
      ".cart-items-section h2"
    );
    const cartSummarySection = document.querySelector(".cart-summary-section");

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      cartItemsContainer.style.display = "none";
      if (cartSummarySection) cartSummarySection.style.display = "none";
      if (cartItemsSectionTitle) cartItemsSectionTitle.style.display = "none";
    } else {
      if (emptyCartMessage) emptyCartMessage.style.display = "none";
      cartItemsContainer.style.display = "block";
      if (cartSummarySection) cartSummarySection.style.display = "block";
      if (cartItemsSectionTitle) cartItemsSectionTitle.style.display = "block";
      cart.forEach((item) => {
        cartItemsContainer.appendChild(renderCartItem(item));
      });
    }
    updateCartSummary();
  }

  // Initial Load
  renderCart();
  updateHeaderCartBadge();

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length > 0) {
        showToast("Redirecting to checkout... (Not implemented)");
        // Example: window.location.href = 'checkout.html';
      }
    });
  }
});
