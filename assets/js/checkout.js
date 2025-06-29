import { formatRupiah, showToast, getCart, updateHeaderCartBadge, formatDate, toggleResponsiveMenu } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const shippingForm = document.getElementById("shipping-form");
  const popupContinueShoppingBtn = document.getElementById("popup-continue-shopping");
  
  function renderOrderSummary() {
    const cart = getCart();
    const checkoutItemsContainer = document.getElementById("checkout-items-container");
    const summarySubtotalElement = document.getElementById("checkout-summary-subtotal");
    const summaryTotalElement = document.getElementById("checkout-summary-total");
    const placeOrderBtn = document.getElementById("place-order-btn");

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
    const iHavePaidBtn = document.getElementById("i-have-paid-btn");

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

  const iHavePaidBtn = document.getElementById("i-have-paid-btn");
  if (iHavePaidBtn) {
    iHavePaidBtn.addEventListener("click", () => {
      const paymentSuccessPopup = document.getElementById("payment-success-popup");
      if (paymentSuccessPopup) paymentSuccessPopup.style.display = "flex";
      iHavePaidBtn.disabled = true; 

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
          status: "Processing"
      };

      let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];
      completedOrders.push(orderDetails);
      localStorage.setItem("completedOrders", JSON.stringify(completedOrders));
      console.log("Order saved to completedOrders:", orderDetails);

      localStorage.removeItem("cart");
      renderOrderSummary(); 
      updateHeaderCartBadge();
    });
  }
  
  function handleCloseSuccessPopupAndRedirect() {
    const paymentSuccessPopup = document.getElementById("payment-success-popup");
    if (paymentSuccessPopup) paymentSuccessPopup.style.display = "none";
    window.location.href = "order-history.html"; 
  }

  const closeSuccessPopupBtn = document.getElementById("close-success-popup");
  if (closeSuccessPopupBtn) { 
    closeSuccessPopupBtn.addEventListener("click", handleCloseSuccessPopupAndRedirect);
  }
  
  if (popupContinueShoppingBtn) {
    popupContinueShoppingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleCloseSuccessPopupAndRedirect();
    });
  }

  window.addEventListener("click", (event) => {
    const paymentInstructionPopup = document.getElementById("payment-instruction-popup");
    const paymentSuccessPopup = document.getElementById("payment-success-popup");

    if (event.target === paymentInstructionPopup) { 
        handleCloseInstructionPopup();
    }
    if (event.target === paymentSuccessPopup) { 
      handleCloseSuccessPopupAndRedirect();
    }
  });

  renderOrderSummary();
  updateHeaderCartBadge();

  toggleResponsiveMenu();
});