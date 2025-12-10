// runge-kutta.js - Método de Runge-Kutta de 4to Orden
document.addEventListener('DOMContentLoaded', function() {
    console.log('RungeKutta.js: Cargado');
    
    // Escuchar cuando la sección de EDO se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'edo') {
            console.log('RungeKutta.js: Sección EDO activada');
            setTimeout(inicializarRungeKutta, 300);
        }
    });
    
    // Escuchar cuando se seleccione Runge-Kutta
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'runge-kutta') {
            console.log('RungeKutta.js: Método Runge-Kutta seleccionado');
            setTimeout(inicializarRungeKutta, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarRungeKuttaVisibilidad, 1000);
});

function verificarRungeKuttaVisibilidad() {
    const rkContent = document.getElementById('runge-kutta-content');
    if (rkContent && !rkContent.classList.contains('hidden')) {
        console.log('RungeKutta.js: Ya visible al cargar');
        inicializarRungeKutta();
    }
}

function inicializarRungeKutta() {
    console.log('RungeKutta.js: Inicializando...');
    
    const rkContent = document.getElementById('runge-kutta-content');
    if (!rkContent) {
        console.error('RungeKutta.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE
    if (rkContent.innerHTML.trim() === '' || !document.getElementById('rk-func')) {
        console.log('RungeKutta.js: Creando interfaz...');
        crearInterfazRungeKutta();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES
    asignarEventosRungeKutta();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO
    cargarEjemploInicialRungeKutta();
}

function crearInterfazRungeKutta() {
    const content = document.getElementById('runge-kutta-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-crown"></i> Método de Runge-Kutta de 4to Orden</h3>
            <p>Aplicación: Alta precisión para problemas de ecuaciones diferenciales en ingeniería, física y ciencias</p>
            
            <!-- Selector de ejemplos (como bisección) -->
            <div class="ejemplo-selector-container" id="rk-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="rk-func"><i class="fas fa-function"></i> EDO: dy/dx = f(x, y)</label>
                <input type="text" id="rk-func" placeholder="ej: y - x^2 + 1" value="y - x^2 + 1">
                <small>Usa 'x' para variable independiente, 'y' para dependiente. Ej: -2*y + x^2</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="rk-x0"><i class="fas fa-play"></i> x inicial (x₀)</label>
                    <input type="number" id="rk-x0" value="0" step="0.1">
                </div>
                <div class="input-group">
                    <label for="rk-y0"><i class="fas fa-play-circle"></i> y inicial (y₀)</label>
                    <input type="number" id="rk-y0" value="0.5" step="0.1">
                </div>
                <div class="input-group">
                    <label for="rk-xf"><i class="fas fa-stop"></i> x final (x_f)</label>
                    <input type="number" id="rk-xf" value="2" step="0.1">
                </div>
                <div class="input-group">
                    <label for="rk-h"><i class="fas fa-ruler"></i> Tamaño de paso (h)</label>
                    <input type="number" id="rk-h" value="0.5" step="0.05">
                    <small>Runge-Kutta permite pasos más grandes por su alta precisión</small>
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="rk-tol"><i class="fas fa-bullseye"></i> Tolerancia (para paso adaptativo)</label>
                    <input type="number" id="rk-tol" value="0.0001" step="0.00001">
                </div>
                <div class="input-group">
                    <label for="rk-maxiter"><i class="fas fa-redo"></i> Máx. pasos</label>
                    <input type="number" id="rk-maxiter" value="100">
                </div>
                <div class="input-group">
                    <label for="rk-metodo"><i class="fas fa-cogs"></i> Tipo de RK</label>
                    <select id="rk-metodo">
                        <option value="rk4">RK4 Clásico</option>
                        <option value="rk4-adaptativo">RK4 Adaptativo</option>
                        <option value="comparar">Comparar con Euler y Heun</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group">
                <label for="rk-sol-exacta"><i class="fas fa-check-double"></i> Solución exacta (opcional, para comparar)</label>
                <input type="text" id="rk-sol-exacta" placeholder="ej: (x+1)^2 - 0.5*exp(x)" value="(x+1)^2 - 0.5*Math.exp(x)">
                <small>Si se proporciona, se calculará el error exacto y se mostrará en gráfico</small>
            </div>
            
            <div class="button-group">
                <button id="rk-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular</button>
                <button id="rk-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="rk-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="rk-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4>Valor final y(x_f):</h4>
                    <p id="rk-yfinal">-</p>
                    
                    <h4>Número de pasos:</h4>
                    <p id="rk-pasos">-</p>
                    
                    <h4>Error global estimado:</h4>
                    <p id="rk-error">-</p>
                    
                    <h4>Tiempo de cómputo:</h4>
                    <p id="rk-tiempo">-</p>
                    
                    <!-- Indicador de convergencia como bisección -->
                    <div id="rk-convergencia" style="margin-top: 1rem;"></div>
                </div>
                
                <div class="result-chart">
                    <canvas id="rk-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Pasos del Método (primeros 10)</h4>
                <div class="table-container">
                    <table id="rk-table">
                        <thead>
                            <tr>
                                <th>n</th>
                                <th>xₙ</th>
                                <th>yₙ</th>
                                <th>k₁</th>
                                <th>k₂</th>
                                <th>k₃</th>
                                <th>k₄</th>
                                <th>yₙ₊₁</th>
                                <th>Error Paso</th>
                            </tr>
                        </thead>
                        <tbody id="rk-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
                <div class="table-note" id="rk-table-note">
                    <i class="fas fa-info-circle"></i> Mostrando primeros 10 pasos. Ver gráfico para solución completa.
                </div>
            </div>
            
            <!-- Comparación con otros métodos (si se selecciona) -->
            <div class="comparison-section" id="rk-comparacion-section" style="display: none; margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación de Métodos</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="rk-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="rk-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>y(x_f)</th>
                                    <th>Error</th>
                                    <th>Pasos</th>
                                    <th>Tiempo</th>
                                    <th>Orden</th>
                                </tr>
                            </thead>
                            <tbody id="rk-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('RungeKutta.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemplosRK();
}

function inicializarSelectorEjemplosRK() {
    const ejemplos = [
        {
            nombre: "EDO Lineal Básica",
            descripcion: "Problema clásico con solución analítica conocida",
            funcion: "y - x*x + 1",
            x0: "0",
            y0: "0.5",
            xf: "2",
            h: "0.2",
            solExacta: "(x+1)*(x+1) - 0.5*Math.exp(x)",
            nota: "EDO: y' = y - x² + 1, Solución: y(x) = (x+1)² - 0.5e^x"
        },
        {
            nombre: "Crecimiento Exponencial",
            descripcion: "Modelo de población sin restricciones",
            funcion: "0.2*y",
            x0: "0",
            y0: "100",
            xf: "10",
            h: "1",
            solExacta: "100*Math.exp(0.2*x)",
            nota: "EDO: y' = 0.2y, Solución: y(x) = 100e^{0.2x}"
        },
        {
            nombre: "Oscilador Armónico",
            descripcion: "Movimiento masa-resorte sin amortiguamiento",
            funcion: "-4*y",
            x0: "0",
            y0: "1",
            xf: "10",
            h: "0.1",
            solExacta: "Math.cos(2*x)",
            nota: "EDO: y'' + 4y = 0 transformada a sistema"
        },
        {
            nombre: "Circuito RC",
            descripcion: "Descarga de capacitor en circuito RC",
            funcion: "-y/0.1",
            x0: "0",
            y0: "5",
            xf: "1",
            h: "0.1",
            solExacta: "5*Math.exp(-10*x)",
            nota: "EDO: dV/dt = -V/RC, R=1Ω, C=0.1F"
        },
        {
            nombre: "Ecuación Logística",
            descripcion: "Crecimiento poblacional con capacidad límite",
            funcion: "0.1*y*(1 - y/1000)",
            x0: "0",
            y0: "10",
            xf: "50",
            h: "1",
            solExacta: "1000/(1 + 99*Math.exp(-0.1*x))",
            nota: "Modelo de Verhulst: y' = ry(1 - y/K)"
        },
        {
            nombre: "Caída Libre con Fricción",
            descripcion: "Velocidad de caída con resistencia del aire",
            funcion: "9.8 - 0.1*y",
            x0: "0",
            y0: "0",
            xf: "20",
            h: "0.5",
            solExacta: "98*(1 - Math.exp(-0.1*x))",
            nota: "EDO: dv/dt = g - (k/m)v"
        }
    ];
    
    const selector = document.getElementById('rk-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
            <h4 style="margin-bottom: 1rem; color: #2c3e50;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Runge-Kutta
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #e74c3c; margin-bottom: 0.5rem;">
                            <i class="fas fa-microscope"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-rk-ejemplo-btn" data-index="${index}" 
                                style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; 
                                       border-radius: 4px; cursor: pointer; width: 100%;">
                            <i class="fas fa-upload"></i> Cargar este ejemplo
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Agregar eventos a los botones de ejemplo
    setTimeout(() => {
        document.querySelectorAll('.cargar-rk-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoRK(ejemplos[index]);
            });
        });
    }, 100);
}

function asignarEventosRungeKutta() {
    console.log('RungeKutta.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('rk-calc');
    const ejemploBtn = document.getElementById('rk-ejemplo');
    const clearBtn = document.getElementById('rk-clear');
    
    if (!calcBtn) {
        console.error('RungeKutta.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores para evitar duplicados
    calcBtn.removeEventListener('click', calcularRungeKutta);
    ejemploBtn?.removeEventListener('click', mostrarMasEjemplosRK);
    clearBtn?.removeEventListener('click', limpiarRungeKutta);
    
    // Asignar nuevos eventos
    calcBtn.addEventListener('click', calcularRungeKutta);
    if (ejemploBtn) ejemploBtn.addEventListener('click', mostrarMasEjemplosRK);
    if (clearBtn) clearBtn.addEventListener('click', limpiarRungeKutta);
    
    console.log('RungeKutta.js: Eventos asignados correctamente');
}

function cargarEjemploInicialRungeKutta() {
    const funcInput = document.getElementById('rk-func');
    if (funcInput && !funcInput.value.trim()) {
        console.log('RungeKutta.js: Cargando ejemplo inicial...');
        // Cargar primer ejemplo del selector
        const ejemplo = {
            nombre: "EDO Lineal Básica",
            descripcion: "Problema clásico con solución analítica conocida",
            funcion: "y - x*x + 1",
            x0: "0",
            y0: "0.5",
            xf: "2",
            h: "0.2",
            solExacta: "(x+1)*(x+1) - 0.5*Math.exp(x)",
            nota: "EDO: y' = y - x² + 1, Solución: y(x) = (x+1)² - 0.5e^x"
        };
        cargarEjemploEspecificoRK(ejemplo);
    }
}

function cargarEjemploEspecificoRK(ejemplo) {
    console.log(`RungeKutta.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    document.getElementById('rk-func').value = ejemplo.funcion;
    document.getElementById('rk-x0').value = ejemplo.x0;
    document.getElementById('rk-y0').value = ejemplo.y0;
    document.getElementById('rk-xf').value = ejemplo.xf;
    document.getElementById('rk-h').value = ejemplo.h;
    document.getElementById('rk-sol-exacta').value = ejemplo.solExacta || '';
    document.getElementById('rk-tol').value = '0.0001';
    document.getElementById('rk-maxiter').value = '100';
    document.getElementById('rk-metodo').value = 'rk4';
    
    // Mostrar descripción del ejemplo (como bisección)
    let descripcion = document.getElementById('rk-descripcion-ejemplo');
    if (!descripcion) {
        descripcion = document.createElement('div');
        descripcion.id = 'rk-descripcion-ejemplo';
        const inputSection = document.querySelector('#runge-kutta-content .input-group:first-child');
        if (inputSection) {
            inputSection.parentNode.insertBefore(descripcion, inputSection.nextSibling);
        }
    }
    
    descripcion.innerHTML = `
        <div style="padding: 1rem; background: #fef9e7; border-radius: 6px; border-left: 4px solid #f39c12;">
            <strong style="color: #d35400;">
                <i class="fas fa-info-circle"></i> Ejemplo práctico:
            </strong> ${ejemplo.descripcion}
            ${ejemplo.nota ? `<br><small><i class="fas fa-lightbulb"></i> ${ejemplo.nota}</small>` : ''}
            <br><small><i class="fas fa-crown"></i> <strong>Ventaja RK4:</strong> Alta precisión (orden 4) ideal para este tipo de problemas.</small>
        </div>
    `;
    
    // Calcular automáticamente después de un breve delay
    setTimeout(() => {
        calcularRungeKutta();
    }, 400);
}

// FUNCIÓN CRÍTICA: Evaluador de expresiones matemáticas para EDOs
function evaluateExpressionRK(expression, x, y) {
    if (!expression || typeof expression !== 'string') {
        throw new Error('Expresión no válida');
    }
    
    // Reemplazar funciones matemáticas para evaluación segura
    let expr = expression.trim();
    
    // Reemplazar variables
    expr = expr.replace(/x/g, `(${x})`);
    expr = expr.replace(/y/g, `(${y})`);
    
    // Reemplazar funciones matemáticas
    expr = expr.replace(/sin\(/g, 'Math.sin(');
    expr = expr.replace(/cos\(/g, 'Math.cos(');
    expr = expr.replace(/tan\(/g, 'Math.tan(');
    expr = expr.replace(/exp\(/g, 'Math.exp(');
    expr = expr.replace(/log\(/g, 'Math.log(');
    expr = expr.replace(/ln\(/g, 'Math.log(');
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
    expr = expr.replace(/abs\(/g, 'Math.abs(');
    expr = expr.replace(/pow\(/g, 'Math.pow(');
    expr = expr.replace(/\^/g, '**'); // Operador potencia
    
    // Manejar pi y e
    expr = expr.replace(/pi/g, 'Math.PI');
    expr = expr.replace(/e/g, 'Math.E');
    
    // Validar que la expresión solo contenga caracteres seguros
    const safePattern = /^[0-9\+\-\*\/\(\)\.\sMathsincostanexplogsqrtabspowePI]*$/;
    if (!safePattern.test(expr)) {
        throw new Error('Expresión contiene caracteres no permitidos');
    }
    
    try {
        // Evaluación segura usando Function
        const func = new Function('return ' + expr);
        const result = func();
        
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            throw new Error('Resultado no es un número finito');
        }
        
        return result;
    } catch (error) {
        console.error('Error evaluando expresión:', expr, error);
        throw new Error(`Error evaluando expresión: ${error.message}`);
    }
}

function calcularRungeKutta() {
    console.log('RungeKutta.js: Calculando...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('rk-func');
    const x0El = document.getElementById('rk-x0');
    const y0El = document.getElementById('rk-y0');
    const xfEl = document.getElementById('rk-xf');
    const hEl = document.getElementById('rk-h');
    const tolEl = document.getElementById('rk-tol');
    const maxIterEl = document.getElementById('rk-maxiter');
    const metodoEl = document.getElementById('rk-metodo');
    const solExactaEl = document.getElementById('rk-sol-exacta');
    
    if (!funcEl || !x0El || !y0El || !xfEl || !hEl || !tolEl || !maxIterEl || !metodoEl) {
        showError('Error: Elementos de Runge-Kutta no encontrados. Recarga la página.');
        return;
    }
    
    const funcStr = funcEl.value.trim();
    const x0 = parseFloat(x0El.value);
    const y0 = parseFloat(y0El.value);
    const xf = parseFloat(xfEl.value);
    const h = parseFloat(hEl.value);
    const tol = parseFloat(tolEl.value);
    const maxIter = parseInt(maxIterEl.value);
    const metodo = metodoEl.value;
    const solExactaStr = solExactaEl ? solExactaEl.value.trim() : '';
    
    // Validaciones (como bisección)
    if (!funcStr) {
        showError('Por favor ingresa la EDO', 'rk-func');
        return;
    }
    
    if (isNaN(x0) || isNaN(y0)) {
        showError('Valores iniciales deben ser números válidos', 'rk-x0');
        return;
    }
    
    if (isNaN(xf) || xf <= x0) {
        showError('x final debe ser mayor que x inicial', 'rk-xf');
        return;
    }
    
    if (isNaN(h) || h <= 0) {
        showError('El tamaño de paso debe ser positivo', 'rk-h');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('La tolerancia debe ser un número positivo', 'rk-tol');
        return;
    }
    
    if (isNaN(maxIter) || maxIter <= 0) {
        showError('El número máximo de pasos debe ser positivo', 'rk-maxiter');
        return;
    }
    
    // Mostrar loading (como bisección)
    showLoading(document.getElementById('rk-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            let resultados;
            if (metodo === 'comparar') {
                resultados = ejecutarComparacionMetodos(funcStr, x0, y0, xf, h, tol, maxIter, solExactaStr);
            } else if (metodo === 'rk4-adaptativo') {
                resultados = metodoRungeKuttaAdaptativo(funcStr, x0, y0, xf, h, tol, maxIter, solExactaStr);
            } else {
                resultados = metodoRungeKutta4(funcStr, x0, y0, xf, h, maxIter, solExactaStr);
            }
            
            const fin = performance.now();
            resultados.tiempo = fin - inicio;
            
            mostrarResultadosRungeKutta(resultados, metodo);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('RungeKutta.js error:', error);
        } finally {
            showLoading(document.getElementById('rk-calc'), false);
        }
    }, 100);
}

function metodoRungeKutta4(funcStr, x0, y0, xf, h, maxIter, solExactaStr = null) {
    console.log(`RungeKutta.js: RK4 iniciado. x0=${x0}, y0=${y0}, xf=${xf}, h=${h}`);
    
    const pasos = [];
    let xn = x0;
    let yn = y0;
    const n = Math.min(maxIter, Math.ceil((xf - x0) / h));
    const hAjustado = (xf - x0) / n;
    
    // Función para evaluar la EDO
    function f(x, y) {
        return evaluateExpressionRK(funcStr, x, y);
    }
    
    // Función para solución exacta si existe
    let solExacta = null;
    if (solExactaStr) {
        solExacta = function(x) {
            return evaluateExpressionRK(solExactaStr, x, 0); // y no es necesario aquí
        };
    }
    
    for (let i = 0; i <= n; i++) {
        // Calcular las cuatro pendientes de RK4
        const k1 = f(xn, yn);
        const k2 = f(xn + hAjustado/2, yn + hAjustado*k1/2);
        const k3 = f(xn + hAjustado/2, yn + hAjustado*k2/2);
        const k4 = f(xn + hAjustado, yn + hAjustado*k3);
        
        // Calcular siguiente valor
        const yn1 = i < n ? yn + (hAjustado/6) * (k1 + 2*k2 + 2*k3 + k4) : yn;
        
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
        
        // Calcular error estimado (diferencia entre RK4 y Euler para estimación)
        const errorEstimado = i < n ? Math.abs(hAjustado * (k1 - (k1 + 2*k2 + 2*k3 + k4)/6)) : null;
        
        // Guardar paso
        pasos.push({
            n: i,
            x: xn,
            y: yn,
            k1: k1,
            k2: k2,
            k3: k3,
            k4: k4,
            yn1: i < n ? yn1 : null,
            errorLocal: errorLocal,
            errorEstimado: errorEstimado,
            yExacta: yExacta
        });
        
        // Actualizar para siguiente iteración (excepto en el último paso)
        if (i < n) {
            xn = x0 + (i + 1) * hAjustado;
            yn = yn1;
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
    
    return {
        pasos: pasos,
        yFinal: yn,
        numPasos: n,
        errorGlobal: errorGlobal,
        hAjustado: hAjustado,
        x0: x0,
        xf: xf,
        metodo: 'RK4 Clásico'
    };
}

function metodoRungeKuttaAdaptativo(funcStr, x0, y0, xf, hInicial, tol, maxIter, solExactaStr = null) {
    console.log(`RungeKutta.js: RK4 Adaptativo iniciado. tol=${tol}`);
    
    const pasos = [];
    let xn = x0;
    let yn = y0;
    let h = hInicial;
    let iter = 0;
    
    function f(x, y) {
        return evaluateExpressionRK(funcStr, x, y);
    }
    
    let solExacta = null;
    if (solExactaStr) {
        solExacta = function(x) {
            return evaluateExpressionRK(solExactaStr, x, 0);
        };
    }
    
    while (xn < xf && iter < maxIter) {
        // Paso completo con h
        const k1 = f(xn, yn);
        const k2 = f(xn + h/2, yn + h*k1/2);
        const k3 = f(xn + h/2, yn + h*k2/2);
        const k4 = f(xn + h, yn + h*k3);
        const yFull = yn + (h/6) * (k1 + 2*k2 + 2*k3 + k4);
        
        // Dos medios pasos con h/2
        const h2 = h/2;
        
        // Primer medio paso
        const k1a = f(xn, yn);
        const k2a = f(xn + h2/2, yn + h2*k1a/2);
        const k3a = f(xn + h2/2, yn + h2*k2a/2);
        const k4a = f(xn + h2, yn + h2*k3a);
        const yHalf1 = yn + (h2/6) * (k1a + 2*k2a + 2*k3a + k4a);
        
        // Segundo medio paso
        const k1b = f(xn + h2, yHalf1);
        const k2b = f(xn + h2 + h2/2, yHalf1 + h2*k1b/2);
        const k3b = f(xn + h2 + h2/2, yHalf1 + h2*k2b/2);
        const k4b = f(xn + h2 + h2, yHalf1 + h2*k3b);
        const yTwoHalf = yHalf1 + (h2/6) * (k1b + 2*k2b + 2*k3b + k4b);
        
        // Estimación del error
        const errorEst = Math.abs(yFull - yTwoHalf) / 15; // Factor 1/15 para RK4
        
        // Calcular error local si hay solución exacta
        let errorLocal = null;
        let yExacta = null;
        if (solExacta) {
            try {
                yExacta = solExacta(xn);
                errorLocal = Math.abs(yn - yExacta);
            } catch (e) {}
        }
        
        // Guardar paso
        pasos.push({
            n: iter,
            x: xn,
            y: yn,
            k1: k1,
            k2: k2,
            k3: k3,
            k4: k4,
            yn1: yTwoHalf, // Usamos el más preciso
            errorLocal: errorLocal,
            errorEstimado: errorEst,
            hUsado: h,
            yExacta: yExacta
        });
        
        // Control adaptativo del paso
        if (errorEst < tol) {
            // Paso aceptado
            xn = xn + h;
            yn = yTwoHalf; // Usar resultado más preciso
            
            // Aumentar h si el error es muy pequeño
            if (errorEst < tol/10) {
                h = Math.min(h * 1.5, xf - xn);
            }
        } else {
            // Reducir h y repetir paso
            h = h * 0.5;
            if (h < 1e-10) {
                throw new Error('Tamaño de paso muy pequeño. Posible inestabilidad.');
            }
            continue;
        }
        
        iter++;
    }
    
    // Asegurar que llegamos a xf
    if (xn < xf) {
        const hFinal = xf - xn;
        const k1 = f(xn, yn);
        const k2 = f(xn + hFinal/2, yn + hFinal*k1/2);
        const k3 = f(xn + hFinal/2, yn + hFinal*k2/2);
        const k4 = f(xn + hFinal, yn + hFinal*k3);
        yn = yn + (hFinal/6) * (k1 + 2*k2 + 2*k3 + k4);
        xn = xf;
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
        numPasos: iter,
        errorGlobal: errorGlobal,
        hInicial: hInicial,
        x0: x0,
        xf: xf,
        metodo: 'RK4 Adaptativo',
        tolUsada: tol
    };
}

function ejecutarComparacionMetodos(funcStr, x0, y0, xf, h, tol, maxIter, solExactaStr = null) {
    console.log('RungeKutta.js: Ejecutando comparación de métodos');
    
    const resultados = {
        comparacion: true,
        metodos: {}
    };
    
    // Euler
    const inicioEuler = performance.now();
    const eulerResult = metodoEulerSimple(funcStr, x0, y0, xf, h, maxIter, solExactaStr);
    resultados.metodos.euler = {
        ...eulerResult,
        tiempo: performance.now() - inicioEuler,
        nombre: 'Euler',
        color: '#3498db',
        orden: 1
    };
    
    // Heun
    const inicioHeun = performance.now();
    const heunResult = metodoHeunSimple(funcStr, x0, y0, xf, h, maxIter, solExactaStr);
    resultados.metodos.heun = {
        ...heunResult,
        tiempo: performance.now() - inicioHeun,
        nombre: 'Heun',
        color: '#9b59b6',
        orden: 2
    };
    
    // RK4
    const inicioRK4 = performance.now();
    const rk4Result = metodoRungeKutta4(funcStr, x0, y0, xf, h, maxIter, solExactaStr);
    resultados.metodos.rk4 = {
        ...rk4Result,
        tiempo: performance.now() - inicioRK4,
        nombre: 'RK4',
        color: '#e74c3c',
        orden: 4
    };
    
    return resultados;
}

function metodoEulerSimple(funcStr, x0, y0, xf, h, maxIter, solExactaStr = null) {
    let xn = x0;
    let yn = y0;
    const n = Math.min(maxIter, Math.ceil((xf - x0) / h));
    const hAjustado = (xf - x0) / n;
    
    function f(x, y) {
        return evaluateExpressionRK(funcStr, x, y);
    }
    
    for (let i = 0; i < n; i++) {
        yn = yn + hAjustado * f(xn, yn);
        xn = x0 + (i + 1) * hAjustado;
    }
    
    let errorGlobal = null;
    if (solExactaStr) {
        try {
            const yExacta = evaluateExpressionRK(solExactaStr, xf, 0);
            errorGlobal = Math.abs(yn - yExacta);
        } catch (e) {}
    }
    
    return {
        yFinal: yn,
        numPasos: n,
        errorGlobal: errorGlobal,
        x0: x0,
        xf: xf
    };
}

function metodoHeunSimple(funcStr, x0, y0, xf, h, maxIter, solExactaStr = null) {
    let xn = x0;
    let yn = y0;
    const n = Math.min(maxIter, Math.ceil((xf - x0) / h));
    const hAjustado = (xf - x0) / n;
    
    function f(x, y) {
        return evaluateExpressionRK(funcStr, x, y);
    }
    
    for (let i = 0; i < n; i++) {
        const k1 = f(xn, yn);
        const predictor = yn + hAjustado * k1;
        const k2 = f(xn + hAjustado, predictor);
        yn = yn + (hAjustado/2) * (k1 + k2);
        xn = x0 + (i + 1) * hAjustado;
    }
    
    let errorGlobal = null;
    if (solExactaStr) {
        try {
            const yExacta = evaluateExpressionRK(solExactaStr, xf, 0);
            errorGlobal = Math.abs(yn - yExacta);
        } catch (e) {}
    }
    
    return {
        yFinal: yn,
        numPasos: n,
        errorGlobal: errorGlobal,
        x0: x0,
        xf: xf
    };
}

function mostrarResultadosRungeKutta(resultados, metodo) {
    console.log('RungeKutta.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.rkResultados = resultados;
    
    if (metodo === 'comparar' && resultados.comparacion) {
        mostrarComparacionMetodos(resultados);
        return;
    }
    
    // Resultados para RK4 normal o adaptativo
    document.getElementById('rk-yfinal').textContent = formatNumber(resultados.yFinal, 10);
    document.getElementById('rk-pasos').textContent = resultados.numPasos;
    document.getElementById('rk-error').textContent = resultados.errorGlobal !== null ? 
        formatNumber(resultados.errorGlobal, 10) : 'No disponible';
    document.getElementById('rk-tiempo').textContent = formatNumber(resultados.tiempo, 2) + ' ms';
    
    // Añadir indicador de convergencia (como bisección)
    const convergenciaDiv = document.getElementById('rk-convergencia');
    convergenciaDiv.innerHTML = '';
    
    const indicator = document.createElement('span');
    indicator.className = 'convergencia-indicator';
    indicator.style.cssText = `
        display: inline-block;
        margin-left: 10px;
        padding: 2px 12px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: normal;
    `;
    
    let convergio = true;
    let mensaje = '';
    if (resultados.errorGlobal !== null) {
        if (resultados.errorGlobal < 0.001) {
            mensaje = '✓ Alta precisión';
            indicator.style.backgroundColor = '#d4edda';
            indicator.style.color = '#155724';
        } else if (resultados.errorGlobal < 0.01) {
            mensaje = '✓ Buena precisión';
            indicator.style.backgroundColor = '#fff3cd';
            indicator.style.color = '#856404';
        } else {
            mensaje = '⚠ Precisión moderada';
            indicator.style.backgroundColor = '#f8d7da';
            indicator.style.color = '#721c24';
            convergio = false;
        }
    } else {
        mensaje = '✓ Método ejecutado';
        indicator.style.backgroundColor = '#d1ecf1';
        indicator.style.color = '#0c5460';
    }
    
    indicator.textContent = mensaje;
    convergenciaDiv.appendChild(indicator);
    
    // Actualizar tabla (primeros 10 pasos, como bisección)
    actualizarTablaRungeKutta(resultados.pasos);
    
    // Crear gráfico
    crearGraficoRungeKutta(resultados);
    
    // Ocultar sección de comparación si estaba visible
    document.getElementById('rk-comparacion-section').style.display = 'none';
}

function mostrarComparacionMetodos(resultados) {
    console.log('RungeKutta.js: Mostrando comparación...');
    
    // Mostrar sección de comparación
    const comparacionSection = document.getElementById('rk-comparacion-section');
    comparacionSection.style.display = 'block';
    
    // Actualizar tabla de comparación
    const tbody = document.getElementById('rk-comparacion-body');
    tbody.innerHTML = '';
    
    Object.values(resultados.metodos).forEach(metodo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: ${metodo.color}; font-weight: bold;">
                <i class="fas fa-calculator"></i> ${metodo.nombre}
            </td>
            <td>${formatNumber(metodo.yFinal, 8)}</td>
            <td>${metodo.errorGlobal !== null ? formatNumber(metodo.errorGlobal, 8) : 'N/A'}</td>
            <td>${metodo.numPasos}</td>
            <td>${formatNumber(etodo.tiempo, 2)} ms</td>
            <td>${metodo.orden}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Crear gráfico comparativo
    crearGraficoComparativoRK(resultados);
    
    // Ocultar resultados individuales
    document.getElementById('rk-yfinal').textContent = '-';
    document.getElementById('rk-pasos').textContent = '-';
    document.getElementById('rk-error').textContent = '-';
    document.getElementById('rk-tiempo').textContent = '-';
    document.getElementById('rk-convergencia').innerHTML = '';
    document.getElementById('rk-table-body').innerHTML = '<tr><td colspan="9" class="empty-table">Ejecutando comparación...</td></tr>';
}

function actualizarTablaRungeKutta(pasos) {
    const tbody = document.getElementById('rk-table-body');
    tbody.innerHTML = '';
    
    // Mostrar solo primeros 10 pasos (como bisección muestra iteraciones)
    const pasosMostrar = pasos.slice(0, 10);
    
    pasosMostrar.forEach(paso => {
        const row = document.createElement('tr');
        
        // Resaltar si el error es grande
        let bgColor = '';
        if (paso.errorLocal !== null && paso.errorLocal > 0.01) {
            bgColor = 'background-color: rgba(255, 200, 200, 0.3);';
        }
        
        row.innerHTML = `
            <td>${paso.n}</td>
            <td>${formatNumber(paso.x, 4)}</td>
            <td style="font-weight: bold; ${bgColor}">${formatNumber(paso.y, 6)}</td>
            <td>${formatNumber(paso.k1, 6)}</td>
            <td>${formatNumber(paso.k2, 6)}</td>
            <td>${formatNumber(paso.k3, 6)}</td>
            <td>${formatNumber(paso.k4, 6)}</td>
            <td>${paso.yn1 !== null ? formatNumber(paso.yn1, 6) : '-'}</td>
            <td>${paso.errorEstimado !== null ? formatNumber(paso.errorEstimado, 6) : '-'}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Nota si hay más pasos
    const nota = document.getElementById('rk-table-note');
    if (pasos.length > 10) {
        nota.style.display = 'block';
        nota.innerHTML = `<i class="fas fa-info-circle"></i> Mostrando 10 de ${pasos.length} pasos. Ver gráfico para solución completa.`;
    } else {
        nota.style.display = 'none';
    }
}

function crearGraficoRungeKutta(resultados) {
    const pasos = resultados.pasos;
    const solExactaStr = document.getElementById('rk-sol-exacta')?.value.trim();
    
    // Datos del método de Runge-Kutta
    const puntosRK = pasos.map(paso => ({
        x: paso.x,
        y: paso.y
    }));
    
    const datasets = [
        {
            label: `Solución ${resultados.metodo || 'RK4'}`,
            data: puntosRK,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            fill: false,
            tension: 0.1,
            pointRadius: 3,
            borderWidth: 2
        }
    ];
    
    // Solución exacta si existe
    if (solExactaStr) {
        const x0 = resultados.x0;
        const xf = resultados.xf;
        const numPuntos = 200;
        const puntosExacta = [];
        
        for (let i = 0; i <= numPuntos; i++) {
            const x = x0 + (xf - x0) * (i / numPuntos);
            try {
                const y = evaluateExpressionRK(solExactaStr, x, 0);
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
    
    // Campos de dirección para visualización
    if (pasos.length > 0) {
        const camposDireccion = [];
        const x0 = resultados.x0;
        const xf = resultados.xf;
        const yMin = Math.min(...pasos.map(p => p.y));
        const yMax = Math.max(...pasos.map(p => p.y));
        const funcStr = document.getElementById('rk-func').value.trim();
        
        // Generar algunos campos de dirección
        const numCampos = 8;
        for (let i = 0; i < numCampos; i++) {
            const x = x0 + (xf - x0) * (i / (numCampos - 1));
            for (let j = 0; j < 4; j++) {
                const y = yMin + (yMax - yMin) * (j / 3);
                try {
                    const pendiente = evaluateExpressionRK(funcStr, x, y);
                    const longitud = 0.15;
                    
                    // Agregar al dataset
                    datasets.push({
                        label: 'Campo de dirección',
                        data: [
                            { x: x - longitud/2, y: y - pendiente*longitud/2 },
                            { x: x + longitud/2, y: y + pendiente*longitud/2 }
                        ],
                        borderColor: 'rgba(52, 152, 219, 0.3)',
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0,
                        pointRadius: 0,
                        borderWidth: 1,
                        showLine: true
                    });
                } catch (error) {}
            }
        }
    }
    
    const data = { datasets };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'nearest',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
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
                    text: 'x',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'y(x)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
    
    // Crear gráfico usando la función global createChart o directamente
    const ctx = document.getElementById('rk-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.rkChart) {
        window.rkChart.destroy();
    }
    
    window.rkChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function crearGraficoComparativoRK(resultados) {
    const solExactaStr = document.getElementById('rk-sol-exacta')?.value.trim();
    const metodos = Object.values(resultados.metodos);
    
    const datasets = [];
    
    // Agregar cada método (solo RK4 para simplificar)
    metodos.forEach(metodo => {
        // Solo graficar el método principal
        if (metodo.nombre === 'RK4') {
            const puntosRK = metodo.pasos.map(paso => ({
                x: paso.x,
                y: paso.y
            }));
            
            datasets.push({
                label: `${metodo.nombre} (Orden ${metodo.orden})`,
                data: puntosRK,
                borderColor: metodo.color,
                backgroundColor: metodo.color + '20',
                fill: false,
                tension: 0.1,
                pointRadius: 2,
                borderWidth: 2
            });
        }
    });
    
    // Solución exacta si existe
    if (solExactaStr) {
        const x0 = metodos[0].x0 || 0;
        const xf = metodos[0].xf || 2;
        const numPuntos = 200;
        const puntosExacta = [];
        
        for (let i = 0; i <= numPuntos; i++) {
            const x = x0 + (xf - x0) * (i / numPuntos);
            try {
                const y = evaluateExpressionRK(solExactaStr, x, 0);
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
            },
            title: {
                display: true,
                text: 'Comparación de Métodos Numéricos',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'x'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'y(x)'
                }
            }
        }
    };
    
    const ctx = document.getElementById('rk-comparacion-chart').getContext('2d');
    
    if (window.rkComparacionChart) {
        window.rkComparacionChart.destroy();
    }
    
    window.rkComparacionChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function mostrarMasEjemplosRK() {
    const ejemplosExtras = [
        {
            nombre: "Sistema de Lorenz Simplificado",
            descripcion: "Modelo caótico en meteorología",
            funcion: "10*(0.5 - y)",
            x0: "0",
            y0: "1",
            xf: "25",
            h: "0.01",
            solExacta: "",
            nota: "Sistema de 3 EDOs acopladas - Comportamiento caótico"
        },
        {
            nombre: "Ecuación de Van der Pol",
            descripcion: "Oscilador no lineal en electrónica",
            funcion: "y2", // Esto sería un sistema de 2 ecuaciones
            x0: "0",
            y0: "0.5",
            xf: "20",
            h: "0.05",
            solExacta: "",
            nota: "μ(y²-1)y' + y = 0 (oscilador de relajación)"
        },
        {
            nombre: "Reacción Química Autocatalítica",
            descripcion: "Reacción donde el producto acelera su producción",
            funcion: "y*(1 - y)",
            x0: "0",
            y0: "0.01",
            xf: "10",
            h: "0.2",
            solExacta: "1/(1 + 99*Math.exp(-x))",
            nota: "Modelo logístico de crecimiento autocatalítico"
        },
        {
            nombre: "Modelo SEIR Simplificado",
            descripcion: "Modelo epidemiológico con período latente",
            funcion: "-0.3*y*0.8 + 0.1*0.1",
            x0: "0",
            y0: "0.001",
            xf: "100",
            h: "1",
            solExacta: "",
            nota: "S → E → I → R (modelo SEIR simplificado)"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="rk-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Más Ejemplos Avanzados</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #e74c3c; margin-bottom: 0.5rem;">
                                    <i class="fas fa-rocket"></i> ${ejemplo.nombre}
                                </h5>
                                <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                                    ${ejemplo.descripcion}
                                </p>
                                ${ejemplo.nota ? `
                                <div style="font-size: 0.8rem; color: #7f8c8d; background: #f8f9fa; 
                                     padding: 0.5rem; border-radius: 4px; margin-bottom: 1rem;">
                                    <i class="fas fa-lightbulb"></i> ${ejemplo.nota}
                                </div>
                                ` : ''}
                                <button class="cargar-rk-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; 
                                               border-radius: 4px; cursor: pointer; width: 100%;">
                                    <i class="fas fa-play-circle"></i> Cargar y Ejecutar
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalExistente = document.getElementById('rk-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('rk-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-rk-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoRK(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarRungeKutta() {
    console.log('RungeKutta.js: Limpiando...');
    
    // Limpiar inputs (como bisección)
    document.getElementById('rk-func').value = '';
    document.getElementById('rk-x0').value = '0';
    document.getElementById('rk-y0').value = '0.5';
    document.getElementById('rk-xf').value = '2';
    document.getElementById('rk-h').value = '0.5';
    document.getElementById('rk-tol').value = '0.0001';
    document.getElementById('rk-maxiter').value = '100';
    document.getElementById('rk-metodo').value = 'rk4';
    document.getElementById('rk-sol-exacta').value = '';
    
    // Limpiar resultados (como bisección)
    document.getElementById('rk-yfinal').textContent = '-';
    document.getElementById('rk-pasos').textContent = '-';
    document.getElementById('rk-error').textContent = '-';
    document.getElementById('rk-tiempo').textContent = '-';
    document.getElementById('rk-convergencia').innerHTML = '';
    
    // Limpiar tabla
    document.getElementById('rk-table-body').innerHTML = '';
    document.getElementById('rk-table-note').style.display = 'block';
    document.getElementById('rk-table-note').innerHTML = '<i class="fas fa-info-circle"></i> Mostrando primeros 10 pasos. Ver gráfico para solución completa.';
    
    // Limpiar comparación
    document.getElementById('rk-comparacion-section').style.display = 'none';
    document.getElementById('rk-comparacion-body').innerHTML = '';
    
    // Remover descripción de ejemplo (como bisección)
    const descripcion = document.getElementById('rk-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    if (window.rkChart) {
        window.rkChart.destroy();
        window.rkChart = null;
    }
    
    if (window.rkComparacionChart) {
        window.rkComparacionChart.destroy();
        window.rkComparacionChart = null;
    }
    
    // Crear gráfico vacío (como bisección)
    const ctx = document.getElementById('rk-chart').getContext('2d');
    window.rkChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Ingresa una EDO y haz clic en Calcular',
                data: [],
                borderColor: 'rgba(200, 200, 200, 0.5)',
                borderWidth: 1,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'x' } },
                y: { title: { display: true, text: 'y(x)' } }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            style: 'italic',
                            color: '#666'
                        }
                    }
                }
            }
        }
    });
    
    console.log('RungeKutta.js: Limpieza completada');
}

// Función de prueba rápida (como bisección)
function pruebaRapidaRungeKutta() {
    console.log("=== PRUEBA DEL MÉTODO DE RUNGE-KUTTA 4 ===");
    
    try {
        const resultados = metodoRungeKutta4('y - x*x + 1', 0, 0.5, 2, 0.2, 50, '(x+1)*(x+1) - 0.5*Math.exp(x)');
        
        console.log("EDO: y' = y - x² + 1");
        console.log("Condiciones: y(0) = 0.5");
        console.log("Intervalo: [0, 2], h = 0.2");
        console.log("Número de pasos:", resultados.numPasos);
        console.log("y(2) aproximado:", resultados.yFinal);
        console.log("Error global:", resultados.errorGlobal);
        
        // Mostrar primer paso detallado
        console.log("\nPrimer paso (k1, k2, k3, k4):");
        const primerPaso = resultados.pasos[0];
        console.log(`k1 = f(0, 0.5) = ${primerPaso.k1}`);
        console.log(`k2 = f(0.1, ${0.5 + 0.2*primerPaso.k1/2}) = ${primerPaso.k2}`);
        console.log(`k3 = f(0.1, ${0.5 + 0.2*primerPaso.k2/2}) = ${primerPaso.k3}`);
        console.log(`k4 = f(0.2, ${0.5 + 0.2*primerPaso.k3}) = ${primerPaso.k4}`);
        console.log(`y1 = 0.5 + (0.2/6)*(${primerPaso.k1} + 2*${primerPaso.k2} + 2*${primerPaso.k3} + ${primerPaso.k4}) = ${primerPaso.yn1}`);
        
        return resultados;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaRungeKutta);