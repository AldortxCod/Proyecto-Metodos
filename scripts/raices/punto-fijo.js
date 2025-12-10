// punto-fijo.js - Método de Punto Fijo CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    console.log('PuntoFijo.js: Cargado');
    
    // Escuchar cuando la sección de raíces se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'raices') {
            console.log('PuntoFijo.js: Sección raíces activada');
            setTimeout(inicializarPuntoFijo, 300);
        }
    });
    
    // Escuchar cuando se seleccione el método de Punto Fijo
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'punto-fijo') {
            console.log('PuntoFijo.js: Método Punto Fijo seleccionado');
            setTimeout(inicializarPuntoFijo, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarPuntoFijoVisibilidad, 1000);
});

function verificarPuntoFijoVisibilidad() {
    const puntoFijoContent = document.getElementById('punto-fijo-content');
    if (puntoFijoContent && !puntoFijoContent.classList.contains('hidden')) {
        console.log('PuntoFijo.js: Ya visible al cargar');
        inicializarPuntoFijo();
    }
}

function inicializarPuntoFijo() {
    console.log('PuntoFijo.js: Inicializando...');
    
    const puntoFijoContent = document.getElementById('punto-fijo-content');
    if (!puntoFijoContent) {
        console.error('PuntoFijo.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE
    if (puntoFijoContent.innerHTML.trim() === '' || !document.getElementById('punto-fijo-g')) {
        console.log('PuntoFijo.js: Creando interfaz...');
        crearInterfazPuntoFijo();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES
    asignarEventosPuntoFijo();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO
    cargarEjemploInicialPuntoFijo();
}

function crearInterfazPuntoFijo() {
    const content = document.getElementById('punto-fijo-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-dot-circle"></i> Método de Punto Fijo</h3>
            <p>Aplicación: Resolver ecuaciones de la forma x = g(x) por iteración funcional</p>
            
            <div class="ejemplo-principal" style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #9b59b6;">
                <strong><i class="fas fa-info-circle"></i> Ejemplo: Resolver x³ - 2x - 5 = 0</strong>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">Reescribir como x = g(x) = (2x + 5)^(1/3)</p>
                <p style="margin: 0; font-size: 0.85em; color: #666;">Condición: |g'(x)| < 1 cerca del punto fijo</p>
            </div>
            
            <div class="input-group">
                <label for="punto-fijo-g"><i class="fas fa-function"></i> Función g(x):</label>
                <input type="text" id="punto-fijo-g" placeholder="(2*x + 5)^(1/3)">
                <small>La ecuación original es f(x)=0, reescrita como x = g(x)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="punto-fijo-x0"><i class="fas fa-crosshairs"></i> Valor inicial (x₀):</label>
                    <input type="number" id="punto-fijo-x0" value="2" step="0.1">
                </div>
                <div class="input-group">
                    <label for="punto-fijo-tol"><i class="fas fa-bullseye"></i> Tolerancia:</label>
                    <input type="number" id="punto-fijo-tol" value="0.0001" step="0.0001">
                </div>
                <div class="input-group">
                    <label for="punto-fijo-maxiter"><i class="fas fa-redo"></i> Máx. iteraciones:</label>
                    <input type="number" id="punto-fijo-maxiter" value="50">
                </div>
            </div>
            
            <div class="button-group">
                <button id="punto-fijo-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular</button>
                <button id="punto-fijo-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Ejemplo</button>
                <button id="punto-fijo-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados</h3>
            
            <div class="result-summary">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-crosshairs"></i>
                    </div>
                    <div class="result-content">
                        <h4>Punto fijo:</h4>
                        <p id="punto-fijo-root" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-redo"></i>
                    </div>
                    <div class="result-content">
                        <h4>Iteraciones:</h4>
                        <p id="punto-fijo-iter" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Error final:</h4>
                        <p id="punto-fijo-error" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="result-content">
                        <h4>g(punto fijo):</h4>
                        <p id="punto-fijo-gval" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-area"></i> Visualización</h4>
                    <div class="chart-wrapper">
                        <canvas id="punto-fijo-chart"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Iteraciones</h4>
                    <div class="table-wrapper">
                        <table id="punto-fijo-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-hashtag"></i> Iter</th>
                                    <th><i class="fas fa-x"></i> x</th>
                                    <th><i class="fas fa-gx"></i> g(x)</th>
                                    <th><i class="fas fa-percentage"></i> Error</th>
                                </tr>
                            </thead>
                            <tbody id="punto-fijo-table-body">
                                <tr><td colspan="4" class="empty-table">Ingresa valores y haz clic en Calcular</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('PuntoFijo.js: Interfaz creada correctamente');
}

function asignarEventosPuntoFijo() {
    console.log('PuntoFijo.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('punto-fijo-calc');
    const ejemploBtn = document.getElementById('punto-fijo-ejemplo');
    const clearBtn = document.getElementById('punto-fijo-clear');
    
    if (!calcBtn) {
        console.error('PuntoFijo.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores para evitar duplicados
    calcBtn.removeEventListener('click', calcularPuntoFijo);
    ejemploBtn?.removeEventListener('click', cargarEjemploPuntoFijo);
    clearBtn?.removeEventListener('click', limpiarPuntoFijo);
    
    // Asignar nuevos eventos
    calcBtn.addEventListener('click', calcularPuntoFijo);
    if (ejemploBtn) ejemploBtn.addEventListener('click', cargarEjemploPuntoFijo);
    if (clearBtn) clearBtn.addEventListener('click', limpiarPuntoFijo);
    
    console.log('PuntoFijo.js: Eventos asignados correctamente');
}

function cargarEjemploInicialPuntoFijo() {
    const funcInput = document.getElementById('punto-fijo-g');
    if (funcInput && !funcInput.value.trim()) {
        console.log('PuntoFijo.js: Cargando ejemplo inicial...');
        cargarEjemploPuntoFijo();
    }
}

function calcularPuntoFijo() {
    console.log('PuntoFijo.js: Calculando...');
    
    // OBTENER ELEMENTOS
    const gEl = document.getElementById('punto-fijo-g');
    const x0El = document.getElementById('punto-fijo-x0');
    const tolEl = document.getElementById('punto-fijo-tol');
    const maxIterEl = document.getElementById('punto-fijo-maxiter');
    
    if (!gEl || !x0El || !tolEl || !maxIterEl) {
        showError('Error: Elementos de Punto Fijo no encontrados. Recarga la página.');
        return;
    }
    
    const gStr = gEl.value.trim();
    const x0 = parseFloat(x0El.value);
    const tol = parseFloat(tolEl.value);
    const maxIter = parseInt(maxIterEl.value);
    
    // Validaciones
    if (!gStr) {
        showError('Ingresa una función g(x)', 'punto-fijo-g');
        return;
    }
    
    if (isNaN(x0)) {
        showError('Valor inicial debe ser un número', 'punto-fijo-x0');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('Tolerancia debe ser un número positivo', 'punto-fijo-tol');
        return;
    }
    
    if (isNaN(maxIter) || maxIter <= 0) {
        showError('Iteraciones debe ser un número positivo', 'punto-fijo-maxiter');
        return;
    }
    
    showLoading(document.getElementById('punto-fijo-calc'), true);
    
    setTimeout(() => {
        try {
            console.log('PuntoFijo.js: Ejecutando método...');
            const resultados = metodoPuntoFijo(gStr, x0, tol, maxIter);
            mostrarResultadosPuntoFijo(resultados);
        } catch (error) {
            showError('Error en cálculo: ' + error.message);
            console.error('PuntoFijo.js error:', error);
        } finally {
            showLoading(document.getElementById('punto-fijo-calc'), false);
        }
    }, 50);
}

function metodoPuntoFijo(gStr, x0, tol, maxIter) {
    console.log(`PuntoFijo.js: Método iniciado. x0=${x0}, tol=${tol}, maxIter=${maxIter}`);
    
    const iteraciones = [];
    let x = x0;
    
    for (let i = 0; i < maxIter; i++) {
        try {
            // Evaluar g(x)
            const gx = evaluateExpression(gStr, x);
            const error = Math.abs(gx - x);
            
            iteraciones.push({
                iteracion: i + 1,
                x: x,
                gx: gx,
                error: error
            });
            
            console.log(`Iter ${i+1}: x=${x}, g(x)=${gx}, error=${error}`);
            
            // Verificar convergencia
            if (error < tol) {
                console.log(`PuntoFijo.js: Convergió en ${i+1} iteraciones`);
                return {
                    raiz: gx,
                    valorFuncion: gx, // g(punto fijo) = punto fijo
                    iteraciones: iteraciones,
                    errorFinal: error,
                    iteracionesRealizadas: i + 1,
                    convergio: true
                };
            }
            
            // Verificar divergencia
            if (i > 2) {
                const errors = iteraciones.slice(-3).map(it => it.error);
                if (errors[2] > errors[1] && errors[1] > errors[0]) {
                    console.warn('PuntoFijo.js: Posible divergencia detectada');
                }
            }
            
            x = gx; // Actualizar para siguiente iteración
            
        } catch (error) {
            throw new Error(`Error en iteración ${i+1}: ${error.message}`);
        }
    }
    
    console.log(`PuntoFijo.js: No convergió en ${maxIter} iteraciones`);
    const ultimoError = iteraciones.length > 0 ? iteraciones[iteraciones.length-1].error : Math.abs(x - x0);
    
    return {
        raiz: x,
        valorFuncion: evaluateExpression(gStr, x),
        iteraciones: iteraciones,
        errorFinal: ultimoError,
        iteracionesRealizadas: maxIter,
        convergio: false
    };
}

function mostrarResultadosPuntoFijo(resultados) {
    console.log('PuntoFijo.js: Mostrando resultados...');
    
    // Actualizar resultados principales
    document.getElementById('punto-fijo-root').textContent = formatNumber(resultados.raiz, 10);
    document.getElementById('punto-fijo-iter').textContent = resultados.iteracionesRealizadas;
    document.getElementById('punto-fijo-error').textContent = formatNumber(resultados.errorFinal, 10);
    document.getElementById('punto-fijo-gval').textContent = formatNumber(resultados.valorFuncion, 10);
    
    // Añadir indicador de convergencia
    const rootElement = document.getElementById('punto-fijo-root');
    if (rootElement) {
        rootElement.innerHTML = `${formatNumber(resultados.raiz, 8)} 
            <span style="margin-left: 10px; padding: 2px 8px; border-radius: 12px; 
                         font-size: 0.8rem; background-color: ${resultados.convergio ? '#d4edda' : '#f8d7da'}; 
                         color: ${resultados.convergio ? '#155724' : '#721c24'};">
                ${resultados.convergio ? '✓ Convergió' : '✗ No convergió'}
            </span>`;
    }
    
    // Actualizar tabla
    const tbody = document.getElementById('punto-fijo-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        resultados.iteraciones.forEach(iter => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${iter.iteracion}</td>
                <td>${formatNumber(iter.x, 8)}</td>
                <td>${formatNumber(iter.gx, 8)}</td>
                <td>${formatNumber(iter.error, 10)}</td>
            `;
            
            // Resaltar convergencia rápida
            if (iter.error < 0.001) {
                row.style.backgroundColor = 'rgba(144, 238, 144, 0.2)';
            }
            
            tbody.appendChild(row);
        });
    }
    
    // Crear gráfico
    crearGraficoPuntoFijo(resultados);
}

function crearGraficoPuntoFijo(resultados) {
    const gEl = document.getElementById('punto-fijo-g');
    if (!gEl) return;
    
    const gStr = gEl.value.trim();
    if (!gStr) return;
    
    const raiz = resultados.raiz;
    
    // Definir rango de visualización
    let minX = raiz - 2;
    let maxX = raiz + 2;
    
    // Asegurarse de que incluya los puntos de las iteraciones
    if (resultados.iteraciones.length > 0) {
        const valoresX = resultados.iteraciones.map(iter => iter.x);
        minX = Math.min(minX, ...valoresX);
        maxX = Math.max(maxX, ...valoresX);
    }
    
    // Generar puntos para g(x)
    const puntosG = [];
    for (let x = minX; x <= maxX; x += (maxX - minX) / 200) {
        try {
            const y = evaluateExpression(gStr, x);
            puntosG.push({x: x, y: y});
        } catch (e) {
            puntosG.push({x: x, y: null});
        }
    }
    
    // Línea y = x (diagonal)
    const puntosDiagonal = [
        {x: minX, y: minX},
        {x: maxX, y: maxX}
    ];
    
    // Puntos de las iteraciones
    const iterPuntos = resultados.iteraciones.map(iter => ({
        x: iter.x,
        y: iter.gx
    }));
    
    // Punto fijo encontrado
    const puntoFijo = {x: raiz, y: raiz};
    
    // Datasets para Chart.js
    const datasets = [
        {
            label: 'g(x)',
            data: puntosG,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 2
        },
        {
            label: 'y = x',
            data: puntosDiagonal,
            borderColor: 'rgb(153, 102, 255)',
            borderDash: [5, 5],
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            fill: false,
            pointRadius: 0,
            borderWidth: 1.5
        },
        {
            label: 'Iteraciones',
            data: iterPuntos,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            pointRadius: 5,
            pointHoverRadius: 8,
            showLine: false
        },
        {
            label: 'Punto fijo',
            data: [puntoFijo],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 10,
            pointHoverRadius: 12,
            showLine: false,
            pointStyle: 'star'
        }
    ];
    
    createChart('punto-fijo-chart', {
        datasets: datasets
    }, {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += `(${formatNumber(context.parsed.x, 4)}, ${formatNumber(context.parsed.y, 4)})`;
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
                title: { display: true, text: 'x' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            y: {
                title: { display: true, text: 'y' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        }
    });
    
    console.log('PuntoFijo.js: Gráfico creado');
}

function cargarEjemploPuntoFijo() {
    console.log('PuntoFijo.js: Cargando ejemplo...');
    
    // Ejemplo: Resolver x³ - 2x - 5 = 0 reescrito como x = (2x + 5)^(1/3)
    document.getElementById('punto-fijo-g').value = '(2*x + 5)^(1/3)';
    document.getElementById('punto-fijo-x0').value = '2';
    document.getElementById('punto-fijo-tol').value = '0.0001';
    document.getElementById('punto-fijo-maxiter').value = '50';
    
    setTimeout(calcularPuntoFijo, 300);
}

function limpiarPuntoFijo() {
    console.log('PuntoFijo.js: Limpiando...');
    
    document.getElementById('punto-fijo-g').value = '';
    document.getElementById('punto-fijo-x0').value = '2';
    document.getElementById('punto-fijo-tol').value = '0.0001';
    document.getElementById('punto-fijo-maxiter').value = '50';
    
    document.getElementById('punto-fijo-root').textContent = '-';
    document.getElementById('punto-fijo-iter').textContent = '-';
    document.getElementById('punto-fijo-error').textContent = '-';
    document.getElementById('punto-fijo-gval').textContent = '-';
    
    const tbody = document.getElementById('punto-fijo-table-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-table">Ingresa valores y haz clic en Calcular</td></tr>';
    }
    
    if (window.charts && window.charts['punto-fijo-chart']) {
        window.charts['punto-fijo-chart'].destroy();
        delete window.charts['punto-fijo-chart'];
    }
}

// Función para probar rápidamente
function pruebaPuntoFijo() {
    console.log("=== PRUEBA DEL MÉTODO DE PUNTO FIJO ===");
    
    try {
        const resultados = metodoPuntoFijo('(2*x + 5)^(1/3)', 2, 0.0001, 50);
        
        console.log("Función: g(x) = (2*x + 5)^(1/3)");
        console.log("Valor inicial: x0=2");
        console.log("Punto fijo encontrado:", resultados.raiz);
        console.log("Error final:", resultados.errorFinal);
        console.log("Iteraciones:", resultados.iteracionesRealizadas);
        console.log("¿Convergió?", resultados.convergio);
        
        // Mostrar primeras 5 iteraciones
        console.log("\nPrimeras 5 iteraciones:");
        resultados.iteraciones.slice(0, 5).forEach(iter => {
            console.log(`Iter ${iter.iteracion}: x=${iter.x}, g(x)=${iter.gx}, error=${iter.error}`);
        });
        
        return resultados;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}