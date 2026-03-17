  window.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".cert-slider");
    if (!slider) {
      return;
    }

    const track = slider.querySelector(".cert-track");
    const slides = Array.from(track.children);
    const prevBtn = slider.querySelector(".cert-btn.prev");
    const nextBtn = slider.querySelector(".cert-btn.next");
    const viewport = slider.querySelector(".cert-viewport");
    const dotsContainer = document.querySelector(".cert-dots");

    let currentIndex = 0;
    let startX = 0;
    let isTouch = false;
    let autoplayId = null;
    let resumeTimer = null;
    let isUserInteracting = false;
    const autoplayDelay = 3000;

    function updateSlider() {
      track.style.transform = `translateX(${-currentIndex * 100}%)`;
      if (!dotsContainer) {
        return;
      }
      const dots = dotsContainer.querySelectorAll(".cert-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateSlider();
    }

    function createDots() {
      if (!dotsContainer) {
        return;
      }
      dotsContainer.innerHTML = "";
      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "cert-dot";
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function pauseAndResumeAutoplay() {
      isUserInteracting = true;
      stopAutoplay();
      if (resumeTimer) {
        clearTimeout(resumeTimer);
      }
      resumeTimer = setTimeout(() => {
        isUserInteracting = false;
        startAutoplay();
      }, 2000);
    }

    function manualNav(nextIndex) {
      pauseAndResumeAutoplay();
      goToSlide(nextIndex);
    }

    prevBtn.addEventListener("click", () => manualNav(currentIndex - 1));
    nextBtn.addEventListener("click", () => manualNav(currentIndex + 1));

    track.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
      isTouch = true;
    });

    track.addEventListener("touchend", (event) => {
      if (!isTouch) {
        return;
      }
      const endX = event.changedTouches[0].clientX;
      const delta = endX - startX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) {
          manualNav(currentIndex + 1);
        } else {
          manualNav(currentIndex - 1);
        }
      }
      isTouch = false;
    });

    viewport.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        pauseAndResumeAutoplay();
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (delta > 12) {
          manualNav(currentIndex + 1);
        } else if (delta < -12) {
          manualNav(currentIndex - 1);
        }
      },
      { passive: false }
    );

    viewport.addEventListener("mouseenter", () => stopAutoplay());
    viewport.addEventListener("mouseleave", () => {
      if (!isUserInteracting) {
        startAutoplay();
      }
    });

    window.addEventListener("resize", () => updateSlider());

    createDots();
    updateSlider();
    startAutoplay();
  });
