document.querySelectorAll(".st").forEach((img) => {
  const wrapper = img.parentElement;
  wrapper.addEventListener("mouseenter", () => {
    img.style.transform = "scale(1.03)"; // slight zoom
  });
  wrapper.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
  });
});

function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  const triggerBottom = window.innerHeight * 0.85;

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("in-view");
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

/* Mouse Section Javascript */
document.addEventListener("scroll", () => {
  const slider = document.querySelector(".slider");
  const center = document.querySelector(".center");
  const rect = slider.getBoundingClientRect();
  const vh = window.innerHeight;

  // Show only when slider is *mostly visible* in viewport
  if (rect.top <= vh * 0.8 && rect.bottom >= vh * 0.2) {
    center.style.opacity = "1";
    center.style.pointerEvents = "auto";
  } else {
    center.style.opacity = "0";
    center.style.pointerEvents = "none";
  }
});