class AnimationLoader {
    constructor() {
        // Фактическое число кадров: 0..509 (итого 510)
        this.totalFrames = 510;
        this.currentFrame = 0;
        this.isDragging = false;
        this.animating = false;
        this.frames = [];
        this.touchState = { active: false, lastY: 0, lastX: 0, accumY: 0, accumX: 0 };
        // Mobile detection and cache sizing to avoid iOS tab reloads
        this.isMobile = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
        this.maxCache = this.isMobile ? 40 : 160;

        // Путь к кадрам секвенции
        this.baseUrl = 'https://storage.yandexcloud.net/presentation1/Comp_';
        this.fileExtension = '.webp';

        // Минимальное время лоадера
        this.minLoadTime = 1000;

        // Кадры начала страниц
        this.pages = [
            { label: '1', frame: 0 },
            { label: '2', frame: 60 },
            { label: '3', frame: 92 },
            { label: '4', frame: 225 },
            { label: '5', frame: 268 },
            { label: '6', frame: 327 },
            { label: '7', frame: 436 },
            { label: '8', frame: 494 },
            { label: '9', frame: 509 }
        ];

        // Шаги по сюжету
        this.steps = [
            0,   // 1
            38,  // 2
            46,  // 2_1 - comp_00046
            60,  // 3 - comp_00060
            82,  // 4 - comp_00082
            93,  // 5 - comp_00093
            146, // 6 - comp_00146
            185, // 7 - comp_00185
            224, // 8 - comp_00224
            240, // 9 - comp_00240
            245, // 10 - comp_00245
            249, // 11 - comp_00249
            253, // 12 - comp_00253
            257, // 13 - comp_00257
            330, // 14 - comp_00330
            344, // 15 - comp_00344
            360, // 16 - comp_00360
            416, // 17 - comp_00416
            426, // 18 - comp_00426
            436, // 18 - comp_00436
            494, // 19 - comp_00494
            509  // 99 - последний кадр (index = totalFrames-1)
        ];
        this.currentStepIndex = 0;

        this.elements = {
            frame: document.getElementById('frame'),
            loading: document.getElementById('loading-container'),
            scrollbar: document.getElementById('scrollbar'),
            thumb: document.getElementById('scrollbar-thumb'),
            introText: document.getElementById('intro-text'),
            authorContact: document.getElementById('author-contact'),
            phaseTitle: document.getElementById('phase-title'),
            planTitle: document.getElementById('plan-title'),
            audienceTitle: document.getElementById('audience-title'),
            architectureTitle: document.getElementById('architecture-title'),
            moodboardTitle: document.getElementById('moodboard-title'),
            prototypeTitle: document.getElementById('prototype-title'),
            finalScreen: document.getElementById('final-screen'),
            pagination: document.getElementById('pagination'),
            stepPrev: document.getElementById('step-prev'),
            stepNext: document.getElementById('step-next'),
            finalRestart: document.getElementById('final-restart'),
            finalPrev: document.getElementById('final-prev')
        };
    }

    async init() {
        const startTime = Date.now();

        this.setupEventListeners();
        this.buildPagination();
        await this.loadFirstFrame();
        this.showFrame(0);
        if (this.isMobile) this.preloadOtherFramesMobile();
        else this.preloadOtherFrames();

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
            // ВАЖНО: без crossOrigin, чтобы не упираться в CORS
            img.onload = async () => {
                try { await img.decode(); } catch {}
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
            const img = new Image();
            // без crossOrigin
            img.onload = async () => {
                try { await img.decode(); } catch {}
                this.frames[i] = img;
            };
            img.onerror = () => {
                this.generateFallbackFrame(i);
            };
            img.src = this.getFramePath(i);
        }
    }

    // Mobile-safe limited preloader to avoid iOS tab reloads
    preloadOtherFramesMobile() {
        const toPreload = new Set();
        for (let i = 1; i <= Math.min(30, this.totalFrames - 1); i++) toPreload.add(i);
        if (Array.isArray(this.pages)) this.pages.forEach(p => { if (p.frame > 0) toPreload.add(p.frame); });
        if (Array.isArray(this.steps)) this.steps.slice(0, 15).forEach(s => { if (s > 0) toPreload.add(s); });
        toPreload.forEach(i => {
            const img = new Image();
            img.onload = async () => {
                try { await img.decode(); } catch {}
                this.frames[i] = img;
            };
            img.onerror = () => {
                this.generateFallbackFrame(i);
            };
            img.src = this.getFramePath(i);
        });
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
        if (index < 0) index = 0;
        if (index >= this.totalFrames) index = this.totalFrames - 1;

        this.currentFrame = index;
        if (this.frames[index]) {
            this.elements.frame.src = this.frames[index].src;
        } else {
            this.loadFrame(index);
        }
        this.updateScrollbar();
        this.updatePagination();
        this.updateStepIndex();
        this.updateStepButtons();

        const body = document.body;
        if (index >= 475) {
            body.style.background = '#8FB2C4';
        } else {
            body.style.background = '';
        }

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

        // Заголовки — появление/исчезновение
        const phaseTitle = this.elements.phaseTitle;
        if (phaseTitle) {
            const fadeInStart = 30;
            const fadeInEnd = 33;
            const fadeOutStart = 72;
            const fadeOutEnd = 75;
            const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
            const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
            phaseTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
        }

        const planTitle = this.elements.planTitle;
        if (planTitle) {
            const fadeInStart = 72;
            const fadeInEnd = 75;
            const fadeOutStart = 93;
            const fadeOutEnd = 108;
            const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
            const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
            planTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
        }

        const audienceTitle = this.elements.audienceTitle;
        if (audienceTitle) {
            const fadeInStart = 93;
            const fadeInEnd = 108;
            const fadeOutStart = 225;
            const fadeOutEnd = 240;
            const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
            const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
            audienceTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
        }

        const architectureTitle = this.elements.architectureTitle;
        if (architectureTitle) {
            const fadeInStart = 327;
            const fadeInEnd = 342;
            const fadeOutStart = 399
        ;
            const fadeOutEnd = 404;
            const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
            const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
            architectureTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
        }

        const moodboardTitle = this.elements.moodboardTitle;
        if (moodboardTitle) {
            const fadeInStart = 399;
            const fadeInEnd = 404;
            const fadeOutStart = 490;
            const fadeOutEnd = 491;
            const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
            const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
            moodboardTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
        }

        const prototypeTitle = this.elements.prototypeTitle;
        if (prototypeTitle) {
            const fadeInStart = 490;
            const fadeInEnd = 495;
            const fadeOutStart = 498;
            const fadeOutEnd = 500;
            const progress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
            prototypeTitle.style.opacity = progress;
        }

        const finalScreen = this.elements.finalScreen;
        if (finalScreen) {
            if (index >= this.totalFrames - 1) {
                finalScreen.style.opacity = 1;
                finalScreen.style.pointerEvents = 'auto';
            } else {
                finalScreen.style.opacity = 0;
                finalScreen.style.pointerEvents = 'none';
            }
        }

        // Maintain neighbor frames nearby and manage cache size
        this.ensureNeighborhood(index);
        this.evictCache(index);
    }

    // Preload nearby frames and evict far ones
    ensureNeighborhood(index) {
        const radius = this.isMobile ? 8 : 20;
        for (let i = Math.max(0, index - radius); i <= Math.min(this.totalFrames - 1, index + radius); i++) {
            if (i === index) continue;
            if (!this.frames[i]) {
                const img = new Image();
                img.onload = async () => {
                    try { await img.decode(); } catch {}
                    this.frames[i] = img;
                };
                img.onerror = () => {
                    this.generateFallbackFrame(i);
                };
                img.src = this.getFramePath(i);
            }
        }
    }

    evictCache(pivot) {
        const loaded = [];
        for (let i = 0; i < this.frames.length; i++) if (this.frames[i]) loaded.push(i);
        if (loaded.length <= this.maxCache) return;
        loaded.sort((a, b) => Math.abs(b - pivot) - Math.abs(a - pivot));
        while (loaded.length > this.maxCache) {
            const idx = loaded.shift();
            if (idx === pivot) continue;
            this.frames[idx] = undefined;
        }
    }

    animateToFrame(target) {
        if (this.animating) return;

        if (target <= this.currentFrame) {
            this.showFrame(target);
            return;
        }

        this.animating = true;
        const step = 1;
        const frameDuration = (1000 / 30) * 1.5;
        const animate = () => {
            if (this.currentFrame === target) {
                this.animating = false;
                return;
            }
            this.showFrame(this.currentFrame + step);
            setTimeout(() => requestAnimationFrame(animate), frameDuration);
        };
        animate();
    }

    loadFrame(index) {
        const img = new Image();
        // без crossOrigin
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

        const total = this.pageButtons.length;
        let start = Math.max(0, activeIndex - 1);
        let end = Math.min(total - 1, activeIndex + 1);

        if (end - start < 2) {
            if (start === 0) {
                end = Math.min(total - 1, start + 2);
            } else if (end === total - 1) {
                start = Math.max(0, end - 2);
            }
        }

        this.pageButtons.forEach((btn, idx) => {
            const visible = idx >= start && idx <= end;
            btn.style.display = visible ? '' : 'none';
            if (idx === activeIndex) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    updateStepIndex() {
        for (let i = 0; i < this.steps.length; i++) {
            if (this.currentFrame >= this.steps[i]) {
                this.currentStepIndex = i;
            }
        }
    }

    updateStepButtons() {
        if (!this.elements.stepPrev || !this.elements.stepNext) return;
        this.elements.stepPrev.disabled = this.currentStepIndex === 0;
        this.elements.stepNext.disabled = this.currentStepIndex === this.steps.length - 1;
    }

    navigateStep(direction) {
        const newIndex = this.currentStepIndex + direction;
        if (newIndex < 0 || newIndex >= this.steps.length) return;
        this.currentStepIndex = newIndex;
        this.animateToFrame(this.steps[this.currentStepIndex]);
        this.updateStepButtons();
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

        if (this.elements.stepPrev && this.elements.stepNext) {
            this.elements.stepPrev.addEventListener('click', () => this.navigateStep(-1));
            this.elements.stepNext.addEventListener('click', () => this.navigateStep(1));
        }

        // Navigation inside the final screen
        if (this.elements.finalRestart) {
            this.elements.finalRestart.addEventListener('click', () => this.animateToFrame(0));
        }
        if (this.elements.finalPrev) {
            this.elements.finalPrev.addEventListener('click', () => this.navigateStep(-1));
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateStep(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateStep(1);
            }
        });

        // --- Touch support ---
        const container = document.getElementById('animation-container');
        if (container) {
            container.addEventListener('touchstart', (e) => {
                if (!e.touches || e.touches.length === 0) return;
                const t = e.touches[0];
                this.touchState.active = true;
                this.touchState.lastY = t.clientY;
                this.touchState.lastX = t.clientX;
                this.touchState.accumY = 0;
                this.touchState.accumX = 0;
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                if (!this.touchState.active || !e.touches || e.touches.length === 0) return;
                const t = e.touches[0];
                const dy = this.touchState.lastY - t.clientY;
                const dx = this.touchState.lastX - t.clientX;
                this.touchState.lastY = t.clientY;
                this.touchState.lastX = t.clientX;
                // Prefer vertical swipe; fall back to horizontal
                this.touchState.accumY += dy;
                this.touchState.accumX += dx;
                const threshold = 6; // pixels per frame step
                let steps = 0;
                if (Math.abs(this.touchState.accumY) >= threshold || Math.abs(this.touchState.accumX) >= threshold) {
                    if (Math.abs(this.touchState.accumY) >= Math.abs(this.touchState.accumX)) {
                        steps = Math.trunc(this.touchState.accumY / threshold);
                        this.touchState.accumY -= steps * threshold;
                    } else {
                        steps = Math.trunc(this.touchState.accumX / threshold);
                        this.touchState.accumX -= steps * threshold;
                    }
                }
                if (steps !== 0) {
                    e.preventDefault();
                    this.showFrame(this.currentFrame + steps);
                }
            }, { passive: false });

            container.addEventListener('touchend', () => {
                this.touchState.active = false;
                this.touchState.accumY = 0;
                this.touchState.accumX = 0;
            });
        }

        // Touch drag for scrollbar thumb
        this.elements.thumb.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            this.isDragging = true;
            const dragHandler = (ev) => {
                if (!ev.touches || ev.touches.length === 0) return;
                const rect = this.elements.scrollbar.getBoundingClientRect();
                const y = Math.max(0, Math.min(rect.height, ev.touches[0].clientY - rect.top));
                const frame = Math.floor(y / rect.height * (this.totalFrames - 1));
                this.showFrame(frame);
                ev.preventDefault();
            };
            const stopDrag = () => {
                this.isDragging = false;
                document.removeEventListener('touchmove', dragHandler);
                document.removeEventListener('touchend', stopDrag);
            };
            document.addEventListener('touchmove', dragHandler, { passive: false });
            document.addEventListener('touchend', stopDrag);
            e.preventDefault();
        }, { passive: false });

        // Touch tap on scrollbar track
        this.elements.scrollbar.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            const rect = this.elements.scrollbar.getBoundingClientRect();
            const y = e.touches[0].clientY - rect.top;
            const percent = y / rect.height;
            const frame = Math.floor(percent * (this.totalFrames - 1));
            this.showFrame(frame);
            e.preventDefault();
        }, { passive: false });
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
