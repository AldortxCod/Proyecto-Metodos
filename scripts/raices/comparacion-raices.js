// comparacion-raices.js - Comparación de Métodos CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    console.log('ComparacionRaices.js: Cargado');
    
    // Escuchar cuando la sección de raíces se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'raices') {
            console.log('ComparacionRaices.js: Sección raíces activada');
            setTimeout(inicializarComparacionRaices, 300);
        }
    });
    
    // Escuchar cuando se seleccione la comparación
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'comparacion') {
            console.log('ComparacionRaices.js: Comparación seleccionada');
            setTimeout(inicializarComparacionRaices, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarComparacionVisibilidad, 1000);
});

function verificarComparacionVisibilidad() {
    const comparacionContent = document.getElementById('comparacion-content');
    if (comparacionContent && !comparacionContent.classList.contains('hidden')) {
        console.log('ComparacionRaices.js: Ya visible al cargar');
        inicializarComparacionRaices();
    }
}

function inicializarComparacionRaices() {
    console.log('ComparacionRaices.js: Inicializando...');
    
    const comparacionContent = document.getElementById('comparacion-content');
    if (!comparacionContent) {
        console.error('ComparacionRaices.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE
    if (comparacionContent.innerHTML.trim() === '' || !document.getElementById('comp-raices-func')) {
        console.log('ComparacionRaices.js: Creando interfaz...');
        crearInterfazComparacionRaices();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES
    asignarEventosComparacion();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO
    cargarEjemploInicialComparacion();
}

function crearInterfazComparacionRaices() {
    const content = document.getElementById('comparacion-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-balance-scale"></i> Comparación de Métodos de Búsqueda de Raíces</h3>
            <p>Analiza y compara el rendimiento de diferentes métodos numéricos</p>
            
            <div class="ejemplo-principal" style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #f39c12;">
                <strong><i class="fas fa-chart-bar"></i> Ejemplo: Comparar métodos para √2</strong>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">Resolver f(x) = x² - 2 = 0 usando diferentes métodos</p>
            </div>
            
            <div class="input-group">
                <label for="comp-raices-func"><i class="fas fa-function"></i> Función f(x):</label>
                <input type="text" id="comp-raices-func" placeholder="x^2 - 2">
                <small>La ecuación a resolver: f(x) = 0</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="comp-raices-a"><i class="fas fa-arrow-left"></i> Límite inferior (a):</label>
                    <input type="number" id="comp-raices-a" value="0" step="0.1">
                </div>
                <div class="input-group">
                    <label for="comp-raices-b"><i class="fas fa-arrow-right"></i> Límite superior (b):</label>
                    <input type="number" id="comp-raices-b" value="3" step="0.1">
                </div>
                <div class="input-group">
                    <label for="comp-raices-tol"><i class="fas fa-bullseye"></i> Tolerancia:</label>
                    <input type="number" id="comp-raices-tol" value="0.00001" step="0.00001">
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="comp-raices-maxiter"><i class="fas fa-redo"></i> Máx. iteraciones:</label>
                    <input type="number" id="comp-raices-maxiter" value="100">
                </div>
                <div class="input-group">
                    <label for="comp-raices-x0"><i class="fas fa-crosshairs"></i> x₀ (Newton/PuntoFijo):</label>
                    <input type="number" id="comp-raices-x0" value="1.5" step="0.1">
                </div>
                <div class="input-group">
                    <label for="comp-raices-x1"><i class="fas fa-dot-circle"></i> x₁ (Secante):</label>
                    <input type="number" id="comp-raices-x1" value="2.5" step="0.1">
                </div>
            </div>
            
            <div class="checkbox-group">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-biseccion" checked>
                    <span><i class="fas fa-balance-scale"></i> Incluir Bisección</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-newton" checked>
                    <span><i class="fas fa-bolt"></i> Incluir Newton-Raphson</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-secante" checked>
                    <span><i class="fas fa-arrow-right"></i> Incluir Secante</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-puntofijo" checked>
                    <span><i class="fas fa-dot-circle"></i> Incluir Punto Fijo</span>
                </label>
            </div>
            
            <div class="button-group">
                <button id="comp-raices-calc" class="calc-btn"><i class="fas fa-chart-bar"></i> Comparar Métodos</button>
                <button id="comp-raices-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Ejemplo Predefinido</button>
                <button id="comp-raices-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-poll"></i> Resultados de la Comparación</h3>
            
            <div class="result-summary">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más rápido:</h4>
                        <p id="comp-mas-rapido" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más preciso:</h4>
                        <p id="comp-mas-preciso" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más estable:</h4>
                        <p id="comp-mas-estable" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-line"></i> Convergencia</h4>
                    <div class="chart-wrapper">
                        <canvas id="comp-chart-convergencia"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Comparación Detallada</h4>
                    <div class="table-wrapper">
                        <table id="comp-raices-tabla">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-calculator"></i> Método</th>
                                    <th><i class="fas fa-crosshairs"></i> Raíz</th>
                                    <th><i class="fas fa-redo"></i> Iteraciones</th>
                                    <th><i class="fas fa-clock"></i> Tiempo (ms)</th>
                                    <th><i class="fas fa-bullseye"></i> Error</th>
                                    <th><i class="fas fa-check-circle"></i> Convergió</th>
                                </tr>
                            </thead>
                            <tbody id="comp-raices-tabla-body">
                                <tr><td colspan="6" class="empty-table">Haz clic en "Comparar Métodos"</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4><i class="fas fa-chart-pie"></i> Análisis Comparativo</h4>
                <div class="chart-wrapper">
                    <canvas id="comp-chart-analisis"></canvas>
                </div>
            </div>
        </div>
    `;
    
    console.log('ComparacionRaices.js: Interfaz creada correctamente');
}

function asignarEventosComparacion() {
    console.log('ComparacionRaices.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('comp-raices-calc');
    const ejemploBtn = document.getElementById('comp-raices-ejemplo');
    const clearBtn = document.getElementById('comp-raices-clear');
    
    if (!calcBtn) {
        console.error('ComparacionRaices.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores para evitar duplicados
    calcBtn.removeEventListener('click', compararMetodosRaices);
    ejemploBtn?.removeEventListener('click', cargarEjemploComparacion);
    clearBtn?.removeEventListener('click', limpiarComparacion);
    
    // Asignar nuevos eventos
    calcBtn.addEventListener('click', compararMetodosRaices);
    if (ejemploBtn) ejemploBtn.addEventListener('click', cargarEjemploComparacion);
    if (clearBtn) clearBtn.addEventListener('click', limpiarComparacion);
    
    console.log('ComparacionRaices.js: Eventos asignados correctamente');
}

function cargarEjemploInicialComparacion() {
    const funcInput = document.getElementById('comp-raices-func');
    if (funcInput && !funcInput.value.trim()) {
        console.log('ComparacionRaices.js: Cargando ejemplo inicial...');
        cargarEjemploComparacion();
    }
}

function compararMetodosRaices() {
    console.log('ComparacionRaices.js: Comparando métodos...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('comp-raices-func');
    const aEl = document.getElementById('comp-raices-a');
    const bEl = document.getElementById('comp-raices-b');
    const tolEl = document.getElementById('comp-raices-tol');
    const maxIterEl = document.getElementById('comp-raices-maxiter');
    const x0El = document.getElementById('comp-raices-x0');
    const x1El = document.getElementById('comp-raices-x1');
    
    if (!funcEl || !aEl || !bEl || !tolEl || !maxIterEl || !x0El || !x1El) {
        showError('Error: Elementos de comparación no encontrados. Recarga la página.');
        return;
    }
    
    const funcStr = funcEl.value.trim();
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    const tol = parseFloat(tolEl.value);
    const maxIter = parseInt(maxIterEl.value);
    const x0 = parseFloat(x0El.value);
    const x1 = parseFloat(x1El.value);
    
    // Validaciones
    if (!funcStr) {
        showError('Ingresa una función f(x)', 'comp-raices-func');
        return;
    }
    
    if (isNaN(a) || isNaN(b)) {
        showError('Los límites a y b deben ser números', 'comp-raices-a');
        return;
    }
    
    if (a >= b) {
        showError('El límite a debe ser menor que b', 'comp-raices-a');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('Tolerancia debe ser un número positivo', 'comp-raices-tol');
        return;
    }
    
    if (isNaN(maxIter) || maxIter <= 0) {
        showError('Iteraciones debe ser un número positivo', 'comp-raices-maxiter');
        return;
    }
    
    // Verificar checkboxes
    const incluirBiseccion = document.getElementById('comp-incluir-biseccion').checked;
    const incluirNewton = document.getElementById('comp-incluir-newton').checked;
    const incluirSecante = document.getElementById('comp-incluir-secante').checked;
    const incluirPuntoFijo = document.getElementById('comp-incluir-puntofijo').checked;
    
    if (!incluirBiseccion && !incluirNewton && !incluirSecante && !incluirPuntoFijo) {
        showError('Selecciona al menos un método para comparar');
        return;
    }
    
    showLoading(document.getElementById('comp-raices-calc'), true);
    
    setTimeout(() => {
        try {
            console.log('ComparacionRaices.js: Ejecutando comparación...');
            const resultados = ejecutarComparacion(
                funcStr, a, b, tol, maxIter, x0, x1,
                incluirBiseccion, incluirNewton, incluirSecante, incluirPuntoFijo
            );
            mostrarResultadosComparacion(resultados);
        } catch (error) {
            showError('Error en comparación: ' + error.message);
            console.error('ComparacionRaices.js error:', error);
        } finally {
            showLoading(document.getElementById('comp-raices-calc'), false);
        }
    }, 50);
}

function ejecutarComparacion(funcStr, a, b, tol, maxIter, x0, x1, 
                             incluirBiseccion, incluirNewton, incluirSecante, incluirPuntoFijo) {
    
    const resultados = {};
    
    // Método de Bisección
    if (incluirBiseccion) {
        const startTime = performance.now();
        const resultadoBiseccion = ejecutarBiseccion(funcStr, a, b, tol, maxIter);
        const tiempo = performance.now() - startTime;
        
        resultados.biseccion = {
            nombre: 'Bisección',
            raiz: resultadoBiseccion.raiz,
            iteraciones: resultadoBiseccion.iteracionesRealizadas,
            tiempo: tiempo,
            error: resultadoBiseccion.errorFinal,
            convergio: resultadoBiseccion.convergio,
            color: '#3498db'
        };
    }
    
    // Método de Newton-Raphson
    if (incluirNewton) {
        const startTime = performance.now();
        const resultadoNewton = ejecutarNewton(funcStr, '', x0, tol, maxIter);
        const tiempo = performance.now() - startTime;
        
        resultados.newton = {
            nombre: 'Newton-Raphson',
            raiz: resultadoNewton.raiz,
            iteraciones: resultadoNewton.iteracionesRealizadas,
            tiempo: tiempo,
            error: resultadoNewton.errorFinal,
            convergio: resultadoNewton.convergio,
            color: '#e74c3c'
        };
    }
    
    // Método de la Secante
    if (incluirSecante) {
        const startTime = performance.now();
        const resultadoSecante = ejecutarSecante(funcStr, x0, x1, tol, maxIter);
        const tiempo = performance.now() - startTime;
        
        resultados.secante = {
            nombre: 'Secante',
            raiz: resultadoSecante.raiz,
            iteraciones: resultadoSecante.iteracionesRealizadas,
            tiempo: tiempo,
            error: resultadoSecante.errorFinal,
            convergio: resultadoSecante.convergio,
            color: '#2ecc71'
        };
    }
    
    // Método de Punto Fijo
    if (incluirPuntoFijo) {
        // Intentar crear g(x) automáticamente: g(x) = x - f(x)/k
        const k = 2; // Factor de relajación
        const gStr = `x - (${funcStr})/${k}`;
        
        const startTime = performance.now();
        const resultadoPuntoFijo = ejecutarPuntoFijo(gStr, x0, tol, maxIter);
        const tiempo = performance.now() - startTime;
        
        resultados.puntofijo = {
            nombre: 'Punto Fijo',
            raiz: resultadoPuntoFijo.raiz,
            iteraciones: resultadoPuntoFijo.iteracionesRealizadas,
            tiempo: tiempo,
            error: resultadoPuntoFijo.errorFinal,
            convergio: resultadoPuntoFijo.convergio,
            color: '#9b59b6'
        };
    }
    
    return resultados;
}

function ejecutarBiseccion(funcStr, a, b, tol, maxIter) {
    let x1 = a, x2 = b;
    let iteraciones = 0;
    let errorFinal = Math.abs(b - a);
    
    for (let i = 0; i < maxIter; i++) {
        const c = (x1 + x2) / 2;
        const fc = evaluateExpression(funcStr, c);
        const fa = evaluateExpression(funcStr, x1);
        
        if (Math.abs(fc) < tol || Math.abs(x2 - x1) < tol) {
            errorFinal = Math.abs(x2 - x1) / 2;
            return {
                raiz: c,
                iteracionesRealizadas: i + 1,
                errorFinal: errorFinal,
                convergio: true
            };
        }
        
        if (fa * fc < 0) x2 = c;
        else x1 = c;
        
        iteraciones = i + 1;
    }
    
    return {
        raiz: (x1 + x2) / 2,
        iteracionesRealizadas: maxIter,
        errorFinal: Math.abs(x2 - x1) / 2,
        convergio: false
    };
}

function ejecutarNewton(funcStr, dfuncStr, x0, tol, maxIter) {
    let x = x0;
    const h = 0.00001; // para derivada numérica
    
    for (let i = 0; i < maxIter; i++) {
        const fx = evaluateExpression(funcStr, x);
        
        // Derivada numérica si no se proporciona
        let dfx;
        if (dfuncStr.trim() !== '') {
            dfx = evaluateExpression(dfuncStr, x);
        } else {
            const fxh = evaluateExpression(funcStr, x + h);
            dfx = (fxh - fx) / h;
        }
        
        if (Math.abs(dfx) < 1e-15) {
            throw new Error('Derivada muy pequeña en Newton');
        }
        
        const xNext = x - fx / dfx;
        const error = Math.abs(xNext - x);
        
        if (error < tol || Math.abs(fx) < tol) {
            return {
                raiz: xNext,
                iteracionesRealizadas: i + 1,
                errorFinal: error,
                convergio: true
            };
        }
        
        x = xNext;
    }
    
    return {
        raiz: x,
        iteracionesRealizadas: maxIter,
        errorFinal: Math.abs(x - x0),
        convergio: false
    };
}

function ejecutarSecante(funcStr, x0, x1, tol, maxIter) {
    let xPrev = x0;
    let xCurr = x1;
    let fPrev = evaluateExpression(funcStr, xPrev);
    
    for (let i = 0; i < maxIter; i++) {
        const fCurr = evaluateExpression(funcStr, xCurr);
        
        if (Math.abs(fCurr - fPrev) < 1e-15) {
            throw new Error('Diferencia muy pequeña en Secante');
        }
        
        const xNext = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);
        const error = Math.abs(xNext - xCurr);
        
        if (error < tol || Math.abs(fCurr) < tol) {
            return {
                raiz: xNext,
                iteracionesRealizadas: i + 1,
                errorFinal: error,
                convergio: true
            };
        }
        
        xPrev = xCurr;
        fPrev = fCurr;
        xCurr = xNext;
    }
    
    return {
        raiz: xCurr,
        iteracionesRealizadas: maxIter,
        errorFinal: Math.abs(xCurr - xPrev),
        convergio: false
    };
}

function ejecutarPuntoFijo(gStr, x0, tol, maxIter) {
    let x = x0;
    
    for (let i = 0; i < maxIter; i++) {
        const gx = evaluateExpression(gStr, x);
        const error = Math.abs(gx - x);
        
        if (error < tol) {
            return {
                raiz: gx,
                iteracionesRealizadas: i + 1,
                errorFinal: error,
                convergio: true
            };
        }
        
        x = gx;
    }
    
    return {
        raiz: x,
        iteracionesRealizadas: maxIter,
        errorFinal: Math.abs(x - x0),
        convergio: false
    };
}

function mostrarResultadosComparacion(resultados) {
    console.log('ComparacionRaices.js: Mostrando resultados...');
    
    // Actualizar tabla
    const tbody = document.getElementById('comp-raices-tabla-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        let masRapido = { nombre: '', tiempo: Infinity };
        let masPreciso = { nombre: '', error: Infinity };
        let masEstable = { nombre: '', convergio: false };
        
        Object.values(resultados).forEach(metodo => {
            const row = document.createElement('tr');
            
            // Determinar emoji de convergencia
            const convergenciaEmoji = metodo.convergio ? '✅' : '❌';
            
            row.innerHTML = `
                <td style="color: ${metodo.color}; font-weight: bold;">
                    <i class="fas fa-calculator"></i> ${metodo.nombre}
                </td>
                <td>${formatNumber(metodo.raiz, 10)}</td>
                <td>${metodo.iteraciones}</td>
                <td>${formatNumber(metodo.tiempo, 2)} ms</td>
                <td>${formatNumber(metodo.error, 10)}</td>
                <td>${convergenciaEmoji} ${metodo.convergio ? 'Sí' : 'No'}</td>
            `;
            
            tbody.appendChild(row);
            
            // Encontrar el más rápido
            if (metodo.tiempo < masRapido.tiempo && metodo.convergio) {
                masRapido = { nombre: metodo.nombre, tiempo: metodo.tiempo };
            }
            
            // Encontrar el más preciso
            if (metodo.error < masPreciso.error && metodo.convergio) {
                masPreciso = { nombre: metodo.nombre, error: metodo.error };
            }
            
            // Encontrar el más estable (que haya convergido)
            if (metodo.convergio && !masEstable.convergio) {
                masEstable = { nombre: metodo.nombre, convergio: true };
            }
        });
        
        // Actualizar resumen
        document.getElementById('comp-mas-rapido').textContent = masRapido.nombre || '-';
        document.getElementById('comp-mas-preciso').textContent = masPreciso.nombre || '-';
        document.getElementById('comp-mas-estable').textContent = masEstable.nombre || '-';
    }
    
    // Crear gráficos
    crearGraficosComparacion(resultados);
}

function crearGraficosComparacion(resultados) {
    const metodos = Object.keys(resultados);
    if (metodos.length === 0) return;
    
    // Gráfico de convergencia (iteraciones)
    const labelsIteraciones = Object.values(resultados).map(m => m.nombre);
    const datosIteraciones = Object.values(resultados).map(m => m.iteraciones);
    const coloresIteraciones = Object.values(resultados).map(m => m.color);
    
    createChart('comp-chart-convergencia', {
        labels: labelsIteraciones,
        datasets: [{
            label: 'Iteraciones',
            data: datosIteraciones,
            backgroundColor: coloresIteraciones,
            borderColor: coloresIteraciones.map(c => c.replace('0.6', '1')),
            borderWidth: 2
        }]
    }, {
        type: 'bar',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Iteraciones por Método' }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Número de Iteraciones' }
            }
        }
    });
    
    // Gráfico de análisis (tiempo vs precisión)
    const datosAnalisis = Object.values(resultados).map(m => ({
        x: m.tiempo,
        y: -Math.log10(m.error + 1e-10), // Precisión (más alto = mejor)
        r: Math.min(20, m.iteraciones / 2) // Tamaño basado en iteraciones
    }));
    
    const labelsAnalisis = Object.values(resultados).map(m => m.nombre);
    
    createChart('comp-chart-analisis', {
        datasets: [{
            label: 'Métodos',
            data: datosAnalisis,
            backgroundColor: Object.values(resultados).map(m => m.color + '80'),
            borderColor: Object.values(resultados).map(m => m.color),
            borderWidth: 2,
            pointRadius: Object.values(resultados).map(m => Math.min(15, m.iteraciones / 5))
        }]
    }, {
        type: 'scatter',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const metodo = Object.values(resultados)[context.dataIndex];
                        return [
                            metodo.nombre,
                            `Tiempo: ${formatNumber(metodo.tiempo, 2)} ms`,
                            `Iteraciones: ${metodo.iteraciones}`,
                            `Error: ${formatNumber(metodo.error, 8)}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Tiempo (ms)' }
            },
            y: {
                title: { display: true, text: 'Precisión (-log₁₀(error))' }
            }
        }
    });
}

function cargarEjemploComparacion() {
    console.log('ComparacionRaices.js: Cargando ejemplo...');
    
    // Ejemplo: Resolver x² - 2 = 0 (√2 ≈ 1.41421356)
    document.getElementById('comp-raices-func').value = 'x^2 - 2';
    document.getElementById('comp-raices-a').value = '0';
    document.getElementById('comp-raices-b').value = '3';
    document.getElementById('comp-raices-tol').value = '0.00001';
    document.getElementById('comp-raices-maxiter').value = '100';
    document.getElementById('comp-raices-x0').value = '1.5';
    document.getElementById('comp-raices-x1').value = '2.5';
    
    // Activar todos los métodos
    document.getElementById('comp-incluir-biseccion').checked = true;
    document.getElementById('comp-incluir-newton').checked = true;
    document.getElementById('comp-incluir-secante').checked = true;
    document.getElementById('comp-incluir-puntofijo').checked = true;
    
    setTimeout(compararMetodosRaices, 300);
}

function limpiarComparacion() {
    console.log('ComparacionRaices.js: Limpiando...');
    
    document.getElementById('comp-raices-func').value = '';
    document.getElementById('comp-raices-a').value = '0';
    document.getElementById('comp-raices-b').value = '3';
    document.getElementById('comp-raices-tol').value = '0.00001';
    document.getElementById('comp-raices-maxiter').value = '100';
    document.getElementById('comp-raices-x0').value = '1.5';
    document.getElementById('comp-raices-x1').value = '2.5';
    
    // Resetear resultados
    document.getElementById('comp-mas-rapido').textContent = '-';
    document.getElementById('comp-mas-preciso').textContent = '-';
    document.getElementById('comp-mas-estable').textContent = '-';
    
    const tbody = document.getElementById('comp-raices-tabla-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-table">Haz clic en "Comparar Métodos"</td></tr>';
    }
    
    // Limpiar gráficos
    if (window.charts && window.charts['comp-chart-convergencia']) {
        window.charts['comp-chart-convergencia'].destroy();
        delete window.charts['comp-chart-convergencia'];
    }
    
    if (window.charts && window.charts['comp-chart-analisis']) {
        window.charts['comp-chart-analisis'].destroy();
        delete window.charts['comp-chart-analisis'];
    }
}

// Función para prueba rápida
function pruebaComparacionRaices() {
    console.log("=== PRUEBA DE COMPARACIÓN DE MÉTODOS ===");
    
    try {
        const resultados = ejecutarComparacion(
            'x^2 - 2', 0, 3, 0.00001, 100, 1.5, 2.5,
            true, true, true, true
        );
        
        console.log("Función: x² - 2 = 0");
        console.log("Resultados:");
        Object.values(resultados).forEach(metodo => {
            console.log(`${metodo.nombre}:`);
            console.log(`  Raíz: ${metodo.raiz}`);
            console.log(`  Iteraciones: ${metodo.iteraciones}`);
            console.log(`  Tiempo: ${metodo.tiempo} ms`);
            console.log(`  Error: ${metodo.error}`);
            console.log(`  Convergió: ${metodo.convergio}`);
        });
        
        return resultados;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}