// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  // ... (Elemen-elemen dan fungsi-fungsi awal seperti formatRupiah, getCart, showToast, updateHeaderCartBadge, renderOrderSummary, validateShippingForm, getSelectedPaymentMethod, displayPaymentInstructions tetap sama) ...

  // Pastikan Anda memiliki definisi untuk elemen-elemen ini di awal file:
  const shippingForm = document.getElementById("shipping-form"); // harus sudah ada
  // const placeOrderBtn = document.getElementById("place-order-btn"); // harus sudah ada
  // const iHavePaidBtn = document.getElementById("i-have-paid-btn"); // harus sudah ada
  // const paymentSuccessPopup = document.getElementById("payment-success-popup"); // harus sudah ada
  // const closeSuccessPopupBtn = document.getElementById("close-success-popup"); // harus sudah ada
  const popupContinueShoppingBtn = document.getElementById("popup-continue-shopping"); // Ini akan kita ubah fungsinya
  
  // --- AWAL FUNGSI YANG SUDAH ADA (tidak perlu diubah) ---
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
  
  function showToast(msg = "Action completed!", type = "success") {
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

  function updateHeaderCartBadge() {
    const cart = getCart(); // Mengambil data keranjang yang aktif
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const headerCartBadge = document.getElementById("cart-badge");
    if (headerCartBadge) {
      if (totalItems > 0) {
        headerCartBadge.textContent = totalItems > 9 ? "9+" : totalItems;
        headerCartBadge.style.display = "inline-block";
      } else {
        headerCartBadge.style.display = "none";
      }
    }
  }

  function renderOrderSummary() {
    const cart = getCart();
    const checkoutItemsContainer = document.getElementById("checkout-items-container");
    const summarySubtotalElement = document.getElementById("checkout-summary-subtotal");
    const summaryTotalElement = document.getElementById("checkout-summary-total");
    const placeOrderBtn = document.getElementById("place-order-btn"); // Ambil lagi di sini untuk konteks fungsi

    if (!checkoutItemsContainer || !summarySubtotalElement || !summaryTotalElement) {
        console.error("One or more summary elements are missing from the DOM for checkout summary.");
        return;
    }
    checkoutItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      checkoutItemsContainer.innerHTML = "<p>Your cart is empty. Add items to proceed or continue shopping.</p>";
      summarySubtotalElement.textContent = formatRupiah(0);
      summaryTotalElement.textContent = formatRupiah(0);
      if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        const iHavePaidBtn = document.getElementById("i-have-paid-btn");
        if (iHavePaidBtn) iHavePaidBtn.style.display = "none";
        placeOrderBtn.style.display = "block";
      }
      return;
    }

    let subtotal = 0;
    cart.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("checkout-item");
      const itemDisplaySubtotal = item.price * item.quantity;
      subtotal += itemDisplaySubtotal;
      itemElement.innerHTML = `
        <div class="checkout-item-details">
          <p class="checkout-item-name">${item.name} (x${item.quantity})</p>
          <p class="checkout-item-meta">Size: ${item.size}, Price: ${formatRupiah(item.price)}</p>
        </div>
        <div class="checkout-item-subtotal">${formatRupiah(itemDisplaySubtotal)}</div>
      `;
      checkoutItemsContainer.appendChild(itemElement);
    });

    summarySubtotalElement.textContent = formatRupiah(subtotal);
    summaryTotalElement.textContent = formatRupiah(subtotal);

    if (placeOrderBtn) placeOrderBtn.disabled = false;
  }

  function validateShippingForm() {
    const inputs = shippingForm.querySelectorAll("input[required], textarea[required]");
    let isValid = true;
    inputs.forEach(input => {
        input.style.borderColor = '#ddd'; 
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red'; 
        }
    });
    if (!isValid) {
        showToast("Please fill in all required shipping details.", "error");
    }
    return isValid;
  }

  function getSelectedPaymentMethod() {
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    return selectedPayment ? selectedPayment.value : null;
  }

  function displayPaymentInstructions(paymentMethod, totalAmount) {
    const instructionPopupTitle = document.getElementById("instruction-popup-title");
    const instructionPopupDetails = document.getElementById("instruction-popup-details");
    const paymentInstructionPopup = document.getElementById("payment-instruction-popup");
    let detailsHTML = "";
    const formattedTotal = formatRupiah(totalAmount);

    switch(paymentMethod) {
        case "bank_transfer":
            instructionPopupTitle.textContent = "Bank Transfer Instructions";
            detailsHTML = `<p>Please transfer a total of <strong>${formattedTotal}</strong> to the following bank account:</p><p><strong>Bank Name:</strong> Bank Central Asia (BCA)</p><p><strong>Account Number:</strong> 123-456-7890</p><p><strong>Account Holder:</strong> PT ModiX Fashion Store</p><p>Please include your Order ID (if available) in the transfer description. Your order will be processed after payment confirmation.</p>`;
            break;
        case "e_wallet":
            instructionPopupTitle.textContent = "E-Wallet Payment Instructions";
            detailsHTML = `<p>Please pay a total of <strong>${formattedTotal}</strong> using your preferred E-Wallet:</p><p><strong>GoPay/OVO/Dana Number:</strong> 0812-0000-0001 (ModiX Store)</p><p>Alternatively, scan the QR code below (QR Code not available in this demo).</p><p>Ensure the recipient name is "ModiX Store" before confirming payment.</p>`;
            break;
        case "cod":
            instructionPopupTitle.textContent = "Cash on Delivery (COD)";
            detailsHTML = `<p>You have selected Cash on Delivery.</p><p>Please prepare a total of <strong>${formattedTotal}</strong> in cash to be paid to the courier upon delivery of your order.</p><p>Our courier will contact you before attempting delivery.</p>`;
            break;
        default:
            instructionPopupTitle.textContent = "Payment Instructions";
            detailsHTML = "<p>Payment instructions for the selected method are currently unavailable. Please try another method or contact support.</p>";
    }
    if (instructionPopupDetails) instructionPopupDetails.innerHTML = detailsHTML;
    if (paymentInstructionPopup) paymentInstructionPopup.style.display = "flex";
  }
  // --- AKHIR FUNGSI YANG SUDAH ADA ---


  // Event Listener for Place Order Button
  const placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      if (!validateShippingForm()) {
        return;
      }
      const paymentMethod = getSelectedPaymentMethod();
      if (!paymentMethod) {
        showToast("Please select a payment method.", "error");
        return;
      }

      const cart = getCart();
      if (cart.length === 0) {
        showToast("Your cart is empty. Please add items to your cart first.", "error");
        return;
      }
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      console.log("Order initiated with details:", {
        name: document.getElementById('full-name').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone-number').value,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        cart: cart
      });

      if (shippingForm) shippingForm.querySelectorAll("input, textarea").forEach(el => el.disabled = true);
      document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => radio.disabled = true);
      
      placeOrderBtn.disabled = true;
      displayPaymentInstructions(paymentMethod, totalAmount);
    });
  }

  function handleCloseInstructionPopup() {
    const paymentInstructionPopup = document.getElementById("payment-instruction-popup");
    const iHavePaidBtn = document.getElementById("i-have-paid-btn"); // Ambil lagi di sini

    if (paymentInstructionPopup) paymentInstructionPopup.style.display = "none";
    if (placeOrderBtn) placeOrderBtn.style.display = "none"; 
    if (iHavePaidBtn) iHavePaidBtn.style.display = "block"; 
    showToast("Please complete your payment and then click 'I Have Paid'.", "info");
  }

  const closeInstructionPopupBtn = document.getElementById("close-instruction-popup");
  if (closeInstructionPopupBtn) {
    closeInstructionPopupBtn.addEventListener("click", handleCloseInstructionPopup);
  }
  const instructionPopupConfirmBtn = document.getElementById("instruction-popup-confirm-btn");
  if (instructionPopupConfirmBtn) {
    instructionPopupConfirmBtn.addEventListener("click", handleCloseInstructionPopup);
  }

  // Event Listener for I Have Paid Button
  const iHavePaidBtn = document.getElementById("i-have-paid-btn");
  if (iHavePaidBtn) {
    iHavePaidBtn.addEventListener("click", () => {
      const paymentSuccessPopup = document.getElementById("payment-success-popup"); // Ambil lagi di sini
      if (paymentSuccessPopup) paymentSuccessPopup.style.display = "flex";
      iHavePaidBtn.disabled = true; 

      // **MODIFIKASI DIMULAI DI SINI**
      const currentCart = getCart();
      const totalAmountForOrder = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const orderDetails = {
          orderId: `MODIX-${Date.now()}`,
          date: new Date().toISOString(),
          items: currentCart,
          totalAmount: totalAmountForOrder,
          shippingInfo: {
              name: document.getElementById('full-name').value,
              address: document.getElementById('address').value,
              phone: document.getElementById('phone-number').value
          },
          paymentMethod: getSelectedPaymentMethod(),
          status: "Processing" // Status awal
      };

      let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];
      completedOrders.push(orderDetails);
      localStorage.setItem("completedOrders", JSON.stringify(completedOrders));
      console.log("Order saved to completedOrders:", orderDetails);
      // **MODIFIKASI SELESAI DI SINI**

      localStorage.removeItem("cart");
      renderOrderSummary(); 
      updateHeaderCartBadge(); 
      console.log("Cart cleared from localStorage.");

      // Ubah teks tombol di popup sukses jika ada
      if(popupContinueShoppingBtn) {
        popupContinueShoppingBtn.textContent = "View Order History";
      }
    });
  }
  
  function handleCloseSuccessPopupAndRedirect() {
    const paymentSuccessPopup = document.getElementById("payment-success-popup"); // Ambil lagi di sini
    if (paymentSuccessPopup) paymentSuccessPopup.style.display = "none";
    // **MODIFIKASI: Arahkan ke histori pesanan**
    window.location.href = "order-history.html"; 
  }

  const closeSuccessPopupBtn = document.getElementById("close-success-popup");
  if (closeSuccessPopupBtn) { 
    closeSuccessPopupBtn.addEventListener("click", handleCloseSuccessPopupAndRedirect);
  }
  
  if (popupContinueShoppingBtn) {
    popupContinueShoppingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleCloseSuccessPopupAndRedirect(); // Fungsi yang sama untuk mengarahkan ke histori
    });
  }

  window.addEventListener("click", (event) => {
    const paymentInstructionPopup = document.getElementById("payment-instruction-popup");
    const paymentSuccessPopup = document.getElementById("payment-success-popup");

    if (event.target === paymentInstructionPopup) { 
        // handleCloseInstructionPopup(); // Opsional: tutup jika klik di luar
    }
    if (event.target === paymentSuccessPopup) { 
      handleCloseSuccessPopupAndRedirect();
    }
  });

  // Initial Load
  renderOrderSummary();
  updateHeaderCartBadge();
});