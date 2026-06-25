/* =========================================================
   REGISTER PAGE SCRIPT
   Only code specific to the Register page lives here. The
   header is hand-copied HTML (see register.html) — no
   fetch/sync script, so this works the same whether the file
   is opened directly or served from a local server.
========================================================= */

var PASS_PRICES = {
  General: "K150",
  Student: "K70",
  VIP: "K400",
};

document.addEventListener("DOMContentLoaded", function () {
  setupTicketSelection();
  setupRegisterForm();
});

/* ---------------------------------------------------------
   TICKET SELECTION
   Keeps the "Selected pass" line in the form in sync with
   whichever ticket stub is chosen, and highlights the chosen
   stub (CSS already handles this via :has(), this just adds
   the same highlight as a fallback for older browsers).
--------------------------------------------------------- */
function setupTicketSelection() {
  var radios = document.querySelectorAll('input[name="pass-type"]');
  if (!radios.length) return;

  radios.forEach(function (radio) {
    radio.addEventListener("change", updateSelectedPass);
  });

  updateSelectedPass(); // set initial text on page load
}

function updateSelectedPass() {
  var checked = document.querySelector('input[name="pass-type"]:checked');
  var label = document.getElementById("reg-selected-pass");
  if (!checked || !label) return;

  var price = PASS_PRICES[checked.value] || "";
  label.textContent = checked.value + " — " + price;

  document.querySelectorAll(".ticket-stub").forEach(function (stub) {
    stub.classList.remove("selected");
  });
  var chosenStub = checked.closest(".ticket-stub");
  if (chosenStub) chosenStub.classList.add("selected");
}

/* ---------------------------------------------------------
   REGISTRATION FORM
   There's no backend yet, so for now this just checks the
   fields and shows a friendly confirmation message.

   TODO (team): once there's somewhere real to send this data
   (your own backend, or a service like Formspree / EmailJS),
   replace the comment marked below with the real submit code.
--------------------------------------------------------- */
function setupRegisterForm() {
  var form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fullName = document.getElementById("reg-fullname").value.trim();
    var email = document.getElementById("reg-email").value.trim();
    var phone = document.getElementById("reg-phone").value.trim();
    var agreed = document.getElementById("reg-terms").checked;
    var passType =
      (document.querySelector('input[name="pass-type"]:checked') || {})
        .value || "General";

    var emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!fullName || !email || !phone) {
      showRegFeedback(
        "Please fill in your full name, email and phone.",
        "error"
      );
      return;
    }

    if (!emailLooksValid) {
      showRegFeedback("Please enter a valid email address.", "error");
      return;
    }

    if (!agreed) {
      showRegFeedback("Please agree to the event terms to continue.", "error");
      return;
    }

    // Everything checks out.
    // ---- TODO: send fullName, email, phone, passType, ticket count,
    //            organization and "how did you hear" somewhere real ----

    showRegFeedback(
      "You're in, " +
        fullName +
        "! Your " +
        passType +
        " pass is confirmed — check your email for details.",
      "success"
    );
    form.reset();
    updateSelectedPass();
  });
}

function showRegFeedback(message, type) {
  var feedback = document.getElementById("reg-form-feedback");
  feedback.textContent = message;
  feedback.className = "form-feedback " + type;
}
