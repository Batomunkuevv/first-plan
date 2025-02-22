class FirstPlan {
    constructor() {
        this.init();
    }

    init() {
        this.initLozad();
        this.initFoldedElements();
        this.initAccordions();
    }

    initFoldedElements() {
        const foldedElements = document.querySelectorAll('[data-fold]');

        if (!foldedElements) return;

        foldedElements.forEach(foldedElement => {
            const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
            const foldedElementContent = foldedElement.querySelector('[data-fold-content]')

            this.heightToggleElement(foldedElementBtn, foldedElementContent);
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
                    block.style.height = `${block.scrollHeight}px`;
                    toggler.classList.add("is-active");
                    block.classList.add("is-expanded");
                } else {
                    block.style.height = `${block.scrollHeight}px`;
                    window.getComputedStyle(block, null).getPropertyValue("height");
                    block.style.height = "0";
                    toggler.classList.remove("is-active");
                    block.classList.remove("is-expanded");
                }

                block.addEventListener("transitionend", () => {
                    if (block.style.height !== "0px") {
                        block.style.height = "auto";
                    }
                });
            }
        }
    }

    initAccordions() {
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

                foldedElementContent.style.height = `${foldedElementContent.scrollHeight}px`;
                window.getComputedStyle(foldedElementContent, null).getPropertyValue("height");
                foldedElementContent.style.height = "0";
                foldedElementBtn.classList.remove("is-active");
                foldedElementContent.classList.remove("is-expanded");

                foldedElementContent.addEventListener("transitionend", () => {
                    if (foldedElementContent.style.height !== "0px") {
                        foldedElementContent.style.height = "auto";
                    }
                });
            })
        }
    }

    initLozad() {
        const lozadElements = document.querySelectorAll('[data-lozad]');

        if (!lozadElements) return;

        lozadElements.forEach(element => {
            const lozadObserver = lozad(element);

            lozadObserver.observe()
        });
    }
}

window.addEventListener('DOMContentLoaded', new FirstPlan());