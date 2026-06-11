(function () {
  "use strict";

  // Cache DOM elements at module level
  const DOM = {
    html: document.documentElement,
    body: document.body,
    hdr: null,
    toggleButton: null,
    headerContent: null,
    goTopButton: null,
    progressBar: null,
    sections: null,
    navLinks: null,
    revealEls: null
  };

  // Initialize DOM cache
  const initDOMCache = () => {
    DOM.hdr = document.querySelector(".s-header");
    DOM.toggleButton = document.querySelector(".header-menu-toggle");
    DOM.headerContent = document.querySelector(".header-content");
    DOM.goTopButton = document.querySelector(".page-anchor");
    DOM.progressBar = document.querySelector(".scroll-progress");
    DOM.sections = document.querySelectorAll(".target-section");
    DOM.navLinks = document.querySelectorAll(".header-nav a");
    DOM.revealEls = document.querySelectorAll("[data-reveal]");
  };

  DOM.html.classList.remove("no-js");
  DOM.html.classList.add("js");

  const cfg = {
    HERO_THRESHOLD: 100,
    BACK_TO_TOP_THRESHOLD: 800
  };

  // Single source for the desktop/mobile split, shared by the mobile
  // menu and the profile parallax (mirrors the CSS 900px breakpoint).
  const desktopMQ = matchMedia("(min-width: 901px)");

  // Performance optimized scroll handler
  let ticking = false;
  let isHeaderSticky = false;
  let isBackToTopVisible = false;
  // Slot for the profile parallax updater; set/cleared by
  // ssParallaxProfile as the viewport crosses the desktop breakpoint.
  let updateParallax = null;

  const updateHeaderState = () => {
    if (!DOM.hdr) return;

    const shouldStick = window.scrollY >= cfg.HERO_THRESHOLD;
    if (shouldStick !== isHeaderSticky) {
      DOM.hdr.classList.toggle("sticky", shouldStick);
      isHeaderSticky = shouldStick;
    }
  };

  // Update back to top button visibility
  const updateBackToTop = () => {
    if (!DOM.goTopButton) return;

    const shouldShow = window.scrollY >= cfg.BACK_TO_TOP_THRESHOLD;
    if (shouldShow !== isBackToTopVisible) {
      DOM.goTopButton.classList.toggle("link-is-visible", shouldShow);
      isBackToTopVisible = shouldShow;
    }
  };

  // Update the scroll progress indicator (0 -> 1 across the document)
  const updateScrollProgress = () => {
    if (!DOM.progressBar) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    DOM.progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
  };

  // Combined scroll handler for better performance
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeaderState();
        updateBackToTop();
        updateScrollProgress();
        if (updateParallax) updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Trailing-edge debounce.
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  /* Mobile menu with optimized event handling
   * ---------------------------------------------------- */
  const ssMobileMenu = () => {
    if (!DOM.toggleButton || !DOM.headerContent) return;

    // Create and cache overlay
    const overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    DOM.body.appendChild(overlay);

    let isMenuOpen = false;

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;

      DOM.toggleButton.classList.toggle("is-clicked", isMenuOpen);
      DOM.toggleButton.setAttribute("aria-expanded", String(isMenuOpen));
      // body.menu-is-open also locks scrolling via CSS (overflow: hidden)
      DOM.body.classList.toggle("menu-is-open", isMenuOpen);
    };

    const closeMenu = () => {
      if (isMenuOpen) {
        toggleMenu();
      }
    };

    // Keyboard support for the open menu: Escape closes it (returning
    // focus to the toggle) and Tab is trapped within the header so
    // keyboard users can't wander behind the overlay.
    const handleMenuKeydown = (e) => {
      if (!isMenuOpen || desktopMQ.matches) return;

      if (e.key === "Escape") {
        closeMenu();
        DOM.toggleButton.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = DOM.hdr.querySelectorAll(
        '.header-nav a, .theme-toggle, .header-menu-toggle'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleMenuKeydown);

    // Optimized resize handler
    const handleResize = debounce(() => {
      if (desktopMQ.matches && isMenuOpen) {
        closeMenu();
      }
    }, 150);

    DOM.toggleButton.addEventListener("click", toggleMenu);

    // Optimized click delegation
    DOM.headerContent.addEventListener("click", (e) => {
      if (!desktopMQ.matches && e.target.tagName === "A") {
        closeMenu();
      }
    });

    overlay.addEventListener("click", closeMenu);
    window.addEventListener("resize", handleResize, { passive: true });
  };

  /* Scroll reveal — native replacement for the AOS library.
   * Adds `.reveal-in` to [data-reveal] elements as they enter the
   * viewport. Honours prefers-reduced-motion by revealing everything
   * immediately (the CSS only hides elements when motion is allowed).
   * ------------------------------------------------------ */
  const ssReveal = () => {
    if (!DOM.revealEls.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      DOM.revealEls.forEach((el) => el.classList.add("reveal-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    DOM.revealEls.forEach((el) => observer.observe(el));
  };

  /* Optimized active link highlighting with Intersection Observer
   * ------------------------------------------------------ */
  const ssHighlightActiveLink = () => {
    if (!DOM.sections.length || !DOM.navLinks.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px",
      threshold: 0
    };

    // Create a map for faster lookups
    const linkMap = new Map();
    DOM.navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        linkMap.set(href.substring(1), link);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Remove active class from all links (more efficient)
          DOM.navLinks.forEach(link => {
            link.classList.remove("current");
            link.removeAttribute("aria-current");
          });

          // Add active class to current section link
          const activeLink = linkMap.get(sectionId);
          if (activeLink) {
            activeLink.classList.add("current");
            activeLink.setAttribute("aria-current", "true");
          }
        }
      });
    }, observerOptions);

    DOM.sections.forEach(section => observer.observe(section));
  };

  /* Typewriter effect for hero heading
   * ------------------------------------------------------ */
  const ssTypewriter = () => {
    const heading = document.querySelector(".hero-content h1");
    if (!heading) return;

    // Show the heading immediately for users who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heading.style.opacity = "1";
      return;
    }

    // Get the full text content, preserving line breaks. Trim each line:
    // the markup's pretty-printed indentation would otherwise be typed
    // out as a dead pause before each line visibly starts.
    const fullText = heading.innerHTML;
    const lines = fullText
      .split(/<br\s*\/?>/i)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    // Expose the complete heading to assistive tech up front; the
    // animated spans below are purely visual.
    heading.setAttribute("aria-label", lines.join(" "));

    // Keep a trailing space on every line but the last: small viewports
    // hide the <br>s and let the heading reflow as one paragraph, so the
    // space is what separates the last word of one line from the first
    // word of the next.
    for (let i = 0; i < lines.length - 1; i++) {
      lines[i] += " ";
    }

    // Clear the heading
    heading.innerHTML = "";
    heading.style.opacity = "1";

    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = document.createElement("span");
    currentLine.style.opacity = "0";
    heading.appendChild(currentLine);

    // Track the pending timeout so it can be cancelled if the page is
    // hidden/unloaded mid-animation (prevents stray timers firing).
    let typeTimeout = null;
    const cancelTyping = () => {
      if (typeTimeout !== null) {
        clearTimeout(typeTimeout);
        typeTimeout = null;
      }
    };

    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        return;
      }

      const currentText = lines[lineIndex];

      if (charIndex < currentText.length) {
        currentLine.textContent += currentText[charIndex];
        charIndex++;
        typeTimeout = setTimeout(typeNextChar, 24); // quick enough that the name reads in ~2s
      } else {
        // Finished current line
        lineIndex++;
        charIndex = 0;

        if (lineIndex < lines.length) {
          // Add line break and start new line
          heading.appendChild(document.createElement("br"));
          currentLine = document.createElement("span");
          currentLine.style.opacity = "0";
          heading.appendChild(currentLine);

          // Fade in the new line
          requestAnimationFrame(() => {
            currentLine.style.transition = "opacity 0.3s ease-in-out";
            currentLine.style.opacity = "1";
          });

          typeTimeout = setTimeout(typeNextChar, 100); // Pause between lines
        }
      }
    };

    // Stop any pending timer when the page goes away.
    window.addEventListener("pagehide", cancelTyping, { once: true });

    // Start typing after a short delay (just enough for the hero fade-in)
    typeTimeout = setTimeout(() => {
      currentLine.style.transition = "opacity 0.3s ease-in-out";
      currentLine.style.opacity = "1";
      typeNextChar();
    }, 250);
  };

  /* Parallax scroll effect for profile image
   * Runs inside the shared onScroll handler via the module-level
   * `updateParallax` slot, set on desktop viewports and cleared
   * (with the transform reset) below the breakpoint.
   * ------------------------------------------------------ */
  const ssParallaxProfile = () => {
    const profilePic = document.querySelector(".profile-pic img");
    if (!profilePic) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const profileSection = profilePic.closest(".s-about");
    if (!profileSection) return;

    const applyParallax = () => {
      const scrolled = window.scrollY;
      const sectionTop = profileSection.offsetTop;
      const sectionHeight = profileSection.offsetHeight;
      const windowHeight = window.innerHeight;

      // Check if section is in view
      if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
        const relativeScroll = (scrolled + windowHeight - sectionTop) / (sectionHeight + windowHeight);
        const parallaxOffset = relativeScroll * 30; // Max 30px movement
        profilePic.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    const syncParallax = () => {
      if (desktopMQ.matches) {
        updateParallax = applyParallax;
        applyParallax(); // Initial call
      } else {
        updateParallax = null;
        profilePic.style.transform = ""; // Reset any applied offset
      }
    };

    desktopMQ.addEventListener("change", syncParallax);
    syncParallax();
  };

  /* Copy-to-clipboard for the footer email
   * The button ships hidden in the markup and is only revealed when
   * the Clipboard API is actually available (it isn't on insecure
   * origins), so nobody sees a button that can't work.
   * ------------------------------------------------------ */
  const ssCopyEmail = () => {
    const button = document.querySelector(".copy-email");
    if (!button) return;

    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    button.hidden = false;

    const status = button.parentElement.querySelector(
      ".u-screen-reader-text"
    );
    let resetTimeout = null;

    button.addEventListener("click", () => {
      navigator.clipboard
        .writeText(button.dataset.copy)
        .then(() => {
          button.classList.add("is-copied");
          if (status) status.textContent = "Email address copied";

          clearTimeout(resetTimeout);
          resetTimeout = setTimeout(() => {
            button.classList.remove("is-copied");
            if (status) status.textContent = "";
          }, 2000);
        })
        .catch(() => {
          if (status) status.textContent = "Copy failed";
        });
    });
  };

  /* Theme toggle (sun/moon in the header)
   * Overrides the system colour scheme via [data-theme] on <html> and
   * persists the choice. CSS decides which icon shows, so this only
   * has to flip the attribute and keep the label honest.
   * ------------------------------------------------------ */
  const ssThemeToggle = () => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    const effectiveTheme = () => {
      const override = DOM.html.getAttribute("data-theme");
      if (override === "light" || override === "dark") return override;
      return systemDark.matches ? "dark" : "light";
    };

    const updateLabel = () => {
      button.setAttribute(
        "aria-label",
        effectiveTheme() === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      );
    };

    button.addEventListener("click", () => {
      const next = effectiveTheme() === "dark" ? "light" : "dark";
      DOM.html.setAttribute("data-theme", next);

      // Spin in the incoming icon (CSS gates this on reduced motion).
      // Remove + reflow restarts the animation on rapid clicks.
      button.classList.remove("is-switching");
      void button.offsetWidth;
      button.classList.add("is-switching");

      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        // Storage unavailable (private mode etc.) — theme still applies
        // for this page view.
      }
      updateLabel();
    });

    // Drop the animation class once the spin finishes (the event
    // bubbles up from the SVG icon).
    button.addEventListener("animationend", () => {
      button.classList.remove("is-switching");
    });

    // Keep the label accurate if the OS scheme changes mid-session.
    systemDark.addEventListener("change", updateLabel);
    updateLabel();
  };

  /* Initialize with performance optimizations
   * ------------------------------------------------------ */
  const ssInit = () => {
    // Initialize DOM cache first
    initDOMCache();

    // Trigger the hero entrance animations (CSS keys off .ss-loaded)
    DOM.html.classList.add("ss-loaded");

    // Use a single RAF for initialization
    requestAnimationFrame(() => {
      ssMobileMenu();
      ssHighlightActiveLink();
      ssTypewriter();
      ssParallaxProfile();
      ssCopyEmail();
      ssThemeToggle();

      // Initialize scroll-reveal after other components
      requestAnimationFrame(ssReveal);
    });

    // Add optimized scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initialize header state
    updateHeaderState();
    updateBackToTop();
    updateScrollProgress();
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ssInit, { once: true });
  } else {
    ssInit();
  }

})();