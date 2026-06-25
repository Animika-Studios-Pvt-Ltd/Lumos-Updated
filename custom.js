/* ------------------------ Navbar & Navigation Section ------------------------ */
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

    // Check if it's an article inside page
    if (document.querySelector(".artcles-inside-page")) {
      const resourcesToggle = Array.from(
        document.querySelectorAll(".navbar-nav .dropdown-toggle"),
      ).find((link) => link.textContent.trim().toLowerCase() === "resources");
      if (resourcesToggle) resourcesToggle.classList.add("active");
    }
    // Check if it's an industry page
    else if (page.includes("-industry") || page === "industries.html") {
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
      page.includes("website-")
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

/* ------------------------ Banner/Hero Section------------------------ */
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
        { passive: false },
      );

      // Keep currentSlide in sync when snap CSS or other means change scroll position
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

  // Publications Section Slick Carousel initialization and custom pagination
  function initSlickCarousel(
    sliderSelector,
    paginationId,
    prevBtnSelector,
    nextBtnSelector,
  ) {
    const $slider = $(sliderSelector);
    const $pagination = $(paginationId);
    if ($slider.length === 0) return;

    // Bind event first to catch init
    $slider.on(
      "init reInit afterChange",
      function (event, slick, currentSlide) {
        const current =
          (currentSlide !== undefined
            ? currentSlide
            : slick
              ? slick.currentSlide
              : 0) + 1;
        const total = slick ? slick.slideCount : 0;
        if ($pagination.length > 0 && total > 0) {
          $pagination.text(
            `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
          );
        }
      },
    );

    // Initialize slick
    $slider.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: prevBtnSelector,
      nextArrow: nextBtnSelector,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  initSlickCarousel(
    "#publicationCarouselInner",
    "#publication-pagination-status",
    "#publicationCarouselInner-wrapper .carousel-control-prev",
    "#publicationCarouselInner-wrapper .carousel-control-next",
  );
  initSlickCarousel(
    "#publicationCarouselInner1",
    "#publication-pagination-status1",
    "#publicationCarouselInner1-wrapper .carousel-control-prev",
    "#publicationCarouselInner1-wrapper .carousel-control-next",
  );

  // Branding Page Carousel initialization
  const $brandingSlider = $("#brandingCarouselInner");
  const $brandingPagination = $("#pagination-status");
  if ($brandingSlider.length > 0) {
    $brandingSlider.on(
      "init reInit afterChange",
      function (event, slick, currentSlide) {
        const current =
          (currentSlide !== undefined
            ? currentSlide
            : slick
              ? slick.currentSlide
              : 0) + 1;
        const total = slick ? slick.slideCount : 0;
        if ($brandingPagination.length > 0 && total > 0) {
          $brandingPagination.text(
            `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
          );
        }
      },
    );

    $brandingSlider.slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: "#carouselCaptionsInner .carousel-control-prev",
      nextArrow: "#carouselCaptionsInner .carousel-control-next",
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Technology Page Carousel initialization
  const $techSlider = $("#techCarouselInner");
  const $techPagination = $("#tech-pagination-status");
  if ($techSlider.length > 0) {
    $techSlider.on(
      "init reInit afterChange",
      function (event, slick, currentSlide) {
        const current =
          (currentSlide !== undefined
            ? currentSlide
            : slick
              ? slick.currentSlide
              : 0) + 1;
        const total = slick ? slick.slideCount : 0;
        if ($techPagination.length > 0 && total > 0) {
          $techPagination.text(
            `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
          );
        }
      },
    );

    $techSlider.slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: "#techCarouselCaptionsInner .carousel-control-prev",
      nextArrow: "#techCarouselCaptionsInner .carousel-control-next",
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Marketing Page Carousel initialization
  const $marketingSlider = $("#marketingCarouselInner");
  const $marketingPagination = $("#marketing-pagination-status");
  if ($marketingSlider.length > 0) {
    $marketingSlider.on(
      "init reInit afterChange",
      function (event, slick, currentSlide) {
        const current =
          (currentSlide !== undefined
            ? currentSlide
            : slick
              ? slick.currentSlide
              : 0) + 1;
        const total = slick ? slick.slideCount : 0;
        if ($marketingPagination.length > 0 && total > 0) {
          $marketingPagination.text(
            `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
          );
        }
      },
    );

    $marketingSlider.slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: "#marketingCarouselCaptionsInner .carousel-control-prev",
      nextArrow: "#marketingCarouselCaptionsInner .carousel-control-next",
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Content & SEO Strategy Page Carousel initialization
  const $seoSlider = $("#seoCarouselInner");
  const $seoPagination = $("#seo-pagination-status");
  if ($seoSlider.length > 0) {
    $seoSlider.on(
      "init reInit afterChange",
      function (event, slick, currentSlide) {
        const current =
          (currentSlide !== undefined
            ? currentSlide
            : slick
              ? slick.currentSlide
              : 0) + 1;
        const total = slick ? slick.slideCount : 0;
        if ($seoPagination.length > 0 && total > 0) {
          $seoPagination.text(
            `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
          );
        }
      },
    );

    $seoSlider.slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: "#seoCarouselCaptionsInner .carousel-control-prev",
      nextArrow: "#seoCarouselCaptionsInner .carousel-control-next",
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Content Page Carousel initialization
  const $contentSlider = $("#contentCarouselInner");
  const $contentPagination = $("#content-pagination-status");
  if ($contentSlider.length > 0) {
    $contentSlider.on(
      "init reInit afterChange",
      function (event, slick, currentSlide) {
        const current =
          (currentSlide !== undefined
            ? currentSlide
            : slick
              ? slick.currentSlide
              : 0) + 1;
        const total = slick ? slick.slideCount : 0;
        if ($contentPagination.length > 0 && total > 0) {
          $contentPagination.text(
            `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
          );
        }
      },
    );

    $contentSlider.slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: "#contentCarouselCaptionsInner .carousel-control-prev",
      nextArrow: "#contentCarouselCaptionsInner .carousel-control-next",
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  /* ------------------------ Clients Accordion Section ------------------------ */
  const headers = document.querySelectorAll(".clients-accordion-header");
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

  /* ------------------------ Back to Top ------------------------ */
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

/* ------------------------ Cookies Section ------------------------ */
window.onload = function () {
  if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookie-popup").classList.add("visible");
  }
};

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-popup").classList.remove("visible");
}

/* ------------------------ Side Button Section ------------------------ */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const scrollBtn = document.getElementById("backToTop");
    const triggerSection = document.getElementById("triggerSection");

    if (!scrollBtn || !triggerSection) return;

    scrollBtn.style.display = "none";

    window.addEventListener("scroll", function () {
      const rect = triggerSection.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const isAtBottom = scrollY + clientHeight >= scrollHeight - 20;
      if (rect.top <= 0 || isAtBottom) {
        scrollBtn.style.display = "block";
      } else {
        scrollBtn.style.display = "none";
      }
    });
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
})();