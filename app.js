const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiwmUKZhkNoELu50kImXMH-S9zS_oXs-KjM0tmebM-ZRccAoYPj8DyHZmxQ5EZsviGbBbIKM2c3jpE/pub?gid=0&single=true&output=csv'\;
const API_URL = 'https://script.google.com/macros/s/AKfycby7gxgZXmayUv_d5toh2_loA8vEJxIZ_IwiSo92c5zTA5pwSBMa_kgUPIPgUUr-5G5rtA/exec'\;

let POKEMON_DATA = [];
let currentFilter = 'all';

// Parsear CSV
function parseCSV(csv) {
    const lines = csv.split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length >= 5 && cols[1] && !isNaN(cols[1])) {
            data.push({
                name: cols[0].replace(/"/g, '').trim(),
                id: parseInt(cols[1]),
                gen: cols[2].replace(/"/g, '').trim(),
                bulk: cols[3].trim() === 'TRUE',
                ur: cols[4].trim() === 'TRUE'
            });
        }
    }
    return data;
}

// Carregar dados do CSV publicado
async function loadData() {
    docconst CSV_URL = 'htt('const API_URL = 'https://script.google.com/macros/s/AKfycby7gxgZXmayUv_d5toh2_loA8vEJxIZ_IwiSo92c5zTA5pwSBMa_kgUPIPgUUr-5G5rtA/exec'\;

let POKEMON_DATA = [];
let currentFilter =  c
let POKEMON_DATA = [];
let currentFilter = 'all';

// Parsear CSV
function parseCSV(csv) {
    const lines = csv.split('\n');
    cdoclet currentFilter = ''p
// Parsear CSV
function  '<function pars-a    const lines = csv.s:1    const data = [];
    for (letga    for (let i = 1;.<        const cols = lines[i].split(',');
  S        if (cols.length >= 5 && cols[1] fu            data.push({
                name: cols[0].replac.f                name: 
                 id: parseInt(cols[1]),
               
                 gen: cols[2].replace( {                bulk: cols[3].trim() === 'TRUE',
    rs                ur: cols[4].trim() === 'TRUE'
 ,             });
        }
    }
    return dpe        }
   n'     }
          }

// Carregar      async function loadData() {
    d',    docconst CSV_URL = 'httF
let POKEMON_DATA = [];
let currentFilter =  c
let POKEMON_DATA = [];
let currentFilter = 'all';

// Parsear CSV
function parseCSV(csv) {
    const lines = csv.srHTlet currentFilter =  stlet POKEMON_DATA = []ealet currentFilter = 
  
// Parsear CSV
function odafunction parsn.    const lines = csv.s      cdoclet currentFilter = ''p
/('// Parsear CSV
function  '<funilfunction  '<f      for (letga    for (let i = 1;.<        const cols = lines[i].split(t(  S        if (cols.length >= 5 && cols[1] fu            data.push({
      on                name: cols[0].replac.f                name: 
                         id: parseInt(cols[1]),
               
   (f               
                 gen: |               
     rs                ur: cols[4].trim() === 'TRUE'
 ,             });
        }
    }
 g ,             });
        }
    }
    return dpe  U        }
    }
 nd    }
 tio    ar   n'     }
          Fi          Pa
// Carregmis    d',    docconst CSV_URL = 'httF
let POKA;let POKEMON_DATA = [];
let currentfilet currentFilter =  telet POKEMON_DATA = []  let currentFilter = '==
// Parsear CSV
function st function parsnt    const lines = csv.s'2  
// Parsear CSV
function odafunction parsn.    const lines = csv.s      cdoclet currentFi,'/lofunction odafa'/('// Parsear CSV
function  '<funilfunction  '<f      for (letga    for (let i = 1gFfunction  '<funie(      on                name: cols[0].replac.f                name: 
                         id: parseInt(cols[1]),
               
   (f               
                 g ?                        id: parseInt(cols[1]),
               
   }`               
   (f               
         ')   (f          =                 ge {     rs                ur: cols[4].tred ,             });
        }
    }
 g ,            if        }
    }
 d     }
 ged g ,te        }
    }
   er    }
  nc    s(    }
 nd    }
 tio    arSt nd (p tio   cl          Fi        
 // Carregmis    d',    h(let POKA;let POKEMON_DATA = [];
let currentfilmelet currentfilet currentFilteram// Parsear CSV
function st function parsnt    const lines = csv.s'2  
// Parsear iffunction st fer// Parsear CSV
function odafunction parsn.    const lmgfunction odaf/rfunction  '<funilfunction  '<f      for (letga    for (let i = 1gFfunction  '<funie(      on                n                           id: parseInt(cols[1]),
               
   (f               
                 g ?                        id: parseInt(cols[1])                 
   (f               
         L    (f                            g :/               
   }`               
   (f               
        ${   }`         ="   (f              "l         ')   (f             }
    }
 g ,            if        }
    }
 d     }
 ged g ,te        }
    }
   er    }
  nc    p.    }
 g{p g ,e}    }
 d     }
 ged g ,te v  d  s= ged g ">    }
   er    }
      ebe  nc   t type="checkbox" ${ tio   ?  // Carregmis    d', nge="toggle(${p.id},'bulk',let currentfilmelet cur>
                    <label><inputfunction st fun" class="ur-check" ${p.ur ? 'checked' : ''} onch//ge="toggle(${p.id},'ur',this.checked)">UR</label>
                </div>
            `;
                       
   (f               
                 ateProgress();
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

loadData();
