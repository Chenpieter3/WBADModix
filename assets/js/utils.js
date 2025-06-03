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
  const cartBadgeMobile = document.getElementById("cart-badge-mobile");
  const cartBadgeDesktop = document.getElementById("cart-badge-desktop");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateBadge = (badge) => {
    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems > 9 ? "9+" : totalItems;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    }
  };

  updateBadge(cartBadgeMobile);
  updateBadge(cartBadgeDesktop);
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

export function toggleResponsiveMenu() {
  var hamburger = document.getElementById('hamburger-menu');
  var nav = document.getElementById('main-nav');
  var overlay = document.getElementById('nav-overlay');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
    if (overlay) {
      overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        overlay.classList.remove('open');
      });
    }
    // Dropdown on mobile: click to open (event only on <a> inside .has-dropdown)
    var dropdownLinks = nav.querySelectorAll('.has-dropdown > a');
    dropdownLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          var parent = this.parentElement;
          parent.classList.toggle('dropdown-open');
        }
      });
    });
    // Close menu on link click (except dropdown parent)
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var parentLi = link.parentElement;
        if (
          window.innerWidth <= 900 &&
          !parentLi.classList.contains('has-dropdown')
        ) {
          hamburger.classList.remove('active');
          nav.classList.remove('open');
          if (overlay) overlay.classList.remove('open');
        }
      });
    });
  }
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      document.querySelectorAll('.has-dropdown.dropdown-open').forEach(function(el) {
        el.classList.remove('dropdown-open');
      });
    }
  });
} 