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
