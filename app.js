// Carregar estado do localStorage
function loadState() {
    const saved = localStorage.getItem('pokedex-joao');
    return saved ? JSON.parse(saved) : {};
}

function saveState(state) {
    localStorage.setItem('pokedex-joao', JSON.stringify(state));
}

let state = loadState();
let currentFilter = 'all';

// Gerar filtros de geração
const generations = [...new Set(POKEMON_DATA.map(p => p.gen))];
const filtersDiv = document.getElementById('gen-filters');
const allBtn = document.createElement('button');
allBtn.textContent = 'Todas';
allBtn.className = 'active';
allBtn.onclick = () => filterGen('all');
filtersDiv.appendChild(allBtn);

generations.forEach(gen => {
    const btn = document.createElement('button');
    btn.textContent = gen.replace(' - ', ': ');
    btn.onclick = () => filterGen(gen);
    btn.dataset.gen = gen;
    filtersDiv.appendChild(btn);
});

// Renderizar grid
function renderGrid(filter = 'all', search = '') {
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';
    
    let filtered = POKEMON_DATA;
    if (filter !== 'all') filtered = filtered.filter(p => p.gen === filter);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || String(p.id).includes(search));
    
    filtered.forEach(p => {
        const key = String(p.id);
        const hasBulk = state[key]?.bulk || p.bulk;
        const hasUr = state[key]?.ur || p.ur;
        
        const card = document.createElement('div');
        card.className = `card ${hasBulk ? 'has-bulk' : ''} ${hasUr ? 'has-ur' : ''} ${hasBulk && hasUr ? 'has-both' : ''}`;
        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png" alt="${p.name}" loading="lazy">
            <div class="number">#${String(p.id).padStart(3, '0')}</div>
            <div class="name" title="${p.name}">${p.name}</div>
            <div class="checks">
                <label><input type="checkbox" ${hasBulk ? 'checked' : ''} onchange="toggle(${p.id},'bulk',this.checked)">B</label>
                <label><input type="checkbox" class="ur-check" ${hasUr ? 'checked' : ''} onchange="toggle(${p.id},'ur',this.checked)">UR</label>
            </div>
        `;
        grid.appendChild(card);
    });
    
    updateProgress();
}

function toggle(id, type, checked) {
    const key = String(id);
    if (!state[key]) state[key] = {};
    state[key][type] = checked;
    saveState(state);
    updateProgress();
    
    // Atualizar visual do card
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardId = card.querySelector('.number').textContent.replace('#', '').replace(/^0+/, '');
        if (cardId === key) {
            const hasBulk = state[key]?.bulk;
            const hasUr = state[key]?.ur;
            card.className = `card ${hasBulk ? 'has-bulk' : ''} ${hasUr ? 'has-ur' : ''} ${hasBulk && hasUr ? 'has-both' : ''}`;
        }
    });
}

function updateProgress() {
    let bulkCount = 0, urCount = 0;
    POKEMON_DATA.forEach(p => {
        const key = String(p.id);
        if (state[key]?.bulk || p.bulk) bulkCount++;
        if (state[key]?.ur || p.ur) urCount++;
    });
    
    const total = POKEMON_DATA.length;
    const pct = ((bulkCount / total) * 100).toFixed(1);
    
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${bulkCount} / ${total} (${pct}%)`;
    document.getElementById('stat-bulk').textContent = bulkCount;
    document.getElementById('stat-ur').textContent = urCount;
    document.getElementById('stat-missing').textContent = total - bulkCount;
}

function filterGen(gen) {
    currentFilter = gen;
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    if (gen === 'all') {
        document.querySelector('.filters button').classList.add('active');
    } else {
        document.querySelector(`[data-gen="${gen}"]`)?.classList.add('active');
    }
    renderGrid(gen, document.getElementById('search').value);
}

// Busca
document.getElementById('search').addEventListener('input', (e) => {
    renderGrid(currentFilter, e.target.value);
});

// Inicializar
renderGrid();
