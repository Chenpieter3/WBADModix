import { formatRupiah, showToast, getCart, updateHeaderCartBadge, toggleResponsiveMenu } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const summarySubtotalElement = document.getElementById("summary-subtotal");
  const summaryTotalElement = document.getElementById("summary-total");
  const cartItemCountElement = document.getElementById("cart-item-count");
  const checkoutBtn = document.querySelector(".checkout-btn");

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCartBadge();
    renderCart();
  }

  function renderCartItem(item) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.dataset.itemId = item.id;

    const itemSubtotal = item.price * item.quantity;

    let imagePath = item.image;

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
            }"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
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
        cart[itemIndex].quantity = 10;
        showToast("Maximum quantity per item is 10.");
      }
      saveCart(cart);
      updateHeaderCartBadge();
      if (cart[itemIndex].quantity < 10 || change < 0) {
        showToast("Quantity updated!");
      }
    }
  }

  function removeItem(itemId) {
    let cart = getCart();
    cart = cart.filter((i) => i.id !== itemId);
    saveCart(cart);
    updateHeaderCartBadge();
    showToast("Item removed from cart.");
  }

  function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal;

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
    if (!cartItemsContainer) return;
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

  renderCart();
  updateHeaderCartBadge();

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length > 0) {
        window.location.href = 'checkout.html';
      }
    });
  }

  toggleResponsiveMenu();
});
