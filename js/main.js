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
    DOM.revealEls = document.querySelectorAll("[data-aos]");
  };

  DOM.html.classList.remove("no-js");
  DOM.html.classList.add("js");

  const cfg = {
    scrollDuration: 800,
    HERO_THRESHOLD: 100,
    BACK_TO_TOP_THRESHOLD: 800
  };

  // Performance optimized scroll handler
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isHeaderSticky = false;
  let isHeaderScrolling = false;
  let isBackToTopVisible = false;

  const updateHeaderState = () => {
    if (!DOM.hdr) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    const isScrollingDown = scrollDelta > 2;

    // At the very top
    if (currentScrollY <= 10) {
      if (isHeaderSticky || isHeaderScrolling) {
        DOM.hdr.classList.remove("sticky", "scrolling");
        isHeaderSticky = false;
        isHeaderScrolling = false;
      }
      lastScrollY = currentScrollY;
      return;
    }

    // Below hero threshold
    if (currentScrollY >= cfg.HERO_THRESHOLD) {
      if (!isHeaderSticky) {
        // Add both classes simultaneously to prevent jitter
        DOM.hdr.classList.add("sticky", "scrolling");
        isHeaderSticky = true;
        isHeaderScrolling = true;
      }
    } else if (isHeaderSticky || isHeaderScrolling) {
      DOM.hdr.classList.remove("sticky", "scrolling");
      isHeaderSticky = false;
      isHeaderScrolling = false;
    }

    lastScrollY = currentScrollY;
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

  // Optimized smooth scroll with better easing
  const smoothScroll = (targetPosition, duration = cfg.scrollDuration, callback) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    
    if (Math.abs(distance) < 5) {
      window.scrollTo(0, targetPosition);
      callback?.();
      return;
    }

    let start = null;
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp) => {
      start ??= timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easing = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * easing);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        callback?.();
      }
    };

    requestAnimationFrame(step);
  };

  /* Preloader with optimized fade effect
   * -------------------------------------------------- */
  const ssPreloader = () => {
    DOM.html.classList.add("ss-preload");

    const handleLoad = () => {
      smoothScroll(0, 400);

      const loader = document.getElementById("loader");
      const preloader = document.getElementById("preloader");

      DOM.html.classList.remove("ss-preload");
      DOM.html.classList.add("ss-loaded");

      if (loader && preloader) {
        // Use CSS transitions instead of manual animation
        loader.style.transition = "opacity 0.6s ease-out";
        loader.style.opacity = "0";
        
        setTimeout(() => {
          preloader.style.transition = "opacity 0.6s ease-out";
          preloader.style.opacity = "0";
          
          setTimeout(() => {
            preloader.remove();
          }, 600);
        }, 600);
      }
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }
  };

  /* Mobile menu with optimized event handling
   * ---------------------------------------------------- */
  const ssMobileMenu = () => {
    if (!DOM.toggleButton || !DOM.headerContent) return;

    // Create and cache overlay
    const overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    DOM.body.appendChild(overlay);

    const mediaQuery = matchMedia("(max-width: 900px)");
    const mediaQueryLarge = matchMedia("(min-width: 901px)");

    let isMenuOpen = false;

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      
      DOM.toggleButton.classList.toggle("is-clicked", isMenuOpen);
      DOM.toggleButton.setAttribute("aria-expanded", String(isMenuOpen));
      DOM.body.classList.toggle("menu-is-open", isMenuOpen);
      DOM.body.style.overflow = isMenuOpen ? "hidden" : "";
    };

    const closeMenu = () => {
      if (isMenuOpen) {
        toggleMenu();
      }
    };

    // Optimized resize handler
    const handleResize = debounce(() => {
      if (mediaQueryLarge.matches && isMenuOpen) {
        closeMenu();
      }
    }, 150);

    // Event listeners with passive option where appropriate
    DOM.toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu();
    });

    // Optimized click delegation
    DOM.headerContent.addEventListener("click", (e) => {
      if (mediaQuery.matches && (e.target.tagName === "A" || e.target.classList.contains("btn"))) {
        closeMenu();
      }
    });

    overlay.addEventListener("click", closeMenu);
    window.addEventListener("resize", handleResize, { passive: true });
  };

  /* Scroll reveal — native replacement for the AOS library.
   * Adds `.reveal-in` to [data-aos] elements as they enter the
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

  /* Optimized smooth scrolling with event delegation
   * ------------------------------------------------------ */
  const ssSmoothScroll = () => {
    document.addEventListener("click", (e) => {
      const target = e.target.closest(".smoothscroll");
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const targetElement = document.querySelector(href);
      if (!targetElement) return;

      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

      smoothScroll(targetPosition, cfg.scrollDuration, () => {
        // Use replaceState instead of hash to avoid triggering scroll events
        history.replaceState(null, null, href);
        updateHeaderState();
      });
    });
  };

  /* Back to top (handled in scroll event)
   * ------------------------------------------------------ */
  const ssBackToTop = () => {
    if (!DOM.goTopButton) return;

    // Initial state
    updateBackToTop();

    DOM.goTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      smoothScroll(0, cfg.scrollDuration, () => {
        history.replaceState(null, null, "#top");
      });
    });
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
          DOM.navLinks.forEach(link => link.classList.remove("current"));
          
          // Add active class to current section link
          const activeLink = linkMap.get(sectionId);
          if (activeLink) {
            activeLink.classList.add("current");
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

    // Get the full text content, preserving line breaks
    const fullText = heading.innerHTML;
    const lines = fullText
    .split(/<br\s*\/?>/i)
    .filter(line => line.replace(/\s+/g, ''));

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
        typeTimeout = setTimeout(typeNextChar, 40); // 40ms per character for smooth typing
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

          typeTimeout = setTimeout(typeNextChar, 150); // Pause between lines
        }
      }
    };

    // Stop any pending timer when the page goes away.
    window.addEventListener("pagehide", cancelTyping, { once: true });

    // Start typing after a short delay
    typeTimeout = setTimeout(() => {
      currentLine.style.transition = "opacity 0.3s ease-in-out";
      currentLine.style.opacity = "1";
      typeNextChar();
    }, 800);
  };

  /* Parallax scroll effect for profile image
   * ------------------------------------------------------ */
  const ssParallaxProfile = () => {
    const profilePic = document.querySelector(".profile-pic img");
    if (!profilePic) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    let isBound = false;

    const updateParallax = () => {
      const scrolled = window.scrollY;
      const profileSection = profilePic.closest(".s-about");

      if (!profileSection) return;

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

    const onParallaxScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Only run parallax on larger viewports; bind/unbind as the viewport
    // crosses the breakpoint so the listener never lingers on mobile.
    const desktop = window.matchMedia("(min-width: 901px)");

    const bind = () => {
      if (isBound) return;
      window.addEventListener("scroll", onParallaxScroll, { passive: true });
      isBound = true;
      updateParallax(); // Initial call
    };

    const unbind = () => {
      if (!isBound) return;
      window.removeEventListener("scroll", onParallaxScroll);
      isBound = false;
      profilePic.style.transform = ""; // Reset any applied offset
    };

    const syncParallax = () => (desktop.matches ? bind() : unbind());

    desktop.addEventListener("change", syncParallax);
    syncParallax();
  };

  /* Initialize with performance optimizations
   * ------------------------------------------------------ */
  const ssInit = () => {
    // Initialize DOM cache first
    initDOMCache();

    // Start preloader immediately
    ssPreloader();

    // Use a single RAF for initialization
    requestAnimationFrame(() => {
      ssMobileMenu();
      ssSmoothScroll();
      ssBackToTop();
      ssHighlightActiveLink();
      ssTypewriter();
      ssParallaxProfile();

      // Initialize scroll-reveal after other components
      requestAnimationFrame(ssReveal);
    });

    // Add optimized scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initialize header state
    updateHeaderState();
    updateScrollProgress();
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ssInit, { once: true });
  } else {
    ssInit();
  }

})();