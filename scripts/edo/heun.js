// heun.js - Método de Heun para EDOs
document.addEventListener('DOMContentLoaded', function() {
    console.log('Heun.js: Cargado');
    
    // Escuchar cuando la sección de EDO se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'edo') {
            console.log('Heun.js: Sección EDO activada');
            setTimeout(inicializarHeun, 300);
        }
    });
    
    // Escuchar cuando se seleccione el método de Heun
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'heun') {
            console.log('Heun.js: Método Heun seleccionado');
            setTimeout(inicializarHeun, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarHeunVisibilidad, 1000);
});

function verificarHeunVisibilidad() {
    const heunContent = document.getElementById('heun-content');
    if (heunContent && !heunContent.classList.contains('hidden')) {
        console.log('Heun.js: Ya visible al cargar');
        inicializarHeun();
    }
}

function inicializarHeun() {
    console.log('Heun.js: Inicializando...');
    
    const heunContent = document.getElementById('heun-content');
    if (!heunContent) {
        console.error('Heun.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE
    if (heunContent.innerHTML.trim() === '' || !document.getElementById('heun-func')) {
        console.log('Heun.js: Creando interfaz...');
        crearInterfazHeun();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES
    asignarEventosHeun();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO
    cargarEjemploInicialHeun();
}

function crearInterfazHeun() {
    const content = document.getElementById('heun-content');
    
    content.innerHTML = `
        <div class="input-section">
            <div class="method-header">
                <h3><i class="fas fa-chart-line"></i> Método de Heun (Euler Mejorado)</h3>
                <div class="method-tag" style="background: #9b59b6; color: white;">
                    <i class="fas fa-star"></i> Método de Orden 2
                </div>
            </div>
            
            <p class="method-description">Método predictor-corrector que mejora la precisión del método de Euler usando un promedio de pendientes.</p>
            
            <div class="info-box">
                <div class="info-header">
                    <i class="fas fa-calculator"></i>
                    <strong>Fórmula:</strong>
                </div>
                <div class="info-content">
                    <p><strong>Predictor (Euler):</strong> ỹₙ₊₁ = yₙ + h·f(xₙ, yₙ)</p>
                    <p><strong>Corrector (Heun):</strong> yₙ₊₁ = yₙ + h·[f(xₙ, yₙ) + f(xₙ₊₁, ỹₙ₊₁)] / 2</p>
                    <p><strong>Error:</strong> O(h²) - Local, O(h²) - Global</p>
                </div>
            </div>
            
            <div class="input-grid">
                <div class="input-group full-width">
                    <label for="heun-func">
                        <i class="fas fa-function"></i> EDO: dy/dx = f(x, y)
                    </label>
                    <input type="text" id="heun-func" placeholder="ej: y - x^2 + 1">
                    <div class="input-hint">
                        Usa 'x' para variable independiente, 'y' para dependiente
                    </div>
                </div>
                
                <div class="input-row">
                    <div class="input-group">
                        <label for="heun-x0"><i class="fas fa-play"></i> x inicial (x₀)</label>
                        <input type="number" id="heun-x0" value="0" step="0.1">
                    </div>
                    <div class="input-group">
                        <label for="heun-y0"><i class="fas fa-play-circle"></i> y inicial (y₀)</label>
                        <input type="number" id="heun-y0" value="0.5" step="0.1">
                    </div>
                </div>
                
                <div class="input-row">
                    <div class="input-group">
                        <label for="heun-xf"><i class="fas fa-stop"></i> x final (x_f)</label>
                        <input type="number" id="heun-xf" value="2" step="0.1">
                    </div>
                    <div class="input-group">
                        <label for="heun-h"><i class="fas fa-ruler"></i> Tamaño de paso (h)</label>
                        <input type="number" id="heun-h" value="0.2" step="0.01" min="0.001">
                        <div class="input-hint">Método más preciso, permite pasos más grandes</div>
                    </div>
                </div>
                
                <div class="input-group full-width">
                    <label for="heun-sol-exacta">
                        <i class="fas fa-check-double"></i> Solución exacta (opcional)
                    </label>
                    <input type="text" id="heun-sol-exacta" placeholder="ej: (x+1)^2 - 0.5*exp(x)">
                    <div class="input-hint">Para comparar precisión y calcular error</div>
                </div>
                
                <div class="input-group full-width">
                    <label for="heun-iter-corrector">
                        <i class="fas fa-redo"></i> Iteraciones del corrector
                    </label>
                    <select id="heun-iter-corrector">
                        <option value="1">1 iteración (Heun estándar)</option>
                        <option value="2">2 iteraciones</option>
                        <option value="3">3 iteraciones</option>
                        <option value="5">5 iteraciones</option>
                        <option value="10">Hasta convergencia (tol=1e-6)</option>
                    </select>
                    <div class="input-hint">Más iteraciones = más preciso pero más lento</div>
                </div>
            </div>
            
            <div class="parameter-controls">
                <div class="param-control">
                    <label>Comparar con Euler:</label>
                    <div class="comparison-buttons">
                        <button class="compare-btn" data-method="euler">
                            <i class="fas fa-balance-scale"></i> Ejecutar Euler
                        </button>
                        <button class="compare-btn" data-method="ambos">
                            <i class="fas fa-chart-bar"></i> Comparar Ambos
                        </button>
                    </div>
                </div>
                
                <div class="visualization-controls">
                    <label>
                        <input type="checkbox" id="heun-show-predictor" checked>
                        <span>Mostrar predictor (Euler)</span>
                    </label>
                    <label>
                        <input type="checkbox" id="heun-show-corrector" checked>
                        <span>Mostrar corrector (Heun)</span>
                    </label>
                    <label>
                        <input type="checkbox" id="heun-show-exact" checked>
                        <span>Mostrar solución exacta</span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="heun-calc" class="calc-btn primary" style="background: #9b59b6;">
                    <i class="fas fa-play-circle"></i> Ejecutar Heun
                </button>
                <button id="heun-ejemplo" class="example-btn">
                    <i class="fas fa-vial"></i> Ejemplos
                </button>
                <button id="heun-clear" class="clear-btn">
                    <i class="fas fa-eraser"></i> Limpiar
                </button>
                <button id="heun-export" class="export-btn">
                    <i class="fas fa-download"></i> Exportar
                </button>
                <button id="heun-info" class="info-btn">
                    <i class="fas fa-info-circle"></i> Teoría
                </button>
            </div>
        </div>
        
        <div class="results-section">
            <div class="results-header">
                <h3><i class="fas fa-poll"></i> Resultados del Método de Heun</h3>
                <div class="results-stats" id="heun-stats"></div>
            </div>
            
            <div class="result-summary">
                <div class="result-card highlight" style="border-color: #9b59b6;">
                    <div class="result-icon" style="background: #9b59b6;">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Valor final y(x_f)</h4>
                        <p id="heun-yfinal" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-redo"></i>
                    </div>
                    <div class="result-content">
                        <h4>Iteraciones totales</h4>
                        <p id="heun-iteraciones" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="result-content">
                        <h4>Precisión (vs Euler)</h4>
                        <p id="heun-precision" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="result-content">
                        <h4>Tiempo de cómputo</h4>
                        <p id="heun-tiempo" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <div class="chart-header">
                        <h4><i class="fas fa-chart-area"></i> Solución Numérica</h4>
                        <div class="chart-legend" id="heun-chart-legend"></div>
                    </div>
                    <div class="chart-wrapper">
                        <canvas id="heun-chart"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <div class="table-header">
                        <h4><i class="fas fa-table"></i> Proceso Predictor-Corrector</h4>
                        <div class="table-actions">
                            <button class="table-action" id="heun-table-prev">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <span id="heun-table-info">Página 1/1</span>
                            <button class="table-action" id="heun-table-next">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="table-wrapper">
                        <table id="heun-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-hashtag"></i> n</th>
                                    <th><i class="fas fa-x"></i> xₙ</th>
                                    <th><i class="fas fa-y"></i> yₙ (Heun)</th>
                                    <th><i class="fas fa-arrow-right"></i> ỹₙ₊₁ (Predictor)</th>
                                    <th><i class="fas fa-sliders-h"></i> Pendiente Media</th>
                                    <th><i class="fas fa-percentage"></i> Error Local</th>
                                </tr>
                            </thead>
                            <tbody id="heun-table-body">
                                <tr><td colspan="6" class="empty-table">Ejecuta el método para ver resultados</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="comparison-section" id="heun-comparison-section" style="display: none;">
                <h4><i class="fas fa-balance-scale"></i> Comparación Heun vs Euler</h4>
                <div class="comparison-charts">
                    <div class="comparison-chart">
                        <canvas id="heun-euler-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="comparison-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>y(x_f)</th>
                                    <th>Error Global</th>
                                    <th>Iteraciones</th>
                                    <th>Tiempo (ms)</th>
                                    <th>Precisión</th>
                                </tr>
                            </thead>
                            <tbody id="comparison-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="error-analysis">
                <h4><i class="fas fa-chart-bar"></i> Evolución del Error</h4>
                <div class="chart-wrapper">
                    <canvas id="heun-error-chart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    console.log('Heun.js: Interfaz creada correctamente');
    inicializarControlesHeun();
}

function inicializarControlesHeun() {
    // Botones de comparación con Euler
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.dataset.method;
            if (method === 'euler') {
                ejecutarComparacionEuler();
            } else if (method === 'ambos') {
                ejecutarComparacionCompleta();
            }
        });
    });
    
    // Botones de navegación de tabla
    const prevBtn = document.getElementById('heun-table-prev');
    const nextBtn = document.getElementById('heun-table-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => navegarTablaHeun(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navegarTablaHeun(1));
    
    // Botón de exportar
    const exportBtn = document.getElementById('heun-export');
    if (exportBtn) exportBtn.addEventListener('click', exportarDatosHeun);
    
    // Botón de información teórica
    const infoBtn = document.getElementById('heun-info');
    if (infoBtn) infoBtn.addEventListener('click', mostrarTeoriaHeun);
}

let currentTablePageHeun = 1;
const rowsPerPageHeun = 12;

function navegarTablaHeun(direction) {
    currentTablePageHeun = Math.max(1, currentTablePageHeun + direction);
    actualizarPaginacionHeun();
}

function actualizarPaginacionHeun() {
    const info = document.getElementById('heun-table-info');
    if (info) {
        info.textContent = `Página ${currentTablePageHeun}`;
    }
}

function asignarEventosHeun() {
    console.log('Heun.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('heun-calc');
    const ejemploBtn = document.getElementById('heun-ejemplo');
    const clearBtn = document.getElementById('heun-clear');
    
    if (!calcBtn) {
        console.error('Heun.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores para evitar duplicados
    calcBtn.removeEventListener('click', calcularHeun);
    ejemploBtn?.removeEventListener('click', mostrarSelectorEjemplosHeun);
    clearBtn?.removeEventListener('click', limpiarHeun);
    
    // Asignar nuevos eventos
    calcBtn.addEventListener('click', calcularHeun);
    if (ejemploBtn) ejemploBtn.addEventListener('click', mostrarSelectorEjemplosHeun);
    if (clearBtn) clearBtn.addEventListener('click', limpiarHeun);
    
    console.log('Heun.js: Eventos asignados correctamente');
}

function cargarEjemploInicialHeun() {
    const funcInput = document.getElementById('heun-func');
    if (funcInput && !funcInput.value.trim()) {
        console.log('Heun.js: Cargando ejemplo inicial...');
        cargarEjemploHeun('poblacion');
    }
}

function calcularHeun() {
    console.log('Heun.js: Calculando...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('heun-func');
    const x0El = document.getElementById('heun-x0');
    const y0El = document.getElementById('heun-y0');
    const xfEl = document.getElementById('heun-xf');
    const hEl = document.getElementById('heun-h');
    const solExactaEl = document.getElementById('heun-sol-exacta');
    const iterCorrectorEl = document.getElementById('heun-iter-corrector');
    
    if (!funcEl || !x0El || !y0El || !xfEl || !hEl) {
        showError('Error: Elementos de Heun no encontrados. Recarga la página.');
        return;
    }
    
    const funcStr = funcEl.value.trim();
    const x0 = parseFloat(x0El.value);
    const y0 = parseFloat(y0El.value);
    const xf = parseFloat(xfEl.value);
    const h = parseFloat(hEl.value);
    const solExactaStr = solExactaEl ? solExactaEl.value.trim() : '';
    const iterCorrector = iterCorrectorEl ? parseInt(iterCorrectorEl.value) : 1;
    
    // Validaciones
    if (!funcStr) {
        showError('Ingresa la ecuación diferencial', 'heun-func');
        return;
    }
    
    if (isNaN(x0) || isNaN(y0)) {
        showError('Valores iniciales deben ser números', 'heun-x0');
        return;
    }
    
    if (isNaN(xf) || xf <= x0) {
        showError('x final debe ser mayor que x inicial', 'heun-xf');
        return;
    }
    
    if (isNaN(h) || h <= 0) {
        showError('Tamaño de paso debe ser positivo', 'heun-h');
        return;
    }
    
    showLoading(document.getElementById('heun-calc'), true);
    
    setTimeout(() => {
        try {
            console.log('Heun.js: Ejecutando método...');
            const inicio = performance.now();
            const resultados = metodoHeun(funcStr, x0, y0, xf, h, solExactaStr, iterCorrector);
            const fin = performance.now();
            resultados.tiempo = fin - inicio;
            
            mostrarResultadosHeun(resultados);
        } catch (error) {
            showError('Error en cálculo: ' + error.message);
            console.error('Heun.js error:', error);
        } finally {
            showLoading(document.getElementById('heun-calc'), false);
        }
    }, 50);
}

function metodoHeun(funcStr, x0, y0, xf, h, solExactaStr = null, maxIterCorrector = 1) {
    console.log(`Heun.js: Método iniciado. x0=${x0}, y0=${y0}, xf=${xf}, h=${h}, iter=${maxIterCorrector}`);
    
    const pasos = [];
    let xn = x0;
    let yn = y0;
    const n = Math.ceil((xf - x0) / h);
    const hAjustado = (xf - x0) / n;
    const tolCorrector = 1e-6;
    
    // Función para evaluar la EDO
    function f(x, y) {
        return evaluateExpression(funcStr, x, y);
    }
    
    // Función para solución exacta si existe
    let solExacta = null;
    if (solExactaStr) {
        solExacta = function(x) {
            return evaluateExpression(solExactaStr, x);
        };
    }
    
    for (let i = 0; i <= n; i++) {
        // Paso predictor (Euler)
        const fPredictor = f(xn, yn);
        const yPredictor = i < n ? yn + hAjustado * fPredictor : yn;
        
        // Paso corrector (Heun)
        let yCorrector = yPredictor;
        let iterCorrector = 0;
        let converged = false;
        
        if (i < n) {
            for (iterCorrector = 0; iterCorrector < maxIterCorrector; iterCorrector++) {
                const xNext = xn + hAjustado;
                const fOld = f(xn, yn);
                const fNew = f(xNext, yCorrector);
                const pendienteMedia = (fOld + fNew) / 2;
                const yNuevo = yn + hAjustado * pendienteMedia;
                
                // Verificar convergencia
                if (maxIterCorrector === 10 && Math.abs(yNuevo - yCorrector) < tolCorrector) {
                    converged = true;
                    yCorrector = yNuevo;
                    break;
                }
                
                yCorrector = yNuevo;
                
                // Para iteraciones fijas, salir después de completarlas
                if (maxIterCorrector !== 10 && iterCorrector === maxIterCorrector - 1) {
                    converged = true;
                }
            }
        }
        
        // Calcular error local si hay solución exacta
        let errorLocal = null;
        let yExacta = null;
        if (solExacta) {
            try {
                yExacta = solExacta(xn);
                errorLocal = Math.abs(yn - yExacta);
            } catch (e) {
                console.warn('Error evaluando solución exacta:', e);
            }
        }
        
        // Guardar paso
        pasos.push({
            n: i,
            x: xn,
            y: yn,
            yPredictor: i < n ? yPredictor : null,
            yCorrector: i < n ? yCorrector : null,
            fPredictor: fPredictor,
            fCorrector: i < n ? f(xn + hAjustado, yCorrector) : null,
            pendienteMedia: i < n ? (fPredictor + f(xn + hAjustado, yCorrector)) / 2 : null,
            iterCorrector: iterCorrector,
            converged: converged,
            errorLocal: errorLocal,
            yExacta: yExacta
        });
        
        // Actualizar para siguiente iteración (excepto en el último paso)
        if (i < n) {
            xn = x0 + (i + 1) * hAjustado;
            yn = yCorrector;
        }
    }
    
    // Calcular error global si hay solución exacta
    let errorGlobal = null;
    if (solExacta) {
        try {
            const yFinalExacta = solExacta(xf);
            errorGlobal = Math.abs(yn - yFinalExacta);
        } catch (e) {
            console.warn('Error calculando error global:', e);
        }
    }
    
    // Calcular estadísticas
    const iteracionesTotales = pasos.reduce((sum, paso) => sum + (paso.iterCorrector || 0), 0);
    
    return {
        pasos: pasos,
        yFinal: yn,
        numPasos: n,
        errorGlobal: errorGlobal,
        hAjustado: hAjustado,
        x0: x0,
        xf: xf,
        iteracionesTotales: iteracionesTotales
    };
}

function mostrarResultadosHeun(resultados) {
    console.log('Heun.js: Mostrando resultados...');
    
    // Almacenar resultados para posible comparación
    window.heunResultados = resultados;
    
    // Actualizar resultados principales
    document.getElementById('heun-yfinal').textContent = formatNumber(resultados.yFinal, 8);
    document.getElementById('heun-iteraciones').textContent = resultados.iteracionesTotales + ' (' + resultados.numPasos + ' pasos)';
    document.getElementById('heun-tiempo').textContent = formatNumber(resultados.tiempo, 2) + ' ms';
    document.getElementById('heun-precision').textContent = resultados.errorGlobal !== null ? 
        formatNumber(resultados.errorGlobal, 8) : 'N/A';
    
    // Actualizar estadísticas
    const statsEl = document.getElementById('heun-stats');
    if (statsEl) {
        const yValues = resultados.pasos.map(p => p.y);
        const maxY = Math.max(...yValues);
        const minY = Math.min(...yValues);
        const avgIter = resultados.iteracionesTotales / resultados.numPasos;
        
        statsEl.innerHTML = `
            <span class="stat-item"><i class="fas fa-arrow-up"></i> Máx y: ${formatNumber(maxY, 4)}</span>
            <span class="stat-item"><i class="fas fa-arrow-down"></i> Mín y: ${formatNumber(minY, 4)}</span>
            <span class="stat-item"><i class="fas fa-redo"></i> Iter/paso: ${formatNumber(avgIter, 1)}</span>
            <span class="stat-item"><i class="fas fa-chart-line"></i> h: ${formatNumber(resultados.hAjustado, 4)}</span>
        `;
    }
    
    // Actualizar tabla
    actualizarTablaHeun(resultados.pasos);
    
    // Crear gráficos
    crearGraficoHeun(resultados);
    if (resultados.errorGlobal !== null) {
        crearGraficoErrorHeun(resultados);
    }
}

function actualizarTablaHeun(pasos) {
    const tbody = document.getElementById('heun-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    pasos.slice(0, 20).forEach(paso => { // Mostrar solo primeros 20 pasos
        const row = document.createElement('tr');
        
        // Determinar clase según convergencia
        let rowClass = '';
        if (paso.errorLocal !== null && paso.errorLocal > 0.01) {
            rowClass = 'error-high';
        } else if (paso.converged === false) {
            rowClass = 'warning';
        }
        
        // Formatear valores
        const predictorFormatted = paso.yPredictor !== null ? formatNumber(paso.yPredictor, 6) : '-';
        const pendienteFormatted = paso.pendienteMedia !== null ? formatNumber(paso.pendienteMedia, 6) : '-';
        const errorFormatted = paso.errorLocal !== null ? formatNumber(paso.errorLocal, 6) : '-';
        const iterInfo = paso.iterCorrector > 0 ? `${paso.iterCorrector} iter` : '-';
        
        row.innerHTML = `
            <td class="${rowClass}">${paso.n}</td>
            <td>${formatNumber(paso.x, 4)}</td>
            <td class="y-value ${rowClass}">${formatNumber(paso.y, 6)}</td>
            <td>${predictorFormatted}</td>
            <td>${pendienteFormatted} <small>${iterInfo}</small></td>
            <td class="error-value ${rowClass}">${errorFormatted}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Si hay más de 20 pasos, mostrar nota
    if (pasos.length > 20) {
        const notaRow = document.createElement('tr');
        notaRow.innerHTML = `
            <td colspan="6" class="table-note">
                <i class="fas fa-info-circle"></i>
                Mostrando 20 de ${pasos.length} pasos. Ver gráfico para solución completa.
            </td>
        `;
        tbody.appendChild(notaRow);
    }
    
    // Actualizar paginación
    actualizarPaginacionHeun();
}

function crearGraficoHeun(resultados) {
    const pasos = resultados.pasos;
    const solExactaStr = document.getElementById('heun-sol-exacta')?.value.trim();
    const showPredictor = document.getElementById('heun-show-predictor')?.checked || false;
    const showCorrector = document.getElementById('heun-show-corrector')?.checked || false;
    const showExact = document.getElementById('heun-show-exact')?.checked || false;
    
    const datasets = [];
    
    // Datos del corrector (Heun) - siempre visible si está activado
    if (showCorrector) {
        const puntosHeun = pasos.map(paso => ({
            x: paso.x,
            y: paso.y
        }));
        
        datasets.push({
            label: 'Heun (corrector)',
            data: puntosHeun,
            borderColor: '#9b59b6',
            backgroundColor: 'rgba(155, 89, 182, 0.2)',
            fill: false,
            tension: 0,
            pointRadius: 4,
            pointBackgroundColor: '#9b59b6',
            borderWidth: 3,
            showLine: true
        });
    }
    
    // Datos del predictor (Euler) si está activado
    if (showPredictor) {
        const puntosPredictor = pasos.filter(p => p.yPredictor !== null).map(paso => ({
            x: paso.x + resultados.hAjustado,
            y: paso.yPredictor
        }));
        
        datasets.push({
            label: 'Euler (predictor)',
            data: puntosPredictor,
            borderColor: '#3498db',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0,
            pointRadius: 3,
            pointStyle: 'triangle',
            borderWidth: 1,
            borderDash: [3, 3],
            showLine: false
        });
        
        // Agregar líneas de corrección (de predictor a corrector)
        const lineasCorreccion = [];
        pasos.forEach(paso => {
            if (paso.yPredictor !== null && paso.n < resultados.numPasos) {
                lineasCorreccion.push({
                    x: paso.x + resultados.hAjustado,
                    y: paso.yPredictor
                }, {
                    x: paso.x + resultados.hAjustado,
                    y: paso.yCorrector
                });
            }
        });
        
        datasets.push({
            label: 'Corrección',
            data: lineasCorreccion,
            borderColor: '#e74c3c',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [2, 2],
            showLine: true
        });
    }
    
    // Solución exacta si existe y está activada
    if (solExactaStr && showExact) {
        const x0 = resultados.x0;
        const xf = resultados.xf;
        const numPuntos = 200;
        const puntosExacta = [];
        
        for (let i = 0; i <= numPuntos; i++) {
            const x = x0 + (xf - x0) * (i / numPuntos);
            try {
                const y = evaluateExpression(solExactaStr, x);
                puntosExacta.push({ x: x, y: y });
            } catch (error) {
                // Ignorar errores en la evaluación
            }
        }
        
        datasets.push({
            label: 'Solución exacta',
            data: puntosExacta,
            borderColor: '#2ecc71',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [5, 5]
        });
    }
    
    const data = { datasets };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 },
                    padding: 20
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += `y(${formatNumber(context.parsed.x, 3)}) = ${formatNumber(context.parsed.y, 4)}`;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'x (variable independiente)',
                    font: { size: 13, weight: 'bold' }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'y(x) (solución)',
                    font: { size: 13, weight: 'bold' }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        },
        elements: {
            line: {
                tension: 0
            },
            point: {
                radius: 4,
                hoverRadius: 6
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
    
    createChart('heun-chart', data, options);
    
    // Actualizar leyenda
    const legendEl = document.getElementById('heun-chart-legend');
    if (legendEl) {
        let legendHTML = '';
        if (showCorrector) {
            legendHTML += '<div class="legend-item"><span class="legend-color" style="background: #9b59b6"></span> Heun (corrector)</div>';
        }
        if (showPredictor) {
            legendHTML += '<div class="legend-item"><span class="legend-color" style="background: #3498db"></span> Euler (predictor)</div>';
            legendHTML += '<div class="legend-item"><span class="legend-color" style="background: #e74c3c"></span> Corrección</div>';
        }
        if (solExactaStr && showExact) {
            legendHTML += '<div class="legend-item"><span class="legend-color" style="background: #2ecc71"></span> Solución exacta</div>';
        }
        legendEl.innerHTML = legendHTML;
    }
}

function crearGraficoErrorHeun(resultados) {
    const pasos = resultados.pasos.filter(p => p.errorLocal !== null);
    
    if (pasos.length === 0) return;
    
    const puntosError = pasos.map(paso => ({
        x: paso.x,
        y: paso.errorLocal
    }));
    
    const data = {
        datasets: [{
            label: 'Error local de Heun',
            data: puntosError,
            borderColor: '#9b59b6',
            backgroundColor: 'rgba(155, 89, 182, 0.2)',
            fill: true,
            tension: 0.1,
            pointRadius: 2,
            borderWidth: 2
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Evolución del Error Local',
                font: { size: 14 }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'x' }
            },
            y: {
                title: { display: true, text: 'Error |y_heun - y_exacta|' },
                type: 'logarithmic'
            }
        }
    };
    
    createChart('heun-error-chart', data, options);
}

function ejecutarComparacionEuler() {
    const funcStr = document.getElementById('heun-func').value.trim();
    const x0 = parseFloat(document.getElementById('heun-x0').value);
    const y0 = parseFloat(document.getElementById('heun-y0').value);
    const xf = parseFloat(document.getElementById('heun-xf').value);
    const h = parseFloat(document.getElementById('heun-h').value);
    const solExactaStr = document.getElementById('heun-sol-exacta')?.value.trim() || '';
    
    if (!funcStr) {
        showError('Primero ingresa una EDO');
        return;
    }
    
    showLoading(document.getElementById('heun-calc'), true);
    
    setTimeout(() => {
        try {
            // Ejecutar Euler
            const inicioEuler = performance.now();
            const resultadosEuler = metodoEuler(funcStr, x0, y0, xf, h, solExactaStr);
            const finEuler = performance.now();
            resultadosEuler.tiempo = finEuler - inicioEuler;
            
            // Ejecutar Heun
            const iterCorrector = parseInt(document.getElementById('heun-iter-corrector').value);
            const inicioHeun = performance.now();
            const resultadosHeun = metodoHeun(funcStr, x0, y0, xf, h, solExactaStr, iterCorrector);
            const finHeun = performance.now();
            resultadosHeun.tiempo = finHeun - inicioHeun;
            
            mostrarComparacionHeunEuler(resultadosHeun, resultadosEuler);
        } catch (error) {
            showError('Error en comparación: ' + error.message);
        } finally {
            showLoading(document.getElementById('heun-calc'), false);
        }
    }, 50);
}

function ejecutarComparacionCompleta() {
    ejecutarComparacionEuler();
}

function metodoEuler(funcStr, x0, y0, xf, h, solExactaStr = null) {
    const pasos = [];
    let xn = x0;
    let yn = y0;
    const n = Math.ceil((xf - x0) / h);
    const hAjustado = (xf - x0) / n;
    
    function f(x, y) {
        return evaluateExpression(funcStr, x, y);
    }
    
    let solExacta = null;
    if (solExactaStr) {
        solExacta = function(x) {
            return evaluateExpression(solExactaStr, x);
        };
    }
    
    for (let i = 0; i <= n; i++) {
        const fxy = f(xn, yn);
        const yn1 = i < n ? yn + hAjustado * fxy : yn;
        
        let errorLocal = null;
        if (solExacta) {
            try {
                const yExacta = solExacta(xn);
                errorLocal = Math.abs(yn - yExacta);
            } catch (e) {}
        }
        
        pasos.push({
            n: i,
            x: xn,
            y: yn,
            fxy: fxy,
            yn1: i < n ? yn1 : null,
            errorLocal: errorLocal
        });
        
        if (i < n) {
            xn = x0 + (i + 1) * hAjustado;
            yn = yn1;
        }
    }
    
    let errorGlobal = null;
    if (solExacta) {
        try {
            const yFinalExacta = solExacta(xf);
            errorGlobal = Math.abs(yn - yFinalExacta);
        } catch (e) {}
    }
    
    return {
        pasos: pasos,
        yFinal: yn,
        numPasos: n,
        errorGlobal: errorGlobal,
        hAjustado: hAjustado,
        x0: x0,
        xf: xf
    };
}

function mostrarComparacionHeunEuler(resultadosHeun, resultadosEuler) {
    // Mostrar sección de comparación
    const comparisonSection = document.getElementById('heun-comparison-section');
    if (comparisonSection) {
        comparisonSection.style.display = 'block';
    }
    
    // Actualizar tabla de comparación
    const tbody = document.getElementById('comparison-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        // Calcular mejora de precisión si hay error global
        let mejoraPrecision = '-';
        if (resultadosHeun.errorGlobal !== null && resultadosEuler.errorGlobal !== null && resultadosEuler.errorGlobal > 0) {
            const mejora = ((resultadosEuler.errorGlobal - resultadosHeun.errorGlobal) / resultadosEuler.errorGlobal) * 100;
            mejoraPrecision = formatNumber(mejora, 1) + '%';
        }
        
        const filas = [
            {
                metodo: 'Euler',
                yFinal: resultadosEuler.yFinal,
                error: resultadosEuler.errorGlobal,
                iteraciones: resultadosEuler.numPasos,
                tiempo: resultadosEuler.tiempo,
                precision: resultadosEuler.errorGlobal !== null ? formatNumber(resultadosEuler.errorGlobal, 6) : 'N/A',
                color: '#3498db'
            },
            {
                metodo: 'Heun',
                yFinal: resultadosHeun.yFinal,
                error: resultadosHeun.errorGlobal,
                iteraciones: resultadosHeun.numPasos + ' (' + resultadosHeun.iteracionesTotales + ' iter total)',
                tiempo: resultadosHeun.tiempo,
                precision: resultadosHeun.errorGlobal !== null ? formatNumber(resultadosHeun.errorGlobal, 6) : 'N/A',
                color: '#9b59b6'
            }
        ];
        
        filas.forEach(fila => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color: ${fila.color}; font-weight: bold;">
                    <i class="fas fa-calculator"></i> ${fila.metodo}
                </td>
                <td>${formatNumber(fila.yFinal, 8)}</td>
                <td>${fila.error !== null ? formatNumber(fila.error, 8) : 'N/A'}</td>
                <td>${fila.iteraciones}</td>
                <td>${formatNumber(fila.tiempo, 2)} ms</td>
                <td>${fila.precision}</td>
            `;
            tbody.appendChild(row);
        });
        
        // Agregar fila de comparación
        const comparacionRow = document.createElement('tr');
        comparacionRow.className = 'comparison-row';
        comparacionRow.innerHTML = `
            <td colspan="5" style="text-align: right; font-weight: bold;">Mejora de Heun vs Euler:</td>
            <td style="font-weight: bold; color: ${mejoraPrecision !== '-' && parseFloat(mejoraPrecision) > 0 ? '#27ae60' : '#e74c3c'}">
                ${mejoraPrecision}
            </td>
        `;
        tbody.appendChild(comparacionRow);
    }
    
    // Crear gráfico comparativo
    crearGraficoComparativoHeunEuler(resultadosHeun, resultadosEuler);
}

function crearGraficoComparativoHeunEuler(resultadosHeun, resultadosEuler) {
    const solExactaStr = document.getElementById('heun-sol-exacta')?.value.trim();
    
    const datasets = [];
    
    // Datos de Euler
    const puntosEuler = resultadosEuler.pasos.map(paso => ({
        x: paso.x,
        y: paso.y
    }));
    
    datasets.push({
        label: 'Método de Euler',
        data: puntosEuler,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: false,
        tension: 0,
        pointRadius: 3,
        borderWidth: 2,
        borderDash: [5, 5]
    });
    
    // Datos de Heun
    const puntosHeun = resultadosHeun.pasos.map(paso => ({
        x: paso.x,
        y: paso.y
    }));
    
    datasets.push({
        label: 'Método de Heun',
        data: puntosHeun,
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        fill: false,
        tension: 0,
        pointRadius: 4,
        borderWidth: 3
    });
    
    // Solución exacta si existe
    if (solExactaStr) {
        const x0 = resultadosHeun.x0;
        const xf = resultadosHeun.xf;
        const numPuntos = 200;
        const puntosExacta = [];
        
        for (let i = 0; i <= numPuntos; i++) {
            const x = x0 + (xf - x0) * (i / numPuntos);
            try {
                const y = evaluateExpression(solExactaStr, x);
                puntosExacta.push({ x: x, y: y });
            } catch (error) {}
        }
        
        datasets.push({
            label: 'Solución exacta',
            data: puntosExacta,
            borderColor: '#2ecc71',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
        });
    }
    
    const data = { datasets };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Comparación Euler vs Heun',
                font: { size: 16, weight: 'bold' }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'x' }
            },
            y: {
                title: { display: true, text: 'y(x)' }
            }
        }
    };
    
    createChart('heun-euler-chart', data, options);
}

function mostrarSelectorEjemplosHeun() {
    const ejemplos = [
        {
            id: 'poblacion',
            nombre: "Crecimiento Poblacional",
            descripcion: "Modelo logístico con capacidad de carga",
            funcion: "0.1*y*(1 - y/500)",
            x0: "0",
            y0: "50",
            xf: "50",
            h: "2",
            solExacta: "500/(1 + 9*exp(-0.1*x))",
            color: "#3498db",
            icon: "fas fa-users"
        },
        {
            id: 'circuito',
            nombre: "Circuito RLC",
            descripcion: "Circuito eléctrico con resistencia, inductancia y capacitancia",
            funcion: "-2*y - 0.5*y",
            x0: "0",
            y0: "10",
            xf: "10",
            h: "0.5",
            solExacta: "10*exp(-x)*cos(sqrt(1.75)*x)",
            color: "#9b59b6",
            icon: "fas fa-bolt"
        },
        {
            id: 'resorte',
            nombre: "Resorte Amortiguado",
            descripcion: "Movimiento con amortiguamiento crítico",
            funcion: "y2",
            x0: "0",
            y0: "1",
            xf: "10",
            h: "0.2",
            solExacta: "(1 + 0.5*x)*exp(-0.5*x)",
            color: "#e74c3c",
            icon: "fas fa-weight-hanging"
        },
        {
            id: 'quimica',
            nombre: "Reacción Química",
            descripcion: "Cinética de segundo orden A + B → C",
            funcion: "-0.01*y*y",
            x0: "0",
            y0: "1",
            xf: "100",
            h: "5",
            solExacta: "1/(1 + 0.01*x)",
            color: "#34495e",
            icon: "fas fa-flask"
        },
        {
            id: 'epidemia',
            nombre: "Modelo SIS",
            descripcion: "Epidemia con recuperación y reinfección",
            funcion: "0.3*y*(1 - y/1000) - 0.1*y",
            x0: "0",
            y0: "10",
            xf: "50",
            h: "1",
            solExacta: "",
            color: "#1abc9c",
            icon: "fas fa-virus",
            note: "Muestra ventaja de Heun sobre Euler para sistemas no lineales"
        },
        {
            id: 'pendulo',
            nombre: "Péndulo Simple",
            descripcion: "Aproximación para ángulos pequeños",
            funcion: "-9.8*sin(y)",
            x0: "0",
            y0: "0.1",
            xf: "10",
            h: "0.1",
            solExacta: "0.1*cos(3.13*x)",
            color: "#f39c12",
            icon: "fas fa-clock"
        }
    ];
    
    // Crear modal similar al de Euler (reutilizar función o implementar similar)
    // Por simplicidad, cargar primer ejemplo
    cargarEjemploHeun(ejemplos[0]);
}

function cargarEjemploHeun(ejemplo) {
    console.log(`Heun.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    document.getElementById('heun-func').value = ejemplo.funcion;
    document.getElementById('heun-x0').value = ejemplo.x0;
    document.getElementById('heun-y0').value = ejemplo.y0;
    document.getElementById('heun-xf').value = ejemplo.xf;
    document.getElementById('heun-h').value = ejemplo.h;
    document.getElementById('heun-sol-exacta').value = ejemplo.solExacta || '';
    
    // Mostrar información del ejemplo
    const infoHTML = `
        <div class="ejemplo-info">
            <div class="ejemplo-info-header" style="background: ${ejemplo.color}20; border-left: 4px solid ${ejemplo.color};">
                <div class="ejemplo-info-icon" style="background: ${ejemplo.color};">
                    <i class="${ejemplo.icon}"></i>
                </div>
                <div>
                    <h4>${ejemplo.nombre}</h4>
                    <p>${ejemplo.descripcion}</p>
                </div>
            </div>
            <div class="ejemplo-info-body">
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-function"></i>
                        <div>
                            <strong>EDO:</strong>
                            <code>dy/dx = ${ejemplo.funcion}</code>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-play-circle"></i>
                        <div>
                            <strong>Condiciones iniciales:</strong>
                            <span>y(${ejemplo.x0}) = ${ejemplo.y0}</span>
                        </div>
                    </div>
                    ${ejemplo.solExacta ? `
                    <div class="info-item">
                        <i class="fas fa-check-double"></i>
                        <div>
                            <strong>Solución exacta:</strong>
                            <code>y(x) = ${ejemplo.solExacta}</code>
                        </div>
                    </div>
                    ` : ''}
                </div>
                ${ejemplo.note ? `
                <div class="ejemplo-note">
                    <i class="fas fa-lightbulb"></i> ${ejemplo.note}
                </div>
                ` : ''}
                <div class="method-highlight">
                    <i class="fas fa-star"></i>
                    <strong>Ventaja de Heun:</strong> Mayor precisión que Euler con el mismo tamaño de paso
                </div>
            </div>
        </div>
    `;
    
    // Insertar información después del input-section
    const inputSection = document.querySelector('#heun-content .input-section');
    let infoContainer = document.getElementById('heun-ejemplo-info');
    
    if (!infoContainer) {
        infoContainer = document.createElement('div');
        infoContainer.id = 'heun-ejemplo-info';
        inputSection.parentNode.insertBefore(infoContainer, inputSection.nextSibling);
    }
    
    infoContainer.innerHTML = infoHTML;
    
    // Ejecutar automáticamente
    setTimeout(calcularHeun, 500);
}

function mostrarTeoriaHeun() {
    const teoriaHTML = `
        <div class="teoria-content">
            <h3><i class="fas fa-graduation-cap"></i> Teoría del Método de Heun</h3>
            
            <div class="teoria-section">
                <h4><i class="fas fa-calculator"></i> Formulación Matemática</h4>
                <p>El método de Heun es un <strong>método predictor-corrector</strong> de segundo orden que mejora la precisión del método de Euler:</p>
                
                <div class="formula-box">
                    <div class="formula-step">
                        <span class="step-label">1. Predictor (Euler explícito):</span>
                        <div class="formula">ỹₙ₊₁ = yₙ + h·f(xₙ, yₙ)</div>
                    </div>
                    <div class="formula-step">
                        <span class="step-label">2. Corrector (Heun):</span>
                        <div class="formula">yₙ₊₁ = yₙ + h·[f(xₙ, yₙ) + f(xₙ₊₁, ỹₙ₊₁)] / 2</div>
                    </div>
                </div>
            </div>
            
            <div class="teoria-section">
                <h4><i class="fas fa-chart-line"></i> Interpretación Geométrica</h4>
                <p>El método utiliza el <strong>promedio de las pendientes</strong> en los puntos inicial y predicho:</p>
                <ul>
                    <li><strong>Pendiente inicial:</strong> f(xₙ, yₙ) en el punto conocido</li>
                    <li><strong>Pendiente final:</strong> f(xₙ₊₁, ỹₙ₊₁) en el punto predicho</li>
                    <li><strong>Pendiente efectiva:</strong> Promedio de ambas pendientes</li>
                </ul>
            </div>
            
            <div class="teoria-section">
                <h4><i class="fas fa-balance-scale"></i> Ventajas vs Euler</h4>
                <div class="advantages-grid">
                    <div class="advantage">
                        <i class="fas fa-bullseye" style="color: #27ae60;"></i>
                        <h5>Mayor Precisión</h5>
                        <p>Error de orden O(h²) vs O(h) de Euler</p>
                    </div>
                    <div class="advantage">
                        <i class="fas fa-tachometer-alt" style="color: #3498db;"></i>
                        <h5>Pasos Más Grandes</h5>
                        <p>Permite pasos mayores para misma precisión</p>
                    </div>
                    <div class="advantage">
                        <i class="fas fa-chart-line" style="color: #9b59b6;"></i>
                        <h5>Mejor Estabilidad</h5>
                        <p>Menos propenso a divergencia en problemas stiff</p>
                    </div>
                </div>
            </div>
            
            <div class="teoria-section">
                <h4><i class="fas fa-exclamation-triangle"></i> Limitaciones</h4>
                <ul>
                    <li>Requiere dos evaluaciones de f(x,y) por paso</li>
                    <li>No es adecuado para problemas muy stiff</li>
                    <li>La precisión aún es limitada para aplicaciones críticas</li>
                </ul>
            </div>
            
            <div class="teoria-section">
                <h4><i class="fas fa-cogs"></i> Aplicaciones Prácticas</h4>
                <ul>
                    <li>Simulaciones de dinámica de fluidos</li>
                    <li>Modelado de circuitos eléctricos</li>
                    <li>Cálculos en ingeniería estructural</li>
                    <li>Simulaciones de procesos químicos</li>
                </ul>
            </div>
        </div>
    `;
    
    // Mostrar modal con teoría
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3><i class="fas fa-graduation-cap"></i> Teoría del Método de Heun</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${teoriaHTML}
            </div>
            <div class="modal-footer">
                <button class="btn-close">Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar eventos del modal
    const closeBtn = modal.querySelector('.modal-close');
    const closeBtn2 = modal.querySelector('.btn-close');
    
    closeBtn.addEventListener('click', () => modal.remove());
    closeBtn2.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function exportarDatosHeun() {
    const resultados = window.heunResultados;
    if (!resultados || !resultados.pasos || resultados.pasos.length === 0) {
        showError('No hay datos para exportar. Ejecuta el método primero.');
        return;
    }
    
    const datos = resultados.pasos.map(paso => ({
        n: paso.n,
        x: paso.x,
        y_heun: paso.y,
        y_predictor: paso.yPredictor || '',
        y_corrector: paso.yCorrector || '',
        f_predictor: paso.fPredictor || '',
        f_corrector: paso.fCorrector || '',
        pendiente_media: paso.pendienteMedia || '',
        iteraciones_corrector: paso.iterCorrector || 0,
        convergio: paso.converged ? 'Sí' : 'No',
        error_local: paso.errorLocal || ''
    }));
    
    exportToCSV(datos, 'heun_resultados.csv');
}

function limpiarHeun() {
    console.log('Heun.js: Limpiando...');
    
    // Limpiar inputs
    document.getElementById('heun-func').value = '';
    document.getElementById('heun-x0').value = '0';
    document.getElementById('heun-y0').value = '0.5';
    document.getElementById('heun-xf').value = '2';
    document.getElementById('heun-h').value = '0.2';
    document.getElementById('heun-sol-exacta').value = '';
    document.getElementById('heun-iter-corrector').value = '1';
    
    // Limpiar resultados
    document.getElementById('heun-yfinal').textContent = '-';
    document.getElementById('heun-iteraciones').textContent = '-';
    document.getElementById('heun-precision').textContent = '-';
    document.getElementById('heun-tiempo').textContent = '-';
    document.getElementById('heun-stats').innerHTML = '';
    
    // Limpiar tabla
    const tbody = document.getElementById('heun-table-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-table">Ejecuta el método para ver resultados</td></tr>';
    }
    
    // Limpiar comparación
    const comparisonSection = document.getElementById('heun-comparison-section');
    if (comparisonSection) {
        comparisonSection.style.display = 'none';
    }
    const comparisonTbody = document.getElementById('comparison-table-body');
    if (comparisonTbody) {
        comparisonTbody.innerHTML = '';
    }
    
    // Limpiar información de ejemplo
    const infoContainer = document.getElementById('heun-ejemplo-info');
    if (infoContainer) infoContainer.remove();
    
    // Limpiar gráficos
    const charts = ['heun-chart', 'heun-error-chart', 'heun-euler-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Limpiar resultados almacenados
    window.heunResultados = null;
    
    console.log('Heun.js: Limpieza completada');
}

// Función para prueba rápida
function pruebaHeun() {
    console.log("=== PRUEBA DEL MÉTODO DE HEUN ===");
    
    try {
        const resultados = metodoHeun('y - x^2 + 1', 0, 0.5, 2, 0.2, '(x+1)^2 - 0.5*exp(x)', 1);
        
        console.log("EDO: y' = y - x² + 1");
        console.log("Condiciones: y(0) = 0.5");
        console.log("Intervalo: [0, 2], h = 0.2");
        console.log("Número de pasos:", resultados.numPasos);
        console.log("y(2) aproximado:", resultados.yFinal);
        console.log("Error global:", resultados.errorGlobal);
        console.log("Iteraciones totales:", resultados.iteracionesTotales);
        
        // Mostrar primeros 2 pasos detallados
        console.log("\nPrimeros 2 pasos (predictor-corrector):");
        resultados.pasos.slice(0, 2).forEach(paso => {
            console.log(`Paso ${paso.n}:`);
            console.log(`  x=${paso.x}, y=${paso.y}`);
            if (paso.yPredictor !== null) {
                console.log(`  Predictor: ỹ=${paso.yPredictor}`);
                console.log(`  Corrector: y=${paso.yCorrector} (${paso.iterCorrector} iter)`);
            }
        });
        
        return resultados;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}