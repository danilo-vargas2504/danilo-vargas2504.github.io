// =============================
// MAPA INICIAL
// =============================
var map = L.map('map', { zoomControl: false }).setView([5.5990, -75.8190], 16);

L.control.zoom({ position: 'topright' }).addTo(map);

// =============================
// MAPAS BASE
// =============================
var baseLayers = {
    imagery: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri' }
    ),
    dark: L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 20 }
    ),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
    }),
};

baseLayers.imagery.addTo(map);

// =============================
// ÍCONOS SVG POR CAPA
// =============================
function svgIcon(svgContent) {
    return '<span class="layer-icon-svg">' + svgContent + '</span>';
}

var layerIcons = {
    'Limite Municipal': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="2.5 1.5"/>
    </svg>`),

    'Manzanas': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="11" height="11" rx="1" fill="rgba(46,204,113,0.35)" stroke="#2ECC71" stroke-width="1.4"/>
        <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="#2ECC71" stroke-width="0.8"/>
        <line x1="7" y1="1.5" x2="7" y2="12.5" stroke="#2ECC71" stroke-width="0.8"/>
    </svg>`),

    'Predios': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="11" height="11" rx="1" fill="rgba(191,191,191,0.35)" stroke="#BFBFBF" stroke-width="1.4"/>
        <rect x="4" y="4" width="6" height="6" fill="rgba(191,191,191,0.5)" stroke="#BFBFBF" stroke-width="0.8"/>
    </svg>`),

    'Drenaje': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 10.5 C3 8 4.5 6 7 6 C9.5 6 11 8 12.5 5.5" stroke="#00509f" stroke-width="2" stroke-linecap="round"/>
        <path d="M1.5 12 C3.5 9.5 5 7.5 7 7.5 C9 7.5 10.5 9.5 12.5 7" stroke="#00509f" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
    </svg>`),


    'Limites Viales': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 7 L12.5 7" stroke="#f5ff31" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="4" y1="4.5" x2="4" y2="9.5" stroke="#f5ff31" stroke-width="0.8" opacity="0.6"/>
        <line x1="7" y1="4.5" x2="7" y2="9.5" stroke="#f5ff31" stroke-width="0.8" opacity="0.6"/>
        <line x1="10" y1="4.5" x2="10" y2="9.5" stroke="#f5ff31" stroke-width="0.8" opacity="0.6"/>
    </svg>`),

    'Drenaje Jardin': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 10 C3 8 5 5.5 7 6 C9 6.5 11 9 12.5 7" stroke="#001077" stroke-width="2" stroke-linecap="round"/>
        <circle cx="7" cy="6" r="1.5" fill="#001077"/>
    </svg>`),

    'Predios Afectados': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="11" height="11" rx="1" fill="rgba(255,0,0,0.2)" stroke="#ff0000" stroke-width="1.5"/>
        <path d="M5 5 L9 9 M9 5 L5 9" stroke="#ff0000" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`),

    'Retiros Urbanos': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="3.5" width="11" height="7" rx="1" fill="rgba(28,212,229,0.2)" stroke="#1cd4e5" stroke-width="1.4"/>
        <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="#1cd4e5" stroke-width="0.9" stroke-dasharray="2 1.5"/>
    </svg>`),

    'Usos del Suelo 2026': svgIcon(`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="5" height="5" rx="0.8" fill="rgba(231,76,60,0.55)"  stroke="#e74c3c" stroke-width="1.1"/>
        <rect x="7.5" y="1.5" width="5" height="5" rx="0.8" fill="rgba(241,196,15,0.55)" stroke="#f1c40f" stroke-width="1.1"/>
        <rect x="1.5" y="7.5" width="5" height="5" rx="0.8" fill="rgba(41,128,185,0.55)" stroke="#2980b9" stroke-width="1.1"/>
        <rect x="7.5" y="7.5" width="5" height="5" rx="0.8" fill="rgba(142,68,173,0.55)" stroke="#8e44ad" stroke-width="1.1"/>
    </svg>`),
};

// =============================
// CONFIGURACIÓN DE CAPAS
// =============================
var capasConfig = [
    { key: 'Limite Municipal',    nombre: 'Limite Municipal',    url: 'data/Limite_Urbano_Jardin.json' },
    { key: 'Manzanas',            nombre: 'Manzanas',            url: 'data/Manzanas_Jardin.json' },
    { key: 'Predios',             nombre: 'Predios',             url: 'data/Predios_Jardin.json' },
    { key: 'Drenaje',             nombre: 'Drenaje',             url: 'data/Drenaje_L.json' },
    { key: 'Limites Viales',      nombre: 'Limites Viales',      url: 'data/Limites_Viales.json' },
    { key: 'Drenaje Jardin',      nombre: 'Drenaje Jardin',      url: 'data/Drenaje_Jardin.json' },
    { key: 'Predios Afectados',   nombre: 'Predios Afectados',   url: 'data/Predios_Afectados_Retiros.json' },
    { key: 'Retiros Urbanos',     nombre: 'Retiros Urbanos',     url: 'data/Retiros_urbanos_Hidrografia.json' },
    { key: 'Usos del Suelo 2026', nombre: 'Usos del Suelo 2026', url: 'data/Usos_suelos_2026.json' },
];

var capasGeoJSON  = {};
var capasLeaflet  = {};
var grupoCapasGeograficas = L.layerGroup().addTo(map);

// ── IMAGEN ZONIFICACION: bounds calculados desde EPSG:3116 → WGS84 ──
var zonificacionBounds = L.latLngBounds(
    [5.5883172, -75.8282371],   // SW
    [5.6064481, -75.8102472]    // NE
);
var capaZonificacion = L.imageOverlay(
    'data/ZONIFICACION.png',
    zonificacionBounds,
    { opacity: 0.85, interactive: false }
);

// =============================
// FUNCIÓN DE ESTILO – CAPAS GENERALES
// =============================
function estiloCapas(key) {
    switch (key) {
        case 'Limite Municipal':  return { color: 'black',   weight: 2, fillOpacity: 0 };
        case 'Predios':           return { color: 'black',   weight: 1, fillColor: '#BFBFBF', fillOpacity: 0.6 };
        case 'Manzanas':          return { color: 'black',   weight: 1, fillColor: '#2ECC71', fillOpacity: 0.5 };
        case 'Limites Viales':    return { color: '#f5ff31', weight: 2, fillOpacity: 0 };
        case 'Drenaje':           return { color: '#00509f', weight: 2, fillOpacity: 0 };
        case 'Predios Afectados': return { color: '#ff0000', weight: 2, fillOpacity: 0.3 };
        case 'Retiros Urbanos':   return { color: '#1cd4e5', weight: 2, fillOpacity: 0.25 };
        case 'Drenaje Jardin':    return { color: '#001077', weight: 2, fillOpacity: 0 };
    }
}

// ── IMAGEN ZONIFICACION: estilo por feature según Uso_General ──
function estiloUsoSuelo(feature) {
    var colores = {
        'Comercial':                  { fill: '#e74c3c', stroke: '#c0392b' },
        'Residencial':                { fill: '#f1c40f', stroke: '#d4ac0d' },
        'Servicios':                  { fill: '#795548', stroke: '#5d4037' },
        'Industrial':                 { fill: '#8e44ad', stroke: '#6c3483' },
        'Dotacional':                 { fill: '#2980b9', stroke: '#1a5276' },
        'Mixto':                      { fill: '#e91e8c', stroke: '#c2185b' },
        'Lote':                       { fill: '#ffffff', stroke: '#bdbdbd' },
        'Espacio Pubilico Existente': { fill: '#27ae60', stroke: '#1e8449' },
    };
    var uso = (feature.properties && feature.properties.Uso_General) || '';
    var c   = colores[uso] || { fill: '#aaaaaa', stroke: '#888888' };
    return { color: c.stroke, weight: 1, fillColor: c.fill, fillOpacity: 0.6, opacity: 1 };
}

// =============================
// POPUP DESDE ATRIBUTOS
// =============================
function popupDesdeAtributos(feature) {
    if (!feature.properties) return 'Sin atributos';
    var html = '';
    for (var campo in feature.properties) {
        html += '<b>' + campo + ':</b> ' + feature.properties[campo] + '<br>';
    }
    return html || 'Sin atributos';
}

// =============================
// CARGAR CAPA
// =============================
function cargarCapa(config) {
    fetch(config.url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON[config.key] = data;
            var optsLayer = {
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(popupDesdeAtributos(feature));
                }
            };
            if (config.key === 'Usos del Suelo 2026') {
                optsLayer.style = estiloUsoSuelo;
            } else {
                optsLayer.style = estiloCapas(config.key);
            }
            var layer = L.geoJSON(data, optsLayer);
            capasLeaflet[config.key] = layer;
            grupoCapasGeograficas.addLayer(layer);
            actualizarTreeControl();
        })
        .catch(error => console.error('Error cargando ' + config.url + ':', error));
}

// =============================
// SELECTOR CAPAS PARA TABLA
// =============================
function poblarSelectorCapas() {
    var selector = document.getElementById('selectorCapa');
    selector.innerHTML = '';
    capasConfig.forEach(capa => {
        var option = document.createElement('option');
        option.value       = capa.key;
        option.textContent = capa.nombre;
        selector.appendChild(option);
    });
}

function obtenerCapaSeleccionada() {
    var key    = document.getElementById('selectorCapa').value;
    var config = capasConfig.find(c => c.key === key);
    if (!config || !capasGeoJSON[key]) return null;
    return { key, data: capasGeoJSON[key], titulo: config.nombre };
}

// =============================
// CONTROL DE CAPAS AGRUPADO
// =============================
var treeControl = null;

function labelConIcono(key, nombre) {
    var icono = layerIcons[key] || '';
    return icono + nombre;
}

function actualizarTreeControl() {
    if (treeControl) treeControl.remove();

    var capasCatastrales = [
        { key: 'Predios',             nombre: 'Predios' },
        { key: 'Manzanas',            nombre: 'Manzanas' },
        { key: 'Limite Municipal',    nombre: 'Límite Municipal' },
        { key: 'Predios Afectados',   nombre: 'Predios Afectados' },
        { key: 'Retiros Urbanos',     nombre: 'Retiros Urbanos' },
        { key: 'Usos del Suelo 2026', nombre: 'Usos del Suelo 2026' },
    ];

    var cartografiaBasica = [
        { key: 'Limites Viales', nombre: 'Límites Viales' },
        { key: 'Drenaje',        nombre: 'Drenaje' },
        { key: 'Drenaje Jardin', nombre: 'Drenaje Jardín' },
    ];

    var iconoImagery = svgIcon(`<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="0.5" y="0.5" width="12" height="12" rx="1.5" fill="rgba(92,239,176,0.1)" stroke="#5cefb0" stroke-width="1"/>
        <circle cx="4" cy="4" r="1.5" fill="#5cefb0" opacity="0.7"/>
        <path d="M0.5 8.5 L4 5.5 L6.5 8 L9 6 L12.5 9.5" stroke="#5cefb0" stroke-width="1" fill="none"/>
    </svg>`);

    var iconoDark = svgIcon(`<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="0.5" y="0.5" width="12" height="12" rx="1.5" fill="#1c2430" stroke="#334155" stroke-width="1"/>
        <path d="M8 2.5 a4 4 0 1 0 0 8 a3 3 0 0 1 0-8z" fill="#94a3b8"/>
    </svg>`);

    var iconoTopo = svgIcon(`<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="0.5" y="0.5" width="12" height="12" rx="1.5" fill="rgba(139,101,56,0.15)" stroke="#8B6538" stroke-width="1"/>
        <path d="M1 10 L3.5 5.5 L6 8.5 L8 6 L11.5 10" stroke="#8B6538" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1 12 L13 12" stroke="#8B6538" stroke-width="0.8" opacity="0.5"/>
    </svg>`);

    // ── IMAGEN ZONIFICACION: ícono raster para el árbol ──
    var iconoZonificacion = '<span class="layer-icon-raster"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="1" y="1" width="12" height="12" rx="1.5" fill="rgba(92,239,176,0.08)" stroke="#5cefb0" stroke-width="1"/>' +
        '<rect x="2.5" y="2.5" width="4" height="4" fill="rgba(231,76,60,0.6)"/>' +
        '<rect x="7.5" y="2.5" width="4" height="4" fill="rgba(241,196,15,0.6)"/>' +
        '<rect x="2.5" y="7.5" width="4" height="4" fill="rgba(41,128,185,0.6)"/>' +
        '<rect x="7.5" y="7.5" width="4" height="4" fill="rgba(142,68,173,0.6)"/>' +
        '<line x1="6.5" y1="1" x2="6.5" y2="13" stroke="#5cefb0" stroke-width="0.5" opacity="0.5"/>' +
        '<line x1="1" y1="6.5" x2="13" y2="6.5" stroke="#5cefb0" stroke-width="0.5" opacity="0.5"/>' +
    '</svg></span>';

    var baseTree = {
        label: '<b style="color:#5cefb0;font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:0.06em;">MAPA BASE</b>',
        selectAllCheckbox: true,
        children: [
            { label: iconoImagery + 'Imagery',    layer: baseLayers.imagery },
            { label: iconoDark   + 'Dark',        layer: baseLayers.dark    },
            { label: iconoTopo   + 'OpenTopoMap', layer: baseLayers.topo    },
        ]
    };

    var overlaysTree = {
        label: '<b style="color:#5cefb0;font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:0.06em;">CAPAS GEOGRÁFICAS</b>',
        selectAllCheckbox: true,
        children: [
            {
                label: '<span style="color:#94a3b8;font-size:11px;font-weight:600;">Capas Catastrales</span>',
                selectAllCheckbox: true,
                children: capasCatastrales
                    .filter(c => capasLeaflet[c.key])
                    .map(c => ({ label: labelConIcono(c.key, c.nombre), layer: capasLeaflet[c.key] }))
            },
            {
                label: '<span style="color:#94a3b8;font-size:11px;font-weight:600;">Cartografía Básica</span>',
                selectAllCheckbox: true,
                children: cartografiaBasica
                    .filter(c => capasLeaflet[c.key])
                    .map(c => ({ label: labelConIcono(c.key, c.nombre), layer: capasLeaflet[c.key] }))
            },
            // ── IMAGEN ZONIFICACION: sección Imágenes en el árbol ──
            {
                label: '<span style="color:#94a3b8;font-size:11px;font-weight:600;">Imágenes</span>',
                selectAllCheckbox: true,
                children: [
                    { label: iconoZonificacion + 'Zonificación urbana de Jardín', layer: capaZonificacion }
                ]
            }
        ]
    };

    treeControl = L.control.layers.tree(baseTree, overlaysTree, {
        collapsed: false,
        position: 'topleft'
    }).addTo(map);
}

// =============================
// TABLA DE ATRIBUTOS
// =============================
function mostrarTablaAtributos(geojson, titulo) {
    var cont = document.getElementById('tablaContenido');
    if (!geojson.features.length) { cont.innerHTML = '<p>No hay datos.</p>'; return; }

    var campos = Object.keys(geojson.features[0].properties);
    var html = '<h3>Tabla – ' + titulo + '</h3><table><thead><tr>';
    campos.forEach(campo => html += '<th>' + campo + '</th>');
    html += '</tr></thead><tbody>';
    geojson.features.forEach(f => {
        html += '<tr>';
        campos.forEach(campo => html += '<td>' + (f.properties[campo] ?? '') + '</td>');
        html += '</tr>';
    });
    html += '</tbody></table>';
    cont.innerHTML = html;
}

// =============================
// DASHBOARD
// =============================
function mostrarDashboard(geojson, titulo) {
    var cont = document.getElementById('dashboardContenido');
    if (!geojson.features.length) { cont.innerHTML = '<p>No hay datos.</p>'; return; }
    cont.innerHTML =
        '<h3>Dashboard – ' + titulo + '</h3>' +
        '<p><b>Total de registros:</b> ' + geojson.features.length + '</p>' +
        '<p><b>Total de campos:</b> '    + Object.keys(geojson.features[0].properties).length + '</p>';
}

// =============================
// PANEL EXPANSIÓN
// =============================
function expandirPanel(idPanel) {
    var panel    = document.getElementById(idPanel);
    var cont     = document.getElementById('panelInferior');
    var consulta = document.getElementById('panelConsulta');

    var left   = consulta.offsetLeft + consulta.offsetWidth + 20;
    var top    = 12;
    var width  = cont.clientWidth - left - 12;
    var height = cont.clientHeight - 24;

    if (width  < 280) width  = 280;
    if (height < 140) height = 140;

    panel.style.left   = left   + 'px';
    panel.style.top    = top    + 'px';
    panel.style.width  = width  + 'px';
    panel.style.height = height + 'px';
}

// =============================
// MOSTRAR / OCULTAR PANEL
// =============================
function toggleDashboard() {
    var panel = document.getElementById('dashboard');
    var capa  = obtenerCapaSeleccionada();
    if (panel.style.display === 'none' || panel.style.display === '') {
        expandirPanel('dashboard');
        capa ? mostrarDashboard(capa.data, capa.titulo)
             : document.getElementById('dashboardContenido').innerHTML = '<p>No hay datos.</p>';
        panel.style.display = 'flex';
    } else {
        panel.style.display = 'none';
    }
}

function toggleTabla() {
    var panel = document.getElementById('tablaAtributos');
    var capa  = obtenerCapaSeleccionada();
    if (panel.style.display === 'none' || panel.style.display === '') {
        expandirPanel('tablaAtributos');
        capa ? mostrarTablaAtributos(capa.data, capa.titulo)
             : document.getElementById('tablaContenido').innerHTML = '<p>No hay datos.</p>';
        panel.style.display = 'flex';
    } else {
        panel.style.display = 'none';
    }
}

// =============================
// EVENTOS
// =============================
document.getElementById('selectorCapa').addEventListener('change', () => {
    var capa = obtenerCapaSeleccionada();
    if (document.getElementById('dashboard').style.display !== 'none')
        capa && mostrarDashboard(capa.data, capa.titulo);
    if (document.getElementById('tablaAtributos').style.display !== 'none')
        capa && mostrarTablaAtributos(capa.data, capa.titulo);
});

// =============================
// PANEL MÓVIL / ARRASTRE
// =============================
function hacerMovibleDentroDeContenedor(idPanel, selectorHeader, idContenedor) {
    var panel  = document.getElementById(idPanel);
    var header = panel.querySelector(selectorHeader);
    var cont   = document.getElementById(idContenedor);

    var offsetX = 0, offsetY = 0, mov = false;

    header.addEventListener('mousedown', e => {
        mov     = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!mov) return;
        var rect    = cont.getBoundingClientRect();
        var left    = e.clientX - rect.left  - offsetX;
        var top     = e.clientY - rect.top   - offsetY;
        var maxLeft = cont.clientWidth  - panel.offsetWidth;
        var maxTop  = cont.clientHeight - panel.offsetHeight;

        if (left < 0) left = 0;
        if (top  < 0) top  = 0;
        if (left > maxLeft) left = maxLeft;
        if (top  > maxTop)  top  = maxTop;

        panel.style.left = left + 'px';
        panel.style.top  = top  + 'px';
    });

    document.addEventListener('mouseup', () => mov = false);
}

// =============================
// REDIMENSIONAR PANEL
// =============================
function hacerVentanaRedimensionable(id) {
    var ventana = document.getElementById(id);
    var handle  = ventana.querySelector('.resize-handle');
    var cont    = document.getElementById('panelInferior');

    var red = false, startY = 0, startH = 0;

    handle.addEventListener('mousedown', e => {
        red    = true;
        startY = e.clientY;
        startH = parseInt(window.getComputedStyle(ventana).height, 10);
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!red) return;
        var h    = startH + (e.clientY - startY);
        var maxH = cont.clientHeight - ventana.offsetTop;
        if (h < 120)  h = 120;
        if (h > maxH) h = maxH;
        ventana.style.height = h + 'px';
    });

    document.addEventListener('mouseup', () => red = false);
}

// =============================
// REDIMENSIONAR MAPA
// =============================
var resizeBar     = document.getElementById('resizeBar');
var app           = document.getElementById('app');
var panelInferior = document.getElementById('panelInferior');
var redMap = false;

resizeBar.addEventListener('mousedown', e => { redMap = true; e.preventDefault(); });

document.addEventListener('mousemove', e => {
    if (!redMap) return;
    var appRect  = app.getBoundingClientRect();
    var nuevaH   = e.clientY - appRect.top;
    var total    = app.clientHeight;
    var minMapa  = 200;
    var minPanel = 160;

    if (nuevaH < minMapa)               nuevaH = minMapa;
    if (nuevaH > total - minPanel - 10) nuevaH = total - minPanel - 10;

    document.getElementById('map').style.height = nuevaH + 'px';
    panelInferior.style.height = (total - nuevaH - 10) + 'px';

    setTimeout(() => {
        map.invalidateSize();
        var dash  = document.getElementById('dashboard');
        var tabla = document.getElementById('tablaAtributos');
        if (dash.style.display  !== 'none') expandirPanel('dashboard');
        if (tabla.style.display !== 'none') expandirPanel('tablaAtributos');
    }, 10);
});

document.addEventListener('mouseup', () => redMap = false);

// =============================
// DIBUJO Y MEDICIÓN
// =============================
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

function formatearNumero(v) {
    return Number(v).toLocaleString('es-CO', { maximumFractionDigits: 2 });
}

function calcularLongitud(latlngs) {
    let total = 0;
    for (let i = 0; i < latlngs.length - 1; i++)
        total += latlngs[i].distanceTo(latlngs[i + 1]);
    return total;
}

function calcularPerimetro(latlngs) {
    let total = 0;
    for (let i = 0; i < latlngs.length; i++) {
        let sig = (i + 1) % latlngs.length;
        total += latlngs[i].distanceTo(latlngs[sig]);
    }
    return total;
}

function calcularAreaPoligono(latlngs) {
    let area = 0;
    let pts  = latlngs.map(ll => map.latLngToLayerPoint(ll));
    for (let i = 0; i < pts.length; i++) {
        let j = (i + 1) % pts.length;
        area += pts[i].x * pts[j].y;
        area -= pts[j].x * pts[i].y;
    }
    return Math.abs(area / 2);
}

function aplicarEstilo(layer, tipo) {
    if (tipo === 'polygon')   layer.setStyle({ color: 'green',  fillColor: 'green',  fillOpacity: 0.4 });
    if (tipo === 'rectangle') layer.setStyle({ color: 'red',    fillColor: 'red',    fillOpacity: 0.4 });
    if (tipo === 'polyline')  layer.setStyle({ color: 'orange' });
    if (tipo === 'circle')    layer.setStyle({ color: 'purple', fillColor: 'purple', fillOpacity: 0.3 });
}

function agregarPopup(layer, tipo) {
    let contenido = '';
    if (tipo === 'marker') {
        let c = layer.getLatLng();
        contenido = `<b>Punto</b><br>Latitud: ${formatearNumero(c.lat)}<br>Longitud: ${formatearNumero(c.lng)}`;
    }
    if (tipo === 'polyline') {
        let l = calcularLongitud(layer.getLatLngs());
        contenido = `<b>Línea</b><br>Longitud: ${formatearNumero(l)} m`;
    }
    if (tipo === 'polygon' || tipo === 'rectangle') {
        let ll   = layer.getLatLngs()[0];
        let area = calcularAreaPoligono(ll);
        let per  = calcularPerimetro(ll);
        contenido =
            `<b>${tipo === 'polygon' ? 'Polígono' : 'Rectángulo'}</b><br>` +
            `Área aprox.: ${formatearNumero(area)} px²<br>` +
            `Perímetro: ${formatearNumero(per)} m`;
    }
    if (tipo === 'circle') {
        let r    = layer.getRadius();
        let area = Math.PI * r * r;
        contenido =
            `<b>Círculo</b><br>` +
            `Radio: ${formatearNumero(r)} m<br>` +
            `Área: ${formatearNumero(area)} m²`;
    }
    layer.bindPopup(contenido);
}

var drawControl = new L.Control.Draw({
    position: 'topright',
    edit: { featureGroup: drawnItems },
    draw: {
        polygon:      { shapeOptions: { color: 'green',  fillColor: 'green',  fillOpacity: 0.4 } },
        polyline:     { shapeOptions: { color: 'orange' } },
        rectangle:    { shapeOptions: { color: 'red',    fillColor: 'red',    fillOpacity: 0.4 } },
        circle:       { shapeOptions: { color: 'purple', fillColor: 'purple', fillOpacity: 0.3 } },
        marker:       true,
        circlemarker: false
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
    var tipo  = e.layerType;
    aplicarEstilo(layer, tipo);
    agregarPopup(layer, tipo);
    drawnItems.addLayer(layer);
});

map.on('draw:edited', function (e) {
    e.layers.eachLayer(layer => {
        let tipo = '';
        if (layer instanceof L.Marker)    tipo = 'marker';
        else if (layer instanceof L.Circle)    tipo = 'circle';
        else if (layer instanceof L.Rectangle) tipo = 'rectangle';
        else if (layer instanceof L.Polygon)   tipo = 'polygon';
        else if (layer instanceof L.Polyline)  tipo = 'polyline';
        agregarPopup(layer, tipo);
    });
});

var measureControl = new L.Control.Measure({
    position: 'topright',
    primaryLengthUnit:   'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit:     'sqmeters',
    secondaryAreaUnit:   'hectares',
    activeColor:    '#5cefb0',
    completedColor: '#38bdf8'
});
measureControl.addTo(map);

// =============================
// ACTIVACIÓN
// =============================
poblarSelectorCapas();
capasConfig.forEach(cargarCapa);

hacerMovibleDentroDeContenedor('panelConsulta',   '.panel-botones-header', 'panelInferior');
hacerMovibleDentroDeContenedor('dashboard',       '.panel-header',         'panelInferior');
hacerMovibleDentroDeContenedor('tablaAtributos',  '.panel-header',         'panelInferior');

hacerVentanaRedimensionable('dashboard');
hacerVentanaRedimensionable('tablaAtributos');

// =============================
// ÍCONOS PERSONALIZADOS – DRAW & MEASURE
// =============================
(function injectarIconosDraw() {

    var ICONS = {
        'leaflet-draw-draw-polyline': {
            title: 'Línea',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3" cy="15" r="1.8" stroke="#e2e8f0" stroke-width="1.3"/>
                <circle cx="15" cy="3" r="1.8" stroke="#e2e8f0" stroke-width="1.3"/>
                <line x1="4.2" y1="13.8" x2="13.8" y2="4.2" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2.5 2"/>
            </svg>`
        },
        'leaflet-draw-draw-polygon': {
            title: 'Polígono',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="9,2 16,6.5 16,11.5 9,16 2,11.5 2,6.5"
                    stroke="#e2e8f0" stroke-width="1.4" fill="rgba(226,232,240,0.08)" stroke-linejoin="round"/>
            </svg>`
        },
        'leaflet-draw-draw-rectangle': {
            title: 'Rectángulo',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.5" y="4.5" width="13" height="9" rx="1.2"
                    stroke="#e2e8f0" stroke-width="1.4" fill="rgba(226,232,240,0.08)"/>
            </svg>`
        },
        'leaflet-draw-draw-circle': {
            title: 'Círculo',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6.5" stroke="#e2e8f0" stroke-width="1.4" fill="rgba(226,232,240,0.08)"/>
                <line x1="9" y1="9" x2="15.5" y2="9" stroke="#e2e8f0" stroke-width="1.2" stroke-dasharray="1.5 1.5"/>
                <circle cx="9" cy="9" r="1.2" fill="#e2e8f0"/>
            </svg>`
        },
        'leaflet-draw-draw-marker': {
            title: 'Punto',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2.5C6.51 2.5 4.5 4.51 4.5 7c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.49-2.01-4.5-4.5-4.5z"
                    stroke="#e2e8f0" stroke-width="1.4" fill="rgba(226,232,240,0.12)"/>
                <circle cx="9" cy="7" r="1.5" fill="#e2e8f0"/>
            </svg>`
        },
        'leaflet-draw-edit-edit': {
            title: 'Editar',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 3.5l3 3L6 15H3v-3L11.5 3.5z"
                    stroke="#e2e8f0" stroke-width="1.4" fill="rgba(226,232,240,0.08)" stroke-linejoin="round"/>
                <line x1="9.5" y1="5.5" x2="12.5" y2="8.5" stroke="#e2e8f0" stroke-width="1.2"/>
            </svg>`
        },
        'leaflet-draw-edit-remove': {
            title: 'Eliminar',
            svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="7" width="10" height="8.5" rx="1" stroke="#e2e8f0" stroke-width="1.3"/>
                <line x1="2.5" y1="7" x2="15.5" y2="7" stroke="#e2e8f0" stroke-width="1.3" stroke-linecap="round"/>
                <path d="M7 7V5.5A1.5 1.5 0 0 1 11 5.5V7" stroke="#e2e8f0" stroke-width="1.3"/>
                <line x1="7.5" y1="10" x2="7.5" y2="13" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round"/>
                <line x1="10.5" y1="10" x2="10.5" y2="13" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round"/>
            </svg>`
        }
    };

    var MEASURE_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="6" width="15" height="6" rx="1.2" stroke="#e2e8f0" stroke-width="1.4"/>
        <line x1="4" y1="9" x2="4" y2="12" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="7" y1="9" x2="7" y2="11" stroke="#e2e8f0" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="10" y1="9" x2="10" y2="11" stroke="#e2e8f0" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="13" y1="9" x2="13" y2="12" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`;

    function aplicarIconos() {
        Object.keys(ICONS).forEach(function(cls) {
            var btn = document.querySelector('.' + cls);
            if (!btn) return;
            if (btn.querySelector('svg')) return;
            var info = ICONS[cls];
            btn.innerHTML = info.svg;
            btn.setAttribute('title', info.title);
            btn.style.fontSize = '0';
            btn.style.textIndent = '-9999px';
        });
        var measureBtn = document.querySelector('.leaflet-control-measure a.leaflet-measure-action');
        if (measureBtn && !measureBtn.querySelector('svg')) {
            measureBtn.innerHTML = MEASURE_SVG;
            measureBtn.setAttribute('title', 'Medir');
        }
    }

    var observer = new MutationObserver(function() { aplicarIconos(); });
    observer.observe(document.body, { childList: true, subtree: true });
    aplicarIconos();
    window.addEventListener('load', function() {
        aplicarIconos();
        setTimeout(aplicarIconos, 300);
    });
})();

// ============================================================
// STREET VIEW – Mapillary API v4 (con fallback KartaView)
// ============================================================

var MAPILLARY_TOKEN = 'MLY|27027349380288877|e5c51c6eb2e3bef98b011a4aab375a14';

var streetViewActivo = false;
var streetViewMarker = null;

var ControlStreetView = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        var btn = L.DomUtil.create('a', 'sv-btn', container);
        btn.id        = 'btnStreetView';
        btn.href      = '#';
        btn.title     = 'Street View';
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3" stroke="#e2e8f0" stroke-width="1.4"/>
            <path d="M3 15.5c0-3.314 2.686-5.5 6-5.5s6 2.186 6 5.5" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round"/>
            <path d="M13 7.5l3 1.5-3 1.5" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        L.DomEvent.on(btn, 'click', function (e) {
            L.DomEvent.preventDefault(e);
            toggleModoStreetView();
        });
        L.DomEvent.disableClickPropagation(container);
        return container;
    }
});
new ControlStreetView().addTo(map);

function toggleModoStreetView() {
    streetViewActivo = !streetViewActivo;
    var btn = document.getElementById('btnStreetView');
    if (streetViewActivo) {
        map.getContainer().style.cursor = 'crosshair';
        btn.classList.add('sv-btn-activo');
        mostrarToastSV('📍 Haz clic en el mapa para activar Street View');
        map.on('click', onMapClickStreetView);
    } else {
        desactivarStreetView();
    }
}

function desactivarStreetView() {
    streetViewActivo = false;
    map.getContainer().style.cursor = '';
    var btn = document.getElementById('btnStreetView');
    if (btn) btn.classList.remove('sv-btn-activo');
    map.off('click', onMapClickStreetView);
    if (streetViewMarker) { map.removeLayer(streetViewMarker); streetViewMarker = null; }
    ocultarPanelSV();
}

function onMapClickStreetView(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    if (streetViewMarker) map.removeLayer(streetViewMarker);
    streetViewMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: '',
            html: `<div class="sv-marker-pin"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);

    mostrarPanelSV();
    setSVEstado('cargando', 'Buscando panorama y dirección…');

    Promise.allSettled([
        geocodificarInverso(lat, lng),
        buscarMapillary(lat, lng)
    ]).then(function(results) {
        var geoRes    = results[0];
        var mapRes    = results[1];
        var direccion = geoRes.status === 'fulfilled' ? geoRes.value : 'Dirección no disponible';
        var mapData   = mapRes.status === 'fulfilled' ? mapRes.value : null;
        actualizarInfoSV(lat, lng, direccion);
        if (mapData && mapData.id) {
            mostrarVisorMapillary(mapData, lat, lng);
        } else {
            buscarKartaView(lat, lng).then(function(kv) {
                if (kv && kv.id) {
                    mostrarVisorKartaView(kv, lat, lng);
                } else {
                    setSVEstado('vacio',
                        'No se encontró ningún panorama cercano.<br>' +
                        '<small>Prueba en una calle principal o zona urbana.</small>');
                }
            });
        }
    });
}

function geocodificarInverso(lat, lng) {
    var url = 'https://nominatim.openstreetmap.org/reverse?lat=' + lat +
              '&lon=' + lng + '&format=json&addressdetails=1';
    return fetch(url, { headers: { 'Accept-Language': 'es' } })
        .then(function(r) { return r.json(); })
        .then(function(d) { return d.display_name || 'Sin dirección'; })
        .catch(function() { return 'Sin dirección'; });
}

function buscarMapillary(lat, lng) {
    var url = 'https://graph.mapillary.com/images?access_token=' + MAPILLARY_TOKEN +
              '&fields=id,thumb_1024_url,computed_geometry,captured_at' +
              '&bbox=' + (lng - 0.001) + ',' + (lat - 0.001) + ',' +
                         (lng + 0.001) + ',' + (lat + 0.001) +
              '&limit=10';
    return fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (!d.data || !d.data.length) return null;
            var mejor = d.data.reduce(function(acc, img) {
                if (!img.computed_geometry) return acc;
                var c    = img.computed_geometry.coordinates;
                var dist = distanciaHaversine(lat, lng, c[1], c[0]);
                return (!acc || dist < acc.dist) ? Object.assign({}, img, { dist: dist }) : acc;
            }, null);
            return mejor;
        })
        .catch(function() { return null; });
}

function buscarKartaView(lat, lng) {
    var url = 'https://api.kartaview.org/1.0/photo/?lat=' + lat +
              '&lng=' + lng + '&distance=150&limit=5&format=json';
    return fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(d) {
            var fotos = d.result && d.result.data ? d.result.data : [];
            if (!fotos.length) return null;
            var mejor = fotos.reduce(function(acc, f) {
                var dist = distanciaHaversine(lat, lng, parseFloat(f.lat), parseFloat(f.lng));
                return (!acc || dist < acc.dist) ? Object.assign({}, f, { dist: dist }) : acc;
            }, null);
            return mejor;
        })
        .catch(function() { return null; });
}

function distanciaHaversine(lat1, lng1, lat2, lng2) {
    var R    = 6371000;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mostrarVisorMapillary(img, latClick, lngClick) {
    var dist    = Math.round(img.dist || 0);
    var fecha   = img.captured_at ? new Date(img.captured_at).toLocaleDateString('es-CO') : '';
    var distMsg = dist > 5
        ? '<div class="sv-dist-badge">📍 Panorama a ' + dist + ' m del punto seleccionado</div>'
        : '';
    document.getElementById('svVisor').innerHTML =
        distMsg +
        '<img src="' + img.thumb_1024_url + '" alt="Street View Mapillary" class="sv-imagen" loading="lazy" ' +
        'onerror="this.parentElement.innerHTML=\'<div class=sv-error>No se pudo cargar la imagen.</div>\'"/>' +
        '<div class="sv-footer">' +
            '<span>📷 Mapillary</span>' +
            (fecha ? '<span>' + fecha + '</span>' : '') +
            '<a href="https://www.mapillary.com/map/im/' + img.id + '" target="_blank" class="sv-link">Ver en Mapillary ↗</a>' +
        '</div>';
    setSVEstado('ok');
}

function mostrarVisorKartaView(foto, latClick, lngClick) {
    var dist   = Math.round(foto.dist || 0);
    var imgUrl = foto.fileurlLarg || foto.fileurlProc || foto.filepathProc || '';
    if (!imgUrl) { setSVEstado('vacio', 'Imagen KartaView no disponible.'); return; }
    var distMsg = dist > 5
        ? '<div class="sv-dist-badge">📍 Panorama a ' + dist + ' m del punto seleccionado</div>'
        : '';
    document.getElementById('svVisor').innerHTML =
        distMsg +
        '<img src="' + imgUrl + '" alt="Street View KartaView" class="sv-imagen" loading="lazy" ' +
        'onerror="this.parentElement.innerHTML=\'<div class=sv-error>No se pudo cargar la imagen.</div>\'"/>' +
        '<div class="sv-footer">' +
            '<span>📷 KartaView</span>' +
            '<a href="https://kartaview.org/details/' + foto.id + '/1/track-info" target="_blank" class="sv-link">Ver en KartaView ↗</a>' +
        '</div>';
    setSVEstado('ok');
}

function mostrarPanelSV() {
    document.getElementById('panelStreetView').style.display = 'flex';
}

function ocultarPanelSV() {
    document.getElementById('panelStreetView').style.display = 'none';
}

function setSVEstado(estado, msg) {
    var visor = document.getElementById('svVisor');
    if (estado === 'cargando') {
        visor.innerHTML =
            '<div class="sv-loading">' +
                '<div class="sv-spinner"></div>' +
                '<span>' + (msg || 'Cargando…') + '</span>' +
            '</div>';
    } else if (estado === 'vacio') {
        visor.innerHTML = '<div class="sv-vacio">' + (msg || 'Sin panorama disponible.') + '</div>';
    }
}

function actualizarInfoSV(lat, lng, direccion) {
    document.getElementById('svCoordenadas').textContent =
        lat.toFixed(6) + ', ' + lng.toFixed(6);
    document.getElementById('svDireccion').textContent = direccion;
}

function mostrarToastSV(msg) {
    var t = document.getElementById('svToast');
    t.textContent = msg;
    t.classList.add('sv-toast-visible');
    setTimeout(function() { t.classList.remove('sv-toast-visible'); }, 3000);
}

hacerMovibleDentroDeContenedor('panelStreetView', '#svHeader', 'panelInferior');