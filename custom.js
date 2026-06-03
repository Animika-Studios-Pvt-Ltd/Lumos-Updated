// Navbar active toggle
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document
      .querySelectorAll(".navbar-nav .nav-link")
      .forEach((nav) => nav.classList.remove("active"));
    link.classList.add("active");
  });
});

(function () {
  "use strict";

  const vertical_slider = {
    slider_class: ".slider",

    show_slide(slide_id, context_item) {
      const slide_container = context_item
        .closest(this.slider_class)
        .querySelector(".slides");
      if (!slide_container) return;

      const slides = slide_container.querySelectorAll(".slide");
      if (slides[slide_id]) {
        slide_container.scrollTo({
          top: slides[slide_id].offsetTop,
          behavior: "smooth",
        });

        const active_item = context_item
          .closest(".slide_navigation")
          .querySelector(".active");
        if (active_item) active_item.classList.remove("active");

        context_item.classList.add("active");
      }
    },

    init_slider(slider) {
      const navigation_items = slider.querySelectorAll(".slide_navigation a");
      const slide_container = slider.querySelector(".slides");
      const slides = slide_container.querySelectorAll(".slide");

      navigation_items.forEach((item, index) => {
        item.onclick = (e) => {
          e.preventDefault();
          this.show_slide(index, item);
        };
      });

      slide_container.addEventListener("scroll", () => {
        let closestIndex = 0;
        let minDistance = Infinity;
        const containerTop = slide_container.getBoundingClientRect().top;

        slides.forEach((slide, index) => {
          const distance = Math.abs(
            slide.getBoundingClientRect().top - containerTop,
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        navigation_items.forEach((item, i) => {
          item.classList.toggle("active", i === closestIndex);
        });
      });
    },

    init() {
      document
        .querySelectorAll(this.slider_class)
        .forEach((slider) => this.init_slider(slider));
    },
  };

  vertical_slider.init();
})();

// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Down Arrow scroll
  const downArrow = document.querySelector(".down");
  if (downArrow) {
    downArrow.addEventListener("click", () => {
      const nextSection = document.querySelector("#next-layer");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Carousel Pagination (reusable function)
  function initCarouselPagination(carouselId, paginationId) {
    const carousel = document.getElementById(carouselId);
    const pagination = document.getElementById(paginationId);
    if (!carousel || !pagination) return;

    const items = carousel.querySelectorAll(".carousel-item");
    const total = items.length;

    const updatePagination = () => {
      const activeIndex =
        Array.from(items).findIndex((item) =>
          item.classList.contains("active"),
        ) + 1;

      pagination.textContent = `${String(activeIndex).padStart(
        2,
        "0",
      )}/${String(total).padStart(2, "0")}`;
    };

    carousel.addEventListener("slid.bs.carousel", updatePagination);
    updatePagination(); // initial call
  }

  initCarouselPagination("carouselCaptionsInner", "pagination-status");
  initCarouselPagination("carouselCaptionsInner1", "pagination-status1");

  // Accordion
  const headers = document.querySelectorAll(".accordion-header");
  headers.forEach((header) => {
    header.addEventListener("click", () => {
      headers.forEach((h) => {
        if (h !== header) {
          h.classList.remove("active");
          if (h.nextElementSibling) {
            h.nextElementSibling.classList.remove("open");
          }
        }
      });

      header.classList.toggle("active");
      if (header.nextElementSibling) {
        header.nextElementSibling.classList.toggle("open");
      }
    });
  });

  // Back to Top
  const btn = document.getElementById("backToTop");
  if (btn) {
    const showAfter = 500;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > showAfter);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
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