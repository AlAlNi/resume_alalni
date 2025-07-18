// Configuration
const totalFrames = 33;
const baseUrl = 'https://raw.githubusercontent.com/AlAlNi/resume_alalni/main/sec/Comp_';
const fileExtension = '.png';

// DOM Elements
const frameElement = document.getElementById('frame');
const loadingContainer = document.getElementById('loading-container');
const scrollbar = document.getElementById('scrollbar');
const scrollbarThumb = document.getElementById('scrollbar-thumb');

// State variables
let currentFrame = 0;
let frames = new Array(totalFrames);
let isDragging = false;

// Scrollbar initialization
function initScrollbar() {
    updateScrollbarThumb();
    
    scrollbarThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.addEventListener('mousemove', handleThumbDrag);
        document.addEventListener('mouseup', stopThumbDrag);
        e.preventDefault();
    });
    
    scrollbar.addEventListener('click', (e) => {
        const rect = scrollbar.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const percent = y / rect.height;
        const frameIndex = Math.min(totalFrames - 1, Math.floor(percent * totalFrames));
        updateFrame(frameIndex);
    });
}

function handleThumbDrag(e) {
    if (!isDragging) return;
    
    const rect = scrollbar.getBoundingClientRect();
    let y = e.clientY - rect.top;
    y = Math.max(0, Math.min(rect.height, y));
    const percent = y / rect.height;
    const frameIndex = Math.min(totalFrames - 1, Math.floor(percent * totalFrames));
    
    updateFrame(frameIndex);
}

function stopThumbDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleThumbDrag);
    document.removeEventListener('mouseup', stopThumbDrag);
}

function updateScrollbarThumb() {
    const thumbHeight = scrollbar.offsetHeight / totalFrames * 3;
    const position = (currentFrame / (totalFrames - 1)) * (scrollbar.offsetHeight - thumbHeight);
    
    scrollbarThumb.style.height = `${thumbHeight}px`;
    scrollbarThumb.style.top = `${position}px`;
}

// Frame loading
function loadInitialFrame() {
    loadFrame(0, () => {
        showFrame(); // Показываем первый кадр сразу после загрузки
        preloadAdjacentFrames();
        
        // Плавно скрываем прелоадер
        setTimeout(() => {
            loadingContainer.style.opacity = '0';
            setTimeout(() => {
                loadingContainer.style.display = 'none';
            }, 500);
        }, 500);
    });
}

function loadFrame(index, callback) {
    if (frames[index]) {
        if (callback) callback();
        return;
    }
    
    const frameNumber = index.toString().padStart(5, '0');
    const img = new Image();
    img.src = `${baseUrl}${frameNumber}${fileExtension}`;
    
    img.onload = () => {
        frames[index] = img;
        if (callback) callback();
    };
    
    img.onerror = () => {
        console.error(`Error loading frame ${index}`);
        if (callback) callback();
    };
}

function preloadAdjacentFrames() {
    const preloadCount = 3;
    for (let i = 1; i <= preloadCount; i++) {
        if (currentFrame + i < totalFrames) loadFrame(currentFrame + i);
        if (currentFrame - i >= 0) loadFrame(currentFrame - i);
    }
}

function updateFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    currentFrame = frameIndex;
    
    if (frames[currentFrame]) {
        showFrame();
    } else {
        loadFrame(currentFrame, showFrame);
    }
}

function showFrame() {
    frameElement.src = frames[currentFrame].src;
    frameElement.style.display = 'block'; // Убедимся, что кадр видим
    updateScrollbarThumb();
    preloadAdjacentFrames();
}

// Event handlers
function handleWheel(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    updateFrame(currentFrame + delta);
}

window.addEventListener('wheel', handleWheel, { passive: false });

// Initialization
frameElement.style.display = 'none'; // Сначала скрываем кадр
loadInitialFrame();
initScrollbar();