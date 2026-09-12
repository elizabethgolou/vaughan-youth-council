// DARK MODE TOGGLE
const darkToggle = document.querySelector('#dark-toggle');
const darkModeKey = 'vyc-dark-mode';

function applyDarkMode(isDark) {
    document.body.classList.toggle('dark', isDark);
    if (darkToggle) {
        darkToggle.textContent = isDark ? '☀️' : '🌙';
        darkToggle.setAttribute('aria-pressed', String(isDark));
    }
}

if (darkToggle) {
    const savedMode = localStorage.getItem(darkModeKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedMode ? savedMode === 'true' : prefersDark;

    applyDarkMode(initialDarkMode);

    darkToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark');
        applyDarkMode(isDark);
        localStorage.setItem(darkModeKey, String(isDark));
    });
}

// MOBILE MENU (HAMBURGER)
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('header nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

const eventMapDialog = document.querySelector('#event-map-dialog');
const eventMapTrigger = document.querySelector('.event-map-trigger');
const eventMapClose = document.querySelector('.event-map-close');
const eventMapImage = document.querySelector('.event-map-zoom-image');
const eventMapZoomIn = document.querySelector('.event-map-zoom-in');
const eventMapZoomOut = document.querySelector('.event-map-zoom-out');
const eventMapReset = document.querySelector('.event-map-reset');

if (eventMapDialog && eventMapTrigger && eventMapClose && eventMapImage) {
    const initialEventMapZoom = 0.6;
    let eventMapZoom = initialEventMapZoom;
    let lastFocusedElement;

    function updateEventMapZoom() {
        eventMapImage.style.width = `${eventMapZoom * 100}%`;
        eventMapImage.style.transform = 'none';
        eventMapZoomOut.disabled = eventMapZoom <= initialEventMapZoom;
        eventMapZoomIn.disabled = eventMapZoom >= 3;
    }

    function closeEventMap() {
        eventMapDialog.close();
        eventMapZoom = initialEventMapZoom;
        updateEventMapZoom();
        lastFocusedElement?.focus();
    }

    eventMapTrigger.addEventListener('click', () => {
        lastFocusedElement = document.activeElement;
        eventMapDialog.showModal();
        updateEventMapZoom();
        eventMapClose.focus();
    });

    eventMapClose.addEventListener('click', closeEventMap);
    eventMapZoomIn?.addEventListener('click', () => {
        eventMapZoom = Math.min(3, eventMapZoom + 0.25);
        updateEventMapZoom();
    });
    eventMapZoomOut?.addEventListener('click', () => {
        eventMapZoom = Math.max(1, eventMapZoom - 0.25);
        updateEventMapZoom();
    });
    eventMapReset?.addEventListener('click', () => {
        eventMapZoom = initialEventMapZoom;
        updateEventMapZoom();
    });
    eventMapDialog.addEventListener('click', event => {
        if (event.target === eventMapDialog) {
            closeEventMap();
        }
    });
}

// SCROLL-TRIGGERED ANIMATIONS (cards, sections)
const animatedElements = document.querySelectorAll('.card, .section-fade');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

animatedElements.forEach(el => observer.observe(el));

// IMAGE CAROUSEL
const carouselStage = document.querySelector('.carousel-stage');

if (carouselStage) {
    const slides = Array.from(carouselStage.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const dots = Array.from(document.querySelectorAll('.dot'));
    const title = document.querySelector('#carousel-title');
    const description = document.querySelector('#carousel-description');
    const content = [
        {
            title: 'Youth Sip & Chat',
            description: 'A relaxed space for youth to connect, share ideas, and build friendships while talking about local issues and opportunities.'
        },
        {
            title: 'Community Cleanups',
            description: 'Hands-on events that bring young people together to care for parks, public spaces, and neighbourhoods across Vaughan.'
        },
        {
            title: 'Movie Nights',
            description: 'Screenings and social gatherings that create welcoming spaces for youth to relax, connect, and celebrate community.'
        },
        {
            title: 'Awareness Campaigns',
            description: 'Campaigns that spotlight important causes, spark conversations, and encourage youth to make their voices heard.'
        },
        {
            title: 'Assisting Local Non-profits',
            description: 'Volunteer-driven support that helps local organizations expand their impact and strengthen community programs.'
        }
    ];
    let currentSlide = 0;
    let autoRotate;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
        if (title && description) {
            title.textContent = content[currentSlide].title;
            description.textContent = content[currentSlide].description;
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function resetAutoRotate() {
        clearInterval(autoRotate);
        autoRotate = setInterval(nextSlide, 5000);
    }

    prevButton?.addEventListener('click', () => {
        prevSlide();
        resetAutoRotate();
    });

    nextButton?.addEventListener('click', () => {
        nextSlide();
        resetAutoRotate();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.slide));
            resetAutoRotate();
        });
    });

    showSlide(0);
    resetAutoRotate();
}