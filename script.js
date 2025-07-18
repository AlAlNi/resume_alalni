// Basic Configuration
const totalFrames = 33;
const baseUrl = 'https://raw.githubusercontent.com/AlAlNi/resume_alalni/main/sec/Comp_';
const fileExtension = '.png';

// DOM Elements
const frameElement = document.getElementById('frame');
const loadingContainer = document.getElementById('loading-container');
const scrollbar = document.getElementById('scrollbar');
const scrollbarThumb = document.getElementById('scrollbar-thumb');

// State
let currentFrame = 0;
let frames = new Array(totalFrames);
let isDragging = false;

// Basic Frame Loading
function loadFrame(index, callback) {
    if (frames[index]) {
        if (callback) callback();
        return;
    }
    
    const frameNumber = String(index).padStart(5, '0');
    const img = new Image();
    
    img.onload = function() {
        frames[index] = img;
        if (index === 0) {
            showFirstFrame();
        }
        if (callback) callback();
    };
    
    img.onerror = function() {
        console.log('Error loading frame', index);
        if (callback) callback();
    };
    
    img.src = baseUrl + frameNumber + fileExtension;
}

function showFirstFrame() {
    frameElement.src = frames[0].src;
    frameElement.style.display = 'block';
    loadingContainer.style.display = 'none';
    initScrollbar();
}

// Basic Scrollbar
function initScrollbar() {
    updateScrollbar();
    
    scrollbarThumb.addEventListener('mousedown', function(e) {
        isDragging = true;
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    });
    
    scrollbar.addEventListener('click', function(e) {
        const rect = scrollbar.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const percent = y / rect.height;
        const frame = Math.floor(percent * (totalFrames - 1));
        showFrame(frame);
    });
}

function handleDrag(e) {
    if (!isDragging) return;
    
    const rect = scrollbar.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const frame = Math.floor(y / rect.height * (totalFrames - 1));
    showFrame(frame);
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

function updateScrollbar() {
    const thumbHeight = scrollbar.offsetHeight / totalFrames * 3;
    const pos = (currentFrame / (totalFrames - 1)) * (scrollbar.offsetHeight - thumbHeight);
    scrollbarThumb.style.height = thumbHeight + 'px';
    scrollbarThumb.style.top = pos + 'px';
}

// Frame Navigation
function showFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    currentFrame = frameIndex;
    
    if (frames[currentFrame]) {
        frameElement.src = frames[currentFrame].src;
        updateScrollbar();
    } else {
        loadFrame(currentFrame, function() {
            frameElement.src = frames[currentFrame].src;
            updateScrollbar();
        });
    }
}

// Wheel Event
window.addEventListener('wheel', function(e) {
    e.preventDefault();
    showFrame(currentFrame + Math.sign(e.deltaY));
}, { passive: false });

// Start Loading
loadFrame(0);