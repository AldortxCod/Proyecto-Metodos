/**
 * comparacion-interpolacion.js - Comparación de Métodos de Interpolación
 * SIGUE EXACTAMENTE EL MISMO PATRÓN QUE comparacion-raices.js
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('ComparacionInterpolacion.js: Cargado');
    
    // MISMO PATRÓN: Escuchar cuando la sección se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'interpolacion') {
            console.log('ComparacionInterpolacion.js: Sección interpolación activada');
            setTimeout(inicializarComparacionInterpolacion, 300);
        }
    });
    
    // MISMO PATRÓN: Escuchar cuando se seleccione la comparación
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'comparacion-interp') {
            console.log('ComparacionInterpolacion.js: Comparación seleccionada');
            setTimeout(inicializarComparacionInterpolacion, 100);
        }
    });
    
    // MISMO PATRÓN: Verificar si ya está visible al cargar
    setTimeout(verificarComparacionInterpolacionVisibilidad, 1000);
});

function verificarComparacionInterpolacionVisibilidad() {
    const comparacionContent = document.getElementById('comparacion-interp-content');
    if (comparacionContent && !comparacionContent.classList.contains('hidden')) {
        console.log('ComparacionInterpolacion.js: Ya visible al cargar');
        inicializarComparacionInterpolacion();
    }
}

function inicializarComparacionInterpolacion() {
    console.log('ComparacionInterpolacion.js: Inicializando...');
    
    const comparacionContent = document.getElementById('comparacion-interp-content');
    if (!comparacionContent) {
        console.error('ComparacionInterpolacion.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE (MISMO PATRÓN)
    if (comparacionContent.innerHTML.trim() === '' || !document.getElementById('comp-interp-puntos')) {
        console.log('ComparacionInterpolacion.js: Creando interfaz...');
        crearInterfazComparacionInterpolacion();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES (MISMO PATRÓN)
    asignarEventosComparacionInterpolacion();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO (MISMO PATRÓN)
    cargarEjemploInicialComparacionInterpolacion();
}

function crearInterfazComparacionInterpolacion() {
    const content = document.getElementById('comparacion-interp-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-balance-scale"></i> Comparación de Métodos de Interpolación</h3>
            <p>Analiza y compara el rendimiento de diferentes métodos de interpolación</p>
            
            <div class="ejemplo-selector" style="margin-bottom: 1.5rem;">
                <div style="background: #f0f8ff; padding: 1rem; border-radius: 6px; border-left: 4px solid #2c3e50;">
                    <strong><i class="fas fa-book-open"></i> Selecciona un ejemplo:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                        <button class="ejemplo-btn" data-ejemplo="seno" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            Función Seno
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="cuadratica" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            Cuadrática
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="exponencial" style="background: #f39c12; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            Exponencial
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="datos-experimentales" style="background: #2ecc71; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            Datos Experimentales
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="input-group">
                <label for="comp-interp-puntos"><i class="fas fa-dot-circle"></i> Puntos (x,y):</label>
                <textarea id="comp-interp-puntos" rows="6" placeholder="0, 0
1, 0.8415
2, 0.9093
3, 0.1411
4, -0.7568
5, -0.9589"></textarea>
                <small>Un punto por línea: x, y (separados por coma). Mínimo 3 puntos.</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="comp-interp-x"><i class="fas fa-crosshairs"></i> Valor a interpolar (x):</label>
                    <input type="number" id="comp-interp-x" value="2.5" step="0.1">
                </div>
                <div class="input-group">
                    <label for="comp-interp-grado"><i class="fas fa-sort-numeric-up"></i> Grado polinomio:</label>
                    <input type="number" id="comp-interp-grado" value="3" min="1" max="10">
                </div>
            </div>
            
            <div class="input-group">
                <label for="comp-interp-func-real"><i class="fas fa-check-double"></i> Función real (opcional):</label>
                <input type="text" id="comp-interp-func-real" placeholder="sin(x)">
                <small>Si se proporciona, se calculará el error exacto</small>
            </div>
            
            <div class="checkbox-group">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-lagrange" checked>
                    <span style="color: #3498db;"><i class="fas fa-project-diagram"></i> Incluir Lagrange</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-newton" checked>
                    <span style="color: #f39c12;"><i class="fas fa-sitemap"></i> Incluir Newton</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-splines" checked>
                    <span style="color: #e74c3c;"><i class="fas fa-wave-square"></i> Incluir Splines Cúbicos</span>
                </label>
            </div>
            
            <div class="button-group">
                <button id="comp-interp-calc" class="calc-btn"><i class="fas fa-chart-bar"></i> Comparar Métodos</button>
                <button id="comp-interp-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="comp-interp-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-poll"></i> Resultados de la Comparación</h3>
            
            <div class="result-summary">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más rápido:</h4>
                        <p id="comp-interp-mas-rapido" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más preciso:</h4>
                        <p id="comp-interp-mas-preciso" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="result-content">
                        <h4>Mejor ajuste:</h4>
                        <p id="comp-interp-mejor-ajuste" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-line"></i> Interpolaciones Comparadas</h4>
                    <div class="chart-wrapper">
                        <canvas id="comp-interp-chart"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Comparación Detallada</h4>
                    <div class="table-wrapper">
                        <table id="comp-interp-tabla">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-calculator"></i> Método</th>
                                    <th><i class="fas fa-crosshairs"></i> f($x$)</th>
                                    <th><i class="fas fa-clock"></i> Tiempo (ms)</th>
                                    <th><i class="fas fa-bullseye"></i> Error</th>
                                    <th><i class="fas fa-exclamation-triangle"></i> Oscilaciones</th>
                                    <th><i class="fas fa-check-circle"></i> Estabilidad</th>
                                </tr>
                            </thead>
                            <tbody id="comp-interp-tabla-body">
                                <tr><td colspan="6" class="empty-table">Haz clic en "Comparar Métodos"</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4><i class="fas fa-chart-bar"></i> Análisis de Errores</h4>
                <div class="chart-wrapper">
                    <canvas id="comp-interp-chart-errores"></canvas>
                </div>
            </div>
            
            <div id="comp-interp-conclusiones" style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c3e50;">
                <h4><i class="fas fa-lightbulb"></i> Conclusiones y Recomendaciones</h4>
                <p id="comp-interp-conclusion-text">Ejecuta una comparación para ver conclusiones sobre los métodos de interpolación.</p>
            </div>
        </div>
    `;
    
    console.log('ComparacionInterpolacion.js: Interfaz creada correctamente');
}

function asignarEventosComparacionInterpolacion() {
    console.log('ComparacionInterpolacion.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('comp-interp-calc');
    const ejemploBtn = document.getElementById('comp-interp-ejemplo');
    const clearBtn = document.getElementById('comp-interp-clear');
    
    if (!calcBtn) {
        console.error('ComparacionInterpolacion.js: Botón calcular no encontrado');
        return;
    }
    
    // MISMO PATRÓN: Remover eventos anteriores
    calcBtn.removeEventListener('click', compararMetodosInterpolacion);
    ejemploBtn?.removeEventListener('click', mostrarMasEjemplosInterpolacion);
    clearBtn?.removeEventListener('click', limpiarComparacionInterpolacion);
    
    // MISMO PATRÓN: Asignar nuevos eventos
    calcBtn.addEventListener('click', compararMetodosInterpolacion);
    if (ejemploBtn) ejemploBtn.addEventListener('click', mostrarMasEjemplosInterpolacion);
    if (clearBtn) clearBtn.addEventListener('click', limpiarComparacionInterpolacion);
    
    // Asignar eventos a los botones de ejemplo
    setTimeout(() => {
        document.querySelectorAll('.ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                cargarEjemploEspecificoInterpolacion(this.getAttribute('data-ejemplo'));
            });
        });
    }, 100);
    
    console.log('ComparacionInterpolacion.js: Eventos asignados correctamente');
}

function cargarEjemploInicialComparacionInterpolacion() {
    const puntosInput = document.getElementById('comp-interp-puntos');
    if (puntosInput && !puntosInput.value.trim()) {
        console.log('ComparacionInterpolacion.js: Cargando ejemplo inicial...');
        cargarEjemploEspecificoInterpolacion('seno');
    }
}

function cargarEjemploEspecificoInterpolacion(tipo) {
    const ejemplos = {
        'seno': {
            nombre: 'Función Seno',
            puntos: `0, 0
1, 0.8415
2, 0.9093
3, 0.1411
4, -0.7568
5, -0.9589
6, -0.2794`,
            x: '2.5',
            grado: '3',
            funcionReal: 'sin(x)',
            descripcion: 'Interpolación de sin(x) en [0, 6]'
        },
        'cuadratica': {
            nombre: 'Función Cuadrática',
            puntos: `-2, 4
-1, 1
0, 0
1, 1
2, 4
3, 9`,
            x: '1.5',
            grado: '2',
            funcionReal: 'x^2',
            descripcion: 'Interpolación de x² en [-2, 3]'
        },
        'exponencial': {
            nombre: 'Función Exponencial',
            puntos: `0, 1
1, 2.7183
2, 7.3891
3, 20.0855
4, 54.5982`,
            x: '2.5',
            grado: '3',
            funcionReal: 'exp(x)',
            descripcion: 'Interpolación de exp(x) en [0, 4]'
        },
        'datos-experimentales': {
            nombre: 'Datos Experimentales',
            puntos: `1, 2.1
2, 7.3
3, 20.5
4, 54.6
5, 148.4
6, 403.4`,
            x: '3.5',
            grado: '4',
            funcionReal: '',
            descripcion: 'Datos de crecimiento exponencial experimental'
        }
    };
    
    const ejemplo = ejemplos[tipo];
    if (!ejemplo) return;
    
    document.getElementById('comp-interp-puntos').value = ejemplo.puntos;
    document.getElementById('comp-interp-x').value = ejemplo.x;
    document.getElementById('comp-interp-grado').value = ejemplo.grado;
    document.getElementById('comp-interp-func-real').value = ejemplo.funcionReal;
    
    // Mostrar descripción
    const ejemploDesc = document.querySelector('.ejemplo-selector');
    if (ejemploDesc) {
        ejemploDesc.innerHTML = `
            <div style="background: #f0f8ff; padding: 1rem; border-radius: 6px; border-left: 4px solid #2c3e50;">
                <strong><i class="fas fa-book-open"></i> Ejemplo: ${ejemplo.nombre}</strong>
                <p style="margin: 0.5rem 0 0.2rem 0; font-size: 0.9em;">${ejemplo.descripcion}</p>
                <small style="color: #666;">Grado del polinomio: ${ejemplo.grado}, Valor a interpolar: x = ${ejemplo.x}</small>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                    ${Object.entries(ejemplos).map(([key, ej]) => `
                        <button class="ejemplo-btn" data-ejemplo="${key}" 
                                style="background: ${key === tipo ? '#2c3e50' : '#3498db'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                            ${ej.nombre.split(' ')[0]}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Reasignar eventos
        setTimeout(() => {
            document.querySelectorAll('.ejemplo-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    cargarEjemploEspecificoInterpolacion(this.getAttribute('data-ejemplo'));
                });
            });
        }, 50);
    }
    
    setTimeout(() => compararMetodosInterpolacion(), 400);
}

function mostrarMasEjemplosInterpolacion() {
    const ejemplosExtras = [
        {
            nombre: 'Función de Runge',
            puntos: `-5, 0.0385
-4, 0.0588
-3, 0.1
-2, 0.2
-1, 0.5
0, 1
1, 0.5
2, 0.2
3, 0.1
4, 0.0588
5, 0.0385`,
            x: '1.5',
            grado: '5',
            funcionReal: '1/(1 + x^2)',
            descripcion: 'Fenómeno de Runge - muestra oscilaciones en bordes'
        },
        {
            nombre: 'Datos Meteorológicos',
            puntos: `0, 15
3, 14
6, 18
9, 22
12, 25
15, 23
18, 19
21, 16`,
            x: '10',
            grado: '3',
            funcionReal: '',
            descripcion: 'Temperaturas horarias durante un día'
        },
        {
            nombre: 'Curva de Bézier (puntos de control)',
            puntos: `0, 0
1, 3
2, 1
3, 4
4, 2
5, 5`,
            x: '2.5',
            grado: '5',
            funcionReal: '',
            descripcion: 'Puntos de control para curva paramétrica'
        }
    ];
    
    // Crear modal
    const modalHTML = `
        <div class="modal-overlay" id="ejemplos-interp-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0;"><i class="fas fa-vial"></i> Más Ejemplos de Interpolación</h3>
                    <button id="cerrar-interp-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div style="display: grid; gap: 1rem;">
                    ${ejemplosExtras.map((ej, index) => `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border-left: 4px solid #3498db;">
                            <h4 style="margin-top: 0;">${ej.nombre}</h4>
                            <p style="margin: 0.5rem 0; font-size: 0.9em;">${ej.descripcion}</p>
                            <div style="font-family: monospace; background: white; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0; font-size: 0.8em;">
                                ${ej.puntos.split('\n').map(p => `(${p})`).join(', ')}
                            </div>
                            <button class="cargar-interp-ejemplo-btn" data-index="${index}" 
                                    style="background: #2c3e50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%;">
                                <i class="fas fa-play-circle"></i> Cargar este ejemplo
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior
    const modalAnterior = document.getElementById('ejemplos-interp-modal');
    if (modalAnterior) modalAnterior.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos
    document.getElementById('cerrar-interp-modal').addEventListener('click', function() {
        document.getElementById('ejemplos-interp-modal').remove();
    });
    
    document.querySelectorAll('.cargar-interp-ejemplo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const ejemplo = ejemplosExtras[index];
            
            document.getElementById('comp-interp-puntos').value = ejemplo.puntos;
            document.getElementById('comp-interp-x').value = ejemplo.x;
            document.getElementById('comp-interp-grado').value = ejemplo.grado;
            document.getElementById('comp-interp-func-real').value = ejemplo.funcionReal || '';
            
            document.getElementById('ejemplos-interp-modal').remove();
            
            setTimeout(() => compararMetodosInterpolacion(), 300);
        });
    });
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('ejemplos-interp-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function compararMetodosInterpolacion() {
    console.log('ComparacionInterpolacion.js: Comparando métodos...');
    
    const puntosEl = document.getElementById('comp-interp-puntos');
    const xEl = document.getElementById('comp-interp-x');
    const gradoEl = document.getElementById('comp-interp-grado');
    const funcRealEl = document.getElementById('comp-interp-func-real');
    
    if (!puntosEl || !xEl || !gradoEl) {
        showError('Error: Elementos de comparación no encontrados.');
        return;
    }
    
    const puntosStr = puntosEl.value.trim();
    const x = parseFloat(xEl.value);
    const grado = parseInt(gradoEl.value);
    const funcRealStr = funcRealEl ? funcRealEl.value.trim() : '';
    
    // Validaciones
    if (!puntosStr) {
        showError('Ingresa los puntos a interpolar', 'comp-interp-puntos');
        return;
    }
    
    const puntos = parsearPuntos(puntosStr);
    if (!puntos || puntos.length < 2) {
        showError('Se necesitan al menos 2 puntos', 'comp-interp-puntos');
        return;
    }
    
    if (isNaN(x)) {
        showError('El valor x debe ser un número', 'comp-interp-x');
        return;
    }
    
    if (isNaN(grado) || grado < 1 || grado >= puntos.length) {
        showError(`El grado debe estar entre 1 y ${puntos.length - 1}`, 'comp-interp-grado');
        return;
    }
    
    // Verificar checkboxes
    const incluirLagrange = document.getElementById('comp-incluir-lagrange').checked;
    const incluirNewton = document.getElementById('comp-incluir-newton').checked;
    const incluirSplines = document.getElementById('comp-incluir-splines').checked;
    
    if (!incluirLagrange && !incluirNewton && !incluirSplines) {
        showError('Selecciona al menos un método para comparar');
        return;
    }
    
    showLoading(document.getElementById('comp-interp-calc'), true);
    
    setTimeout(() => {
        try {
            console.log('ComparacionInterpolacion.js: Ejecutando comparación...');
            const resultados = ejecutarComparacionInterpolacion(
                puntos, x, grado, funcRealStr,
                incluirLagrange, incluirNewton, incluirSplines
            );
            mostrarResultadosComparacionInterpolacion(resultados, puntos, x);
        } catch (error) {
            showError('Error en comparación: ' + error.message);
            console.error('ComparacionInterpolacion.js error:', error);
        } finally {
            showLoading(document.getElementById('comp-interp-calc'), false);
        }
    }, 50);
}

function parsearPuntos(puntosStr) {
    const lineas = puntosStr.split('\n');
    const puntos = [];
    
    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (!linea) continue;
        
        const partes = linea.split(/[,;\t\s]+/);
        if (partes.length < 2) continue;
        
        const x = parseFloat(partes[0]);
        const y = parseFloat(partes[1]);
        
        if (!isNaN(x) && !isNaN(y)) {
            puntos.push({ x: x, y: y });
        }
    }
    
    // Ordenar por x
    puntos.sort((a, b) => a.x - b.x);
    
    return puntos;
}

function ejecutarComparacionInterpolacion(puntos, x, grado, funcRealStr, incluirLagrange, incluirNewton, incluirSplines) {
    const resultados = {};
    
    // Método de Lagrange
    if (incluirLagrange) {
        const startTime = performance.now();
        const resultadoLagrange = metodoLagrange(puntos, x, grado);
        const tiempo = performance.now() - startTime;
        
        resultados.lagrange = {
            nombre: 'Lagrange',
            color: '#3498db',
            valor: resultadoLagrange.valor,
            tiempo: tiempo,
            error: resultadoLagrange.error,
            oscilaciones: resultadoLagrange.oscilaciones,
            estable: resultadoLagrange.estable
        };
    }
    
    // Método de Newton
    if (incluirNewton) {
        const startTime = performance.now();
        const resultadoNewton = metodoNewton(puntos, x, grado);
        const tiempo = performance.now() - startTime;
        
        resultados.newton = {
            nombre: 'Newton',
            color: '#f39c12',
            valor: resultadoNewton.valor,
            tiempo: tiempo,
            error: resultadoNewton.error,
            oscilaciones: resultadoNewton.oscilaciones,
            estable: resultadoNewton.estable
        };
    }
    
    // Método de Splines Cúbicos
    if (incluirSplines) {
        const startTime = performance.now();
        const resultadoSplines = metodoSplinesCubicos(puntos, x);
        const tiempo = performance.now() - startTime;
        
        resultados.splines = {
            nombre: 'Splines Cúbicos',
            color: '#e74c3c',
            valor: resultadoSplines.valor,
            tiempo: tiempo,
            error: resultadoSplines.error,
            oscilaciones: resultadoSplines.oscilaciones,
            estable: resultadoSplines.estable
        };
    }
    
    // Calcular error si hay función real
    if (funcRealStr) {
        try {
            const valorReal = evaluateExpression(funcRealStr, x);
            Object.values(resultados).forEach(metodo => {
                metodo.error = Math.abs(metodo.valor - valorReal);
            });
        } catch (e) {
            console.warn('No se pudo calcular función real:', e.message);
        }
    }
    
    return resultados;
}

function metodoLagrange(puntos, x, grado) {
    const n = Math.min(grado + 1, puntos.length);
    let resultado = 0;
    let oscilaciones = 0;
    let valoresPrevios = [];
    
    for (let i = 0; i < n; i++) {
        let termino = puntos[i].y;
        
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                termino *= (x - puntos[j].x) / (puntos[i].x - puntos[j].x);
            }
        }
        
        resultado += termino;
        valoresPrevios.push(resultado);
        
        // Detectar oscilaciones
        if (valoresPrevios.length > 2) {
            const cambio1 = Math.abs(valoresPrevios[valoresPrevios.length-1] - valoresPrevios[valoresPrevios.length-2]);
            const cambio2 = Math.abs(valoresPrevios[valoresPrevios.length-2] - valoresPrevios[valoresPrevios.length-3]);
            if (cambio1 > cambio2 * 2) oscilaciones++;
        }
    }
    
    return {
        valor: resultado,
        error: null,
        oscilaciones: oscilaciones,
        estable: oscilaciones < n/2
    };
}

function metodoNewton(puntos, x, grado) {
    const n = Math.min(grado + 1, puntos.length);
    
    // Calcular diferencias divididas
    const diferencias = [];
    for (let i = 0; i < n; i++) {
        diferencias[i] = [puntos[i].y];
    }
    
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diferencias[i][j] = (diferencias[i+1][j-1] - diferencias[i][j-1]) / (puntos[i+j].x - puntos[i].x);
        }
    }
    
    // Evaluar polinomio
    let resultado = diferencias[0][0];
    let producto = 1;
    let oscilaciones = 0;
    let valoresParciales = [resultado];
    
    for (let i = 1; i < n; i++) {
        producto *= (x - puntos[i-1].x);
        const termino = diferencias[0][i] * producto;
        resultado += termino;
        valoresParciales.push(resultado);
        
        // Detectar oscilaciones
        if (i >= 2) {
            const cambio1 = Math.abs(valoresParciales[i] - valoresParciales[i-1]);
            const cambio2 = Math.abs(valoresParciales[i-1] - valoresParciales[i-2]);
            if (cambio1 > cambio2 * 3) oscilaciones++;
        }
    }
    
    return {
        valor: resultado,
        error: null,
        oscilaciones: oscilaciones,
        estable: oscilaciones < 2
    };
}

function metodoSplinesCubicos(puntos, x) {
    const n = puntos.length;
    if (n < 3) {
        throw new Error('Se necesitan al menos 3 puntos para splines cúbicos');
    }
    
    // Encontrar el intervalo donde está x
    let intervalo = 0;
    for (let i = 0; i < n - 1; i++) {
        if (x >= puntos[i].x && x <= puntos[i+1].x) {
            intervalo = i;
            break;
        }
    }
    
    if (intervalo === 0 && x < puntos[0].x) intervalo = 0;
    if (intervalo === 0 && x > puntos[n-1].x) intervalo = n - 2;
    
    // Aproximación simple: interpolación lineal entre puntos
    const i = intervalo;
    const h = puntos[i+1].x - puntos[i].x;
    const t = (x - puntos[i].x) / h;
    
    // Fórmula de interpolación cúbica de Hermite
    const h00 = 2*t*t*t - 3*t*t + 1;
    const h10 = t*t*t - 2*t*t + t;
    const h01 = -2*t*t*t + 3*t*t;
    const h11 = t*t*t - t*t;
    
    // Derivadas aproximadas
    let m0, m1;
    if (i === 0) {
        m0 = (puntos[1].y - puntos[0].y) / (puntos[1].x - puntos[0].x);
    } else {
        m0 = (puntos[i].y - puntos[i-1].y) / (puntos[i].x - puntos[i-1].x);
    }
    
    if (i === n - 2) {
        m1 = (puntos[n-1].y - puntos[n-2].y) / (puntos[n-1].x - puntos[n-2].x);
    } else {
        m1 = (puntos[i+2].y - puntos[i+1].y) / (puntos[i+2].x - puntos[i+1].x);
    }
    
    const resultado = h00 * puntos[i].y + h10 * h * m0 + h01 * puntos[i+1].y + h11 * h * m1;
    
    return {
        valor: resultado,
        error: null,
        oscilaciones: 0, // Splines son suaves
        estable: true
    };
}

function mostrarResultadosComparacionInterpolacion(resultados, puntos, x) {
    console.log('ComparacionInterpolacion.js: Mostrando resultados...');
    
    // Actualizar tabla
    const tbody = document.getElementById('comp-interp-tabla-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        let masRapido = { nombre: '', tiempo: Infinity };
        let masPreciso = { nombre: '', error: Infinity };
        let mejorAjuste = { nombre: '', oscilaciones: Infinity };
        
        Object.values(resultados).forEach(metodo => {
            const row = document.createElement('tr');
            
            // Determinar emoji de estabilidad
            const estabilidadEmoji = metodo.estable ? '✅' : '⚠️';
            const oscilacionText = metodo.oscilaciones > 0 ? 
                `${metodo.oscilaciones} oscilación(es)` : 'Suave';
            
            row.innerHTML = `
                <td style="color: ${metodo.color}; font-weight: bold;">
                    <i class="fas fa-calculator"></i> ${metodo.nombre}
                </td>
                <td>${formatNumber(metodo.valor, 6)}</td>
                <td>${formatNumber(metodo.tiempo, 2)} ms</td>
                <td>${metodo.error !== null ? formatNumber(metodo.error, 6) : '-'}</td>
                <td>${oscilacionText}</td>
                <td>${estabilidadEmoji} ${metodo.estable ? 'Estable' : 'Inestable'}</td>
            `;
            
            tbody.appendChild(row);
            
            // Encontrar el más rápido
            if (metodo.tiempo < masRapido.tiempo) {
                masRapido = { nombre: metodo.nombre, tiempo: metodo.tiempo };
            }
            
            // Encontrar el más preciso
            if (metodo.error !== null && metodo.error < masPreciso.error) {
                masPreciso = { nombre: metodo.nombre, error: metodo.error };
            }
            
            // Encontrar mejor ajuste (menos oscilaciones)
            if (metodo.oscilaciones < mejorAjuste.oscilaciones) {
                mejorAjuste = { nombre: metodo.nombre, oscilaciones: metodo.oscilaciones };
            }
        });
        
        // Actualizar resumen
        document.getElementById('comp-interp-mas-rapido').textContent = masRapido.nombre || '-';
        document.getElementById('comp-interp-mas-preciso').textContent = masPreciso.nombre || '-';
        document.getElementById('comp-interp-mejor-ajuste').textContent = mejorAjuste.nombre || '-';
    }
    
    // Crear gráficos
    crearGraficosComparacionInterpolacion(resultados, puntos, x);
    
    // Mostrar conclusiones
    mostrarConclusionesInterpolacion(resultados);
}

function crearGraficosComparacionInterpolacion(resultados, puntos, x) {
    const metodos = Object.values(resultados);
    if (metodos.length === 0) return;
    
    // Gráfico de tiempo de ejecución
    const labels = metodos.map(m => m.nombre);
    const datosTiempo = metodos.map(m => m.tiempo);
    const colores = metodos.map(m => m.color);
    
    createChart('comp-interp-chart', {
        labels: labels,
        datasets: [{
            label: 'Tiempo de ejecución (ms)',
            data: datosTiempo,
            backgroundColor: colores,
            borderColor: colores.map(c => c.replace('0.6', '1')),
            borderWidth: 2
        }]
    }, {
        type: 'bar',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Comparación de Tiempos' }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Tiempo (ms)' }
            }
        }
    });
    
    // Gráfico de errores si hay datos de error
    const metodosConError = metodos.filter(m => m.error !== null);
    if (metodosConError.length > 0) {
        createChart('comp-interp-chart-errores', {
            labels: metodosConError.map(m => m.nombre),
            datasets: [{
                label: 'Error absoluto',
                data: metodosConError.map(m => m.error),
                backgroundColor: metodosConError.map(m => m.color + '80'),
                borderColor: metodosConError.map(m => m.color),
                borderWidth: 2
            }]
        }, {
            type: 'bar',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Comparación de Errores' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Error absoluto' }
                }
            }
        });
    }
}

function mostrarConclusionesInterpolacion(resultados) {
    const conclusionesDiv = document.getElementById('comp-interp-conclusiones');
    const metodos = Object.values(resultados);
    
    if (metodos.length === 0) {
        conclusionesDiv.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> Conclusiones y Recomendaciones</h4>
            <p>Ejecuta una comparación para ver conclusiones sobre los métodos de interpolación.</p>
        `;
        return;
    }
    
    const lagrange = metodos.find(m => m.nombre === 'Lagrange');
    const newton = metodos.find(m => m.nombre === 'Newton');
    const splines = metodos.find(m => m.nombre === 'Splines Cúbicos');
    
    let conclusiones = '<h4><i class="fas fa-lightbulb"></i> Conclusiones y Recomendaciones</h4>';
    conclusiones += '<ul style="margin-bottom: 0;">';
    
    conclusiones += '<li><strong>Lagrange:</strong> Simple de entender pero computacionalmente costoso para muchos puntos. ';
    if (lagrange && lagrange.oscilaciones > 0) {
        conclusiones += `⚠️ Muestra ${lagrange.oscilaciones} oscilaciones, cuidado con el fenómeno de Runge.`;
    } else if (lagrange) {
        conclusiones += '✅ Estable para este conjunto de puntos.';
    }
    conclusiones += '</li>';
    
    conclusiones += '<li><strong>Newton:</strong> Más eficiente que Lagrange, permite agregar puntos fácilmente. ';
    if (newton && newton.estable) {
        conclusiones += '✅ Método robusto y estable.';
    } else if (newton) {
        conclusiones += '⚠️ Puede mostrar inestabilidades numéricas.';
    }
    conclusiones += '</li>';
    
    conclusiones += '<li><strong>Splines Cúbicos:</strong> Produce curvas suaves, evita oscilaciones grandes. ';
    if (splines) {
        conclusiones += '✅ Excelente para datos experimentales y visualización.';
    }
    conclusiones += '</li>';
    
    // Recomendaciones generales
    conclusiones += '<li><strong>Para datos experimentales:</strong> Splines Cúbicos son la mejor opción</li>';
    conclusiones += '<li><strong>Para polinomios exactos:</strong> Newton es más eficiente</li>';
    conclusiones += '<li><strong>Para enseñanza:</strong> Lagrange es el más intuitivo</li>';
    conclusiones += '<li><strong>Para muchos puntos:</strong> Evitar Lagrange, preferir Newton o Splines</li>';
    
    conclusiones += '</ul>';
    
    conclusionesDiv.innerHTML = conclusiones;
}

function limpiarComparacionInterpolacion() {
    console.log('ComparacionInterpolacion.js: Limpiando...');
    
    document.getElementById('comp-interp-puntos').value = '';
    document.getElementById('comp-interp-x').value = '2.5';
    document.getElementById('comp-interp-grado').value = '3';
    document.getElementById('comp-interp-func-real').value = '';
    
    // Resetear resultados
    document.getElementById('comp-interp-mas-rapido').textContent = '-';
    document.getElementById('comp-interp-mas-preciso').textContent = '-';
    document.getElementById('comp-interp-mejor-ajuste').textContent = '-';
    
    const tbody = document.getElementById('comp-interp-tabla-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-table">Haz clic en "Comparar Métodos"</td></tr>';
    }
    
    // Limpiar gráficos
    if (window.charts && window.charts['comp-interp-chart']) {
        window.charts['comp-interp-chart'].destroy();
        delete window.charts['comp-interp-chart'];
    }
    
    if (window.charts && window.charts['comp-interp-chart-errores']) {
        window.charts['comp-interp-chart-errores'].destroy();
        delete window.charts['comp-interp-chart-errores'];
    }
    
    // Limpiar conclusiones
    const conclusionesDiv = document.getElementById('comp-interp-conclusiones');
    if (conclusionesDiv) {
        conclusionesDiv.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> Conclusiones y Recomendaciones</h4>
            <p>Ejecuta una comparación para ver conclusiones sobre los métodos de interpolación.</p>
        `;
    }
}