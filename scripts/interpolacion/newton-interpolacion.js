/**
 * newton-interpolacion.js - Interpolación de Newton con Diferencias Divididas
 * Implementa polinomios interpolantes usando el método de Newton
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('NewtonInterpolacion.js: Cargado');
    
    // Escuchar cuando la sección de interpolación se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'interpolacion') {
            console.log('NewtonInterpolacion.js: Sección Interpolación activada');
            setTimeout(inicializarNewton, 300);
        }
    });
    
    // Escuchar cuando se seleccione Newton
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'newton-interpolacion') {
            console.log('NewtonInterpolacion.js: Método Newton seleccionado');
            setTimeout(inicializarNewton, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarNewtonVisibilidad, 1000);
});

function verificarNewtonVisibilidad() {
    const newtonContent = document.getElementById('newton-interpolacion-content');
    if (newtonContent && !newtonContent.classList.contains('hidden')) {
        console.log('NewtonInterpolacion.js: Ya visible al cargar');
        inicializarNewton();
    }
}

function inicializarNewton() {
    console.log('NewtonInterpolacion.js: Inicializando...');
    
    const newtonContent = document.getElementById('newton-interpolacion-content');
    if (!newtonContent) {
        console.error('NewtonInterpolacion.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.newtonInitialized) {
        console.log('NewtonInterpolacion.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (newtonContent.innerHTML.trim() === '' || !document.getElementById('newton-numpuntos')) {
        console.log('NewtonInterpolacion.js: Creando interfaz...');
        crearInterfazNewton();
    }
    
    // Asignar eventos
    asignarEventosNewton();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialNewton();
    
    // Marcar como inicializado
    window.newtonInitialized = true;
    console.log('NewtonInterpolacion.js: Inicialización completada');
}

function crearInterfazNewton() {
    const content = document.getElementById('newton-interpolacion-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-sitemap"></i> Interpolación de Newton</h3>
            <p>Construye polinomios interpolantes usando diferencias divididas</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="newton-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="newton-numpuntos"><i class="fas fa-sort-numeric-up"></i> Número de puntos</label>
                <input type="number" id="newton-numpuntos" value="4" min="2" max="10" step="1">
                <small>Cantidad de puntos conocidos para la interpolación</small>
            </div>
            
            <!-- Contenedor dinámico para puntos -->
            <div id="newton-puntos-container">
                <!-- Se generará dinámicamente -->
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="newton-x-eval"><i class="fas fa-search"></i> Valor x a interpolar</label>
                    <input type="number" id="newton-x-eval" value="1.5" step="0.1">
                    <small>Punto donde se evaluará el polinomio interpolante</small>
                </div>
                <div class="input-group">
                    <label for="newton-orden"><i class="fas fa-sort-amount-up"></i> Orden máximo</label>
                    <input type="number" id="newton-orden" value="3" min="1" max="10" step="1">
                    <small>Orden del polinomio interpolante (grado máximo)</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="newton-tipo"><i class="fas fa-cogs"></i> Tipo de polinomio</label>
                <select id="newton-tipo">
                    <option value="diferencias-divididas">Diferencias Divididas</option>
                    <option value="diferencias-progresivas">Diferencias Progresivas</option>
                    <option value="diferencias-regresivas">Diferencias Regresivas</option>
                </select>
                <small>Selecciona el tipo de polinomio de Newton a usar</small>
            </div>
            
            <div class="input-group">
                <label for="newton-func-original"><i class="fas fa-function"></i> Función original (opcional)</label>
                <input type="text" id="newton-func-original" placeholder="ej: x^2">
                <small>Si se proporciona, se comparará con el polinomio interpolante</small>
            </div>
            
            <div class="button-group">
                <button id="newton-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular Interpolación</button>
                <button id="newton-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="newton-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="newton-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados de Interpolación</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor interpolado:</h4>
                    <p id="newton-resultado" style="font-size: 1.5rem; font-weight: bold; color: #9b59b6;">-</p>
                    
                    <h4><i class="fas fa-file-code"></i> Polinomio de Newton:</h4>
                    <div id="newton-polynomial" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem; line-height: 1.4;">
                        <!-- Polinomio se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-ruler"></i> Error máximo:</h4>
                            <p id="newton-error">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="newton-tiempo">-</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="newton-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Tabla de Diferencias Divididas</h4>
                <div class="table-container">
                    <table id="newton-table">
                        <thead>
                            <tr>
                                <th>xᵢ</th>
                                <th>f[xᵢ]</th>
                                <th>f[xᵢ,xᵢ₊₁]</th>
                                <th>f[xᵢ,xᵢ₊₁,xᵢ₊₂]</th>
                                <th>f[xᵢ,...,xᵢ₊₃]</th>
                                <th>f[xᵢ,...,xᵢ₊₄]</th>
                            </tr>
                        </thead>
                        <tbody id="newton-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con función original si existe -->
            <div class="comparison-section" id="newton-comparacion-section" style="display: none; margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Función Original</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="newton-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="newton-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>f(x)</th>
                                    <th>P(x) interpolado</th>
                                    <th>Error</th>
                                    <th>Error Relativo %</th>
                                </tr>
                            </thead>
                            <tbody id="newton-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Ventajas de Newton -->
            <div class="conclusion-box" id="newton-ventajas-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border-radius: 8px; border-left: 4px solid #9b59b6;">
                <h4 style="margin-top: 0; color: #9b59b6;">
                    <i class="fas fa-lightbulb"></i> Ventajas del Método de Newton
                </h4>
                <ul style="margin-bottom: 0;">
                    <li><strong>Eficiencia computacional:</strong> O(n²) vs O(n³) de Lagrange</li>
                    <li><strong>Reutilización de cálculos:</strong> Al agregar un nuevo punto, solo se calcula una nueva diferencia</li>
                    <li><strong>Forma anidada:</strong> El polinomio se puede evaluar eficientemente con el esquema de Horner</li>
                    <li><strong>Diferencias divididas:</strong> Útiles para derivación e integración numérica</li>
                </ul>
            </div>
        </div>
    `;
    
    console.log('NewtonInterpolacion.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemplosNewton();
    
    // Generar campos de puntos iniciales
    generarCamposPuntosNewton();
    
    // Agregar evento para actualizar campos cuando cambia el número de puntos
    document.getElementById('newton-numpuntos').addEventListener('change', generarCamposPuntosNewton);
}

function inicializarSelectorEjemplosNewton() {
    const ejemplos = [
        {
            nombre: "Función Cuadrática",
            descripcion: "Aproximación de f(x) = x² usando 4 puntos",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 4 },
                { x: 3, y: 9 }
            ],
            xEval: "1.5",
            funcionOriginal: "x^2",
            orden: "3",
            tipo: "diferencias-divididas",
            nota: "Polinomio de Newton reproduce exactamente polinomios de grado ≤ n"
        },
        {
            nombre: "Función Seno",
            descripcion: "Aproximación de sin(x) en [0, π] con puntos equiespaciados",
            puntos: [
                { x: 0, y: 0 },
                { x: 1.0472, y: 0.8660 }, // π/3
                { x: 2.0944, y: 0.8660 }, // 2π/3
                { x: 3.1416, y: 0 }       // π
            ],
            xEval: "1.2",
            funcionOriginal: "sin(x)",
            orden: "3",
            tipo: "diferencias-divididas",
            nota: "Excelente ejemplo para ver las diferencias divididas en acción"
        },
        {
            nombre: "Función Exponencial",
            descripcion: "Aproximación de e^x con puntos no equiespaciados",
            puntos: [
                { x: 0, y: 1 },
                { x: 0.5, y: 1.6487 },
                { x: 1.2, y: 3.3201 },
                { x: 1.8, y: 6.0496 },
                { x: 2.5, y: 12.1825 }
            ],
            xEval: "1.7",
            funcionOriginal: "exp(x)",
            orden: "4",
            tipo: "diferencias-divididas",
            nota: "Las diferencias divididas capturan bien el crecimiento exponencial"
        },
        {
            nombre: "Fenómeno de Runge",
            descripcion: "Demostración con f(x) = 1/(1+25x²) - puntos equiespaciados",
            puntos: [
                { x: -1.0, y: 0.0385 },
                { x: -0.5, y: 0.1379 },
                { x: 0.0, y: 1.0000 },
                { x: 0.5, y: 0.1379 },
                { x: 1.0, y: 0.0385 }
            ],
            xEval: "0.3",
            funcionOriginal: "1/(1+25*x^2)",
            orden: "4",
            tipo: "diferencias-divididas",
            nota: "Las diferencias divididas muestran oscilaciones numéricas"
        },
        {
            nombre: "Puntos de Chebyshev",
            descripcion: "Función de Runge con puntos de Chebyshev",
            puntos: [
                { x: -0.9511, y: 0.0410 },
                { x: -0.5878, y: 0.2246 },
                { x: 0.0, y: 1.0000 },
                { x: 0.5878, y: 0.2246 },
                { x: 0.9511, y: 0.0410 }
            ],
            xEval: "0.3",
            funcionOriginal: "1/(1+25*x^2)",
            orden: "4",
            tipo: "diferencias-divididas",
            nota: "Los puntos de Chebyshev minimizan el fenómeno de Runge"
        },
        {
            nombre: "Datos Experimentales",
            descripcion: "Mediciones de experimento físico con ruido",
            puntos: [
                { x: 0, y: 1.2 },
                { x: 0.3, y: 1.7 },
                { x: 0.6, y: 2.4 },
                { x: 0.9, y: 2.9 },
                { x: 1.2, y: 3.3 },
                { x: 1.5, y: 3.6 }
            ],
            xEval: "1.0",
            funcionOriginal: "",
            orden: "5",
            tipo: "diferencias-progresivas",
            nota: "Diferencias progresivas útiles para datos equiespaciados"
        }
    ];
    
    const selector = document.getElementById('newton-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #9b59b6;">
            <h4 style="margin-bottom: 1rem; color: #9b59b6;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Interpolación de Newton
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #9b59b6; margin-bottom: 0.5rem;">
                            <i class="fas fa-sitemap"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-newton-ejemplo-btn" data-index="${index}" 
                                style="background: #9b59b6; color: white; border: none; padding: 0.5rem 1rem; 
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
        document.querySelectorAll('.cargar-newton-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoNewton(ejemplos[index]);
            });
        });
    }, 100);
}

function generarCamposPuntosNewton() {
    const numPuntos = parseInt(document.getElementById('newton-numpuntos').value);
    const container = document.getElementById('newton-puntos-container');
    
    if (!container) return;
    
    let html = '<div class="input-group"><label><i class="fas fa-dot-circle"></i> Puntos (xᵢ, yᵢ):</label>';
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 0.5rem;">';
    
    for (let i = 0; i < numPuntos; i++) {
        html += `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border: 1px solid #dee2e6;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: #9b59b6;">Punto ${i+1}</strong>
                    <span style="background: #9b59b620; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">
                        f[x${i}]
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                        <label style="font-size: 0.8rem; color: #666;">x${i}</label>
                        <input type="number" class="newton-punto-x" data-index="${i}" 
                               value="${i}" step="0.1" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; color: #666;">y${i} = f(x${i})</label>
                        <input type="number" class="newton-punto-y" data-index="${i}" 
                               value="${i*i}" step="0.1" style="width: 100%;">
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

function asignarEventosNewton() {
    console.log('NewtonInterpolacion.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('newton-calc');
    const ejemploBtn = document.getElementById('newton-ejemplo');
    const clearBtn = document.getElementById('newton-clear');
    
    if (!calcBtn) {
        console.error('NewtonInterpolacion.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularNewton);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemplosNewton);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarNewton);
    }
    
    console.log('NewtonInterpolacion.js: Eventos asignados correctamente');
}

function cargarEjemploInicialNewton() {
    const puntosInputs = document.querySelectorAll('.newton-punto-x');
    if (puntosInputs.length === 0 || puntosInputs[0].value === '') {
        console.log('NewtonInterpolacion.js: Cargando ejemplo inicial...');
        
        const ejemplo = {
            nombre: "Función Cuadrática",
            descripcion: "Aproximación de f(x) = x² usando 4 puntos",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 4 },
                { x: 3, y: 9 }
            ],
            xEval: "1.5",
            funcionOriginal: "x^2",
            orden: "3",
            tipo: "diferencias-divididas",
            nota: "Polinomio de Newton reproduce exactamente polinomios de grado ≤ n"
        };
        
        cargarEjemploEspecificoNewton(ejemplo);
    }
}

function cargarEjemploEspecificoNewton(ejemplo) {
    console.log(`NewtonInterpolacion.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar número de puntos
    document.getElementById('newton-numpuntos').value = ejemplo.puntos.length;
    generarCamposPuntosNewton();
    
    // Dar tiempo para que se generen los campos
    setTimeout(() => {
        // Rellenar puntos
        ejemplo.puntos.forEach((punto, index) => {
            const xInput = document.querySelector(`.newton-punto-x[data-index="${index}"]`);
            const yInput = document.querySelector(`.newton-punto-y[data-index="${index}"]`);
            if (xInput) xInput.value = punto.x;
            if (yInput) yInput.value = punto.y;
        });
        
        // Configurar otros valores
        document.getElementById('newton-x-eval').value = ejemplo.xEval;
        document.getElementById('newton-orden').value = ejemplo.orden;
        document.getElementById('newton-tipo').value = ejemplo.tipo;
        document.getElementById('newton-func-original').value = ejemplo.funcionOriginal || '';
        
        // Mostrar descripción del ejemplo
        let descripcion = document.getElementById('newton-descripcion-ejemplo');
        if (!descripcion) {
            descripcion = document.createElement('div');
            descripcion.id = 'newton-descripcion-ejemplo';
            const inputSection = document.querySelector('#newton-interpolacion-content .input-group:first-child');
            if (inputSection) {
                inputSection.parentNode.insertBefore(descripcion, inputSection.nextSibling);
            }
        }
        
        descripcion.innerHTML = `
            <div style="padding: 1rem; background: #f3e8ff; border-radius: 6px; border-left: 4px solid #9b59b6;">
                <strong style="color: #8e44ad;">
                    <i class="fas fa-info-circle"></i> Ejemplo práctico:
                </strong> ${ejemplo.descripcion}
                ${ejemplo.nota ? `<br><small><i class="fas fa-lightbulb"></i> ${ejemplo.nota}</small>` : ''}
                <br><small><i class="fas fa-sitemap"></i> <strong>Ventaja Newton:</strong> Forma eficiente y fácil de actualizar con nuevos puntos.</small>
            </div>
        `;
        
        // Calcular automáticamente después de un breve delay
        setTimeout(() => {
            calcularNewton();
        }, 400);
        
    }, 200);
}

function calcularNewton() {
    console.log('NewtonInterpolacion.js: Calculando interpolación...');
    
    // OBTENER ELEMENTOS
    const numPuntosEl = document.getElementById('newton-numpuntos');
    const xEvalEl = document.getElementById('newton-x-eval');
    const ordenEl = document.getElementById('newton-orden');
    const tipoEl = document.getElementById('newton-tipo');
    const funcOriginalEl = document.getElementById('newton-func-original');
    
    if (!numPuntosEl || !xEvalEl || !ordenEl || !tipoEl) {
        showError('Error: Elementos de Newton no encontrados. Recarga la página.');
        return;
    }
    
    const numPuntos = parseInt(numPuntosEl.value);
    const xEval = parseFloat(xEvalEl.value);
    const orden = parseInt(ordenEl.value);
    const tipo = tipoEl.value;
    const funcOriginalStr = funcOriginalEl ? funcOriginalEl.value.trim() : '';
    
    // Obtener puntos
    const puntos = [];
    for (let i = 0; i < numPuntos; i++) {
        const xInput = document.querySelector(`.newton-punto-x[data-index="${i}"]`);
        const yInput = document.querySelector(`.newton-punto-y[data-index="${i}"]`);
        
        if (!xInput || !yInput) {
            showError(`Punto ${i+1} no encontrado. Actualiza la página.`);
            return;
        }
        
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        
        if (isNaN(x) || isNaN(y)) {
            showError(`Punto ${i+1} no es válido`, `newton-punto-x[data-index="${i}"]`);
            return;
        }
        
        puntos.push({ x: x, y: y });
    }
    
    // Ordenar puntos por x (importante para Newton)
    puntos.sort((a, b) => a.x - b.x);
    
    // Validaciones
    if (puntos.length < 2) {
        showError('Se necesitan al menos 2 puntos para interpolación', 'newton-numpuntos');
        return;
    }
    
    if (isNaN(xEval)) {
        showError('El valor x a evaluar debe ser un número válido', 'newton-x-eval');
        return;
    }
    
    if (orden < 1 || orden >= puntos.length) {
        showError(`El orden debe estar entre 1 y ${puntos.length-1}`, 'newton-orden');
        return;
    }
    
    // Verificar que los x sean distintos
    const xValues = puntos.map(p => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== puntos.length) {
        showError('Los valores de x deben ser distintos para interpolación');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('newton-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular interpolación según el tipo seleccionado
            let resultado;
            if (tipo === 'diferencias-progresivas') {
                resultado = calcularInterpolacionNewtonProgresivo(puntos, xEval, orden);
            } else if (tipo === 'diferencias-regresivas') {
                resultado = calcularInterpolacionNewtonRegresivo(puntos, xEval, orden);
            } else {
                resultado = calcularInterpolacionNewtonDivididas(puntos, xEval, orden);
            }
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            // Calcular polinomio completo si hay función original
            if (funcOriginalStr) {
                resultado.funcOriginal = {
                    str: funcOriginalStr,
                    evaluada: evaluateExpression(funcOriginalStr, xEval)
                };
                resultado.errorAbsoluto = Math.abs(resultado.valorInterpolado - resultado.funcOriginal.evaluada);
            }
            
            mostrarResultadosNewton(resultado, puntos, xEval, tipo, funcOriginalStr);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('NewtonInterpolacion.js error:', error);
        } finally {
            showLoading(document.getElementById('newton-calc'), false);
        }
    }, 100);
}

function calcularInterpolacionNewtonDivididas(puntos, xEval, orden) {
    console.log(`NewtonInterpolacion.js: Calculando interpolación con diferencias divididas`);
    
    const n = Math.min(orden + 1, puntos.length);
    const diferencias = calcularDiferenciasDivididas(puntos, n);
    
    // Evaluar polinomio usando el esquema de Horner
    let valorInterpolado = diferencias[0][0]; // f[x0]
    let producto = 1;
    
    for (let i = 1; i < n; i++) {
        producto *= (xEval - puntos[i-1].x);
        valorInterpolado += diferencias[0][i] * producto;
    }
    
    // Construir polinomio como string
    const polinomioString = construirPolinomioNewtonString(puntos, diferencias);
    
    return {
        valorInterpolado: valorInterpolado,
        diferencias: diferencias,
        polinomioString: polinomioString,
        puntos: puntos,
        xEval: xEval,
        tipo: 'Diferencias Divididas',
        n: n
    };
}

function calcularDiferenciasDivididas(puntos, n) {
    // Inicializar matriz de diferencias
    const diferencias = new Array(n);
    for (let i = 0; i < n; i++) {
        diferencias[i] = new Array(n);
        diferencias[i][0] = puntos[i].y; // f[xi]
    }
    
    // Calcular diferencias divididas
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diferencias[i][j] = (diferencias[i+1][j-1] - diferencias[i][j-1]) / 
                               (puntos[i+j].x - puntos[i].x);
        }
    }
    
    return diferencias;
}

function construirPolinomioNewtonString(puntos, diferencias) {
    const n = diferencias.length;
    let polinomio = `P(x) = ${formatNumber(diferencias[0][0], 4)}`;
    
    for (let i = 1; i < n; i++) {
        let termino = ` + ${formatNumber(diferencias[0][i], 4)}`;
        
        for (let j = 0; j < i; j++) {
            const xj = puntos[j].x;
            if (xj === 0) {
                termino += `·(x)`;
            } else if (xj > 0) {
                termino += `·(x - ${formatNumber(xj, 2)})`;
            } else {
                termino += `·(x + ${formatNumber(-xj, 2)})`;
            }
        }
        
        polinomio += termino;
    }
    
    return polinomio;
}

function calcularInterpolacionNewtonProgresivo(puntos, xEval, orden) {
    // Asumimos puntos equiespaciados para diferencias progresivas
    const h = puntos[1].x - puntos[0].x; // espaciado
    const diferencias = calcularDiferenciasProgresivas(puntos, orden + 1);
    
    // u = (x - x0)/h
    const u = (xEval - puntos[0].x) / h;
    let valorInterpolado = diferencias[0][0];
    let producto = 1;
    let uFactorial = u;
    
    for (let i = 1; i <= orden; i++) {
        producto *= uFactorial / i;
        valorInterpolado += diferencias[0][i] * producto;
        uFactorial *= (u - i);
    }
    
    const polinomioString = construirPolinomioNewtonProgresivoString(puntos, diferencias, h);
    
    return {
        valorInterpolado: valorInterpolado,
        diferencias: diferencias,
        polinomioString: polinomioString,
        puntos: puntos,
        xEval: xEval,
        tipo: 'Diferencias Progresivas',
        n: orden + 1
    };
}

function calcularDiferenciasProgresivas(puntos, n) {
    const diferencias = new Array(n);
    for (let i = 0; i < n; i++) {
        diferencias[i] = new Array(n);
        diferencias[i][0] = puntos[i].y;
    }
    
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diferencias[i][j] = diferencias[i+1][j-1] - diferencias[i][j-1];
        }
    }
    
    return diferencias;
}

function construirPolinomioNewtonProgresivoString(puntos, diferencias, h) {
    const n = diferencias.length;
    const x0 = puntos[0].x;
    let polinomio = `P(x) = ${formatNumber(diferencias[0][0], 4)}`;
    
    for (let i = 1; i < n; i++) {
        const termino = formatNumber(diferencias[0][i] / factorial(i), 6);
        polinomio += ` + ${termino}`;
        
        for (let j = 0; j < i; j++) {
            polinomio += `·(x - ${formatNumber(x0 + j*h, 2)})`;
        }
    }
    
    return polinomio;
}

function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calcularInterpolacionNewtonRegresivo(puntos, xEval, orden) {
    // Similar a progresivo pero empezando desde el último punto
    const n = puntos.length;
    const h = puntos[1].x - puntos[0].x;
    const diferencias = calcularDiferenciasRegresivas(puntos, orden + 1);
    
    const xn = puntos[n-1].x;
    const u = (xEval - xn) / h;
    let valorInterpolado = diferencias[n-1][0];
    let producto = 1;
    let uFactorial = u;
    
    for (let i = 1; i <= orden; i++) {
        producto *= uFactorial / i;
        valorInterpolado += diferencias[n-1-i][i] * producto;
        uFactorial *= (u + i);
    }
    
    const polinomioString = construirPolinomioNewtonRegresivoString(puntos, diferencias, h);
    
    return {
        valorInterpolado: valorInterpolado,
        diferencias: diferencias,
        polinomioString: polinomioString,
        puntos: puntos,
        xEval: xEval,
        tipo: 'Diferencias Regresivas',
        n: orden + 1
    };
}

function calcularDiferenciasRegresivas(puntos, n) {
    return calcularDiferenciasProgresivas(puntos, n); // Misma matriz
}

function construirPolinomioNewtonRegresivoString(puntos, diferencias, h) {
    const n = diferencias.length;
    const xn = puntos[n-1].x;
    let polinomio = `P(x) = ${formatNumber(diferencias[n-1][0], 4)}`;
    
    for (let i = 1; i < n; i++) {
        const termino = formatNumber(diferencias[n-1-i][i] / factorial(i), 6);
        polinomio += ` + ${termino}`;
        
        for (let j = 0; j < i; j++) {
            polinomio += `·(x - ${formatNumber(xn - j*h, 2)})`;
        }
    }
    
    return polinomio;
}

function mostrarResultadosNewton(resultados, puntos, xEval, tipo, funcOriginalStr) {
    console.log('NewtonInterpolacion.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.newtonResultados = resultados;
    
    // Mostrar valor interpolado
    document.getElementById('newton-resultado').textContent = formatNumber(resultados.valorInterpolado, 8);
    
    // Mostrar tiempo de cálculo
    document.getElementById('newton-tiempo').textContent = formatNumber(resultados.tiempo, 2) + ' ms';
    
    // Mostrar polinomio de Newton
    document.getElementById('newton-polynomial').innerHTML = `
        <div style="color: #2c3e50; margin-bottom: 0.5rem;">
            <strong>Polinomio de Newton (${resultados.tipo}):</strong>
        </div>
        <div style="color: #9b59b6; font-size: 0.85rem; line-height: 1.4;">
            ${resultados.polinomioString.replace(/\·/g, '·')}
        </div>
    `;
    
    // Mostrar error si hay función original
    if (resultados.funcOriginal) {
        document.getElementById('newton-error').innerHTML = `
            <span style="color: #27ae60;">${formatNumber(resultados.errorAbsoluto, 8)}</span><br>
            <small style="color: #666;">Valor exacto: ${formatNumber(resultados.funcOriginal.evaluada, 8)}</small>
        `;
        
        // Mostrar sección de comparación
        document.getElementById('newton-comparacion-section').style.display = 'block';
        mostrarComparacionNewton(resultados);
    } else {
        document.getElementById('newton-error').textContent = 'No disponible';
        document.getElementById('newton-comparacion-section').style.display = 'none';
    }
    
    // Actualizar tabla de diferencias
    actualizarTablaDiferenciasNewton(resultados.diferencias, puntos, tipo);
    
    // Crear gráfico
    crearGraficoNewton(puntos, resultados, xEval, funcOriginalStr);
}

function actualizarTablaDiferenciasNewton(diferencias, puntos, tipo) {
    const tbody = document.getElementById('newton-table-body');
    tbody.innerHTML = '';
    
    const n = diferencias.length;
    
    for (let i = 0; i < n; i++) {
        const row = document.createElement('tr');
        
        // Columna x
        const xCell = document.createElement('td');
        xCell.style.fontWeight = 'bold';
        xCell.style.color = '#9b59b6';
        xCell.textContent = formatNumber(puntos[i].x, 4);
        
        // Columna f[x]
        const fCell = document.createElement('td');
        fCell.textContent = formatNumber(diferencias[i][0], 6);
        
        // Crear celdas para diferencias
        const cells = [xCell, fCell];
        
        for (let j = 1; j < Math.min(5, n - i); j++) {
            const diffCell = document.createElement('td');
            const valor = diferencias[i][j];
            
            // Resaltar diferencias significativas
            if (Math.abs(valor) > 10) {
                diffCell.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            } else if (Math.abs(valor) > 1) {
                diffCell.style.backgroundColor = 'rgba(241, 196, 15, 0.1)';
            }
            
            diffCell.textContent = formatNumber(valor, 6);
            cells.push(diffCell);
        }
        
        // Rellenar celdas vacías si es necesario
        while (cells.length < 6) {
            const emptyCell = document.createElement('td');
            emptyCell.textContent = '-';
            cells.push(emptyCell);
        }
        
        // Agregar todas las celdas a la fila
        cells.forEach(cell => row.appendChild(cell));
        tbody.appendChild(row);
    }
}

function crearGraficoNewton(puntos, resultados, xEval, funcOriginalStr) {
    const datasets = [];
    const xValues = puntos.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    
    // 1. Polinomio interpolante de Newton
    const numPuntosGrafico = 200;
    const puntosPolinomio = [];
    
    for (let i = 0; i <= numPuntosGrafico; i++) {
        const x = minX + (maxX - minX) * (i / numPuntosGrafico);
        
        // Calcular P(x) según el tipo
        let Px;
        if (resultados.tipo.includes('Progresivas')) {
            const h = puntos[1].x - puntos[0].x;
            const u = (x - puntos[0].x) / h;
            Px = resultados.diferencias[0][0];
            let producto = 1;
            let uFactorial = u;
            
            for (let j = 1; j < resultados.n; j++) {
                producto *= uFactorial / j;
                Px += resultados.diferencias[0][j] * producto;
                uFactorial *= (u - j);
            }
        } else if (resultados.tipo.includes('Regresivas')) {
            const h = puntos[1].x - puntos[0].x;
            const n = puntos.length;
            const u = (x - puntos[n-1].x) / h;
            Px = resultados.diferencias[n-1][0];
            let producto = 1;
            let uFactorial = u;
            
            for (let j = 1; j < resultados.n; j++) {
                producto *= uFactorial / j;
                Px += resultados.diferencias[n-1-j][j] * producto;
                uFactorial *= (u + j);
            }
        } else {
            // Diferencias divididas
            Px = resultados.diferencias[0][0];
            let producto = 1;
            
            for (let j = 1; j < resultados.n; j++) {
                producto *= (x - puntos[j-1].x);
                Px += resultados.diferencias[0][j] * producto;
            }
        }
        
        puntosPolinomio.push({ x: x, y: Px });
    }
    
    datasets.push({
        label: `Polinomio de Newton (${resultados.tipo})`,
        data: puntosPolinomio,
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2
    });
    
    // 2. Puntos originales
    datasets.push({
        label: 'Puntos conocidos',
        data: puntos,
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.8)',
        fill: false,
        showLine: false,
        pointRadius: 6,
        pointStyle: 'circle'
    });
    
    // 3. Punto evaluado
    datasets.push({
        label: `P(${formatNumber(xEval, 2)})`,
        data: [{ x: xEval, y: resultados.valorInterpolado }],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.8)',
        fill: false,
        showLine: false,
        pointRadius: 10,
        pointStyle: 'star'
    });
    
    // 4. Función original si existe
    if (funcOriginalStr) {
        const puntosFuncion = [];
        for (let i = 0; i <= numPuntosGrafico; i++) {
            const x = minX + (maxX - minX) * (i / numPuntosGrafico);
            try {
                const y = evaluateExpression(funcOriginalStr, x);
                puntosFuncion.push({ x: x, y: y });
            } catch (error) {
                console.warn('Error evaluando función original:', error);
            }
        }
        
        datasets.push({
            label: 'Función original',
            data: puntosFuncion,
            borderColor: '#3498db',
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
    
    createChart('newton-chart', data, options);
}

function mostrarComparacionNewton(resultados) {
    const tbody = document.getElementById('newton-comparacion-body');
    tbody.innerHTML = '';
    
    const row = document.createElement('tr');
    const errorRelativo = (resultados.errorAbsoluto / Math.abs(resultados.funcOriginal.evaluada)) * 100;
    
    row.innerHTML = `
        <td style="font-weight: bold; color: #9b59b6;">
            <i class="fas fa-sitemap"></i> Newton vs Original
        </td>
        <td style="font-family: monospace;">${formatNumber(resultados.funcOriginal.evaluada, 8)}</td>
        <td style="font-family: monospace;">${formatNumber(resultados.valorInterpolado, 8)}</td>
        <td style="color: ${resultados.errorAbsoluto > 0.1 ? '#e74c3c' : '#27ae60'};">
            ${formatNumber(resultados.errorAbsoluto, 8)}
        </td>
        <td>${formatNumber(errorRelativo, 4)}%</td>
    `;
    tbody.appendChild(row);
}

function mostrarMasEjemplosNewton() {
    const ejemplosExtras = [
        {
            nombre: "Función Logarítmica",
            descripcion: "Aproximación de ln(x+1) con puntos no equiespaciados",
            puntos: [
                { x: 0, y: 0 },
                { x: 0.2, y: 0.1823 },
                { x: 0.5, y: 0.4055 },
                { x: 1.0, y: 0.6931 },
                { x: 2.0, y: 1.0986 }
            ],
            xEval: "0.7",
            funcionOriginal: "log(x+1)",
            orden: "4",
            tipo: "diferencias-divididas",
            nota: "Las diferencias divididas manejan bien puntos no equiespaciados"
        },
        {
            nombre: "Diferencias Progresivas",
            descripcion: "Función cuadrática con puntos equiespaciados",
            puntos: [
                { x: 0, y: 0 },
                { x: 0.5, y: 0.25 },
                { x: 1.0, y: 1.00 },
                { x: 1.5, y: 2.25 },
                { x: 2.0, y: 4.00 }
            ],
            xEval: "0.8",
            funcionOriginal: "x^2",
            orden: "4",
            tipo: "diferencias-progresivas",
            nota: "Las diferencias progresivas son eficientes para datos equiespaciados"
        },
        {
            nombre: "Diferencias Regresivas",
            descripcion: "Interpolación cerca del final del intervalo",
            puntos: [
                { x: 0, y: 1 },
                { x: 0.3, y: 1.3499 },
                { x: 0.6, y: 1.8221 },
                { x: 0.9, y: 2.4596 },
                { x: 1.2, y: 3.3201 }
            ],
            xEval: "1.1",
            funcionOriginal: "exp(x)",
            orden: "4",
            tipo: "diferencias-regresivas",
            nota: "Diferencias regresivas son útiles para interpolar cerca del final"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="newton-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Más Ejemplos de Interpolación de Newton</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #9b59b6; margin-bottom: 0.5rem;">
                                    <i class="fas fa-sitemap"></i> ${ejemplo.nombre}
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
                                <button class="cargar-newton-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #9b59b6; color: white; border: none; padding: 0.5rem 1rem; 
                                               border-radius: 4px; cursor: pointer; width: 100%;">
                                    <i class="fas fa-play-circle"></i> Cargar y Calcular
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
    const modalExistente = document.getElementById('newton-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('newton-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-newton-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoNewton(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarNewton() {
    console.log('NewtonInterpolacion.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('newton-numpuntos').value = '4';
    document.getElementById('newton-x-eval').value = '1.5';
    document.getElementById('newton-orden').value = '3';
    document.getElementById('newton-tipo').value = 'diferencias-divididas';
    document.getElementById('newton-func-original').value = '';
    
    // Regenerar campos de puntos
    generarCamposPuntosNewton();
    
    // Limpiar resultados
    document.getElementById('newton-resultado').textContent = '-';
    document.getElementById('newton-tiempo').textContent = '-';
    document.getElementById('newton-error').textContent = '-';
    document.getElementById('newton-polynomial').innerHTML = '';
    document.getElementById('newton-table-body').innerHTML = '';
    document.getElementById('newton-comparacion-body').innerHTML = '';
    
    // Ocultar sección de comparación
    document.getElementById('newton-comparacion-section').style.display = 'none';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('newton-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['newton-chart', 'newton-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('newton-chart').getContext('2d');
    const emptyChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Ingresa puntos y haz clic en Calcular',
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
    
    if (!window.charts) window.charts = {};
    window.charts['newton-chart'] = emptyChart;
    
    console.log('NewtonInterpolacion.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaNewton() {
    console.log("=== PRUEBA DE INTERPOLACIÓN DE NEWTON ===");
    
    try {
        const puntos = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 4 },
            { x: 3, y: 9 }
        ];
        
        const xEval = 1.5;
        const resultado = calcularInterpolacionNewtonDivididas(puntos, xEval, 3);
        
        console.log("Puntos:", puntos.map(p => `(${p.x}, ${p.y})`).join(", "));
        console.log("Evaluar en x =", xEval);
        console.log("Valor interpolado:", resultado.valorInterpolado);
        console.log("Valor exacto (x²):", xEval * xEval);
        console.log("Error absoluto:", Math.abs(resultado.valorInterpolado - xEval * xEval));
        console.log("\nDiferencias divididas:");
        resultado.diferencias.forEach((row, i) => {
            console.log(`  f[x${i}]:`, row.map(v => formatNumber(v, 4)).join("  "));
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaNewton);