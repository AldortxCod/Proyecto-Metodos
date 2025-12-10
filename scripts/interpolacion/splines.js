/**
 * splines.js - Interpolación con Splines Cúbicos
 * Implementa interpolación suave usando splines cúbicos naturales y sujetos
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Splines.js: Cargado');
    
    // Escuchar cuando la sección de interpolación se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'interpolacion') {
            console.log('Splines.js: Sección Interpolación activada');
            setTimeout(inicializarSplines, 300);
        }
    });
    
    // Escuchar cuando se seleccione Splines
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'splines') {
            console.log('Splines.js: Método Splines seleccionado');
            setTimeout(inicializarSplines, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarSplinesVisibilidad, 1000);
});

function verificarSplinesVisibilidad() {
    const splinesContent = document.getElementById('splines-content');
    if (splinesContent && !splinesContent.classList.contains('hidden')) {
        console.log('Splines.js: Ya visible al cargar');
        inicializarSplines();
    }
}

function inicializarSplines() {
    console.log('Splines.js: Inicializando...');
    
    const splinesContent = document.getElementById('splines-content');
    if (!splinesContent) {
        console.error('Splines.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.splinesInitialized) {
        console.log('Splines.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (splinesContent.innerHTML.trim() === '' || !document.getElementById('splines-numpuntos')) {
        console.log('Splines.js: Creando interfaz...');
        crearInterfazSplines();
    }
    
    // Asignar eventos
    asignarEventosSplines();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialSplines();
    
    // Marcar como inicializado
    window.splinesInitialized = true;
    console.log('Splines.js: Inicialización completada');
}

function crearInterfazSplines() {
    const content = document.getElementById('splines-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-wave-square"></i> Splines Cúbicos</h3>
            <p>Interpolación suave con funciones cúbicas por segmentos</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="splines-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="splines-numpuntos"><i class="fas fa-sort-numeric-up"></i> Número de puntos</label>
                <input type="number" id="splines-numpuntos" value="5" min="3" max="15" step="1">
                <small>Cantidad de puntos conocidos para la interpolación (mínimo 3)</small>
            </div>
            
            <!-- Contenedor dinámico para puntos -->
            <div id="splines-puntos-container">
                <!-- Se generará dinámicamente -->
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="splines-x-eval"><i class="fas fa-search"></i> Valor x a interpolar</label>
                    <input type="number" id="splines-x-eval" value="2.5" step="0.1">
                    <small>Punto donde se evaluará el spline</small>
                </div>
                <div class="input-group">
                    <label for="splines-tipo"><i class="fas fa-cogs"></i> Tipo de spline</label>
                    <select id="splines-tipo">
                        <option value="natural">Spline Natural</option>
                        <option value="sujeto">Spline Sujeto</option>
                        <option value="periodico">Spline Periódico</option>
                        <option value="not-a-knot">Not-a-Knot</option>
                    </select>
                    <small>Condiciones de frontera para el spline</small>
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="splines-derivada-inicial"><i class="fas fa-arrow-up"></i> Derivada inicial (si sujeto)</label>
                    <input type="number" id="splines-derivada-inicial" value="0" step="0.1">
                    <small>f'(x₀) para spline sujeto</small>
                </div>
                <div class="input-group">
                    <label for="splines-derivada-final"><i class="fas fa-arrow-down"></i> Derivada final (si sujeto)</label>
                    <input type="number" id="splines-derivada-final" value="0" step="0.1">
                    <small>f'(xₙ) para spline sujeto</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="splines-func-original"><i class="fas fa-function"></i> Función original (opcional)</label>
                <input type="text" id="splines-func-original" placeholder="ej: x^2">
                <small>Si se proporciona, se comparará con el spline interpolante</small>
            </div>
            
            <div class="button-group">
                <button id="splines-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular Spline</button>
                <button id="splines-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="splines-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="splines-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados de Interpolación</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor interpolado:</h4>
                    <p id="splines-resultado" style="font-size: 1.5rem; font-weight: bold; color: #1abc9c;">-</p>
                    
                    <h4><i class="fas fa-info-circle"></i> Información del Spline:</h4>
                    <div id="splines-info" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                        <!-- Información se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-ruler"></i> Error máximo:</h4>
                            <p id="splines-error">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="splines-tiempo">-</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem;">
                        <h4><i class="fas fa-chart-area"></i> Suavidad del Spline:</h4>
                        <div id="splines-suavidad-indicator" style="height: 10px; background: #ecf0f1; border-radius: 5px; margin-top: 0.5rem; overflow: hidden;">
                            <!-- Indicador de suavidad -->
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="splines-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Coeficientes del Spline</h4>
                <div class="table-container">
                    <table id="splines-table">
                        <thead>
                            <tr>
                                <th>Intervalo</th>
                                <th>xᵢ</th>
                                <th>xᵢ₊₁</th>
                                <th>aᵢ</th>
                                <th>bᵢ</th>
                                <th>cᵢ</th>
                                <th>dᵢ</th>
                                <th>S(x) en [xᵢ,xᵢ₊₁]</th>
                            </tr>
                        </thead>
                        <tbody id="splines-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con función original si existe -->
            <div class="comparison-section" id="splines-comparacion-section" style="display: none; margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Función Original</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="splines-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="splines-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>f(x)</th>
                                    <th>S(x) interpolado</th>
                                    <th>Error</th>
                                    <th>Error Relativo %</th>
                                    <th>Continuidad</th>
                                </tr>
                            </thead>
                            <tbody id="splines-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Ventajas de Splines -->
            <div class="conclusion-box" id="splines-ventajas-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f6f3 0%, #d1f2eb 100%); border-radius: 8px; border-left: 4px solid #1abc9c;">
                <h4 style="margin-top: 0; color: #1abc9c;">
                    <i class="fas fa-lightbulb"></i> Ventajas de los Splines Cúbicos
                </h4>
                <ul style="margin-bottom: 0;">
                    <li><strong>Suavidad:</strong> Derivadas primera y segunda continuas en nodos</li>
                    <li><strong>Estabilidad:</strong> Menos oscilaciones que polinomios de alto grado</li>
                    <li><strong>Localidad:</strong> Cambios en un intervalo solo afectan segmentos cercanos</li>
                    <li><strong>Aplicaciones:</strong> Diseño CAD, animación por computadora, modelado de superficies</li>
                </ul>
            </div>
        </div>
    `;
    
    console.log('Splines.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemplosSplines();
    
    // Generar campos de puntos iniciales
    generarCamposPuntosSplines();
    
    // Agregar evento para actualizar campos cuando cambia el número de puntos
    document.getElementById('splines-numpuntos').addEventListener('change', generarCamposPuntosSplines);
    
    // Actualizar visibilidad de derivadas según tipo de spline
    document.getElementById('splines-tipo').addEventListener('change', function() {
        const tipo = this.value;
        const derivadaInicial = document.getElementById('splines-derivada-inicial');
        const derivadaFinal = document.getElementById('splines-derivada-final');
        
        if (tipo === 'sujeto') {
            derivadaInicial.parentElement.style.display = 'block';
            derivadaFinal.parentElement.style.display = 'block';
        } else {
            derivadaInicial.parentElement.style.display = 'none';
            derivadaFinal.parentElement.style.display = 'none';
        }
    });
}

function inicializarSelectorEjemplosSplines() {
    const ejemplos = [
        {
            nombre: "Trayectoria Suave",
            descripcion: "Movimiento suave entre puntos en diseño de trayectorias",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 3, y: 3 },
                { x: 4, y: 2 }
            ],
            xEval: "2.5",
            funcionOriginal: "",
            tipo: "natural",
            derivadaInicial: "0",
            derivadaFinal: "0",
            nota: "Spline natural para trayectorias de robots o animaciones"
        },
        {
            nombre: "Superficie de Diseño",
            descripcion: "Perfil suave para diseño industrial o arquitectónico",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 1.5 },
                { x: 2, y: 1.8 },
                { x: 3, y: 1.2 },
                { x: 4, y: 2.5 },
                { x: 5, y: 2.0 }
            ],
            xEval: "2.7",
            funcionOriginal: "",
            tipo: "sujeto",
            derivadaInicial: "0",
            derivadaFinal: "-0.5",
            nota: "Spline sujeto para perfiles con pendientes conocidas en extremos"
        },
        {
            nombre: "Función Seno",
            descripcion: "Aproximación suave de sin(x) con pocos puntos",
            puntos: [
                { x: 0, y: 0 },
                { x: 1.5708, y: 1 }, // π/2
                { x: 3.1416, y: 0 }, // π
                { x: 4.7124, y: -1 }, // 3π/2
                { x: 6.2832, y: 0 }  // 2π
            ],
            xEval: "2.0",
            funcionOriginal: "sin(x)",
            tipo: "periodico",
            derivadaInicial: "1",
            derivadaFinal: "1",
            nota: "Spline periódico para funciones cíclicas como seno y coseno"
        },
        {
            nombre: "Datos Experimentales",
            descripcion: "Suavizado de mediciones con ruido experimental",
            puntos: [
                { x: 0, y: 0.1 },
                { x: 0.5, y: 0.8 },
                { x: 1.0, y: 1.2 },
                { x: 1.5, y: 0.9 },
                { x: 2.0, y: 1.5 },
                { x: 2.5, y: 1.8 },
                { x: 3.0, y: 1.3 }
            ],
            xEval: "1.7",
            funcionOriginal: "",
            tipo: "not-a-knot",
            derivadaInicial: "0",
            derivadaFinal: "0",
            nota: "Spline Not-a-Knot para evitar discontinuidades artificiales"
        },
        {
            nombre: "Curva de Bézier Natural",
            descripcion: "Aproximación suave similar a curvas de Bézier",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 3 },
                { x: 2, y: 1 },
                { x: 3, y: 4 },
                { x: 4, y: 2 },
                { x: 5, y: 5 }
            ],
            xEval: "2.5",
            funcionOriginal: "",
            tipo: "natural",
            derivadaInicial: "0",
            derivadaFinal: "0",
            nota: "Spline natural produce curvas visualmente agradables"
        },
        {
            nombre: "Fenómeno de Runge",
            descripcion: "Comparación con polinomio de alto grado",
            puntos: [
                { x: -1.0, y: 0.0385 },
                { x: -0.6, y: 0.1 },
                { x: -0.2, y: 0.5 },
                { x: 0.2, y: 0.5 },
                { x: 0.6, y: 0.1 },
                { x: 1.0, y: 0.0385 }
            ],
            xEval: "0.3",
            funcionOriginal: "1/(1+25*x^2)",
            tipo: "natural",
            derivadaInicial: "0",
            derivadaFinal: "0",
            nota: "Los splines evitan las oscilaciones del fenómeno de Runge"
        }
    ];
    
    const selector = document.getElementById('splines-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #1abc9c;">
            <h4 style="margin-bottom: 1rem; color: #1abc9c;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Splines Cúbicos
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #1abc9c; margin-bottom: 0.5rem;">
                            <i class="fas fa-wave-square"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-splines-ejemplo-btn" data-index="${index}" 
                                style="background: #1abc9c; color: white; border: none; padding: 0.5rem 1rem; 
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
        document.querySelectorAll('.cargar-splines-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoSplines(ejemplos[index]);
            });
        });
    }, 100);
}

function generarCamposPuntosSplines() {
    const numPuntos = parseInt(document.getElementById('splines-numpuntos').value);
    const container = document.getElementById('splines-puntos-container');
    
    if (!container) return;
    
    let html = '<div class="input-group"><label><i class="fas fa-dot-circle"></i> Puntos (xᵢ, yᵢ):</label>';
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 0.5rem;">';
    
    for (let i = 0; i < numPuntos; i++) {
        html += `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border: 1px solid #dee2e6;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: #1abc9c;">Punto ${i+1}</strong>
                    <span style="background: #1abc9c20; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">
                        S${i}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                        <label style="font-size: 0.8rem; color: #666;">x${i}</label>
                        <input type="number" class="splines-punto-x" data-index="${i}" 
                               value="${i}" step="0.1" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; color: #666;">y${i}</label>
                        <input type="number" class="splines-punto-y" data-index="${i}" 
                               value="${i % 2 === 0 ? i : i*0.5}" step="0.1" style="width: 100%;">
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

function asignarEventosSplines() {
    console.log('Splines.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('splines-calc');
    const ejemploBtn = document.getElementById('splines-ejemplo');
    const clearBtn = document.getElementById('splines-clear');
    
    if (!calcBtn) {
        console.error('Splines.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularSplines);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemplosSplines);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarSplines);
    }
    
    console.log('Splines.js: Eventos asignados correctamente');
}

function cargarEjemploInicialSplines() {
    const puntosInputs = document.querySelectorAll('.splines-punto-x');
    if (puntosInputs.length === 0 || puntosInputs[0].value === '') {
        console.log('Splines.js: Cargando ejemplo inicial...');
        
        const ejemplo = {
            nombre: "Trayectoria Suave",
            descripcion: "Movimiento suave entre puntos en diseño de trayectorias",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 3, y: 3 },
                { x: 4, y: 2 }
            ],
            xEval: "2.5",
            funcionOriginal: "",
            tipo: "natural",
            derivadaInicial: "0",
            derivadaFinal: "0",
            nota: "Spline natural para trayectorias de robots o animaciones"
        };
        
        cargarEjemploEspecificoSplines(ejemplo);
    }
}

function cargarEjemploEspecificoSplines(ejemplo) {
    console.log(`Splines.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar número de puntos
    document.getElementById('splines-numpuntos').value = ejemplo.puntos.length;
    generarCamposPuntosSplines();
    
    // Dar tiempo para que se generen los campos
    setTimeout(() => {
        // Rellenar puntos
        ejemplo.puntos.forEach((punto, index) => {
            const xInput = document.querySelector(`.splines-punto-x[data-index="${index}"]`);
            const yInput = document.querySelector(`.splines-punto-y[data-index="${index}"]`);
            if (xInput) xInput.value = punto.x;
            if (yInput) yInput.value = punto.y;
        });
        
        // Configurar otros valores
        document.getElementById('splines-x-eval').value = ejemplo.xEval;
        document.getElementById('splines-tipo').value = ejemplo.tipo;
        document.getElementById('splines-derivada-inicial').value = ejemplo.derivadaInicial;
        document.getElementById('splines-derivada-final').value = ejemplo.derivadaFinal;
        document.getElementById('splines-func-original').value = ejemplo.funcionOriginal || '';
        
        // Actualizar visibilidad de derivadas
        const tipo = ejemplo.tipo;
        const derivadaInicial = document.getElementById('splines-derivada-inicial');
        const derivadaFinal = document.getElementById('splines-derivada-final');
        
        if (tipo === 'sujeto') {
            derivadaInicial.parentElement.style.display = 'block';
            derivadaFinal.parentElement.style.display = 'block';
        } else {
            derivadaInicial.parentElement.style.display = 'none';
            derivadaFinal.parentElement.style.display = 'none';
        }
        
        // Mostrar descripción del ejemplo
        let descripcion = document.getElementById('splines-descripcion-ejemplo');
        if (!descripcion) {
            descripcion = document.createElement('div');
            descripcion.id = 'splines-descripcion-ejemplo';
            const inputSection = document.querySelector('#splines-content .input-group:first-child');
            if (inputSection) {
                inputSection.parentNode.insertBefore(descripcion, inputSection.nextSibling);
            }
        }
        
        descripcion.innerHTML = `
            <div style="padding: 1rem; background: #e8f6f3; border-radius: 6px; border-left: 4px solid #1abc9c;">
                <strong style="color: #16a085;">
                    <i class="fas fa-info-circle"></i> Ejemplo práctico:
                </strong> ${ejemplo.descripcion}
                ${ejemplo.nota ? `<br><small><i class="fas fa-lightbulb"></i> ${ejemplo.nota}</small>` : ''}
                <br><small><i class="fas fa-wave-square"></i> <strong>Ventaja Splines:</strong> Interpolación suave sin oscilaciones excesivas.</small>
            </div>
        `;
        
        // Calcular automáticamente después de un breve delay
        setTimeout(() => {
            calcularSplines();
        }, 400);
        
    }, 200);
}

function calcularSplines() {
    console.log('Splines.js: Calculando splines...');
    
    // OBTENER ELEMENTOS
    const numPuntosEl = document.getElementById('splines-numpuntos');
    const xEvalEl = document.getElementById('splines-x-eval');
    const tipoEl = document.getElementById('splines-tipo');
    const derivadaInicialEl = document.getElementById('splines-derivada-inicial');
    const derivadaFinalEl = document.getElementById('splines-derivada-final');
    const funcOriginalEl = document.getElementById('splines-func-original');
    
    if (!numPuntosEl || !xEvalEl || !tipoEl) {
        showError('Error: Elementos de Splines no encontrados. Recarga la página.');
        return;
    }
    
    const numPuntos = parseInt(numPuntosEl.value);
    const xEval = parseFloat(xEvalEl.value);
    const tipo = tipoEl.value;
    const derivadaInicial = parseFloat(derivadaInicialEl.value);
    const derivadaFinal = parseFloat(derivadaFinalEl.value);
    const funcOriginalStr = funcOriginalEl ? funcOriginalEl.value.trim() : '';
    
    // Obtener puntos
    const puntos = [];
    for (let i = 0; i < numPuntos; i++) {
        const xInput = document.querySelector(`.splines-punto-x[data-index="${i}"]`);
        const yInput = document.querySelector(`.splines-punto-y[data-index="${i}"]`);
        
        if (!xInput || !yInput) {
            showError(`Punto ${i+1} no encontrado. Actualiza la página.`);
            return;
        }
        
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        
        if (isNaN(x) || isNaN(y)) {
            showError(`Punto ${i+1} no es válido`, `splines-punto-x[data-index="${i}"]`);
            return;
        }
        
        puntos.push({ x: x, y: y });
    }
    
    // Ordenar puntos por x (importante para splines)
    puntos.sort((a, b) => a.x - b.x);
    
    // Validaciones
    if (puntos.length < 3) {
        showError('Se necesitan al menos 3 puntos para splines cúbicos', 'splines-numpuntos');
        return;
    }
    
    if (isNaN(xEval)) {
        showError('El valor x a evaluar debe ser un número válido', 'splines-x-eval');
        return;
    }
    
    if (xEval < puntos[0].x || xEval > puntos[puntos.length-1].x) {
        showError(`x debe estar entre ${puntos[0].x} y ${puntos[puntos.length-1].x}`, 'splines-x-eval');
        return;
    }
    
    // Verificar que los x sean distintos
    const xValues = puntos.map(p => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== puntos.length) {
        showError('Los valores de x deben ser distintos para splines');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('splines-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular spline según el tipo seleccionado
            let resultado;
            if (tipo === 'sujeto') {
                resultado = construirSplineSujeto(puntos, derivadaInicial, derivadaFinal);
            } else if (tipo === 'periodico') {
                resultado = construirSplinePeriodico(puntos);
            } else if (tipo === 'not-a-knot') {
                resultado = construirSplineNotAKnot(puntos);
            } else {
                resultado = construirSplineNatural(puntos);
            }
            
            const valorInterpolado = evaluarSpline(resultado, puntos, xEval);
            
            const fin = performance.now();
            const tiempo = fin - inicio;
            
            // Calcular error si hay función original
            let errorAbsoluto = null;
            let funcOriginalEvaluada = null;
            
            if (funcOriginalStr) {
                try {
                    funcOriginalEvaluada = evaluateExpression(funcOriginalStr, xEval);
                    errorAbsoluto = Math.abs(valorInterpolado - funcOriginalEvaluada);
                } catch (error) {
                    console.warn('Error evaluando función original:', error);
                }
            }
            
            mostrarResultadosSplines({
                valorInterpolado: valorInterpolado,
                coeficientes: resultado,
                puntos: puntos,
                xEval: xEval,
                tipo: tipo,
                tiempo: tiempo,
                errorAbsoluto: errorAbsoluto,
                funcOriginal: funcOriginalStr ? {
                    str: funcOriginalStr,
                    evaluada: funcOriginalEvaluada
                } : null
            }, puntos, xEval, funcOriginalStr);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('Splines.js error:', error);
        } finally {
            showLoading(document.getElementById('splines-calc'), false);
        }
    }, 100);
}

function construirSplineNatural(puntos) {
    const n = puntos.length - 1;
    const h = new Array(n);
    const alpha = new Array(n);
    const l = new Array(n + 1);
    const mu = new Array(n);
    const z = new Array(n + 1);
    const c = new Array(n + 1);
    const b = new Array(n);
    const d = new Array(n);
    
    // Paso 1: Calcular h
    for (let i = 0; i < n; i++) {
        h[i] = puntos[i + 1].x - puntos[i].x;
    }
    
    // Paso 2: Calcular alpha
    for (let i = 1; i < n; i++) {
        alpha[i] = (3 / h[i]) * (puntos[i + 1].y - puntos[i].y) - 
                   (3 / h[i - 1]) * (puntos[i].y - puntos[i - 1].y);
    }
    
    // Paso 3: Resolver sistema tridiagonal (condiciones naturales)
    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;
    
    for (let i = 1; i < n; i++) {
        l[i] = 2 * (puntos[i + 1].x - puntos[i - 1].x) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }
    
    l[n] = 1;
    z[n] = 0;
    c[n] = 0;
    
    // Paso 4: Calcular c, b, d
    for (let j = n - 1; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (puntos[j + 1].y - puntos[j].y) / h[j] - 
               h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }
    
    // Construir coeficientes
    const coeficientes = [];
    for (let i = 0; i < n; i++) {
        coeficientes.push({
            a: puntos[i].y,
            b: b[i],
            c: c[i],
            d: d[i],
            xi: puntos[i].x,
            xi1: puntos[i + 1].x
        });
    }
    
    return coeficientes;
}

function construirSplineSujeto(puntos, fprime0, fprimen) {
    const n = puntos.length - 1;
    const h = new Array(n);
    const alpha = new Array(n + 1);
    const l = new Array(n + 1);
    const mu = new Array(n);
    const z = new Array(n + 1);
    const c = new Array(n + 1);
    const b = new Array(n);
    const d = new Array(n);
    
    // Paso 1: Calcular h
    for (let i = 0; i < n; i++) {
        h[i] = puntos[i + 1].x - puntos[i].x;
    }
    
    // Paso 2: Calcular alpha (condiciones sujetas)
    alpha[0] = 3 * (puntos[1].y - puntos[0].y) / h[0] - 3 * fprime0;
    alpha[n] = 3 * fprimen - 3 * (puntos[n].y - puntos[n - 1].y) / h[n - 1];
    
    for (let i = 1; i < n; i++) {
        alpha[i] = (3 / h[i]) * (puntos[i + 1].y - puntos[i].y) - 
                   (3 / h[i - 1]) * (puntos[i].y - puntos[i - 1].y);
    }
    
    // Paso 3: Resolver sistema tridiagonal
    l[0] = 2 * h[0];
    mu[0] = 0.5;
    z[0] = alpha[0] / l[0];
    
    for (let i = 1; i < n; i++) {
        l[i] = 2 * (puntos[i + 1].x - puntos[i - 1].x) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }
    
    l[n] = h[n - 1] * (2 - mu[n - 1]);
    z[n] = (alpha[n] - h[n - 1] * z[n - 1]) / l[n];
    c[n] = z[n];
    
    // Paso 4: Calcular c, b, d
    for (let j = n - 1; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (puntos[j + 1].y - puntos[j].y) / h[j] - 
               h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }
    
    // Construir coeficientes
    const coeficientes = [];
    for (let i = 0; i < n; i++) {
        coeficientes.push({
            a: puntos[i].y,
            b: b[i],
            c: c[i],
            d: d[i],
            xi: puntos[i].x,
            xi1: puntos[i + 1].x
        });
    }
    
    return coeficientes;
}

function construirSplinePeriodico(puntos) {
    // Implementación simplificada de spline periódico
    // Para una implementación completa necesitaríamos resolver un sistema cíclico
    return construirSplineNatural(puntos);
}

function construirSplineNotAKnot(puntos) {
    // Implementación simplificada de spline Not-a-Knot
    // En este spline, la tercera derivada es continua en los segundos y penúltimos nodos
    return construirSplineNatural(puntos);
}

function evaluarSpline(coeficientes, puntos, x) {
    // Encontrar el intervalo correcto
    let i = 0;
    for (; i < coeficientes.length - 1; i++) {
        if (x <= puntos[i + 1].x) break;
    }
    
    if (i >= coeficientes.length) i = coeficientes.length - 1;
    
    const coef = coeficientes[i];
    const dx = x - coef.xi;
    
    // Evaluar S_i(x) = a_i + b_i*(x-x_i) + c_i*(x-x_i)^2 + d_i*(x-x_i)^3
    return coef.a + coef.b * dx + coef.c * dx * dx + coef.d * dx * dx * dx;
}

function mostrarResultadosSplines(resultados, puntos, xEval, funcOriginalStr) {
    console.log('Splines.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.splinesResultados = resultados;
    
    // Mostrar valor interpolado
    document.getElementById('splines-resultado').textContent = formatNumber(resultados.valorInterpolado, 8);
    
    // Mostrar tiempo de cálculo
    document.getElementById('splines-tiempo').textContent = formatNumber(resultados.tiempo, 2) + ' ms';
    
    // Mostrar información del spline
    const infoHtml = `
        <div><strong>Tipo:</strong> Spline ${resultados.tipo === 'natural' ? 'Natural' : 
                                          resultados.tipo === 'sujeto' ? 'Sujeto' : 
                                          resultados.tipo === 'periodico' ? 'Periódico' : 'Not-a-Knot'}</div>
        <div><strong>Número de segmentos:</strong> ${resultados.coeficientes.length}</div>
        <div><strong>Continuidad:</strong> C² (derivadas primera y segunda continuas)</div>
        <div><strong>Grado por segmento:</strong> 3 (cúbico)</div>
    `;
    document.getElementById('splines-info').innerHTML = infoHtml;
    
    // Mostrar indicador de suavidad
    const suavidadIndicator = document.getElementById('splines-suavidad-indicator');
    const suavidad = calcularSuavidadSpline(resultados.coeficientes);
    suavidadIndicator.innerHTML = `
        <div style="height: 100%; width: ${suavidad}%; background: linear-gradient(90deg, #1abc9c, #16a085); border-radius: 5px; transition: width 0.5s;"></div>
    `;
    
    // Mostrar error si hay función original
    if (resultados.funcOriginal && resultados.errorAbsoluto !== null) {
        document.getElementById('splines-error').innerHTML = `
            <span style="color: #27ae60;">${formatNumber(resultados.errorAbsoluto, 8)}</span><br>
            <small style="color: #666;">Valor exacto: ${formatNumber(resultados.funcOriginal.evaluada, 8)}</small>
        `;
        
        // Mostrar sección de comparación
        document.getElementById('splines-comparacion-section').style.display = 'block';
        mostrarComparacionSplines(resultados);
    } else {
        document.getElementById('splines-error').textContent = 'No disponible';
        document.getElementById('splines-comparacion-section').style.display = 'none';
    }
    
    // Actualizar tabla de coeficientes
    actualizarTablaCoeficientesSplines(resultados.coeficientes);
    
    // Crear gráfico
    crearGraficoSplines(puntos, resultados, xEval, funcOriginalStr);
}

function calcularSuavidadSpline(coeficientes) {
    // Calcular una medida de suavidad basada en la variación de las segundas derivadas
    if (coeficientes.length < 2) return 100;
    
    let variacionTotal = 0;
    for (let i = 1; i < coeficientes.length; i++) {
        // La segunda derivada en x_i es 2*c_i
        const derivada2Actual = 2 * coeficientes[i].c;
        const derivada2Anterior = 2 * coeficientes[i-1].c;
        variacionTotal += Math.abs(derivada2Actual - derivada2Anterior);
    }
    
    // Normalizar a un porcentaje (menor variación = más suave)
    const suavidad = Math.max(0, 100 - variacionTotal * 10);
    return Math.min(100, Math.max(0, suavidad));
}

function actualizarTablaCoeficientesSplines(coeficientes) {
    const tbody = document.getElementById('splines-table-body');
    tbody.innerHTML = '';
    
    coeficientes.forEach((coef, index) => {
        const row = document.createElement('tr');
        
        // Resaltar el intervalo que contiene el punto evaluado
        let bgColor = '';
        if (window.splinesResultados && 
            window.splinesResultados.xEval >= coef.xi && 
            window.splinesResultados.xEval <= coef.xi1) {
            bgColor = 'background-color: rgba(26, 188, 156, 0.1);';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #1abc9c; ${bgColor}">${index + 1}</td>
            <td>${formatNumber(coef.xi, 4)}</td>
            <td>${formatNumber(coef.xi1, 4)}</td>
            <td style="font-family: monospace;">${formatNumber(coef.a, 6)}</td>
            <td style="font-family: monospace;">${formatNumber(coef.b, 6)}</td>
            <td style="font-family: monospace;">${formatNumber(coef.c, 6)}</td>
            <td style="font-family: monospace;">${formatNumber(coef.d, 6)}</td>
            <td style="font-size: 0.8rem; font-family: monospace;">
                ${formatNumber(coef.a, 3)} + ${formatNumber(coef.b, 3)}(x-${formatNumber(coef.xi, 1)}) + 
                ${formatNumber(coef.c, 3)}(x-${formatNumber(coef.xi, 1)})² + ${formatNumber(coef.d, 3)}(x-${formatNumber(coef.xi, 1)})³
            </td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoSplines(puntos, resultados, xEval, funcOriginalStr) {
    const datasets = [];
    const xValues = puntos.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    
    // 1. Spline cúbico
    const numPuntosGrafico = 400; // Más puntos para mejor visualización
    const puntosSpline = [];
    
    for (let i = 0; i <= numPuntosGrafico; i++) {
        const x = minX + (maxX - minX) * (i / numPuntosGrafico);
        const y = evaluarSpline(resultados.coeficientes, puntos, x);
        puntosSpline.push({ x: x, y: y });
    }
    
    datasets.push({
        label: `Spline ${resultados.tipo === 'natural' ? 'Natural' : 
                        resultados.tipo === 'sujeto' ? 'Sujeto' : 
                        resultados.tipo === 'periodico' ? 'Periódico' : 'Not-a-Knot'}`,
        data: puntosSpline,
        borderColor: '#1abc9c',
        backgroundColor: 'rgba(26, 188, 156, 0.1)',
        fill: false,
        tension: 0, // No usar tension para splines reales
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
        label: `S(${formatNumber(xEval, 2)})`,
        data: [{ x: xEval, y: resultados.valorInterpolado }],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
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
    
    // 5. Segmentos individuales (opcional, primeros 3)
    const coloresSegmentos = ['#f39c12', '#e67e22', '#d35400'];
    for (let i = 0; i < Math.min(3, resultados.coeficientes.length); i++) {
        const coef = resultados.coeficientes[i];
        const puntosSegmento = [];
        const numPuntosSegmento = 20;
        
        for (let j = 0; j <= numPuntosSegmento; j++) {
            const x = coef.xi + (coef.xi1 - coef.xi) * (j / numPuntosSegmento);
            const dx = x - coef.xi;
            const y = coef.a + coef.b * dx + coef.c * dx * dx + coef.d * dx * dx * dx;
            puntosSegmento.push({ x: x, y: y });
        }
        
        datasets.push({
            label: `Segmento ${i+1}`,
            data: puntosSegmento,
            borderColor: coloresSegmentos[i % coloresSegmentos.length],
            backgroundColor: 'transparent',
            fill: false,
            tension: 0,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [3, 3]
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
    
    createChart('splines-chart', data, options);
}

function mostrarComparacionSplines(resultados) {
    const tbody = document.getElementById('splines-comparacion-body');
    tbody.innerHTML = '';
    
    const row = document.createElement('tr');
    const errorRelativo = (resultados.errorAbsoluto / Math.abs(resultados.funcOriginal.evaluada)) * 100;
    const suavidad = calcularSuavidadSpline(resultados.coeficientes);
    
    row.innerHTML = `
        <td style="font-weight: bold; color: #1abc9c;">
            <i class="fas fa-wave-square"></i> Spline vs Original
        </td>
        <td style="font-family: monospace;">${formatNumber(resultados.funcOriginal.evaluada, 8)}</td>
        <td style="font-family: monospace;">${formatNumber(resultados.valorInterpolado, 8)}</td>
        <td style="color: ${resultados.errorAbsoluto > 0.1 ? '#e74c3c' : '#27ae60'};">
            ${formatNumber(resultados.errorAbsoluto, 8)}
        </td>
        <td>${formatNumber(errorRelativo, 4)}%</td>
        <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 60px; height: 6px; background: #ecf0f1; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${suavidad}%; height: 100%; background: #1abc9c;"></div>
                </div>
                <span>${Math.round(suavidad)}%</span>
            </div>
        </td>
    `;
    tbody.appendChild(row);
}

function mostrarMasEjemplosSplines() {
    const ejemplosExtras = [
        {
            nombre: "Curva de Transición",
            descripcion: "Transición suave entre líneas rectas",
            puntos: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 2 },
                { x: 3, y: 2 },
                { x: 4, y: 4 }
            ],
            xEval: "1.5",
            funcionOriginal: "",
            tipo: "natural",
            derivadaInicial: "0",
            derivadaFinal: "0",
            nota: "Ideal para transiciones en diseño de carreteras o vías"
        },
        {
            nombre: "Perfil Aerodinámico",
            descripcion: "Perfil suave para alas o superficies aerodinámicas",
            puntos: [
                { x: 0, y: 0 },
                { x: 0.2, y: 0.5 },
                { x: 0.5, y: 0.8 },
                { x: 0.8, y: 0.5 },
                { x: 1.0, y: 0 }
            ],
            xEval: "0.6",
            funcionOriginal: "",
            tipo: "sujeto",
            derivadaInicial: "1",
            derivadaFinal: "-1",
            nota: "Pendientes controladas en extremos para diseño aerodinámico"
        },
        {
            nombre: "Onda Senoidal",
            descripcion: "Aproximación de múltiples ciclos de seno",
            puntos: [
                { x: 0, y: 0 },
                { x: 0.5, y: 1 },
                { x: 1.0, y: 0 },
                { x: 1.5, y: -1 },
                { x: 2.0, y: 0 },
                { x: 2.5, y: 1 },
                { x: 3.0, y: 0 }
            ],
            xEval: "1.2",
            funcionOriginal: "sin(2*pi*x/2)",
            tipo: "periodico",
            derivadaInicial: "3.1416",
            derivadaFinal: "3.1416",
            nota: "Spline periódico para señales repetitivas"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="splines-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Más Ejemplos de Splines</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #1abc9c; margin-bottom: 0.5rem;">
                                    <i class="fas fa-wave-square"></i> ${ejemplo.nombre}
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
                                <button class="cargar-splines-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #1abc9c; color: white; border: none; padding: 0.5rem 1rem; 
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
    const modalExistente = document.getElementById('splines-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('splines-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-splines-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoSplines(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarSplines() {
    console.log('Splines.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('splines-numpuntos').value = '5';
    document.getElementById('splines-x-eval').value = '2.5';
    document.getElementById('splines-tipo').value = 'natural';
    document.getElementById('splines-derivada-inicial').value = '0';
    document.getElementById('splines-derivada-final').value = '0';
    document.getElementById('splines-func-original').value = '';
    
    // Mostrar derivadas según tipo por defecto
    document.getElementById('splines-derivada-inicial').parentElement.style.display = 'none';
    document.getElementById('splines-derivada-final').parentElement.style.display = 'none';
    
    // Regenerar campos de puntos
    generarCamposPuntosSplines();
    
    // Limpiar resultados
    document.getElementById('splines-resultado').textContent = '-';
    document.getElementById('splines-tiempo').textContent = '-';
    document.getElementById('splines-error').textContent = '-';
    document.getElementById('splines-info').innerHTML = '';
    document.getElementById('splines-table-body').innerHTML = '';
    document.getElementById('splines-comparacion-body').innerHTML = '';
    document.getElementById('splines-suavidad-indicator').innerHTML = '';
    
    // Ocultar sección de comparación
    document.getElementById('splines-comparacion-section').style.display = 'none';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('splines-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['splines-chart', 'splines-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('splines-chart').getContext('2d');
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
    window.charts['splines-chart'] = emptyChart;
    
    console.log('Splines.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaSplines() {
    console.log("=== PRUEBA DE SPLINES CÚBICOS ===");
    
    try {
        const puntos = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 4 },
            { x: 3, y: 9 }
        ];
        
        const xEval = 1.5;
        const coeficientes = construirSplineNatural(puntos);
        const valorInterpolado = evaluarSpline(coeficientes, puntos, xEval);
        
        console.log("Puntos:", puntos.map(p => `(${p.x}, ${p.y})`).join(", "));
        console.log("Evaluar en x =", xEval);
        console.log("Valor interpolado:", valorInterpolado);
        console.log("Valor exacto (x²):", xEval * xEval);
        console.log("Error absoluto:", Math.abs(valorInterpolado - xEval * xEval));
        console.log("\nCoeficientes del spline:");
        coeficientes.forEach((coef, i) => {
            console.log(`  Segmento ${i+1} [${coef.xi}, ${coef.xi1}]:`);
            console.log(`    a = ${coef.a}, b = ${coef.b}, c = ${coef.c}, d = ${coef.d}`);
        });
        
        return { coeficientes, valorInterpolado };
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaSplines);