class AnimationLoader {
    constructor() {
        // Количество кадров в секвенции
        // обновлено на 900 в соответствии с текущими данными
        this.totalFrames = 900;
        this.currentFrame = 0;
        this.isDragging = false;
        this.animating = false;
        this.frames = [];
        // Load frames from the remote storage bucket
        // where the sequence is hosted.
        this.baseUrl = 'https://storage.yandexcloud.net/presentation1/Comp_';
        this.fileExtension = '.webp';
        // Reduce minimum load time to avoid long delays
        this.minLoadTime = 1000;

        // Кадры начала каждой страницы
        this.pages = [
            { label: '1', frame: 0 },
            { label: '2', frame: 60 },
            { label: '3', frame: 92 },
            { label: '4', frame: 225 },
            { label: '5', frame: 268 },
            { label: '6', frame: 327 },
            { label: '7', frame: 435 },
            { label: '8', frame: 840 }
        ];

        // Шаги для поэтапной навигации
        this.steps = [
            0,   // Шаг 1
            38,  // Шаг 2
            60,  // Шаг 3 - comp_00060
            82,  // Шаг 4 - comp_00082
            93,  // Шаг 5 - comp_00093
            146, // Шаг 6 - comp_00146
            185, // Шаг 7 - comp_00185
            224, // Шаг 8 - comp_00224
            240, // Шаг 9 - comp_00240
            245, // Шаг 10 - comp_00245
            249, // Шаг 11 - comp_00249
            253, // Шаг 12 - comp_00253
            257, // Шаг 13 - comp_00257
            330, // Шаг 14 - comp_00330
            344, // Шаг 15 - comp_00344
            355  // Шаг 16 - comp_00355
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
            pagination: document.getElementById('pagination'),
            stepPrev: document.getElementById('step-prev'),
            stepNext: document.getElementById('step-next')
        };
    }

    async init() {
        const startTime = Date.now();

        this.setupEventListeners();
        this.buildPagination();
        await this.loadFirstFrame();
        this.showFrame(0);
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
            this.updateStepIndex();
            this.updateStepButtons();

            const body = document.body;
            if (index >= 683) {
                body.style.background = '#fff';
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

            // Плавное появление и исчезновение заголовков
            const phaseTitle = this.elements.phaseTitle;
            if (phaseTitle) {
                const fadeInStart = 30;
                const fadeInEnd = 33;
                const fadeOutStart = 45;
                const fadeOutEnd = 48;
                const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                phaseTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
            }

            const planTitle = this.elements.planTitle;
            if (planTitle) {
                const fadeInStart = 45;
                const fadeInEnd = 48;
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
                const fadeOutEnd = 268;
                const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                audienceTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
            }

            const architectureTitle = this.elements.architectureTitle;
            if (architectureTitle) {
                const fadeInStart = 327;
                const fadeInEnd = 342;
                const fadeOutStart = 435;
                const fadeOutEnd = 450;
                const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                architectureTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
            }

            const moodboardTitle = this.elements.moodboardTitle;
            if (moodboardTitle) {
                const fadeInStart = 435;
                const fadeInEnd = 450;
                const fadeOutStart = 840;
                const fadeOutEnd = 855;
                const fadeInProgress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                const fadeOutProgress = Math.min(1, Math.max(0, (index - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
                moodboardTitle.style.opacity = fadeInProgress * (1 - fadeOutProgress);
            }

            const prototypeTitle = this.elements.prototypeTitle;
            if (prototypeTitle) {
                const fadeInStart = 840;
                const fadeInEnd = 855;
                const progress = Math.min(1, Math.max(0, (index - fadeInStart) / (fadeInEnd - fadeInStart)));
                prototypeTitle.style.opacity = progress;
            }
        }
    }

    animateToFrame(target) {
        if (this.animating) return;

        // If navigating backwards or to the same frame, jump directly
        if (target <= this.currentFrame) {
            this.showFrame(target);
            return;
        }

        this.animating = true;
        const step = 1; // only move forward
        // Slow down forward animation by 1.5x (≈20fps)
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

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateStep(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateStep(1);
            }
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
