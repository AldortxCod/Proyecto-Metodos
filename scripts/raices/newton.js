// newton.js - Método de Newton-Raphson - VERSIÓN CORREGIDA CON EVALUACIÓN FIXED
console.log('Newton.js: Inicializando para LabNum-Pro');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Newton.js: DOM cargado, configurando...');
    
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'newton') {
            console.log('Newton.js: Método Newton seleccionado');
            setTimeout(initializeNewton, 100);
        }
    });
    
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'raices') {
            setTimeout(checkIfNewtonActive, 200);
        }
    });
    
    setTimeout(checkIfNewtonActive, 300);
});

function checkIfNewtonActive() {
    const activeMethodBtn = document.querySelector('.method-btn.active');
    if (activeMethodBtn && activeMethodBtn.dataset.method === 'newton') {
        console.log('Newton.js: Newton ya está activo al cargar');
        initializeNewton();
    }
    
    const newtonContent = document.getElementById('newton-content');
    if (newtonContent && !newtonContent.classList.contains('hidden')) {
        console.log('Newton.js: Contenido de Newton visible');
        initializeNewton();
    }
}

function initializeNewton() {
    console.log('Newton.js: Inicializando interfaz...');
    
    const newtonContent = document.getElementById('newton-content');
    if (!newtonContent) {
        console.error('Newton.js: ERROR - No se encontró #newton-content');
        return;
    }
    
    if (!document.getElementById('newton-func') || newtonContent.innerHTML.trim().length < 50) {
        console.log('Newton.js: Creando interfaz...');
        createNewtonInterface();
    }
    
    setupNewtonEvents();
    loadNewtonExampleIfEmpty();
}

function createNewtonInterface() {
    const content = document.getElementById('newton-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-bolt"></i> Método de Newton-Raphson</h3>
            <p>Aplicación: Método de convergencia rápida usando derivadas</p>
            
            <div class="ejemplo-principal" style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #3498db;">
                <strong><i class="fas fa-info-circle"></i> Ejemplo: Ecuación trascendente</strong>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">Encontrar raíz de f(x) = e^x - 3x</p>
            </div>
            
            <div class="input-group">
                <label for="newton-func"><i class="fas fa-function"></i> Función f(x):</label>
                <input type="text" id="newton-func" placeholder="exp(x) - 3*x">
                <small>Usa: exp(x) para e^x, log(x) para ln, sin(x), cos(x), tan(x), sqrt(x)</small>
            </div>
            
            <div class="input-group">
                <label for="newton-deriv"><i class="fas fa-sliders-h"></i> Derivada f'(x) (opcional):</label>
                <input type="text" id="newton-deriv" placeholder="exp(x) - 3">
                <small>Si se deja vacío, se calcula numéricamente</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="newton-x0"><i class="fas fa-dot-circle"></i> Punto inicial (x₀):</label>
                    <input type="number" id="newton-x0" value="1" step="0.1">
                </div>
                <div class="input-group">
                    <label for="newton-tol"><i class="fas fa-bullseye"></i> Tolerancia:</label>
                    <input type="number" id="newton-tol" value="0.0001" step="0.0001">
                </div>
                <div class="input-group">
                    <label for="newton-maxiter"><i class="fas fa-redo"></i> Máx. iteraciones:</label>
                    <input type="number" id="newton-maxiter" value="30">
                </div>
            </div>
            
            <div class="button-group">
                <button id="newton-calc" class="calc-btn"><i class="fas fa-calculator"></i> Calcular</button>
                <button id="newton-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Ejemplo</button>
                <button id="newton-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <div style="margin-top: 1rem; padding: 0.8rem; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                <strong><i class="fas fa-exclamation-triangle"></i> Nota:</strong>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.9em;">Convergencia rápida pero sensible al punto inicial</p>
            </div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados</h3>
            
            <div class="result-summary">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-crosshairs"></i>
                    </div>
                    <div class="result-content">
                        <h4>Raíz encontrada:</h4>
                        <p id="newton-root" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-redo"></i>
                    </div>
                    <div class="result-content">
                        <h4>Iteraciones:</h4>
                        <p id="newton-iter" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Error final:</h4>
                        <p id="newton-error" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="result-content">
                        <h4>f(raíz):</h4>
                        <p id="newton-fval" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-area"></i> Visualización</h4>
                    <div class="chart-wrapper">
                        <canvas id="newton-chart"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Iteraciones</h4>
                    <div class="table-wrapper">
                        <table id="newton-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-hashtag"></i> Iter</th>
                                    <th><i class="fas fa-x"></i> xₙ</th>
                                    <th><i class="fas fa-fx"></i> f(xₙ)</th>
                                    <th><i class="fas fa-sliders-h"></i> f'(xₙ)</th>
                                    <th><i class="fas fa-percentage"></i> Error</th>
                                </tr>
                            </thead>
                            <tbody id="newton-table-body">
                                <tr><td colspan="5" class="empty-table">Ingresa valores y haz clic en Calcular</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('Newton.js: Interfaz creada correctamente');
}

function setupNewtonEvents() {
    const calcBtn = document.getElementById('newton-calc');
    if (calcBtn) {
        calcBtn.removeEventListener('click', calculateNewton);
        calcBtn.addEventListener('click', calculateNewton);
    }
    
    const ejemploBtn = document.getElementById('newton-ejemplo');
    if (ejemploBtn) {
        ejemploBtn.removeEventListener('click', loadNewtonExample);
        ejemploBtn.addEventListener('click', loadNewtonExample);
    }
    
    const clearBtn = document.getElementById('newton-clear');
    if (clearBtn) {
        clearBtn.removeEventListener('click', clearNewton);
        clearBtn.addEventListener('click', clearNewton);
    }
}

function loadNewtonExampleIfEmpty() {
    const funcInput = document.getElementById('newton-func');
    if (funcInput && (!funcInput.value || funcInput.value.trim() === '')) {
        loadNewtonExample();
    }
}

function loadNewtonExample() {
    // Cambié el ejemplo a algo más simple para probar
    document.getElementById('newton-func').value = 'x^3 - 2*x - 5';
    document.getElementById('newton-deriv').value = '3*x^2 - 2';
    document.getElementById('newton-x0').value = '2';
    document.getElementById('newton-tol').value = '0.0001';
    document.getElementById('newton-maxiter').value = '30';
    
    setTimeout(calculateNewton, 300);
}

// FUNCIÓN DE EVALUACIÓN CORREGIDA
function evaluateExpression(expr, x) {
    try {
        // Convertir expresión matemática a JavaScript
        let jsExpr = expr
            .replace(/x/g, `(${x})`)
            .replace(/\^/g, '**')  // Potencia
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
        
        // Evaluar de forma segura
        return Function('"use strict"; return (' + jsExpr + ')')();
    } catch (error) {
        throw new Error(`Error evaluando "${expr}" en x=${x}: ${error.message}`);
    }
}

// Derivada numérica
function numericalDerivative(funcStr, x, h = 1e-7) {
    const f_plus = evaluateExpression(funcStr, x + h);
    const f_minus = evaluateExpression(funcStr, x - h);
    return (f_plus - f_minus) / (2 * h);
}

function calculateNewton() {
    console.log('Newton.js: Iniciando cálculo...');
    
    const funcStr = document.getElementById('newton-func').value.trim();
    const derivStr = document.getElementById('newton-deriv').value.trim();
    const x0 = parseFloat(document.getElementById('newton-x0').value);
    const tol = parseFloat(document.getElementById('newton-tol').value);
    const maxIter = parseInt(document.getElementById('newton-maxiter').value);
    
    // Validaciones
    if (!funcStr) {
        alert('Por favor, ingresa una función f(x)');
        document.getElementById('newton-func').focus();
        return;
    }
    
    if (isNaN(x0)) {
        alert('El punto inicial debe ser un número');
        document.getElementById('newton-x0').focus();
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        alert('La tolerancia debe ser un número positivo');
        document.getElementById('newton-tol').focus();
        return;
    }
    
    if (isNaN(maxIter) || maxIter <= 0) {
        alert('El número máximo de iteraciones debe ser positivo');
        document.getElementById('newton-maxiter').focus();
        return;
    }
    
    // Mostrar cargando
    const calcBtn = document.getElementById('newton-calc');
    const originalText = calcBtn.innerHTML;
    calcBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
    calcBtn.disabled = true;
    
    setTimeout(() => {
        try {
            console.log('Newton.js: Ejecutando algoritmo...');
            const resultados = newtonRaphsonMethod(funcStr, derivStr, x0, tol, maxIter);
            displayNewtonResults(resultados);
        } catch (error) {
            console.error('Newton.js Error:', error);
            alert('Error: ' + error.message);
        } finally {
            calcBtn.innerHTML = originalText;
            calcBtn.disabled = false;
        }
    }, 50);
}

function newtonRaphsonMethod(funcStr, derivStr, x0, tol, maxIter) {
    console.log(`Newton.js: Parámetros: x0=${x0}, tol=${tol}, maxIter=${maxIter}`);
    
    const iterations = [];
    let x = x0;
    const hasAnalyticDerivative = derivStr && derivStr.trim() !== '';
    
    for (let i = 0; i < maxIter; i++) {
        try {
            const f_x = evaluateExpression(funcStr, x);
            let f_prime_x;
            
            if (hasAnalyticDerivative) {
                f_prime_x = evaluateExpression(derivStr, x);
            } else {
                f_prime_x = numericalDerivative(funcStr, x);
            }
            
            // Verificar que no haya división por cero
            if (Math.abs(f_prime_x) < 1e-15) {
                throw new Error(`Derivada cercana a cero en x = ${x.toFixed(6)}. Intenta otro punto inicial.`);
            }
            
            // Fórmula de Newton-Raphson
            const x_next = x - f_x / f_prime_x;
            const error = Math.abs(x_next - x);
            const f_next = evaluateExpression(funcStr, x_next);
            
            iterations.push({
                iteration: i + 1,
                x: x,
                fx: f_x,
                fprimex: f_prime_x,
                x_next: x_next,
                error: error,
                f_next: f_next
            });
            
            console.log(`Iter ${i+1}: x=${x.toFixed(6)}, f(x)=${f_x.toFixed(6)}, f'(x)=${f_prime_x.toFixed(6)}, error=${error.toFixed(10)}`);
            
            // Verificar convergencia
            if (error < tol || Math.abs(f_next) < tol) {
                console.log(`Newton.js: Convergencia en ${i+1} iteraciones`);
                return {
                    root: x_next,
                    functionValue: f_next,
                    iterations: iterations,
                    finalError: error,
                    totalIterations: i + 1,
                    converged: true,
                    hasAnalyticDerivative: hasAnalyticDerivative,
                    initialGuess: x0,
                    funcStr: funcStr
                };
            }
            
            // Actualizar para siguiente iteración
            x = x_next;
            
        } catch (error) {
            throw new Error(`Iteración ${i+1}: ${error.message}`);
        }
    }
    
    console.log(`Newton.js: No convergió en ${maxIter} iteraciones`);
    return {
        root: x,
        functionValue: evaluateExpression(funcStr, x),
        iterations: iterations,
        finalError: iterations.length > 0 ? iterations[iterations.length-1].error : 1,
        totalIterations: maxIter,
        converged: false,
        hasAnalyticDerivative: hasAnalyticDerivative,
        initialGuess: x0,
        funcStr: funcStr,
        warning: 'No convergió en el máximo de iteraciones'
    };
}

function displayNewtonResults(results) {
    console.log('Newton.js: Mostrando resultados...');
    
    const format = (num, decimals = 8) => {
        if (num === null || num === undefined || isNaN(num)) return '-';
        if (Math.abs(num) < 1e-12) return '0';
        if (Math.abs(num) < 1e-4 || Math.abs(num) > 1e6) {
            return num.toExponential(decimals - 1);
        }
        return num.toFixed(decimals);
    };
    
    // Actualizar resultados
    document.getElementById('newton-root').textContent = format(results.root);
    document.getElementById('newton-iter').textContent = results.totalIterations;
    document.getElementById('newton-error').textContent = format(results.finalError, 10);
    document.getElementById('newton-fval').textContent = format(results.functionValue);
    
    // Añadir indicador de convergencia
    const rootEl = document.getElementById('newton-root');
    if (rootEl) {
        const badgeColor = results.converged ? '#28a745' : '#dc3545';
        const badgeText = results.converged ? '✓ Convergió' : '✗ No convergió';
        const derivText = results.hasAnalyticDerivative ? ' (analítica)' : ' (numérica)';
        
        rootEl.innerHTML = `
            ${format(results.root)}
            <span style="margin-left: 8px; padding: 2px 8px; border-radius: 12px; 
                         font-size: 0.75rem; background-color: ${badgeColor}; color: white;">
                ${badgeText}${derivText}
            </span>
        `;
    }
    
    // Mostrar advertencia
    if (results.warning) {
        console.warn('Newton.js:', results.warning);
    }
    
    // Actualizar tabla
    updateNewtonTable(results.iterations, format);
    
    // Crear gráfico
    createNewtonChart(results, format);
}

function updateNewtonTable(iterations, format) {
    const tbody = document.getElementById('newton-table-body');
    if (!tbody) return;
    
    if (iterations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table">No hay iteraciones</td></tr>';
        return;
    }
    
    let html = '';
    iterations.forEach(iter => {
        const rowClass = iter.error < 0.001 ? 'style="background-color: rgba(144, 238, 144, 0.2);"' : 
                        Math.abs(iter.fprimex) < 0.01 ? 'style="background-color: rgba(255, 204, 0, 0.1);"' : '';
        
        html += `
            <tr ${rowClass}>
                <td>${iter.iteration}</td>
                <td>${format(iter.x)}</td>
                <td>${format(iter.fx)}</td>
                <td>${format(iter.fprimex)}</td>
                <td>${format(iter.error, 10)}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function createNewtonChart(results, format) {
    const canvas = document.getElementById('newton-chart');
    if (!canvas) {
        console.log('Newton.js: Canvas no encontrado');
        return;
    }
    
    // Destruir gráfico anterior
    if (window.newtonChartInstance) {
        window.newtonChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    try {
        // Generar puntos para la función
        const xMin = Math.min(results.initialGuess, results.root) - 1;
        const xMax = Math.max(results.initialGuess, results.root) + 1;
        const step = (xMax - xMin) / 200;
        
        const functionData = [];
        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = evaluateExpression(results.funcStr, x);
                if (!isNaN(y) && isFinite(y)) {
                    functionData.push({ x: x, y: y });
                }
            } catch (e) {
                // Ignorar puntos donde no se puede evaluar
            }
        }
        
        // Puntos de iteraciones
        const iterationPoints = results.iterations.map(iter => ({
            x: iter.x,
            y: iter.fx
        }));
        
        // Crear gráfico
        window.newtonChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'f(x)',
                        data: functionData,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.1
                    },
                    {
                        label: 'Iteraciones',
                        data: iterationPoints,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        showLine: false
                    },
                    {
                        label: 'Raíz',
                        data: [{ x: results.root, y: 0 }],
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 1)',
                        pointRadius: 10,
                        pointStyle: 'star',
                        showLine: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'x'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'f(x)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += `(${format(context.parsed.x, 4)}, ${format(context.parsed.y, 4)})`;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Newton.js: Gráfico creado');
        
    } catch (chartError) {
        console.error('Newton.js: Error al crear gráfico:', chartError);
    }
}

function clearNewton() {
    console.log('Newton.js: Limpiando...');
    
    document.getElementById('newton-func').value = '';
    document.getElementById('newton-deriv').value = '';
    document.getElementById('newton-x0').value = '1';
    document.getElementById('newton-tol').value = '0.0001';
    document.getElementById('newton-maxiter').value = '30';
    
    document.getElementById('newton-root').textContent = '-';
    document.getElementById('newton-iter').textContent = '-';
    document.getElementById('newton-error').textContent = '-';
    document.getElementById('newton-fval').textContent = '-';
    
    const tbody = document.getElementById('newton-table-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table">Ingresa valores y haz clic en Calcular</td></tr>';
    }
    
    if (window.newtonChartInstance) {
        window.newtonChartInstance.destroy();
        window.newtonChartInstance = null;
    }
}

// Función de prueba
window.testNewton = function() {
    console.log('=== PRUEBA NEWTON ===');
    try {
        const results = newtonRaphsonMethod('x^3 - 2*x - 5', '3*x^2 - 2', 2, 0.0001, 30);
        console.log('Raíz encontrada:', results.root);
        console.log('Iteraciones:', results.totalIterations);
        console.log('Convergió:', results.converged);
        return results;
    } catch (error) {
        console.error('Error en prueba:', error.message);
        return null;
    }
};

console.log('Newton.js: Cargado correctamente');