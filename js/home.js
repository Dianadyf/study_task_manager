/* ============================================================
   My Study Task Manager - home.js
   Simple image carousel for the home page.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const slides = [
    { src: "images/study1.svg", caption: "Focused study session at the desk" },
    { src: "images/study2.svg", caption: "Plan tasks and track deadlines" },
    { src: "images/study3.svg", caption: "Learn, grow and stay organized" }
  ];

  let index = 0;
  const img = document.getElementById("carousel-image");
  const caption = document.getElementById("carousel-caption");
  const counter = document.getElementById("carousel-counter");
  const nextBtn = document.getElementById("carousel-next");
  const prevBtn = document.getElementById("carousel-prev");

  if (!img) return;

  function show(i) {
    index = (i + slides.length) % slides.length; // wrap around
    img.src = slides[index].src;
    img.alt = slides[index].caption;
    caption.textContent = slides[index].caption;
    counter.textContent = (index + 1) + " / " + slides.length;
  }

  nextBtn.addEventListener("click", function () { show(index + 1); });
  prevBtn.addEventListener("click", function () { show(index - 1); });

  show(0);
});
