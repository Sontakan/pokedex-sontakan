const API_URL = 'https://script.google.com/macros/s/AKfycby7gxgZXmayUv_d5toh2_loA8vEJxIZ_IwiSo92c5zTA5pwSBMa_kgUPIPgUUr-5G5rtA/exec'\;

let POKEMON_DATA = [];
let currentFilter = 'all';

// Carregar dados da planilha
async function loadData() {
    document.getElementById('pokemon-grid').innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;">⏳ Carregando da planilha...</p>';
    try {
        const resp = await fetch(API_URL + '?action=getData');
        POKEMON_DATA = await resp.json();
        initFilters();
        renderGrid();
    } catch(e) {
        document.getElementById('pokemon-grid').innerHTML = '<p style="text-align:center;grid-column:1/-1;color:red;">❌ Erro ao carregar. Tente recarregar.</p>';
        console.error(e);
    }
}

// Salvar na planilha
async function toggle(id, field, value) {
    // Atualizar visual imediatamente
    const p = POKEMON_DATA.find(p => p.id === id);
    if (p) p[field] = value;
    updateProgress();
    
    // Enviar para pconst API_URL = 'httd

let POKEMON_DATA = [];
let currentFilter = 'all';

// Carregar dados da planilha
async function loadData() {
    docuue }),
          let currentFilter = '-T
// Carregt/plain' }
        });
    } catch(e) {
          nsole.error('Erro ao salva    try {
        const resp = await fetch(API_URL + '?action=getData');
 rations = [...new Set(POKEMON_DATA.map(p => p.gen))];
    const filtersDiv = document.getElementById('gen-filters');
    filtersDiv.innerHTML = '';
    
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
}

// Renderizar grid
function renderGrid(filter, search) {
    filter = filter || currentFilter;
    search = search || '';
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';
    
    // Modo wishlist (somente leitura)
    const urlParams = new URLSearchParams(window.location.search);
    const missingFilter = urlParams.get('missing');
    
    let filtered = POKEMON_DATA;
    if (missingFilter) {
        filtered = filtered.filter(p => !p.bulk);
        if (missingFilter !== 'all') {
            const genMap = {'kanto':'1 - Kanto','johto':'2 - Johto','hoenn':'3 - Hoenn','sinnoh':'4 - Sinnoh','unova':'5 - Unova','kalos':'6 - Kalos','alola':'7 - Alola','galar':'8 - Galar','paldea':'9 - Paldea'};
            const gen = genMap[missingFilter.toLowerCase()];
            if (gen) filtered = filtered.filter(p => p.gen === gen);
        }
        document.querySelector('header h1').textContent = `📋 Faltam ${filtered.length} — ${missingFilter}`;
        document.getElementById('gen-filters').style.display = 'none';
    } else {
        if (filter !== 'all') filtered = filtered.filter(p => p.gen === filter);
        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || String(p.id).includes(search));
    }
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = `card ${p.bulk ? 'has-bulk' : ''} ${p.ur ? 'has-ur' : ''}`;
        
        if (missingFilter) {
            // Modo leitura - sem checkboxes
            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png" alt="${p.name}" loading="lazy">
                <div class="number">#${String(p.id).padStart(3, '0')}</div>
                <div class="name" title="${p.name}">${p.name}</div>
            `;
        } else {
            // Modo edição - com checkboxes
            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png" alt="${p.name}" loading="lazy">
                <div class="number">#${String(p.id).padStart(3, '0')}</div>
                <div class="name" title="${p.name}">${p.name}</div>
                <div class="checks">
                    <label><input type="checkbox" ${p.bulk ? 'checked' : ''} onchange="toggle(${p.id},'bulk',this.checked)">B</label>
                    <label><input type="checkbox" class="ur-check" ${p.ur ? 'checked' : ''} onchange="toggle(${p.id},'ur',this.checked)">UR</label>
                </div>
            `;
        }
        grid.appendChild(card);
    });
    
    updateProgress();
}

function updateProgress() {
    const total = POKEMON_DATA.length;
    const bulkCount = POKEMON_DATA.filter(p => p.bulk).length;
    const urCount = POKEMON_DATA.filter(p => p.ur).length;
    const pct = total > 0 ? ((bulkCount / total) * 100).toFixed(1) : 0;
    
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${bulkCount} / ${total} (${pct}%)`;
    document.getElementById('stat-bulk').textContent = bulkCount;
    document.getElementById('stat-ur').textContent = urCount;
    document.getElementById('stat-missing').textContent = total - bulkCount;
}

function filterGen(gen) {
    currentFilter = gen;
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    if (gen === 'all') document.querySelector('.filters button').classList.add('active');
    else document.querySelector(`[data-gen="${gen}"]`)?.classList.add('active');
    renderGrid(gen, document.getElementById('search').value);
}

document.getElementById('search').addEventListener('input', (e) => {
    renderGrid(currentFilter, e.target.value);
});

// Inicializar
loadData();
