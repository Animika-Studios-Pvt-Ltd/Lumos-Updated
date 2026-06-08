/* Navbar & Navigation Section */

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";

  // Helper to remove active class from all navigation links
  const clearActiveLinks = () => {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((nav) => {
      nav.classList.remove("active");
    });
  };

  let matched = false;
  const navbarLinks = document.querySelectorAll(
    ".navbar-nav a:not(.dropdown-toggle)",
  );

  // 1. Direct matching: check dropdown items and direct links
  navbarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      // Extract clean filename from link href (ignoring hash anchors)
      const linkPage = href.split("#")[0].split("/").pop();
      if (linkPage && page === linkPage) {
        clearActiveLinks();
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector(
            ".nav-link.dropdown-toggle",
          );
          if (toggle) {
            toggle.classList.add("active");
            matched = true;
          }
        } else {
          link.classList.add("active");
          matched = true;
        }
      }
    }
  });

  // 2. Section-based fallback matching for subpages or case studies
  if (!matched && page !== "index.html") {
    clearActiveLinks();

    // Check if it's an industry page
    if (page.includes("-industry") || page === "industries.html") {
      const indLink = Array.from(
        document.querySelectorAll(".navbar-nav .nav-link"),
      ).find((link) => {
        const href = link.getAttribute("href");
        return href && href.includes("industries.html");
      });
      if (indLink) indLink.classList.add("active");
    }
    // Check if it's under the "Services" section (branding, technology, marketing, content, seo, etc.)
    else if (
      page.includes("services") ||
      page.includes("brand-") ||
      page.includes("branding-") ||
      page.includes("technology-") ||
      page.includes("marketing-") ||
      page.includes("website-") ||
      page.includes("casestudy")
    ) {
      const servicesToggle = Array.from(
        document.querySelectorAll(".navbar-nav .dropdown-toggle"),
      ).find((link) => link.textContent.trim().toLowerCase() === "services");
      if (servicesToggle) servicesToggle.classList.add("active");
    }
    // Check if it's under "Consultative Services"
    else if (
      page.includes("thought-") ||
      page.includes("social-impact") ||
      page.includes("advisory-")
    ) {
      const consultativeToggle = Array.from(
        document.querySelectorAll(".navbar-nav .dropdown-toggle"),
      ).find(
        (link) =>
          link.textContent.trim().toLowerCase() === "consultative services",
      );
      if (consultativeToggle) consultativeToggle.classList.add("active");
    }
    // Check if it's under "Resources"
    else if (
      page.includes("article") ||
      page.includes("event") ||
      page.includes("video") ||
      page.includes("publication") ||
      page.includes("client")
    ) {
      const resourcesToggle = Array.from(
        document.querySelectorAll(".navbar-nav .dropdown-toggle"),
      ).find((link) => link.textContent.trim().toLowerCase() === "resources");
      if (resourcesToggle) resourcesToggle.classList.add("active");
    }
  }

  // 3. Auto-close mobile hamburger menu when clicking outside or scrolling
  const navCollapse = document.getElementById("navbarSupportedContent");
  if (navCollapse) {
    const toggler = document.querySelector(".navbar-toggler");
    // Ensure toggler has collapsed class initially on load if closed
    if (toggler && toggler.getAttribute("aria-expanded") !== "true") {
      toggler.classList.add("collapsed");
    }

    const closeMenu = () => {
      if (navCollapse.classList.contains("show")) {
        const t = document.querySelector(".navbar-toggler");
        if (t && !t.classList.contains("collapsed")) {
          t.click();
        }
      }
    };

    // Close on click outside
    document.addEventListener("click", (event) => {
      const togglerBtn = document.querySelector(".navbar-toggler");
      const isClickInside =
        navCollapse.contains(event.target) ||
        (togglerBtn && togglerBtn.contains(event.target));
      if (!isClickInside) {
        closeMenu();
      }
    });

    // Close on scroll
    window.addEventListener(
      "scroll",
      () => {
        closeMenu();
      },
      { passive: true },
    );
  }
});

/* Banner/Hero Section */

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
      let currentSlide = 0;
      let isScrolling = false;

      // Helper: scroll to a given slide index and update nav
      const goToSlide = (index) => {
        if (index < 0 || index >= slides.length) return;
        currentSlide = index;
        slide_container.scrollTo({
          top: slides[index].offsetTop,
          behavior: "smooth",
        });
        navigation_items.forEach((item, i) => {
          item.classList.toggle("active", i === index);
        });
      };

      // Navigation link clicks
      navigation_items.forEach((item, index) => {
        item.onclick = (e) => {
          e.preventDefault();
          goToSlide(index);
        };
      });

      // Wheel event: intercept while banner is visible and snap slide-by-slide
      slider.addEventListener(
        "wheel",
        (e) => {
          const rect = slider.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          if (!inView) return;

          e.preventDefault();

          if (isScrolling) return;
          isScrolling = true;
          setTimeout(() => {
            isScrolling = false;
          }, 750);

          if (e.deltaY > 0) {
            goToSlide(currentSlide + 1);
          } else {
            goToSlide(currentSlide - 1);
          }
        },
        { passive: false }
      );

      // Keep currentSlide in sync when snap CSS or other means change scroll position
      slide_container.addEventListener("scroll", () => {
        let closestIndex = 0;
        let minDistance = Infinity;
        const containerTop = slide_container.getBoundingClientRect().top;

        slides.forEach((slide, index) => {
          const distance = Math.abs(
            slide.getBoundingClientRect().top - containerTop
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentSlide) {
          currentSlide = closestIndex;
          navigation_items.forEach((item, i) => {
            item.classList.toggle("active", i === closestIndex);
          });
        }
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