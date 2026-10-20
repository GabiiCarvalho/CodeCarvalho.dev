/* ===== ANO ATUAL NO FOOTER ===== */
document.getElementById("currentYear").textContent = new Date().getFullYear();

/* ===== SMOOTH SCROLL PARA LINKS INTERNOS ===== */
document.querySelectorAll('.nav-links a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });

      // Fecha menu mobile se estiver aberto
      const navLinks = document.querySelector(".nav-links");
      const toggle = document.querySelector(".menu-toggle");
      if (navLinks && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        if (toggle) {
          toggle.classList.remove("active");
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    }
  });
});

/* ===== SCROLL SPY ===== */
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const headerHeight = 80;

  sections.forEach((section) => {
    const top = section.offsetTop - headerHeight - 10;
    const bottom = top + section.offsetHeight;
    const scroll = window.scrollY;
    const id = section.getAttribute("id");

    if (scroll >= top && scroll < bottom) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

/* ===== TOAST ===== */
function showToast(message, duration = 2500) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  if (!toast) return;

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function closeToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("show");
}

/* ===== ANIMAÇÕES DE ENTRADA ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".service-card, .pricing-card, .grid-item, .qa-card, .about-content > *, .portfolio-item",
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

/* ===== MENU MOBILE ===== */
function createMobileMenu() {
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");
  if (!nav || !navLinks) return;

  const isMobile = window.innerWidth <= 768;
  let toggle = document.querySelector(".menu-toggle");

  if (isMobile && !toggle) {
    toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    nav.insertBefore(toggle, navLinks);

    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", open);
    });
  }

  if (!isMobile && toggle) {
    toggle.remove();
    navLinks.classList.remove("open");
  }
}

let resizeTimer;
window.addEventListener("load", createMobileMenu);
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(createMobileMenu, 150);
});
