/* =========================================================
   SPONSOR PAGE SCRIPT
   Only code specific to the Sponsor page lives here. The header
   is hand-copied HTML (see sponsor.html) — no fetch/sync script,
   so this page works the same whether it's opened directly as a
   file or served from a local server.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setupSponsorForm();
});

/* ---------------------------------------------------------
   SPONSOR INQUIRY FORM
   There's no backend yet, so for now this just checks the
   fields and shows a friendly confirmation message.

   TODO (team): once there's somewhere real to send this data
   (your own backend, or a service like Formspree / EmailJS),
   replace the comment marked below with the real submit code.
--------------------------------------------------------- */
function setupSponsorForm() {
  var form = document.getElementById("sponsor-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var company = document.getElementById("company").value.trim();
    var contactName = document.getElementById("contact-name").value.trim();
    var email = document.getElementById("email").value.trim();

    var emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!company || !contactName || !email) {
      showFeedback(
        "Please fill in company name, contact person and email.",
        "error"
      );
      return;
    }

    if (!emailLooksValid) {
      showFeedback("Please enter a valid email address.", "error");
      return;
    }

    // Everything checks out.
    // ---- TODO: send `company`, `contactName`, `email` etc. somewhere real ----

    showFeedback(
      "Thanks " +
        contactName +
        "! Your sponsorship inquiry has been noted. We'll be in touch soon.",
      "success"
    );
    form.reset();
  });
}

function showFeedback(message, type) {
  var feedback = document.getElementById("form-feedback");
  feedback.textContent = message;
  feedback.className = "form-feedback " + type;
}
