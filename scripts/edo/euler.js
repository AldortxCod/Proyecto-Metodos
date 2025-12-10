// euler.js - Método de Euler - VERSIÓN CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('Euler.js: Cargado');
    
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'edo') {
            console.log('Euler.js: Sección EDO activada');
            setTimeout(inicializarEuler, 300);
        }
    });
    
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'euler') {
            console.log('Euler.js: Método Euler seleccionado');
            setTimeout(inicializarEuler, 100);
        }
    });
    
    setTimeout(verificarEulerVisibilidad, 1000);
});

function verificarEulerVisibilidad() {
    const eulerContent = document.getElementById('euler-content');
    if (eulerContent && !eulerContent.classList.contains('hidden')) {
        console.log('Euler.js: Ya visible al cargar');
        inicializarEuler();
    }
}

function inicializarEuler() {
    console.log('Euler.js: Inicializando...');
    
    const eulerContent = document.getElementById('euler-content');
    if (!eulerContent) {
        console.error('Euler.js: Error - Contenedor no encontrado');
        return;
    }
    
    if (eulerContent.innerHTML.trim() === '' || !document.getElementById('euler-func')) {
        console.log('Euler.js: Creando interfaz...');
        crearInterfazEuler();
    }
    
    asignarEventosEuler();
    
    // Cargar ejemplo lineal por defecto (no exponencial)
    setTimeout(() => {
        console.log('Euler: Cargando ejemplo por defecto...');
        cargarEjemploEuler('lineal');
    }, 500);
}

function crearInterfazEuler() {
    const content = document.getElementById('euler-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-wave-square"></i> Método de Euler</h3>
            <p>Aplicación: Resolución numérica de ecuaciones diferenciales ordinarias</p>
            
            <div class="ejemplos-rapidos" style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; border: 1px solid #dee2e6;">
                <strong><i class="fas fa-bolt"></i> Ejemplos rápidos:</strong>
                <div class="ejemplo-buttons" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="ejemplo-btn" data-ejemplo="lineal">Función lineal</button>
                    <button class="ejemplo-btn" data-ejemplo="cuadratica">Función cuadrática</button>
                    <button class="ejemplo-btn" data-ejemplo="exponencial">Crecimiento exponencial</button>
                    <button class="ejemplo-btn" data-ejemplo="senoidal">Oscilación senoidal</button>
                    <button class="ejemplo-btn" data-ejemplo="logistico">Crecimiento logístico</button>
                    <button class="ejemplo-btn" data-ejemplo="trigonometrica">EDO trigonométrica</button>
                    <button class="ejemplo-btn" data-ejemplo="exponencial2">Exponencial compleja</button>
                </div>
                <small style="display: block; margin-top: 0.5rem; color: #666;">Haz clic en un ejemplo para cargarlo</small>
            </div>
            
            <div class="input-group">
                <label for="euler-func"><i class="fas fa-function"></i> EDO: dy/dx = f(x, y):</label>
                <input type="text" id="euler-func" placeholder="1" value="1">
                <small>Ejemplos: 1, x, y, x+y, 2*y, sin(x), exp(x), 0.1*y*(1-y/1000)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="euler-x0"><i class="fas fa-dot-circle"></i> x inicial (x₀):</label>
                    <input type="number" id="euler-x0" value="0" step="0.1">
                </div>
                <div class="input-group">
                    <label for="euler-y0"><i class="fas fa-dot-circle"></i> y inicial (y₀):</label>
                    <input type="number" id="euler-y0" value="0" step="0.1">
                </div>
                <div class="input-group">
                    <label for="euler-xf"><i class="fas fa-flag-checkered"></i> x final (x_f):</label>
                    <input type="number" id="euler-xf" value="5" step="0.1">
                </div>
                <div class="input-group">
                    <label for="euler-h"><i class="fas fa-ruler"></i> Tamaño de paso (h):</label>
                    <input type="number" id="euler-h" value="0.5" step="0.01">
                </div>
            </div>
            
            <div class="input-group">
                <label for="euler-sol-exacta"><i class="fas fa-check-double"></i> Solución exacta (opcional):</label>
                <input type="text" id="euler-sol-exacta" placeholder="x" value="x">
                <small>Para calcular error. Usa exp(), sin(), cos(), x^2, etc.</small>
            </div>
            
            <div class="button-group">
                <button id="euler-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular</button>
                <button id="euler-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
                <button id="euler-info" class="info-btn"><i class="fas fa-info-circle"></i> Ayuda</button>
            </div>
            
            <div class="info-box" id="euler-info-box" style="display: none; margin-top: 1rem; padding: 1rem; background: #e8f4f8; border-radius: 6px; border-left: 4px solid #3498db;">
                <h4><i class="fas fa-lightbulb"></i> Instrucciones:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li>Escribe la EDO: dy/dx = f(x,y)</li>
                    <li>Usa x para variable independiente, y para dependiente</li>
                    <li>Operadores: +, -, *, /, ^ (potencia)</li>
                    <li>Funciones: exp(), sin(), cos(), tan(), sqrt(), log(), abs()</li>
                    <li>Constantes: pi, e</li>
                    <li>Ejemplo: "0.1*y*(1-y/1000)" para crecimiento logístico</li>
                </ul>
            </div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados</h3>
            
            <div class="result-summary">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>y(x_f):</h4>
                        <p id="euler-yfinal" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-redo"></i>
                    </div>
                    <div class="result-content">
                        <h4>Pasos:</h4>
                        <p id="euler-pasos" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="result-content">
                        <h4>Error absoluto:</h4>
                        <p id="euler-error" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="result-content">
                        <h4>Error %:</h4>
                        <p id="euler-error-porcentaje" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-area"></i> Solución Aproximada vs Exacta</h4>
                    <div class="chart-wrapper">
                        <canvas id="euler-chart"></canvas>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.85em; color: #666;">
                        <span style="color: #3498db;">● Aproximación de Euler</span>
                        <span style="margin-left: 1rem; color: #e74c3c;">● Solución exacta (si se proporciona)</span>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Iteraciones</h4>
                    <div class="table-wrapper">
                        <table id="euler-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-hashtag"></i> n</th>
                                    <th><i class="fas fa-x"></i> xₙ</th>
                                    <th><i class="fas fa-y"></i> yₙ</th>
                                    <th><i class="fas fa-sliders-h"></i> f(xₙ, yₙ)</th>
                                    <th><i class="fas fa-calculator"></i> yₙ₊₁</th>
                                    <th><i class="fas fa-percentage"></i> Error</th>
                                </tr>
                            </thead>
                            <tbody id="euler-table-body">
                                <tr><td colspan="6" class="empty-table">Haz clic en un ejemplo o ingresa tus datos</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('Euler.js: Interfaz creada correctamente');
    
    // Asignar eventos a los botones de ejemplo
    setTimeout(() => {
        document.querySelectorAll('.ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ejemplo = this.getAttribute('data-ejemplo');
                cargarEjemploEuler(ejemplo);
            });
        });
    }, 100);
}

function asignarEventosEuler() {
    console.log('Euler.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('euler-calc');
    const clearBtn = document.getElementById('euler-clear');
    const infoBtn = document.getElementById('euler-info');
    
    if (!calcBtn) {
        console.error('Euler.js: Botón calcular no encontrado');
        return;
    }
    
    calcBtn.removeEventListener('click', calcularEuler);
    clearBtn?.removeEventListener('click', limpiarEuler);
    infoBtn?.removeEventListener('click', toggleInfoEuler);
    
    calcBtn.addEventListener('click', calcularEuler);
    if (clearBtn) clearBtn.addEventListener('click', limpiarEuler);
    if (infoBtn) infoBtn.addEventListener('click', toggleInfoEuler);
    
    console.log('Euler.js: Eventos asignados correctamente');
}

function toggleInfoEuler() {
    const infoBox = document.getElementById('euler-info-box');
    if (infoBox) {
        infoBox.style.display = infoBox.style.display === 'none' ? 'block' : 'none';
    }
}

// FUNCIÓN MEJORADA PARA EVALUAR EXPRESIONES - CORREGIDA
function evaluateMathExpression(expr, x, y) {
    try {
        // Limpiar la expresión
        let cleanExpr = expr
            .trim()
            .replace(/\s+/g, '')  // Eliminar espacios
            
        // Reemplazar ^ por ** para potencia
        cleanExpr = cleanExpr.replace(/\^/g, '**');
        
        // Reemplazar constantes
        cleanExpr = cleanExpr
            .replace(/pi/gi, Math.PI.toString())
            .replace(/e/gi, Math.E.toString());
        
        // Función para reemplazar variables
        const replaceVariables = (expression) => {
            // Primero reemplazar 'x' y 'y' rodeadas de operadores o al inicio/final
            let result = expression;
            
            // Reemplazar 'x' con su valor
            result = result.replace(/(^|[+\-*/(,])x([+\-*/),]|$)/g, `$1(${x})$2`);
            // Reemplazar 'y' con su valor
            result = result.replace(/(^|[+\-*/(,])y([+\-*/),]|$)/g, `$1(${y})$2`);
            
            // Casos especiales al inicio o final
            if (result === 'x') result = x.toString();
            if (result === 'y') result = y.toString();
            
            return result;
        };
        
        // Reemplazar funciones matemáticas ANTES de las variables
        cleanExpr = cleanExpr
            .replace(/exp\(/gi, 'Math.exp(')
            .replace(/sqrt\(/gi, 'Math.sqrt(')
            .replace(/sin\(/gi, 'Math.sin(')
            .replace(/cos\(/gi, 'Math.cos(')
            .replace(/tan\(/gi, 'Math.tan(')
            .replace(/ln\(/gi, 'Math.log(')
            .replace(/log\(/gi, 'Math.log10(')
            .replace(/abs\(/gi, 'Math.abs(');
        
        // Ahora reemplazar variables
        cleanExpr = replaceVariables(cleanExpr);
        
        console.log(`Expresión procesada: ${cleanExpr}`);
        
        // Validar expresión segura
        const safePattern = /^[0-9+\-*/().Math,]*$/;
        if (!safePattern.test(cleanExpr.replace(/Math\.(exp|sqrt|sin|cos|tan|log|log10|abs)\(/g, ''))) {
            throw new Error('Expresión contiene caracteres no permitidos');
        }
        
        // Evaluar usando Function
        const result = Function(`"use strict"; return (${cleanExpr})`)();
        
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            throw new Error('Resultado no es un número válido');
        }
        
        return result;
    } catch (error) {
        console.error(`Error en evaluateMathExpression:`, error);
        throw new Error(`Error evaluando "${expr}": ${error.message}`);
    }
}

// DICCIONARIO DE EJEMPLOS - CORREGIDO
const ejemplosEuler = {
    lineal: {
        nombre: "Función lineal",
        func: "1",
        x0: 0,
        y0: 0,
        xf: 5,
        h: 0.5,
        solExacta: "x",
        descripcion: "dy/dx = 1, y(0)=0, Solución exacta: y = x"
    },
    cuadratica: {
        nombre: "Función cuadrática",
        func: "2*x",
        x0: 0,
        y0: 0,
        xf: 4,
        h: 0.5,
        solExacta: "x^2",
        descripcion: "dy/dx = 2x, y(0)=0, Solución exacta: y = x²"
    },
    exponencial: {
        nombre: "Crecimiento exponencial",
        func: "y",
        x0: 0,
        y0: 1,
        xf: 2,
        h: 0.2,
        solExacta: "exp(x)",
        descripcion: "dy/dx = y, y(0)=1, Solución exacta: y = e^x"
    },
    senoidal: {
        nombre: "Oscilación senoidal",
        func: "cos(x)",
        x0: 0,
        y0: 0,
        xf: 6.28,
        h: 0.5,
        solExacta: "sin(x)",
        descripcion: "dy/dx = cos(x), y(0)=0, Solución exacta: y = sin(x)"
    },
    logistico: {
        nombre: "Crecimiento logístico",
        func: "0.1*y*(1 - y/1000)",
        x0: 0,
        y0: 100,
        xf: 50,
        h: 1,
        solExacta: "",
        descripcion: "Crecimiento logístico: dy/dx = 0.1y(1-y/1000). Capacidad: 1000"
    },
    trigonometrica: {
        nombre: "EDO trigonométrica",
        func: "x*cos(x) - y",
        x0: 0,
        y0: 0,
        xf: 5,
        h: 0.2,
        solExacta: "",
        descripcion: "dy/dx = x·cos(x) - y (sin solución exacta conocida)"
    },
    exponencial2: {
        nombre: "Exponencial amortiguada",
        func: "-0.5*y",
        x0: 0,
        y0: 100,
        xf: 10,
        h: 0.5,
        solExacta: "100*exp(-0.5*x)",
        descripcion: "dy/dx = -0.5y, y(0)=100, Solución: y = 100·e^(-0.5x)"
    }
};

function cargarEjemploEuler(tipo = 'lineal') {
    const ejemplo = ejemplosEuler[tipo];
    if (!ejemplo) {
        console.error(`Ejemplo ${tipo} no encontrado`);
        return;
    }
    
    console.log(`Cargando ejemplo: ${ejemplo.nombre}`);
    
    document.getElementById('euler-func').value = ejemplo.func;
    document.getElementById('euler-x0').value = ejemplo.x0;
    document.getElementById('euler-y0').value = ejemplo.y0;
    document.getElementById('euler-xf').value = ejemplo.xf;
    document.getElementById('euler-h').value = ejemplo.h;
    document.getElementById('euler-sol-exacta').value = ejemplo.solExacta;
    
    // Mostrar descripción
    const ejemplosBox = document.querySelector('.ejemplos-rapidos');
    if (ejemplosBox) {
        const descripcion = document.createElement('div');
        descripcion.style.marginTop = '0.5rem';
        descripcion.style.padding = '0.5rem';
        descripcion.style.background = '#e8f4f8';
        descripcion.style.borderRadius = '4px';
        descripcion.style.fontSize = '0.9em';
        descripcion.innerHTML = `<strong>${ejemplo.nombre}:</strong> ${ejemplo.descripcion}`;
        
        // Remover descripción anterior si existe
        const oldDesc = ejemplosBox.querySelector('.ejemplo-descripcion');
        if (oldDesc) oldDesc.remove();
        
        descripcion.className = 'ejemplo-descripcion';
        ejemplosBox.appendChild(descripcion);
    }
    
    // Calcular automáticamente después de cargar
    setTimeout(calcularEuler, 300);
}

function calcularEuler() {
    console.log('Euler.js: Iniciando cálculo...');
    
    const funcEl = document.getElementById('euler-func');
    const x0El = document.getElementById('euler-x0');
    const y0El = document.getElementById('euler-y0');
    const xfEl = document.getElementById('euler-xf');
    const hEl = document.getElementById('euler-h');
    const solExactaEl = document.getElementById('euler-sol-exacta');
    
    if (!funcEl || !x0El || !y0El || !xfEl || !hEl) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const funcStr = funcEl.value.trim();
    
    if (!funcStr) {
        alert('Ingresa la ecuación diferencial');
        funcEl.focus();
        return;
    }
    
    // Validar valores numéricos
    let x0, y0, xf, h;
    
    try {
        x0 = parseFloat(x0El.value);
        if (isNaN(x0)) throw new Error('x inicial no es número');
        
        y0 = parseFloat(y0El.value);
        if (isNaN(y0)) throw new Error('y inicial no es número');
        
        xf = parseFloat(xfEl.value);
        if (isNaN(xf)) throw new Error('x final no es número');
        
        h = parseFloat(hEl.value);
        if (isNaN(h) || h <= 0) throw new Error('h debe ser > 0');
        
        if (xf === x0) throw new Error('x final no puede ser igual a x inicial');
    } catch (error) {
        alert(error.message);
        return;
    }
    
    const solExactaStr = solExactaEl ? solExactaEl.value.trim() : '';
    
    // Probar que se puede evaluar la función
    try {
        const test = evaluateMathExpression(funcStr, x0, y0);
        console.log(`Test: f(${x0}, ${y0}) = ${test}`);
    } catch (error) {
        alert('Error en la función: ' + error.message + 
              '\n\nEjemplos válidos: 1, x, y, x+y, 2*y, sin(x), exp(x)');
        return;
    }
    
    const calcBtn = document.getElementById('euler-calc');
    const originalText = calcBtn.innerHTML;
    calcBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
    calcBtn.disabled = true;
    
    setTimeout(() => {
        try {
            console.log('Euler.js: Ejecutando método...');
            const inicio = performance.now();
            const resultados = metodoEuler(funcStr, x0, y0, xf, h, solExactaStr);
            const fin = performance.now();
            resultados.tiempo = (fin - inicio).toFixed(2);
            
            mostrarResultadosEuler(resultados);
        } catch (error) {
            console.error('Euler.js error:', error);
            alert('Error en cálculo: ' + error.message);
        } finally {
            calcBtn.innerHTML = originalText;
            calcBtn.disabled = false;
        }
    }, 50);
}

function metodoEuler(funcStr, x0, y0, xf, h, solExactaStr = '') {
    console.log(`Euler.js: x0=${x0}, y0=${y0}, xf=${xf}, h=${h}`);
    
    const pasos = [];
    
    // Calcular número de pasos
    const n = Math.ceil(Math.abs(xf - x0) / h);
    if (n === 0) throw new Error('Número de pasos es cero');
    const hAjustado = (xf - x0) / n;
    
    console.log(`Euler.js: ${n} pasos, h ajustado=${hAjustado}`);
    
    // Inicializar valores
    let xn = x0;
    let yn = y0;
    
    // Función para solución exacta si existe
    let solExacta = null;
    if (solExactaStr) {
        solExacta = (x) => {
            return evaluateMathExpression(solExactaStr, x, 0);
        };
    }
    
    // PRIMER PASO
    const fxy0 = evaluateMathExpression(funcStr, xn, yn);
    pasos.push({
        n: 0,
        x: xn,
        y: yn,
        fxy: fxy0,
        yn1: yn + hAjustado * fxy0,
        errorLocal: solExacta ? Math.abs(yn - solExacta(xn)) : null,
        yExacta: solExacta ? solExacta(xn) : null
    });
    
    // BUCLE PRINCIPAL
    for (let i = 0; i < n; i++) {
        // Calcular f(xn, yn)
        const fxy = evaluateMathExpression(funcStr, xn, yn);
        
        // Calcular siguiente valor usando fórmula de Euler
        const yn1 = yn + hAjustado * fxy;
        
        // Calcular error si hay solución exacta
        let errorLocal = null;
        let yExacta = null;
        if (solExacta) {
            try {
                yExacta = solExacta(xn + hAjustado);
                errorLocal = Math.abs(yn1 - yExacta);
            } catch (e) {
                console.warn(`No se pudo calcular solución exacta en x=${xn + hAjustado}`);
            }
        }
        
        // Guardar paso
        const nextFxy = i < n-1 ? evaluateMathExpression(funcStr, xn + hAjustado, yn1) : null;
        
        pasos.push({
            n: i + 1,
            x: xn + hAjustado,
            y: yn1,
            fxy: nextFxy,
            yn1: i < n-1 ? yn1 + hAjustado * nextFxy : null,
            errorLocal: errorLocal,
            yExacta: yExacta
        });
        
        // Actualizar para siguiente iteración
        xn = xn + hAjustado;
        yn = yn1;
    }
    
    // Calcular error global
    let errorGlobal = null;
    let errorPorcentaje = null;
    if (solExacta) {
        try {
            const yFinalExacta = solExacta(xf);
            errorGlobal = Math.abs(yn - yFinalExacta);
            errorPorcentaje = yFinalExacta !== 0 ? 
                (errorGlobal / Math.abs(yFinalExacta)) * 100 : null;
        } catch (e) {
            console.warn('No se pudo calcular error global');
        }
    }
    
    return {
        pasos: pasos,
        yFinal: yn,
        numPasos: n,
        errorGlobal: errorGlobal,
        errorPorcentaje: errorPorcentaje,
        hAjustado: hAjustado,
        x0: x0,
        xf: xf,
        funcStr: funcStr,
        solExactaStr: solExactaStr
    };
}

function mostrarResultadosEuler(resultados) {
    console.log('Euler.js: Mostrando resultados...');
    
    const format = (num, decimals = 6) => {
        if (num === null || num === undefined || isNaN(num)) return 'N/A';
        if (Math.abs(num) < 1e-10) return '0';
        return parseFloat(num.toFixed(decimals)).toString();
    };
    
    const formatPorcentaje = (num) => {
        if (num === null || num === undefined || isNaN(num)) return 'N/A';
        return num.toFixed(2) + '%';
    };
    
    document.getElementById('euler-yfinal').textContent = format(resultados.yFinal);
    document.getElementById('euler-pasos').textContent = resultados.numPasos;
    document.getElementById('euler-error').textContent = format(resultados.errorGlobal);
    document.getElementById('euler-error-porcentaje').textContent = formatPorcentaje(resultados.errorPorcentaje);
    
    actualizarTablaEuler(resultados.pasos, format);
    crearGraficoEuler(resultados, format);
}

function actualizarTablaEuler(pasos, format) {
    const tbody = document.getElementById('euler-table-body');
    if (!tbody) return;
    
    if (pasos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-table">No hay resultados</td></tr>';
        return;
    }
    
    let html = '';
    pasos.forEach(paso => {
        const hasError = paso.errorLocal !== null;
        const rowClass = hasError && paso.errorLocal > 0.1 ? 'error-high' : '';
        
        html += `
            <tr class="${rowClass}">
                <td>${paso.n}</td>
                <td>${format(paso.x, 4)}</td>
                <td>${format(paso.y)}</td>
                <td>${format(paso.fxy)}</td>
                <td>${paso.yn1 !== null ? format(paso.yn1) : '-'}</td>
                <td>${paso.errorLocal !== null ? format(paso.errorLocal, 6) : '-'}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function crearGraficoEuler(resultados, format) {
    const canvas = document.getElementById('euler-chart');
    if (!canvas) return;
    
    if (window.eulerChart) {
        window.eulerChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    try {
        // Datos de Euler (puntos calculados)
        const puntosEuler = resultados.pasos.map(p => ({ x: p.x, y: p.y }));
        
        // Datos para solución exacta si existe
        let puntosExacta = [];
        if (resultados.solExactaStr) {
            const nPuntos = 100;
            const xMin = Math.min(resultados.x0, resultados.xf);
            const xMax = Math.max(resultados.x0, resultados.xf);
            
            for (let i = 0; i <= nPuntos; i++) {
                const x = xMin + (xMax - xMin) * (i / nPuntos);
                try {
                    const y = evaluateMathExpression(resultados.solExactaStr, x, 0);
                    if (!isNaN(y) && isFinite(y)) {
                        puntosExacta.push({ x: x, y: y });
                    }
                } catch (e) {
                    console.warn(`No se pudo calcular punto exacto en x=${x}`);
                }
            }
        }
        
        const datasets = [
            {
                label: 'Aproximación de Euler',
                data: puntosEuler,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: false,
                tension: 0,
                stepped: false
            }
        ];
        
        if (puntosExacta.length > 0) {
            datasets.push({
                label: 'Solución exacta',
                data: puntosExacta,
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.3,
                borderDash: [5, 5]
            });
        }
        
        window.eulerChart = new Chart(ctx, {
            type: 'line',
            data: { datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'top',
                        labels: {
                            font: { size: 12 },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                const x = context.parsed.x;
                                return `${label}: y(${format(x, 3)}) = ${format(value, 4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { 
                            display: true, 
                            text: 'x',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    y: {
                        title: { 
                            display: true, 
                            text: 'y(x)',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        beginAtZero: false
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        console.log('Euler.js: Gráfico creado exitosamente');
        
    } catch (chartError) {
        console.error('Euler.js: Error al crear gráfico:', chartError);
        canvas.parentElement.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #f39c12;"></i>
                <p>No se pudo crear el gráfico</p>
                <p style="font-size: 0.9em;">${chartError.message}</p>
            </div>
        `;
    }
}

function limpiarEuler() {
    console.log('Euler.js: Limpiando...');
    
    document.getElementById('euler-func').value = '1';
    document.getElementById('euler-x0').value = '0';
    document.getElementById('euler-y0').value = '0';
    document.getElementById('euler-xf').value = '5';
    document.getElementById('euler-h').value = '0.5';
    document.getElementById('euler-sol-exacta').value = 'x';
    
    document.getElementById('euler-yfinal').textContent = '-';
    document.getElementById('euler-pasos').textContent = '-';
    document.getElementById('euler-error').textContent = '-';
    document.getElementById('euler-error-porcentaje').textContent = '-';
    
    const tbody = document.getElementById('euler-table-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-table">Haz clic en un ejemplo o ingresa tus datos</td></tr>';
    }
    
    if (window.eulerChart) {
        window.eulerChart.destroy();
        window.eulerChart = null;
    }
    
    // Remover descripción de ejemplo
    const descripcion = document.querySelector('.ejemplo-descripcion');
    if (descripcion) descripcion.remove();
}

// FUNCIÓN DE PRUEBA SIMPLE
window.probarEuler = function() {
    console.log('=== PRUEBA SIMPLE DEL MÉTODO EULER ===\n');
    
    // Probar la función de evaluación
    console.log('1. Probando función de evaluación:');
    
    const tests = [
        { expr: '1', x: 0, y: 0, expected: 1 },
        { expr: 'x', x: 3, y: 0, expected: 3 },
        { expr: 'y', x: 0, y: 5, expected: 5 },
        { expr: 'x+y', x: 2, y: 3, expected: 5 },
        { expr: '2*x', x: 4, y: 0, expected: 8 },
        { expr: 'sin(x)', x: Math.PI/2, y: 0, expected: 1 },
        { expr: 'exp(x)', x: 0, y: 0, expected: 1 }
    ];
    
    tests.forEach(test => {
        try {
            const result = evaluateMathExpression(test.expr, test.x, test.y);
            const diff = Math.abs(result - test.expected);
            const ok = diff < 0.0001 ? '✓' : '✗';
            console.log(`   ${test.expr} (x=${test.x}, y=${test.y}) = ${result} ${ok}`);
        } catch (error) {
            console.log(`   ${test.expr} ERROR: ${error.message}`);
        }
    });
    
    console.log('\n2. Ejemplo lineal (dy/dx = 1):');
    console.log('   Cargando y calculando...');
    cargarEjemploEuler('lineal');
    
    return 'Prueba completada. Revisa la interfaz para ver los resultados.';
};

console.log('Euler.js: Cargado correctamente');
console.log('Usa probarEuler() en consola para verificar el funcionamiento');