const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiwmUKZhkNoELu50kImXMH-S9zS_oXs-KjM0tmebM-ZRccAoYPj8DyHZmxQ5EZsviGbBbIKM2c3jpE/pub?gid=0&single=true&output=csv";
const API_URL = "https://script.google.com/macros/s/AKfycby7gxgZXmayUv_d5toh2_loA8vEJxIZ_IwiSo92c5zTA5pwSBMa_kgUPIPgUUr-5G5rtA/exec";

var POKEMON_DATA = [];
var currentFilter = "all";
var currentMode = "edit";

function parseCSV(csv) {
    var lines = csv.split("\n");
    var data = [];
    for (var i = 1; i < lines.length; i++) {
        var cols = lines[i].split(",");
        if (cols.length >= 5 && cols[1] && !isNaN(cols[1])) {
            data.push({
                name: cols[0].replace(/"/g, "").trim(),
                id: parseInt(cols[1]),
                gen: cols[2].replace(/"/g, "").trim(),
                bulk: cols[3].trim() === "TRUE",
                ur: cols[4].trim() === "TRUE"
            });
        }
    }
    return data;
}

async function loadData() {
    document.getElementById("pokemon-grid").innerHTML = "<p style='text-align:center;grid-column:1/-1;padding:40px'>Loading...</p>";
    try {
        var resp = await fetch(CSV_URL);
        var csv = await resp.text();
        POKEMON_DATA = parseCSV(csv);
        initFilters();
        renderGrid();
    } catch(e) {
        document.getElementById("pokemon-grid").innerHTML = "<p style='text-align:center;grid-column:1/-1;color:red'>Error loading data</p>";
        console.error(e);
    }
}

async function toggle(id, field, value) {
    var p = POKEMON_DATA.find(function(p) { return p.id === id; });
    if (p) p[field] = value;
    updateProgress();
    try {
        await fetch(API_URL, { method: "POST", mode: "no-cors", body: JSON.stringify({ id: id, field: field, value: value }) });
    } catch(e) { console.error(e); }
}

function initFilters() {
    var gens = [];
    POKEMON_DATA.forEach(function(p) { if (gens.indexOf(p.gen) === -1) gens.push(p.gen); });
    var div = document.getElementById("gen-filters");
    div.innerHTML = "";
    var btn = document.createElement("button");
    btn.textContent = "Todas";
    btn.className = "active";
    btn.onclick = function() { filterGen("all"); };
    div.appendChild(btn);
    gens.forEach(function(gen) {
        var b = document.createElement("button");
        b.textContent = gen.replace(" - ", ": ");
        b.onclick = function() { filterGen(gen); };
        b.setAttribute("data-gen", gen);
        div.appendChild(b);
    });
}

function renderGrid(filter, search) {
    filter = filter || currentFilter;
    search = search || "";
    var grid = document.getElementById("pokemon-grid");
    grid.innerHTML = "";
    var urlParams = new URLSearchParams(window.location.search);
    var missingFilter = urlParams.get("missing");
    var filtered = POKEMON_DATA.slice();
    if (missingFilter) {
        filtered = filtered.filter(function(p) { return !p.bulk; });
        var genMap = {kanto:"1 - Kanto",johto:"2 - Johto",hoenn:"3 - Hoenn",sinnoh:"4 - Sinnoh",unova:"5 - Unova",kalos:"6 - Kalos",alola:"7 - Alola",galar:"8 - Galar",paldea:"9 - Paldea"};
        if (missingFilter !== "all" && genMap[missingFilter.toLowerCase()]) {
            var g = genMap[missingFilter.toLowerCase()];
            filtered = filtered.filter(function(p) { return p.gen === g; });
        }
        document.querySelector("header h1").textContent = "Faltam " + filtered.length + " - " + missingFilter;
        document.getElementById("gen-filters").style.display = "none";
    } else {
        if (filter !== "all") filtered = filtered.filter(function(p) { return p.gen === filter; });
        if (search) filtered = filtered.filter(function(p) { return p.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || String(p.id).indexOf(search) !== -1; });
    }
    filtered.forEach(function(p) {
        var card = document.createElement("div");
        card.className = "card" + (p.bulk ? " has-bulk" : "") + (p.ur ? " has-ur" : "");
        var html = "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + p.id + ".png' loading='lazy'>";
        html += "<div class='number'>#" + String(p.id).padStart(3, "0") + "</div>";
        html += "<div class='name'>" + p.name + "</div>";
        if (!missingFilter && currentMode === "edit") {
            html += "<div class='checks'>";
            html += "<label><input type='checkbox' " + (p.bulk ? "checked" : "") + " onchange='toggle(" + p.id + ",\"bulk\",this.checked)'>B</label>";
            html += "<label><input type='checkbox' class='ur-check' " + (p.ur ? "checked" : "") + " onchange='toggle(" + p.id + ",\"ur\",this.checked)'>UR</label>";
            html += "</div>";
        }
        card.innerHTML = html;
        grid.appendChild(card);
    });
    updateProgress();
}

function updateProgress() {
    var total = POKEMON_DATA.length;
    var bulkCount = POKEMON_DATA.filter(function(p) { return p.bulk; }).length;
    var urCount = POKEMON_DATA.filter(function(p) { return p.ur; }).length;
    var pct = total > 0 ? ((bulkCount / total) * 100).toFixed(1) : 0;
    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("progress-text").textContent = bulkCount + " / " + total + " (" + pct + "%)";
    document.getElementById("stat-bulk").textContent = bulkCount;
    document.getElementById("stat-ur").textContent = urCount;
    document.getElementById("stat-missing").textContent = total - bulkCount;
}

function filterGen(gen) {
    currentFilter = gen;
    var buttons = document.querySelectorAll(".filters button");
    buttons.forEach(function(b) { b.classList.remove("active"); });
    if (gen === "all") document.querySelector(".filters button").classList.add("active");
    else { var el = document.querySelector("[data-gen='" + gen + "']"); if (el) el.classList.add("active"); }
    renderGrid(gen, document.getElementById("search").value);
}

document.getElementById("search").addEventListener("input", function(e) {
    renderGrid(currentFilter, e.target.value);
});

function setMode(mode) {
    currentMode = mode;
    document.getElementById("btn-edit").className = mode === "edit" ? "active" : "";
    document.getElementById("btn-read").className = mode === "read" ? "active" : "";
    renderGrid(currentFilter, document.getElementById("search").value);
}

// Se URL tem ?missing, esconde toggle e força modo leitura
(function() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("missing")) {
        currentMode = "read";
        var toggle = document.querySelector(".mode-toggle");
        if (toggle) toggle.style.display = "none";
        var wishlinks = document.querySelector(".wishlist-links");
        if (wishlinks) wishlinks.style.display = "none";
    }
})();

loadData();
