/**
 * trapecio.js - Regla del Trapecio
 * Implementa integración numérica usando la regla del trapecio simple y compuesta
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Trapecio.js: Cargado');
    
    // Escuchar cuando la sección de integración se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'integracion') {
            console.log('Trapecio.js: Sección Integración activada');
            setTimeout(inicializarTrapecio, 300);
        }
    });
    
    // Escuchar cuando se seleccione Trapecio
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'trapecio') {
            console.log('Trapecio.js: Método Trapecio seleccionado');
            setTimeout(inicializarTrapecio, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarTrapecioVisibilidad, 1000);
});

function verificarTrapecioVisibilidad() {
    const trapecioContent = document.getElementById('trapecio-content');
    if (trapecioContent && !trapecioContent.classList.contains('hidden')) {
        console.log('Trapecio.js: Ya visible al cargar');
        inicializarTrapecio();
    }
}

function inicializarTrapecio() {
    console.log('Trapecio.js: Inicializando...');
    
    const trapecioContent = document.getElementById('trapecio-content');
    if (!trapecioContent) {
        console.error('Trapecio.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.trapecioInitialized) {
        console.log('Trapecio.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (trapecioContent.innerHTML.trim() === '' || !document.getElementById('trapecio-func')) {
        console.log('Trapecio.js: Creando interfaz...');
        crearInterfazTrapecio();
    }
    
    // Asignar eventos
    asignarEventosTrapecio();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialTrapecio();
    
    // Marcar como inicializado
    window.trapecioInitialized = true;
    console.log('Trapecio.js: Inicialización completada');
}

function crearInterfazTrapecio() {
    const content = document.getElementById('trapecio-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-layer-group"></i> Regla del Trapecio</h3>
            <p>Integración numérica por aproximación trapezoidal</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="trapecio-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="trapecio-func"><i class="fas fa-function"></i> Función f(x)</label>
                <input type="text" id="trapecio-func" value="sin(x)" placeholder="ej: x^2">
                <small>Función a integrar (usa sintaxis JavaScript)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="trapecio-a"><i class="fas fa-play"></i> Límite inferior a</label>
                    <input type="number" id="trapecio-a" value="0" step="0.1">
                    <small>Inicio del intervalo de integración</small>
                </div>
                <div class="input-group">
                    <label for="trapecio-b"><i class="fas fa-stop"></i> Límite superior b</label>
                    <input type="number" id="trapecio-b" value="3.14159" step="0.1">
                    <small>Fin del intervalo de integración</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="trapecio-n"><i class="fas fa-sliders-h"></i> Número de intervalos n</label>
                <input type="number" id="trapecio-n" value="10" min="1" max="1000" step="1">
                <small>Número de subintervalos para trapecio compuesto (más = más precisión)</small>
            </div>
            
            <div class="input-group">
                <label><i class="fas fa-eye"></i> Ver área aproximada</label>
                <div class="checkbox-group" style="display: flex; gap: 20px; margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="trapecio-mostrar-area" checked style="transform: scale(1.2);">
                        <span style="color: #3498db; font-weight: bold;">
                            Mostrar trapecios
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="trapecio-mostrar-func" checked style="transform: scale(1.2);">
                        <span style="color: #9b59b6; font-weight: bold;">
                            Mostrar función
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="trapecio-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular Integral</button>
                <button id="trapecio-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="trapecio-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="trapecio-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-area"></i> Resultados de Integración</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor de la integral:</h4>
                    <p id="trapecio-resultado" style="font-size: 1.5rem; font-weight: bold; color: #3498db;">-</p>
                    
                    <h4><i class="fas fa-ruler"></i> Precisión:</h4>
                    <div id="trapecio-precision" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                        <!-- Información de precisión se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="trapecio-tiempo">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-sliders-h"></i> Error estimado:</h4>
                            <p id="trapecio-error">-</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="trapecio-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Desglose por Intervalos</h4>
                <div class="table-container">
                    <table id="trapecio-table">
                        <thead>
                            <tr>
                                <th>Intervalo</th>
                                <th>xᵢ</th>
                                <th>xᵢ₊₁</th>
                                <th>f(xᵢ)</th>
                                <th>f(xᵢ₊₁)</th>
                                <th>Área trapezoidal</th>
                                <th>Área acumulada</th>
                            </tr>
                        </thead>
                        <tbody id="trapecio-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con valor exacto si disponible -->
            <div class="comparison-section" id="trapecio-comparacion-section" style="display: none; margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Valor Exacto</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="trapecio-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="trapecio-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>Valor Aproximado</th>
                                    <th>Valor Exacto</th>
                                    <th>Error Absoluto</th>
                                    <th>Error Relativo %</th>
                                </tr>
                            </thead>
                            <tbody id="trapecio-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Explicación del método -->
            <div class="conclusion-box" id="trapecio-explicacion-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f4fc 0%, #d6eaf8 100%); border-radius: 8px; border-left: 4px solid #3498db;">
                <h4 style="margin-top: 0; color: #3498db;">
                    <i class="fas fa-lightbulb"></i> Teoría: Regla del Trapecio
                </h4>
                <p><strong>Fórmula:</strong> ∫ₐᵇ f(x) dx ≈ (b-a) * [f(a) + f(b)]/2 (simple)</p>
                <p><strong>Compuesta:</strong> ∫ₐᵇ f(x) dx ≈ h * [f(a)/2 + f(b)/2 + Σᵢ₌₁ⁿ⁻¹ f(a + i*h)]</p>
                <p><strong>Donde:</strong> h = (b-a)/n, n = número de intervalos</p>
                <p><strong>Error:</strong> E = - (b-a)³ * f''(ξ) / (12n²) para algún ξ ∈ [a,b]</p>
                <p><strong>Orden:</strong> O(h²) - duplicar n reduce error ~4 veces</p>
            </div>
        </div>
    `;
    
    console.log('Trapecio.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemploTrapecio();
}

function inicializarSelectorEjemploTrapecio() {
    const ejemplos = [
        {
            nombre: "Función Seno",
            descripcion: "∫ sin(x) dx de 0 a π ≈ 2",
            funcion: "sin(x)",
            a: "0",
            b: "3.14159",
            n: "10",
            valorExacto: "2",
            nota: "Área bajo una senoide. Valor exacto: 2"
        },
        {
            nombre: "Función Cuadrática",
            descripcion: "∫ x² dx de 0 a 1 = 1/3",
            funcion: "x^2",
            a: "0",
            b: "1",
            n: "4",
            valorExacto: "0.333333",
            nota: "Integral de polinomio cuadrático"
        },
        {
            nombre: "Función Exponencial",
            descripcion: "∫ e^x dx de 0 a 1 = e - 1 ≈ 1.71828",
            funcion: "exp(x)",
            a: "0",
            b: "1",
            n: "8",
            valorExacto: "1.7182818",
            nota: "Crecimiento exponencial rápido"
        },
        {
            nombre: "Función Periódica",
            descripcion: "∫ sin(x)cos(x) dx de 0 a π/2 = 0.5",
            funcion: "sin(x)*cos(x)",
            a: "0",
            b: "1.5708",
            n: "6",
            valorExacto: "0.5",
            nota: "Producto de funciones trigonométricas"
        },
        {
            nombre: "Función Raíz Cuadrada",
            descripcion: "∫ sqrt(x) dx de 0 a 4 = 16/3 ≈ 5.3333",
            funcion: "sqrt(x)",
            a: "0",
            b: "4",
            n: "8",
            valorExacto: "5.333333",
            nota: "Raíz cuadrada - derivada infinita en 0"
        },
        {
            nombre: "Función de Runge",
            descripcion: "∫ 1/(1+25x²) dx de -1 a 1 ≈ 0.5493",
            funcion: "1/(1+25*x^2)",
            a: "-1",
            b: "1",
            n: "20",
            valorExacto: "0.549306",
            nota: "Función de Runge - difícil para métodos numéricos"
        }
    ];
    
    const selector = document.getElementById('trapecio-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #3498db;">
            <h4 style="margin-bottom: 1rem; color: #3498db;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Regla del Trapecio
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #3498db; margin-bottom: 0.5rem;">
                            <i class="fas fa-integral"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-trapecio-ejemplo-btn" data-index="${index}" 
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
        document.querySelectorAll('.cargar-trapecio-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoTrapecio(ejemplos[index]);
            });
        });
    }, 100);
}

function asignarEventosTrapecio() {
    console.log('Trapecio.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('trapecio-calc');
    const ejemploBtn = document.getElementById('trapecio-ejemplo');
    const clearBtn = document.getElementById('trapecio-clear');
    
    if (!calcBtn) {
        console.error('Trapecio.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularTrapecio);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemploTrapecio);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarTrapecio);
    }
    
    console.log('Trapecio.js: Eventos asignados correctamente');
}

function cargarEjemploInicialTrapecio() {
    const funcEl = document.getElementById('trapecio-func');
    if (!funcEl || funcEl.value === '') {
        console.log('Trapecio.js: Cargando ejemplo inicial...');
        
        const ejemplo = {
            nombre: "Función Seno",
            descripcion: "∫ sin(x) dx de 0 a π ≈ 2",
            funcion: "sin(x)",
            a: "0",
            b: "3.14159",
            n: "10",
            valorExacto: "2",
            nota: "Área bajo una senoide. Valor exacto: 2"
        };
        
        cargarEjemploEspecificoTrapecio(ejemplo);
    }
}

function cargarEjemploEspecificoTrapecio(ejemplo) {
    console.log(`Trapecio.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar valores
    document.getElementById('trapecio-func').value = ejemplo.funcion;
    document.getElementById('trapecio-a').value = ejemplo.a;
    document.getElementById('trapecio-b').value = ejemplo.b;
    document.getElementById('trapecio-n').value = ejemplo.n;
    
    // Mostrar descripción del ejemplo
    let descripcion = document.getElementById('trapecio-descripcion-ejemplo');
    if (!descripcion) {
        descripcion = document.createElement('div');
        descripcion.id = 'trapecio-descripcion-ejemplo';
        const inputSection = document.querySelector('#trapecio-content .input-group:first-child');
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
            <br><small><i class="fas fa-layer-group"></i> <strong>Ventaja Trapecio:</strong> Simple y estable para funciones suaves.</small>
        </div>
    `;
    
    // Calcular automáticamente después de un breve delay
    setTimeout(() => {
        calcularTrapecio();
    }, 400);
}

function calcularTrapecio() {
    console.log('Trapecio.js: Calculando integral...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('trapecio-func');
    const aEl = document.getElementById('trapecio-a');
    const bEl = document.getElementById('trapecio-b');
    const nEl = document.getElementById('trapecio-n');
    
    if (!funcEl || !aEl || !bEl || !nEl) {
        showError('Error: Elementos del Trapecio no encontrados. Recarga la página.');
        return;
    }
    
    const fStr = funcEl.value.trim();
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    const n = parseInt(nEl.value);
    
    // Validaciones
    if (!fStr) {
        showError('Debe ingresar una función', 'trapecio-func');
        return;
    }
    
    if (isNaN(a)) {
        showError('El límite inferior debe ser un número válido', 'trapecio-a');
        return;
    }
    
    if (isNaN(b)) {
        showError('El límite superior debe ser un número válido', 'trapecio-b');
        return;
    }
    
    if (a >= b) {
        showError('El límite inferior debe ser menor que el superior', 'trapecio-a');
        return;
    }
    
    if (isNaN(n) || n < 1) {
        showError('El número de intervalos debe ser un entero positivo', 'trapecio-n');
        return;
    }
    
    if (n > 1000) {
        showError('Número de intervalos muy alto. Use máximo 1000 para rendimiento.', 'trapecio-n');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('trapecio-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular integral usando trapecio compuesto
            const resultado = calcularIntegralTrapecio(fStr, a, b, n);
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            // Obtener valor exacto si está disponible en el ejemplo
            const descripcion = document.getElementById('trapecio-descripcion-ejemplo');
            let valorExacto = null;
            if (descripcion && descripcion.textContent.includes('Valor exacto:')) {
                const match = descripcion.textContent.match(/Valor exacto:\s*([\d.]+)/);
                if (match) {
                    valorExacto = parseFloat(match[1]);
                    resultado.valorExacto = valorExacto;
                    resultado.errorAbsoluto = Math.abs(resultado.integral - valorExacto);
                }
            }
            
            mostrarResultadosTrapecio(resultado, fStr, a, b, n, valorExacto);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('Trapecio.js error:', error);
        } finally {
            showLoading(document.getElementById('trapecio-calc'), false);
        }
    }, 100);
}

function calcularIntegralTrapecio(fStr, a, b, n) {
    console.log(`Trapecio.js: Calculando ∫[${a}, ${b}] ${fStr} dx con n = ${n}`);
    
    const h = (b - a) / n;
    let suma = 0;
    const intervalos = [];
    let areaAcumulada = 0;
    
    // Calcular f(a) y f(b) una vez
    const fa = evaluateExpression(fStr, a);
    const fb = evaluateExpression(fStr, b);
    
    // Punto medio
    suma = (fa + fb) / 2;
    
    // Calcular puntos intermedios y áreas
    for (let i = 1; i < n; i++) {
        const xi = a + i * h;
        const fxi = evaluateExpression(fStr, xi);
        suma += fxi;
        
        // Calcular área del trapecio i
        const xi_1 = a + (i - 1) * h;
        const fxi_1 = evaluateExpression(fStr, xi_1);
        const areaTrapecio = h * (fxi_1 + fxi) / 2;
        areaAcumulada += areaTrapecio;
        
        intervalos.push({
            i: i,
            xi: xi_1,
            xi1: xi,
            fxi: fxi_1,
            fxi1: fxi,
            area: areaTrapecio,
            areaAcumulada: areaAcumulada
        });
    }
    
    // Área del último trapecio
    const areaUltimo = h * (evaluateExpression(fStr, b - h) + fb) / 2;
    areaAcumulada += areaUltimo;
    
    const integral = h * suma;
    
    // Estimar error usando fórmula del error para trapecio
    const errorEstimado = estimarErrorTrapecio(fStr, a, b, n, h);
    
    return {
        integral: integral,
        h: h,
        n: n,
        fa: fa,
        fb: fb,
        intervalos: intervalos,
        errorEstimado: errorEstimado,
        areaAcumulada: areaAcumulada
    };
}

function estimarErrorTrapecio(fStr, a, b, n, h) {
    // Estimación simple del error usando diferencia entre n y n/2
    if (n >= 2) {
        try {
            // Calcular con n/2 intervalos (redondeado hacia arriba)
            const n2 = Math.max(1, Math.floor(n / 2));
            const h2 = (b - a) / n2;
            
            let suma2 = (evaluateExpression(fStr, a) + evaluateExpression(fStr, b)) / 2;
            for (let i = 1; i < n2; i++) {
                suma2 += evaluateExpression(fStr, a + i * h2);
            }
            const integral2 = h2 * suma2;
            
            // Calcular con n intervalos
            let suma1 = (evaluateExpression(fStr, a) + evaluateExpression(fStr, b)) / 2;
            for (let i = 1; i < n; i++) {
                suma1 += evaluateExpression(fStr, a + i * h);
            }
            const integral1 = h * suma1;
            
            // Error estimado usando extrapolación de Richardson
            const errorEstimado = Math.abs(integral1 - integral2) / 3;
            return errorEstimado;
        } catch (e) {
            console.warn('No se pudo estimar error:', e.message);
            return null;
        }
    }
    return null;
}

function mostrarResultadosTrapecio(resultado, fStr, a, b, n, valorExacto) {
    console.log('Trapecio.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.trapecioResultados = resultado;
    
    // Mostrar valor de la integral
    document.getElementById('trapecio-resultado').textContent = formatNumber(resultado.integral, 8);
    
    // Mostrar tiempo de cálculo
    document.getElementById('trapecio-tiempo').textContent = formatNumber(resultado.tiempo, 2) + ' ms';
    
    // Mostrar información de precisión
    const precisionHtml = `
        <div><strong>Ancho de intervalo h:</strong> ${formatNumber(resultado.h, 6)}</div>
        <div><strong>Número de intervalos:</strong> ${resultado.n}</div>
        <div><strong>f(a):</strong> ${formatNumber(resultado.fa, 6)}</div>
        <div><strong>f(b):</strong> ${formatNumber(resultado.fb, 6)}</div>
        <div><strong>Suma ponderada:</strong> ${formatNumber(resultado.fa/2 + resultado.fb/2 + (resultado.areaAcumulada - resultado.fa/2 - resultado.fb/2), 6)}</div>
    `;
    document.getElementById('trapecio-precision').innerHTML = precisionHtml;
    
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
    document.getElementById('trapecio-error').innerHTML = errorHtml;
    
    // Actualizar tabla de intervalos
    actualizarTablaTrapecio(resultado.intervalos);
    
    // Crear gráfico
    crearGraficoTrapecio(fStr, a, b, n, resultado, valorExacto);
    
    // Mostrar comparación si hay valor exacto
    if (valorExacto !== null) {
        document.getElementById('trapecio-comparacion-section').style.display = 'block';
        mostrarComparacionTrapecio(resultado, valorExacto);
    } else {
        document.getElementById('trapecio-comparacion-section').style.display = 'none';
    }
}

function actualizarTablaTrapecio(intervalos) {
    const tbody = document.getElementById('trapecio-table-body');
    tbody.innerHTML = '';
    
    intervalos.forEach((intervalo, index) => {
        const row = document.createElement('tr');
        
        // Resaltar intervalos significativos
        let bgColor = '';
        if (intervalo.area > intervalo.areaAcumulada / intervalos.length * 2) {
            bgColor = 'background-color: rgba(52, 152, 219, 0.1);';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #3498db; ${bgColor}">${intervalo.i}</td>
            <td>${formatNumber(intervalo.xi, 4)}</td>
            <td>${formatNumber(intervalo.xi1, 4)}</td>
            <td>${formatNumber(intervalo.fxi, 6)}</td>
            <td>${formatNumber(intervalo.fxi1, 6)}</td>
            <td style="font-weight: bold; color: #e74c3c;">${formatNumber(intervalo.area, 6)}</td>
            <td>${formatNumber(intervalo.areaAcumulada, 6)}</td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoTrapecio(fStr, a, b, n, resultado, valorExacto) {
    const datasets = [];
    const mostrarArea = document.getElementById('trapecio-mostrar-area').checked;
    const mostrarFunc = document.getElementById('trapecio-mostrar-func').checked;
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
    
    // 2. Trapecios (área aproximada)
    if (mostrarArea && n <= 50) { // Limitar para n grandes por rendimiento
        const colores = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c'];
        
        for (let i = 0; i < Math.min(n, 5); i++) { // Mostrar solo primeros 5 trapecios
            const x0 = a + i * h;
            const x1 = x0 + h;
            
            try {
                const y0 = evaluateExpression(fStr, x0);
                const y1 = evaluateExpression(fStr, x1);
                
                datasets.push({
                    label: `Trapecio ${i+1}`,
                    data: [
                        { x: x0, y: 0 },
                        { x: x0, y: y0 },
                        { x: x1, y: y1 },
                        { x: x1, y: 0 },
                        { x: x0, y: 0 }
                    ],
                    borderColor: colores[i % colores.length],
                    backgroundColor: colores[i % colores.length] + '40',
                    fill: true,
                    tension: 0,
                    pointRadius: 0,
                    borderWidth: 1
                });
            } catch (error) {
                console.warn(`Error dibujando trapecio ${i+1}:`, error);
            }
        }
    }
    
    // 3. Puntos de evaluación
    if (n <= 20) { // Limitar para n grandes
        const puntosEvaluacion = [];
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            try {
                const y = evaluateExpression(fStr, x);
                puntosEvaluacion.push({ x: x, y: y });
            } catch (error) {
                console.warn('Error evaluando punto:', error);
            }
        }
        
        datasets.push({
            label: 'Puntos de evaluación',
            data: puntosEvaluacion,
            borderColor: '#2c3e50',
            backgroundColor: 'rgba(44, 62, 80, 0.8)',
            fill: false,
            showLine: false,
            pointRadius: 4,
            pointStyle: 'circle'
        });
    }
    
    // 4. Área aproximada total (rectángulo de altura media)
    const alturaMedia = resultado.integral / (b - a);
    datasets.push({
        label: `Área aproximada: ${formatNumber(resultado.integral, 4)}`,
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
        borderWidth: 2,
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
    
    createChart('trapecio-chart', data, options);
}

function mostrarComparacionTrapecio(resultado, valorExacto) {
    const tbody = document.getElementById('trapecio-comparacion-body');
    tbody.innerHTML = '';
    
    const errorAbsoluto = Math.abs(resultado.integral - valorExacto);
    const errorRelativo = (errorAbsoluto / Math.abs(valorExacto)) * 100;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td style="font-weight: bold; color: #3498db;">
            <i class="fas fa-layer-group"></i> Trapecio Compuesto (n=${resultado.n})
        </td>
        <td style="font-family: monospace;">${formatNumber(resultado.integral, 8)}</td>
        <td style="font-family: monospace;">${formatNumber(valorExacto, 8)}</td>
        <td style="color: ${errorAbsoluto > 0.01 ? '#e74c3c' : '#27ae60'};">
            ${formatNumber(errorAbsoluto, 8)}
        </td>
        <td>${formatNumber(errorRelativo, 4)}%</td>
    `;
    tbody.appendChild(row);
}

function mostrarMasEjemploTrapecio() {
    const ejemplosExtras = [
        {
            nombre: "Función Lineal",
            descripcion: "∫ 2x dx de 0 a 5 = 25",
            funcion: "2*x",
            a: "0",
            b: "5",
            n: "2",
            valorExacto: "25",
            nota: "Trapecio es exacto para funciones lineales"
        },
        {
            nombre: "Función Cúbica",
            descripcion: "∫ x³ dx de 0 a 2 = 4",
            funcion: "x^3",
            a: "0",
            b: "2",
            n: "6",
            valorExacto: "4",
            nota: "Error significativo con pocos intervalos"
        },
        {
            nombre: "Función Oscilante",
            descripcion: "∫ sin(10x) dx de 0 a π ≈ 0",
            funcion: "sin(10*x)",
            a: "0",
            b: "3.14159",
            n: "40",
            valorExacto: "0",
            nota: "Requiere muchos intervalos para funciones oscilantes"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="trapecio-mas-ejemplos-modal">
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
                                <h5 style="color: #3498db; margin-bottom: 0.5rem;">
                                    <i class="fas fa-integral"></i> ${ejemplo.nombre}
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
                                <button class="cargar-trapecio-ejemplo-ext-btn" data-index="${index}" 
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
    const modalExistente = document.getElementById('trapecio-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('trapecio-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-trapecio-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoTrapecio(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarTrapecio() {
    console.log('Trapecio.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('trapecio-func').value = '';
    document.getElementById('trapecio-a').value = '0';
    document.getElementById('trapecio-b').value = '1';
    document.getElementById('trapecio-n').value = '10';
    document.getElementById('trapecio-mostrar-area').checked = true;
    document.getElementById('trapecio-mostrar-func').checked = true;
    
    // Limpiar resultados
    document.getElementById('trapecio-resultado').textContent = '-';
    document.getElementById('trapecio-tiempo').textContent = '-';
    document.getElementById('trapecio-error').textContent = '-';
    document.getElementById('trapecio-precision').innerHTML = '';
    document.getElementById('trapecio-table-body').innerHTML = '';
    document.getElementById('trapecio-comparacion-body').innerHTML = '';
    
    // Ocultar sección de comparación
    document.getElementById('trapecio-comparacion-section').style.display = 'none';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('trapecio-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['trapecio-chart', 'trapecio-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('trapecio-chart').getContext('2d');
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
    window.charts['trapecio-chart'] = emptyChart;
    
    console.log('Trapecio.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaTrapecio() {
    console.log("=== PRUEBA DE REGLA DEL TRAPECIO ===");
    
    try {
        const fStr = "sin(x)";
        const a = 0;
        const b = Math.PI;
        const n = 10;
        
        const resultado = calcularIntegralTrapecio(fStr, a, b, n);
        
        console.log(`∫[${a}, ${b}] ${fStr} dx con n = ${n}`);
        console.log("Valor aproximado:", resultado.integral);
        console.log("Valor exacto:", 2);
        console.log("Error absoluto:", Math.abs(resultado.integral - 2));
        console.log("Ancho de intervalo h:", resultado.h);
        console.log("\nPrimeros 3 intervalos:");
        resultado.intervalos.slice(0, 3).forEach(intervalo => {
            console.log(`  Intervalo ${intervalo.i}: [${formatNumber(intervalo.xi, 2)}, ${formatNumber(intervalo.xi1, 2)}]`);
            console.log(`    f(xᵢ) = ${formatNumber(intervalo.fxi, 4)}, f(xᵢ₊₁) = ${formatNumber(intervalo.fxi1, 4)}`);
            console.log(`    Área = ${formatNumber(intervalo.area, 6)}, Acumulado = ${formatNumber(intervalo.areaAcumulada, 6)}`);
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaTrapecio);