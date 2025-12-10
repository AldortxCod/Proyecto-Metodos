/**
 * comparacion-integracion.js - Comparación de Métodos de Integración Numérica
 * SIGUE EXACTAMENTE EL MISMO PATRÓN QUE comparacion-raices.js
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('ComparacionIntegracion.js: Cargado');
    
    // MISMO PATRÓN: Escuchar cuando la sección se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'integracion') {
            console.log('ComparacionIntegracion.js: Sección integración activada');
            setTimeout(inicializarComparacionIntegracion, 300);
        }
    });
    
    // MISMO PATRÓN: Escuchar cuando se seleccione la comparación
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'comparacion-int') {
            console.log('ComparacionIntegracion.js: Comparación seleccionada');
            setTimeout(inicializarComparacionIntegracion, 100);
        }
    });
    
    // MISMO PATRÓN: Verificar si ya está visible al cargar
    setTimeout(verificarComparacionIntegracionVisibilidad, 1000);
});

function verificarComparacionIntegracionVisibilidad() {
    const comparacionContent = document.getElementById('comparacion-int-content');
    if (comparacionContent && !comparacionContent.classList.contains('hidden')) {
        console.log('ComparacionIntegracion.js: Ya visible al cargar');
        inicializarComparacionIntegracion();
    }
}

function inicializarComparacionIntegracion() {
    console.log('ComparacionIntegracion.js: Inicializando...');
    
    const comparacionContent = document.getElementById('comparacion-int-content');
    if (!comparacionContent) {
        console.error('ComparacionIntegracion.js: Error - Contenedor no encontrado');
        return;
    }
    
    // PASO 1: CREAR LA INTERFAZ SI NO EXISTE (MISMO PATRÓN)
    if (comparacionContent.innerHTML.trim() === '' || !document.getElementById('comp-int-func')) {
        console.log('ComparacionIntegracion.js: Creando interfaz...');
        crearInterfazComparacionIntegracion();
    }
    
    // PASO 2: ASIGNAR EVENTOS A LOS BOTONES (MISMO PATRÓN)
    asignarEventosComparacionIntegracion();
    
    // PASO 3: CARGAR EJEMPLO INICIAL SI ESTÁ VACÍO (MISMO PATRÓN)
    cargarEjemploInicialComparacionIntegracion();
}

function crearInterfazComparacionIntegracion() {
    const content = document.getElementById('comparacion-int-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-balance-scale"></i> Comparación de Métodos de Integración Numérica</h3>
            <p>Analiza y compara la precisión de diferentes métodos para calcular integrales definidas</p>
            
            <div class="ejemplo-selector" style="margin-bottom: 1.5rem;">
                <div style="background: #f0f8ff; padding: 1rem; border-radius: 6px; border-left: 4px solid #2c3e50;">
                    <strong><i class="fas fa-calculator"></i> Aplicaciones Prácticas:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                        <button class="ejemplo-btn" data-ejemplo="area-seno" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-wave-square"></i> Área bajo onda
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="trabajo-fisica" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-bolt"></i> Trabajo en Física
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="probabilidad" style="background: #f39c12; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-chart-bar"></i> Probabilidad
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="longitud-arco" style="background: #2ecc71; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-ruler-combined"></i> Longitud de Arco
                        </button>
                        <button class="ejemplo-btn" data-ejemplo="caudal" style="background: #9b59b6; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-tint"></i> Caudal de Agua
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="input-group">
                <label for="comp-int-func"><i class="fas fa-function"></i> Función f(x) a integrar:</label>
                <input type="text" id="comp-int-func" placeholder="sin(x)">
                <small>Usa 'x' como variable. Ej: exp(-x^2), sqrt(1-x^2), 1/(1+x^2)</small>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="comp-int-a"><i class="fas fa-arrow-left"></i> Límite inferior (a):</label>
                    <input type="number" id="comp-int-a" value="0" step="0.1">
                </div>
                <div class="input-group">
                    <label for="comp-int-b"><i class="fas fa-arrow-right"></i> Límite superior (b):</label>
                    <input type="number" id="comp-int-b" value="3.14159" step="0.1">
                </div>
                <div class="input-group">
                    <label for="comp-int-n"><i class="fas fa-layer-group"></i> Número de intervalos (n):</label>
                    <input type="number" id="comp-int-n" value="10" min="1">
                    <small>Para Simpson 1/3, n debe ser par</small>
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="comp-int-tol"><i class="fas fa-bullseye"></i> Tolerancia (Romberg):</label>
                    <input type="number" id="comp-int-tol" value="0.00001" step="0.000001">
                </div>
                <div class="input-group">
                    <label for="comp-int-niveles"><i class="fas fa-sort-amount-up"></i> Niveles Romberg:</label>
                    <input type="number" id="comp-int-niveles" value="5" min="1" max="10">
                </div>
                <div class="input-group">
                    <label for="comp-int-sol-exacta"><i class="fas fa-check-double"></i> Valor exacto (opcional):</label>
                    <input type="number" id="comp-int-sol-exacta" placeholder="2">
                    <small>Para calcular error relativo</small>
                </div>
            </div>
            
            <div class="checkbox-group">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-trapecio" checked>
                    <span style="color: #3498db;"><i class="fas fa-shapes"></i> Incluir Trapecio</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-simpson13" checked>
                    <span style="color: #f39c12;"><i class="fas fa-project-diagram"></i> Incluir Simpson 1/3</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-simpson38" checked>
                    <span style="color: #e74c3c;"><i class="fas fa-sitemap"></i> Incluir Simpson 3/8</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="comp-incluir-romberg" checked>
                    <span style="color: #2ecc71;"><i class="fas fa-chess-board"></i> Incluir Romberg</span>
                </label>
            </div>
            
            <div class="button-group">
                <button id="comp-int-calc" class="calc-btn"><i class="fas fa-chart-bar"></i> Comparar Métodos</button>
                <button id="comp-int-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Aplicaciones</button>
                <button id="comp-int-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <div id="comp-int-descripcion-ejemplo" style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; display: none;">
                <!-- Descripción del ejemplo se mostrará aquí -->
            </div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-poll"></i> Resultados de la Comparación</h3>
            
            <div class="result-summary">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más preciso:</h4>
                        <p id="comp-int-mas-preciso" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="result-content">
                        <h4>Más rápido:</h4>
                        <p id="comp-int-mas-rapido" class="result-value">-</p>
                    </div>
                </div>
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="result-content">
                        <h4>Mejor eficiencia:</h4>
                        <p id="comp-int-mejor-eficiencia" class="result-value">-</p>
                    </div>
                </div>
            </div>
            
            <div class="result-container">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-bar"></i> Comparación de Resultados</h4>
                    <div class="chart-wrapper">
                        <canvas id="comp-int-chart"></canvas>
                    </div>
                </div>
                
                <div class="table-container">
                    <h4><i class="fas fa-table"></i> Comparación Detallada</h4>
                    <div class="table-wrapper">
                        <table id="comp-int-tabla">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-calculator"></i> Método</th>
                                    <th><i class="fas fa-calculator"></i> ∫f(x)dx</th>
                                    <th><i class="fas fa-layer-group"></i> Intervalos</th>
                                    <th><i class="fas fa-clock"></i> Tiempo (ms)</th>
                                    <th><i class="fas fa-bullseye"></i> Error Absoluto</th>
                                    <th><i class="fas fa-percentage"></i> Error Relativo %</th>
                                    <th><i class="fas fa-cogs"></i> Orden</th>
                                </tr>
                            </thead>
                            <tbody id="comp-int-tabla-body">
                                <tr><td colspan="7" class="empty-table">Haz clic en "Comparar Métodos"</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4><i class="fas fa-chart-line"></i> Convergencia de Métodos</h4>
                <div class="chart-wrapper">
                    <canvas id="comp-int-chart-convergencia"></canvas>
                </div>
            </div>
            
            <div id="comp-int-conclusiones" style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c3e50;">
                <h4><i class="fas fa-lightbulb"></i> Análisis y Recomendaciones Prácticas</h4>
                <p id="comp-int-conclusion-text">Ejecuta una comparación para ver análisis detallado de los métodos.</p>
            </div>
        </div>
    `;
    
    console.log('ComparacionIntegracion.js: Interfaz creada correctamente');
}

function asignarEventosComparacionIntegracion() {
    console.log('ComparacionIntegracion.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('comp-int-calc');
    const ejemploBtn = document.getElementById('comp-int-ejemplo');
    const clearBtn = document.getElementById('comp-int-clear');
    
    if (!calcBtn) {
        console.error('ComparacionIntegracion.js: Botón calcular no encontrado');
        return;
    }
    
    // MISMO PATRÓN: Remover eventos anteriores
    calcBtn.removeEventListener('click', compararMetodosIntegracion);
    ejemploBtn?.removeEventListener('click', mostrarMasAplicaciones);
    clearBtn?.removeEventListener('click', limpiarComparacionIntegracion);
    
    // MISMO PATRÓN: Asignar nuevos eventos
    calcBtn.addEventListener('click', compararMetodosIntegracion);
    if (ejemploBtn) ejemploBtn.addEventListener('click', mostrarMasAplicaciones);
    if (clearBtn) clearBtn.addEventListener('click', limpiarComparacionIntegracion);
    
    // Asignar eventos a los botones de ejemplo
    setTimeout(() => {
        document.querySelectorAll('.ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                cargarEjemploEspecificoIntegracion(this.getAttribute('data-ejemplo'));
            });
        });
    }, 100);
    
    console.log('ComparacionIntegracion.js: Eventos asignados correctamente');
}

function cargarEjemploInicialComparacionIntegracion() {
    const funcInput = document.getElementById('comp-int-func');
    if (funcInput && !funcInput.value.trim()) {
        console.log('ComparacionIntegracion.js: Cargando ejemplo inicial...');
        cargarEjemploEspecificoIntegracion('area-seno');
    }
}

function cargarEjemploEspecificoIntegracion(tipo) {
    const ejemplos = {
        'area-seno': {
            nombre: 'Área bajo una onda senoidal',
            funcion: 'sin(x)',
            a: '0',
            b: '3.14159',
            n: '10',
            solExacta: '2',
            descripcion: 'Cálculo del área bajo un ciclo completo de sin(x). Aplicación en ingeniería eléctrica para calcular valor RMS.',
            aplicacion: 'Ingeniería Eléctrica - Cálculo de valor efectivo (RMS)',
            formula: '∫₀^π sin(x) dx = 2'
        },
        'trabajo-fisica': {
            nombre: 'Trabajo realizado por fuerza variable',
            funcion: '10*sin(x)',
            a: '0',
            b: '3.14159',
            n: '8',
            solExacta: '20',
            descripcion: 'Cálculo del trabajo realizado por una fuerza sinusoidal. Aplicación en mecánica.',
            aplicacion: 'Física - Trabajo de fuerza variable',
            formula: '∫₀^π 10·sin(x) dx = 20'
        },
        'probabilidad': {
            nombre: 'Probabilidad en distribución normal',
            funcion: 'exp(-x^2/2)/sqrt(2*pi)',
            a: '-1',
            b: '1',
            n: '12',
            solExacta: '0.682689',
            descripcion: 'Cálculo de probabilidad P(-1 ≤ Z ≤ 1) en distribución normal estándar.',
            aplicacion: 'Estadística - Probabilidad normal',
            formula: '∫₋₁¹ φ(x) dx ≈ 0.6827 (68.27%)'
        },
        'longitud-arco': {
            nombre: 'Longitud de arco de curva',
            funcion: 'sqrt(1 + cos(x)^2)',
            a: '0',
            b: '3.14159',
            n: '16',
            solExacta: '3.8202',
            descripcion: 'Cálculo de longitud de arco de curva y = sin(x). Aplicación en diseño industrial.',
            aplicacion: 'Diseño Industrial - Longitud de curvas',
            formula: 'L = ∫₀^π √(1 + cos²(x)) dx ≈ 3.8202'
        },
        'caudal': {
            nombre: 'Caudal de agua en tubería',
            funcion: '4*sqrt(1 - x^2)',
            a: '-1',
            b: '1',
            n: '20',
            solExacta: '6.28319',
            descripcion: 'Cálculo del caudal total considerando perfil parabólico de velocidades.',
            aplicacion: 'Ingeniería Civil - Hidráulica',
            formula: 'Q = ∫₋₁¹ 4√(1-x²) dx = 2π ≈ 6.2832'
        }
    };
    
    const ejemplo = ejemplos[tipo];
    if (!ejemplo) return;
    
    document.getElementById('comp-int-func').value = ejemplo.funcion;
    document.getElementById('comp-int-a').value = ejemplo.a;
    document.getElementById('comp-int-b').value = ejemplo.b;
    document.getElementById('comp-int-n').value = ejemplo.n;
    document.getElementById('comp-int-sol-exacta').value = ejemplo.solExacta || '';
    document.getElementById('comp-int-tol').value = '0.00001';
    document.getElementById('comp-int-niveles').value = '5';
    
    // Mostrar descripción del ejemplo
    const descripcionDiv = document.getElementById('comp-int-descripcion-ejemplo');
    descripcionDiv.style.display = 'block';
    descripcionDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 15px;">
            <div style="flex: 1;">
                <h5 style="margin-top: 0; color: #2c3e50;">
                    <i class="fas fa-info-circle"></i> ${ejemplo.nombre}
                </h5>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">
                    <strong>Aplicación:</strong> ${ejemplo.aplicacion}
                </p>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">
                    <strong>Descripción:</strong> ${ejemplo.descripcion}
                </p>
                <p style="margin: 0.5rem 0; font-size: 0.9em;">
                    <strong>Fórmula exacta:</strong> ${ejemplo.formula}
                </p>
            </div>
            <div style="min-width: 120px; text-align: center; background: white; padding: 10px; border-radius: 6px; border: 1px solid #dee2e6;">
                <div style="color: #666; font-size: 0.8em;">Intervalos</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #3498db;">${ejemplo.n}</div>
                <div style="color: #666; font-size: 0.8em;">Tolerancia</div>
                <div style="font-size: 0.9rem; color: #2c3e50;">1×10⁻⁵</div>
            </div>
        </div>
    `;
    
    // Actualizar selector de ejemplos
    const ejemploSelector = document.querySelector('.ejemplo-selector');
    if (ejemploSelector) {
        ejemploSelector.innerHTML = `
            <div style="background: #f0f8ff; padding: 1rem; border-radius: 6px; border-left: 4px solid #2c3e50;">
                <strong><i class="fas fa-calculator"></i> Aplicaciones Prácticas:</strong>
                <p style="margin: 0.5rem 0 0.2rem 0; font-size: 0.9em;">${ejemplo.aplicacion}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                    ${Object.entries(ejemplos).map(([key, ej]) => `
                        <button class="ejemplo-btn" data-ejemplo="${key}" 
                                style="background: ${key === tipo ? '#2c3e50' : '#3498db'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                            <i class="${key === 'area-seno' ? 'fas fa-wave-square' : 
                                       key === 'trabajo-fisica' ? 'fas fa-bolt' : 
                                       key === 'probabilidad' ? 'fas fa-chart-bar' : 
                                       key === 'longitud-arco' ? 'fas fa-ruler-combined' : 
                                       'fas fa-tint'}"></i>
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
                    cargarEjemploEspecificoIntegracion(this.getAttribute('data-ejemplo'));
                });
            });
        }, 50);
    }
    
    setTimeout(() => compararMetodosIntegracion(), 400);
}

function mostrarMasAplicaciones() {
    const aplicacionesExtras = [
        {
            nombre: 'Energía en Circuito RLC',
            funcion: 'exp(-0.5*x)*sin(2*x)',
            a: '0',
            b: '5',
            n: '15',
            solExacta: '0.4',
            descripcion: 'Cálculo de energía disipada en circuito eléctrico subamortiguado.',
            aplicacion: 'Ingeniería Electrónica'
        },
        {
            nombre: 'Centro de Masa',
            funcion: 'x*sqrt(1-x^2)',
            a: '0',
            b: '1',
            n: '10',
            solExacta: '0.33333',
            descripcion: 'Cálculo del centro de masa de un semicírculo.',
            aplicacion: 'Mecánica - Estática'
        },
        {
            nombre: 'Valor Presente Neto',
            funcion: '1000*exp(-0.1*x)',
            a: '0',
            b: '10',
            n: '8',
            solExacta: '6321.21',
            descripcion: 'Cálculo del valor presente de flujos continuos.',
            aplicacion: 'Economía - Finanzas'
        },
        {
            nombre: 'Constante de Planck Experimental',
            funcion: 'x^3/(exp(x)-1)',
            a: '0',
            b: '10',
            n: '20',
            solExacta: '6.49394',
            descripcion: 'Integral de la ley de radiación de cuerpo negro.',
            aplicacion: 'Física - Termodinámica'
        }
    ];
    
    // Crear modal
    const modalHTML = `
        <div class="modal-overlay" id="aplicaciones-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0;"><i class="fas fa-industry"></i> Aplicaciones Avanzadas</h3>
                    <button id="cerrar-aplicaciones-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <p style="color: #666; margin-bottom: 1.5rem;">Ejemplos de integración numérica aplicada a problemas reales</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
                    ${aplicacionesExtras.map((app, index) => `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <h4 style="margin-top: 0; color: #2c3e50; font-size: 1rem;">${app.nombre}</h4>
                            <p style="margin: 0.5rem 0; font-size: 0.9em; color: #666;">${app.descripcion}</p>
                            <div style="background: white; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0; font-family: monospace; font-size: 0.8em;">
                                ∫${app.a}^${app.b} ${app.funcion} dx
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                                <span style="font-size: 0.8em; color: #666;">${app.aplicacion}</span>
                                <button class="cargar-aplicacion-btn" data-index="${index}" 
                                        style="background: #2c3e50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8em;">
                                    <i class="fas fa-play"></i> Cargar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior
    const modalAnterior = document.getElementById('aplicaciones-modal');
    if (modalAnterior) modalAnterior.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos
    document.getElementById('cerrar-aplicaciones-modal').addEventListener('click', function() {
        document.getElementById('aplicaciones-modal').remove();
    });
    
    document.querySelectorAll('.cargar-aplicacion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const app = aplicacionesExtras[index];
            
            document.getElementById('comp-int-func').value = app.funcion;
            document.getElementById('comp-int-a').value = app.a;
            document.getElementById('comp-int-b').value = app.b;
            document.getElementById('comp-int-n').value = app.n;
            document.getElementById('comp-int-sol-exacta').value = app.solExacta || '';
            
            document.getElementById('aplicaciones-modal').remove();
            
            // Mostrar descripción
            const descripcionDiv = document.getElementById('comp-int-descripcion-ejemplo');
            descripcionDiv.style.display = 'block';
            descripcionDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="flex: 1;">
                        <h5 style="margin-top: 0; color: #2c3e50;">
                            <i class="fas fa-industry"></i> ${app.nombre}
                        </h5>
                        <p style="margin: 0.5rem 0; font-size: 0.9em;">
                            <strong>Aplicación:</strong> ${app.aplicacion}
                        </p>
                        <p style="margin: 0.5rem 0; font-size: 0.9em;">
                            <strong>Descripción:</strong> ${app.descripcion}
                        </p>
                    </div>
                </div>
            `;
            
            setTimeout(() => compararMetodosIntegracion(), 300);
        });
    });
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('aplicaciones-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function compararMetodosIntegracion() {
    console.log('ComparacionIntegracion.js: Comparando métodos...');
    
    const funcEl = document.getElementById('comp-int-func');
    const aEl = document.getElementById('comp-int-a');
    const bEl = document.getElementById('comp-int-b');
    const nEl = document.getElementById('comp-int-n');
    const tolEl = document.getElementById('comp-int-tol');
    const nivelesEl = document.getElementById('comp-int-niveles');
    const solExactaEl = document.getElementById('comp-int-sol-exacta');
    
    if (!funcEl || !aEl || !bEl || !nEl || !tolEl || !nivelesEl) {
        showError('Error: Elementos de comparación no encontrados.');
        return;
    }
    
    const funcStr = funcEl.value.trim();
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    const n = parseInt(nEl.value);
    const tol = parseFloat(tolEl.value);
    const niveles = parseInt(nivelesEl.value);
    const solExacta = solExactaEl.value.trim() !== '' ? parseFloat(solExactaEl.value) : null;
    
    // Validaciones
    if (!funcStr) {
        showError('Ingresa la función a integrar', 'comp-int-func');
        return;
    }
    
    if (isNaN(a) || isNaN(b)) {
        showError('Los límites deben ser números', 'comp-int-a');
        return;
    }
    
    if (a >= b) {
        showError('El límite a debe ser menor que b', 'comp-int-a');
        return;
    }
    
    if (isNaN(n) || n <= 0) {
        showError('El número de intervalos debe ser positivo', 'comp-int-n');
        return;
    }
    
    // Verificar checkboxes
    const incluirTrapecio = document.getElementById('comp-incluir-trapecio').checked;
    const incluirSimpson13 = document.getElementById('comp-incluir-simpson13').checked;
    const incluirSimpson38 = document.getElementById('comp-incluir-simpson38').checked;
    const incluirRomberg = document.getElementById('comp-incluir-romberg').checked;
    
    if (!incluirTrapecio && !incluirSimpson13 && !incluirSimpson38 && !incluirRomberg) {
        showError('Selecciona al menos un método para comparar');
        return;
    }
    
    // Para Simpson 1/3, n debe ser par
    if (incluirSimpson13 && n % 2 !== 0) {
        showError('Para Simpson 1/3, n debe ser par. Usa n par o desactiva Simpson 1/3.');
        return;
    }
    
    // Para Simpson 3/8, n debe ser múltiplo de 3
    if (incluirSimpson38 && n % 3 !== 0) {
        showError('Para Simpson 3/8, n debe ser múltiplo de 3. Usa n múltiplo de 3 o desactiva Simpson 3/8.');
        return;
    }
    
    showLoading(document.getElementById('comp-int-calc'), true);
    
    setTimeout(() => {
        try {
            console.log('ComparacionIntegracion.js: Ejecutando comparación...');
            const resultados = ejecutarComparacionIntegracion(
                funcStr, a, b, n, tol, niveles, solExacta,
                incluirTrapecio, incluirSimpson13, incluirSimpson38, incluirRomberg
            );
            mostrarResultadosComparacionIntegracion(resultados, solExacta);
        } catch (error) {
            showError('Error en comparación: ' + error.message);
            console.error('ComparacionIntegracion.js error:', error);
        } finally {
            showLoading(document.getElementById('comp-int-calc'), false);
        }
    }, 50);
}

function ejecutarComparacionIntegracion(funcStr, a, b, n, tol, niveles, solExacta,
                                        incluirTrapecio, incluirSimpson13, incluirSimpson38, incluirRomberg) {
    
    const resultados = {};
    
    // Método del Trapecio
    if (incluirTrapecio) {
        const startTime = performance.now();
        const resultadoTrapecio = metodoTrapecio(funcStr, a, b, n);
        const tiempo = performance.now() - startTime;
        
        resultados.trapecio = {
            nombre: 'Trapecio Compuesto',
            color: '#3498db',
            valor: resultadoTrapecio.valor,
            intervalos: n,
            tiempo: tiempo,
            orden: 2,
            error: solExacta !== null ? Math.abs(resultadoTrapecio.valor - solExacta) : null
        };
    }
    
    // Método de Simpson 1/3
    if (incluirSimpson13) {
        const startTime = performance.now();
        const n13 = n % 2 === 0 ? n : n + 1; // Asegurar que sea par
        const resultadoSimpson13 = metodoSimpson13(funcStr, a, b, n13);
        const tiempo = performance.now() - startTime;
        
        resultados.simpson13 = {
            nombre: 'Simpson 1/3',
            color: '#f39c12',
            valor: resultadoSimpson13.valor,
            intervalos: n13,
            tiempo: tiempo,
            orden: 4,
            error: solExacta !== null ? Math.abs(resultadoSimpson13.valor - solExacta) : null
        };
    }
    
    // Método de Simpson 3/8
    if (incluirSimpson38) {
        const startTime = performance.now();
        const n38 = n % 3 === 0 ? n : n + (3 - (n % 3)); // Asegurar múltiplo de 3
        const resultadoSimpson38 = metodoSimpson38(funcStr, a, b, n38);
        const tiempo = performance.now() - startTime;
        
        resultados.simpson38 = {
            nombre: 'Simpson 3/8',
            color: '#e74c3c',
            valor: resultadoSimpson38.valor,
            intervalos: n38,
            tiempo: tiempo,
            orden: 4,
            error: solExacta !== null ? Math.abs(resultadoSimpson38.valor - solExacta) : null
        };
    }
    
    // Método de Romberg
    if (incluirRomberg) {
        const startTime = performance.now();
        const resultadoRomberg = metodoRomberg(funcStr, a, b, niveles, tol);
        const tiempo = performance.now() - startTime;
        
        resultados.romberg = {
            nombre: 'Romberg',
            color: '#2ecc71',
            valor: resultadoRomberg.valor,
            intervalos: resultadoRomberg.iteraciones,
            tiempo: tiempo,
            orden: 'Adaptativo',
            error: solExacta !== null ? Math.abs(resultadoRomberg.valor - solExacta) : null,
            convergencia: resultadoRomberg.convergencia
        };
    }
    
    return resultados;
}

function metodoTrapecio(funcStr, a, b, n) {
    const h = (b - a) / n;
    let suma = (evaluateExpression(funcStr, a) + evaluateExpression(funcStr, b)) / 2;
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        suma += evaluateExpression(funcStr, x);
    }
    
    return {
        valor: h * suma,
        convergencia: true
    };
}

function metodoSimpson13(funcStr, a, b, n) {
    if (n % 2 !== 0) n++; // Asegurar que sea par
    
    const h = (b - a) / n;
    let suma = evaluateExpression(funcStr, a) + evaluateExpression(funcStr, b);
    
    // Términos impares (x1, x3, x5, ...)
    for (let i = 1; i < n; i += 2) {
        const x = a + i * h;
        suma += 4 * evaluateExpression(funcStr, x);
    }
    
    // Términos pares (x2, x4, x6, ...)
    for (let i = 2; i < n; i += 2) {
        const x = a + i * h;
        suma += 2 * evaluateExpression(funcStr, x);
    }
    
    return {
        valor: (h / 3) * suma,
        convergencia: true
    };
}

function metodoSimpson38(funcStr, a, b, n) {
    if (n % 3 !== 0) n += (3 - (n % 3)); // Asegurar múltiplo de 3
    
    const h = (b - a) / n;
    let suma = evaluateExpression(funcStr, a) + evaluateExpression(funcStr, b);
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        if (i % 3 === 0) {
            suma += 2 * evaluateExpression(funcStr, x);
        } else {
            suma += 3 * evaluateExpression(funcStr, x);
        }
    }
    
    return {
        valor: (3 * h / 8) * suma,
        convergencia: true
    };
}

function metodoRomberg(funcStr, a, b, niveles, tol) {
    const R = [];
    
    // Primera aproximación (Regla del trapecio con 1 intervalo)
    R[0] = [];
    R[0][0] = (b - a) * (evaluateExpression(funcStr, a) + evaluateExpression(funcStr, b)) / 2;
    
    let iteraciones = 1;
    
    for (let i = 1; i < niveles; i++) {
        R[i] = [];
        const n = Math.pow(2, i);
        const h = (b - a) / n;
        
        // Regla del trapecio compuesto
        let suma = 0;
        for (let k = 1; k <= n-1; k += 2) {
            suma += evaluateExpression(funcStr, a + k * h);
        }
        
        R[i][0] = 0.5 * R[i-1][0] + h * suma;
        
        // Extrapolación de Richardson
        for (let j = 1; j <= i; j++) {
            const factor = Math.pow(4, j);
            R[i][j] = (factor * R[i][j-1] - R[i-1][j-1]) / (factor - 1);
        }
        
        iteraciones = n;
        
        // Verificar convergencia
        if (i >= 1 && Math.abs(R[i][i] - R[i-1][i-1]) < tol) {
            return {
                valor: R[i][i],
                iteraciones: iteraciones,
                convergencia: true,
                matriz: R
            };
        }
    }
    
    return {
        valor: R[niveles-1][niveles-1],
        iteraciones: iteraciones,
        convergencia: false,
        matriz: R
    };
}

function mostrarResultadosComparacionIntegracion(resultados, solExacta) {
    console.log('ComparacionIntegracion.js: Mostrando resultados...');
    
    // Actualizar tabla
    const tbody = document.getElementById('comp-int-tabla-body');
    if (tbody) {
        tbody.innerHTML = '';
        
        let masPreciso = { nombre: '', error: Infinity };
        let masRapido = { nombre: '', tiempo: Infinity };
        let mejorEficiencia = { nombre: '', eficiencia: -Infinity };
        
        Object.values(resultados).forEach(metodo => {
            const row = document.createElement('tr');
            
            // Calcular error relativo si hay solución exacta
            const errorRelativo = metodo.error !== null && solExacta !== 0 ? 
                (metodo.error / Math.abs(solExacta)) * 100 : null;
            
            // Calcular eficiencia (precisión/tiempo)
            const eficiencia = metodo.error !== null ? 
                (1 / (metodo.error + 1e-10)) / (metodo.tiempo + 1) : 0;
            
            row.innerHTML = `
                <td style="color: ${metodo.color}; font-weight: bold;">
                    <i class="fas fa-calculator"></i> ${metodo.nombre}
                </td>
                <td>${formatNumber(metodo.valor, 8)}</td>
                <td>${metodo.intervalos}</td>
                <td>${formatNumber(metodo.tiempo, 2)} ms</td>
                <td style="color: ${metodo.error > 0.01 ? '#e74c3c' : '#27ae60'};">
                    ${metodo.error !== null ? formatNumber(metodo.error, 8) : '-'}
                </td>
                <td>
                    ${errorRelativo !== null ? formatNumber(errorRelativo, 4) + '%' : '-'}
                </td>
                <td>
                    <span style="background: ${metodo.color}20; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem;">
                        ${metodo.orden}
                    </span>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Encontrar el más preciso
            if (metodo.error !== null && metodo.error < masPreciso.error) {
                masPreciso = { nombre: metodo.nombre, error: metodo.error };
            }
            
            // Encontrar el más rápido
            if (metodo.tiempo < masRapido.tiempo) {
                masRapido = { nombre: metodo.nombre, tiempo: metodo.tiempo };
            }
            
            // Encontrar mejor eficiencia
            if (eficiencia > mejorEficiencia.eficiencia) {
                mejorEficiencia = { nombre: metodo.nombre, eficiencia: eficiencia };
            }
        });
        
        // Actualizar resumen
        document.getElementById('comp-int-mas-preciso').textContent = masPreciso.nombre || '-';
        document.getElementById('comp-int-mas-rapido').textContent = masRapido.nombre || '-';
        document.getElementById('comp-int-mejor-eficiencia').textContent = mejorEficiencia.nombre || '-';
    }
    
    // Crear gráficos
    crearGraficosComparacionIntegracion(resultados, solExacta);
    
    // Mostrar conclusiones
    mostrarConclusionesIntegracion(resultados, solExacta);
}

function crearGraficosComparacionIntegracion(resultados, solExacta) {
    const metodos = Object.values(resultados);
    if (metodos.length === 0) return;
    
    // Gráfico de comparación de valores
    const labels = metodos.map(m => m.nombre);
    const valores = metodos.map(m => m.valor);
    const colores = metodos.map(m => m.color);
    
    // Agregar línea de valor exacto si existe
    const datasets = [{
        label: 'Valor aproximado',
        data: valores,
        backgroundColor: colores,
        borderColor: colores.map(c => c.replace('0.6', '1')),
        borderWidth: 2
    }];
    
    if (solExacta !== null) {
        datasets.push({
            label: 'Valor exacto',
            data: Array(metodos.length).fill(solExacta),
            borderColor: '#2c3e50',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            type: 'line',
            fill: false
        });
    }
    
    createChart('comp-int-chart', {
        labels: labels,
        datasets: datasets
    }, {
        type: 'bar',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Comparación de Resultados' }
        },
        scales: {
            y: {
                title: { display: true, text: 'Valor de la integral' }
            }
        }
    });
    
    // Gráfico de errores si hay solución exacta
    const metodosConError = metodos.filter(m => m.error !== null);
    if (metodosConError.length > 0) {
        createChart('comp-int-chart-convergencia', {
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
                    type: 'logarithmic',
                    title: { display: true, text: 'Error (escala logarítmica)' }
                }
            }
        });
    }
}

function mostrarConclusionesIntegracion(resultados, solExacta) {
    const conclusionesDiv = document.getElementById('comp-int-conclusiones');
    const metodos = Object.values(resultados);
    
    if (metodos.length === 0) {
        conclusionesDiv.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> Análisis y Recomendaciones Prácticas</h4>
            <p>Ejecuta una comparación para ver análisis detallado de los métodos.</p>
        `;
        return;
    }
    
    const trapecio = metodos.find(m => m.nombre === 'Trapecio Compuesto');
    const simpson13 = metodos.find(m => m.nombre === 'Simpson 1/3');
    const simpson38 = metodos.find(m => m.nombre === 'Simpson 3/8');
    const romberg = metodos.find(m => m.nombre === 'Romberg');
    
    let conclusiones = '<h4><i class="fas fa-lightbulb"></i> Análisis y Recomendaciones Prácticas</h4>';
    conclusiones += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">';
    
    // Análisis de métodos
    conclusiones += `
        <div>
            <h5 style="margin-top: 0; color: #2c3e50;">📊 Análisis Comparativo</h5>
            <ul style="margin-bottom: 0;">
    `;
    
    if (trapecio) {
        conclusiones += `<li><strong>Trapecio:</strong> Simple pero menos preciso. Error del orden h².</li>`;
    }
    
    if (simpson13) {
        conclusiones += `<li><strong>Simpson 1/3:</strong> Preciso para funciones suaves. Error del orden h⁴.</li>`;
    }
    
    if (simpson38) {
        conclusiones += `<li><strong>Simpson 3/8:</strong> Similar a 1/3 pero requiere múltiplos de 3.</li>`;
    }
    
    if (romberg) {
        conclusiones += `<li><strong>Romberg:</strong> Más preciso, usa extrapolación de Richardson.</li>`;
    }
    
    conclusiones += `</ul></div>`;
    
    // Recomendaciones prácticas
    conclusiones += `
        <div>
            <h5 style="margin-top: 0; color: #2c3e50;">🎯 Recomendaciones de Uso</h5>
            <ul style="margin-bottom: 0;">
                <li><strong>Para funciones suaves:</strong> Simpson 1/3 es óptimo</li>
                <li><strong>Para alta precisión:</strong> Romberg es la mejor opción</li>
                <li><strong>Para simplicidad:</strong> Trapecio es suficiente</li>
                <li><strong>Para aplicaciones en tiempo real:</strong> Considerar velocidad vs precisión</li>
                <li><strong>Para educación:</strong> Empezar con Trapecio, luego Simpson</li>
            </ul>
        </div>
    `;
    
    conclusiones += '</div>';
    
    // Estadísticas adicionales si hay solución exacta
    if (solExacta !== null) {
        const mejorMetodo = metodos.reduce((best, current) => {
            if (current.error === null) return best;
            if (best.error === null) return current;
            return current.error < best.error ? current : best;
        }, { error: null });
        
        const peorMetodo = metodos.reduce((worst, current) => {
            if (current.error === null) return worst;
            if (worst.error === null) return current;
            return current.error > worst.error ? current : worst;
        }, { error: null });
        
        if (mejorMetodo.error !== null && peorMetodo.error !== null) {
            conclusiones += `
                <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 6px; border: 1px solid #dee2e6;">
                    <h5 style="margin-top: 0; color: #2c3e50;">📈 Estadísticas de Precisión</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 0.9em; color: #666;">Más preciso</div>
                            <div style="font-size: 1.2rem; font-weight: bold; color: #27ae60;">${mejorMetodo.nombre}</div>
                            <div style="font-size: 0.9em; color: #666;">Error: ${formatNumber(mejorMetodo.error, 8)}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.9em; color: #666;">Menos preciso</div>
                            <div style="font-size: 1.2rem; font-weight: bold; color: #e74c3c;">${peorMetodo.nombre}</div>
                            <div style="font-size: 0.9em; color: #666;">Error: ${formatNumber(peorMetodo.error, 8)}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    conclusionesDiv.innerHTML = conclusiones;
}

function limpiarComparacionIntegracion() {
    console.log('ComparacionIntegracion.js: Limpiando...');
    
    document.getElementById('comp-int-func').value = '';
    document.getElementById('comp-int-a').value = '0';
    document.getElementById('comp-int-b').value = '3.14159';
    document.getElementById('comp-int-n').value = '10';
    document.getElementById('comp-int-tol').value = '0.00001';
    document.getElementById('comp-int-niveles').value = '5';
    document.getElementById('comp-int-sol-exacta').value = '';
    
    // Ocultar descripción
    document.getElementById('comp-int-descripcion-ejemplo').style.display = 'none';
    
    // Resetear resultados
    document.getElementById('comp-int-mas-preciso').textContent = '-';
    document.getElementById('comp-int-mas-rapido').textContent = '-';
    document.getElementById('comp-int-mejor-eficiencia').textContent = '-';
    
    const tbody = document.getElementById('comp-int-tabla-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">Haz clic en "Comparar Métodos"</td></tr>';
    }
    
    // Limpiar gráficos
    ['comp-int-chart', 'comp-int-chart-convergencia'].forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Limpiar conclusiones
    const conclusionesDiv = document.getElementById('comp-int-conclusiones');
    if (conclusionesDiv) {
        conclusionesDiv.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> Análisis y Recomendaciones Prácticas</h4>
            <p>Ejecuta una comparación para ver análisis detallado de los métodos.</p>
        `;
    }
}