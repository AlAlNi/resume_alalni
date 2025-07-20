class AnimationLoader {
    constructor() {
        this.totalFrames = 33; // Укажите правильное количество кадров
        this.currentFrame = 0;
        this.isDragging = false;
        this.frames = [];
        this.baseUrl = 'https://storage.yandexcloud.net/presentation1/Comp_';
        this.fileExtension = '.png';

        this.elements = {
            frame: document.getElementById('frame'),
            loading: document.getElementById('loading-container'),
            scrollbar: document.getElementById('scrollbar'),
            thumb: document.getElementById('scrollbar-thumb')
        };
    }

    async init() {
        this.setupEventListeners();
        await this.loadFirstFrame();
        this.preloadOtherFrames();
        this.elements.frame.style.display = 'block';
        this.hideLoader();
    }

    getFramePath(index) {
        const frameNumber = String(index).padStart(5, '0');
        return `${this.baseUrl}${frameNumber}${this.fileExtension}`;
    }

    async loadFirstFrame() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.frames[0] = img;
                this.elements.frame.src = img.src;
                resolve();
            };
            img.onerror = () => {
                console.error('Error loading first frame');
                this.generateFallbackFrame(0).then(resolve);
            };
            img.src = this.getFramePath(0);
        });
    }

    preloadOtherFrames() {
        for (let i = 1; i < this.totalFrames; i++) {
            setTimeout(() => {
                const img = new Image();
                img.onload = () => {
                    this.frames[i] = img;
                };
                img.onerror = () => {
                    console.warn(`Error loading frame ${i}`);
                    this.generateFallbackFrame(i);
                };
                img.src = this.getFramePath(i);
            }, i * 100);
        }
    }

    async generateFallbackFrame(index) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = `hsl(${(index * 10) % 360}, 70%, 50%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.fillText(`Frame ${index} (Fallback)`, 50, 100);

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.frames[index] = img;
                if (index === this.currentFrame) {
                    this.elements.frame.src = img.src;
                }
                resolve();
            };
            img.src = canvas.toDataURL();
        });
    }

    hideLoader() {
        this.elements.loading.style.display = 'none';
    }

    showFrame(index) {
        if (index >= 0 && index < this.totalFrames) {
            this.currentFrame = index;
            if (this.frames[index]) {
                this.elements.frame.src = this.frames[index].src;
            } else {
                this.loadFrame(index);
            }
            this.updateScrollbar();
        }
    }

    loadFrame(index) {
        const img = new Image();
        img.onload = () => {
            this.frames[index] = img;
            this.elements.frame.src = img.src;
        };
        img.onerror = () => {
            this.generateFallbackFrame(index);
        };
        img.src = this.getFramePath(index);
    }

    updateScrollbar() {
        const thumbHeight = this.elements.scrollbar.offsetHeight / this.totalFrames * 3;
        const position = (this.currentFrame / (this.totalFrames - 1)) * 
                        (this.elements.scrollbar.offsetHeight - thumbHeight);
        this.elements.thumb.style.height = `${thumbHeight}px`;
        this.elements.thumb.style.top = `${position}px`;
    }

    setupEventListeners() {
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            const newFrame = this.currentFrame + Math.sign(e.deltaY);
            this.showFrame(newFrame);
        }, { passive: false });

        this.elements.thumb.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            document.addEventListener('mousemove', this.handleDrag.bind(this));
            document.addEventListener('mouseup', () => {
                this.isDragging = false;
                document.removeEventListener('mousemove', this.handleDrag.bind(this));
            });
            e.preventDefault();
        });

        this.elements.scrollbar.addEventListener('click', (e) => {
            const rect = this.elements.scrollbar.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const percent = y / rect.height;
            const frame = Math.floor(percent * (this.totalFrames - 1));
            this.showFrame(frame);
        });
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        const rect = this.elements.scrollbar.getBoundingClientRect();
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        const frame = Math.floor(y / rect.height * (this.totalFrames - 1));
        this.showFrame(frame);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = new AnimationLoader();
    loader.init();
});