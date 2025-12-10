/**
 * lagrange.js - Interpolación de Lagrange
 * Implementa polinomios interpolantes usando el método de Lagrange
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Lagrange.js: Cargado');
    
    // Escuchar cuando la sección de interpolación se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'interpolacion') {
            console.log('Lagrange.js: Sección Interpolación activada');
            setTimeout(inicializarLagrange, 300);
        }
    });
    
    // Escuchar cuando se seleccione Lagrange
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'lagrange') {
            console.log('Lagrange.js: Método Lagrange seleccionado');
            setTimeout(inicializarLagrange, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarLagrangeVisibilidad, 1000);
});

function verificarLagrangeVisibilidad() {
    const lagrangeContent = document.getElementById('lagrange-content');
    if (lagrangeContent && !lagrangeContent.classList.contains('hidden')) {
        console.log('Lagrange.js: Ya visible al cargar');
        inicializarLagrange();
    }
}

function inicializarLagrange() {
    console.log('Lagrange.js: Inicializando...');
    
    const lagrangeContent = document.getElementById('lagrange-content');
    if (!lagrangeContent) {
        console.error('Lagrange.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.lagrangeInitialized) {
        console.log('Lagrange.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (lagrangeContent.innerHTML.trim() === '' || !document.getElementById('lagrange-x-input')) {
        console.log('Lagrange.js: Creando interfaz...');
        crearInterfazLagrange();
    }
    
    // Asignar eventos
    asignarEventosLagrange();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialLagrange();
    
    // Marcar como inicializado
    window.lagrangeInitialized = true;
    console.log('Lagrange.js: Inicialización completada');
}

function crearInterfazLagrange() {
    const content = document.getElementById('lagrange-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-project-diagram"></i> Interpolación de Lagrange</h3>
            <p>Construye polinomios interpolantes que pasan exactamente por puntos dados</p>
            
            <!-- Selector de ejemplos (como runge-kutta) -->
            <div class="ejemplo-selector-container" id="lagrange-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="lagrange-numpuntos"><i class="fas fa-sort-numeric-up"></i> Número de puntos</label>
                <input type="number" id="lagrange-numpuntos" value="4" min="2" max="10" step="1">
                <small>Cantidad de puntos conocidos para la interpolación</small>
            </div>
            
            <!-- Contenedor dinámico para puntos -->
            <div id="lagrange-puntos-container">
                <!-- Se generará dinámicamente -->
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="lagrange-x-eval"><i class="fas fa-search"></i> Valor x a interpolar</label>
                    <input type="number" id="lagrange-x-eval" value="1.5" step="0.1">
                    <small>Punto donde se evaluará el polinomio interpolante</small>
                </div>
                <div class="input-group">
                    <label for="lagrange-grado"><i class="fas fa-sort-amount-up"></i> Grado máximo</label>
                    <input type="number" id="lagrange-grado" value="3" min="1" max="10" step="1">
                    <small>Grado del polinomio interpolante</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="lagrange-func-original"><i class="fas fa-function"></i> Función original (opcional)</label>
                <input type="text" id="lagrange-func-original" placeholder="ej: x^2">
                <small>Si se proporciona, se comparará con el polinomio interpolante</small>
            </div>
            
            <div class="button-group">
                <button id="lagrange-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular Interpolación</button>
                <button id="lagrange-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="lagrange-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="lagrange-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados de Interpolación</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor interpolado:</h4>
                    <p id="lagrange-resultado" style="font-size: 1.5rem; font-weight: bold; color: #e74c3c;">-</p>
                    
                    <h4><i class="fas fa-file-code"></i> Polinomio de Lagrange:</h4>
                    <div id="lagrange-polynomial" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                        <!-- Polinomio se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-ruler"></i> Error máximo:</h4>
                            <p id="lagrange-error">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="lagrange-tiempo">-</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="lagrange-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Puntos y Polinomios Base</h4>
                <div class="table-container">
                    <table id="lagrange-table">
                        <thead>
                            <tr>
                                <th>Punto</th>
                                <th>xᵢ</th>
                                <th>yᵢ</th>
                                <th>Polinomio Base Lᵢ(x)</th>
                                <th>Valor en x</th>
                                <th>Contribución</th>
                            </tr>
                        </thead>
                        <tbody id="lagrange-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con función original si existe -->
            <div class="comparison-section" id="lagrange-comparacion-section" style="display: none; margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Función Original</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="lagrange-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="lagrange-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>f(x)</th>
                                    <th>P(x) interpolado</th>
                                    <th>Error</th>
                                    <th>Error Relativo %</th>
                                </tr>
                            </thead>
                            <tbody id="lagrange-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('Lagrange.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemplosLagrange();
    
    // Generar campos de puntos iniciales
    generarCamposPuntos();
    
    // Agregar evento para actualizar campos cuando cambia el número de puntos
    document.getElementById('lagrange-numpuntos').addEventListener('change', generarCamposPuntos);
}

function inicializarSelectorEjemplosLagrange() {
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
            grado: "3",
            nota: "Polinomio de Lagrange reproduce exactamente polinomios de grado ≤ n"
        },
        {
            nombre: "Función Seno",
            descripcion: "Aproximación de sin(x) en [0, π]",
            puntos: [
                { x: 0, y: 0 },
                { x: 0.5, y: 0.4794 },
                { x: 1.0, y: 0.8415 },
                { x: 1.5, y: 0.9975 },
                { x: 2.0, y: 0.9093 }
            ],
            xEval: "1.2",
            funcionOriginal: "sin(x)",
            grado: "4",
            nota: "Interpolación de función trigonométrica. Buen ejemplo para Runge"
        },
        {
            nombre: "Función Exponencial",
            descripcion: "Aproximación de e^x en [0, 2]",
            puntos: [
                { x: 0, y: 1 },
                { x: 0.5, y: 1.6487 },
                { x: 1.0, y: 2.7183 },
                { x: 1.5, y: 4.4817 },
                { x: 2.0, y: 7.3891 }
            ],
            xEval: "1.2",
            funcionOriginal: "exp(x)",
            grado: "4",
            nota: "La interpolación puede tener problemas con funciones de rápido crecimiento"
        },
        {
            nombre: "Fenómeno de Runge",
            descripcion: "Demostración del fenómeno de Runge con f(x) = 1/(1+25x²)",
            puntos: [
                { x: -1.0, y: 0.0385 },
                { x: -0.5, y: 0.1379 },
                { x: 0.0, y: 1.0000 },
                { x: 0.5, y: 0.1379 },
                { x: 1.0, y: 0.0385 }
            ],
            xEval: "0.3",
            funcionOriginal: "1/(1+25*x^2)",
            grado: "4",
            nota: "Ejemplo clásico de oscilaciones en los extremos con puntos equiespaciados"
        },
        {
            nombre: "Datos Experimentales",
            descripcion: "Aproximación de datos de experimento físico",
            puntos: [
                { x: 0, y: 1.2 },
                { x: 0.2, y: 1.8 },
                { x: 0.4, y: 2.3 },
                { x: 0.6, y: 2.7 },
                { x: 0.8, y: 3.0 },
                { x: 1.0, y: 3.2 }
            ],
            xEval: "0.65",
            funcionOriginal: "",
            grado: "5",
            nota: "Interpolación de datos experimentales con ruido"
        },
        {
            nombre: "Polinomio Cúbico",
            descripcion: "Aproximación de polinomio de grado 3",
            puntos: [
                { x: -2, y: -8 },
                { x: -1, y: -1 },
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 8 }
            ],
            xEval: "0.7",
            funcionOriginal: "x^3",
            grado: "4",
            nota: "Lagrange reproduce exactamente polinomios hasta grado n-1"
        }
    ];
    
    const selector = document.getElementById('lagrange-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #3498db;">
            <h4 style="margin-bottom: 1rem; color: #3498db;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Interpolación de Lagrange
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #3498db; margin-bottom: 0.5rem;">
                            <i class="fas fa-chart-line"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-lagrange-ejemplo-btn" data-index="${index}" 
                                style="background: #3498db; color: white; border: none; padding: 0.5rem 1rem; 
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
        document.querySelectorAll('.cargar-lagrange-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoLagrange(ejemplos[index]);
            });
        });
    }, 100);
}

function generarCamposPuntos() {
    const numPuntos = parseInt(document.getElementById('lagrange-numpuntos').value);
    const container = document.getElementById('lagrange-puntos-container');
    
    if (!container) return;
    
    let html = '<div class="input-group"><label><i class="fas fa-dot-circle"></i> Puntos (xᵢ, yᵢ):</label>';
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 0.5rem;">';
    
    for (let i = 0; i < numPuntos; i++) {
        html += `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border: 1px solid #dee2e6;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: #3498db;">Punto ${i+1}</strong>
                    <span style="background: #3498db20; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">
                        L${i}(x)
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                        <label style="font-size: 0.8rem; color: #666;">x${i}</label>
                        <input type="number" class="lagrange-punto-x" data-index="${i}" 
                               value="${i}" step="0.1" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; color: #666;">y${i}</label>
                        <input type="number" class="lagrange-punto-y" data-index="${i}" 
                               value="${i*i}" step="0.1" style="width: 100%;">
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

function asignarEventosLagrange() {
    console.log('Lagrange.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('lagrange-calc');
    const ejemploBtn = document.getElementById('lagrange-ejemplo');
    const clearBtn = document.getElementById('lagrange-clear');
    
    if (!calcBtn) {
        console.error('Lagrange.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularLagrange);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemplosLagrange);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarLagrange);
    }
    
    console.log('Lagrange.js: Eventos asignados correctamente');
}

function cargarEjemploInicialLagrange() {
    const puntosInputs = document.querySelectorAll('.lagrange-punto-x');
    if (puntosInputs.length === 0 || puntosInputs[0].value === '') {
        console.log('Lagrange.js: Cargando ejemplo inicial...');
        
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
            grado: "3",
            nota: "Polinomio de Lagrange reproduce exactamente polinomios de grado ≤ n"
        };
        
        cargarEjemploEspecificoLagrange(ejemplo);
    }
}

function cargarEjemploEspecificoLagrange(ejemplo) {
    console.log(`Lagrange.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar número de puntos
    document.getElementById('lagrange-numpuntos').value = ejemplo.puntos.length;
    generarCamposPuntos();
    
    // Dar tiempo para que se generen los campos
    setTimeout(() => {
        // Rellenar puntos
        ejemplo.puntos.forEach((punto, index) => {
            const xInput = document.querySelector(`.lagrange-punto-x[data-index="${index}"]`);
            const yInput = document.querySelector(`.lagrange-punto-y[data-index="${index}"]`);
            if (xInput) xInput.value = punto.x;
            if (yInput) yInput.value = punto.y;
        });
        
        // Configurar otros valores
        document.getElementById('lagrange-x-eval').value = ejemplo.xEval;
        document.getElementById('lagrange-grado').value = ejemplo.grado;
        document.getElementById('lagrange-func-original').value = ejemplo.funcionOriginal || '';
        
        // Mostrar descripción del ejemplo
        let descripcion = document.getElementById('lagrange-descripcion-ejemplo');
        if (!descripcion) {
            descripcion = document.createElement('div');
            descripcion.id = 'lagrange-descripcion-ejemplo';
            const inputSection = document.querySelector('#lagrange-content .input-group:first-child');
            if (inputSection) {
                inputSection.parentNode.insertBefore(descripcion, inputSection.nextSibling);
            }
        }
        
        descripcion.innerHTML = `
            <div style="padding: 1rem; background: #e8f4fc; border-radius: 6px; border-left: 4px solid #3498db;">
                <strong style="color: #2980b9;">
                    <i class="fas fa-info-circle"></i> Ejemplo práctico:
                </strong> ${ejemplo.descripcion}
                ${ejemplo.nota ? `<br><small><i class="fas fa-lightbulb"></i> ${ejemplo.nota}</small>` : ''}
                <br><small><i class="fas fa-project-diagram"></i> <strong>Ventaja Lagrange:</strong> Interpolación exacta en puntos dados sin resolver sistemas.</small>
            </div>
        `;
        
        // Calcular automáticamente después de un breve delay
        setTimeout(() => {
            calcularLagrange();
        }, 400);
        
    }, 200);
}

function calcularLagrange() {
    console.log('Lagrange.js: Calculando interpolación...');
    
    // OBTENER ELEMENTOS
    const numPuntosEl = document.getElementById('lagrange-numpuntos');
    const xEvalEl = document.getElementById('lagrange-x-eval');
    const gradoEl = document.getElementById('lagrange-grado');
    const funcOriginalEl = document.getElementById('lagrange-func-original');
    
    if (!numPuntosEl || !xEvalEl || !gradoEl) {
        showError('Error: Elementos de Lagrange no encontrados. Recarga la página.');
        return;
    }
    
    const numPuntos = parseInt(numPuntosEl.value);
    const xEval = parseFloat(xEvalEl.value);
    const grado = parseInt(gradoEl.value);
    const funcOriginalStr = funcOriginalEl ? funcOriginalEl.value.trim() : '';
    
    // Obtener puntos
    const puntos = [];
    for (let i = 0; i < numPuntos; i++) {
        const xInput = document.querySelector(`.lagrange-punto-x[data-index="${i}"]`);
        const yInput = document.querySelector(`.lagrange-punto-y[data-index="${i}"]`);
        
        if (!xInput || !yInput) {
            showError(`Punto ${i+1} no encontrado. Actualiza la página.`);
            return;
        }
        
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        
        if (isNaN(x) || isNaN(y)) {
            showError(`Punto ${i+1} no es válido`, `lagrange-punto-x[data-index="${i}"]`);
            return;
        }
        
        puntos.push({ x: x, y: y });
    }
    
    // Validaciones
    if (puntos.length < 2) {
        showError('Se necesitan al menos 2 puntos para interpolación', 'lagrange-numpuntos');
        return;
    }
    
    if (isNaN(xEval)) {
        showError('El valor x a evaluar debe ser un número válido', 'lagrange-x-eval');
        return;
    }
    
    if (grado < 1 || grado >= puntos.length) {
        showError(`El grado debe estar entre 1 y ${puntos.length-1}`, 'lagrange-grado');
        return;
    }
    
    // Verificar que los x sean distintos
    const xValues = puntos.map(p => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== puntos.length) {
        showError('Los valores de x deben ser distintos');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('lagrange-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular interpolación
            const resultado = calcularInterpolacionLagrange(puntos, xEval);
            
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
            
            mostrarResultadosLagrange(resultado, puntos, xEval, funcOriginalStr);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('Lagrange.js error:', error);
        } finally {
            showLoading(document.getElementById('lagrange-calc'), false);
        }
    }, 100);
}

function calcularInterpolacionLagrange(puntos, xEval) {
    console.log(`Lagrange.js: Calculando interpolación en x = ${xEval}`);
    
    const n = puntos.length;
    let valorInterpolado = 0;
    const polinomiosBase = [];
    const contribuciones = [];
    
    // Calcular cada término de Lagrange
    for (let i = 0; i < n; i++) {
        let Li = 1;
        const xi = puntos[i].x;
        const yi = puntos[i].y;
        
        // Construir Lᵢ(x) = ∏(x - xⱼ)/(xᵢ - xⱼ), j≠i
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const xj = puntos[j].x;
                Li *= (xEval - xj) / (xi - xj);
            }
        }
        
        const contribucion = yi * Li;
        valorInterpolado += contribucion;
        
        // Guardar información del polinomio base
        polinomiosBase.push({
            indice: i,
            xi: xi,
            yi: yi,
            Li: Li,
            contribucion: contribucion,
            LiString: construirPolinomioBaseString(puntos, i)
        });
        
        contribuciones.push(contribucion);
    }
    
    // Construir polinomio completo como string
    const polinomioString = construirPolinomioCompletoString(puntos);
    
    return {
        valorInterpolado: valorInterpolado,
        polinomiosBase: polinomiosBase,
        polinomioString: polinomioString,
        puntos: puntos,
        xEval: xEval
    };
}

function construirPolinomioBaseString(puntos, i) {
    const xi = puntos[i].x;
    const n = puntos.length;
    let numerador = "";
    let denominador = 1;
    
    // Construir numerador
    const factores = [];
    for (let j = 0; j < n; j++) {
        if (j !== i) {
            const xj = puntos[j].x;
            if (xj === 0) {
                factores.push("x");
            } else if (xj > 0) {
                factores.push(`(x - ${formatNumber(xj, 2)})`);
            } else {
                factores.push(`(x + ${formatNumber(-xj, 2)})`);
            }
        }
    }
    numerador = factores.join(" * ");
    
    // Calcular denominador
    for (let j = 0; j < n; j++) {
        if (j !== i) {
            denominador *= (puntos[i].x - puntos[j].x);
        }
    }
    
    if (denominador === 1) {
        return `L${i}(x) = ${numerador}`;
    } else {
        return `L${i}(x) = (${numerador}) / ${formatNumber(denominador, 4)}`;
    }
}

function construirPolinomioCompletoString(puntos) {
    const n = puntos.length;
    let polinomio = "P(x) = ";
    const terminos = [];
    
    for (let i = 0; i < n; i++) {
        const yi = puntos[i].y;
        let termino = "";
        
        if (Math.abs(yi) < 1e-10) continue;
        
        // Construir polinomio base como producto
        const factores = [];
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const xj = puntos[j].x;
                if (xj === 0) {
                    factores.push("x");
                } else if (xj > 0) {
                    factores.push(`(x - ${formatNumber(xj, 2)})`);
                } else {
                    factores.push(`(x + ${formatNumber(-xj, 2)})`);
                }
            }
        }
        
        if (factores.length > 0) {
            const factorString = factores.join(" * ");
            
            // Calcular denominador
            let denominador = 1;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    denominador *= (puntos[i].x - puntos[j].x);
                }
            }
            
            if (Math.abs(denominador - 1) > 1e-10) {
                termino = `${formatNumber(yi / denominador, 4)} * ${factorString}`;
            } else {
                termino = `${formatNumber(yi, 4)} * ${factorString}`;
            }
        } else {
            termino = formatNumber(yi, 4);
        }
        
        terminos.push(termino);
    }
    
    polinomio += terminos.join(" + ");
    return polinomio;
}

function mostrarResultadosLagrange(resultados, puntos, xEval, funcOriginalStr) {
    console.log('Lagrange.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.lagrangeResultados = resultados;
    
    // Mostrar valor interpolado
    document.getElementById('lagrange-resultado').textContent = formatNumber(resultados.valorInterpolado, 8);
    
    // Mostrar tiempo de cálculo
    document.getElementById('lagrange-tiempo').textContent = formatNumber(resultados.tiempo, 2) + ' ms';
    
    // Mostrar polinomio de Lagrange
    document.getElementById('lagrange-polynomial').innerHTML = `
        <div style="color: #2c3e50; margin-bottom: 0.5rem;">
            <strong>Polinomio Interpolante:</strong>
        </div>
        <div style="color: #e74c3c; font-size: 0.85rem; line-height: 1.4;">
            ${resultados.polinomioString.replace(/\*/g, '·')}
        </div>
    `;
    
    // Mostrar error si hay función original
    if (resultados.funcOriginal) {
        document.getElementById('lagrange-error').innerHTML = `
            <span style="color: #27ae60;">${formatNumber(resultados.errorAbsoluto, 8)}</span><br>
            <small style="color: #666;">Valor exacto: ${formatNumber(resultados.funcOriginal.evaluada, 8)}</small>
        `;
        
        // Mostrar sección de comparación
        document.getElementById('lagrange-comparacion-section').style.display = 'block';
        mostrarComparacionLagrange(resultados);
    } else {
        document.getElementById('lagrange-error').textContent = 'No disponible';
        document.getElementById('lagrange-comparacion-section').style.display = 'none';
    }
    
    // Actualizar tabla de polinomios base
    actualizarTablaLagrange(resultados.polinomiosBase, xEval);
    
    // Crear gráfico
    crearGraficoLagrange(puntos, resultados, xEval, funcOriginalStr);
}

function actualizarTablaLagrange(polinomiosBase, xEval) {
    const tbody = document.getElementById('lagrange-table-body');
    tbody.innerHTML = '';
    
    polinomiosBase.forEach(pb => {
        const row = document.createElement('tr');
        
        // Resaltar contribuciones significativas
        let bgColor = '';
        if (Math.abs(pb.contribucion) > 0.1) {
            bgColor = 'background-color: rgba(52, 152, 219, 0.1);';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #3498db;">${pb.indice + 1}</td>
            <td>${formatNumber(pb.xi, 4)}</td>
            <td>${formatNumber(pb.yi, 4)}</td>
            <td style="font-size: 0.8rem; font-family: monospace;">
                ${pb.LiString}
            </td>
            <td>${formatNumber(pb.Li, 6)}</td>
            <td style="font-weight: bold; ${bgColor}">${formatNumber(pb.contribucion, 6)}</td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoLagrange(puntos, resultados, xEval, funcOriginalStr) {
    const datasets = [];
    const xValues = puntos.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    
    // 1. Polinomio interpolante
    const numPuntosGrafico = 200;
    const puntosPolinomio = [];
    
    for (let i = 0; i <= numPuntosGrafico; i++) {
        const x = minX + (maxX - minX) * (i / numPuntosGrafico);
        
        // Calcular P(x) manualmente
        let Px = 0;
        for (let j = 0; j < puntos.length; j++) {
            let Lj = 1;
            for (let k = 0; k < puntos.length; k++) {
                if (k !== j) {
                    Lj *= (x - puntos[k].x) / (puntos[j].x - puntos[k].x);
                }
            }
            Px += puntos[j].y * Lj;
        }
        
        puntosPolinomio.push({ x: x, y: Px });
    }
    
    datasets.push({
        label: 'Polinomio de Lagrange',
        data: puntosPolinomio,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
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
            borderColor: '#9b59b6',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [5, 5]
        });
    }
    
    // 5. Polinomios base (opcional, primeros 3)
    const coloresBase = ['#f39c12', '#1abc9c', '#8e44ad'];
    for (let i = 0; i < Math.min(3, puntos.length); i++) {
        const puntosBase = [];
        for (let j = 0; j <= numPuntosGrafico; j++) {
            const x = minX + (maxX - minX) * (j / numPuntosGrafico);
            
            let Li = 1;
            for (let k = 0; k < puntos.length; k++) {
                if (k !== i) {
                    Li *= (x - puntos[k].x) / (puntos[i].x - puntos[k].x);
                }
            }
            
            puntosBase.push({ x: x, y: Li });
        }
        
        datasets.push({
            label: `L${i}(x)`,
            data: puntosBase,
            borderColor: coloresBase[i % coloresBase.length],
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [2, 2]
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
    
    createChart('lagrange-chart', data, options);
}

function mostrarComparacionLagrange(resultados) {
    const tbody = document.getElementById('lagrange-comparacion-body');
    tbody.innerHTML = '';
    
    const row = document.createElement('tr');
    const errorRelativo = (resultados.errorAbsoluto / Math.abs(resultados.funcOriginal.evaluada)) * 100;
    
    row.innerHTML = `
        <td style="font-weight: bold; color: #3498db;">
            <i class="fas fa-project-diagram"></i> Lagrange vs Original
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

function mostrarMasEjemplosLagrange() {
    const ejemplosExtras = [
        {
            nombre: "Función Logarítmica",
            descripcion: "Aproximación de ln(x+1) en [0, 2]",
            puntos: [
                { x: 0, y: 0 },
                { x: 0.5, y: 0.4055 },
                { x: 1.0, y: 0.6931 },
                { x: 1.5, y: 0.9163 },
                { x: 2.0, y: 1.0986 }
            ],
            xEval: "1.2",
            funcionOriginal: "log(x+1)",
            grado: "4",
            nota: "Interpolación de función logarítmica. Buena aproximación en intervalo pequeño"
        },
        {
            nombre: "Puntos Chebyshev",
            descripcion: "Puntos de Chebyshev para minimizar error",
            puntos: [
                { x: 0.9239, y: 0.8536 },
                { x: 0.3827, y: 0.1464 },
                { x: -0.3827, y: 0.1464 },
                { x: -0.9239, y: 0.8536 }
            ],
            xEval: "0.5",
            funcionOriginal: "cos(acos(x))^2",
            grado: "3",
            nota: "Puntos de Chebyshev minimizan el fenómeno de Runge"
        },
        {
            nombre: "Datos con Ruido",
            descripcion: "Aproximación de datos con ruido aleatorio",
            puntos: [
                { x: 0, y: 0.1 },
                { x: 1, y: 0.95 },
                { x: 2, y: 4.1 },
                { x: 3, y: 8.8 },
                { x: 4, y: 15.9 }
            ],
            xEval: "2.5",
            funcionOriginal: "x^2",
            grado: "4",
            nota: "Lagrange es sensible a datos con ruido - puede oscilar"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="lagrange-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Más Ejemplos de Interpolación</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #3498db; margin-bottom: 0.5rem;">
                                    <i class="fas fa-chart-line"></i> ${ejemplo.nombre}
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
                                <button class="cargar-lagrange-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #3498db; color: white; border: none; padding: 0.5rem 1rem; 
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
    const modalExistente = document.getElementById('lagrange-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('lagrange-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-lagrange-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoLagrange(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarLagrange() {
    console.log('Lagrange.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('lagrange-numpuntos').value = '4';
    document.getElementById('lagrange-x-eval').value = '1.5';
    document.getElementById('lagrange-grado').value = '3';
    document.getElementById('lagrange-func-original').value = '';
    
    // Regenerar campos de puntos
    generarCamposPuntos();
    
    // Limpiar resultados
    document.getElementById('lagrange-resultado').textContent = '-';
    document.getElementById('lagrange-tiempo').textContent = '-';
    document.getElementById('lagrange-error').textContent = '-';
    document.getElementById('lagrange-polynomial').innerHTML = '';
    document.getElementById('lagrange-table-body').innerHTML = '';
    document.getElementById('lagrange-comparacion-body').innerHTML = '';
    
    // Ocultar sección de comparación
    document.getElementById('lagrange-comparacion-section').style.display = 'none';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('lagrange-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['lagrange-chart', 'lagrange-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('lagrange-chart').getContext('2d');
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
    window.charts['lagrange-chart'] = emptyChart;
    
    console.log('Lagrange.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaLagrange() {
    console.log("=== PRUEBA DE INTERPOLACIÓN DE LAGRANGE ===");
    
    try {
        const puntos = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 4 },
            { x: 3, y: 9 }
        ];
        
        const xEval = 1.5;
        const resultado = calcularInterpolacionLagrange(puntos, xEval);
        
        console.log("Puntos:", puntos.map(p => `(${p.x}, ${p.y})`).join(", "));
        console.log("Evaluar en x =", xEval);
        console.log("Valor interpolado:", resultado.valorInterpolado);
        console.log("Valor exacto (x²):", xEval * xEval);
        console.log("Error absoluto:", Math.abs(resultado.valorInterpolado - xEval * xEval));
        console.log("\nPolinomios base:");
        resultado.polinomiosBase.forEach(pb => {
            console.log(`  L${pb.indice}(x) en x=${xEval} = ${pb.Li}, contribución = ${pb.contribucion}`);
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaLagrange);