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

    // Utility functions
    // Debounce function to limit how often a function can run
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Helper function for smooth scrolling with controlled duration
    function smoothScroll(targetPosition, duration, callback) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let start = null;

        // Don't animate for very small distances
        if (Math.abs(distance) < 5) {
            window.scrollTo(0, targetPosition);
            if (callback) callback();
            return;
        }

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
            
            // Ensure preloader exists before trying to fade it out
            if (loader && preloader) {
                // Add ss-loaded class immediately to start content animation
                document.documentElement.classList.remove('ss-preload');
                document.documentElement.classList.add('ss-loaded');
                
                // Then fade out the preloader
                fadeOut(loader, "slow", function() {
                    // will fade out the whole DIV that covers the website.
                    fadeOut(preloader, "slow", function() {
                        // Remove preloader from DOM after fade out is complete
                        if (preloader.parentNode) {
                            preloader.parentNode.removeChild(preloader);
                        }
                    });
                });
            } else {
                // If preloader elements don't exist, still add the loaded class
                document.documentElement.classList.remove('ss-preload');
                document.documentElement.classList.add('ss-loaded');
            }
        });
    };

    // Helper function to fade out elements (optimized version)
    function fadeOut(element, speed, callback) {
        if (!element) return;
        
        // Cache initial opacity
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
        element.style.opacity = initialOpacity;
        
        let opacity = initialOpacity;
        const step = 0.05; // Smaller steps for smoother fade
        const interval = speed === "slow" ? 30 : 10; // Adjusted interval
        
        const timer = setInterval(function() {
            opacity -= step;
            
            if (opacity <= 0.05) {
                clearInterval(timer);
                element.style.opacity = 0;
                element.style.display = 'none';
                element.style.visibility = 'hidden'; // Add visibility hidden for better accessibility
                if (callback) {
                    callback();
                }
            } else {
                element.style.opacity = opacity;
            }
        }, interval);
    }

   /* move header - control header as you scroll down
    * -------------------------------------------------- */
    const ssMoveHeader = function() {
        const hero = document.querySelector('.s-hero');
        const hdr = document.querySelector('.s-header');
        
        if (!hero || !hdr) return;
        
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

            // Use a single classList operation with toggle
            headerStates.forEach(({ threshold, className }) => {
                hdr.classList.toggle(className, scrollPosition > threshold);
            });
        };

        // Initial check on load
        updateHeaderClasses();

        // Update classes on scroll with debounce for better performance
        window.addEventListener('scroll', debounce(updateHeaderClasses, 10));
    };

    /* mobile menu
    * ---------------------------------------------------- */
    const ssMobileMenu = function() {
        const toggleButton = document.querySelector('.header-menu-toggle');
        const headerContent = document.querySelector('.header-content');
        const siteBody = document.body;
        
        if (!toggleButton || !headerContent) return;
        
        // Create overlay once and cache it
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        
        const mediaQuery = window.matchMedia('(max-width: 900px)');
        const mediaQueryLarge = window.matchMedia('(min-width: 901px)');

        // Function to handle menu toggle
        const toggleMenu = () => {
            const isOpen = siteBody.classList.contains('menu-is-open');
            
            toggleButton.classList.toggle('is-clicked', !isOpen);
            siteBody.classList.toggle('menu-is-open', !isOpen);
            siteBody.style.overflow = isOpen ? '' : 'hidden';
        };

        // Close menu if open
        const closeMenu = () => {
            if (siteBody.classList.contains("menu-is-open")) {
                toggleMenu();
            }
        };
        
        // Close menu on resize
        const closeMenuOnResize = debounce(() => {
            if (mediaQueryLarge.matches) {
                closeMenu();
            }
        }, 100);

        // Append overlay
        siteBody.appendChild(overlay);

        // Toggle menu on button click
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault();
            toggleMenu();
        });

        // Close menu on header link click (if media query is met)
        headerContent.addEventListener('click', (event) => {
            const target = event.target;
            if ((target.tagName === 'A' || target.classList.contains('btn')) && mediaQuery.matches) {
                closeMenu();
            }
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
        
        if (!allItems.length) return;
        
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

        // Use event delegation for better performance
        const servicesList = document.querySelector('.services-list');
        if (servicesList) {
            servicesList.addEventListener('click', function(event) {
                const header = event.target.closest('.services-list__item-header');
                if (!header) return;
                
                event.preventDefault();

                const curItem = header.parentElement;
                const curPanel = curItem.querySelector('.services-list__item-body');
                const activeItem = document.querySelector('.services-list__item.is-active');

                const closePanel = (item) => {
                    if (!item) return;
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
        }
    };

    // Helper function to slide up elements (optimized version)
    function slideUp(element, duration, callback) {
        if (!element) return;
        
        const height = element.offsetHeight;
        element.style.height = height + 'px';
        element.style.transitionProperty = 'height, margin, padding';
        element.style.transitionDuration = duration + 'ms';
        element.style.overflow = 'hidden';
        
        // Trigger reflow
        element.offsetHeight;
        
        // Set all values at once
        element.style.height = '0';
        element.style.paddingTop = '0';
        element.style.paddingBottom = '0';
        element.style.marginTop = '0';
        element.style.marginBottom = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
            // Remove all properties at once
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

    // Helper function to slide down elements (optimized version)
    function slideDown(element, duration, callback) {
        if (!element) return;
        
        // Reset display
        element.style.removeProperty('display');
        let display = window.getComputedStyle(element).display;
        if (display === 'none') display = 'block';
        element.style.display = display;
        
        const height = element.offsetHeight;
        
        // Set initial state
        element.style.overflow = 'hidden';
        element.style.height = '0';
        element.style.paddingTop = '0';
        element.style.paddingBottom = '0';
        element.style.marginTop = '0';
        element.style.marginBottom = '0';
        
        // Trigger reflow
        element.offsetHeight;
        
        // Set transition
        element.style.transitionProperty = 'height, margin, padding';
        element.style.transitionDuration = duration + 'ms';
        
        // Set target height and remove padding/margin restrictions
        element.style.height = height + 'px';
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        
        setTimeout(() => {
            // Clean up all properties
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
        if (typeof AOS !== 'undefined') {
            AOS.init({
                offset: 100,
                duration: 600,
                easing: 'ease-in-out',
                delay: 300,
                once: false,
            });
        }
    };
    
   /* smooth scrolling
    * ------------------------------------------------------ */
    const ssSmoothScroll = function() {
        // Use event delegation for better performance
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.smoothscroll');
            if (!target) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const href = target.getAttribute('href');
            if (!href) return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            // Get target position and scroll to it
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            
            // Scroll to target with callback to update URL hash
            smoothScroll(targetPosition, cfg.scrollDuration, function() {
                window.location.hash = href;
            });
        });
    };

   /* back to top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
        const pxShow = 800;
        const goTopButton = document.querySelector(".ss-go-top");
        
        if (!goTopButton) return;

        // Show or hide the button initially
        goTopButton.classList.toggle('link-is-visible', window.scrollY >= pxShow);

        // Show or hide the button on scroll with debounce
        window.addEventListener('scroll', debounce(function() {
            goTopButton.classList.toggle('link-is-visible', window.scrollY >= pxShow);
        }, 100));

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
        // Initialize preloader immediately
        ssPreloader();
        
        // Use requestAnimationFrame for other initializations to ensure DOM is ready
        requestAnimationFrame(() => {
            ssMoveHeader();
            ssMobileMenu();
            ssAccordion();
            ssAOS();
            ssSmoothScroll();
            ssBackToTop();
        });
    })();

})();