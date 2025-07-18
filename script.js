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

// Optimized frame loading
function getOptimizedUrl(index) {
    const frameNumber = index.toString().padStart(5, '0');
    // В реальном проекте замените на CDN и WebP
    return `${baseUrl}${frameNumber}${fileExtension}`;
}

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

// Frame loading management
function loadInitialFrame() {
    // Приоритетная загрузка первых 5 кадров
    const priorityFrames = [0, 1, 2, 3, 4];
    let loadedCount = 0;
    
    priorityFrames.forEach(index => {
        loadFrame(index, () => {
            loadedCount++;
            if (loadedCount === 1) {
                // После загрузки первого кадра
                showFrame();
                setTimeout(() => {
                    loadingContainer.style.opacity = '0';
                    setTimeout(() => {
                        loadingContainer.style.display = 'none';
                    }, 500);
                }, 500);
            }
        }, true); // Высокий приоритет
    });
}

function loadFrame(index, callback, highPriority = false) {
    if (frames[index]) {
        if (callback) callback();
        return;
    }
    
    const img = new Image();
    if (highPriority) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
    } else {
        img.loading = 'lazy';
    }
    
    img.src = getOptimizedUrl(index);
    
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
    // Загружаем ближайшие кадры с высоким приоритетом
    const highPriorityFrames = [currentFrame + 1, currentFrame + 2, currentFrame - 1];
    highPriorityFrames.forEach(i => {
        if (i >= 0 && i < totalFrames) loadFrame(i, null, true);
    });

    // Остальные кадры загружаем с низким приоритетом
    setTimeout(() => {
        for (let i = 3; i <= 10; i++) {
            if (currentFrame + i < totalFrames) loadFrame(currentFrame + i);
            if (currentFrame - i >= 0) loadFrame(currentFrame - i);
        }
    }, 1000);
}

// Frame display functions
function updateFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    currentFrame = frameIndex;
    
    if (frames[currentFrame]) {
        showFrame();
    } else {
        loadFrame(currentFrame, showFrame, true);
    }
}

function showFrame() {
    frameElement.src = frames[currentFrame].src;
    updateScrollbarThumb();
    preloadAdjacentFrames();
}

function updateScrollbarThumb() {
    const thumbHeight = scrollbar.offsetHeight / totalFrames * 3;
    const position = (currentFrame / (totalFrames - 1)) * (scrollbar.offsetHeight - thumbHeight);
    
    scrollbarThumb.style.height = `${thumbHeight}px`;
    scrollbarThumb.style.top = `${position}px`;
}

// Event handlers
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

function handleWheel(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    updateFrame(currentFrame + delta);
}

// Initialization
function init() {
    document.documentElement.style.scrollBehavior = 'auto';
    frameElement.style.display = 'block';
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    loadInitialFrame();
    initScrollbar();
}

init();