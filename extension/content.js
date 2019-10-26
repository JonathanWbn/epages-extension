"use strict";

chrome.runtime.onMessage.addListener(async function(msg, sender, cb) {
  if (msg.text === "check_if_checkout") {
    const checkoutButton = document.querySelector(
      ".cart-totals-button-checkout"
    );
    if (checkoutButton) cb();
  }
  if (msg.text === "fast_checkout") {
    const checkoutButton = document.querySelector(
      ".cart-totals-button-checkout"
    );
    const changeValue = (element, value) => {
      element.value = value;
      const event = new Event("input", { bubbles: true });
      element.dispatchEvent(event);
    };
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const waitUntil = async (interval, cb) => {
      if (cb()) return;
      else {
        await wait(interval);
        await waitUntil(interval, cb);
      }
    };
    const profiles = {
      jane_doe: {
        email: "jane@doe.com",
        firstName: "Jane",
        lastName: "Doe",
        houseNumber: "25",
        street: "Main Street",
        city: "Anytown",
        postalCode: "123456"
      },
      max_mustermann: {
        email: "max@mustermann.de",
        firstName: "Max",
        lastName: "Mustermann",
        houseNumber: "17",
        street: "Heidestr.",
        city: "München",
        postalCode: "123456"
      }
    };

    checkoutButton.click();
    await waitUntil(
      200,
      () =>
        document.querySelector('input[name="email"]') &&
        document.querySelector('input[name="firstName"]')
    );
    const emailInput = document.querySelector('input[name="email"]');
    changeValue(emailInput, profiles[msg.profile].email);
    const firstNameInput = document.querySelector('input[name="firstName"]');
    changeValue(firstNameInput, profiles[msg.profile].firstName);
    const lastNameInput = document.querySelector('input[name="lastName"]');
    changeValue(lastNameInput, profiles[msg.profile].lastName);
    const houseNumberInput = document.querySelector(
      'input[name="houseNumber"]'
    );
    changeValue(houseNumberInput, profiles[msg.profile].houseNumber);
    const streetInput = document.querySelector('input[name="street"]');
    changeValue(streetInput, profiles[msg.profile].street);
    const cityInput = document.querySelector('input[name="city"]');
    changeValue(cityInput, profiles[msg.profile].city);
    const postalCodeInput = document.querySelector('input[name="postalCode"]');
    changeValue(postalCodeInput, profiles[msg.profile].postalCode);
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.click();

    await waitUntil(200, () => document.querySelector(".shipping-method-list"));
    document.querySelector(".button-primary").click();

    await waitUntil(200, () => document.querySelector(".payment-method-list"));
    document.querySelector(".button-primary").click();

    await waitUntil(200, () =>
      document.querySelector(".confirmation-section-headline")
    );
    const tosToggle = document.querySelector('input[type="checkbox"]');
    if (tosToggle) tosToggle.click();
  }
});
