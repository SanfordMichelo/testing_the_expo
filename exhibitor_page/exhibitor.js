/* =========================================================
   EXHIBITOR PAGE SCRIPT
   Only code specific to the Exhibitor page lives here. The
   header is hand-copied HTML (see exhibitor.html) — no
   fetch/sync script, so this works the same whether the file
   is opened directly or served from a local server.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setupExhibitorForm();
});

/* ---------------------------------------------------------
   EXHIBITOR APPLICATION FORM
   There's no backend yet, so for now this just checks the
   fields and shows a friendly confirmation message.

   TODO (team): once there's somewhere real to send this data
   (your own backend, or a service like Formspree / EmailJS),
   replace the comment marked below with the real submit code.
--------------------------------------------------------- */
function setupExhibitorForm() {
  var form = document.getElementById("exhibitor-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var company = document.getElementById("exh-company").value.trim();
    var contact = document.getElementById("exh-contact").value.trim();
    var email = document.getElementById("exh-email").value.trim();
    var phone = document.getElementById("exh-phone").value.trim();

    var emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!company || !contact || !email || !phone) {
      showExhFeedback(
        "Please fill in company name, contact person, email and phone.",
        "error"
      );
      return;
    }

    if (!emailLooksValid) {
      showExhFeedback("Please enter a valid email address.", "error");
      return;
    }

    // Everything checks out.
    // ---- TODO: send company, contact, email, phone, category, booth
    //            preference, staff count, power needs and notes somewhere real ----

    showExhFeedback(
      "Thanks " +
        contact +
        "! " +
        company +
        "'s application has been received. We'll follow up with a floor plan and pricing.",
      "success"
    );
    form.reset();
  });
}

function showExhFeedback(message, type) {
  var feedback = document.getElementById("exh-form-feedback");
  feedback.textContent = message;
  feedback.className = "form-feedback " + type;
}
