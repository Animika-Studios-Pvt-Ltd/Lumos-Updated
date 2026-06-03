let turnstilePassed = false;

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

// Auto-execute Turnstile after load
window.onload = () => {
  setTimeout(() => {
    turnstile.execute("myForm");
  }, 500);
};

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submit-button");

function resetFormState() {
  form.reset();
  grecaptcha.reset();
  turnstile.reset("myForm");
  turnstilePassed = false;
  submitBtn.disabled = true;
  submitBtn.textContent = "Send Message";
  setTimeout(() => {
    turnstile.execute("myForm");
  }, 300);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert("❌ Please complete the Google reCAPTCHA.");
    return;
  }

  if (!turnstilePassed) {
    alert("❌ Cloudflare Turnstile verification pending.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
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
    resetFormState();
  } catch (err) {
    console.log("❌ Error submitting form. Please try again later.");
    resetFormState();
  } finally {
    // Only re-enable button if not reset during success
    if (!form.checkValidity()) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  }
});

// For Mobile Number Validation

const phoneInput = document.getElementById("phone");

// Restrict input to numbers only
phoneInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Manual check before submit
document.getElementById("contactForm").addEventListener("submit", function (e) {
  const phone = phoneInput.value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    phoneInput.setCustomValidity("Please enter only 10 digits (numbers only)");
    phoneInput.reportValidity(); // Show the error immediately
    e.preventDefault(); // Prevent form submission
  } else {
    phoneInput.setCustomValidity(""); // Clear custom error
  }
});

// For Pop Up Message

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop default form submission

  const messageBox = document.getElementById("form-message");

  // Simulate an API call delay
  setTimeout(() => {
    const isSuccess = true; // Change to false to simulate failure

    if (isSuccess) {
      messageBox.style.display = "block";
      messageBox.innerText = "✅ Your message has been sent successfully!";
      messageBox.style.backgroundColor = "#d4edda";
      messageBox.style.color = "#155724";
      messageBox.style.border = "1px solid #c3e6cb";
    } else {
      messageBox.style.display = "block";
      messageBox.innerText =
        "❌ Failed to send your message. Please try again later.";
      messageBox.style.backgroundColor = "#f8d7da";
      messageBox.style.color = "#721c24";
      messageBox.style.border = "1px solid #f5c6cb";
    }

    // Auto-hide the message after 2 seconds
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 2000);

    // Optional: clear form
    document.getElementById("contactForm").reset();
  }, 500); // simulate delay
});

// Cookies
window.onload = function () {
  if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookie-popup").classList.add("visible");
  }
};

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-popup").classList.remove("visible");
}