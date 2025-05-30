document.addEventListener("DOMContentLoaded", () => {
  const orderListContainer = document.getElementById("order-list-container");
  const emptyHistoryMessage = document.querySelector(".empty-history-message");
  const headerCartBadge = document.getElementById("cart-badge"); // Untuk update badge keranjang

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  }

  function formatDate(dateString) {
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
      .replace(/\./g, ":"); // Ganti titik pemisah jam
  }

  // Fungsi untuk update badge keranjang di header (bisa disamakan dengan di checkout.js)
  function updateHeaderCartBadge() {
    const cartData = localStorage.getItem("cart"); // Cek keranjang aktif
    const cart = cartData ? JSON.parse(cartData) : [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (headerCartBadge) {
      if (totalItems > 0) {
        headerCartBadge.textContent = totalItems > 9 ? "9+" : totalItems;
        headerCartBadge.style.display = "inline-block";
      } else {
        headerCartBadge.style.display = "none";
      }
    }
  }

  function renderOrderHistory() {
    const completedOrdersData = localStorage.getItem("completedOrders");
    const completedOrders = completedOrdersData
      ? JSON.parse(completedOrdersData)
      : [];

    if (!orderListContainer || !emptyHistoryMessage) {
      console.error("Order list container or empty message element not found.");
      return;
    }
    orderListContainer.innerHTML = ""; // Bersihkan konten sebelumnya

    if (completedOrders.length === 0) {
      if (emptyHistoryMessage) emptyHistoryMessage.style.display = "block";
    } else {
      if (emptyHistoryMessage) emptyHistoryMessage.style.display = "none";

      // Tampilkan pesanan dengan yang terbaru di atas
      completedOrders
        .slice()
        .reverse()
        .forEach((order) => {
          const orderCard = document.createElement("div");
          orderCard.classList.add("order-item-card");

          let productsHTML = '<div class="order-products-list">';
          order.items.forEach((item) => {
            productsHTML += `
                        <div class="history-product-item">
                            <img src="${
                              item.image || "./assets/placeholder.png"
                            }" alt="${item.name}">
                            <div class="history-product-details">
                                <p class="product-name">${item.name}</p>
                                <p class="product-meta">Size: ${item.size}</p>
                                <p class="product-qty">Qty: ${
                                  item.quantity
                                } x ${formatRupiah(item.price)}</p>
                            </div>
                            <div class="history-product-subtotal">${formatRupiah(
                              item.price * item.quantity
                            )}</div>
                        </div>
                    `;
          });
          productsHTML += "</div>";

          const shippingInfoHTML = `
                    <div class="order-shipping-info">
                        <h4>Shipping Information</h4>
                        <p><strong>Recipient:</strong> ${
                          order.shippingInfo.name
                        }</p>
                        <p><strong>Address:</strong> ${
                          order.shippingInfo.address
                        }</p>
                        <p><strong>Phone:</strong> ${
                          order.shippingInfo.phone
                        }</p>
                        <p><strong>Payment:</strong> ${order.paymentMethod
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}</p>
                    </div>
                `;

          orderCard.innerHTML = `
                    <div class="order-item-header">
                        <div class="order-info">
                            <h3>Order <span class="order-id">#${order.orderId.substring(
                              order.orderId.length - 6
                            )}</span></h3>
                            <span class="order-date">${formatDate(
                              order.date
                            )}</span>
                        </div>
                        <span class="order-status ${order.status.toLowerCase()}">${
            order.status
          }</span>
                    </div>
                    ${productsHTML}
                    <div class="order-summary-history">
                        <p class="total-amount"><span>Total Pesanan:</span> ${formatRupiah(
                          order.totalAmount
                        )}</p>
                    </div>
                    ${shippingInfoHTML}
                `;
          orderListContainer.appendChild(orderCard);
        });
    }
  }

  // Panggil saat halaman dimuat
  renderOrderHistory();
  updateHeaderCartBadge(); // Pastikan badge keranjang di header sudah benar (harusnya kosong)
});
