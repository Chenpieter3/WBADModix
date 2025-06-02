import { formatRupiah, showToast, updateHeaderCartBadge, getCart } from './utils.js';

// Image carousel functionality
let currentImageIndex = 0;
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-img');

function updateMainImage(index) {
    mainImage.src = thumbnails[index].src;
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[index].classList.add('active');
    currentImageIndex = index;
}

// Add click event listeners to carousel buttons
document.querySelector('.prev-btn').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
    updateMainImage(currentImageIndex);
});

document.querySelector('.next-btn').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
    updateMainImage(currentImageIndex);
});

// Add click event listeners to thumbnails
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        updateMainImage(index);
    });
});

// Tab functionality
function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabContents.forEach(content => content.classList.remove('active'));
    tabButtons.forEach(button => button.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Add click event listeners to tab buttons
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        openTab(button.dataset.tab);
    });
});

function updateQuantity(change) {
  const qtyInput = document.getElementById("quantity");
  if (!qtyInput) return;
  let qty = parseInt(qtyInput.value, 10) || 1;
  qty = Math.max(1, Math.min(10, qty + change)); // Max 10, Min 1
  qtyInput.value = qty;
}

// Helper function to parse Rupiah string to number
function parseRupiah(rupiahString) {
  if (!rupiahString) return 0;
  return parseFloat(rupiahString.replace(/[^0-9,-]+/g, "").replace(",", "."));
}

function addToCart() {
  const productNameElement = document.querySelector(".product-detail-info h2");
  const productPriceElement = document.querySelector(".product-detail-info .product-price");
  const mainImageElement = document.getElementById("main-img");
  const quantityInput = document.getElementById("quantity");

  const selectedSize = document.querySelector(".size-btn.selected")?.dataset.size || 
                      document.querySelector(".size-btn.selected")?.textContent;
  const quantity = parseInt(quantityInput?.value || '1', 10);

  if (!productNameElement || !productPriceElement || !mainImageElement) {
    console.error("Product details elements not found!");
    showToast("Error: Could not add item. Product details missing.");
    return;
  }

  if (!selectedSize) {
    showToast("Please select a size first!");
    return;
  }

  const product = {
    id: productNameElement.textContent.trim().replace(/\s+/g, "-") + "-" + selectedSize,
    name: productNameElement.textContent.trim(),
    price: parseRupiah(productPriceElement.textContent),
    image: mainImageElement.src,
    size: selectedSize,
    quantity: quantity,
  };

  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error("Error parsing cart from localStorage:", e);
    cart = [];
  }

  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity = product.quantity;
  } else {
    cart.push(product);
  }

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving cart to localStorage:", e);
    showToast("Error saving item to cart.");
    return;
  }

  showToast(`${product.name} (Size: ${product.size}) added to cart!`);
  updateHeaderCartBadge();
}

document.addEventListener("DOMContentLoaded", () => {
  if (mainImage && thumbnails && thumbnails.length > 0) {
    updateMainImage(currentImageIndex);
  }

  document
    .querySelector(".qty-increase")
    ?.addEventListener("click", () => updateQuantity(1));
  document
    .querySelector(".qty-decrease")
    ?.addEventListener("click", () => updateQuantity(-1));

  document.querySelectorAll(".size-btn:not(.disabled)").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".size-btn")
        .forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");
      const addToBagBtn = document.getElementById("add-to-bag");
      if (addToBagBtn) addToBagBtn.disabled = false;
    });
  });

  const addToCartButton = document.querySelector(".add-to-cart-btn");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", addToCart);
  }

  updateHeaderCartBadge();
}); 