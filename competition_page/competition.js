/* =========================================================
   COMPETITION PAGE SCRIPT
   Only code specific to the Competition page lives here.
   The header is hand-copied HTML (see competition.html) —
   no fetch/sync script, so this works the same whether the
   file is opened directly or served from a local server.
========================================================= */

// ---- Configuration the organising team can adjust ----
var ENTRY_DEADLINE = new Date("2026-07-01T23:59:59");
var TOTAL_SLOTS = 20;
var DEFAULT_TAKEN_SLOTS = 13; // starting point until there's a real backend
var SLOTS_STORAGE_KEY = "cosmoExpoCompetitionSlotsTaken";

document.addEventListener("DOMContentLoaded", function () {
  renderDeadline();
  renderSlots();
  setupCompetitionForm();
  setupGalleryModal();
});

/* ---------------------------------------------------------
   DEADLINE TEXT (under the hero buttons)
--------------------------------------------------------- */
function renderDeadline() {
  var el = document.getElementById("comp-deadline-text");
  if (!el) return;

  var now = new Date();
  var msLeft = ENTRY_DEADLINE - now;
  var formattedDate = ENTRY_DEADLINE.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (msLeft <= 0) {
    el.textContent = "Entries closed on " + formattedDate + ".";
    return;
  }

  var daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  el.textContent =
    "Entries close in " +
    daysLeft +
    (daysLeft === 1 ? " day" : " days") +
    " — " +
    formattedDate;
}

/* ---------------------------------------------------------
   SLOT TRACKER
   No backend yet, so the "taken" count lives in the browser's
   localStorage and starts from DEFAULT_TAKEN_SLOTS. Every
   successful form submission below adds 1.

   TODO (team): once there's a real backend / spreadsheet
   counting actual entries, replace getTakenSlots()/setTaken-
   Slots() with a real fetch() to that source of truth.
--------------------------------------------------------- */
function getTakenSlots() {
  try {
    var stored = localStorage.getItem(SLOTS_STORAGE_KEY);
    if (stored !== null) {
      var parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (err) {
    // localStorage unavailable (private browsing, etc.) — fall back below
  }
  return DEFAULT_TAKEN_SLOTS;
}

function setTakenSlots(value) {
  try {
    localStorage.setItem(SLOTS_STORAGE_KEY, String(value));
  } catch (err) {
    // Ignore — worst case the count resets on next visit.
  }
}

function renderSlots() {
  var taken = getTakenSlots();
  if (taken > TOTAL_SLOTS) taken = TOTAL_SLOTS;
  if (taken < 0) taken = 0;

  var percent = Math.round((taken / TOTAL_SLOTS) * 100);
  var remaining = TOTAL_SLOTS - taken;

  document.getElementById("slots-taken").textContent = taken;
  document.getElementById("slots-total").textContent = TOTAL_SLOTS;

  var fill = document.getElementById("slot-fill");
  fill.style.width = percent + "%";

  var track = document.getElementById("slot-track");
  track.setAttribute("aria-valuenow", String(percent));

  var status = document.getElementById("slot-status");
  status.classList.remove("is-open", "is-filling", "is-almost", "is-closed");

  var submitBtn = document.getElementById("comp-submit-btn");

  if (remaining <= 0) {
    status.textContent =
      "All slots are full — entries are closed. Email us to join the waiting list.";
    status.classList.add("is-closed");
    if (submitBtn) submitBtn.disabled = true;
  } else if (percent >= 90) {
    status.textContent =
      "Almost full — only " + remaining + " slot" + (remaining === 1 ? "" : "s") + " left.";
    status.classList.add("is-almost");
    if (submitBtn) submitBtn.disabled = false;
  } else if (percent >= 60) {
    status.textContent = "Filling fast — " + remaining + " slots remaining.";
    status.classList.add("is-filling");
    if (submitBtn) submitBtn.disabled = false;
  } else {
    status.textContent = "Open — " + remaining + " slots remaining.";
    status.classList.add("is-open");
    if (submitBtn) submitBtn.disabled = false;
  }

  return taken;
}

/* ---------------------------------------------------------
   ENTRY FORM
--------------------------------------------------------- */
function setupCompetitionForm() {
  var form = document.getElementById("competition-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var schoolName = document.getElementById("school-name").value.trim();
    var tevetaNumber = document.getElementById("teveta-number").value.trim();
    var contactPerson = document.getElementById("contact-person").value.trim();
    var email = document.getElementById("comp-email").value.trim();
    var phone = document.getElementById("comp-phone").value.trim();

    var categories = Array.prototype.slice
      .call(form.querySelectorAll('input[type="checkbox"]:checked'))
      .map(function (box) {
        return box.value;
      });

    var emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (getTakenSlots() >= TOTAL_SLOTS) {
      showCompFeedback(
        "Sorry — all entry slots are full. Please email us to join the waiting list.",
        "error"
      );
      return;
    }

    if (!schoolName || !tevetaNumber || !contactPerson || !email || !phone) {
      showCompFeedback(
        "Please fill in school name, TEVETA number, contact person, email and phone.",
        "error"
      );
      return;
    }

    if (!emailLooksValid) {
      showCompFeedback("Please enter a valid email address.", "error");
      return;
    }

    if (categories.length === 0) {
      showCompFeedback("Please select at least one category to enter.", "error");
      return;
    }

    // Everything checks out.
    // ---- TODO: send schoolName, tevetaNumber, contactPerson, email,
    //            phone, categories, contestant count and notes somewhere real ----

    var updatedTaken = getTakenSlots() + 1;
    setTakenSlots(updatedTaken);
    renderSlots();

    showCompFeedback(
      "Thanks " +
        contactPerson +
        "! " +
        schoolName +
        "'s entry has been received. Confirmation and the rules pack will be emailed to you shortly.",
      "success"
    );
    form.reset();
  });
}

function showCompFeedback(message, type) {
  var feedback = document.getElementById("comp-form-feedback");
  feedback.textContent = message;
  feedback.className = "form-feedback " + type;
}

/* ---------------------------------------------------------
   GALLERY LIGHTBOX
   One Bootstrap modal, re-filled with whichever tile was
   clicked using its data-img / data-caption attributes.
--------------------------------------------------------- */
function setupGalleryModal() {
  var modal = document.getElementById("galleryModal");
  if (!modal) return;

  modal.addEventListener("show.bs.modal", function (event) {
    var trigger = event.relatedTarget;
    if (!trigger) return;

    var img = trigger.getAttribute("data-img");
    var caption = trigger.getAttribute("data-caption") || "";

    document.getElementById("galleryModalImg").setAttribute("src", img);
    document.getElementById("galleryModalImg").setAttribute("alt", caption);
    document.getElementById("galleryModalCaption").textContent = caption;
  });
}
