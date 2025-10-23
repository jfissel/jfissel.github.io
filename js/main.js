(function () {
  "use strict";

  // Cache DOM elements at module level
  const DOM = {
    html: document.documentElement,
    body: document.body,
    hdr: null,
    toggleButton: null,
    headerContent: null,
    servicesList: null,
    goTopButton: null,
    sections: null,
    navLinks: null
  };

  // Initialize DOM cache
  const initDOMCache = () => {
    DOM.hdr = document.querySelector(".s-header");
    DOM.toggleButton = document.querySelector(".header-menu-toggle");
    DOM.headerContent = document.querySelector(".header-content");
    DOM.servicesList = document.querySelector(".services-list");
    DOM.goTopButton = document.querySelector(".page-anchor");
    DOM.sections = document.querySelectorAll(".target-section");
    DOM.navLinks = document.querySelectorAll(".header-nav a");
  };

  DOM.html.classList.remove("no-js");
  DOM.html.classList.add("js");

  const cfg = {
    scrollDuration: 800,
    HERO_THRESHOLD: 100,
    BACK_TO_TOP_THRESHOLD: 800,
    ACCORDION_DURATION: 400,
    SCROLL_OFFSET: 90
  };

  // Add User Agent (cached)
  DOM.html.setAttribute("data-useragent", navigator.userAgent);

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

  // Combined scroll handler for better performance
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeaderState();
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Optimized debounce with immediate execution option
  const debounce = (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
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

  /* Optimized accordion with better animations
   * ------------------------------------------------------ */
  const ssAccordion = () => {
    if (!DOM.servicesList) return;

    const allPanels = DOM.servicesList.querySelectorAll(".services-list__item-body");
    
    // Hide all panels except first using CSS
    allPanels.forEach((panel, index) => {
      if (index > 0) {
        panel.style.display = "none";
      }
    });

    // Use single event listener with delegation
    DOM.servicesList.addEventListener("click", (e) => {
      const header = e.target.closest(".services-list__item-header");
      if (!header) return;

      e.preventDefault();

      const curItem = header.parentElement;
      const curPanel = curItem.querySelector(".services-list__item-body");
      const activeItem = DOM.servicesList.querySelector(".services-list__item.is-active");

      if (curItem === activeItem) {
        // Close current panel
        slideUp(curPanel, cfg.ACCORDION_DURATION);
        curItem.classList.remove("is-active");
      } else {
        // Close active panel and open new one
        if (activeItem) {
          const activePanel = activeItem.querySelector(".services-list__item-body");
          slideUp(activePanel, cfg.ACCORDION_DURATION);
          activeItem.classList.remove("is-active");
        }
        
        slideDown(curPanel, cfg.ACCORDION_DURATION, () => {
          const panelTop = curItem.getBoundingClientRect().top + window.scrollY;
          if (panelTop < window.scrollY) {
            smoothScroll(panelTop - cfg.SCROLL_OFFSET, cfg.ACCORDION_DURATION);
          }
        });
        curItem.classList.add("is-active");
      }
    });
  };

  // Optimized slide animations using CSS transitions
  const slideUp = (element, duration, callback) => {
    if (!element) return;

    const height = element.scrollHeight;
    element.style.height = height + "px";
    element.style.transition = `height ${duration}ms ease-out`;
    element.style.overflow = "hidden";

    requestAnimationFrame(() => {
      element.style.height = "0px";
    });

    const cleanup = () => {
      element.style.display = "none";
      element.style.removeProperty("height");
      element.style.removeProperty("transition");
      element.style.removeProperty("overflow");
      callback?.();
    };

    element.addEventListener("transitionend", cleanup, { once: true });
  };

  const slideDown = (element, duration, callback) => {
    if (!element) return;

    element.style.display = "block";
    const height = element.scrollHeight;
    
    element.style.height = "0px";
    element.style.overflow = "hidden";
    element.style.transition = `height ${duration}ms ease-out`;

    requestAnimationFrame(() => {
      element.style.height = height + "px";
    });

    const cleanup = () => {
      element.style.removeProperty("height");
      element.style.removeProperty("transition");
      element.style.removeProperty("overflow");
      callback?.();
    };

    element.addEventListener("transitionend", cleanup, { once: true });
  };

  /* AOS initialization
   * ------------------------------------------------------ */
  const ssAOS = () => {
    if (typeof AOS !== "undefined") {
      AOS.init({
        offset: 100,
        duration: 600,
        easing: "ease-in-out",
        delay: 300,
        once: false,
      });
    }
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

    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        return;
      }

      const currentText = lines[lineIndex];

      if (charIndex < currentText.length) {
        currentLine.textContent += currentText[charIndex];
        charIndex++;
        setTimeout(typeNextChar, 40); // 40ms per character for smooth typing
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

          setTimeout(typeNextChar, 150); // Pause between lines
        }
      }
    };

    // Start typing after a short delay
    setTimeout(() => {
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

    // Check if on mobile
    if (window.innerWidth <= 900) return;

    let ticking = false;

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

    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    updateParallax(); // Initial call
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
      ssAccordion();
      ssSmoothScroll();
      ssBackToTop();
      ssHighlightActiveLink();
      ssTypewriter();
      ssParallaxProfile();

      // Initialize AOS after other components
      requestAnimationFrame(ssAOS);
    });

    // Add optimized scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initialize header state
    updateHeaderState();
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ssInit, { once: true });
  } else {
    ssInit();
  }

})();