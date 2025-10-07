// Handbook Viewer - Version 1.0
// WMO Arts & Science College

// Global State
let currentPage = 1;
const totalPages = 182;
let zoomLevel = 1;
let isDragging = false;
let startPosition = { x: 0, y: 0 };
let imageOffset = { x: 0, y: 0 };
let isTransitioning = false;

// Mobile Gesture Variables
let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let initialPinchDistance = 0;
let initialZoomLevel = 1;
let isPinching = false;
const swipeThreshold = 50;
const swipeTimeThreshold = 300;

// Table of Contents Data
const tableOfContents = [
    { title: "Cover", page: "i", isMajor: false },
    { title: "--", page: "ii", isMajor: false },
    { title: "College Prayer", page: "iii", isMajor: false },
    { title: "Student Profile", page: "iv", isMajor: false },
    { title: "Pledge", page: "v", isMajor: false },
    { title: "Tribute", page: "vi", isMajor: false },
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

// Generate Page File Mapping
function generatePageFileMapping() {
    const mapping = [];
    for (let i = 1; i <= 10; i++) mapping.push(`images/front${i}.jpg`);
    for (let i = 1; i <= 172; i++) mapping.push(`images/page${i}.jpg`);
    return mapping;
}

const pageFileMapping = generatePageFileMapping();

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    setupImageContainer();
    setupTableOfContents();
    loadCurrentPage();
    updatePageInfo();
    updateNavigationButtons();
    addEventListeners();
    setupModalEventHandlers();
});

// Setup Modal Event Handlers
function setupModalEventHandlers() {
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('tocModal');
        const modalContent = document.querySelector('.toc-modal-content');
        
        if (modal && modal.classList.contains('show') && 
            !modalContent.contains(event.target) && 
            event.target === modal) {
            closeTOCModal();
        }
    });
}

// Setup Table of Contents
function setupTableOfContents() {
    const tocModalBody = document.getElementById('tocModalBody');
    if (!tocModalBody) return;
    
    tocModalBody.innerHTML = '';
    
    tableOfContents.forEach((item) => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';
        if (item.isMajor) tocItem.classList.add('major-section');
        
        tocItem.textContent = item.title;
        tocItem.onclick = () => {
            goToPageByNumber(item.page);
            closeTOCModal();
        };
        tocModalBody.appendChild(tocItem);
    });
    
    updateTOCHighlight();
}

// Toggle TOC Modal
function toggleTOCModal() {
    const modal = document.getElementById('tocModal');
    modal.classList.contains('show') ? closeTOCModal() : openTOCModal();
}

// Open TOC Modal
function openTOCModal() {
    const modal = document.getElementById('tocModal');
    if (!modal) return;
    
    modal.classList.add('show');
    modal.style.display = 'flex';
    updateTOCHighlight();
    document.body.style.overflow = 'hidden';
}

// Close TOC Modal
function closeTOCModal() {
    const modal = document.getElementById('tocModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
    document.body.style.overflow = '';
}

// Update TOC Highlight
function updateTOCHighlight() {
    const tocItems = document.querySelectorAll('.toc-item');
    const currentPageNumber = getCurrentPageNumber();
    
    tocItems.forEach((item, index) => {
        const tocItem = tableOfContents[index];
        item.classList.toggle('current', tocItem && tocItem.page === currentPageNumber);
    });
}

// Navigate to Page by Number
function goToPageByNumber(pageNumber) {
    let targetIndex;
    
    if (typeof pageNumber === 'string' && pageNumber.match(/^[ivxlc]+$/i)) {
        const romanToIndex = {
            'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
            'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10
        };
        targetIndex = romanToIndex[pageNumber.toLowerCase()];
    } else {
        targetIndex = parseInt(pageNumber) + 10;
    }
    
    if (targetIndex && targetIndex >= 1 && targetIndex <= totalPages && targetIndex !== currentPage && !isTransitioning) {
        const direction = targetIndex > currentPage ? 'next' : 'prev';
        currentPage = targetIndex;
        updatePageInfo();
        updateNavigationButtons();
        updateTOCHighlight();
        loadCurrentPage(direction);
    }
}

// Get Current Page Number (Roman or Arabic)
function getCurrentPageNumber() {
    if (currentPage <= 10) {
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
        return romanNumerals[currentPage - 1];
    }
    return (currentPage - 10).toString();
}

// Setup Image Container
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

// Load Current Page with Transition
function loadCurrentPage(direction = 'none') {
    if (isTransitioning) return;
    
    const currentImg = document.getElementById('handbook-image-current');
    const nextImg = document.getElementById('handbook-image-next');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const imageUrl = pageFileMapping[currentPage - 1];
    
    // Initial load without transition
    if (direction === 'none') {
        loading.classList.add('show');
        error.style.display = 'none';
        
        const newImage = new Image();
        newImage.onload = function() {
            currentImg.src = newImage.src;
            currentImg.alt = `Handbook Page ${getCurrentPageNumber()}`;
            loading.classList.remove('show');
            resetView();
        };
        
        newImage.onerror = function() {
            loading.classList.remove('show');
            error.style.display = 'block';
        };
        
        newImage.src = imageUrl;
        return;
    }
    
    // Load with smooth transition
    isTransitioning = true;
    loading.classList.add('show');
    error.style.display = 'none';
    
    const newImage = new Image();
    
    newImage.onload = function() {
        loading.classList.remove('show');
        
        nextImg.src = newImage.src;
        nextImg.alt = `Handbook Page ${getCurrentPageNumber()}`;
        
        nextImg.style.transition = 'none';
        nextImg.style.transform = direction === 'next' ? 'translate(50%, -50%)' : 'translate(-150%, -50%)';
        nextImg.classList.add('active');
        nextImg.offsetHeight;
        nextImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
        
        setTimeout(() => {
            currentImg.style.transform = direction === 'next' ? 'translate(-150%, -50%)' : 'translate(50%, -50%)';
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
            }, 350);
        }, 50);
    };
    
    newImage.onerror = function() {
        loading.classList.remove('show');
        error.style.display = 'block';
        isTransitioning = false;
    };
    
    newImage.src = imageUrl;
}

// Navigation Functions
function nextPage() {
    if (currentPage < totalPages && !isTransitioning) {
        currentPage++;
        updatePageInfo();
        updateNavigationButtons();
        updateTOCHighlight();
        loadCurrentPage('next');
    }
}

function previousPage() {
    if (currentPage > 1 && !isTransitioning) {
        currentPage--;
        updatePageInfo();
        updateNavigationButtons();
        updateTOCHighlight();
        loadCurrentPage('prev');
    }
}

// Zoom Functions
function zoomIn() {
    if (!isTransitioning) {
        zoomLevel = Math.min(zoomLevel * 1.5, 10);
        applyZoom();
    }
}

function zoomOut() {
    if (!isTransitioning) {
        zoomLevel = Math.max(zoomLevel / 1.5, 0.1);
        applyZoom();
    }
}

function fitToScreen() {
    if (!isTransitioning) {
        zoomLevel = 1;
        imageOffset = { x: 0, y: 0 };
        applyZoom();
    }
}

function applyZoom() {
    const imageWrapper = document.getElementById('image-wrapper');
    imageWrapper.style.transform = `scale(${zoomLevel}) translate(${imageOffset.x}px, ${imageOffset.y}px)`;
    
    if (zoomLevel > 1) {
        document.body.classList.add('zoomed');
    } else {
        document.body.classList.remove('zoomed');
        imageOffset = { x: 0, y: 0 };
    }
}

function resetView() {
    zoomLevel = 1;
    imageOffset = { x: 0, y: 0 };
    applyZoom();
}

// Mobile Gesture Helpers
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

// Touch Event Handlers
function handleTouchStart(e) {
    if (e.target.closest('.toc-modal')) return;
    
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
    if (e.target.closest('.toc-modal')) return;
    
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
        zoomLevel = Math.max(0.5, Math.min(10, initialZoomLevel * scale));
        applyZoom();
    }
    
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (e.changedTouches[0] && 
        document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        ?.closest('.toc-modal')) {
        return;
    }
    
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
            deltaX > 0 ? previousPage() : nextPage();
        }
    }
    
    isDragging = false;
    isPinching = false;
    
    if (zoomLevel < 0.8) fitToScreen();
}

// Mouse Event Handlers
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
        e.deltaY < 0 ? zoomIn() : zoomOut();
    }
}

// Keyboard Navigation
function handleKeyboard(e) {
    if (isTransitioning) return;
    
    if (e.key === 'Escape') {
        const modal = document.getElementById('tocModal');
        if (modal && modal.classList.contains('show')) {
            closeTOCModal();
            return;
        }
        fitToScreen();
        return;
    }
    
    const actions = {
        'ArrowLeft': previousPage,
        'ArrowRight': nextPage,
        'Home': () => goToPage(1),
        'End': () => goToPage(totalPages),
        '+': zoomIn,
        '=': zoomIn,
        '-': zoomOut,
        '0': fitToScreen
    };
    
    if (actions[e.key]) {
        e.preventDefault();
        actions[e.key]();
    }
}

// Add All Event Listeners
function addEventListeners() {
    const imageWrapper = document.getElementById('image-wrapper');
    const container = document.getElementById('viewer-container');
    
    // Mouse events
    imageWrapper.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events
    imageWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Other events
    container.addEventListener('wheel', handleWheel);
    document.addEventListener('keydown', handleKeyboard);
    
    imageWrapper.addEventListener('dblclick', function(e) {
        e.preventDefault();
        zoomLevel === 1 ? zoomIn() : fitToScreen();
    });
    
    imageWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Update UI Elements
function updatePageInfo() {
    const pageDisplay = getCurrentPageNumber();
    document.getElementById('pageInfo').textContent = `Page ${pageDisplay} of ${totalPages}`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1 || isTransitioning;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || isTransitioning;
}

// Handle Window Resize
window.addEventListener('resize', function() {
    setTimeout(() => {
        if (zoomLevel === 1) resetView();
    }, 100);
});
