// secante.js - Método de la Secante CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    console.log('Secante.js: Cargado');
    
    // Escuchar cuando la sección de raíces se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'raices') {
            console.log('Secante.js: Sección raíces activada');
            setTimeout(inicializarSecante, 300);
        }
    });
    
    // Escuchar cuando se seleccione el método de la Secante
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'secante') {
            console.log('Secante.js: Método Secante seleccionado');
            setTimeout(inicializarSecante, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarSecanteVisibilidad, 1000);
});

function verificarSecanteVisibilidad() {
    const secanteContent = document.getElementById('secante-content');
    if (secanteContent && !secanteContent.classList.contains('hidden')) {
        console.log('Secante.js: Ya visible al cargar');
        inicializarSecante();
    }
}

function inicializarSecante() {
    console.log('Secante.js: Inicializando...');
    
    const secanteContent = document.getElementById('secante-content');
    if (!secanteContent) {
        console.error('Secante.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE
    if (secanteContent.innerHTML.trim() === '' || !document.getElementById('secante-func')) {
        console.log('Secante.js: Creando interfaz...');
        crearInterfazSecante();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES
    asignarEventosSecante();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO
    cargarEjemploInicialSecante();
}

function crearInterfazSecante() {
    const content = document.getElementById('secante-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-arrow-right"></i> Método de la Secante</h3>
            <p>Aplicación: Método que no requiere derivada, usa aproximación por recta secante</p>
            
            <div class="ejemplo-principal" style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #3498db;">
                <strong><i class="fas fa-info-circle"></i> Ejemplo: Ecuación cúbica</strong>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">Encontrar raíz de f(x) = x³ - 2x - 5</p>
            </div>
            
            <div class="input-group">
                <label for="secante-func"><i class="fas fa-function"></i> Función f(x):</label>
                <input type="text" id="secante-func" placeholder="x^3 - 2*x - 5">
                <small>Ej: x^2 - 4, sin(x) - x, exp(x) - 3x</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="secante-x0"><i class="fas fa-dot-circle"></i> Punto inicial 1 (x₀):</label>
                    <input type="number" id="secante-x0" value="1" step="0.1">
                </div>
                <div class="input-group">
                    <label for="secante-x1"><i class="fas fa-dot-circle"></i> Punto inicial 2 (x₁):</label>
                    <input type="number" id="secante-x1" value="3" step="0.1">
                </div>
                <div class="input-group">
                    <label for="secante-tol"><i class="fas fa-bullseye"></i> Tolerancia:</label>
                    <input type="number" id="secante-tol" value="0.0001" step="0.0001">
                </div>
                <div class="input-group">
                    <label for="secante-maxiter"><i class="fas fa-redo"></i> Máx. iteraciones:</label>
                    <input type="number" id="secante-maxiter" value="50">
                </div>
            </div>
            
            <div class="button-group">
                <button id="secante-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular</button>
                <button id="secante-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Ejemplo</button>
                <button id="secante-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
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
                        <h4>Raíz encontrada:</h4>
                        <p id="secante-root" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-redo"></i>
                    </div>
                    <div class="result-content">
                        <h4>Iteraciones:</h4>
                        <p id="secante-iter" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Error final:</h4>
                        <p id="secante-error" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="result-content">
                        <h4>f(raíz):</h4>
                        <p id="secante-fval" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-area"></i> Visualización</h4>
                    <div class="chart-wrapper">
                        <canvas id="secante-chart"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Iteraciones</h4>
                    <div class="table-wrapper">
                        <table id="secante-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-hashtag"></i> Iter</th>
                                    <th><i class="fas fa-x"></i> x₀</th>
                                    <th><i class="fas fa-x"></i> x₁</th>
                                    <th><i class="fas fa-fx"></i> f(x₁)</th>
                                    <th><i class="fas fa-percentage"></i> Error</th>
                                </tr>
                            </thead>
                            <tbody id="secante-table-body">
                                <tr><td colspan="5" class="empty-table">Ingresa valores y haz clic en Calcular</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('Secante.js: Interfaz creada correctamente');
}

function asignarEventosSecante() {
    console.log('Secante.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('secante-calc');
    const ejemploBtn = document.getElementById('secante-ejemplo');
    const clearBtn = document.getElementById('secante-clear');
    
    if (!calcBtn) {
        console.error('Secante.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores para evitar duplicados
    calcBtn.removeEventListener('click', calcularSecante);
    ejemploBtn?.removeEventListener('click', cargarEjemploSecante);
    clearBtn?.removeEventListener('click', limpiarSecante);
    
    // Asignar nuevos eventos
    calcBtn.addEventListener('click', calcularSecante);
    if (ejemploBtn) ejemploBtn.addEventListener('click', cargarEjemploSecante);
    if (clearBtn) clearBtn.addEventListener('click', limpiarSecante);
    
    console.log('Secante.js: Eventos asignados correctamente');
}

function cargarEjemploInicialSecante() {
    const funcInput = document.getElementById('secante-func');
    if (funcInput && !funcInput.value.trim()) {
        console.log('Secante.js: Cargando ejemplo inicial...');
        cargarEjemploSecante();
    }
}

function calcularSecante() {
    console.log('Secante.js: Calculando...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('secante-func');
    const x0El = document.getElementById('secante-x0');
    const x1El = document.getElementById('secante-x1');
    const tolEl = document.getElementById('secante-tol');
    const maxIterEl = document.getElementById('secante-maxiter');
    
    if (!funcEl || !x0El || !x1El || !tolEl || !maxIterEl) {
        showError('Error: Elementos de Secante no encontrados. Recarga la página.');
        return;
    }
    
    const funcStr = funcEl.value.trim();
    const x0 = parseFloat(x0El.value);
    const x1 = parseFloat(x1El.value);
    const tol = parseFloat(tolEl.value);
    const maxIter = parseInt(maxIterEl.value);
    
    // Validaciones
    if (!funcStr) {
        showError('Ingresa una función f(x)', 'secante-func');
        return;
    }
    
    if (isNaN(x0) || isNaN(x1)) {
        showError('Los puntos iniciales deben ser números', 'secante-x0');
        return;
    }
    
    if (x0 === x1) {
        showError('x₀ y x₁ deben ser diferentes', 'secante-x0');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('Tolerancia debe ser un número positivo', 'secante-tol');
        return;
    }
    
    if (isNaN(maxIter) || maxIter <= 0) {
        showError('Iteraciones debe ser un número positivo', 'secante-maxiter');
        return;
    }
    
    showLoading(document.getElementById('secante-calc'), true);
    
    setTimeout(() => {
        try {
            console.log('Secante.js: Ejecutando método...');
            const resultados = metodoSecante(funcStr, x0, x1, tol, maxIter);
            mostrarResultadosSecante(resultados);
        } catch (error) {
            showError('Error en cálculo: ' + error.message);
            console.error('Secante.js error:', error);
        } finally {
            showLoading(document.getElementById('secante-calc'), false);
        }
    }, 50);
}

function metodoSecante(funcStr, x0, x1, tol, maxIter) {
    console.log(`Secante.js: Método iniciado. x0=${x0}, x1=${x1}, tol=${tol}, maxIter=${maxIter}`);
    
    const iteraciones = [];
    let x_prev = x0;
    let x_curr = x1;
    let f_prev = evaluateExpression(funcStr, x_prev);
    let f_curr = evaluateExpression(funcStr, x_curr);
    
    for (let i = 0; i < maxIter; i++) {
        try {
            // Verificar que no haya división por cero
            if (Math.abs(f_curr - f_prev) < 1e-15) {
                throw new Error('Diferencia f(x₁)-f(x₀) muy pequeña. Cambia los puntos iniciales.');
            }
            
            // Fórmula del método de la secante
            const x_next = x_curr - f_curr * (x_curr - x_prev) / (f_curr - f_prev);
            const f_next = evaluateExpression(funcStr, x_next);
            const error = Math.abs(x_next - x_curr);
            
            iteraciones.push({
                iteracion: i + 1,
                x0: x_prev,
                x1: x_curr,
                fx1: f_curr,
                x_next: x_next,
                error: error
            });
            
            console.log(`Iter ${i+1}: x₀=${x_prev}, x₁=${x_curr}, f(x₁)=${f_curr}, error=${error}`);
            
            // Verificar convergencia
            if (error < tol || Math.abs(f_next) < tol) {
                console.log(`Secante.js: Convergió en ${i+1} iteraciones`);
                return {
                    raiz: x_next,
                    valorFuncion: f_next,
                    iteraciones: iteraciones,
                    errorFinal: error,
                    iteracionesRealizadas: i + 1,
                    convergio: true
                };
            }
            
            // Actualizar para siguiente iteración
            x_prev = x_curr;
            f_prev = f_curr;
            x_curr = x_next;
            f_curr = f_next;
            
        } catch (error) {
            throw new Error(`Error en iteración ${i+1}: ${error.message}`);
        }
    }
    
    console.log(`Secante.js: No convergió en ${maxIter} iteraciones`);
    return {
        raiz: x_curr,
        valorFuncion: f_curr,
        iteraciones: iteraciones,
        errorFinal: iteraciones.length > 0 ? iteraciones[iteraciones.length-1].error : Math.abs(x_curr - x_prev),
        iteracionesRealizadas: maxIter,
        convergio: false
    };
}

function mostrarResultadosSecante(resultados) {
    console.log('Secante.js: Mostrando resultados...');
    
    // Actualizar resultados principales
    document.getElementById('secante-root').textContent = formatNumber(resultados.raiz, 10);
    document.getElementById('secante-iter').textContent = resultados.iteracionesRealizadas;
    document.getElementById('secante-error').textContent = formatNumber(resultados.errorFinal, 10);
    document.getElementById('secante-fval').textContent = formatNumber(resultados.valorFuncion, 10);
    
    // Añadir indicador de convergencia
    const rootElement = document.getElementById('secante-root');
    if (rootElement) {
        rootElement.innerHTML = `${formatNumber(resultados.raiz, 8)} 
            <span style="margin-left: 10px; padding: 2px 8px; border-radius: 12px; 
                         font-size: 0.8rem; background-color: ${resultados.convergio ? '#d4edda' : '#f8d7da'}; 
                         color: ${resultados.convergio ? '#155724' : '#721c24'};">
                ${resultados.convergio ? '✓ Convergió' : '✗ No convergió'}
            </span>`;
    }
    
    // Actualizar tabla
    const tbody = document.getElementById('secante-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        resultados.iteraciones.forEach(iter => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${iter.iteracion}</td>
                <td>${formatNumber(iter.x0, 8)}</td>
                <td>${formatNumber(iter.x1, 8)}</td>
                <td>${formatNumber(iter.fx1, 8)}</td>
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
    crearGraficoSecante(resultados);
}

function crearGraficoSecante(resultados) {
    const funcEl = document.getElementById('secante-func');
    if (!funcEl) return;
    
    const funcStr = funcEl.value.trim();
    if (!funcStr) return;
    
    const raiz = resultados.raiz;
    
    // Definir rango de visualización
    let minX = raiz - 2;
    let maxX = raiz + 2;
    
    // Asegurarse de que incluya los puntos iniciales
    if (resultados.iteraciones.length > 0) {
        const firstIter = resultados.iteraciones[0];
        minX = Math.min(minX, firstIter.x0, firstIter.x1);
        maxX = Math.max(maxX, firstIter.x0, firstIter.x1);
    }
    
    // Generar puntos para la función
    const puntos = [];
    for (let x = minX; x <= maxX; x += (maxX - minX) / 200) {
        try {
            const y = evaluateExpression(funcStr, x);
            puntos.push({x: x, y: y});
        } catch (e) {
            puntos.push({x: x, y: null});
        }
    }
    
    // Puntos de iteraciones para el gráfico
    const iterPuntos = resultados.iteraciones.map(iter => ({
        x: iter.x1,
        y: iter.fx1
    }));
    
    // Añadir primer punto inicial si existe
    if (resultados.iteraciones.length > 0) {
        iterPuntos.unshift({
            x: resultados.iteraciones[0].x0,
            y: evaluateExpression(funcStr, resultados.iteraciones[0].x0)
        });
    }
    
    // Datasets para Chart.js
    const datasets = [
        {
            label: 'Función f(x)',
            data: puntos,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 2
        },
        {
            label: 'Aproximaciones',
            data: iterPuntos,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
        },
        {
            label: 'Raíz encontrada',
            data: [{x: raiz, y: 0}],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 10,
            pointHoverRadius: 12,
            showLine: false,
            pointStyle: 'star'
        }
    ];
    
    createChart('secante-chart', {
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
                title: { display: true, text: 'x' }
            },
            y: {
                title: { display: true, text: 'f(x)' }
            }
        }
    });
    
    console.log('Secante.js: Gráfico creado');
}

function cargarEjemploSecante() {
    console.log('Secante.js: Cargando ejemplo...');
    
    // Ejemplo simple
    document.getElementById('secante-func').value = 'x^3 - 2*x - 5';
    document.getElementById('secante-x0').value = '1';
    document.getElementById('secante-x1').value = '3';
    document.getElementById('secante-tol').value = '0.0001';
    document.getElementById('secante-maxiter').value = '50';
    
    setTimeout(calcularSecante, 300);
}

function limpiarSecante() {
    console.log('Secante.js: Limpiando...');
    
    document.getElementById('secante-func').value = '';
    document.getElementById('secante-x0').value = '1';
    document.getElementById('secante-x1').value = '3';
    document.getElementById('secante-tol').value = '0.0001';
    document.getElementById('secante-maxiter').value = '50';
    
    document.getElementById('secante-root').textContent = '-';
    document.getElementById('secante-iter').textContent = '-';
    document.getElementById('secante-error').textContent = '-';
    document.getElementById('secante-fval').textContent = '-';
    
    const tbody = document.getElementById('secante-table-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table">Ingresa valores y haz clic en Calcular</td></tr>';
    }
    
    if (window.charts && window.charts['secante-chart']) {
        window.charts['secante-chart'].destroy();
        delete window.charts['secante-chart'];
    }
}

// Función para probar rápidamente
function pruebaSecante() {
    console.log("=== PRUEBA DEL MÉTODO DE LA SECANTE ===");
    
    try {
        const resultados = metodoSecante("x^3 - 2*x - 5", 1, 3, 0.0001, 50);
        
        console.log("Función: x^3 - 2*x - 5");
        console.log("Puntos iniciales: x0=1, x1=3");
        console.log("Raíz encontrada:", resultados.raiz);
        console.log("Error final:", resultados.errorFinal);
        console.log("Iteraciones:", resultados.iteracionesRealizadas);
        console.log("f(raíz) =", resultados.valorFuncion);
        console.log("¿Convergió?", resultados.convergio);
        
        // Mostrar primeras 5 iteraciones
        console.log("\nPrimeras 5 iteraciones:");
        resultados.iteraciones.slice(0, 5).forEach(iter => {
            console.log(`Iter ${iter.iteracion}: x0=${iter.x0}, x1=${iter.x1}, f(x1)=${iter.fx1}, error=${iter.error}`);
        });
        
        return resultados;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}