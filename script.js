// Simple Image Viewer with Smooth Sliding Transitions, Table of Contents, and Mobile Gestures
let currentPage = 1;
const totalPages = 20;
let zoomLevel = 1;
let isDragging = false;
let startPosition = { x: 0, y: 0 };
let imageOffset = { x: 0, y: 0 };
let isTransitioning = false;

// Mobile gesture variables
let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let initialPinchDistance = 0;
let initialZoomLevel = 1;
let isPinching = false;
let swipeThreshold = 50; // minimum distance for swipe
let swipeTimeThreshold = 300; // maximum time for swipe in ms

// Table of Contents - You can edit these titles later
const tableOfContents = [
    "Page 1",
    "Page 2", 
    "Page 3",
    "Page 4",
    "Page 5",
    "Page 6",
    "Page 7",
    "Page 8",
    "Page 9",
    "Page 10",
    "Page 11",
    "Page 12",
    "Page 13",
    "Page 14",
    "Page 15",
    "Page 16",
    "Page 17",
    "Page 18",
    "Page 19",
    "Page 20"
];

// Page URLs
const pageUrls = [];
for (let i = 1; i <= totalPages; i++) {
    pageUrls.push(`images/page${i}.jpg`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Simple Image Viewer...');
    setupImageContainer();
    setupTableOfContents();
    loadCurrentPage();
    updatePageInfo();
    updateNavigationButtons();
    addEventListeners();
});

// Setup Table of Contents
function setupTableOfContents() {
    const tocDropdown = document.getElementById('tocDropdown');
    tocDropdown.innerHTML = '';
    
    tableOfContents.forEach((title, index) => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';
        tocItem.textContent = title;
        tocItem.onclick = () => goToPage(index + 1);
        tocDropdown.appendChild(tocItem);
    });
    
    updateTOCHighlight();
}

// Toggle Table of Contents dropdown
function toggleTOC() {
    const dropdown = document.getElementById('tocDropdown');
    const button = document.getElementById('tocButton');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('open');
    } else {
        dropdown.classList.add('show');
        button.classList.add('open');
        updateTOCHighlight();
    }
}

// Close TOC when clicking outside
document.addEventListener('click', function(event) {
    const tocContainer = document.querySelector('.toc-container');
    if (!tocContainer.contains(event.target)) {
        const dropdown = document.getElementById('tocDropdown');
        const button = document.getElementById('tocButton');
        dropdown.classList.remove('show');
        button.classList.remove('open');
    }
});

// Update TOC highlight
function updateTOCHighlight() {
    const tocItems = document.querySelectorAll('.toc-item');
    tocItems.forEach((item, index) => {
        if (index + 1 === currentPage) {
            item.classList.add('current');
        } else {
            item.classList.remove('current');
        }
    });
}

// Go to specific page
function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage || isTransitioning) {
        return;
    }
    
    const direction = pageNumber > currentPage ? 'next' : 'prev';
    currentPage = pageNumber;
    updatePageInfo();
    updateNavigationButtons();
    updateTOCHighlight();
    loadCurrentPage(direction);
    
    // Close TOC dropdown
    const dropdown = document.getElementById('tocDropdown');
    const button = document.getElementById('tocButton');
    dropdown.classList.remove('show');
    button.classList.remove('open');
    
    console.log('Jumped to page:', currentPage);
}

// Setup dual image container for smooth transitions
function setupImageContainer() {
    const imageWrapper = document.getElementById('image-wrapper');
    
    // Create two image elements for smooth transitions
    imageWrapper.innerHTML = `
        <img id="handbook-image-current" class="handbook-image active" src="" alt="">
        <img id="handbook-image-next" class="handbook-image" src="" alt="">
        <div id="loading" class="loading">Loading...</div>
        <div id="error" class="error" style="display: none;">
            <h3>Image not found</h3>
            <p>Please check that the image file exists</p>
        </div>
    `;
}

// Load current page image with smooth transition
function loadCurrentPage(direction = 'none') {
    if (isTransitioning) return;
    
    const currentImg = document.getElementById('handbook-image-current');
    const nextImg = document.getElementById('handbook-image-next');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    // If this is the initial load, just load normally
    if (direction === 'none') {
        loading.classList.add('show');
        error.style.display = 'none';
        
        const newImage = new Image();
        newImage.onload = function() {
            currentImg.src = newImage.src;
            currentImg.alt = `Handbook Page ${currentPage}`;
            loading.classList.remove('show');
            resetView();
            console.log(`Page ${currentPage} loaded initially`);
        };
        
        newImage.onerror = function() {
            loading.classList.remove('show');
            error.style.display = 'block';
            console.error(`Failed to load page ${currentPage}`);
        };
        
        newImage.src = pageUrls[currentPage - 1];
        return;
    }
    
    // Smooth transition for next/previous
    isTransitioning = true;
    
    // Show loading briefly
    loading.classList.add('show');
    error.style.display = 'none';
    
    // Preload the new image
    const newImage = new Image();
    
    newImage.onload = function() {
        // Hide loading
        loading.classList.remove('show');
        
        // Set up the next image
        nextImg.src = newImage.src;
        nextImg.alt = `Handbook Page ${currentPage}`;
        
        // Reset any existing transforms and position the next image off-screen
        nextImg.style.transition = 'none'; // Disable transition for positioning
        if (direction === 'next') {
            // Start from right side
            nextImg.style.transform = 'translate(50%, -50%)';
        } else {
            // Start from left side  
            nextImg.style.transform = 'translate(-150%, -50%)';
        }
        
        nextImg.classList.add('active');
        
        // Force a reflow before starting animation
        nextImg.offsetHeight;
        
        // Re-enable transitions
        nextImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
        
        // Start the slide animation after a small delay
        setTimeout(() => {
            // Slide current image out
            if (direction === 'next') {
                currentImg.style.transform = 'translate(-150%, -50%)';
            } else {
                currentImg.style.transform = 'translate(50%, -50%)';
            }
            
            // Slide next image to center
            nextImg.style.transform = 'translate(-50%, -50%)';
            
            // After animation completes, clean up
            setTimeout(() => {
                // Swap the image references and reset positions
                currentImg.src = nextImg.src;
                currentImg.alt = nextImg.alt;
                currentImg.style.transition = 'none';
                currentImg.style.transform = 'translate(-50%, -50%)';
                
                // Clean up next image
                nextImg.src = '';
                nextImg.style.transition = 'none';
                nextImg.style.transform = 'translate(50%, -50%)';
                nextImg.classList.remove('active');
                
                // Re-enable transitions for current image
                setTimeout(() => {
                    currentImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
                }, 50);
                
                // Reset zoom and position for new page
                resetView();
                isTransitioning = false;
                
                console.log(`Page ${currentPage} loaded with ${direction} transition`);
            }, 350); // Match CSS transition duration
            
        }, 50); // Small delay to ensure DOM update
    };
    
    newImage.onerror = function() {
        loading.classList.remove('show');
        error.style.display = 'block';
        isTransitioning = false;
        console.error(`Failed to load page ${currentPage}`);
    };
    
    // Start loading
    newImage.src = pageUrls[currentPage - 1];
}

// Navigation functions
function nextPage() {
    if (currentPage < totalPages && !isTransitioning) {
        currentPage++;
        updatePageInfo();
        updateNavigationButtons();
        updateTOCHighlight();
        loadCurrentPage('next');
        console.log('Next page:', currentPage);
    }
}

function previousPage() {
    if (currentPage > 1 && !isTransitioning) {
        currentPage--;
        updatePageInfo();
        updateNavigationButtons();
        updateTOCHighlight();
        loadCurrentPage('prev');
        console.log('Previous page:', currentPage);
    }
}

// Zoom functions
function zoomIn() {
    if (!isTransitioning) {
        zoomLevel = Math.min(zoomLevel * 1.5, 10); // Max 10x zoom
        applyZoom();
        console.log('Zoom in to:', zoomLevel);
    }
}

function zoomOut() {
    if (!isTransitioning) {
        zoomLevel = Math.max(zoomLevel / 1.5, 0.1); // Min 0.1x zoom
        applyZoom();
        console.log('Zoom out to:', zoomLevel);
    }
}

function fitToScreen() {
    if (!isTransitioning) {
        zoomLevel = 1;
        imageOffset = { x: 0, y: 0 };
        applyZoom();
        console.log('Fit to screen');
    }
}

// Apply zoom and positioning
function applyZoom() {
    const imageWrapper = document.getElementById('image-wrapper');
    
    // Apply transform to the wrapper, not individual images
    const transform = `scale(${zoomLevel}) translate(${imageOffset.x}px, ${imageOffset.y}px)`;
    imageWrapper.style.transform = transform;
    
    // Update body class for zoom state
    if (zoomLevel > 1) {
        document.body.classList.add('zoomed');
    } else {
        document.body.classList.remove('zoomed');
        imageOffset = { x: 0, y: 0 }; // Reset offset when not zoomed
    }
    
    console.log('Applied zoom:', zoomLevel, 'offset:', imageOffset);
}

// Reset view (called when loading new page)
function resetView() {
    zoomLevel = 1;
    imageOffset = { x: 0, y: 0 };
    applyZoom();
}

// Calculate distance between two touch points (for pinch gesture)
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Get center point between two touches
function getTouchCenter(touch1, touch2) {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}

// Handle touch start for gestures
function handleTouchStart(e) {
    const touches = e.touches;
    touchStartTime = Date.now();
    
    if (touches.length === 1) {
        // Single touch - potential swipe or drag
        touchStartX = touches[0].clientX;
        touchStartY = touches[0].clientY;
        
        // Start dragging if zoomed
        if (zoomLevel > 1 && !isTransitioning) {
            isDragging = true;
            startPosition.x = touches[0].clientX - imageOffset.x;
            startPosition.y = touches[0].clientY - imageOffset.y;
        }
    } else if (touches.length === 2) {
        // Two touches - pinch gesture
        isPinching = true;
        isDragging = false;
        initialPinchDistance = getDistance(touches[0], touches[1]);
        initialZoomLevel = zoomLevel;
        
        // Store initial touch center for zoom origin
        const center = getTouchCenter(touches[0], touches[1]);
        startPosition.x = center.x;
        startPosition.y = center.y;
    }
    
    e.preventDefault();
}

// Handle touch move for gestures
function handleTouchMove(e) {
    const touches = e.touches;
    
    if (touches.length === 1 && isDragging && zoomLevel > 1 && !isTransitioning) {
        // Single touch drag when zoomed
        imageOffset.x = touches[0].clientX - startPosition.x;
        imageOffset.y = touches[0].clientY - startPosition.y;
        
        // Limit drag to reasonable bounds
        const maxOffset = 1000;
        imageOffset.x = Math.max(-maxOffset, Math.min(maxOffset, imageOffset.x));
        imageOffset.y = Math.max(-maxOffset, Math.min(maxOffset, imageOffset.y));
        
        applyZoom();
    } else if (touches.length === 2 && isPinching && !isTransitioning) {
        // Two touch pinch gesture
        const currentDistance = getDistance(touches[0], touches[1]);
        const scale = currentDistance / initialPinchDistance;
        
        // Calculate new zoom level
        const newZoomLevel = Math.max(0.5, Math.min(10, initialZoomLevel * scale));
        zoomLevel = newZoomLevel;
        
        applyZoom();
    }
    
    e.preventDefault();
}

// Handle touch end for gestures
function handleTouchEnd(e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    
    if (e.changedTouches.length === 1 && !isPinching && touchDuration < swipeTimeThreshold) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Check if this is a horizontal swipe (and not just a tap or vertical scroll)
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY && zoomLevel <= 1) {
            if (deltaX > 0) {
                // Swipe right - go to previous page
                previousPage();
            } else {
                // Swipe left - go to next page
                nextPage();
            }
        }
    }
    
    // Reset gesture states
    isDragging = false;
    isPinching = false;
    
    // If zoom is very small, reset to fit screen
    if (zoomLevel < 0.8) {
        fitToScreen();
    }
}

// Add event listeners
function addEventListeners() {
    const imageWrapper = document.getElementById('image-wrapper');
    const container = document.getElementById('viewer-container');
    
    // Mouse events for dragging (desktop)
    imageWrapper.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Enhanced touch events for mobile gestures
    imageWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse wheel for zoom
    container.addEventListener('wheel', handleWheel);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Double-click/tap to zoom
    imageWrapper.addEventListener('dblclick', function(e) {
        e.preventDefault();
        if (zoomLevel === 1) {
            zoomIn();
        } else {
            fitToScreen();
        }
    });
    
    // Prevent context menu on right-click
    imageWrapper.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Prevent default touch behaviors to avoid scrolling issues
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('#image-wrapper')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('#image-wrapper')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Original drag functions for mouse (desktop)
function startDrag(e) {
    if (zoomLevel > 1 && !isTransitioning) {
        isDragging = true;
        startPosition.x = e.clientX - imageOffset.x;
        startPosition.y = e.clientY - imageOffset.y;
        e.preventDefault();
    }
}

function drag(e) {
    if (isDragging && zoomLevel > 1 && !isTransitioning) {
        imageOffset.x = e.clientX - startPosition.x;
        imageOffset.y = e.clientY - startPosition.y;
        
        // Limit drag to reasonable bounds
        const maxOffset = 1000;
        imageOffset.x = Math.max(-maxOffset, Math.min(maxOffset, imageOffset.x));
        imageOffset.y = Math.max(-maxOffset, Math.min(maxOffset, imageOffset.y));
        
        applyZoom();
        e.preventDefault();
    }
}

function endDrag() {
    isDragging = false;
}

// Mouse wheel zoom
function handleWheel(e) {
    if (!isTransitioning) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }
}

// Keyboard navigation
function handleKeyboard(e) {
    if (isTransitioning) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousPage();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextPage();
            break;
        case 'Home':
            e.preventDefault();
            goToPage(1);
            break;
        case 'End':
            e.preventDefault();
            goToPage(totalPages);
            break;
        case '+':
        case '=':
            e.preventDefault();
            zoomIn();
            break;
        case '-':
            e.preventDefault();
            zoomOut();
            break;
        case '0':
            e.preventDefault();
            fitToScreen();
            break;
        case 'Escape':
            e.preventDefault();
            fitToScreen();
            // Also close TOC if open
            const dropdown = document.getElementById('tocDropdown');
            const button = document.getElementById('tocButton');
            dropdown.classList.remove('show');
            button.classList.remove('open');
            break;
    }
}

// Update page info display
function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Update navigation button states
function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentPage === 1 || isTransitioning;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || isTransitioning;
}

// Handle window resize
window.addEventListener('resize', function() {
    // Reset zoom on resize to ensure proper fitting
    setTimeout(() => {
        if (zoomLevel === 1) {
            resetView();
        }
    }, 100);
});
