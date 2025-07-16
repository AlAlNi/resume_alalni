// Конфигурация
const totalFrames = 33; // 00000-00032
const baseUrl = 'https://raw.githubusercontent.com/AlAlNi/resume_alalni/main/sec/Comp_';
const fileExtension = '.png';

// Элементы DOM
const frameElement = document.getElementById('frame');
const frameInfoElement = document.getElementById('frame-info');
const loadingElement = document.getElementById('loading');
const progressBar = document.getElementById('progress-bar');
const scrollbar = document.getElementById('scrollbar');
const scrollbarThumb = document.getElementById('scrollbar-thumb');

// Переменные состояния
let currentFrame = 0;
let frames = new Array(totalFrames);
let lastScrollTime = 0;
const scrollDelay = 150; // Задержка между переключениями в ms
let isDragging = false;

// Инициализация скроллбара
function initScrollbar() {
    updateScrollbarThumb();
    
    // Обработчики для drag'n'drop скроллбара
    scrollbarThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const scrollbarRect = scrollbar.getBoundingClientRect();
        const y = e.clientY - scrollbarRect.top;
        const percent = Math.min(1, Math.max(0, y / scrollbarRect.height));
        const frameIndex = Math.floor(percent * (totalFrames - 1));
        
        updateFrame(frameIndex);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Клик по скроллбару для перехода к кадру
    scrollbar.addEventListener('click', (e) => {
        const scrollbarRect = scrollbar.getBoundingClientRect();
        const y = e.clientY - scrollbarRect.top;
        const percent = Math.min(1, Math.max(0, y / scrollbarRect.height));
        const frameIndex = Math.floor(percent * (totalFrames - 1));
        
        updateFrame(frameIndex);
    });
}

// Обновление положения ползунка скроллбара
function updateScrollbarThumb() {
    const thumbHeight = scrollbar.offsetHeight / totalFrames * 3;
    const position = (currentFrame / (totalFrames - 1)) * (scrollbar.offsetHeight - thumbHeight);
    
    scrollbarThumb.style.height = `${thumbHeight}px`;
    scrollbarThumb.style.top = `${position}px`;
}

// ... (остальные функции остаются такими же, как в предыдущей версии)

// В функции showFrame добавляем обновление скроллбара
function showFrame(frameIndex) {
    currentFrame = frameIndex;
    frameElement.src = frames[currentFrame].src;
    frameInfoElement.textContent = `Кадр ${currentFrame} из ${totalFrames - 1}`;
    updateScrollbarThumb();
    preloadAdjacentFrames();
}

// Инициализация (добавляем инициализацию скроллбара)
window.addEventListener('wheel', handleWheel, { passive: false });
window.addEventListener('touchstart', handleTouchStart, { passive: false });
window.addEventListener('touchmove', handleTouchMove, { passive: false });

// Начинаем загрузку
loadInitialFrame();
initScrollbar(); // Инициализируем скроллбар
