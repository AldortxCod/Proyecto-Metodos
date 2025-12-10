/**
 * romberg.js - Método de Romberg
 * Implementa integración numérica con extrapolación de Richardson
 * para convergencia acelerada O(h^{2k})
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Romberg.js: Cargado');
    
    // Escuchar cuando la sección de integración se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'integracion') {
            console.log('Romberg.js: Sección Integración activada');
            setTimeout(inicializarRomberg, 300);
        }
    });
    
    // Escuchar cuando se seleccione Romberg
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'romberg') {
            console.log('Romberg.js: Método Romberg seleccionado');
            setTimeout(inicializarRomberg, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarRombergVisibilidad, 1000);
});

function verificarRombergVisibilidad() {
    const rombergContent = document.getElementById('romberg-content');
    if (rombergContent && !rombergContent.classList.contains('hidden')) {
        console.log('Romberg.js: Ya visible al cargar');
        inicializarRomberg();
    }
}

function inicializarRomberg() {
    console.log('Romberg.js: Inicializando...');
    
    const rombergContent = document.getElementById('romberg-content');
    if (!rombergContent) {
        console.error('Romberg.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.rombergInitialized) {
        console.log('Romberg.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (rombergContent.innerHTML.trim() === '' || !document.getElementById('romberg-func')) {
        console.log('Romberg.js: Creando interfaz...');
        crearInterfazRomberg();
    }
    
    // Asignar eventos
    asignarEventosRomberg();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialRomberg();
    
    // Marcar como inicializado
    window.rombergInitialized = true;
    console.log('Romberg.js: Inicialización completada');
}

function crearInterfazRomberg() {
    const content = document.getElementById('romberg-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-rocket"></i> Método de Romberg</h3>
            <p>Integración numérica con extrapolación de Richardson para convergencia acelerada</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="romberg-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="romberg-func"><i class="fas fa-function"></i> Función f(x)</label>
                <input type="text" id="romberg-func" value="exp(-x)*sin(x)" placeholder="ej: exp(-x)*sin(x)">
                <small>Función a integrar (usa sintaxis JavaScript)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="romberg-a"><i class="fas fa-play"></i> Límite inferior a</label>
                    <input type="number" id="romberg-a" value="0" step="0.1">
                    <small>Inicio del intervalo de integración</small>
                </div>
                <div class="input-group">
                    <label for="romberg-b"><i class="fas fa-stop"></i> Límite superior b</label>
                    <input type="number" id="romberg-b" value="3.1416" step="0.1">
                    <small>Fin del intervalo de integración</small>
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="romberg-nivel"><i class="fas fa-layer-group"></i> Nivel máximo k</label>
                    <input type="number" id="romberg-nivel" value="5" min="1" max="10" step="1">
                    <small>Número de refinamientos (tabla k×k)</small>
                </div>
                <div class="input-group">
                    <label for="romberg-tol"><i class="fas fa-bullseye"></i> Tolerancia</label>
                    <input type="number" id="romberg-tol" value="0.000001" step="0.000001">
                    <small>Criterio de convergencia</small>
                </div>
            </div>
            
            <div class="input-group">
                <label for="romberg-sol-exacta"><i class="fas fa-check-circle"></i> Solución exacta (opcional)</label>
                <input type="text" id="romberg-sol-exacta" placeholder="ej: 0.5*(1-exp(-pi)*(sin(pi)+cos(pi)))">
                <small>Si se proporciona, se calculará el error</small>
            </div>
            
            <div class="input-group">
                <label><i class="fas fa-eye"></i> Visualización</label>
                <div class="checkbox-group" style="display: flex; gap: 20px; margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="romberg-mostrar-tabla" checked style="transform: scale(1.2);">
                        <span style="color: #f39c12; font-weight: bold;">
                            Mostrar tabla completa
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="romberg-mostrar-convergencia" checked style="transform: scale(1.2);">
                        <span style="color: #3498db; font-weight: bold;">
                            Mostrar convergencia
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="romberg-calc" class="calc-btn"><i class="fas fa-rocket"></i> Calcular Romberg</button>
                <button id="romberg-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="romberg-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="romberg-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados de Integración Acelerada</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-calculator"></i> Valor de la integral:</h4>
                    <p id="romberg-integral" style="font-size: 1.5rem; font-weight: bold; color: #f39c12;">-</p>
                    
                    <h4><i class="fas fa-tachometer-alt"></i> Rendimiento:</h4>
                    <div id="romberg-rendimiento" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-size: 0.9rem;">
                        <!-- Información de rendimiento se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-clock"></i> Tiempo de cálculo:</h4>
                            <p id="romberg-tiempo">-</p>
                            <h4><i class="fas fa-sliders-h"></i> Error estimado:</h4>
                            <p id="romberg-error">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-bullseye"></i> Convergencia:</h4>
                            <p id="romberg-convergencia">-</p>
                            <h4><i class="fas fa-calculator"></i> Evaluaciones:</h4>
                            <p id="romberg-evaluaciones">-</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem;">
                        <h4><i class="fas fa-chart-line"></i> Orden de convergencia:</h4>
                        <div id="romberg-convergencia-indicador" style="display: flex; align-items: center; gap: 1rem;">
                            <div style="height: 10px; flex-grow: 1; background: #ecf0f1; border-radius: 5px; overflow: hidden;">
                                <div id="romberg-convergencia-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #f39c12, #e67e22); transition: width 1s;"></div>
                            </div>
                            <span id="romberg-convergencia-text" style="font-weight: bold; color: #f39c12;">O(h²)</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="romberg-chart"></canvas>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Tabla de Romberg R(i,j)</h4>
                <div class="table-container">
                    <table id="romberg-table">
                        <thead>
                            <tr>
                                <th>Nivel (i)</th>
                                <th>R(i,0) Trapecio</th>
                                <th>R(i,1)</th>
                                <th>R(i,2)</th>
                                <th>R(i,3)</th>
                                <th>R(i,4)</th>
                                <th>R(i,5)</th>
                            </tr>
                        </thead>
                        <tbody id="romberg-table-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="iterations-table">
                <h4><i class="fas fa-chart-bar"></i> Progresión de Convergencia</h4>
                <div class="table-container">
                    <table id="romberg-progresion-table">
                        <thead>
                            <tr>
                                <th>Nivel</th>
                                <th>Subintervalos</th>
                                <th>Valor</th>
                                <th>Error Estimado</th>
                                <th>Diferencia</th>
                                <th>Orden</th>
                                <th>Converge</th>
                            </tr>
                        </thead>
                        <tbody id="romberg-progresion-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con otros métodos -->
            <div class="comparison-section" id="romberg-comparacion-section" style="margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Otros Métodos</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="romberg-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="romberg-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>Valor</th>
                                    <th>Error</th>
                                    <th>Evaluaciones</th>
                                    <th>Orden</th>
                                    <th>Ventaja</th>
                                </tr>
                            </thead>
                            <tbody id="romberg-comparacion-body">
                                <!-- Datos de comparación -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Explicación del método -->
            <div class="conclusion-box" id="romberg-explicacion-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #fef9e7 0%, #fcf3cf 100%); border-radius: 8px; border-left: 4px solid #f39c12;">
                <h4 style="margin-top: 0; color: #f39c12;">
                    <i class="fas fa-lightbulb"></i> Teoría: Método de Romberg
                </h4>
                <p><strong>Fórmula de extrapolación:</strong> R(i,j) = [4ʲ × R(i,j-1) - R(i-1,j-1)] / (4ʲ - 1)</p>
                <p><strong>Inicialización:</strong> R(i,0) = Regla del Trapecio compuesta con 2ⁱ subintervalos</p>
                <p><strong>Convergencia:</strong> O(h²ʲ⁺²) - aceleración exponencial con cada extrapolación</p>
                <p><strong>Error:</strong> E(i,j) ≈ C × h²ʲ⁺² × f⁽²ʲ⁺²⁾(ξ)</p>
                <p><strong>Ventaja:</strong> Logra alta precisión con pocas evaluaciones de función</p>
                <p><strong>Algoritmo:</strong> Construye tabla triangular R(i,j) donde j ≤ i</p>
            </div>
            
            <!-- Ventajas de Romberg -->
            <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div style="background: #fef9e7; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #f39c12;">
                    <h5 style="color: #f39c12; margin-top: 0;">
                        <i class="fas fa-bolt"></i> Convergencia Acelerada
                    </h5>
                    <p style="font-size: 0.9rem; margin-bottom: 0;">
                        Romberg acelera la convergencia del método del trapecio usando extrapolación de Richardson.
                        Cada nivel aumenta el orden en 2.
                    </p>
                </div>
                <div style="background: #fef9e7; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e67e22;">
                    <h5 style="color: #e67e22; margin-top: 0;">
                        <i class="fas fa-cogs"></i> Eficiencia Computacional
                    </h5>
                    <p style="font-size: 0.9rem; margin-bottom: 0;">
                        Reutiliza evaluaciones de niveles anteriores. Logra alta precisión con relativamente pocas evaluaciones de función.
                    </p>
                </div>
                <div style="background: #fef9e7; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #d35400;">
                    <h5 style="color: #d35400; margin-top: 0;">
                        <i class="fas fa-chart-line"></i> Criterio de Parada
                    </h5>
                    <p style="font-size: 0.9rem; margin-bottom: 0;">
                        El método incluye criterio de convergencia automático basado en diferencias entre niveles consecutivos.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    console.log('Romberg.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemploRomberg();
}

function inicializarSelectorEjemploRomberg() {
    const ejemplos = [
        {
            nombre: "Oscilación Amortiguada",
            descripcion: "∫ e⁻ˣsin(x) dx de 0 a π ≈ 0.5(1 - e⁻π)",
            funcion: "exp(-x)*sin(x)",
            a: "0",
            b: "3.141592653589793",
            nivel: "5",
            tol: "0.000001",
            solExacta: "0.5*(1-exp(-pi))",
            nota: "Función oscilatoria amortiguada - Romberg converge rápidamente"
        },
        {
            nombre: "Pico Gaussiano",
            descripcion: "∫ e⁻¹⁰⁰⁽ˣ⁻⁰·⁵⁾² dx de 0 a 1 (≈ 0.177245)",
            funcion: "exp(-100*(x-0.5)*(x-0.5))",
            a: "0",
            b: "1",
            nivel: "6",
            tol: "0.000001",
            solExacta: "sqrt(pi/100)*erf(5)",
            nota: "Función con pico estrecho - Romberg adaptativo es ideal"
        },
        {
            nombre: "Integral Elíptica",
            descripcion: "K(0.5) = ∫ dθ/√(1-0.5sin²θ) de 0 a π/2",
            funcion: "1/sqrt(1 - 0.5*sin(x)*sin(x))",
            a: "0",
            b: "1.5707963267948966",
            nivel: "6",
            tol: "0.0000001",
            solExacta: "",
            nota: "Integral elíptica completa de primera especie"
        },
        {
            nombre: "Función de Runge",
            descripcion: "∫ 1/(1+25x²) dx de -1 a 1 ≈ 0.549306",
            funcion: "1/(1+25*x*x)",
            a: "-1",
            b: "1",
            nivel: "6",
            tol: "0.000001",
            solExacta: "0.2*atan(5)",
            nota: "Clásico ejemplo donde polinomios fallan, Romberg funciona bien"
        },
        {
            nombre: "Distribución de Fermi",
            descripcion: "∫ √x/(e⁽ˣ⁻μ⁾+1) dx (física de estado sólido)",
            funcion: "sqrt(x)/(exp(x-2) + 1)",
            a: "0",
            b: "10",
            nivel: "5",
            tol: "0.00001",
            solExacta: "",
            nota: "Distribución de Fermi-Dirac - importante en física"
        },
        {
            nombre: "Oscilación Rápida",
            descripcion: "∫ sin(20x)cos(10x) dx de 0 a π = 0",
            funcion: "sin(20*x)*cos(10*x)",
            a: "0",
            b: "3.141592653589793",
            nivel: "7",
            tol: "0.0000001",
            solExacta: "0",
            nota: "Producto trigonométrico con muchas oscilaciones"
        }
    ];
    
    const selector = document.getElementById('romberg-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #f39c12;">
            <h4 style="margin-bottom: 1rem; color: #f39c12;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Método de Romberg
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #f39c12; margin-bottom: 0.5rem;">
                            <i class="fas fa-rocket"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-romberg-ejemplo-btn" data-index="${index}" 
                                style="background: #f39c12; color: white; border: none; padding: 0.5rem 1rem; 
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
        document.querySelectorAll('.cargar-romberg-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoRomberg(ejemplos[index]);
            });
        });
    }, 100);
}

function asignarEventosRomberg() {
    console.log('Romberg.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('romberg-calc');
    const ejemploBtn = document.getElementById('romberg-ejemplo');
    const clearBtn = document.getElementById('romberg-clear');
    
    if (!calcBtn) {
        console.error('Romberg.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularRomberg);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemploRomberg);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarRomberg);
    }
    
    console.log('Romberg.js: Eventos asignados correctamente');
}

function cargarEjemploInicialRomberg() {
    const funcEl = document.getElementById('romberg-func');
    if (!funcEl || funcEl.value === '') {
        console.log('Romberg.js: Cargando ejemplo inicial...');
        
        const ejemplo = {
            nombre: "Oscilación Amortiguada",
            descripcion: "∫ e⁻ˣsin(x) dx de 0 a π ≈ 0.5(1 - e⁻π)",
            funcion: "exp(-x)*sin(x)",
            a: "0",
            b: "3.141592653589793",
            nivel: "5",
            tol: "0.000001",
            solExacta: "0.5*(1-exp(-pi))",
            nota: "Función oscilatoria amortiguada - Romberg converge rápidamente"
        };
        
        cargarEjemploEspecificoRomberg(ejemplo);
    }
}

function cargarEjemploEspecificoRomberg(ejemplo) {
    console.log(`Romberg.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar valores
    document.getElementById('romberg-func').value = ejemplo.funcion;
    document.getElementById('romberg-a').value = ejemplo.a;
    document.getElementById('romberg-b').value = ejemplo.b;
    document.getElementById('romberg-nivel').value = ejemplo.nivel;
    document.getElementById('romberg-tol').value = ejemplo.tol;
    document.getElementById('romberg-sol-exacta').value = ejemplo.solExacta || '';
    document.getElementById('romberg-mostrar-tabla').checked = true;
    document.getElementById('romberg-mostrar-convergencia').checked = true;
    
    // Mostrar descripción del ejemplo
    let descripcion = document.getElementById('romberg-descripcion-ejemplo');
    if (!descripcion) {
        descripcion = document.createElement('div');
        descripcion.id = 'romberg-descripcion-ejemplo';
        const inputSection = document.querySelector('#romberg-content .input-group:first-child');
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
            <br><small><i class="fas fa-rocket"></i> <strong>Ventaja Romberg:</strong> Convergencia acelerada O(h²ʲ⁺²) usando extrapolación de Richardson.</small>
        </div>
    `;
    
    // Calcular automáticamente después de un breve delay
    setTimeout(() => {
        calcularRomberg();
    }, 400);
}

function calcularRomberg() {
    console.log('Romberg.js: Calculando integral...');
    
    // OBTENER ELEMENTOS
    const funcEl = document.getElementById('romberg-func');
    const aEl = document.getElementById('romberg-a');
    const bEl = document.getElementById('romberg-b');
    const nivelEl = document.getElementById('romberg-nivel');
    const tolEl = document.getElementById('romberg-tol');
    const solExactaEl = document.getElementById('romberg-sol-exacta');
    
    if (!funcEl || !aEl || !bEl || !nivelEl || !tolEl) {
        showError('Error: Elementos de Romberg no encontrados. Recarga la página.');
        return;
    }
    
    const fStr = funcEl.value.trim();
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    const k = parseInt(nivelEl.value);
    const tol = parseFloat(tolEl.value);
    const solExactaStr = solExactaEl ? solExactaEl.value.trim() : '';
    
    // Validaciones
    if (!fStr) {
        showError('Debe ingresar una función', 'romberg-func');
        return;
    }
    
    if (isNaN(a)) {
        showError('El límite inferior debe ser un número válido', 'romberg-a');
        return;
    }
    
    if (isNaN(b)) {
        showError('El límite superior debe ser un número válido', 'romberg-b');
        return;
    }
    
    if (a >= b) {
        showError('El límite inferior debe ser menor que el superior', 'romberg-a');
        return;
    }
    
    if (isNaN(k) || k < 1) {
        showError('El nivel debe ser un entero ≥ 1', 'romberg-nivel');
        return;
    }
    
    if (k > 10) {
        showError('El nivel máximo es 10 para rendimiento', 'romberg-nivel');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('La tolerancia debe ser un número positivo', 'romberg-tol');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('romberg-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Calcular integral usando método de Romberg
            const resultado = calcularIntegralRomberg(fStr, a, b, k, tol);
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            // Calcular solución exacta si está disponible
            if (solExactaStr) {
                try {
                    // Evaluar la primitiva en a y b
                    const F = function(x) {
                        const expr = solExactaStr.replace(/x/g, `(${x})`).replace(/pi/g, 'Math.PI');
                        return evaluateExpression(expr);
                    };
                    
                    resultado.valorExacto = F(b) - F(a);
                    resultado.errorAbsoluto = Math.abs(resultado.integral - resultado.valorExacto);
                    resultado.errorRelativo = (resultado.errorAbsoluto / Math.abs(resultado.valorExacto)) * 100;
                } catch (error) {
                    console.warn('No se pudo evaluar solución exacta:', error);
                }
            }
            
            mostrarResultadosRomberg(resultado, fStr, a, b, k, tol, solExactaStr);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('Romberg.js error:', error);
        } finally {
            showLoading(document.getElementById('romberg-calc'), false);
        }
    }, 100);
}

function calcularIntegralRomberg(fStr, a, b, k, tol) {
    console.log(`Romberg.js: Calculando ∫[${a}, ${b}] ${fStr} dx con Romberg (k=${k}, tol=${tol})`);
    
    const R = []; // Tabla de Romberg R[i][j]
    const progresion = [];
    let evaluaciones = 0;
    
    // Función para evaluar f(x)
    function f(x) {
        evaluaciones++;
        return evaluateExpression(fStr.replace(/x/g, `(${x})`));
    }
    
    // Paso 1: R(0,0) - Trapecio simple
    const h0 = b - a;
    R[0] = [];
    R[0][0] = (h0 / 2) * (f(a) + f(b));
    
    progresion.push({
        nivel: 0,
        subintervalos: 1,
        valor: R[0][0],
        errorEstimado: null,
        diferencia: null,
        orden: null,
        converge: false
    });
    
    // Paso 2: Calcular R(i,0) para i = 1,...,k
    let nivelConvergencia = null;
    
    for (let i = 1; i <= k; i++) {
        R[i] = [];
        const n = Math.pow(2, i - 1); // Número de nuevos puntos
        const h = h0 / Math.pow(2, i); // Tamaño de paso actual
        
        // Calcular la suma de los puntos medios
        let suma = 0;
        for (let j = 1; j <= n; j++) {
            const x = a + (2*j - 1) * h;
            suma += f(x);
        }
        
        // R(i,0) = 0.5 * R(i-1,0) + h * suma
        R[i][0] = 0.5 * R[i-1][0] + h * suma;
        
        // Paso 3: Extrapolación - calcular R(i,j) para j = 1,...,i
        for (let j = 1; j <= i; j++) {
            const factor = Math.pow(4, j);
            R[i][j] = (factor * R[i][j-1] - R[i-1][j-1]) / (factor - 1);
        }
        
        // Calcular diferencias para verificar convergencia
        let errorEstimado = null;
        let diferencia = null;
        let orden = null;
        
        if (i >= 1) {
            // Usar la diferencia entre R(i,i) y R(i-1,i-1) como estimación de error
            diferencia = Math.abs(R[i][i] - R[i-1][i-1]);
            errorEstimado = diferencia;
            
            // Estimar orden de convergencia
            if (i >= 2 && R[i-1][i-1] !== R[i-2][i-2]) {
                const difAnterior = Math.abs(R[i-1][i-1] - R[i-2][i-2]);
                if (difAnterior > 0) {
                    orden = Math.log(diferencia / difAnterior) / Math.log(0.5);
                }
            }
        }
        
        const converge = (diferencia !== null && diferencia < tol);
        if (converge && nivelConvergencia === null) {
            nivelConvergencia = i;
        }
        
        progresion.push({
            nivel: i,
            subintervalos: Math.pow(2, i),
            valor: R[i][i],
            errorEstimado: errorEstimado,
            diferencia: diferencia,
            orden: orden,
            converge: converge
        });
        
        // Si convergió, podemos detenernos antes de k
        if (converge && i < k) {
            break;
        }
    }
    
    // Determinar el mejor valor (el último nivel calculado)
    const mejorNivel = nivelConvergencia !== null ? nivelConvergencia : Math.min(k, R.length - 1);
    const integral = R[mejorNivel][mejorNivel];
    
    // Información de convergencia
    const convergencia = nivelConvergencia !== null ? 
        `Convergió en nivel ${nivelConvergencia} (error < ${tol})` : 
        `No convergió en ${k} niveles (error ≥ ${tol})`;
    
    return {
        integral: integral,
        tabla: R,
        progresion: progresion,
        nivelAlcanzado: mejorNivel,
        convergencia: convergencia,
        evaluaciones: evaluaciones,
        nivelConvergencia: nivelConvergencia,
        tol: tol
    };
}

function mostrarResultadosRomberg(resultado, fStr, a, b, k, tol, solExactaStr) {
    console.log('Romberg.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.rombergResultados = resultado;
    
    // Mostrar valor de la integral
    document.getElementById('romberg-integral').textContent = formatNumber(resultado.integral, 12);
    
    // Mostrar tiempo de cálculo
    document.getElementById('romberg-tiempo').textContent = formatNumber(resultado.tiempo, 2) + ' ms';
    
    // Mostrar error
    let errorHtml = '';
    if (resultado.errorAbsoluto !== null) {
        errorHtml = `
            <span style="color: #27ae60;">${formatNumber(resultado.errorAbsoluto, 12)}</span><br>
            <small style="color: #666;">Error relativo: ${formatNumber(resultado.errorRelativo || 0, 6)}%</small>
        `;
    } else {
        const ultimoError = resultado.progresion[resultado.progresion.length - 1].errorEstimado;
        errorHtml = ultimoError !== null ? 
            `<span style="color: #27ae60;">${formatNumber(ultimoError, 12)}</span>` : 
            'No disponible';
    }
    document.getElementById('romberg-error').innerHTML = errorHtml;
    
    // Mostrar convergencia y evaluaciones
    document.getElementById('romberg-convergencia').textContent = resultado.convergencia;
    document.getElementById('romberg-evaluaciones').textContent = resultado.evaluaciones;
    
    // Mostrar información de rendimiento
    const rendimientoHtml = `
        <div><strong>Niveles calculados:</strong> ${resultado.tabla.length}</div>
        <div><strong>Mejor nivel:</strong> ${resultado.nivelAlcanzado}</div>
        <div><strong>Tolerancia:</strong> ${tol}</div>
        ${solExactaStr ? `<div><strong>Solución exacta disponible:</strong> Sí</div>` : ''}
        <div><strong>Aceleración:</strong> O(h²ʲ⁺²) donde j = ${resultado.nivelAlcanzado}</div>
    `;
    document.getElementById('romberg-rendimiento').innerHTML = rendimientoHtml;
    
    // Actualizar indicador de convergencia
    const convergenciaBar = document.getElementById('romberg-convergencia-bar');
    const convergenciaText = document.getElementById('romberg-convergencia-text');
    
    const maxNivel = resultado.tabla.length - 1;
    const porcentaje = Math.min(100, (resultado.nivelAlcanzado / k) * 100 + 
        (resultado.nivelConvergencia !== null ? 30 : 0));
    
    convergenciaBar.style.width = `${porcentaje}%`;
    convergenciaText.textContent = `O(h${2 * (resultado.nivelAlcanzado + 1)})`;
    
    // Actualizar tablas
    actualizarTablaRomberg(resultado.tabla, resultado.nivelAlcanzado);
    actualizarTablaProgresion(resultado.progresion, tol);
    
    // Crear gráficos
    crearGraficoRomberg(fStr, a, b, resultado);
    
    // Actualizar comparación con otros métodos
    actualizarComparacionMetodosRomberg(resultado, fStr, a, b);
}

function actualizarTablaRomberg(tabla, nivelAlcanzado) {
    const tbody = document.getElementById('romberg-table-body');
    tbody.innerHTML = '';
    
    const mostrarTabla = document.getElementById('romberg-mostrar-tabla').checked;
    
    for (let i = 0; i < tabla.length; i++) {
        const row = document.createElement('tr');
        
        // Resaltar fila del mejor nivel
        let rowBgColor = '';
        if (i === nivelAlcanzado) {
            rowBgColor = 'background-color: rgba(243, 156, 18, 0.1);';
        }
        
        let celdas = `<td style="font-weight: bold; color: #f39c12; ${rowBgColor}">${i}</td>`;
        
        for (let j = 0; j <= Math.min(i, 5); j++) { // Mostrar hasta j=5 para no hacer tabla muy ancha
            const valor = tabla[i][j];
            
            // Resaltar valores de la diagonal (mejores aproximaciones)
            let bgColor = '';
            if (i === j) {
                bgColor = 'background-color: rgba(46, 204, 113, 0.2);';
                if (i === nivelAlcanzado) {
                    bgColor = 'background-color: rgba(46, 204, 113, 0.4); font-weight: bold;';
                }
            }
            
            celdas += `<td style="${bgColor}">${formatNumber(valor, 10)}</td>`;
        }
        
        // Completar celdas vacías
        for (let j = Math.min(i, 5) + 1; j <= 5; j++) {
            celdas += `<td>-</td>`;
        }
        
        row.innerHTML = celdas;
        tbody.appendChild(row);
    }
    
    // Si no se muestra la tabla, ocultarla
    if (!mostrarTabla) {
        document.querySelector('.iterations-table').style.display = 'none';
    } else {
        document.querySelector('.iterations-table').style.display = 'block';
    }
}

function actualizarTablaProgresion(progresion, tol) {
    const tbody = document.getElementById('romberg-progresion-body');
    tbody.innerHTML = '';
    
    const mostrarConvergencia = document.getElementById('romberg-mostrar-convergencia').checked;
    
    progresion.forEach(prog => {
        const row = document.createElement('tr');
        
        // Resaltar filas que cumplen tolerancia
        let bgColor = '';
        if (prog.converge) {
            bgColor = 'background-color: rgba(46, 204, 113, 0.2);';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #f39c12; ${bgColor}">${prog.nivel}</td>
            <td>${prog.subintervalos}</td>
            <td>${formatNumber(prog.valor, 12)}</td>
            <td>${prog.errorEstimado !== null ? formatNumber(prog.errorEstimado, 12) : '-'}</td>
            <td>${prog.diferencia !== null ? formatNumber(prog.diferencia, 12) : '-'}</td>
            <td>${prog.orden !== null ? formatNumber(prog.orden, 4) : '-'}</td>
            <td style="font-weight: ${prog.converge ? 'bold' : 'normal'}; color: ${prog.converge ? '#27ae60' : '#666'}">
                ${prog.converge ? '✓' : '✗'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Si no se muestra la convergencia, ocultarla
    if (!mostrarConvergencia) {
        document.querySelectorAll('.iterations-table')[1].style.display = 'none';
    } else {
        document.querySelectorAll('.iterations-table')[1].style.display = 'block';
    }
}

function crearGraficoRomberg(fStr, a, b, resultado) {
    const datasets = [];
    
    // 1. Función original
    const numPuntosGrafico = 300;
    const puntosFuncion = [];
    
    for (let i = 0; i <= numPuntosGrafico; i++) {
        const x = a + (b - a) * (i / numPuntosGrafico);
        try {
            const y = evaluateExpression(fStr.replace(/x/g, `(${x})`));
            puntosFuncion.push({ x: x, y: y });
        } catch (error) {
            console.warn('Error evaluando función:', error);
            puntosFuncion.push({ x: x, y: null });
        }
    }
    
    datasets.push({
        label: `f(x) = ${fStr.substring(0, 30)}${fStr.length > 30 ? '...' : ''}`,
        data: puntosFuncion,
        borderColor: '#3498db',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 3,
        order: 1
    });
    
    // 2. Área bajo la curva
    const puntosArea = [...puntosFuncion];
    puntosArea.push({ x: b, y: 0 });
    puntosArea.push({ x: a, y: 0 });
    puntosArea.push(puntosFuncion[0]);
    
    datasets.push({
        label: 'Área bajo la curva',
        data: puntosArea,
        borderColor: 'transparent',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 0,
        order: 0
    });
    
    // 3. Puntos de evaluación para diferentes niveles (solo primeros 3)
    const coloresNiveles = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
    const nivelesMostrar = Math.min(3, resultado.progresion.length - 1);
    
    for (let n = 0; n <= nivelesMostrar; n++) {
        const subintervalos = Math.pow(2, n);
        const h = (b - a) / subintervalos;
        const puntosEval = [];
        
        // Puntos extremos
        puntosEval.push({ x: a, y: evaluateExpression(fStr.replace(/x/g, `(${a})`)) });
        puntosEval.push({ x: b, y: evaluateExpression(fStr.replace(/x/g, `(${b})`)) });
        
        // Puntos medios para n > 0
        if (n > 0) {
            for (let i = 1; i < subintervalos; i++) {
                const x = a + i * h;
                const y = evaluateExpression(fStr.replace(/x/g, `(${x})`));
                puntosEval.push({ x: x, y: y });
            }
        }
        
        datasets.push({
            label: `Nivel ${n} (${subintervalos} subint.)`,
            data: puntosEval,
            borderColor: coloresNiveles[n % coloresNiveles.length],
            backgroundColor: coloresNiveles[n % coloresNiveles.length] + '80',
            pointRadius: 4,
            pointHoverRadius: 8,
            showLine: false,
            order: 2 + n,
            pointStyle: n === 0 ? 'circle' : n === 1 ? 'rect' : 'triangle'
        });
    }
    
    // 4. Valor de la integral como línea horizontal
    const alturaMedia = resultado.integral / (b - a);
    datasets.push({
        label: `Integral Romberg: ${formatNumber(resultado.integral, 6)}`,
        data: [
            { x: a, y: alturaMedia },
            { x: b, y: alturaMedia }
        ],
        borderColor: '#f39c12',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0,
        pointRadius: 0,
        borderWidth: 3,
        borderDash: [5, 5],
        order: 100
    });
    
    // 5. Línea base y = 0
    datasets.push({
        label: 'Eje x',
        data: [{ x: a, y: 0 }, { x: b, y: 0 }],
        borderColor: 'rgba(0, 0, 0, 0.3)',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0,
        pointRadius: 0,
        borderWidth: 1,
        order: 99
    });
    
    const data = { datasets };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    filter: function(item) {
                        return !item.text.includes('Eje x'); // Ocultar eje x de leyenda
                    }
                }
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
                            if (context.dataset.label.includes('Integral')) {
                                label += `Área = ${formatNumber(resultado.integral, 8)}`;
                            } else {
                                label += `y = ${formatNumber(context.parsed.y, 4)}`;
                            }
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
    
    createChart('romberg-chart', data, options);
}

function actualizarComparacionMetodosRomberg(resultadoRomberg, fStr, a, b) {
    const tbody = document.getElementById('romberg-comparacion-body');
    tbody.innerHTML = '';
    
    // Calcular otros métodos para comparación
    const calcularTrapecio = (n) => {
        const h = (b - a) / n;
        let suma = evaluateExpression(fStr, a) + evaluateExpression(fStr, b);
        let evalCount = 2;
        for (let i = 1; i < n; i++) {
            suma += evaluateExpression(fStr, a + i * h);
            evalCount++;
        }
        return { valor: h * suma / 2, evaluaciones: evalCount };
    };
    
    const calcularSimpson13 = (n) => {
        if (n % 2 !== 0) n++;
        const h = (b - a) / n;
        let suma = evaluateExpression(fStr, a) + evaluateExpression(fStr, b);
        let sumOdd = 0, sumEven = 0;
        let evalCount = 2;
        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            const fxi = evaluateExpression(fStr, xi);
            evalCount++;
            if (i % 2 === 1) sumOdd += fxi;
            else sumEven += fxi;
        }
        return { valor: (h / 3) * (suma + 4 * sumOdd + 2 * sumEven), evaluaciones: evalCount };
    };
    
    const calcularSimpson38 = (n) => {
        while (n % 3 !== 0) n++;
        const h = (b - a) / n;
        let suma = evaluateExpression(fStr, a) + evaluateExpression(fStr, b);
        let sum3_nonmultiples = 0, sum3_multiples = 0;
        let evalCount = 2;
        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            const fxi = evaluateExpression(fStr, xi);
            evalCount++;
            if (i % 3 === 0) sum3_multiples += fxi;
            else sum3_nonmultiples += fxi;
        }
        return { valor: (3 * h / 8) * (suma + 3 * sum3_nonmultiples + 2 * sum3_multiples), evaluaciones: evalCount };
    };
    
    // Calcular métodos con número similar de evaluaciones
    const n_trapecio = Math.pow(2, resultadoRomberg.nivelAlcanzado);
    const n_simpson13 = Math.floor(n_trapecio / 2) * 2;
    const n_simpson38 = Math.ceil(n_trapecio / 3) * 3;
    
    const resultados = [
        {
            metodo: 'Trapecio',
            resultado: calcularTrapecio(n_trapecio),
            n: n_trapecio,
            orden: 'O(h²)',
            color: '#3498db'
        },
        {
            metodo: 'Simpson 1/3',
            resultado: calcularSimpson13(n_simpson13),
            n: n_simpson13,
            orden: 'O(h⁴)',
            color: '#9b59b6'
        },
        {
            metodo: 'Simpson 3/8',
            resultado: calcularSimpson38(n_simpson38),
            n: n_simpson38,
            orden: 'O(h⁴)',
            color: '#e74c3c'
        },
        {
            metodo: 'Romberg',
            resultado: { valor: resultadoRomberg.integral, evaluaciones: resultadoRomberg.evaluaciones },
            n: resultadoRomberg.nivelAlcanzado,
            orden: `O(h${2 * (resultadoRomberg.nivelAlcanzado + 1)})`,
            color: '#f39c12'
        }
    ];
    
    // Ordenar por número de evaluaciones
    resultados.sort((a, b) => a.resultado.evaluaciones - b.resultado.evaluaciones);
    
    resultados.forEach(r => {
        const row = document.createElement('tr');
        const ventaja = getVentajaRomberg(r.metodo, r.resultado.evaluaciones, r.orden);
        
        row.innerHTML = `
            <td style="font-weight: bold; color: ${r.color};">
                <i class="fas fa-${r.metodo === 'Trapecio' ? 'layer-group' : 
                                  r.metodo === 'Simpson 1/3' ? 'parabola' : 
                                  r.metodo === 'Simpson 3/8' ? 'cube' : 'rocket'}"></i>
                ${r.metodo}
            </td>
            <td style="font-family: monospace;">${formatNumber(r.resultado.valor, 10)}</td>
            <td>${r.resultado.evaluaciones}</td>
            <td>${r.orden}</td>
            <td style="font-size: 0.9rem;">${ventaja}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Crear gráfico de comparación
    crearGraficoComparacionRomberg(resultados);
}

function getVentajaRomberg(metodo, evaluaciones, orden) {
    switch(metodo) {
        case 'Trapecio':
            return 'Simple pero lenta convergencia';
        case 'Simpson 1/3':
            return 'Buena para n par, O(h⁴)';
        case 'Simpson 3/8':
            return 'Buena para n múltiplo de 3';
        case 'Romberg':
            return 'Convergencia acelerada, reutiliza evaluaciones';
        default:
            return '';
    }
}

function crearGraficoComparacionRomberg(resultados) {
    const labels = resultados.map(r => r.metodo);
    const evaluaciones = resultados.map(r => r.resultado.evaluaciones);
    const valores = resultados.map(r => r.resultado.valor);
    const colors = resultados.map(r => r.color + '80');
    const borderColors = resultados.map(r => r.color);
    
    const data = {
        labels: labels,
        datasets: [{
            label: 'Evaluaciones de función',
            data: evaluaciones,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 5,
            yAxisID: 'y'
        }, {
            label: 'Valor de la integral',
            data: valores,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderColor: '#2c3e50',
            borderWidth: 2,
            type: 'line',
            fill: false,
            pointRadius: 6,
            yAxisID: 'y1'
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Evaluaciones de función'
                },
                beginAtZero: true
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Valor de la integral'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    };
    
    createChart('romberg-comparacion-chart', data, options, 'bar');
}

function mostrarMasEjemploRomberg() {
    const ejemplosExtras = [
        {
            nombre: "Función con Singularidad",
            descripcion: "∫ √x ln(x) dx de 0 a 1 (manejo de singularidad)",
            funcion: "sqrt(x)*log(x+1e-10)",
            a: "0",
            b: "1",
            nivel: "6",
            tol: "0.000001",
            solExacta: "-4/9",
            nota: "Romberg maneja bien singularidades suaves"
        },
        {
            nombre: "Integral de Fresnel",
            descripcion: "C(1) = ∫ cos(πx²/2) dx de 0 a 1 (óptica física)",
            funcion: "cos(3.141592653589793*x*x/2)",
            a: "0",
            b: "1",
            nivel: "7",
            tol: "0.0000001",
            solExacta: "",
            nota: "Integral de Fresnel - importante en difracción"
        },
        {
            nombre: "Función de Bessel",
            descripcion: "J₀(1) = (1/π)∫ cos(sin θ) dθ de 0 a π",
            funcion: "cos(sin(x))",
            a: "0",
            b: "3.141592653589793",
            nivel: "6",
            tol: "0.000001",
            solExacta: "",
            nota: "Representación integral de función de Bessel"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="romberg-mas-ejemplos-modal">
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
                                <h5 style="color: #f39c12; margin-bottom: 0.5rem;">
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
                                <button class="cargar-romberg-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #f39c12; color: white; border: none; padding: 0.5rem 1rem; 
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
    const modalExistente = document.getElementById('romberg-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('romberg-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-romberg-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoRomberg(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarRomberg() {
    console.log('Romberg.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('romberg-func').value = '';
    document.getElementById('romberg-a').value = '0';
    document.getElementById('romberg-b').value = '3.1416';
    document.getElementById('romberg-nivel').value = '5';
    document.getElementById('romberg-tol').value = '0.000001';
    document.getElementById('romberg-sol-exacta').value = '';
    document.getElementById('romberg-mostrar-tabla').checked = true;
    document.getElementById('romberg-mostrar-convergencia').checked = true;
    
    // Limpiar resultados
    document.getElementById('romberg-integral').textContent = '-';
    document.getElementById('romberg-tiempo').textContent = '-';
    document.getElementById('romberg-error').textContent = '-';
    document.getElementById('romberg-convergencia').textContent = '-';
    document.getElementById('romberg-evaluaciones').textContent = '-';
    document.getElementById('romberg-rendimiento').innerHTML = '';
    document.getElementById('romberg-table-body').innerHTML = '';
    document.getElementById('romberg-progresion-body').innerHTML = '';
    document.getElementById('romberg-comparacion-body').innerHTML = '';
    
    // Restablecer indicador de convergencia
    document.getElementById('romberg-convergencia-bar').style.width = '0%';
    document.getElementById('romberg-convergencia-text').textContent = 'O(h²)';
    
    // Mostrar tablas
    document.querySelectorAll('.iterations-table').forEach(t => t.style.display = 'block');
    document.getElementById('romberg-comparacion-section').style.display = 'block';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('romberg-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['romberg-chart', 'romberg-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('romberg-chart').getContext('2d');
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
    window.charts['romberg-chart'] = emptyChart;
    
    console.log('Romberg.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaRomberg() {
    console.log("=== PRUEBA DE MÉTODO DE ROMBERG ===");
    
    try {
        const fStr = "exp(-x)*sin(x)";
        const a = 0;
        const b = Math.PI;
        const k = 5;
        const tol = 1e-6;
        
        const resultado = calcularIntegralRomberg(fStr, a, b, k, tol);
        
        console.log(`∫[${a}, ${b}] ${fStr} dx con Romberg (k=${k}, tol=${tol})`);
        console.log("Valor aproximado:", resultado.integral);
        console.log("Valor teórico:", 0.5 * (1 - Math.exp(-Math.PI)));
        console.log("Nivel alcanzado:", resultado.nivelAlcanzado);
        console.log("Evaluaciones:", resultado.evaluaciones);
        console.log("Convergencia:", resultado.convergencia);
        console.log("\nTabla de Romberg:");
        resultado.tabla.forEach((fila, i) => {
            console.log(`  Nivel ${i}:`, fila.map(v => formatNumber(v, 8)));
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaRomberg);