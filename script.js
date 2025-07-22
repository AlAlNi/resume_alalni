class AnimationLoader {
    constructor() {
        this.totalFrames = 132; // увеличено для поддержки третьей страницы
        this.currentFrame = 0;
        this.isDragging = false;
        this.animating = false;
        this.frames = [];
        // Load frames from the remote storage bucket
        // where the sequence is hosted.
        this.baseUrl = 'https://storage.yandexcloud.net/presentation1/Comp_';
        this.fileExtension = '.png';
        // Reduce minimum load time to avoid long delays
        this.minLoadTime = 1000;

        this.pages = [
            { label: '1', frame: 0 },
            { label: '2', frame: 44 },
            { label: '3', frame: 88 }
        ];

        this.elements = {
            frame: document.getElementById('frame'),
            loading: document.getElementById('loading-container'),
            scrollbar: document.getElementById('scrollbar'),
            thumb: document.getElementById('scrollbar-thumb'),
            introText: document.getElementById('intro-text'),
            authorContact: document.getElementById('author-contact'),
            phaseTitle: document.getElementById('phase-title'),
            planTitle: document.getElementById('plan-title'),
            pagination: document.getElementById('pagination'),
            thirdBlock: document.getElementById('third-block'),
            container: document.getElementById('animation-container')
        };
    }

    async init() {
        const startTime = Date.now();

        this.setupEventListeners();
        this.buildPagination();
        await this.loadFirstFrame();
        this.preloadOtherFrames();

        const elapsed = Date.now() - startTime;
        const remaining = this.minLoadTime - elapsed;

        setTimeout(() => {
            this.elements.frame.style.display = 'block';
            this.hideLoader();
        }, Math.max(0, remaining));
    }

    getFramePath(index) {
        const frameNumber = String(index).padStart(5, '0');
        return `${this.baseUrl}${frameNumber}${this.fileExtension}`;
    }

    async loadFirstFrame() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    await img.decode();
                } catch {}
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
                img.onload = async () => {
                    try {
                        await img.decode();
                    } catch {}
                    this.frames[i] = img;
                };
                img.onerror = () => {
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
            this.updatePagination();

            // Плавное исчезновение текста до 32 кадра
            const intro = this.elements.introText;
            if (intro) {
                const fadeOutStart = 0;
                const fadeOutEnd = 32;
                const progress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                intro.style.opacity = 1 - progress;
            }

            // Плавное исчезновение контакта до 30 кадра
            const contact = this.elements.authorContact;
            if (contact) {
                const fadeOutStart = 0;
                const fadeOutEnd = 30;
                const progress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                contact.style.opacity = 1 - progress;
            }

            // Плавное появление заголовка со 30 кадра и скрытие после второй страницы
            const phaseTitle = this.elements.phaseTitle;
            if (phaseTitle) {
                const fadeInStart = 30;
                const fadeInEnd = 33;
                const fadeOutStart = 88;
                const fadeOutEnd = 92;
                const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                phaseTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
            }

            // Плавное появление заглушки третьей страницы
            const planTitle = this.elements.planTitle;
            if (planTitle) {
                const fadeInStart = 92;
                const fadeInEnd = 95;
                const progress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                planTitle.style.opacity = progress;
            }

            const third = this.elements.thirdBlock;
            if (third) {
                if (index >= 88) {
                    third.classList.add('visible');
                    document.body.style.overflow = 'auto';
                    this.elements.scrollbar.style.display = 'none';
                    this.elements.frame.style.display = 'none';
                    if (this.elements.pagination) this.elements.pagination.style.display = 'none';
                } else {
                    third.classList.remove('visible');
                    document.body.style.overflow = 'hidden';
                    this.elements.scrollbar.style.display = 'block';
                    this.elements.frame.style.display = 'block';
                    if (this.elements.pagination) this.elements.pagination.style.display = '';
                }
            }
        }
    }

    animateToFrame(target) {
        if (this.animating) return;
        this.animating = true;
        const step = target > this.currentFrame ? 1 : -1;
        const animate = () => {
            if (this.currentFrame === target) {
                this.animating = false;
                return;
            }
            this.showFrame(this.currentFrame + step);
            requestAnimationFrame(animate);
        };
        animate();
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

    buildPagination() {
        if (!this.elements.pagination) return;
        this.elements.pagination.innerHTML = '';
        this.pages.sort((a, b) => a.frame - b.frame);
        this.pageButtons = this.pages.map(page => {
            const btn = document.createElement('button');
            btn.className = 'page-button';
            btn.textContent = page.label;
            btn.addEventListener('click', () => this.animateToFrame(page.frame));
            this.elements.pagination.appendChild(btn);
            return btn;
        });
        this.updatePagination();
    }

    updatePagination() {
        if (!this.pageButtons) return;
        let activeIndex = 0;
        for (let i = 0; i < this.pages.length; i++) {
            if (this.currentFrame >= this.pages[i].frame) {
                activeIndex = i;
            }
        }
        this.pageButtons.forEach((btn, idx) => {
            if (idx === activeIndex) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    setupEventListeners() {
        let wheelDelta = 0;
        let ticking = false;

        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            wheelDelta += Math.sign(e.deltaY);
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    this.showFrame(this.currentFrame + wheelDelta);
                    wheelDelta = 0;
                    ticking = false;
                });
            }
        }, { passive: false });

        this.elements.thumb.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            const dragHandler = this.handleDrag.bind(this);
            const stopDrag = () => {
                this.isDragging = false;
                document.removeEventListener('mousemove', dragHandler);
                document.removeEventListener('mouseup', stopDrag);
            };
            document.addEventListener('mousemove', dragHandler);
            document.addEventListener('mouseup', stopDrag);
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
