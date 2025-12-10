/**
 * simpson-13.js - Regla de Simpson 1/3
 * Implementa integración numérica usando la regla de Simpson 1/3 simple y compuesta
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simpson13.js: Cargado');
    
    // Escuchar cuando la sección de integración se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'integracion') {
            console.log('Simpson13.js: Sección Integración activada');
            setTimeout(inicializarSimpson13, 300);
        }
    });
    
    // Escuchar cuando se seleccione Simpson 1/3
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'simpson-13') {
            console.log('Simpson13.js: Método Simpson 1/3 seleccionado');
            setTimeout(inicializarSimpson13, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarSimpson13Visibilidad, 1000);
});

function verificarSimpson13Visibilidad() {
    const simpson13Content = document.getElementById('simpson-13-content');
    if (simpson13Content && !simpson13Content.classList.contains('hidden')) {
        console.log('Simpson13.js: Ya visible al cargar');
        inicializarSimpson13();
    }
}

function inicializarSimpson13() {
    console.log('Simpson13.js: Inicializando...');
    
    const simpson13Content = document.getElementById('simpson-13-content');
    if (!simpson13Content) {
        console.error('Simpson13.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.simpson13Initialized) {
        console.log('Simpson13.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (simpson13Content.innerHTML.trim() === '' || !document.getElementById('simpson-13-func')) {
        console.log('Simpson13.js: Creando interfaz...');
        crearInterfazSimpson13();
    }
    
    // Asignar eventos
    asignarEventosSimpson13();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialSimpson13();
    
    // Marcar como inicializado
    window.simpson13Initialized = true;
    console.log('Simpson13.js: Inicialización completada');
}

function crearInterfazSimpson13() {
    const content = document.getElementById('simpson-13-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-chart-area"></i> Regla de Simpson 1/3</h3>
            <p>Integración numérica por aproximación parabólica</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="simpson-13-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="simpson-13-func"><i class="fas fa-function"></i> Función f(x)</label>
                <input type="text" id="simpson-13-func" value="sin(x)" placeholder="ej: x^2">
                <small>Función a integrar (usa sintaxis JavaScript)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="simpson-13-a"><i class="fas fa-play"></i> Límite inferior a</label>
                    <input type="number" id="simpson-13-a" value="0" step="0.1">
                    <small>Inicio del intervalo de integración</small>
                </div>
                <div class="input-group">
                    <label for="simpson-13-b"><i class="fas fa-stop"></i> Límite superior b</label>
                    <input type="number" id="simpson-13-b" value="3.14159" step="0.1">
                    <small>Fin del intervalo de integración</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="simpson-13-n"><i class="fas fa-sliders-h"></i> Número de intervalos n</label>
                <input type="number" id="simpson-13-n" value="10" min="2" max="1000" step="2">
                <small>Debe ser PAR (2, 4, 6...). Simpson 1/3 requiere número par de intervalos</small>
            </div>
            
            <div class="input-group">
                <label><i class="fas fa-eye"></i> Visualización</label>
                <div class="checkbox-group" style="display: flex; gap: 20px; margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="simpson-13-mostrar-parabolas" checked style="transform: scale(1.2);">
                        <span style="color: #9b59b6; font-weight: bold;">
                            Mostrar parábolas
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="simpson-13-mostrar-func" checked style="transform: scale(1.2);">
                        <span style="color: #3498db; font-weight: bold;">
                            Mostrar función
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="simpson-13-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular Integral</button>
                <button id="simpson-13-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="simpson-13-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="simpson-13-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-area"></i> Resultados de Integración</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor de la integral:</h4>
                    <p id="simpson-13-resultado" style="font-size: 1.5rem; font-weight: bold; color: #9b59b6;">-</p>
                    
                    <h4><i class="fas fa-ruler"></i> Precisión:</h4>
                    <div id="simpson-13-precision" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                        <!-- Información de precisión se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="simpson-13-tiempo">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-sliders-h"></i> Error estimado:</h4>
                            <p id="simpson-13-error">-</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem;">
                        <h4><i class="fas fa-chart-line"></i> Orden de precisión:</h4>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="height: 10px; flex-grow: 1; background: #ecf0f1; border-radius: 5px; overflow: hidden;">
                                <div id="simpson-13-precision-bar" style="height: 100%; width: 90%; background: linear-gradient(90deg, #9b59b6, #8e44ad); transition: width 0.5s;"></div>
                            </div>
                            <span id="simpson-13-precision-text" style="font-weight: bold; color: #9b59b6;">O(h⁴)</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="simpson-13-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Desglose por Segmentos</h4>
                <div class="table-container">
                    <table id="simpson-13-table">
                        <thead>
                            <tr>
                                <th>Segmento</th>
                                <th>xᵢ</th>
                                <th>xᵢ₊₂</th>
                                <th>f(xᵢ)</th>
                                <th>f(xᵢ₊₁)</th>
                                <th>f(xᵢ₊₂)</th>
                                <th>Área parábola</th>
                                <th>Área acumulada</th>
                            </tr>
                        </thead>
                        <tbody id="simpson-13-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con valor exacto si disponible -->
            <div class="comparison-section" id="simpson-13-comparacion-section" style="display: none; margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Valor Exacto</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="simpson-13-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="simpson-13-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>Valor Aproximado</th>
                                    <th>Valor Exacto</th>
                                    <th>Error Absoluto</th>
                                    <th>Error Relativo %</th>
                                    <th>Ganancia vs Trapecio</th>
                                </tr>
                            </thead>
                            <tbody id="simpson-13-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Comparación con Trapecio si hay datos previos -->
            <div class="conclusion-box" id="simpson-13-trapecio-comparacion" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; border-left: 4px solid #2c3e50;">
                <h4 style="margin-top: 0; color: #2c3e50;">
                    <i class="fas fa-balance-scale"></i> Comparación con Regla del Trapecio
                </h4>
                <div id="simpson-13-vs-trapecio">
                    <!-- Comparación se mostrará aquí si hay datos de trapecio -->
                </div>
            </div>
            
            <!-- Explicación del método -->
            <div class="conclusion-box" id="simpson-13-explicacion-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f3e8ff 0%, #e8d7ff 100%); border-radius: 8px; border-left: 4px solid #9b59b6;">
                <h4 style="margin-top: 0; color: #9b59b6;">
                    <i class="fas fa-lightbulb"></i> Teoría: Regla de Simpson 1/3
                </h4>
                <p><strong>Fórmula simple:</strong> ∫ₐᵇ f(x) dx ≈ (b-a)/6 * [f(a) + 4f((a+b)/2) + f(b)]</p>
                <p><strong>Compuesta:</strong> ∫ₐᵇ f(x) dx ≈ h/3 * [f(a) + f(b) + 4Σf(xᵢ) (impares) + 2Σf(xᵢ) (pares)]</p>
                <p><strong>Donde:</strong> h = (b-a)/n, n PAR</p>
                <p><strong>Error:</strong> E = - (b-a)⁵ * f⁽⁴⁾(ξ) / (180n⁴) para algún ξ ∈ [a,b]</p>
                <p><strong>Orden:</strong> O(h⁴) - duplicar n reduce error ~16 veces</p>
                <p><strong>Exacto para:</strong> Polinomios hasta grado 3</p>
            </div>
        </div>
    `;
    
    console.log('Simpson13.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemploSimpson13();
}

function inicializarSelectorEjemploSimpson13() {
    const ejemplos = [
        {
            nombre: "Función Cúbica",
            descripcion: "∫ x³ dx de 0 a 2 = 4 (exacto para Simpson)",
            funcion: "x^3",
            a: "0",
            b: "2",
            n: "4",
            valorExacto: "4",
            nota: "Simpson 1/3 es exacto para polinomios hasta grado 3"
        },
        {
            nombre: "Función Seno",
            descripcion: "∫ sin(x) dx de 0 a π ≈ 2",
            funcion: "sin(x)",
            a: "0",
            b: "3.14159",
            n: "10",
            valorExacto: "2",
            nota: "Alta precisión con pocos intervalos debido al orden O(h⁴)"
        },
        {
            nombre: "Función Cuadrática",
            descripcion: "∫ x² dx de 0 a 1 = 1/3 ≈ 0.333333",
            funcion: "x^2",
            a: "0",
            b: "1",
            n: "2",
            valorExacto: "0.333333",
            nota: "Simpson es exacto incluso con solo 2 intervalos"
        },
        {
            nombre: "Función Cuártica",
            descripcion: "∫ x⁴ dx de 0 a 1 = 0.2",
            funcion: "x^4",
            a: "0",
            b: "1",
            n: "8",
            valorExacto: "0.2",
            nota: "Excelente aproximación para polinomios de grado 4"
        },
        {
            nombre: "Función Oscilante",
            descripcion: "∫ sin(2x) dx de 0 a π = 0",
            funcion: "sin(2*x)",
            a: "0",
            b: "3.14159",
            n: "12",
            valorExacto: "0",
            nota: "Maneja bien funciones oscilantes"
        },
        {
            nombre: "Función Exponencial",
            descripcion: "∫ e^x dx de 0 to 1 = e - 1 ≈ 1.71828",
            funcion: "exp(x)",
            a: "0",
            b: "1",
            n: "6",
            valorExacto: "1.7182818",
            nota: "Excelente para funciones no polinómicas"
        }
    ];
    
    const selector = document.getElementById('simpson-13-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #9b59b6;">
            <h4 style="margin-bottom: 1rem; color: #9b59b6;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Regla de Simpson 1/3
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #9b59b6; margin-bottom: 0.5rem;">
                            <i class="fas fa-parabola"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-simpson13-ejemplo-btn" data-index="${index}" 
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
        document.querySelectorAll('.cargar-simpson13-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoSimpson13(ejemplos[index]);
            });
        });
    }, 100);
}

function asignarEventosSimpson13() {
    console.log('Simpson13.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('simpson-13-calc');
    const ejemploBtn = document.getElementById('simpson-13-ejemplo');
    const clearBtn = document.getElementById('simpson-13-clear');
    
    if (!calcBtn) {
        console.error('Simpson13.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularSimpson13);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemploSimpson13);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarSimpson13);
    }
    
    console.log('Simpson13.js: Eventos asignados correctamente');
}

function cargarEjemploInicialSimpson13() {
    const funcEl = document.getElementById('simpson-13-func');
    if (!funcEl || funcEl.value === '') {
        console.log('Simpson13.js: Cargando ejemplo inicial...');
        
        const ejemplo = {
            nombre: "Función Cúbica",
            descripcion: "∫ x³ dx de 0 a 2 = 4 (exacto para Simpson)",
            funcion: "x^3",
            a: "0",
            b: "2",
            n: "4",
            valorExacto: "4",
            nota: "Simpson 1/3 es exacto para polinomios hasta grado 3"
        };
        
        cargarEjemploEspecificoSimpson13(ejemplo);
    }
}

function cargarEjemploEspecificoSimpson13(ejemplo) {
    console.log(`Simpson13.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar valores
    document.getElementById('simpson-13-func').value = ejemplo.funcion;
    document.getElementById('simpson-13-a').value = ejemplo.a;
    document.getElementById('simpson-13-b').value = ejemplo.b;
    document.getElementById('simpson-13-n').value = ejemplo.n;
    
    // Asegurar que n sea par
    if (ejemplo.n % 2 !== 0) {
        document.getElementById('simpson-13-n').value = parseInt(ejemplo.n) + 1;
    }
    
    // Mostrar descripción del ejemplo
    let descripcion = document.getElementById('simpson-13-descripcion-ejemplo');
    if (!descripcion) {
        descripcion = document.createElement('div');
        descripcion.id = 'simpson-13-descripcion-ejemplo';
        const inputSection = document.querySelector('#simpson-13-content .input-group:first-child');
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
            <br><small><i class="fas fa-parabola"></i> <strong>Ventaja Simpson:</strong> Orden O(h⁴) - mucho más preciso que Trapecio (O(h²)).</small>
        </div>
    `;
    
    // Calcular automáticamente después de un breve delay
    setTimeout(() => {
        calcularSimpson13();
    }, 400);
}

function calcularSimpson13() {
    console.log('Simpson13.js: Calculando integral...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('simpson-13-func');
    const aEl = document.getElementById('simpson-13-a');
    const bEl = document.getElementById('simpson-13-b');
    const nEl = document.getElementById('simpson-13-n');
    
    if (!funcEl || !aEl || !bEl || !nEl) {
        showError('Error: Elementos de Simpson no encontrados. Recarga la página.');
        return;
    }
    
    const fStr = funcEl.value.trim();
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    let n = parseInt(nEl.value);
    
    // Validaciones
    if (!fStr) {
        showError('Debe ingresar una función', 'simpson-13-func');
        return;
    }
    
    if (isNaN(a)) {
        showError('El límite inferior debe ser un número válido', 'simpson-13-a');
        return;
    }
    
    if (isNaN(b)) {
        showError('El límite superior debe ser un número válido', 'simpson-13-b');
        return;
    }
    
    if (a >= b) {
        showError('El límite inferior debe ser menor que el superior', 'simpson-13-a');
        return;
    }
    
    if (isNaN(n) || n < 2) {
        showError('El número de intervalos debe ser ≥ 2', 'simpson-13-n');
        return;
    }
    
    if (n % 2 !== 0) {
        n++; // Asegurar que n sea par
        nEl.value = n;
        console.log('Ajustado n a:', n, 'para que sea par');
    }
    
    if (n > 1000) {
        showError('Número de intervalos muy alto. Use máximo 1000 para rendimiento.', 'simpson-13-n');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('simpson-13-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular integral usando Simpson 1/3 compuesta
            const resultado = calcularIntegralSimpson13(fStr, a, b, n);
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            // Obtener valor exacto si está disponible en el ejemplo
            const descripcion = document.getElementById('simpson-13-descripcion-ejemplo');
            let valorExacto = null;
            if (descripcion && descripcion.textContent.includes('Valor exacto:')) {
                const match = descripcion.textContent.match(/Valor exacto:\s*([\d.]+)/);
                if (match) {
                    valorExacto = parseFloat(match[1]);
                    resultado.valorExacto = valorExacto;
                    resultado.errorAbsoluto = Math.abs(resultado.integral - valorExacto);
                }
            }
            
            mostrarResultadosSimpson13(resultado, fStr, a, b, n, valorExacto);
            
            // Si hay resultados de trapecio, mostrar comparación
            if (window.trapecioResultados && window.trapecioResultados.integral) {
                mostrarComparacionConTrapecio(resultado, window.trapecioResultados);
            }
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('Simpson13.js error:', error);
        } finally {
            showLoading(document.getElementById('simpson-13-calc'), false);
        }
    }, 100);
}

function calcularIntegralSimpson13(fStr, a, b, n) {
    console.log(`Simpson13.js: Calculando ∫[${a}, ${b}] ${fStr} dx con n = ${n} (Simpson 1/3)`);
    
    const h = (b - a) / n;
    let sumOdd = 0;  // Suma de términos impares (peso 4)
    let sumEven = 0; // Suma de términos pares (peso 2)
    const segmentos = [];
    let areaAcumulada = 0;
    
    // Calcular valores en los extremos
    const fa = evaluateExpression(fStr, a);
    const fb = evaluateExpression(fStr, b);
    
    // Sumar términos impares (i = 1, 3, 5, ...)
    for (let i = 1; i < n; i += 2) {
        const xi = a + i * h;
        const fxi = evaluateExpression(fStr, xi);
        sumOdd += fxi;
    }
    
    // Sumar términos pares (i = 2, 4, 6, ...)
    for (let i = 2; i < n; i += 2) {
        const xi = a + i * h;
        const fxi = evaluateExpression(fStr, xi);
        sumEven += fxi;
    }
    
    // Calcular integral usando fórmula de Simpson 1/3
    const integral = (h / 3) * (fa + fb + 4 * sumOdd + 2 * sumEven);
    
    // Calcular segmentos individuales para la tabla
    for (let i = 0; i < n; i += 2) {
        const x0 = a + i * h;
        const x1 = a + (i + 1) * h;
        const x2 = a + (i + 2) * h;
        
        const f0 = evaluateExpression(fStr, x0);
        const f1 = evaluateExpression(fStr, x1);
        const f2 = evaluateExpression(fStr, x2);
        
        // Área de la parábola que pasa por (x0,f0), (x1,f1), (x2,f2)
        const areaSegmento = (h / 3) * (f0 + 4 * f1 + f2);
        areaAcumulada += areaSegmento;
        
        segmentos.push({
            segmento: i / 2 + 1,
            x0: x0,
            x1: x1,
            x2: x2,
            f0: f0,
            f1: f1,
            f2: f2,
            area: areaSegmento,
            areaAcumulada: areaAcumulada
        });
    }
    
    // Estimar error usando fórmula teórica (simplificada)
    const errorEstimado = estimarErrorSimpson13(fStr, a, b, n, h);
    
    return {
        integral: integral,
        h: h,
        n: n,
        fa: fa,
        fb: fb,
        sumOdd: sumOdd,
        sumEven: sumEven,
        segmentos: segmentos,
        errorEstimado: errorEstimado,
        areaAcumulada: areaAcumulada
    };
}

function estimarErrorSimpson13(fStr, a, b, n, h) {
    // Estimación simplificada del error usando diferencia entre n y n/2
    if (n >= 4) {
        try {
            // Calcular con n/2 intervalos (asegurando que sea par)
            const n2 = Math.max(2, Math.floor(n / 2));
            const n2Par = n2 % 2 === 0 ? n2 : n2 + 1;
            
            const resultadoN2 = calcularIntegralSimpson13(fStr, a, b, n2Par);
            const resultadoN = calcularIntegralSimpson13(fStr, a, b, n);
            
            // Error estimado usando extrapolación de Richardson para Simpson (orden 4)
            const errorEstimado = Math.abs(resultadoN.integral - resultadoN2.integral) / 15;
            return errorEstimado;
        } catch (e) {
            console.warn('No se pudo estimar error:', e.message);
            return null;
        }
    }
    return null;
}

function mostrarResultadosSimpson13(resultado, fStr, a, b, n, valorExacto) {
    console.log('Simpson13.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.simpson13Resultados = resultado;
    
    // Mostrar valor de la integral
    document.getElementById('simpson-13-resultado').textContent = formatNumber(resultado.integral, 8);
    
    // Mostrar tiempo de cálculo
    document.getElementById('simpson-13-tiempo').textContent = formatNumber(resultado.tiempo, 2) + ' ms';
    
    // Mostrar información de precisión
    const precisionHtml = `
        <div><strong>Ancho de intervalo h:</strong> ${formatNumber(resultado.h, 6)}</div>
        <div><strong>Número de segmentos:</strong> ${n/2} (n = ${n})</div>
        <div><strong>Suma impar (peso 4):</strong> ${formatNumber(resultado.sumOdd, 6)}</div>
        <div><strong>Suma par (peso 2):</strong> ${formatNumber(resultado.sumEven, 6)}</div>
        <div><strong>Fórmula:</strong> (${formatNumber(resultado.h, 4)}/3) × [${formatNumber(resultado.fa, 4)} + ${formatNumber(resultado.fb, 4)} + 4×${formatNumber(resultado.sumOdd, 4)} + 2×${formatNumber(resultado.sumEven, 4)}]</div>
    `;
    document.getElementById('simpson-13-precision').innerHTML = precisionHtml;
    
    // Mostrar error
    let errorHtml = '';
    if (resultado.errorEstimado !== null) {
        errorHtml = `<span style="color: #27ae60;">${formatNumber(resultado.errorEstimado, 8)}</span>`;
    } else if (valorExacto !== null) {
        errorHtml = `
            <span style="color: #27ae60;">${formatNumber(resultado.errorAbsoluto, 8)}</span><br>
            <small style="color: #666;">Error relativo: ${formatNumber((resultado.errorAbsoluto/Math.abs(valorExacto))*100, 4)}%</small>
        `;
    } else {
        errorHtml = 'No disponible';
    }
    document.getElementById('simpson-13-error').innerHTML = errorHtml;
    
    // Actualizar barra de precisión
    const precisionBar = document.getElementById('simpson-13-precision-bar');
    const precisionText = document.getElementById('simpson-13-precision-text');
    const precisionValue = 90 + Math.min(10, Math.log10(1/(resultado.errorEstimado || 1e-6)));
    precisionBar.style.width = `${Math.min(100, precisionValue)}%`;
    precisionText.textContent = 'O(h⁴)';
    
    // Actualizar tabla de segmentos
    actualizarTablaSimpson13(resultado.segmentos);
    
    // Crear gráfico
    crearGraficoSimpson13(fStr, a, b, n, resultado, valorExacto);
    
    // Mostrar comparación si hay valor exacto
    if (valorExacto !== null) {
        document.getElementById('simpson-13-comparacion-section').style.display = 'block';
        mostrarComparacionSimpson13(resultado, valorExacto);
    } else {
        document.getElementById('simpson-13-comparacion-section').style.display = 'none';
    }
}

function actualizarTablaSimpson13(segmentos) {
    const tbody = document.getElementById('simpson-13-table-body');
    tbody.innerHTML = '';
    
    segmentos.forEach((seg, index) => {
        const row = document.createElement('tr');
        
        // Resaltar segmentos con área significativa
        let bgColor = '';
        if (seg.area > seg.areaAcumulada / segmentos.length * 2) {
            bgColor = 'background-color: rgba(155, 89, 182, 0.1);';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #9b59b6; ${bgColor}">${seg.segmento}</td>
            <td>${formatNumber(seg.x0, 4)}</td>
            <td>${formatNumber(seg.x2, 4)}</td>
            <td>${formatNumber(seg.f0, 6)}</td>
            <td style="font-weight: bold; color: #e74c3c;">${formatNumber(seg.f1, 6)}</td>
            <td>${formatNumber(seg.f2, 6)}</td>
            <td style="font-weight: bold; color: #2ecc71;">${formatNumber(seg.area, 6)}</td>
            <td>${formatNumber(seg.areaAcumulada, 6)}</td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoSimpson13(fStr, a, b, n, resultado, valorExacto) {
    const datasets = [];
    const mostrarParabolas = document.getElementById('simpson-13-mostrar-parabolas').checked;
    const mostrarFunc = document.getElementById('simpson-13-mostrar-func').checked;
    const h = resultado.h;
    
    // 1. Función original
    if (mostrarFunc) {
        const numPuntosGrafico = 200;
        const puntosFuncion = [];
        
        for (let i = 0; i <= numPuntosGrafico; i++) {
            const x = a + (b - a) * (i / numPuntosGrafico);
            try {
                const y = evaluateExpression(fStr, x);
                puntosFuncion.push({ x: x, y: y });
            } catch (error) {
                console.warn('Error evaluando función:', error);
            }
        }
        
        datasets.push({
            label: `f(x) = ${fStr}`,
            data: puntosFuncion,
            borderColor: '#3498db',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 3
        });
    }
    
    // 2. Parábolas de aproximación
    if (mostrarParabolas && n <= 20) { // Limitar para n grandes por rendimiento
        const colores = ['#9b59b6', '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c'];
        
        for (let i = 0; i < Math.min(n/2, 3); i++) { // Mostrar solo primeros 3 segmentos
            const x0 = a + i * 2 * h;
            const x1 = x0 + h;
            const x2 = x0 + 2 * h;
            
            try {
                const f0 = evaluateExpression(fStr, x0);
                const f1 = evaluateExpression(fStr, x1);
                const f2 = evaluateExpression(fStr, x2);
                
                // Generar puntos para la parábola
                const puntosParabola = [];
                const numPuntosParabola = 20;
                for (let j = 0; j <= numPuntosParabola; j++) {
                    const t = j / numPuntosParabola;
                    const x = x0 + (x2 - x0) * t;
                    
                    // Interpolación cuadrática de Lagrange
                    const L0 = ((x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2));
                    const L1 = ((x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2));
                    const L2 = ((x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1));
                    
                    const y = f0 * L0 + f1 * L1 + f2 * L2;
                    puntosParabola.push({ x: x, y: y });
                }
                
                datasets.push({
                    label: `Segmento ${i+1}`,
                    data: puntosParabola,
                    borderColor: colores[i % colores.length],
                    backgroundColor: colores[i % colores.length] + '20',
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2
                });
            } catch (error) {
                console.warn(`Error dibujando parábola ${i+1}:`, error);
            }
        }
    }
    
    // 3. Puntos de evaluación
    if (n <= 30) { // Limitar para n grandes
        const puntosEvaluacion = [];
        const coloresPuntos = [];
        
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            try {
                const y = evaluateExpression(fStr, x);
                puntosEvaluacion.push({ x: x, y: y });
                
                // Colores diferentes para puntos con pesos diferentes
                if (i === 0 || i === n) {
                    coloresPuntos.push('#2c3e50'); // Extremos
                } else if (i % 2 === 1) {
                    coloresPuntos.push('#e74c3c'); // Impares (peso 4)
                } else {
                    coloresPuntos.push('#2ecc71'); // Pares (peso 2)
                }
            } catch (error) {
                console.warn('Error evaluando punto:', error);
            }
        }
        
        datasets.push({
            label: 'Puntos de evaluación',
            data: puntosEvaluacion,
            borderColor: coloresPuntos,
            backgroundColor: coloresPuntos,
            fill: false,
            showLine: false,
            pointRadius: 6,
            pointStyle: 'circle'
        });
    }
    
    // 4. Área aproximada total
    const alturaMedia = resultado.integral / (b - a);
    datasets.push({
        label: `Área Simpson: ${formatNumber(resultado.integral, 4)}`,
        data: [
            { x: a, y: 0 },
            { x: a, y: alturaMedia },
            { x: b, y: alturaMedia },
            { x: b, y: 0 }
        ],
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
        fill: true,
        tension: 0,
        pointRadius: 0,
        borderWidth: 3,
        borderDash: [5, 5]
    });
    
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
                            label += `y = ${formatNumber(context.parsed.y, 4)}`;
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
                    text: 'f(x)',
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
    
    createChart('simpson-13-chart', data, options);
}

function mostrarComparacionSimpson13(resultado, valorExacto) {
    const tbody = document.getElementById('simpson-13-comparacion-body');
    tbody.innerHTML = '';
    
    const errorAbsoluto = Math.abs(resultado.integral - valorExacto);
    const errorRelativo = (errorAbsoluto / Math.abs(valorExacto)) * 100;
    
    // Calcular qué tan bueno es el resultado
    let calidad = '';
    let colorCalidad = '';
    if (errorRelativo < 0.1) {
        calidad = 'Excelente';
        colorCalidad = '#27ae60';
    } else if (errorRelativo < 1) {
        calidad = 'Muy buena';
        colorCalidad = '#2ecc71';
    } else if (errorRelativo < 5) {
        calidad = 'Buena';
        colorCalidad = '#f39c12';
    } else {
        calidad = 'Regular';
        colorCalidad = '#e74c3c';
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td style="font-weight: bold; color: #9b59b6;">
            <i class="fas fa-parabola"></i> Simpson 1/3 (n=${resultado.n})
        </td>
        <td style="font-family: monospace;">${formatNumber(resultado.integral, 8)}</td>
        <td style="font-family: monospace;">${formatNumber(valorExacto, 8)}</td>
        <td style="color: ${errorAbsoluto > 0.01 ? '#e74c3c' : '#27ae60'};">
            ${formatNumber(errorAbsoluto, 8)}
        </td>
        <td>${formatNumber(errorRelativo, 4)}%</td>
        <td style="color: ${colorCalidad}; font-weight: bold;">
            ${calidad}
        </td>
    `;
    tbody.appendChild(row);
}

function mostrarComparacionConTrapecio(resultadoSimpson, resultadoTrapecio) {
    const comparacionDiv = document.getElementById('simpson-13-vs-trapecio');
    
    if (!resultadoTrapecio || !resultadoSimpson) return;
    
    const mejora = Math.abs(resultadoTrapecio.errorAbsoluto || resultadoTrapecio.errorEstimado || 1) / 
                   Math.abs(resultadoSimpson.errorAbsoluto || resultadoSimpson.errorEstimado || 1);
    
    let textoMejora = '';
    if (mejora > 10) {
        textoMejora = `<span style="color: #27ae60; font-weight: bold;">${formatNumber(mejora, 1)} veces más preciso</span>`;
    } else if (mejora > 2) {
        textoMejora = `<span style="color: #2ecc71; font-weight: bold;">${formatNumber(mejora, 1)} veces más preciso</span>`;
    } else {
        textoMejora = `<span style="color: #f39c12;">Similar precisión</span>`;
    }
    
    comparacionDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
            <div style="background: #e8f4fc; padding: 1rem; border-radius: 6px; border-left: 3px solid #3498db;">
                <h5 style="color: #3498db; margin: 0 0 0.5rem 0;">Trapecio</h5>
                <div style="font-size: 0.9rem;">
                    Valor: <strong>${formatNumber(resultadoTrapecio.integral, 6)}</strong><br>
                    Error: <strong>${formatNumber(resultadoTrapecio.errorAbsoluto || resultadoTrapecio.errorEstimado || 'N/A', 6)}</strong><br>
                    Orden: O(h²)
                </div>
            </div>
            <div style="background: #f3e8ff; padding: 1rem; border-radius: 6px; border-left: 3px solid #9b59b6;">
                <h5 style="color: #9b59b6; margin: 0 0 0.5rem 0;">Simpson 1/3</h5>
                <div style="font-size: 0.9rem;">
                    Valor: <strong>${formatNumber(resultadoSimpson.integral, 6)}</strong><br>
                    Error: <strong>${formatNumber(resultadoSimpson.errorAbsoluto || resultadoSimpson.errorEstimado || 'N/A', 6)}</strong><br>
                    Orden: O(h⁴)
                </div>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: #f8f9fa; border-radius: 6px;">
            <strong>Conclusión:</strong> Simpson 1/3 es ${textoMejora} que Trapecio para el mismo número de intervalos.
            <br><small>Teóricamente, Simpson debería ser ~(b-a)²/(3h²) veces más preciso para funciones suaves.</small>
        </div>
    `;
}

function mostrarMasEjemploSimpson13() {
    const ejemplosExtras = [
        {
            nombre: "Función de Runge",
            descripcion: "∫ 1/(1+25x²) dx de -1 a 1 ≈ 0.5493",
            funcion: "1/(1+25*x^2)",
            a: "-1",
            b: "1",
            n: "20",
            valorExacto: "0.549306",
            nota: "Simpson maneja mejor funciones difíciles que Trapecio"
        },
        {
            nombre: "Función Logarítmica",
            descripcion: "∫ ln(x+1) dx de 0 a 2 ≈ 1.2958",
            funcion: "log(x+1)",
            a: "0",
            b: "2",
            n: "8",
            valorExacto: "1.295836",
            nota: "Buena aproximación para funciones no polinómicas"
        },
        {
            nombre: "Máxima Precisión",
            descripcion: "∫ sin(x)/x dx de 0.01 a 1 (función sinc)",
            funcion: "sin(x)/x",
            a: "0.01",
            b: "1",
            n: "50",
            valorExacto: "0.946083",
            nota: "Requiere muchos intervalos cerca de singularidad en 0"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="simpson13-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Más Ejemplos de Integración</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #9b59b6; margin-bottom: 0.5rem;">
                                    <i class="fas fa-parabola"></i> ${ejemplo.nombre}
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
                                <button class="cargar-simpson13-ejemplo-ext-btn" data-index="${index}" 
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
    const modalExistente = document.getElementById('simpson13-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('simpson13-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-simpson13-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoSimpson13(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarSimpson13() {
    console.log('Simpson13.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('simpson-13-func').value = '';
    document.getElementById('simpson-13-a').value = '0';
    document.getElementById('simpson-13-b').value = '1';
    document.getElementById('simpson-13-n').value = '10';
    document.getElementById('simpson-13-mostrar-parabolas').checked = true;
    document.getElementById('simpson-13-mostrar-func').checked = true;
    
    // Limpiar resultados
    document.getElementById('simpson-13-resultado').textContent = '-';
    document.getElementById('simpson-13-tiempo').textContent = '-';
    document.getElementById('simpson-13-error').textContent = '-';
    document.getElementById('simpson-13-precision').innerHTML = '';
    document.getElementById('simpson-13-table-body').innerHTML = '';
    document.getElementById('simpson-13-comparacion-body').innerHTML = '';
    document.getElementById('simpson-13-vs-trapecio').innerHTML = '';
    
    // Restablecer barra de precisión
    document.getElementById('simpson-13-precision-bar').style.width = '90%';
    document.getElementById('simpson-13-precision-text').textContent = 'O(h⁴)';
    
    // Ocultar secciones
    document.getElementById('simpson-13-comparacion-section').style.display = 'none';
    document.getElementById('simpson-13-trapecio-comparacion').style.display = 'none';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('simpson-13-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['simpson-13-chart', 'simpson-13-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('simpson-13-chart').getContext('2d');
    const emptyChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Ingresa función y límites, luego haz clic en Calcular',
                data: [],
                borderColor: 'rgba(200, 200, 200, 0.5)',
                borderWidth: 1,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'x' } },
                y: { title: { display: true, text: 'f(x)' } }
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
    window.charts['simpson-13-chart'] = emptyChart;
    
    console.log('Simpson13.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaSimpson13() {
    console.log("=== PRUEBA DE REGLA DE SIMPSON 1/3 ===");
    
    try {
        const fStr = "x^3";
        const a = 0;
        const b = 2;
        const n = 4;
        
        const resultado = calcularIntegralSimpson13(fStr, a, b, n);
        
        console.log(`∫[${a}, ${b}] ${fStr} dx con n = ${n} (Simpson 1/3)`);
        console.log("Valor aproximado:", resultado.integral);
        console.log("Valor exacto:", 4);
        console.log("Error absoluto:", Math.abs(resultado.integral - 4));
        console.log("Ancho de intervalo h:", resultado.h);
        console.log("\nSegmentos:");
        resultado.segmentos.forEach(seg => {
            console.log(`  Segmento ${seg.segmento}: [${formatNumber(seg.x0, 2)}, ${formatNumber(seg.x2, 2)}]`);
            console.log(`    f0 = ${formatNumber(seg.f0, 4)}, f1 = ${formatNumber(seg.f1, 4)}, f2 = ${formatNumber(seg.f2, 4)}`);
            console.log(`    Área = ${formatNumber(seg.area, 6)}`);
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaSimpson13);