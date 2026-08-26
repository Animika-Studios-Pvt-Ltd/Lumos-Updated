/* ---------------------------------- 1. NAVBAR & NAVIGATION SECTION ---------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // Dynamically inject Careers link in the extreme end of the header - above the primary menu
  const menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    const topBar = document.createElement("div");
    topBar.className = "top-careers-bar";
    topBar.innerHTML = `
      <a href="careers.html" class="top-careers-link">Careers</a>
    `;
    menuContainer.insertBefore(topBar, menuContainer.firstChild);
  }

  // Dynamically inject Careers link in primary menu navigation for mobile hamburger view
  const navList = document.querySelector(".navbar-nav");
  if (navList) {
    const mobileLi = document.createElement("li");
    mobileLi.className = "nav-item mobile-careers-item";
    mobileLi.innerHTML = `
      <a class="nav-link" href="careers.html">Careers</a>
    `;
    navList.appendChild(mobileLi);
  }

  // Get current pathname
  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";

  // Remove active class from all navigation links
  const clearActiveLinks = () => {
    document
      .querySelectorAll(".navbar-nav .nav-link, .top-careers-link")
      .forEach((nav) => {
        nav.classList.remove("active");
      });
  };

  // Toggle active class on Careers links
  const careersLinks = document.querySelectorAll(
    ".top-careers-link, .mobile-careers-item .nav-link",
  );
  const isCareersPage =
    page === "careers.html" ||
    page === "application-form.html" ||
    page === "sales-development-representative.html" ||
    page.startsWith("job-");

  if (isCareersPage) {
    careersLinks.forEach((link) => {
      link.classList.add("active");
    });
  }

  let matched = false;
  const navbarLinks = document.querySelectorAll(
    ".navbar-nav a:not(.dropdown-toggle)",
  );

  // Check dropdown items and direct navigation links
  navbarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }

    const linkPage = href.split("#")[0].split("/").pop();

    // Ignore Careers here because it has its own section-based active state
    if (
      link.classList.contains("mobile-careers-item") ||
      link.closest(".mobile-careers-item")
    ) {
      return;
    }

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
  });

  // Section-based fallback matching for subpages or case studies
  if (!matched && page !== "index.html") {
    if (isCareersPage) {
      careersLinks.forEach((link) => {
        link.classList.add("active");
      });
    } else {
      clearActiveLinks();

      // Check if it's an article inside page
      if (document.querySelector(".articles-section-inside-page")) {
        const resourcesToggle = Array.from(
          document.querySelectorAll(".navbar-nav .dropdown-toggle"),
        ).find((link) => link.textContent.trim().toLowerCase() === "resources");
        if (resourcesToggle) {
          resourcesToggle.classList.add("active");
        }
      }
      // Check if it's an industry page
      else if (page.includes("-industry") || page === "industries.html") {
        const indLink = Array.from(
          document.querySelectorAll(".navbar-nav .nav-link"),
        ).find((link) => {
          const href = link.getAttribute("href");
          return href && href.includes("industries.html");
        });
        if (indLink) {
          indLink.classList.add("active");
        }
      }
      // Check if it's under the Services section
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
        if (servicesToggle) {
          servicesToggle.classList.add("active");
        }
      }
      // Check if it's under Consultative Services
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
        if (consultativeToggle) {
          consultativeToggle.classList.add("active");
        }
      }
      // Check if it's under Resources
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
        if (resourcesToggle) {
          resourcesToggle.classList.add("active");
        }
      }
    }
  }

  // Mobile hamburger menu behavior
  const navCollapse = document.getElementById("navbarSupportedContent");
  if (navCollapse) {
    const toggler = document.querySelector(".navbar-toggler");
    if (toggler && toggler.getAttribute("aria-expanded") !== "true") {
      toggler.classList.add("collapsed");
    }

    const closeMenu = () => {
      if (navCollapse.classList.contains("show")) {
        const toggleButton = document.querySelector(".navbar-toggler");
        if (toggleButton && !toggleButton.classList.contains("collapsed")) {
          toggleButton.click();
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

  // Wrap industry images in an overflow-hidden wrapper for containment on zoom-in
  document
    .querySelectorAll(".industries-section-card > img.img-fluid")
    .forEach((img) => {
      if (
        img.parentElement &&
        img.parentElement.classList.contains("industries-img-wrapper")
      ) {
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "industries-img-wrapper";
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    });
});

/* ---------------------------------- 2. BANNER & HERO SLIDER SECTION ---------------------------------- */
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

          // Allow natural scroll to next/previous section when at slide boundaries
          if (e.deltaY > 0 && currentSlide === slides.length - 1) {
            return;
          }
          if (e.deltaY < 0 && currentSlide === 0) {
            return;
          }

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

/* ---------------------------------- 3. DOM LOADED INITIALIZATIONS (CAROUSELS & ACCORDIONS) ---------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  /* --- Helper Function: Init Custom Carousel --- */
  function initCustomCarousel(
    sliderSelector,
    paginationId,
    prevBtnSelector,
    nextBtnSelector,
    customOptions = {},
  ) {
    const track = document.querySelector(sliderSelector);
    if (!track) return;
    const wrapper = track.parentElement;
    const pagination = document.querySelector(paginationId);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);

    // Create a viewport element dynamically around the track to prevent clipping controls
    const viewport = document.createElement("div");
    viewport.style.overflow = "hidden";
    viewport.style.width = "100%";

    // Transfer margins from track to viewport (to handle negative margins correctly without clipping)
    const trackStyle = window.getComputedStyle(track);
    const marginLeft = trackStyle.marginLeft;
    const marginRight = trackStyle.marginRight;
    if (marginLeft && marginLeft !== "0px") {
      viewport.style.marginLeft = marginLeft;
      track.style.marginLeft = "0";
    }
    if (marginRight && marginRight !== "0px") {
      viewport.style.marginRight = marginRight;
      track.style.marginRight = "0";
    }

    // Insert viewport before track, then insert track inside the viewport
    track.parentNode.insertBefore(viewport, track);
    viewport.appendChild(track);

    track.style.display = "flex";
    track.style.width = "100%";
    track.style.willChange = "transform";

    const originalSlides = Array.from(track.children);
    const originalSlideCount = originalSlides.length;
    if (originalSlideCount === 0) return;

    const options = {
      slidesToShow: customOptions.slidesToShow || 1,
      slidesToScroll: customOptions.slidesToScroll || 1,
      autoplay: customOptions.autoplay !== false,
      autoplaySpeed: customOptions.autoplaySpeed || 3000,
      responsive: customOptions.responsive || [],
    };

    let slidesToShow = options.slidesToShow;
    let slidesToScroll = options.slidesToScroll;
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayTimer = null;

    function getResponsiveSettings() {
      const width = window.innerWidth;
      let activeShow = options.slidesToShow;
      let activeScroll = options.slidesToScroll;

      const sorted = [...options.responsive].sort(
        (a, b) => a.breakpoint - b.breakpoint,
      );
      for (const r of sorted) {
        if (width <= r.breakpoint) {
          activeShow = r.settings.slidesToShow || activeShow;
          activeScroll = r.settings.slidesToScroll || activeScroll;
          break;
        }
      }
      return { activeShow, activeScroll };
    }

    function rebuildCarousel() {
      const settings = getResponsiveSettings();
      slidesToShow = settings.activeShow;
      slidesToScroll = settings.activeScroll;

      track.innerHTML = "";

      originalSlides.forEach((slide) => {
        slide.style.flex = `0 0 ${100 / slidesToShow}%`;
        slide.style.boxSizing = "border-box";
        slide.style.padding = "0 15px"; // Add gaps between carousel images
        track.appendChild(slide);
      });

      const prefixClones = [];
      for (
        let i = originalSlideCount - slidesToShow;
        i < originalSlideCount;
        i++
      ) {
        const slideIndex = i < 0 ? i + originalSlideCount : i;
        if (originalSlides[slideIndex]) {
          const clone = originalSlides[slideIndex].cloneNode(true);
          clone.classList.add("carousel-clone");
          clone.style.flex = `0 0 ${100 / slidesToShow}%`;
          clone.style.boxSizing = "border-box";
          clone.style.padding = "0 15px"; // Add gaps to clones
          prefixClones.push(clone);
        }
      }
      prefixClones.reverse().forEach((clone) => {
        track.insertBefore(clone, track.firstChild);
      });

      for (let i = 0; i < slidesToShow; i++) {
        if (originalSlides[i]) {
          const clone = originalSlides[i].cloneNode(true);
          clone.classList.add("carousel-clone");
          clone.style.flex = `0 0 ${100 / slidesToShow}%`;
          clone.style.boxSizing = "border-box";
          clone.style.padding = "0 15px"; // Add gaps to clones
          track.appendChild(clone);
        }
      }

      updatePosition(false);
      updatePagination();
    }

    function updatePosition(animate = true) {
      if (animate) {
        track.style.transition = "transform 0.4s ease-in-out";
      } else {
        track.style.transition = "none";
      }
      const targetIndex = currentIndex + slidesToShow;
      const percentage = -targetIndex * (100 / slidesToShow);
      track.style.transform = `translateX(${percentage}%)`;
    }

    function updatePagination() {
      if (pagination) {
        const current =
          (((currentIndex % originalSlideCount) + originalSlideCount) %
            originalSlideCount) +
          1;
        pagination.textContent = `${String(current).padStart(2, "0")} / ${String(originalSlideCount).padStart(2, "0")}`;
      }
    }

    function handleTransitionEnd() {
      isTransitioning = false;
      if (currentIndex < 0) {
        currentIndex = originalSlideCount + currentIndex;
        updatePosition(false);
      } else if (currentIndex >= originalSlideCount) {
        currentIndex = currentIndex - originalSlideCount;
        updatePosition(false);
      }
    }

    track.addEventListener("transitionend", handleTransitionEnd);

    function move(direction) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex += direction * slidesToScroll;
      updatePosition(true);
      updatePagination();
    }

    function startAutoplay() {
      if (options.autoplay) {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          move(1);
        }, options.autoplaySpeed);
      }
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        move(-1);
        startAutoplay();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        move(1);
        startAutoplay();
      };
    }

    wrapper.onmouseenter = stopAutoplay;
    wrapper.onmouseleave = startAutoplay;

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        rebuildCarousel();
      }, 100);
    });

    rebuildCarousel();
    startAutoplay();
  }

  /* --- 3a. Publications Carousel --- */
  initCustomCarousel(
    "#publicationCarouselInner",
    "#publication-pagination-status",
    "#publicationCarouselInner-wrapper .carousel-control-prev",
    "#publicationCarouselInner-wrapper .carousel-control-next",
    {
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
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
    },
  );
  initCustomCarousel(
    "#publicationCarouselInner1",
    "#publication-pagination-status1",
    "#publicationCarouselInner1-wrapper .carousel-control-prev",
    "#publicationCarouselInner1-wrapper .carousel-control-next",
    {
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
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
    },
  );

  /* --- 3b. Branding Page Carousel --- */
  initCustomCarousel(
    "#brandingCarouselInner",
    "#pagination-status",
    "#carouselCaptionsInner .carousel-control-prev",
    "#carouselCaptionsInner .carousel-control-next",
    {
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  );

  /* --- 3c. Technology Page Carousel --- */
  initCustomCarousel(
    "#techCarouselInner",
    "#tech-pagination-status",
    "#techCarouselCaptionsInner .carousel-control-prev",
    "#techCarouselCaptionsInner .carousel-control-next",
    {
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  );

  /* --- 3d. Marketing Page Carousel --- */
  initCustomCarousel(
    "#marketingCarouselInner",
    "#marketing-pagination-status",
    "#marketingCarouselCaptionsInner .carousel-control-prev",
    "#marketingCarouselCaptionsInner .carousel-control-next",
    {
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  );

  /* --- 3e. Content & SEO Strategy Page Carousel --- */
  initCustomCarousel(
    "#seoCarouselInner",
    "#seo-pagination-status",
    "#seoCarouselCaptionsInner .carousel-control-prev",
    "#seoCarouselCaptionsInner .carousel-control-next",
    {
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  );

  /* --- 3f. Content Page Carousel --- */
  initCustomCarousel(
    "#contentCarouselInner",
    "#content-pagination-status",
    "#contentCarouselCaptionsInner .carousel-control-prev",
    "#contentCarouselCaptionsInner .carousel-control-next",
    {
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  );

  /* --- 3g. Clients Accordion Section --- */
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

  /* --- 3h. Back to Top Button Handler --- */
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

  /* --- 3i. FAQ Accordion Section --- */
  const faqHeaders = document.querySelectorAll(
    ".faq-section .accordion-header",
  );
  faqHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      faqHeaders.forEach((h) => {
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
});

/* ---------------------------------- 4. COOKIE CONSENT POPUP ---------------------------------- */
window.onload = function () {
  if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookie-popup").classList.add("visible");
  }
};

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-popup").classList.remove("visible");
}

/* ---------------------------------- 5. BACK TO TOP BUTTON SCROLL TRIGGER ---------------------------------- */
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