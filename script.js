// Конфигурация
const totalFrames = 33; // 00000-00032
const baseUrl = 'https://raw.githubusercontent.com/AlAlNi/resume_alalni/main/sec/Comp_';
const fileExtension = '.png';

// Элементы DOM
const frameElement = document.getElementById('frame');
const frameInfoElement = document.getElementById('frame-info');
const loadingElement = document.getElementById('loading');
const progressBar = document.getElementById('progress-bar');

// Переменные состояния
let currentFrame = 0;
let frames = new Array(totalFrames);
let lastScrollTime = 0;
const scrollDelay = 150; // Задержка между переключениями в ms

// Загружаем первый кадр и предзагружаем соседние
function loadInitialFrame() {
    loadFrame(0, () => {
        loadingElement.style.display = 'none';
        frameElement.style.display = 'block';
        updateProgressBar();
        preloadAdjacentFrames();
    });
}

// Загружаем конкретный кадр
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
        updateProgressBar();
    };
    
    img.onerror = () => {
        console.error(`Ошибка загрузки кадра ${index}`);
        if (callback) callback();
    };
}

// Предзагружаем соседние кадры для плавности
function preloadAdjacentFrames() {
    const preloadCount = 3; // Загружаем +3 кадра вперед и назад
    for (let i = 1; i <= preloadCount; i++) {
        if (currentFrame + i < totalFrames) loadFrame(currentFrame + i);
        if (currentFrame - i >= 0) loadFrame(currentFrame - i);
    }
}

// Обновляем отображаемый кадр
function updateFrame(frameIndex) {
    if (frameIndex < 0) frameIndex = 0;
    if (frameIndex >= totalFrames) frameIndex = totalFrames - 1;
    
    if (!frames[frameIndex]) {
        loadFrame(frameIndex, () => {
            showFrame(frameIndex);
        });
        return;
    }
    
    showFrame(frameIndex);
}

// Показываем загруженный кадр
function showFrame(frameIndex) {
    currentFrame = frameIndex;
    frameElement.src = frames[currentFrame].src;
    frameInfoElement.textContent = `Кадр ${currentFrame} из ${totalFrames - 1}`;
    preloadAdjacentFrames();
}

// Обновляем прогресс-бар загрузки
function updateProgressBar() {
    const loadedCount = frames.filter(f => f).length;
    const progress = (loadedCount / totalFrames) * 100;
    progressBar.style.width = `${progress}%`;
}

// Обработчик прокрутки
function handleWheel(event) {
    const now = Date.now();
    if (now - lastScrollTime < scrollDelay) {
        event.preventDefault();
        return;
    }
    
    lastScrollTime = now;
    
    const delta = Math.sign(event.deltaY);
    const newFrame = currentFrame + delta;
    
    if (newFrame !== currentFrame && newFrame >= 0 && newFrame < totalFrames) {
        updateFrame(newFrame);
    }
    
    event.preventDefault();
}

// Для мобильных устройств
let touchStartY = 0;

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    
    if (Math.abs(deltaY) > 10) {
        const delta = Math.sign(deltaY);
        const newFrame = currentFrame + delta;
        
        if (newFrame !== currentFrame && newFrame >= 0 && newFrame < totalFrames) {
            updateFrame(newFrame);
            touchStartY = touchY;
        }
        
        e.preventDefault();
    }
}

// Инициализация
window.addEventListener('wheel', handleWheel, { passive: false });
window.addEventListener('touchstart', handleTouchStart, { passive: false });
window.addEventListener('touchmove', handleTouchMove, { passive: false });

// Начинаем загрузку
loadInitialFrame();
