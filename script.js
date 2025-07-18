// Configuration
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

// 1. Добавим приоритетную загрузку первых кадров
function loadInitialFrames() {
    // Первые 3 кадра загружаем сразу
    for (let i = 0; i < 3; i++) {
        loadFrame(i, i === 0 ? showFirstFrame : null, true);
    }
    
    // Остальные кадры начинаем грузить после небольшой задержки
    setTimeout(() => {
        for (let i = 3; i < totalFrames; i++) {
            loadFrame(i, null, false);
        }
    }, 300);
}

// 2. Модифицируем функцию загрузки кадров
function loadFrame(index, callback, isPriority) {
    if (frames[index]) {
        if (callback) callback();
        return;
    }
    
    const frameNumber = String(index).padStart(5, '0');
    const img = new Image();
    
    // 3. Оптимизация: устанавливаем приоритет загрузки
    if (isPriority) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
    } else {
        img.loading = 'lazy';
    }
    
    img.onload = function() {
        frames[index] = img;
        if (callback) callback();
    };
    
    img.onerror = function() {
        console.error('Error loading frame', index);
        if (callback) callback();
    };
    
    img.src = baseUrl + frameNumber + fileExtension;
}

function showFirstFrame() {
    frameElement.src = frames[0].src;
    frameElement.style.display = 'block';
    loadingContainer.style.opacity = '0';
    
    setTimeout(() => {
        loadingContainer.style.display = 'none';
    }, 500);
    
    initScrollbar();
}

// 4. Добавим базовую предзагрузку соседних кадров
function preloadAdjacentFrames() {
    const preloadDistance = 2;
    for (let i = 1; i <= preloadDistance; i++) {
        if (currentFrame + i < totalFrames && !frames[currentFrame + i]) {
            loadFrame(currentFrame + i, null, true);
        }
        if (currentFrame - i >= 0 && !frames[currentFrame - i]) {
            loadFrame(currentFrame - i, null, true);
        }
    }
}

// Остальные функции остаются без изменений
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

function showFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    currentFrame = frameIndex;
    
    if (frames[currentFrame]) {
        frameElement.src = frames[currentFrame].src;
        updateScrollbar();
        preloadAdjacentFrames(); // 5. Добавляем предзагрузку соседних кадров
    } else {
        loadFrame(currentFrame, function() {
            frameElement.src = frames[currentFrame].src;
            updateScrollbar();
            preloadAdjacentFrames();
        }, true);
    }
}

// Инициализация
loadInitialFrames(); // Заменяем вызов loadFrame(0)

window.addEventListener('wheel', function(e) {
    e.preventDefault();
    showFrame(currentFrame + Math.sign(e.deltaY));
}, { passive: false });