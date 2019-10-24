"use strict";

if (typeof checkoutButton === "undefined") {
  const checkoutButton = document.querySelector(".cart-totals-button-checkout");
  if (checkoutButton) {
    const oneClickCheckoutButton = document.createElement("button");
    oneClickCheckoutButton.textContent = "One Click Checkout";
    checkoutButton.parentNode.insertBefore(
      oneClickCheckoutButton,
      checkoutButton
    );
    // checkoutButton.click();
  }
}
