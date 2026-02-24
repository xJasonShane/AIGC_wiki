const CardGallery = {
    cards: [],
    currentIndex: 0,

    async init() {
        await this.loadCards();
        this.renderCards();
        this.bindEvents();
        this.updateCardCount();
    },

    async loadCards() {
        try {
            const response = await fetch('data/cards/index.json');
            if (!response.ok) throw new Error('Failed to load card index');
            
            const cardFiles = await response.json();
            const loadPromises = cardFiles.map(file => 
                fetch(`data/cards/${file}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to load ${file}`);
                        return res.json();
                    })
                    .catch(err => {
                        console.warn(`Skipping ${file}:`, err.message);
                        return null;
                    })
            );
            
            const results = await Promise.all(loadPromises);
            this.cards = results.filter(card => card !== null);
            
            this.cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error loading cards:', error);
            this.cards = [];
        }
    },

    renderCards() {
        const grid = document.getElementById('cardGrid');
        
        if (this.cards.length === 0) {
            grid.innerHTML = `
                <div class="no-cards">
                    <div class="no-cards-icon">🖼️</div>
                    <p>暂无作品展示</p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">请添加卡片数据到 data/cards/ 目录</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.cards.map((card, index) => this.createCardHTML(card, index)).join('');
    },

    createCardHTML(card, index) {
        const modelTag = card.model?.name || 'Unknown Model';
        const typeTag = card.model?.type || '';
        
        return `
            <article class="card" data-index="${index}" tabindex="0" role="button" aria-label="查看 ${card.title} 详情">
                <div class="card-image-container">
                    <img 
                        src="${card.thumbnail}" 
                        alt="${card.title}" 
                        class="card-image"
                        loading="lazy"
                        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22><rect fill=%22%231a1a24%22 width=%22300%22 height=%22400%22/><text x=%2250%%22 y=%2250%%22 fill=%22%23606070%22 text-anchor=%22middle%22 dy=%22.3em%22>暂无图片</text></svg>'"
                    >
                    <div class="card-overlay"></div>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${card.title}</h3>
                    <div class="card-meta">
                        <span class="card-tag">${modelTag}</span>
                        ${typeTag ? `<span class="card-tag">${typeTag}</span>` : ''}
                    </div>
                </div>
            </article>
        `;
    },

    updateCardCount() {
        const countEl = document.getElementById('cardCount');
        countEl.textContent = `${this.cards.length} 张作品`;
    },

    bindEvents() {
        const grid = document.getElementById('cardGrid');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                const index = parseInt(card.dataset.index, 10);
                this.openModal(index);
            }
        });

        grid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.card');
                if (card) {
                    e.preventDefault();
                    const index = parseInt(card.dataset.index, 10);
                    this.openModal(index);
                }
            }
        });

        modalClose.addEventListener('click', () => this.closeModal());
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    },

    openModal(index) {
        const card = this.cards[index];
        if (!card) return;

        this.currentIndex = index;

        document.getElementById('modalImage').src = card.fullImage || card.thumbnail;
        document.getElementById('modalImage').alt = card.title;
        document.getElementById('modalTitle').textContent = card.title;
        document.getElementById('modalDate').textContent = card.createdAt || '';

        document.getElementById('modalModelName').textContent = card.model?.name || '-';
        document.getElementById('modalModelType').textContent = card.model?.type || '-';

        document.getElementById('modalSampler').textContent = card.parameters?.sampler || '-';
        document.getElementById('modalCfg').textContent = card.parameters?.cfg ?? '-';
        document.getElementById('modalSteps').textContent = card.parameters?.steps ?? '-';
        document.getElementById('modalSize').textContent = card.parameters?.size || '-';
        document.getElementById('modalVae').textContent = card.parameters?.vae || '-';
        document.getElementById('modalUpscaler').textContent = card.parameters?.upscaler || '-';
        document.getElementById('modalSeed').textContent = card.parameters?.seed ?? '-';

        this.renderLoras(card.loras);

        document.getElementById('modalPrompt').textContent = card.prompt || '-';
        document.getElementById('modalNegativePrompt').textContent = card.negativePrompt || '-';

        const loraSection = document.getElementById('loraSection');
        if (card.loras && card.loras.length > 0) {
            loraSection.style.display = 'block';
        } else {
            loraSection.style.display = 'none';
        }

        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    renderLoras(loras) {
        const container = document.getElementById('modalLoras');
        
        if (!loras || loras.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">未使用LoRA</p>';
            return;
        }

        container.innerHTML = loras.map(lora => `
            <div class="lora-item">
                <span class="lora-name">${lora.name}</span>
                <span class="lora-weight">${lora.weight}</span>
            </div>
        `).join('');
    },

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CardGallery.init();
});
