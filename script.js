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
let isFirstInteraction = true;

// 1. Добавляем кэширование уже загруженных кадров
const frameCache = new Map();

// 2. Оптимизированная функция загрузки кадров
async function loadFrame(index, priority = false) {
    if (frames[index]) return true;
    
    // Проверяем кэш
    if (frameCache.has(index)) {
        frames[index] = frameCache.get(index);
        return true;
    }

    const frameNumber = String(index).padStart(5, '0');
    const img = new Image();
    
    // 3. Приоритетная загрузка для видимых/близких кадров
    img.loading = priority ? 'eager' : 'lazy';
    img.fetchPriority = priority ? 'high' : 'low';
    
    try {
        const loaded = await new Promise((resolve) => {
            img.onload = () => {
                frames[index] = img;
                frameCache.set(index, img); // Кэшируем
                resolve(true);
            };
            img.onerror = () => {
                console.warn(`Failed to load frame ${index}`);
                resolve(false);
            };
            img.src = `${baseUrl}${frameNumber}${fileExtension}`;
        });
        
        // 4. Первый кадр показываем сразу
        if (index === 0 && loaded) {
            showFirstFrame();
        }
        return loaded;
    } catch (error) {
        console.error('Loading error:', error);
        return false;
    }
}

// 5. Улучшенная инициализация загрузки
async function initializeLoader() {
    // Параллельная загрузка первых кадров
    await Promise.all([
        loadFrame(0, true),
        loadFrame(1, true),
        loadFrame(2, true)
    ]);
    
    // Фоновая загрузка остальных
    setTimeout(() => {
        for (let i = 3; i < totalFrames; i++) {
            if (!frames[i]) {
                loadFrame(i);
            }
        }
    }, 500);
}

// 6. Оптимизированная предзагрузка
function smartPreload() {
    const visibleRange = 3; // Кадры вокруг текущего
    
    // Предзагрузка видимой области
    for (let i = -visibleRange; i <= visibleRange; i++) {
        const target = currentFrame + i;
        if (target >= 0 && target < totalFrames && !frames[target]) {
            loadFrame(target, i >= -1 && i <= 1); // Высокий приоритет для ближайших
        }
    }
}

// 7. Оптимизированный показ кадров
async function showFrame(frameIndex) {
    frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    currentFrame = frameIndex;
    
    if (frames[currentFrame]) {
        frameElement.src = frames[currentFrame].src;
        updateScrollbar();
        smartPreload();
    } else {
        // 8. Показываем плейсхолдер, если кадр не загружен
        if (isFirstInteraction) {
            frameElement.style.opacity = '0.5'; // Индикатор загрузки
        }
        
        const loaded = await loadFrame(currentFrame, true);
        if (loaded) {
            frameElement.src = frames[currentFrame].src;
            frameElement.style.opacity = '1';
            updateScrollbar();
            smartPreload();
        }
    }
    
    if (isFirstInteraction) {
        isFirstInteraction = false;
    }
}

// Остальные функции остаются без изменений
function showFirstFrame() {
    frameElement.src = frames[0].src;
    frameElement.style.display = 'block';
    loadingContainer.style.opacity = '0';
    
    setTimeout(() => {
        loadingContainer.style.display = 'none';
    }, 500);
    
    initScrollbar();
}

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

// Инициализация
initializeLoader();

window.addEventListener('wheel', function(e) {
    e.preventDefault();
    showFrame(currentFrame + Math.sign(e.deltaY));
}, { passive: false });