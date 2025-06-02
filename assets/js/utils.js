// Utility functions for the entire application

export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function showToast(msg = "Action completed!", type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show';
  if (type === 'error') {
    toast.classList.add('error');
  } else if (type === 'info') {
    toast.classList.add('info');
  }
  setTimeout(() => toast.classList.remove("show"), 3000);
}

export function getCart() {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (e) {
    console.error("Error parsing cart from localStorage", e);
    return [];
  }
}

export function updateHeaderCartBadge() {
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

export function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Date(dateString)
    .toLocaleDateString("id-ID", options)
    .replace(/\./g, ":");
} 