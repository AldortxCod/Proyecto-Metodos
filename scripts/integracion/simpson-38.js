/**
 * simpson-38.js - Regla de Simpson 3/8
 * Implementa integración numérica usando la regla de Simpson 3/8 simple y compuesta
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simpson38.js: Cargado');
    
    // Escuchar cuando la sección de integración se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'integracion') {
            console.log('Simpson38.js: Sección Integración activada');
            setTimeout(inicializarSimpson38, 300);
        }
    });
    
    // Escuchar cuando se seleccione Simpson 3/8
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'simpson-38') {
            console.log('Simpson38.js: Método Simpson 3/8 seleccionado');
            setTimeout(inicializarSimpson38, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarSimpson38Visibilidad, 1000);
});

function verificarSimpson38Visibilidad() {
    const simpson38Content = document.getElementById('simpson-38-content');
    if (simpson38Content && !simpson38Content.classList.contains('hidden')) {
        console.log('Simpson38.js: Ya visible al cargar');
        inicializarSimpson38();
    }
}

function inicializarSimpson38() {
    console.log('Simpson38.js: Inicializando...');
    
    const simpson38Content = document.getElementById('simpson-38-content');
    if (!simpson38Content) {
        console.error('Simpson38.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.simpson38Initialized) {
        console.log('Simpson38.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (simpson38Content.innerHTML.trim() === '' || !document.getElementById('simpson-38-func')) {
        console.log('Simpson38.js: Creando interfaz...');
        crearInterfazSimpson38();
    }
    
    // Asignar eventos
    asignarEventosSimpson38();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialSimpson38();
    
    // Marcar como inicializado
    window.simpson38Initialized = true;
    console.log('Simpson38.js: Inicialización completada');
}

function crearInterfazSimpson38() {
    const content = document.getElementById('simpson-38-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-chart-area"></i> Regla de Simpson 3/8</h3>
            <p>Integración numérica por aproximación cúbica</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="simpson-38-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="simpson-38-func"><i class="fas fa-function"></i> Función f(x)</label>
                <input type="text" id="simpson-38-func" value="sin(x)" placeholder="ej: x^4">
                <small>Función a integrar (usa sintaxis JavaScript)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="simpson-38-a"><i class="fas fa-play"></i> Límite inferior a</label>
                    <input type="number" id="simpson-38-a" value="0" step="0.1">
                    <small>Inicio del intervalo de integración</small>
                </div>
                <div class="input-group">
                    <label for="simpson-38-b"><i class="fas fa-stop"></i> Límite superior b</label>
                    <input type="number" id="simpson-38-b" value="3.14159" step="0.1">
                    <small>Fin del intervalo de integración</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="simpson-38-n"><i class="fas fa-sliders-h"></i> Número de intervalos n</label>
                <input type="number" id="simpson-38-n" value="9" min="3" max="999" step="3">
                <small>Debe ser MÚLTIPLO de 3 (3, 6, 9, 12...)</small>
            </div>
            
            <div class="input-group">
                <label><i class="fas fa-eye"></i> Visualización</label>
                <div class="checkbox-group" style="display: flex; gap: 20px; margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="simpson-38-mostrar-cubicas" checked style="transform: scale(1.2);">
                        <span style="color: #e74c3c; font-weight: bold;">
                            Mostrar cúbicas
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="simpson-38-mostrar-func" checked style="transform: scale(1.2);">
                        <span style="color: #3498db; font-weight: bold;">
                            Mostrar función
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="simpson-38-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular Integral</button>
                <button id="simpson-38-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="simpson-38-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="simpson-38-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-area"></i> Resultados de Integración</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor de la integral:</h4>
                    <p id="simpson-38-resultado" style="font-size: 1.5rem; font-weight: bold; color: #e74c3c;">-</p>
                    
                    <h4><i class="fas fa-ruler"></i> Precisión:</h4>
                    <div id="simpson-38-precision" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                        <!-- Información de precisión se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="simpson-38-tiempo">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-sliders-h"></i> Error estimado:</h4>
                            <p id="simpson-38-error">-</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem;">
                        <h4><i class="fas fa-chart-line"></i> Comparación de métodos:</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;">
                            <div style="text-align: center; padding: 0.5rem; background: #e8f4fc; border-radius: 4px;">
                                <div style="font-size: 0.8rem; color: #666;">Trapecio</div>
                                <div style="font-weight: bold; color: #3498db;">O(h²)</div>
                            </div>
                            <div style="text-align: center; padding: 0.5rem; background: #f3e8ff; border-radius: 4px;">
                                <div style="font-size: 0.8rem; color: #666;">Simpson 1/3</div>
                                <div style="font-weight: bold; color: #9b59b6;">O(h⁴)</div>
                            </div>
                            <div style="text-align: center; padding: 0.5rem; background: #fdedec; border-radius: 4px;">
                                <div style="font-size: 0.8rem; color: #666;">Simpson 3/8</div>
                                <div style="font-weight: bold; color: #e74c3c;">O(h⁴)</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="simpson-38-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Desglose por Segmentos (cada 3 intervalos)</h4>
                <div class="table-container">
                    <table id="simpson-38-table">
                        <thead>
                            <tr>
                                <th>Segmento</th>
                                <th>Intervalos</th>
                                <th>f(xᵢ)</th>
                                <th>f(xᵢ₊₁)</th>
                                <th>f(xᵢ₊₂)</th>
                                <th>f(xᵢ₊₃)</th>
                                <th>Área cúbica</th>
                                <th>Área acumulada</th>
                            </tr>
                        </thead>
                        <tbody id="simpson-38-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con otros métodos -->
            <div class="comparison-section" id="simpson-38-comparacion-section" style="margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Otros Métodos</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="simpson-38-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="simpson-38-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>Valor</th>
                                    <th>Error</th>
                                    <th>Intervalos</th>
                                    <th>Orden</th>
                                    <th>Recomendación</th>
                                </tr>
                            </thead>
                            <tbody id="simpson-38-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Explicación del método -->
            <div class="conclusion-box" id="simpson-38-explicacion-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #fdedec 0%, #fadbd8 100%); border-radius: 8px; border-left: 4px solid #e74c3c;">
                <h4 style="margin-top: 0; color: #e74c3c;">
                    <i class="fas fa-lightbulb"></i> Teoría: Regla de Simpson 3/8
                </h4>
                <p><strong>Fórmula simple:</strong> ∫ₐᵇ f(x) dx ≈ (b-a)/8 * [f(a) + 3f(a+h) + 3f(a+2h) + f(b)]</p>
                <p><strong>Compuesta:</strong> ∫ₐᵇ f(x) dx ≈ 3h/8 * [f(a) + f(b) + 3Σ₁ f(xᵢ) + 3Σ₂ f(xᵢ) + 2Σ₃ f(xᵢ)]</p>
                <p><strong>Donde:</strong> h = (b-a)/n, n múltiplo de 3</p>
                <p><strong>Error:</strong> E = - (b-a)⁵ * f⁽⁴⁾(ξ) / (80n⁴) para algún ξ ∈ [a,b]</p>
                <p><strong>Orden:</strong> O(h⁴) - mismo orden que Simpson 1/3, diferente constante de error</p>
                <p><strong>Exacto para:</strong> Polinomios hasta grado 3 (como Simpson 1/3)</p>
                <p><strong>Ventaja:</strong> Útil cuando número de intervalos es múltiplo de 3</p>
            </div>
        </div>
    `;
    
    console.log('Simpson38.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemploSimpson38();
}

function inicializarSelectorEjemploSimpson38() {
    const ejemplos = [
        {
            nombre: "Función Cuártica",
            descripcion: "∫ x⁴ dx de 0 a 1 = 0.2 (mejor que Simpson 1/3)",
            funcion: "x^4",
            a: "0",
            b: "1",
            n: "6",
            valorExacto: "0.2",
            nota: "Simpson 3/8 suele dar mejor precisión para funciones de grado 4"
        },
        {
            nombre: "Función Seno",
            descripcion: "∫ sin(x) dx de 0 a π ≈ 2",
            funcion: "sin(x)",
            a: "0",
            b: "3.14159",
            n: "9",
            valorExacto: "2",
            nota: "Comparable a Simpson 1/3, pero requiere múltiplos de 3"
        },
        {
            nombre: "Polinomio de Grado 5",
            descripcion: "∫ x⁵ dx de 0 a 1 = 1/6 ≈ 0.166667",
            funcion: "x^5",
            a: "0",
            b: "1",
            n: "9",
            valorExacto: "0.166667",
            nota: "Ambos Simpsons tienen error similar para grado > 3"
        },
        {
            nombre: "Función Exponencial",
            descripcion: "∫ e^(-x²) dx de 0 a 2 (función de error)",
            funcion: "exp(-x*x)",
            a: "0",
            b: "2",
            n: "12",
            valorExacto: "0.882081",
            nota: "Función gaussiana - requiere muchos intervalos"
        },
        {
            nombre: "Función Oscilante",
            descripcion: "∫ sin(3x)cos(2x) dx de 0 a π = 0",
            funcion: "sin(3*x)*cos(2*x)",
            a: "0",
            b: "3.14159",
            n: "15",
            valorExacto: "0",
            nota: "Producto trigonométrico con ceros periódicos"
        },
        {
            nombre: "Función Racional",
            descripcion: "∫ 1/(1+x²) dx de 0 a 1 = π/4 ≈ 0.785398",
            funcion: "1/(1+x*x)",
            a: "0",
            b: "1",
            n: "9",
            valorExacto: "0.785398",
            nota: "Comparación directa con Simpson 1/3"
        }
    ];
    
    const selector = document.getElementById('simpson-38-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
            <h4 style="margin-bottom: 1rem; color: #e74c3c;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Regla de Simpson 3/8
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #e74c3c; margin-bottom: 0.5rem;">
                            <i class="fas fa-cube"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-simpson38-ejemplo-btn" data-index="${index}" 
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
        document.querySelectorAll('.cargar-simpson38-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoSimpson38(ejemplos[index]);
            });
        });
    }, 100);
}

function asignarEventosSimpson38() {
    console.log('Simpson38.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('simpson-38-calc');
    const ejemploBtn = document.getElementById('simpson-38-ejemplo');
    const clearBtn = document.getElementById('simpson-38-clear');
    
    if (!calcBtn) {
        console.error('Simpson38.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularSimpson38);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemploSimpson38);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarSimpson38);
    }
    
    console.log('Simpson38.js: Eventos asignados correctamente');
}

function cargarEjemploInicialSimpson38() {
    const funcEl = document.getElementById('simpson-38-func');
    if (!funcEl || funcEl.value === '') {
        console.log('Simpson38.js: Cargando ejemplo inicial...');
        
        const ejemplo = {
            nombre: "Función Cuártica",
            descripcion: "∫ x⁴ dx de 0 a 1 = 0.2 (mejor que Simpson 1/3)",
            funcion: "x^4",
            a: "0",
            b: "1",
            n: "6",
            valorExacto: "0.2",
            nota: "Simpson 3/8 suele dar mejor precisión para funciones de grado 4"
        };
        
        cargarEjemploEspecificoSimpson38(ejemplo);
    }
}

function cargarEjemploEspecificoSimpson38(ejemplo) {
    console.log(`Simpson38.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar valores
    document.getElementById('simpson-38-func').value = ejemplo.funcion;
    document.getElementById('simpson-38-a').value = ejemplo.a;
    document.getElementById('simpson-38-b').value = ejemplo.b;
    document.getElementById('simpson-38-n').value = ejemplo.n;
    
    // Asegurar que n sea múltiplo de 3
    if (ejemplo.n % 3 !== 0) {
        const nAjustado = Math.ceil(ejemplo.n / 3) * 3;
        document.getElementById('simpson-38-n').value = nAjustado;
    }
    
    // Mostrar descripción del ejemplo
    let descripcion = document.getElementById('simpson-38-descripcion-ejemplo');
    if (!descripcion) {
        descripcion = document.createElement('div');
        descripcion.id = 'simpson-38-descripcion-ejemplo';
        const inputSection = document.querySelector('#simpson-38-content .input-group:first-child');
        if (inputSection) {
            inputSection.parentNode.insertBefore(descripcion, inputSection.nextSibling);
        }
    }
    
    descripcion.innerHTML = `
        <div style="padding: 1rem; background: #fdedec; border-radius: 6px; border-left: 4px solid #e74c3c;">
            <strong style="color: #c0392b;">
                <i class="fas fa-info-circle"></i> Ejemplo práctico:
            </strong> ${ejemplo.descripcion}
            ${ejemplo.nota ? `<br><small><i class="fas fa-lightbulb"></i> ${ejemplo.nota}</small>` : ''}
            <br><small><i class="fas fa-cube"></i> <strong>Ventaja Simpson 3/8:</strong> Mismo orden O(h⁴) que Simpson 1/3, pero a veces más preciso.</small>
        </div>
    `;
    
    // Calcular automáticamente después de un breve delay
    setTimeout(() => {
        calcularSimpson38();
    }, 400);
}

function calcularSimpson38() {
    console.log('Simpson38.js: Calculando integral...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('simpson-38-func');
    const aEl = document.getElementById('simpson-38-a');
    const bEl = document.getElementById('simpson-38-b');
    const nEl = document.getElementById('simpson-38-n');
    
    if (!funcEl || !aEl || !bEl || !nEl) {
        showError('Error: Elementos de Simpson 3/8 no encontrados. Recarga la página.');
        return;
    }
    
    const fStr = funcEl.value.trim();
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    let n = parseInt(nEl.value);
    
    // Validaciones
    if (!fStr) {
        showError('Debe ingresar una función', 'simpson-38-func');
        return;
    }
    
    if (isNaN(a)) {
        showError('El límite inferior debe ser un número válido', 'simpson-38-a');
        return;
    }
    
    if (isNaN(b)) {
        showError('El límite superior debe ser un número válido', 'simpson-38-b');
        return;
    }
    
    if (a >= b) {
        showError('El límite inferior debe ser menor que el superior', 'simpson-38-a');
        return;
    }
    
    if (isNaN(n) || n < 3) {
        showError('El número de intervalos debe ser ≥ 3', 'simpson-38-n');
        return;
    }
    
    if (n % 3 !== 0) {
        n = Math.ceil(n / 3) * 3; // Ajustar al siguiente múltiplo de 3
        nEl.value = n;
        console.log('Ajustado n a:', n, 'para que sea múltiplo de 3');
    }
    
    if (n > 999) {
        showError('Número de intervalos muy alto. Use máximo 999 para rendimiento.', 'simpson-38-n');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('simpson-38-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular integral usando Simpson 3/8 compuesta
            const resultado = calcularIntegralSimpson38(fStr, a, b, n);
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            // Obtener valor exacto si está disponible en el ejemplo
            const descripcion = document.getElementById('simpson-38-descripcion-ejemplo');
            let valorExacto = null;
            if (descripcion && descripcion.textContent.includes('Valor exacto:')) {
                const match = descripcion.textContent.match(/Valor exacto:\s*([\d.]+)/);
                if (match) {
                    valorExacto = parseFloat(match[1]);
                    resultado.valorExacto = valorExacto;
                    resultado.errorAbsoluto = Math.abs(resultado.integral - valorExacto);
                }
            }
            
            mostrarResultadosSimpson38(resultado, fStr, a, b, n, valorExacto);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('Simpson38.js error:', error);
        } finally {
            showLoading(document.getElementById('simpson-38-calc'), false);
        }
    }, 100);
}

function calcularIntegralSimpson38(fStr, a, b, n) {
    console.log(`Simpson38.js: Calculando ∫[${a}, ${b}] ${fStr} dx con n = ${n} (Simpson 3/8)`);
    
    const h = (b - a) / n;
    let sum3_nonmultiples = 0;  // Suma de términos NO múltiplos de 3 (peso 3)
    let sum3_multiples = 0;     // Suma de términos múltiplos de 3 (peso 2)
    const segmentos = [];
    let areaAcumulada = 0;
    
    // Calcular valores en los extremos
    const fa = evaluateExpression(fStr, a);
    const fb = evaluateExpression(fStr, b);
    
    // Calcular sumas ponderadas
    for (let i = 1; i < n; i++) {
        const xi = a + i * h;
        const fxi = evaluateExpression(fStr, xi);
        
        if (i % 3 === 0) {
            sum3_multiples += fxi;  // Términos múltiplos de 3: peso 2
        } else {
            sum3_nonmultiples += fxi; // Otros términos: peso 3
        }
    }
    
    // Calcular integral usando fórmula de Simpson 3/8
    const integral = (3 * h / 8) * (fa + fb + 3 * sum3_nonmultiples + 2 * sum3_multiples);
    
    // Calcular segmentos individuales (cada 3 intervalos)
    for (let i = 0; i < n; i += 3) {
        const x0 = a + i * h;
        const x1 = a + (i + 1) * h;
        const x2 = a + (i + 2) * h;
        const x3 = a + (i + 3) * h;
        
        const f0 = evaluateExpression(fStr, x0);
        const f1 = evaluateExpression(fStr, x1);
        const f2 = evaluateExpression(fStr, x2);
        const f3 = evaluateExpression(fStr, x3);
        
        // Área de la cúbica que pasa por los 4 puntos
        const areaSegmento = (3 * h / 8) * (f0 + 3 * f1 + 3 * f2 + f3);
        areaAcumulada += areaSegmento;
        
        segmentos.push({
            segmento: i / 3 + 1,
            intervalo: `[${formatNumber(x0, 2)}, ${formatNumber(x3, 2)}]`,
            x0: x0,
            x1: x1,
            x2: x2,
            x3: x3,
            f0: f0,
            f1: f1,
            f2: f2,
            f3: f3,
            area: areaSegmento,
            areaAcumulada: areaAcumulada
        });
    }
    
    // Estimar error
    const errorEstimado = estimarErrorSimpson38(fStr, a, b, n, h);
    
    return {
        integral: integral,
        h: h,
        n: n,
        fa: fa,
        fb: fb,
        sum3_nonmultiples: sum3_nonmultiples,
        sum3_multiples: sum3_multiples,
        segmentos: segmentos,
        errorEstimado: errorEstimado,
        areaAcumulada: areaAcumulada
    };
}

function estimarErrorSimpson38(fStr, a, b, n, h) {
    // Estimación simplificada del error
    if (n >= 6) {
        try {
            // Calcular con n/3 intervalos (asegurando que sea múltiplo de 3)
            const n3 = Math.max(3, Math.floor(n / 3));
            const n3_multiplo = Math.ceil(n3 / 3) * 3;
            
            const resultadoN3 = calcularIntegralSimpson38(fStr, a, b, n3_multiplo);
            const resultadoN = calcularIntegralSimpson38(fStr, a, b, n);
            
            // Error estimado usando extrapolación
            const errorEstimado = Math.abs(resultadoN.integral - resultadoN3.integral) / (Math.pow(n/n3_multiplo, 4) - 1);
            return errorEstimado;
        } catch (e) {
            console.warn('No se pudo estimar error:', e.message);
            return null;
        }
    }
    return null;
}

function mostrarResultadosSimpson38(resultado, fStr, a, b, n, valorExacto) {
    console.log('Simpson38.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.simpson38Resultados = resultado;
    
    // Mostrar valor de la integral
    document.getElementById('simpson-38-resultado').textContent = formatNumber(resultado.integral, 8);
    
    // Mostrar tiempo de cálculo
    document.getElementById('simpson-38-tiempo').textContent = formatNumber(resultado.tiempo, 2) + ' ms';
    
    // Mostrar información de precisión
    const precisionHtml = `
        <div><strong>Ancho de intervalo h:</strong> ${formatNumber(resultado.h, 6)}</div>
        <div><strong>Número de segmentos:</strong> ${n/3} (n = ${n})</div>
        <div><strong>Suma no-múltiplos de 3 (peso 3):</strong> ${formatNumber(resultado.sum3_nonmultiples, 6)}</div>
        <div><strong>Suma múltiplos de 3 (peso 2):</strong> ${formatNumber(resultado.sum3_multiples, 6)}</div>
        <div><strong>Fórmula:</strong> (3×${formatNumber(resultado.h, 4)}/8) × [${formatNumber(resultado.fa, 4)} + ${formatNumber(resultado.fb, 4)} + 3×${formatNumber(resultado.sum3_nonmultiples, 4)} + 2×${formatNumber(resultado.sum3_multiples, 4)}]</div>
    `;
    document.getElementById('simpson-38-precision').innerHTML = precisionHtml;
    
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
    document.getElementById('simpson-38-error').innerHTML = errorHtml;
    
    // Actualizar tabla de segmentos
    actualizarTablaSimpson38(resultado.segmentos);
    
    // Crear gráfico
    crearGraficoSimpson38(fStr, a, b, n, resultado, valorExacto);
    
    // Actualizar comparación con otros métodos
    actualizarComparacionMetodos(resultado, fStr, a, b, n, valorExacto);
}

function actualizarTablaSimpson38(segmentos) {
    const tbody = document.getElementById('simpson-38-table-body');
    tbody.innerHTML = '';
    
    segmentos.forEach((seg, index) => {
        const row = document.createElement('tr');
        
        // Resaltar segmentos con área significativa
        let bgColor = '';
        if (seg.area > seg.areaAcumulada / segmentos.length * 2) {
            bgColor = 'background-color: rgba(231, 76, 60, 0.1);';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #e74c3c; ${bgColor}">${seg.segmento}</td>
            <td>${seg.intervalo}</td>
            <td>${formatNumber(seg.f0, 6)}</td>
            <td style="font-weight: bold; color: #3498db;">${formatNumber(seg.f1, 6)}</td>
            <td style="font-weight: bold; color: #3498db;">${formatNumber(seg.f2, 6)}</td>
            <td>${formatNumber(seg.f3, 6)}</td>
            <td style="font-weight: bold; color: #2ecc71;">${formatNumber(seg.area, 6)}</td>
            <td>${formatNumber(seg.areaAcumulada, 6)}</td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoSimpson38(fStr, a, b, n, resultado, valorExacto) {
    const datasets = [];
    const mostrarCubicas = document.getElementById('simpson-38-mostrar-cubicas').checked;
    const mostrarFunc = document.getElementById('simpson-38-mostrar-func').checked;
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
    
    // 2. Cúbicas de aproximación
    if (mostrarCubicas && n <= 15) { // Limitar para n grandes por rendimiento
        const colores = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c'];
        
        for (let i = 0; i < Math.min(n/3, 2); i++) { // Mostrar solo primeros 2 segmentos
            const x0 = a + i * 3 * h;
            const x1 = x0 + h;
            const x2 = x0 + 2 * h;
            const x3 = x0 + 3 * h;
            
            try {
                const f0 = evaluateExpression(fStr, x0);
                const f1 = evaluateExpression(fStr, x1);
                const f2 = evaluateExpression(fStr, x2);
                const f3 = evaluateExpression(fStr, x3);
                
                // Generar puntos para la cúbica
                const puntosCubica = [];
                const numPuntosCubica = 30;
                for (let j = 0; j <= numPuntosCubica; j++) {
                    const t = j / numPuntosCubica;
                    const x = x0 + (x3 - x0) * t;
                    
                    // Interpolación cúbica de Lagrange
                    const L0 = ((x - x1) * (x - x2) * (x - x3)) / ((x0 - x1) * (x0 - x2) * (x0 - x3));
                    const L1 = ((x - x0) * (x - x2) * (x - x3)) / ((x1 - x0) * (x1 - x2) * (x1 - x3));
                    const L2 = ((x - x0) * (x - x1) * (x - x3)) / ((x2 - x0) * (x2 - x1) * (x2 - x3));
                    const L3 = ((x - x0) * (x - x1) * (x - x2)) / ((x3 - x0) * (x3 - x1) * (x3 - x2));
                    
                    const y = f0 * L0 + f1 * L1 + f2 * L2 + f3 * L3;
                    puntosCubica.push({ x: x, y: y });
                }
                
                datasets.push({
                    label: `Segmento ${i+1}`,
                    data: puntosCubica,
                    borderColor: colores[i % colores.length],
                    backgroundColor: colores[i % colores.length] + '20',
                    fill: false,
                    tension: 0.2,
                    pointRadius: 0,
                    borderWidth: 2
                });
            } catch (error) {
                console.warn(`Error dibujando cúbica ${i+1}:`, error);
            }
        }
    }
    
    // 3. Puntos de evaluación con colores según peso
    if (n <= 30) {
        const puntosEvaluacion = [];
        const coloresPuntos = [];
        
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            try {
                const y = evaluateExpression(fStr, x);
                puntosEvaluacion.push({ x: x, y: y });
                
                // Colores según posición y peso
                if (i === 0 || i === n) {
                    coloresPuntos.push('#2c3e50'); // Extremos (peso 1)
                } else if (i % 3 === 0) {
                    coloresPuntos.push('#2ecc71'); // Múltiplos de 3 (peso 2)
                } else {
                    coloresPuntos.push('#e74c3c'); // Otros (peso 3)
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
            pointRadius: 5,
            pointStyle: 'circle'
        });
    }
    
    // 4. Área aproximada total
    const alturaMedia = resultado.integral / (b - a);
    datasets.push({
        label: `Área Simpson 3/8: ${formatNumber(resultado.integral, 4)}`,
        data: [
            { x: a, y: 0 },
            { x: a, y: alturaMedia },
            { x: b, y: alturaMedia },
            { x: b, y: 0 }
        ],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
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
    
    createChart('simpson-38-chart', data, options);
}

function actualizarComparacionMetodos(resultadoSimpson38, fStr, a, b, n, valorExacto) {
    const tbody = document.getElementById('simpson-38-comparacion-body');
    tbody.innerHTML = '';
    
    // Función auxiliar para calcular otros métodos
    const calcularTrapecio = (n_trap) => {
        const h_trap = (b - a) / n_trap;
        let suma_trap = evaluateExpression(fStr, a) + evaluateExpression(fStr, b);
        for (let i = 1; i < n_trap; i++) {
            suma_trap += evaluateExpression(fStr, a + i * h_trap);
        }
        return h_trap * suma_trap / 2;
    };
    
    const calcularSimpson13 = (n_simp13) => {
        if (n_simp13 % 2 !== 0) n_simp13++;
        const h_simp13 = (b - a) / n_simp13;
        let suma_simp13 = evaluateExpression(fStr, a) + evaluateExpression(fStr, b);
        let sumOdd = 0, sumEven = 0;
        for (let i = 1; i < n_simp13; i++) {
            const xi = a + i * h_simp13;
            if (i % 2 === 1) sumOdd += evaluateExpression(fStr, xi);
            else sumEven += evaluateExpression(fStr, xi);
        }
        return (h_simp13 / 3) * (suma_simp13 + 4 * sumOdd + 2 * sumEven);
    };
    
    // Calcular otros métodos con número similar de evaluaciones
    const n_trapecio = n; // Mismo número de intervalos
    const n_simpson13 = Math.floor(n / 2) * 2; // Aproximación para Simpson 1/3
    
    let valores = [
        {
            metodo: 'Trapecio',
            valor: calcularTrapecio(n_trapecio),
            n: n_trapecio,
            orden: 'O(h²)',
            color: '#3498db'
        },
        {
            metodo: 'Simpson 1/3',
            valor: calcularSimpson13(n_simpson13),
            n: n_simpson13,
            orden: 'O(h⁴)',
            color: '#9b59b6'
        },
        {
            metodo: 'Simpson 3/8',
            valor: resultadoSimpson38.integral,
            n: n,
            orden: 'O(h⁴)',
            color: '#e74c3c'
        }
    ];
    
    // Calcular errores si hay valor exacto
    if (valorExacto !== null) {
        valores = valores.map(v => ({
            ...v,
            error: Math.abs(v.valor - valorExacto),
            recomendacion: getRecomendacion(v.metodo, v.error, v.n, n)
        }));
    }
    
    // Ordenar por error (si disponible) o por valor
    valores.sort((a, b) => {
        if (a.error && b.error) return a.error - b.error;
        return 0;
    });
    
    // Crear filas de la tabla
    valores.forEach(v => {
        const row = document.createElement('tr');
        
        const errorDisplay = v.error ? formatNumber(v.error, 8) : 'N/A';
        const recomendacion = v.recomendacion || getRecomendacionGeneral(v.metodo, v.n);
        
        row.innerHTML = `
            <td style="font-weight: bold; color: ${v.color};">
                <i class="fas fa-${v.metodo === 'Trapecio' ? 'layer-group' : 
                                  v.metodo === 'Simpson 1/3' ? 'parabola' : 'cube'}"></i>
                ${v.metodo}
            </td>
            <td style="font-family: monospace;">${formatNumber(v.valor, 8)}</td>
            <td>${errorDisplay}</td>
            <td>${v.n}</td>
            <td>${v.orden}</td>
            <td style="font-size: 0.9rem;">${recomendacion}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Actualizar gráfico de comparación
    crearGraficoComparacionMetodos(valores, valorExacto);
}

function getRecomendacion(metodo, error, n_metodo, n_simpson38) {
    if (!error) return '';
    
    const eficiencia = n_simpson38 / n_metodo; // Evaluaciones relativas
    
    if (metodo === 'Simpson 3/8') {
        if (error < 1e-8) return 'Excelente precisión';
        if (error < 1e-6) return 'Muy buena precisión';
        if (error < 1e-4) return 'Buena precisión';
        return 'Considerar más intervalos';
    }
    
    if (metodo === 'Simpson 1/3') {
        if (eficiencia > 1.5) return 'Más eficiente que Simpson 3/8';
        if (eficiencia < 0.7) return 'Menos eficiente que Simpson 3/8';
        return 'Comparable a Simpson 3/8';
    }
    
    if (metodo === 'Trapecio') {
        return 'Usar Simpson para mejor precisión';
    }
    
    return '';
}

function getRecomendacionGeneral(metodo, n) {
    switch(metodo) {
        case 'Trapecio':
            return 'Solo para funciones lineales o aproximaciones rápidas';
        case 'Simpson 1/3':
            return 'Ideal para n par, excelente precisión O(h⁴)';
        case 'Simpson 3/8':
            return 'Ideal para n múltiplo de 3, precisión similar a Simpson 1/3';
        default:
            return '';
    }
}

function crearGraficoComparacionMetodos(valores, valorExacto) {
    const labels = valores.map(v => v.metodo);
    const dataValues = valores.map(v => v.valor);
    const colors = valores.map(v => v.color + '80');
    const borderColors = valores.map(v => v.color);
    
    // Si hay valor exacto, agregarlo como línea de referencia
    const datasets = [{
        label: 'Valor aproximado',
        data: dataValues,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 5
    }];
    
    if (valorExacto !== null) {
        datasets.push({
            label: 'Valor exacto',
            data: valores.map(() => valorExacto),
            borderColor: '#2c3e50',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            type: 'line',
            pointRadius: 0
        });
    }
    
    const data = {
        labels: labels,
        datasets: datasets
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatNumber(context.parsed.y, 8);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Valor de la integral'
                }
            }
        }
    };
    
    createChart('simpson-38-comparacion-chart', data, options, 'bar');
}

function mostrarMasEjemploSimpson38() {
    const ejemplosExtras = [
        {
            nombre: "Función de Alta Frecuencia",
            descripcion: "∫ sin(10x) dx de 0 a π = 0.2",
            funcion: "sin(10*x)",
            a: "0",
            b: "3.14159",
            n: "30",
            valorExacto: "0.2",
            nota: "Requiere muchos intervalos para funciones oscilantes rápidas"
        },
        {
            nombre: "Función con Pico",
            descripcion: "∫ exp(-100*(x-0.5)^2) dx de 0 a 1 (gaussiana)",
            funcion: "exp(-100*(x-0.5)*(x-0.5))",
            a: "0",
            b: "1",
            n: "24",
            valorExacto: "0.177245",
            nota: "Función con pico estrecho - Simpson 3/8 maneja bien"
        },
        {
            nombre: "Comparación Directa",
            descripcion: "∫ x^6 dx de 0 a 1 = 1/7 ≈ 0.142857",
            funcion: "x^6",
            a: "0",
            b: "1",
            n: "12",
            valorExacto: "0.142857",
            nota: "Comparar Simpson 1/3 vs 3/8 para grado 6"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="simpson38-mas-ejemplos-modal">
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
                                <h5 style="color: #e74c3c; margin-bottom: 0.5rem;">
                                    <i class="fas fa-cube"></i> ${ejemplo.nombre}
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
                                <button class="cargar-simpson38-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; 
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
    const modalExistente = document.getElementById('simpson38-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('simpson38-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-simpson38-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoSimpson38(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarSimpson38() {
    console.log('Simpson38.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('simpson-38-func').value = '';
    document.getElementById('simpson-38-a').value = '0';
    document.getElementById('simpson-38-b').value = '1';
    document.getElementById('simpson-38-n').value = '9';
    document.getElementById('simpson-38-mostrar-cubicas').checked = true;
    document.getElementById('simpson-38-mostrar-func').checked = true;
    
    // Limpiar resultados
    document.getElementById('simpson-38-resultado').textContent = '-';
    document.getElementById('simpson-38-tiempo').textContent = '-';
    document.getElementById('simpson-38-error').textContent = '-';
    document.getElementById('simpson-38-precision').innerHTML = '';
    document.getElementById('simpson-38-table-body').innerHTML = '';
    document.getElementById('simpson-38-comparacion-body').innerHTML = '';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('simpson-38-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['simpson-38-chart', 'simpson-38-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('simpson-38-chart').getContext('2d');
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
    window.charts['simpson-38-chart'] = emptyChart;
    
    console.log('Simpson38.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaSimpson38() {
    console.log("=== PRUEBA DE REGLA DE SIMPSON 3/8 ===");
    
    try {
        const fStr = "x^4";
        const a = 0;
        const b = 1;
        const n = 6;
        
        const resultado = calcularIntegralSimpson38(fStr, a, b, n);
        
        console.log(`∫[${a}, ${b}] ${fStr} dx con n = ${n} (Simpson 3/8)`);
        console.log("Valor aproximado:", resultado.integral);
        console.log("Valor exacto:", 0.2);
        console.log("Error absoluto:", Math.abs(resultado.integral - 0.2));
        console.log("Ancho de intervalo h:", resultado.h);
        console.log("\nSegmentos:");
        resultado.segmentos.forEach(seg => {
            console.log(`  Segmento ${seg.segmento}: [${formatNumber(seg.x0, 2)}, ${formatNumber(seg.x3, 2)}]`);
            console.log(`    f0 = ${formatNumber(seg.f0, 4)}, f1 = ${formatNumber(seg.f1, 4)}, f2 = ${formatNumber(seg.f2, 4)}, f3 = ${formatNumber(seg.f3, 4)}`);
            console.log(`    Área = ${formatNumber(seg.area, 6)}`);
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaSimpson38);