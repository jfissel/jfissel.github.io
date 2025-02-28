/* ===================================================================
 * Ethos 1.0.0 - Main JS (Vanilla JavaScript Version)
 * ------------------------------------------------------------------- */

(function() {

    "use strict";
    
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    const cfg = {
        scrollDuration: 800, // smoothscroll duration
    };

    // Add the User Agent to the <html>
    // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
    const doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

    // Helper function for smooth scrolling with controlled duration
    function smoothScroll(targetPosition, duration, callback) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function - easeInOutQuad
            const easing = percentage < 0.5 
                ? 2 * percentage * percentage 
                : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
            
            window.scrollTo(0, startPosition + distance * easing);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        
        window.requestAnimationFrame(step);
    }

   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {
        document.documentElement.classList.add('ss-preload');

        window.addEventListener('load', function() {
            // force page scroll position to top at page refresh
            smoothScroll(0, 400);

            // will first fade out the loading animation 
            const loader = document.getElementById("loader");
            const preloader = document.getElementById("preloader");
            
            fadeOut(loader, "slow", function() {
                // will fade out the whole DIV that covers the website.
                fadeOut(preloader, "slow");
            });
            
            // for hero content animations 
            document.documentElement.classList.remove('ss-preload');
            document.documentElement.classList.add('ss-loaded');
        });
    };

    // Helper function to fade out elements (replacement for jQuery fadeOut)
    function fadeOut(element, speed, callback) {
        let opacity = 1;
        const timer = setInterval(function() {
            if (opacity <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
                if (callback) {
                    callback();
                }
            }
            element.style.opacity = opacity;
            opacity -= 0.1;
        }, speed === "slow" ? 50 : 10);
    }

   /* move header - control header as you scroll down
    * -------------------------------------------------- */
    const ssMoveHeader = function() {
        const hero = document.querySelector('.s-hero');
        const hdr = document.querySelector('.s-header');
        const heroHeight = hero.offsetHeight;

        // Define thresholds and corresponding classes
        const headerStates = [
            { threshold: heroHeight - 170, className: 'sticky' },
            { threshold: heroHeight - 150, className: 'offset' },
            { threshold: heroHeight - 20, className: 'scrolling' },
        ];

        // Function to update header classes based on scroll position
        const updateHeaderClasses = () => {
            const scrollPosition = window.scrollY;

            // loop through states in reverse order to remove classes first
            for (let i = headerStates.length - 1; i >= 0; i--) {
                const { threshold, className } = headerStates[i];
                if (scrollPosition > threshold) {
                    hdr.classList.add(className);
                } else {
                    hdr.classList.remove(className);
                }
            }
        };

        // Initial check on load
        updateHeaderClasses();

        // Update classes on scroll
        window.addEventListener('scroll', updateHeaderClasses);
    };

    /* mobile menu
    * ---------------------------------------------------- */
    const ssMobileMenu = function() {
        const toggleButton = document.querySelector('.header-menu-toggle');
        const headerContent = document.querySelector('.header-content');
        const siteBody = document.body;
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        const mediaQuery = window.matchMedia('(max-width: 900px)');
        const mediaQueryLarge = window.matchMedia('(min-width: 901px)');

        // Function to handle menu toggle
        const toggleMenu = () => {
            const isOpen = siteBody.classList.contains('menu-is-open');
            
            if (isOpen) {
                toggleButton.classList.remove('is-clicked');
                siteBody.classList.remove('menu-is-open');
                siteBody.style.overflow = '';
            } else {
                toggleButton.classList.add('is-clicked');
                siteBody.classList.add('menu-is-open');
                siteBody.style.overflow = 'hidden';
            }
        };

        // Close menu if open
        const closeMenu = () => {
            if (siteBody.classList.contains("menu-is-open")) {
                toggleMenu();
            }
        };
        
        // Close menu on resize
        const closeMenuOnResize = () => {
            if (mediaQueryLarge.matches) {
                closeMenu();
            }
        };

        // Append overlay
        siteBody.appendChild(overlay);

        // Toggle menu on button click
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault();
            toggleMenu();
        });

        // Close menu on header link click (if media query is met)
        const headerLinks = headerContent.querySelectorAll('.header-nav a, .btn');
        headerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mediaQuery.matches) {
                    closeMenu();
                }
            });
        });

        // Close menu on overlay click
        overlay.addEventListener('click', closeMenu);

        // Close menu on resize
        window.addEventListener('resize', closeMenuOnResize);

        // Initial check on load, in case of resize during load
        closeMenuOnResize();
    };

   /* accordion
    * ------------------------------------------------------ */
   const ssAccordion = function() {
        const allItems = document.querySelectorAll('.services-list__item');
        const allPanels = document.querySelectorAll('.services-list__item-body');
        const allHeaders = document.querySelectorAll('.services-list__item-header');
        const animationDuration = 400;
        const scrollOffset = 90;

        // Hide all panels except the first one
        allPanels.forEach((panel, index) => {
            if (index > 0) {
                panel.style.display = 'none';
            }
        });

        allHeaders.forEach(header => {
            header.addEventListener('click', function(event) {
                event.preventDefault();

                const curItem = this.parentElement;
                const curPanel = curItem.querySelector('.services-list__item-body');
                const activeItem = document.querySelector('.services-list__item.is-active');

                const closePanel = (item) => {
                    const panel = item.querySelector('.services-list__item-body');
                    slideUp(panel, animationDuration, function() {
                        item.classList.remove('is-active');
                    });
                };

                const openPanel = () => {
                    slideDown(curPanel, animationDuration, function() {
                        const panelTop = curItem.getBoundingClientRect().top + window.scrollY;
                        const viewportTop = window.scrollY;

                        if (panelTop < viewportTop) {
                            // Scroll to the panel
                            smoothScroll(panelTop - scrollOffset, animationDuration);
                        }
                    });
                    curItem.classList.add('is-active');
                };

                if (curItem.classList.contains('is-active')) {
                    closePanel(curItem);
                } else {
                    if (activeItem) {
                        closePanel(activeItem);
                    }
                    openPanel();
                }
            });
        });
    };

    // Helper function to slide up elements (replacement for jQuery slideUp)
    function slideUp(element, duration, callback) {
        element.style.height = element.offsetHeight + 'px';
        element.style.transitionProperty = 'height, margin, padding';
        element.style.transitionDuration = duration + 'ms';
        element.offsetHeight; // Force repaint
        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.removeProperty('height');
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');
            if (callback) callback();
        }, duration);
    }

    // Helper function to slide down elements (replacement for jQuery slideDown)
    function slideDown(element, duration, callback) {
        element.style.removeProperty('display');
        let display = window.getComputedStyle(element).display;
        if (display === 'none') display = 'block';
        element.style.display = display;
        
        const height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        element.offsetHeight; // Force repaint
        
        element.style.transitionProperty = 'height, margin, padding';
        element.style.transitionDuration = duration + 'ms';
        element.style.height = height + 'px';
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        
        setTimeout(() => {
            element.style.removeProperty('height');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');
            if (callback) callback();
        }, duration);
    }

   /* Animate On Scroll
    * ------------------------------------------------------ */
    const ssAOS = function() {
        // AOS is a separate library, so we keep this as is
        AOS.init({
            offset: 100,
            duration: 600,
            easing: 'ease-in-out',
            delay: 300,
            once: false,
        });
    };
    
   /* smooth scrolling
    * ------------------------------------------------------ */
    const ssSmoothScroll = function() {
        const smoothScrollLinks = document.querySelectorAll('.smoothscroll');
        
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const target = this.getAttribute('href');
                const targetElement = document.querySelector(target);
                
                e.preventDefault();
                e.stopPropagation();

                // Get target position and scroll to it
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                // Scroll to target with callback to update URL hash
                smoothScroll(targetPosition, cfg.scrollDuration, function() {
                    window.location.hash = target;
                });
            });
        });
    };

   /* back to top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
        const pxShow = 800;
        const goTopButton = document.querySelector(".ss-go-top");

        // Show or hide the button initially
        if (window.scrollY >= pxShow) {
            goTopButton.classList.add('link-is-visible');
        }

        // Show or hide the button on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if (!goTopButton.classList.contains('link-is-visible')) {
                    goTopButton.classList.add('link-is-visible');
                }
            } else {
                goTopButton.classList.remove('link-is-visible');
            }
        });

        // Add smooth scrolling to top when clicked
        goTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to top and update hash
            smoothScroll(0, cfg.scrollDuration, function() {
                window.location.hash = '#top';
            });
        });
    };

   /* initialize
    * ------------------------------------------------------ */
    (function ssInit() {
        ssPreloader();
        ssMoveHeader();
        ssMobileMenu();
        ssAccordion();
        ssAOS();
        ssSmoothScroll();
        ssBackToTop();
    })();

})();