/**
 * Оптимизированный загрузчик анимации с плавной прокруткой
 * Версия 4.0 - Полная оптимизация
 */

// ==================== КОНФИГУРАЦИЯ ====================
const CONFIG = {
    totalFrames: 33,
    baseUrl: 'https://raw.githubusercontent.com/AlAlNi/resume_alalni/main/sec/Comp_',
    fileExtension: '.png', // Меняем на '.webp' после конвертации
    useWebP: false,       // Включить после подготовки WebP
    preloadDistance: 5,   // Дистанция предзагрузки
    maxParallelLoads: 4,  // Макс. параллельных загрузок
    loadTimeout: 300      // Интервал фоновой загрузки (мс)
};

// ==================== СИСТЕМА ЗАГРУЗКИ ====================
class FrameLoader {
    constructor() {
        this.cache = new Map();
        this.queue = new Set();
        this.loaded = new Array(CONFIG.totalFrames);
        this.priorityQueue = [];
        this.loadedCount = 0;
        this.connectivity = 'good'; // 'good' | 'average' | 'poor'
    }

    async load(index, priority = false) {
        if (this.loaded[index] || this.queue.has(index)) return;

        this.queue.add(index);
        if (priority) this.priorityQueue.push(index);

        try {
            const img = new Image();
            img.loading = priority ? 'eager' : 'lazy';
            img.fetchPriority = priority ? 'high' : 'low';

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    this.loaded[index] = img;
                    this.cache.set(index, img);
                    this.loadedCount++;
                    this.queue.delete(index);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = this.getFrameUrl(index);
            });
        } catch (error) {
            console.warn(`Retrying frame ${index}...`);
            this.queue.delete(index);
            await new Promise(r => setTimeout(r, 500));
            return this.load(index, priority);
        }
    }

    getFrameUrl(index) {
        const frameNum = String(index).padStart(5, '0');
        const ext = CONFIG.useWebP ? '.webp' : CONFIG.fileExtension;
        return `${CONFIG.baseUrl}${frameNum}${ext}?v=2.0`;
    }

    async loadInitialBatch() {
        const batch = [];
        for (let i = 0; i < Math.min(4, CONFIG.totalFrames); i++) {
            batch.push(this.load(i, i < 2));
        }
        await Promise.all(batch);
        this.startBackgroundLoading();
    }

    startBackgroundLoading() {
        let nextIndex = 4;
        const loadNext = () => {
            if (nextIndex >= CONFIG.totalFrames) return;
            
            if (this.queue.size < this.getMaxParallel()) {
                this.load(nextIndex++);
            }
            setTimeout(loadNext, CONFIG.loadTimeout);
        };
        loadNext();
    }

    getMaxParallel() {
        return this.connectivity === 'good' ? 4 : 
               this.connectivity === 'average' ? 2 : 1;
    }

    preloadAround(currentIndex) {
        const { preloadDistance } = CONFIG;
        for (let i = 1; i <= preloadDistance; i++) {
            const targets = [
                currentIndex + i,
                currentIndex - i
            ].filter(idx => idx >= 0 && idx < CONFIG.totalFrames);
            
            targets.forEach(idx => {
                if (!this.loaded[idx] && !this.queue.has(idx)) {
                    this.load(idx, i <= 2);
                }
            });
        }
    }
}

// ==================== ОСНОВНОЙ КОД ====================
class AnimationPlayer {
    constructor() {
        this.loader = new FrameLoader();
        this.currentFrame = 0;
        this.isDragging = false;
        this.scrollDirection = 'down';
        this.lastScrollTime = 0;
        
        this.elements = {
            frame: document.getElementById('frame'),
            loading: document.getElementById('loading-container'),
            scrollbar: document.getElementById('scrollbar'),
            thumb: document.getElementById('scrollbar-thumb'),
            progress: this.createProgressBar()
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loader.loadInitialBatch().then(() => {
            this.showFirstFrame();
        });
        
        // Анализ скорости соединения
        this.detectConnectivity();
    }

    async showFrame(index) {
        index = Math.max(0, Math.min(CONFIG.totalFrames - 1, index));
        this.currentFrame = index;

        if (this.loader.loaded[index]) {
            this.displayFrame(index);
        } else {
            this.elements.frame.style.opacity = '0.7';
            await this.loader.load(index, true);
            this.displayFrame(index);
        }

        this.loader.preloadAround(index);
    }

    displayFrame(index) {
        this.elements.frame.src = this.loader.loaded[index].src;
        this.elements.frame.style.opacity = '1';
        this.updateScrollbar();
        this.updateProgress();
    }

    showFirstFrame() {
        this.elements.frame.src = this.loader.loaded[0].src;
        this.elements.frame.style.display = 'block';
        
        animateOpacity(this.elements.loading, 0, () => {
            this.elements.loading.style.display = 'none';
        });
    }

    // ... остальные методы (scrollbar, events и т.д.)
}

// ==================== ПОМОЩНИКИ ====================
function animateOpacity(element, target, callback) {
    element.style.transition = 'opacity 0.3s ease';
    element.style.opacity = target;
    setTimeout(callback, 300);
}

function createProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'load-progress';
    document.body.appendChild(bar);
    return bar;
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', () => {
    new AnimationPlayer();
});