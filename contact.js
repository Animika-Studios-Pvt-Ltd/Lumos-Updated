let turnstilePassed = false;

document.addEventListener("DOMContentLoaded", function () {
  const selectContainer = document.querySelector(".custom-select-container");
  if (selectContainer) {
    const trigger = selectContainer.querySelector(".custom-select-trigger");
    const triggerText = trigger.querySelector("span");
    const hiddenInput = selectContainer.querySelector("#contact-method");
    const options = selectContainer.querySelectorAll(".custom-options-list li");

    // Toggle dropdown on trigger click
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      selectContainer.classList.toggle("active");
    });

    // Handle option selection
    options.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.stopPropagation();
        const value = this.getAttribute("data-value");
        const text = this.textContent;

        hiddenInput.value = value;
        triggerText.textContent = text;
        selectContainer.classList.add("selected");
        selectContainer.classList.remove("active");

        // Remove selected class from other options
        options.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      selectContainer.classList.remove("active");
    });

    // Handle form reset events
    const formElement = document.getElementById("contactForm");
    if (formElement) {
      formElement.addEventListener("reset", function () {
        setTimeout(() => {
          hiddenInput.value = "";
          triggerText.textContent = "Select Services*";
          selectContainer.classList.remove("selected");
          selectContainer.classList.remove("active");
          options.forEach((opt) => opt.classList.remove("selected"));
        }, 0);
      });
    }
  }
});

// Captcha and Turnstile handlers
function onTurnstileSuccess(token) {
  turnstilePassed = true;
  checkReadyToEnable();
}

function onReCAPTCHACompleted() {
  checkReadyToEnable();
}

function checkReadyToEnable() {
  const recaptchaResponse = grecaptcha.getResponse();
  if (recaptchaResponse && turnstilePassed) {
    document.getElementById("submit-button").disabled = false;
  }
}

// Initializations
window.onload = function () {
  // Execute turnstile
  setTimeout(() => {
    if (typeof turnstile !== "undefined") {
      turnstile.execute("myForm");
    }
  }, 500);

  // Cookie acceptance popup check
  if (!localStorage.getItem("cookiesAccepted")) {
    const cookiePopup = document.getElementById("cookie-popup");
    if (cookiePopup) {
      cookiePopup.classList.add("visible");
    }
  }
};

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submit-button");
const phoneInput = document.getElementById("phone");
const messageBox = document.getElementById("form-message");

// Restrict phone input to numbers only
if (phoneInput) {
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

function resetFormState() {
  form.reset();

  // Reset custom select dropdown state
  const hiddenInput = document.getElementById("contact-method");
  if (hiddenInput) {
    hiddenInput.value = "";
    const selectContainer = document.querySelector(".custom-select-container");
    if (selectContainer) {
      selectContainer.classList.remove("selected");
      const triggerText = selectContainer.querySelector(
        ".custom-select-trigger span",
      );
      if (triggerText) {
        triggerText.textContent = "Select Services*";
      }
      const options = selectContainer.querySelectorAll(
        ".custom-options-list li",
      );
      options.forEach((opt) => opt.classList.remove("selected"));
    }
  }

  if (typeof grecaptcha !== "undefined") {
    grecaptcha.reset();
  }
  if (typeof turnstile !== "undefined") {
    turnstile.reset("myForm");
  }
  turnstilePassed = false;
  submitBtn.disabled = true;
  submitBtn.textContent = "Send Message";
  setTimeout(() => {
    if (typeof turnstile !== "undefined") {
      turnstile.execute("myForm");
    }
  }, 300);
}

// Unified submit event handler
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Validate phone number (must be 10 digits)
    const phone = phoneInput.value.trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      phoneInput.setCustomValidity(
        "Please enter only 10 digits (numbers only)",
      );
      phoneInput.reportValidity();
      return;
    } else {
      phoneInput.setCustomValidity("");
    }

    // 2. Validate Google reCAPTCHA
    if (typeof grecaptcha !== "undefined") {
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        alert("❌ Please complete the Google reCAPTCHA.");
        return;
      }
    }

    // 3. Validate Turnstile
    if (!turnstilePassed) {
      alert("❌ Cloudflare Turnstile verification pending.");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const service = document.getElementById("contact-method").value.trim();
    const message = document.getElementById("message").value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzflxnU9iT3iCEJq6Inw9VlXM8-nR5ljbAm66rd-vHdjupCALCLtx6wDobqDuJ-1Tk-/exec",
        {
          method: "POST",
          body: JSON.stringify({ name, email, phone, service, message }),
        },
      );

      const result = await response.json();

      // Show actual success message on page
      if (messageBox) {
        messageBox.style.display = "block";
        messageBox.innerText = "✅ Your message has been sent successfully!";
        messageBox.style.backgroundColor = "#d4edda";
        messageBox.style.color = "#155724";
        messageBox.style.border = "1px solid #c3e6cb";
      }

      resetFormState();
    } catch (err) {
      console.error("❌ Error submitting form:", err);

      // Show actual error message on page
      if (messageBox) {
        messageBox.style.display = "block";
        messageBox.innerText =
          "❌ Failed to send your message. Please try again later.";
        messageBox.style.backgroundColor = "#f8d7da";
        messageBox.style.color = "#721c24";
        messageBox.style.border = "1px solid #f5c6cb";
      }

      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    } finally {
      // Auto-hide the message box after 4 seconds
      if (messageBox) {
        setTimeout(() => {
          messageBox.style.display = "none";
        }, 4000);
      }
    }
  });
}

// Cookies handling
function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  const cookiePopup = document.getElementById("cookie-popup");
  if (cookiePopup) {
    cookiePopup.classList.remove("visible");
  }
}