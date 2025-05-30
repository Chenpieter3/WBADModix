let currentImageIndex = 0;
let mainImage;
let thumbnails;

function updateMainImage() {
  if (!mainImage || !thumbnails) return;

  mainImage.src = thumbnails[currentImageIndex].src;

  thumbnails.forEach(t => t.classList.remove('active'));
  thumbnails[currentImageIndex].classList.add('active');

  updateCarouselButtons();
}

function updateCarouselButtons() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (prevBtn) prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'flex';
  if (nextBtn) nextBtn.style.display = currentImageIndex === thumbnails.length - 1 ? 'none' : 'flex';
}

function nextImage() {
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
  const qtyInput = document.getElementById('quantity');
  if (!qtyInput) return;
  let qty = parseInt(qtyInput.value, 10) || 1;
  qty = Math.max(1, Math.min(10, qty + change));
  qtyInput.value = qty;
}

function showToast(msg = "Item added to cart!") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function addToCart() {
  const selectedSize = document.querySelector('.size-btn.selected')?.textContent;
  const selectedColor = document.querySelector('.color-option.active')?.dataset.color;

  if (!selectedSize) {
    showToast("Please select a size first!");
    return;
  }

  showToast(`Added to cart! Size: ${selectedSize}, Color: ${selectedColor || 'Default'}`);

  const cartBadge = document.getElementById("cart-badge");
  if (cartBadge) {
    cartBadge.style.display = "inline-block";
  }
}

function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  event.target.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  mainImage = document.getElementById('main-img');
  thumbnails = document.querySelectorAll('.thumbnail');

  updateMainImage();

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', function () {
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      mainImage.src = this.src;
      currentImageIndex = index;
      updateCarouselButtons();
    });
  });

  document.querySelector('.qty-increase')?.addEventListener('click', () => updateQuantity(1));
  document.querySelector('.qty-decrease')?.addEventListener('click', () => updateQuantity(-1));

  document.querySelectorAll('.size-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('add-to-bag').disabled = false;
    });
  });

  document.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.querySelector('.add-to-cart-btn')?.addEventListener('click', addToCart);
});
