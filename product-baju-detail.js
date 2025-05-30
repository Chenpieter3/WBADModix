let currentImageIndex = 0;
let mainImage;
let thumbnails;

function updateMainImage() {
  if (
    !mainImage ||
    !thumbnails ||
    thumbnails.length === 0 ||
    !thumbnails[currentImageIndex]
  ) {
    return;
  }
  mainImage.src = thumbnails[currentImageIndex].src;
  thumbnails.forEach((t) => t.classList.remove("active"));
  thumbnails[currentImageIndex].classList.add("active");
  updateCarouselButtons();
}

function updateCarouselButtons() {
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  if (!thumbnails || thumbnails.length === 0) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    return;
  }
  if (prevBtn)
    prevBtn.style.display = currentImageIndex === 0 ? "none" : "flex";
  if (nextBtn)
    nextBtn.style.display =
      currentImageIndex === thumbnails.length - 1 ? "none" : "flex";
}

function nextImage() {
  if (!thumbnails || thumbnails.length === 0) return;
  if (currentImageIndex < thumbnails.length - 1) {
    currentImageIndex++;
    updateMainImage();
  }
}

function prevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    updateMainImage();
  }
}

function updateQuantity(change) {
  const qtyInput = document.getElementById("quantity");
  if (!qtyInput) return;
  let qty = parseInt(qtyInput.value, 10) || 1;
  qty = Math.max(1, Math.min(10, qty + change)); // Max 10, Min 1
  qtyInput.value = qty;
}

function showToast(msg = "Item action performed!") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Helper function to parse Rupiah string to number
function parseRupiah(rupiahString) {
  if (!rupiahString) return 0;
  // Menghilangkan semua karakter kecuali angka, koma, dan tanda minus, lalu mengganti koma dengan titik
  return parseFloat(rupiahString.replace(/[^0-9,-]+/g, "").replace(",", "."));
}

function addToCart() {
<<<<<<< HEAD
  const productNameElement = document.querySelector(".product-detail-info h2");
  const productPriceElement = document.querySelector(
    ".product-detail-info .product-price"
  );
  const mainImageElement = document.getElementById("main-img");
  const quantityInput = document.getElementById("quantity");

  const selectedSize =
    document.querySelector(".size-btn.selected")?.dataset.size;
  const quantity = parseInt(quantityInput.value, 10); // Get quantity here

  if (
    !productNameElement ||
    !productPriceElement ||
    !mainImageElement ||
    !quantityInput
  ) {
    console.error(
      "Product details elements not found! Check H2, .product-price, #main-img, #quantity."
    );
    showToast("Error: Could not add item. Product details missing.");
    return;
  }
=======
  const selectedSize = document.querySelector('.size-btn.selected')?.textContent;
  const quantity = parseInt(document.getElementById('quantity')?.value || '1', 10);
  const productName = document.querySelector('.product-detail-info h2')?.textContent || 'Unknown Product';
  const productPrice = document.querySelector('.product-price')?.textContent || '0';
  const productImage = document.getElementById('main-img')?.src || '';
  const productId = productName.toLowerCase().replace(/\s+/g, '-');
>>>>>>> 197c4ed8077289b999b1e32844de7f138e37b386

  if (!selectedSize) {
    showToast("Please select a size first!");
    return;
  }

<<<<<<< HEAD
  const product = {
    // ID dibuat unik berdasarkan nama produk dan ukuran
    id:
      productNameElement.textContent.trim().replace(/\s+/g, "-") +
      "-" +
      selectedSize,
    name: productNameElement.textContent.trim(),
    price: parseRupiah(productPriceElement.textContent),
    image: mainImageElement.src, // Ini akan menyimpan path absolut gambar
    size: selectedSize,
    quantity: quantity, // The quantity for this specific product instance
  };

  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error("Error parsing cart from localStorage:", e);
    cart = []; // Reset cart jika parsing gagal
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
  updateHeaderCartBadge(); // Panggil fungsi update badge
}

function updateHeaderCartBadge() {
  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error("Error parsing cart from localStorage for badge update:", e);
    cart = [];
  }
=======
  const cartItem = {
    id: productId,
    name: productName,
    price: productPrice,
    size: selectedSize,
    quantity: quantity,
    image: productImage
  };

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(cartItem);
  localStorage.setItem('cart', JSON.stringify(cart));

  showToast(`Added to cart! ${quantity}x ${productName} (Size: ${selectedSize})`);
>>>>>>> 197c4ed8077289b999b1e32844de7f138e37b386

  const cartBadge = document.getElementById("cart-badge");
  if (!cartBadge) {
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    cartBadge.textContent = totalItems > 9 ? "9+" : totalItems;
    cartBadge.style.display = "inline-block";
  } else {
    cartBadge.style.display = "none";
  }
}

function openTab(tabId, event) {
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));

  const tabToActivate = document.getElementById(tabId);
  if (tabToActivate) {
    tabToActivate.classList.add("active");
  }

  // Activate the clicked tab button
  if (event && event.target) {
    event.target.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mainImage = document.getElementById("main-img");
  thumbnails = document.querySelectorAll(".thumbnail");

  if (mainImage && thumbnails && thumbnails.length > 0) {
    updateMainImage();
  }

  if (thumbnails) {
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", function () {
        thumbnails.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        if (mainImage) mainImage.src = this.src;
        currentImageIndex = index;
        updateCarouselButtons();
      });
    });
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

<<<<<<< HEAD
  updateHeaderCartBadge();
=======
  document.querySelectorAll('.size-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('add-to-bag').disabled = false;
    });
  });

  document.querySelector('.add-to-cart-btn')?.addEventListener('click', addToCart);
>>>>>>> 197c4ed8077289b999b1e32844de7f138e37b386
});
