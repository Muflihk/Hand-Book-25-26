// Simple Image Viewer with Smooth Sliding Transitions, Table of Contents, and Mobile Gestures
let currentPage = 1;
const totalPages = 182; // 10 front pages + 172 main pages
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
let swipeThreshold = 50;
let swipeTimeThreshold = 300;

// Complete Table of Contents based on your handbook (pages 1-172)
const tableOfContents = [
    // Front pages (Roman numerals)
    { title: "Cover", page: "i", isMajor: false },
    { title: "--", page: "ii", isMajor: false },
    { title: "College Prayer", page: "iii", isMajor: false },
    { title: "Student Profile", page: "iv", isMajor: false },
    { title: "Pledge", page: "v", isMajor: false },
    { title: "Tribute", page: "vi", isMajor: false },
    { title: "Contents", page: "vii", isMajor: false },
    { title: "Contents", page: "viii", isMajor: false },
    { title: "Contents", page: "ix", isMajor: false },
    { title: "--", page: "x", isMajor: false },
    
    // Main content (Arabic numerals) - Major sections marked
    { title: "1. College Profile", page: "1", isMajor: true },
    { title: "1.1 About WMO", page: "1", isMajor: false },
    { title: "1.2 About the college", page: "2", isMajor: false },
    { title: "1.3 Managing Committee", page: "4", isMajor: false },
    { title: "1.4 Growth and Expansion", page: "5", isMajor: false },
    { title: "1.5 Major Achievements", page: "6", isMajor: false },
    
    { title: "2. Academic Programs", page: "6", isMajor: true },
    { title: "2.1 Department of Arabic", page: "7", isMajor: false },
    { title: "2.2 Department of Chemistry", page: "15", isMajor: false },
    { title: "2.3 Department of Commerce", page: "20", isMajor: false },
    { title: "2.4 Department of Commerce CA", page: "28", isMajor: false },
    { title: "2.5 Department of Computer Science", page: "33", isMajor: false },
    { title: "2.6 Department of Economics", page: "39", isMajor: false },
    { title: "2.7 Department of Electronics", page: "44", isMajor: false },
    { title: "2.8 Department of English", page: "52", isMajor: false },
    { title: "2.9 Department of Mass Communication", page: "61", isMajor: false },
    { title: "2.10 Department of Mathematics", page: "66", isMajor: false },
    { title: "2.11 Department of Physics", page: "73", isMajor: false },
    { title: "2.12 Department of Social Work", page: "81", isMajor: false },
    { title: "2.13 Department of Hindi", page: "86", isMajor: false },
    { title: "2.14 Department of Malayalam", page: "90", isMajor: false },
    { title: "2.15 Department of Physical Education", page: "92", isMajor: false },
    
    { title: "3. Academic Support", page: "94", isMajor: true },
    { title: "3.1 Library", page: "95", isMajor: false },
    { title: "3.2 Administrative Staff", page: "96", isMajor: false },
    { title: "3.3 Examination Cell", page: "98", isMajor: false },
    { title: "3.4 Digital Infrastructure", page: "99", isMajor: false },
    
    { title: "4. Institutional Innovation and Development", page: "101", isMajor: true },
    { title: "4.1 Institution Innovation Council", page: "101", isMajor: false },
    { title: "4.2 IEDC", page: "101", isMajor: false },
    { title: "4.3 YIP", page: "101", isMajor: false },
    { title: "4.4 IETE Student Forum", page: "102", isMajor: false },
    
    { title: "5. Governing Bodies and Committees", page: "103", isMajor: true },
    { title: "5.1 College Council", page: "103", isMajor: false },
    { title: "5.2 Internal Quality Assurance Cell (IQAC)", page: "103", isMajor: false },
    { title: "5.3 Discipline Committee", page: "104", isMajor: false },
    { title: "5.4 Parent-Teacher Association (PTA)", page: "105", isMajor: false },
    { title: "5.5 Exam Monitoring Cell", page: "105", isMajor: false },
    { title: "5.6 Outcome Assessment Council", page: "106", isMajor: false },
    
    { title: "6. Student Life", page: "107", isMajor: true },
    { title: "6.1 College Union", page: "107", isMajor: false },
    { title: "6.2 Service and Outreach Units", page: "107", isMajor: false },
    { title: "6.3 Coaching & Support Programmes", page: "109", isMajor: false },
    { title: "6.4 Student Associations", page: "111", isMajor: false },
    { title: "6.5 Cells", page: "112", isMajor: false },
    { title: "6.6 Clubs", page: "115", isMajor: false },
    { title: "6.7 Forums", page: "117", isMajor: false },
    
    { title: "7. Publications and Media", page: "120", isMajor: true },
    { title: "7.1 Publications Division", page: "120", isMajor: false },
    { title: "7.2 PR and Media Cell", page: "120", isMajor: false },
    
    { title: "8. Essential Services", page: "121", isMajor: true },
    { title: "8.1 Academic Infrastructure", page: "121", isMajor: false },
    { title: "8.2 Sports and Recreation", page: "122", isMajor: false },
    { title: "8.3 Residential and Daily Life Services", page: "123", isMajor: false },
    { title: "8.4 Support and Accessibility Services", page: "124", isMajor: false },
    
    { title: "9. Rules, Regulations and Code of Conduct", page: "126", isMajor: true },
    { title: "9.1 General Discipline", page: "126", isMajor: false },
    { title: "9.2 Attendance Rules", page: "129", isMajor: false },
    { title: "9.3 Identity Card", page: "129", isMajor: false },
    { title: "9.4 Library Rules", page: "130", isMajor: false },
    { title: "9.5 Grievance Redressal Mechanism", page: "131", isMajor: false },
    
    { title: "10. Others", page: "132", isMajor: true },
    { title: "10.1 Fee Structure", page: "132", isMajor: false },
    { title: "10.2 Responsibility Assignment", page: "135", isMajor: false },
    { title: "10.3 Academic Schedule", page: "146", isMajor: false },
    { title: "10.4 Important Contact Numbers", page: "160", isMajor: false },
    { title: "10.5 Time Table", page: "163", isMajor: false }
];

// Generate page file mapping for all 182 pages
function generatePageFileMapping() {
    const mapping = [];
    
    // Front pages (1-10): front1.jpg to front10.jpg
    for (let i = 1; i <= 10; i++) {
        mapping.push(`images/front${i}.jpg`);
    }
    
    // Main pages (11-182): page1.jpg to page172.jpg
    for (let i = 1; i <= 172; i++) {
        mapping.push(`images/page${i}.jpg`);
    }
    
    return mapping;
}

const pageFileMapping = generatePageFileMapping();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Simple Image Viewer...');
    setupImageContainer();
    setupTableOfContents();
    loadCurrentPage();
    updatePageInfo();
    updateNavigationButtons();
    addEventListeners();
    setupDropdownCloseHandlers(); // Add this new function call
});

// Setup enhanced dropdown closing handlers
function setupDropdownCloseHandlers() {
    // Close TOC when clicking outside - improved version
    document.addEventListener('click', function(event) {
        const tocContainer = document.querySelector('.toc-container');
        const dropdown = document.getElementById('tocDropdown');
        const button = document.getElementById('tocButton');
        
        // Check if dropdown is open and click is outside the TOC container
        if (dropdown && dropdown.classList.contains('show') && !tocContainer.contains(event.target)) {
            dropdown.classList.remove('show');
            button.classList.remove('open');
        }
    });

    // Also close TOC when clicking on the main viewer area
    const viewerContainer = document.getElementById('viewer-container');
    if (viewerContainer) {
        viewerContainer.addEventListener('click', function(event) {
            const dropdown = document.getElementById('tocDropdown');
            const button = document.getElementById('tocButton');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                button.classList.remove('open');
            }
        });
    }

    // Close TOC when clicking on header area
    const header = document.querySelector('.header');
    if (header) {
        header.addEventListener('click', function(event) {
            const dropdown = document.getElementById('tocDropdown');
            const button = document.getElementById('tocButton');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                button.classList.remove('open');
            }
        });
    }
}

// Setup Table of Contents with major section styling
function setupTableOfContents() {
    const tocDropdown = document.getElementById('tocDropdown');
    tocDropdown.innerHTML = '';
    
    tableOfContents.forEach((item, index) => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';
        
        // Add major-section class for bold styling
        if (item.isMajor) {
            tocItem.classList.add('major-section');
        }
        
        tocItem.textContent = item.title;
        tocItem.onclick = () => goToPageByNumber(item.page);
        tocDropdown.appendChild(tocItem);
    });
    
    updateTOCHighlight();
}

// Go to page by page number (handles both roman and arabic numerals)
function goToPageByNumber(pageNumber) {
    let targetIndex;
    
    if (typeof pageNumber === 'string' && pageNumber.match(/^[ivxlc]+$/i)) {
        // Roman numeral - convert to index
        const romanToIndex = {
            'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
            'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10
        };
        targetIndex = romanToIndex[pageNumber.toLowerCase()];
    } else {
        // Arabic numeral - add 10 for front pages offset
        targetIndex = parseInt(pageNumber) + 10;
    }
    
    if (targetIndex && targetIndex >= 1 && targetIndex <= totalPages && targetIndex !== currentPage && !isTransitioning) {
        const direction = targetIndex > currentPage ? 'next' : 'prev';
        currentPage = targetIndex;
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

// Update TOC highlight with proper major section styling
function updateTOCHighlight() {
    const tocItems = document.querySelectorAll('.toc-item');
    const currentPageNumber = getCurrentPageNumber();
    
    tocItems.forEach((item, index) => {
        const tocItem = tableOfContents[index];
        if (tocItem && tocItem.page === currentPageNumber) {
            item.classList.add('current');
        } else {
            item.classList.remove('current');
        }
    });
}

// Get current page number (roman for front pages, arabic for main)
function getCurrentPageNumber() {
    if (currentPage <= 10) {
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
        return romanNumerals[currentPage - 1];
    } else {
        return (currentPage - 10).toString();
    }
}

// Go to specific page (by index)
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
    
    console.log('Jumped to page:', currentPage);
}

// Setup dual image container for smooth transitions
function setupImageContainer() {
    const imageWrapper = document.getElementById('image-wrapper');
    
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
    
    const imageUrl = pageFileMapping[currentPage - 1];
    
    if (direction === 'none') {
        loading.classList.add('show');
        error.style.display = 'none';
        
        const newImage = new Image();
        newImage.onload = function() {
            currentImg.src = newImage.src;
            currentImg.alt = `Handbook Page ${getCurrentPageNumber()}`;
            loading.classList.remove('show');
            resetView();
            console.log(`Page ${currentPage} loaded initially`);
        };
        
        newImage.onerror = function() {
            loading.classList.remove('show');
            error.style.display = 'block';
            console.error(`Failed to load page ${currentPage}: ${imageUrl}`);
        };
        
        newImage.src = imageUrl;
        return;
    }
    
    isTransitioning = true;
    loading.classList.add('show');
    error.style.display = 'none';
    
    const newImage = new Image();
    
    newImage.onload = function() {
        loading.classList.remove('show');
        
        nextImg.src = newImage.src;
        nextImg.alt = `Handbook Page ${getCurrentPageNumber()}`;
        
        nextImg.style.transition = 'none';
        if (direction === 'next') {
            nextImg.style.transform = 'translate(50%, -50%)';
        } else {
            nextImg.style.transform = 'translate(-150%, -50%)';
        }
        
        nextImg.classList.add('active');
        nextImg.offsetHeight;
        nextImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
        
        setTimeout(() => {
            if (direction === 'next') {
                currentImg.style.transform = 'translate(-150%, -50%)';
            } else {
                currentImg.style.transform = 'translate(50%, -50%)';
            }
            nextImg.style.transform = 'translate(-50%, -50%)';
            
            setTimeout(() => {
                currentImg.src = nextImg.src;
                currentImg.alt = nextImg.alt;
                currentImg.style.transition = 'none';
                currentImg.style.transform = 'translate(-50%, -50%)';
                
                nextImg.src = '';
                nextImg.style.transition = 'none';
                nextImg.style.transform = 'translate(50%, -50%)';
                nextImg.classList.remove('active');
                
                setTimeout(() => {
                    currentImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
                }, 50);
                
                resetView();
                isTransitioning = false;
                console.log(`Page ${currentPage} loaded with ${direction} transition`);
            }, 350);
        }, 50);
    };
    
    newImage.onerror = function() {
        loading.classList.remove('show');
        error.style.display = 'block';
        isTransitioning = false;
        console.error(`Failed to load page ${currentPage}: ${imageUrl}`);
    };
    
    newImage.src = imageUrl;
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
        zoomLevel = Math.min(zoomLevel * 1.5, 10);
        applyZoom();
        console.log('Zoom in to:', zoomLevel);
    }
}

function zoomOut() {
    if (!isTransitioning) {
        zoomLevel = Math.max(zoomLevel / 1.5, 0.1);
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
    const transform = `scale(${zoomLevel}) translate(${imageOffset.x}px, ${imageOffset.y}px)`;
    imageWrapper.style.transform = transform;
    
    if (zoomLevel > 1) {
        document.body.classList.add('zoomed');
    } else {
        document.body.classList.remove('zoomed');
        imageOffset = { x: 0, y: 0 };
    }
}

// Reset view
function resetView() {
    zoomLevel = 1;
    imageOffset = { x: 0, y: 0 };
    applyZoom();
}

// Mobile gesture functions
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(touch1, touch2) {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}

function handleTouchStart(e) {
    const touches = e.touches;
    touchStartTime = Date.now();
    
    if (touches.length === 1) {
        touchStartX = touches[0].clientX;
        touchStartY = touches[0].clientY;
        
        if (zoomLevel > 1 && !isTransitioning) {
            isDragging = true;
            startPosition.x = touches[0].clientX - imageOffset.x;
            startPosition.y = touches[0].clientY - imageOffset.y;
        }
    } else if (touches.length === 2) {
        isPinching = true;
        isDragging = false;
        initialPinchDistance = getDistance(touches[0], touches[1]);
        initialZoomLevel = zoomLevel;
        
        const center = getTouchCenter(touches[0], touches[1]);
        startPosition.x = center.x;
        startPosition.y = center.y;
    }
    
    e.preventDefault();
}

function handleTouchMove(e) {
    const touches = e.touches;
    
    if (touches.length === 1 && isDragging && zoomLevel > 1 && !isTransitioning) {
        imageOffset.x = touches[0].clientX - startPosition.x;
        imageOffset.y = touches[0].clientY - startPosition.y;
        
        const maxOffset = 1000;
        imageOffset.x = Math.max(-maxOffset, Math.min(maxOffset, imageOffset.x));
        imageOffset.y = Math.max(-maxOffset, Math.min(maxOffset, imageOffset.y));
        
        applyZoom();
    } else if (touches.length === 2 && isPinching && !isTransitioning) {
        const currentDistance = getDistance(touches[0], touches[1]);
        const scale = currentDistance / initialPinchDistance;
        
        const newZoomLevel = Math.max(0.5, Math.min(10, initialZoomLevel * scale));
        zoomLevel = newZoomLevel;
        
        applyZoom();
    }
    
    e.preventDefault();
}

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
        
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY && zoomLevel <= 1) {
            if (deltaX > 0) {
                previousPage();
            } else {
                nextPage();
            }
        }
    }
    
    isDragging = false;
    isPinching = false;
    
    if (zoomLevel < 0.8) {
        fitToScreen();
    }
}

// Add event listeners
function addEventListeners() {
    const imageWrapper = document.getElementById('image-wrapper');
    const container = document.getElementById('viewer-container');
    
    imageWrapper.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    imageWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    container.addEventListener('wheel', handleWheel);
    document.addEventListener('keydown', handleKeyboard);
    
    imageWrapper.addEventListener('dblclick', function(e) {
        e.preventDefault();
        if (zoomLevel === 1) {
            zoomIn();
        } else {
            fitToScreen();
        }
    });
    
    imageWrapper.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
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

// Mouse drag functions
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
            const dropdown = document.getElementById('tocDropdown');
            const button = document.getElementById('tocButton');
            dropdown.classList.remove('show');
            button.classList.remove('open');
            break;
    }
}

function updatePageInfo() {
    const pageDisplay = getCurrentPageNumber();
    document.getElementById('pageInfo').textContent = `Page ${pageDisplay} of ${totalPages}`;
}

function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentPage === 1 || isTransitioning;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || isTransitioning;
}

window.addEventListener('resize', function() {
    setTimeout(() => {
        if (zoomLevel === 1) {
            resetView();
        }
    }, 100);
});
