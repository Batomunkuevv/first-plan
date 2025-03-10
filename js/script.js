class FirstPlan {
    MAX_MEDIA_992 = window.matchMedia('(max-width: 991px)');

    constructor() {
        this.init();
    }

    init() {
        this.initAnchors();
        this.initHeader();
        this.initLozad();
        this.initFoldedElements();
        this.initAccordions();
        this.initSliders();
        this.initProjectsSliderCardsHover();
        this.initProjectsFilters();
    }

    initHeader() {
        const self = this;
        const siteHeader = document.querySelector('.site-header');

        if (!siteHeader) return;

        const isWhiteHeader = siteHeader.classList.contains('site-header--white');
        const burger = siteHeader.querySelector('.burger');
        const burgerMenu = siteHeader.querySelector('.menu');
        const siteHeaderLogo = siteHeader.querySelector('.logo');
        const siteHeaderHeight = siteHeader.scrollHeight;

        initBurgerMenu();
        animateHeader();
        initObserveHeaderColor();

        function initBurgerMenu() {
            if (!burger || !burgerMenu);

            const menuAnchors = burgerMenu.querySelectorAll('[data-anchor]');
            const menuOverlay = siteHeader.querySelector('.site-header__overlay');

            setHeaderOverlayHeight();
            initMenuAnchors();
            burger.addEventListener('click', handleBurgerClick);
            menuOverlay.addEventListener('click', closeMenu);

            function initMenuAnchors() {
                if (!menuAnchors) return;

                menuAnchors.forEach(anchor => {
                    window.addEventListener('scroll', observeAnchorIsCurrent.bind(null, anchor));
                    anchor.addEventListener('click', closeMenu);
                })
            }

            function observeAnchorIsCurrent(anchor) {
                const scrollingPosition = window.scrollY + siteHeaderHeight;
                const anchorHash = anchor.hash;

                if (!anchorHash) return;

                const anchorSection = document.getElementById(anchorHash.slice(1));
                const isInsideAnchorSection = self.isInsideSection(scrollingPosition, anchorSection, true);

                if (isInsideAnchorSection) {
                    anchor.classList.add('menu__link--current');
                } else {
                    anchor.classList.remove('menu__link--current');
                }
            }

            function setHeaderOverlayHeight() {
                const burgerMenuHeight = burgerMenu.getBoundingClientRect().height;
                const offsetHeight = burgerMenuHeight + siteHeaderHeight

                menuOverlay.style.height = `calc(100vh - ${offsetHeight}px)`;
            }

            function handleBurgerClick() {
                if (!isWhiteHeader) switchHeaderColor();

                menuOverlay.classList.toggle('site-header__overlay--visible');
                siteHeader.classList.toggle('site-header--open-menu');
                burger.classList.toggle('burger--active');
                burgerMenu.classList.toggle('site-header__menu--open');
                document.body.classList.toggle('is-lock');
            }

            function closeMenu() {
                if (!isWhiteHeader) switchHeaderColor();

                menuOverlay.classList.remove('site-header__overlay--visible');
                siteHeader.classList.remove('site-header--open-menu');
                burger.classList.remove('burger--active');
                burgerMenu.classList.remove('site-header__menu--open');
                document.body.classList.remove('is-lock');
            }
        }

        function animateHeader() {
            let lastScrollTop;

            window.addEventListener('scroll', handleWindowScroll);

            function handleWindowScroll() {
                const scrollTop = document.documentElement.scrollTop;

                if (scrollTop > 0 && scrollTop > 100) {
                    siteHeader.classList.add('site-header--scrolling');
                } else {
                    siteHeader.classList.remove('site-header--scrolling');
                }

                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    siteHeader.classList.add('site-header--scrolling-down');
                } else {
                    siteHeader.classList.remove('site-header--scrolling-down');
                }

                lastScrollTop = scrollTop;
            }
        }

        function initObserveHeaderColor() {
            const sectionsWithWhiteHeader = document.querySelectorAll('.section--blue, .hero-home');

            if (!sectionsWithWhiteHeader || self.MAX_MEDIA_992.matches) return;

            window.addEventListener('scroll', checkHeaderColor.bind(null, sectionsWithWhiteHeader));
            window.addEventListener('resize', checkHeaderColor.bind(null, sectionsWithWhiteHeader));
            checkHeaderColor(sectionsWithWhiteHeader);
        }

        function switchHeaderColor() {
            const isWhiteHeader = siteHeader.classList.contains('site-header--white');

            if (isWhiteHeader) {
                showDefaultHeader();
            } else {
                showWhiteHeader();
            }
        }

        function showWhiteHeader() {
            siteHeader.classList.add('site-header--white');
            burger.classList.add('burger--white');
            burgerMenu.classList.add('menu--white');
            siteHeaderLogo.classList.add('logo--white');
        }

        function showDefaultHeader() {
            siteHeader.classList.remove('site-header--white');
            burger.classList.remove('burger--white');
            burgerMenu.classList.remove('menu--white');
            siteHeaderLogo.classList.remove('logo--white');
        }

        function checkHeaderColor(sectionsWithWhiteHeader) {
            const scrollingPosition = window.scrollY + siteHeaderHeight;

            let inColoredSection = false;

            sectionsWithWhiteHeader.forEach(section => {
                const isInsideSection = self.isInsideSection(scrollingPosition, section);

                if (isInsideSection) {
                    inColoredSection = true;
                }
            });

            if (inColoredSection) {
                showWhiteHeader();
            } else {
                showDefaultHeader();
            }
        }
    }

    initFoldedElements() {
        const self = this;
        const foldedElements = document.querySelectorAll('[data-fold]');

        if (!foldedElements) return;

        foldedElements.forEach(foldedElement => {
            const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
            const foldedElementContent = foldedElement.querySelector('[data-fold-content]')

            heightToggleElement(foldedElementBtn, foldedElementContent);
        })

        function heightToggleElement(toggler, blocks) {
            toggler.addEventListener("click", (e) => {
                e.preventDefault();

                if (blocks instanceof NodeList) {
                    blocks.forEach(function (block) {
                        addFunctionality(toggler, block);
                    });
                } else {
                    addFunctionality(toggler, blocks);
                }
            });

            function addFunctionality(toggler, block) {
                if (block.style.height === "0px" || !block.style.height && !block.classList.contains('is-expanded')) {
                    self.slideDown(block);
                    toggler.classList.add("is-active");
                } else {
                    self.slideUp(block);
                    toggler.classList.remove("is-active");
                }
            }
        }
    }

    initAccordions() {
        const self = this;
        const accordions = document.querySelectorAll('[data-accordion]');

        if (!accordions) return;

        accordions.forEach(accordion => {
            const accordionFoldedElements = accordion.querySelectorAll('[data-fold]');

            accordionFoldedElements.forEach((foldedElement, i) => {
                const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
                const foldedElementsWithoutCurrent = Array.from(accordionFoldedElements).filter((element, j) => i !== j);

                foldedElementBtn.addEventListener('click', () => closeOtherFoldedElements(foldedElementsWithoutCurrent));
            })

        })

        function closeOtherFoldedElements(foldedElements) {
            foldedElements.forEach(element => {
                const foldedElementBtn = element.querySelector('[data-fold-btn]');
                const foldedElementContent = element.querySelector('[data-fold-content]');

                foldedElementBtn.classList.remove("is-active");
                self.slideUp(foldedElementContent);
            })
        }
    }

    initSliders() {
        const sliders = document.querySelectorAll('[data-slider]');

        if (!sliders) return;

        const DEFAULT_OPTIONS = {
            slidesPerView: 'auto',
            speed: 1000,
            grabCursor: true,
            spaceBetween: 16,
        }

        sliders.forEach(slider => {
            const sliderType = slider.dataset.slider;
            const options = getOptionsByType(slider, sliderType);

            const sliderSwiper = new Swiper(slider, options);
        })

        function getOptionsByType(slider, type) {
            let options = { ...DEFAULT_OPTIONS };

            switch (type) {
                case "projects": {
                    const projectsPrev = slider.closest('.projects-block').querySelector('.arrows__arrow--prev');
                    const projectsNext = slider.closest('.projects-block').querySelector('.arrows__arrow--next');

                    options = {
                        ...options,
                        navigation: {
                            prevEl: projectsPrev,
                            nextEl: projectsNext
                        }
                    }

                    break;
                }
                case "other-projects": {
                    const otherProjectsPrev = slider.closest('.other-projects').querySelector('.arrows__arrow--prev');
                    const otherProjectsNext = slider.closest('.other-projects').querySelector('.arrows__arrow--next');

                    options = {
                        ...options,
                        slidesPerView: 'auto',
                        spaceBetween: 8,
                        navigation: {
                            prevEl: otherProjectsPrev,
                            nextEl: otherProjectsNext
                        }
                    }

                    break;
                }
                case "gallery": {
                    options = {
                        ...options,
                        loop: true,
                        centeredSlides: true,
                        spaceBetween: 8,
                        autoplay: {
                            delay: 5000,
                            disableOnInteraction: false
                        },
                        navigation: {
                            prevEl: '.arrows__arrow--prev',
                            nextEl: ".arrows__arrow--next"
                        },
                        breakpoints: {
                            767: {
                                breakpoints: 16
                            }
                        }
                    }

                    break;
                }
                case "companies": {
                    options = {
                        ...options,
                        spaceBetween: 8,
                        slidesPerView: 2,
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true
                        },
                        grid: {
                            rows: 2,
                            fill: "row",
                        },
                        breakpoints: {
                            767: {
                                spaceBetween: 0,
                                grid: false,
                                slidesPerView: "auto",
                                enabled: false
                            }
                        }
                    }

                    break;
                }
                case "team": {
                    const teamPrev = slider.closest('.container').querySelector('.arrows__arrow--prev');
                    const teamNext = slider.closest('.container').querySelector('.arrows__arrow--next');

                    options = {
                        ...options,
                        spaceBetween: 8,
                        navigation: {
                            prevEl: teamPrev,
                            nextEl: teamNext
                        }
                    }

                    break;
                }
            }

            return options;
        }
    }

    initProjectsSliderCardsHover() {
        const self = this;
        const projectsSliderCards = document.querySelectorAll('.project-slider-card');

        if (!projectsSliderCards || self.MAX_MEDIA_992.matches) return;

        projectsSliderCards.forEach(card => {
            const cardExcerpt = card.querySelector('.project-slider-card__excerpt');

            card.addEventListener('mouseenter', handleCardHover);
            card.addEventListener('mouseleave', handleCardUnhover);

            function handleCardHover() {
                self.slideDown(cardExcerpt);
            };

            function handleCardUnhover() {
                self.slideUp(cardExcerpt);
            }
        })
    }

    initLozad() {
        const lozadElements = document.querySelectorAll('[data-lozad]');

        if (!lozadElements) return;

        lozadElements.forEach(element => {
            const lozadObserver = lozad(element);

            lozadObserver.observe()
        });
    }

    initAnchors = () => {
        const self = this;
        const anchors = document.querySelectorAll('[data-anchor]');

        if (!anchors) return;

        const header = document.querySelector('.site-header');
        const headerHeight = header.offsetHeight;

        initScrollOnLoad();

        anchors.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const href = this.getAttribute('href').slice(1);
                const scrollTarget = document.getElementById(href);

                if (!scrollTarget) return;

                const topOffset = self.MAX_MEDIA_992.matches ? headerHeight : 0;
                const elementPosition = scrollTarget.getBoundingClientRect().top;
                const offsetPosition = elementPosition - topOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });

        function initScrollOnLoad() {
            const hash = window.location.hash;

            if (!hash) return;

            const scrollTarget = document.querySelector(hash);

            if (!scrollTarget) return;

            const topOffset = self.MAX_MEDIA_992.matches ? headerHeight : 0;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    initProjectsFilters() {
        const self = this;
        const projects = document.querySelector('.projects');

        if (!projects) return;

        let isOpen = false;
        const filters = projects.querySelector('.projects__filters');
        const filtersButton = filters.querySelector('.filters__button');
        const filtersDropdowns = filters.querySelectorAll('.filters__dropdown');
        const filtersDropdownLists = filters.querySelectorAll(`.filters__options[data-filter]`);

        initFiltersButton();
        initFiltersDropdowns();
        window.addEventListener('click', handleClickOutside);

        function initFiltersDropdowns() {
            if (self.MAX_MEDIA_992.matches) return;

            filtersDropdowns.forEach((dropdown, i) => {
                dropdown.isOpen = false;
                const dropdownType = dropdown.dataset.filter;
                const dropdownList = [...filtersDropdownLists].find(list => list.dataset.filter === dropdownType);

                dropdown.addEventListener('click', () => handleDropdownClick(dropdown, dropdownList));
            })

            function handleDropdownClick(dropdown, dropdownList) {
                hideOtherActiveDropdown(dropdown);

                dropdown.isOpen = !dropdown.isOpen;

                if (dropdown.isOpen) {
                    dropdown.classList.add('is-active');
                    self.slideDown(dropdownList);
                } else {
                    dropdown.classList.remove('is-active');
                    self.slideUp(dropdownList);
                }
            }

            function hideOtherActiveDropdown(currentDropdown) {
                const activeDropdown = [...filtersDropdowns].find(dropdown => dropdown.isOpen && currentDropdown !== dropdown);

                if (!activeDropdown) return;

                const activeDropdownType = activeDropdown.dataset.filter;
                const activeDropdownList = [...filtersDropdownLists].find(list => list.dataset.filter === activeDropdownType);

                activeDropdown.isOpen = false;
                activeDropdown.classList.remove('is-active');
                self.slideUp(activeDropdownList)
            }
        }

        function handleClickOutside(e) {
            const { target } = e;

            if (filters.contains(target)) return;

            hideFilters();
        }

        function initFiltersButton() {
            if (!filtersButton) return;

            filtersButton.addEventListener('click', toggleFilters);
        }

        function toggleFilters() {
            if (isOpen) {
                isOpen = false;
                hideFilters();
            } else {
                isOpen = true;
                showFilters();
            }
        }

        function showFilters() {
            isOpen = true;
            filtersButton.classList.add('is-active');
            filters.classList.add('is-open');
        }

        function hideFilters() {
            isOpen = false;
            filtersButton.classList.remove('is-active');
            filters.classList.remove('is-open');
        }
    }

    isInsideSection(scrollingPosition, section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        return scrollingPosition >= sectionTop && scrollingPosition < sectionBottom;
    }

    slideUp(block) {
        block.style.height = `${block.scrollHeight}px`;
        window.getComputedStyle(block, null).getPropertyValue("height");
        block.style.height = "0";
        block.classList.remove("is-expanded");
    }

    slideDown(block) {
        block.style.height = `${block.scrollHeight}px`;
        block.classList.add("is-expanded");

        block.addEventListener("transitionend", () => {
            if (block.style.height !== "0px") {
                block.style.height = "auto";
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', new FirstPlan());