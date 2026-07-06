/* =========================================================
   COMPETITION PAGE SCRIPT
   Only code specific to the Competition page lives here.
   The header is hand-copied HTML (see competition.html) —
   no fetch/sync script, so this works the same whether the
   file is opened directly or served from a local server.
========================================================= */



// One row per competition category. "taken" / "total" drive the
// per-category slot count shown on the page.
// TODO (team): replace with the real 8-category list and slot
// counts shared on WhatsApp — the 4 rows marked "TBC" below are
// placeholders standing in until that list is confirmed.
var CATEGORIES = [
  { name: "Bridal Makeup", taken: 0, total: 5 },
  { name: "Editorial Makeup", taken: 0, total: 5 },
  { name: "Nail Tech", taken: 0, total: 5 },
  { name: "Barbering", taken: 0, total: 5 },
  { name: "Wig Installation", taken: 0, total: 5 },
  { name: "Eyebrows", taken: 0, total: 5 },
  { name: "Hair Braiding", taken: 0, total: 5 },
];

document.addEventListener("DOMContentLoaded", function () {
  renderDeadline();
  renderCategorySlots();
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
   CATEGORY SLOT LIST
   Vertical list, one row per category, each showing its own
   remaining-slot count and a small progress bar.
--------------------------------------------------------- */
function renderCategorySlots() {
  var list = document.getElementById("cat-list");
  if (!list) return;

  list.innerHTML = "";

  CATEGORIES.forEach(function (cat) {
    var taken = Math.max(0, Math.min(cat.taken, cat.total));
    var remaining = cat.total - taken;
    var percent = Math.round((taken / cat.total) * 100);

    var statusClass = "is-open";
    var statusText = remaining + " slot" + (remaining === 1 ? "" : "s") + " remaining";
    if (remaining <= 0) {
      statusClass = "is-closed";
      statusText = "Full — waiting list only";
    } else if (percent >= 90) {
      statusClass = "is-almost";
    } else if (percent >= 60) {
      statusClass = "is-filling";
    }

    var li = document.createElement("li");
    li.className = "cat-row-item";
    li.innerHTML =
      '<div class="cat-row-top">' +
        '<span class="cat-row-name">' + escapeHtml(cat.name) + '</span>' +
        '<span class="cat-row-status ' + statusClass + '">' + escapeHtml(statusText) + '</span>' +
      '</div>' +
      '<div class="cat-row-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '" aria-label="' + escapeHtml(cat.name) + ' slots filled">' +
        '<div class="cat-row-fill ' + statusClass + '" style="width:' + percent + '%"></div>' +
      '</div>';
    list.appendChild(li);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}