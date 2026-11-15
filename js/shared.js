/* ============================================================
   My Study Task Manager - shared.js
   Updates the live date & time shown at the bottom of every page.
   ============================================================ */

function updateDateTime() {
  const el = document.getElementById("current-datetime");
  if (!el) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const timeStr = now.toLocaleTimeString("en-AU", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  el.textContent = "Current Date & Time: " + dateStr + " - " + timeStr;
}

document.addEventListener("DOMContentLoaded", function () {
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Highlight the current page in the navigation bar
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (link) {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
    }
  });
});
