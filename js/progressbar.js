document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-bar > div");

    progressBars.forEach(bar => {
      const span = bar.querySelector("span");
      const percentage = span.textContent;
      bar.style.width = percentage;
    });
  });