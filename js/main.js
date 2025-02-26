/* ===================================================================
 * Ethos 1.0.0 - Main JS
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    
    const cfg = {
                scrollDuration : 800, // smoothscroll duration
                };
    const $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
    const doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        $("html").addClass('ss-preload');

        $WIN.on('load', function() {

            // force page scroll position to top at page refresh
            $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');

        });
    };

   /* move header - control header as you scroll down
    * -------------------------------------------------- */
    const ssMoveHeader = function () {
        const $hero = $('.s-hero');
        const $hdr = $('.s-header');
        const heroHeight = $hero.outerHeight();

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
            for (let i = headerStates.length -1; i>=0; i--) {
                const { threshold, className } = headerStates[i];
                if (scrollPosition > threshold) {
                    $hdr.addClass(className);
                } else {
                    $hdr.removeClass(className);
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
        const $toggleButton = $('.header-menu-toggle');
        const $headerContent = $('.header-content');
        const $siteBody = $('body');
        const $overlay = $('<div class="menu-overlay"></div>');
        const mediaQuery = window.matchMedia('(max-width: 900px)');
        const mediaQueryLarge = window.matchMedia('(min-width: 901px)');

        // Function to handle menu toggle
        const toggleMenu = () => {
            const isOpen = $siteBody.hasClass('menu-is-open');
            $toggleButton.toggleClass('is-clicked', !isOpen);
            $siteBody.toggleClass('menu-is-open', !isOpen);
            $siteBody.css('overflow', isOpen ? '' : 'hidden'); // Toggle overflow based on menu state
        };

        // Close menu if open
        const closeMenu = () => {
            if ($siteBody.hasClass("menu-is-open")) {
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
        $siteBody.append($overlay);

        // Toggle menu on button click
        $toggleButton.on('click', (event) => {
            event.preventDefault();
            toggleMenu();
        });

        // Close menu on header link click (if media query is met)
        $headerContent.find('.header-nav a, .btn').on('click', () => {
            if (mediaQuery.matches) {
                closeMenu();
            }
        });

        // Close menu on overlay click
        $overlay.on('click', closeMenu);

        // Close menu on resize
        window.addEventListener('resize', closeMenuOnResize);

        // Initial check on load, in case of resize during load
        closeMenuOnResize();
    };


   /* accordion
    * ------------------------------------------------------ */
   const ssAccordion = function() {
        
        const $allItems = $('.services-list__item');
        const $allPanels = $allItems.children('.services-list__item-body');
        const $allHeaders = $allItems.children('.services-list__item-header');

        $allPanels.slice(1).hide();

        $allHeaders.on('click', function() {

            const $this = $(this),
                $curItem = $this.parent(),
                $curPanel =  $this.next();
            
            if ($curItem.hasClass('is-active')) {
                $curPanel.slideUp();
                $curItem.removeClass('is-active');
            } else {
                $allPanels.slideUp();
                $allItems.removeClass('is-active');
                $curPanel.slideDown();
                $curItem.addClass('is-active');
            }
            
            return false;
        });
    };

   /* Animate On Scroll
    * ------------------------------------------------------ */
    const ssAOS = function() {
        
        AOS.init( {
            offset: 100,
            duration: 600,
            easing: 'ease-in-out',
            delay: 300,
            once: false,
            disable: 'mobile'
        });

    };
    
   /* smooth scrolling
    * ------------------------------------------------------ */
    const ssSmoothScroll = function() {
        
        $('.smoothscroll').on('click', function (e) {
            const target = this.hash;
            const $target = $(target);
            
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {
                window.location.hash = target;
            });
        });

    };

   /* back to top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
        
        const pxShow = 800;
        const $goTopButton = $(".ss-go-top")

        // Show or hide the button
        if ($(window).scrollTop() >= pxShow) $goTopButton.addClass('link-is-visible');

        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                if(!$goTopButton.hasClass('link-is-visible')) $goTopButton.addClass('link-is-visible')
            } else {
                $goTopButton.removeClass('link-is-visible')
            }
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

})(jQuery);