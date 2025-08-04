// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const hamburger = document.querySelector('.hamburger');
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

// Slider Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Initialize the slider
function initSlider() {
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    updateSlider();
}

// Update slider position and dots
function updateSlider() {
    const translateX = -currentSlide * (100 / totalSlides);
    sliderTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Update navigation buttons
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
}

// Go to specific slide
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
}

// Next slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlider();
    }
}

// Previous slide
function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
}

// Auto-slide functionality
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        if (currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            currentSlide = 0;
            updateSlider();
        }
    }, 4000); // Change slide every 4 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Menu Toggle Functionality
function toggleMenu() {
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        // Close menu
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    } else {
        // Open menu
        navMenu.classList.add('active');
        hamburger.classList.add('active');
    }
}

// Event Listeners
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Prevent menu from closing when clicking inside it
navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Slider navigation
prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide(); // Restart auto-slide
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide(); // Restart auto-slide
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    }
});

// Touch/swipe functionality for mobile
let startX = 0;
let endX = 0;

sliderTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoSlide();
});

sliderTrack.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
});

sliderTrack.addEventListener('touchend', () => {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
    }
    
    startAutoSlide(); // Restart auto-slide
});

// Pause auto-slide on hover
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', stopAutoSlide);
sliderContainer.addEventListener('mouseleave', startAutoSlide);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    startAutoSlide();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close menu after clicking a link
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Add some interactive effects
slides.forEach(slide => {
    slide.addEventListener('mouseenter', () => {
        slide.style.transform = 'scale(1.02)';
        slide.style.transition = 'transform 0.3s ease';
    });
    
    slide.addEventListener('mouseleave', () => {
        slide.style.transform = 'scale(1)';
    });
});

// Add loading animation for images
document.querySelectorAll('.slide img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    
    img.addEventListener('error', () => {
        // If the fallback also fails, show a placeholder
        if (img.src.includes('unsplash.com')) {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWx0aGNhcmUgSW1hZ2U8L3RleHQ+PC9zdmc+';
        }
        img.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
}); 