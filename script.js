
// script.js

// Function to toggle section expansion
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const arrow = document.getElementById(sectionId + '-arrow');
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        arrow.classList.remove('rotated');
    } else {
        // Close all other sections first (optional - remove if you want multiple sections open)
        closeAllSections();
        
        content.classList.add('active');
        arrow.classList.add('rotated');
    }
}

// Function to close all sections
function closeAllSections() {
    const allContents = document.querySelectorAll('.section-content');
    const allArrows = document.querySelectorAll('.arrow');
    
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    
    allArrows.forEach(arrow => {
        arrow.classList.remove('rotated');
    });
}

// Function to scroll to top (home button)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Close all sections when going home
    closeAllSections();
}

// Show/hide home button based on scroll position
window.addEventListener('scroll', function() {
    const homeBtn = document.getElementById('homeBtn');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 200) {
        homeBtn.style.opacity = '1';
    } else {
        homeBtn.style.opacity = '0.7';
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set initial home button opacity
    const homeBtn = document.getElementById('homeBtn');
    homeBtn.style.opacity = '0.7';
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add keyboard support for section buttons
    document.querySelectorAll('.section-btn').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// Add touch event support for mobile
document.addEventListener('touchstart', function() {}, {passive: true});