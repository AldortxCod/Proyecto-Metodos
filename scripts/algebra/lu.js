/**
 * lu.js - Descomposición LU
 * Implementa factorización LU con pivoteo para resolver sistemas lineales
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('LU.js: Cargado');
    
    // Escuchar cuando la sección de álgebra se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'algebra') {
            console.log('LU.js: Sección Álgebra activada');
            setTimeout(inicializarLU, 300);
        }
    });
    
    // Escuchar cuando se seleccione LU
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'lu') {
            console.log('LU.js: Método LU seleccionado');
            setTimeout(inicializarLU, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarLUVibilidad, 1000);
});

function verificarLUVibilidad() {
    const luContent = document.getElementById('lu-content');
    if (luContent && !luContent.classList.contains('hidden')) {
        console.log('LU.js: Ya visible al cargar');
        inicializarLU();
    }
}

function inicializarLU() {
    console.log('LU.js: Inicializando...');
    
    const luContent = document.getElementById('lu-content');
    if (!luContent) {
        console.error('LU.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.luInitialized) {
        console.log('LU.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (luContent.innerHTML.trim() === '' || !document.getElementById('lu-n')) {
        console.log('LU.js: Creando interfaz...');
        crearInterfazLU();
    }
    
    // Asignar eventos
    asignarEventosLU();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialLU();
    
    // Marcar como inicializado
    window.luInitialized = true;
    console.log('LU.js: Inicialización completada');
}

function crearInterfazLU() {
    const content = document.getElementById('lu-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-cube"></i> Descomposición LU</h3>
            <p>Factorización LU con pivoteo para resolver sistemas lineales Ax = b</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="lu-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="lu-n"><i class="fas fa-sort-numeric-up"></i> Dimensión de la matriz (n)</label>
                <input type="number" id="lu-n" value="3" min="2" max="10" step="1">
                <small>Tamaño de la matriz cuadrada n×n</small>
            </div>
            
            <!-- Matriz A -->
            <div class="input-group">
                <label><i class="fas fa-th"></i> Matriz A</label>
                <div id="lu-matriz-a-container" style="margin-top: 0.5rem;">
                    <!-- Se generará dinámicamente -->
                </div>
            </div>
            
            <!-- Vector b (opcional) -->
            <div class="input-group">
                <label><i class="fas fa-vector-square"></i> Vector b (términos independientes) - Opcional</label>
                <div id="lu-vector-b-container" style="margin-top: 0.5rem;">
                    <!-- Se generará dinámicamente -->
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="lu-pivoteo"><i class="fas fa-random"></i> Tipo de pivoteo</label>
                    <select id="lu-pivoteo" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="parcial">Pivoteo Parcial</option>
                        <option value="total">Pivoteo Total</option>
                        <option value="ninguno">Sin Pivoteo</option>
                    </select>
                    <small>Seleccionar estrategia de pivoteo</small>
                </div>
                <div class="input-group">
                    <label for="lu-precision"><i class="fas fa-bullseye"></i> Precisión</label>
                    <input type="number" id="lu-precision" value="0.0001" step="0.0001" min="0.0000001">
                    <small>Tolerancia para ceros</small>
                </div>
                <div class="input-group">
                    <label for="lu-tipo"><i class="fas fa-cogs"></i> Tipo de factorización</label>
                    <select id="lu-tipo" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="doolittle">Doolittle (L con 1's diagonal)</option>
                        <option value="crout">Crout (U con 1's diagonal)</option>
                        <option value="cholesky">Cholesky (A simétrica definida positiva)</option>
                    </select>
                    <small>Algoritmo de factorización</small>
                </div>
            </div>
            
            <div class="input-group">
                <label><i class="fas fa-cogs"></i> Opciones de cálculo</label>
                <div class="checkbox-group" style="display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="lu-resolver-sistema" checked style="transform: scale(1.2);">
                        <span style="color: #3498db; font-weight: bold;">
                            <i class="fas fa-calculator"></i> Resolver sistema Ax=b
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="lu-calcular-determinante" style="transform: scale(1.2);">
                        <span style="color: #e74c3c; font-weight: bold;">
                            <i class="fas fa-infinity"></i> Calcular determinante
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="lu-calcular-inversa" style="transform: scale(1.2);">
                        <span style="color: #2ecc71; font-weight: bold;">
                            <i class="fas fa-exchange-alt"></i> Calcular inversa A⁻¹
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="lu-mostrar-pasos" style="transform: scale(1.2);">
                        <span style="color: #9b59b6; font-weight: bold;">
                            <i class="fas fa-list-ol"></i> Mostrar pasos
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="lu-calc" class="calc-btn"><i class="fas fa-cogs"></i> Calcular Factorización LU</button>
                <button id="lu-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="lu-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
                <button id="lu-generar" class="generar-btn"><i class="fas fa-random"></i> Generar Aleatoria</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="lu-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-bar"></i> Resultados de la Factorización</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-check-circle"></i> Matrices L y U:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
                        <div>
                            <h5 style="color: #3498db;"><i class="fas fa-arrow-down"></i> Matriz L (Triangular Inferior)</h5>
                            <div id="lu-matriz-l" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace;">
                                <!-- Matriz L se mostrará aquí -->
                            </div>
                        </div>
                        <div>
                            <h5 style="color: #e74c3c;"><i class="fas fa-arrow-up"></i> Matriz U (Triangular Superior)</h5>
                            <div id="lu-matriz-u" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace;">
                                <!-- Matriz U se mostrará aquí -->
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1.5rem;">
                        <h4><i class="fas fa-exchange-alt"></i> Matriz de Permutación P:</h4>
                        <div id="lu-matriz-p" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace; margin-top: 0.5rem;">
                            <!-- Matriz P se mostrará aquí -->
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-ruler-combined"></i> Verificación:</h4>
                            <div id="lu-verificacion" style="margin-top: 0.5rem;">
                                <!-- Verificación PA = LU se mostrará aquí -->
                            </div>
                            <h4 style="margin-top: 1rem;"><i class="fas fa-info-circle"></i> Propiedades:</h4>
                            <div id="lu-propiedades" style="margin-top: 0.5rem;">
                                <!-- Propiedades se mostrarán aquí -->
                            </div>
                        </div>
                        <div>
                            <h4><i class="fas fa-calculator"></i> Resultados:</h4>
                            <div id="lu-resultados" style="margin-top: 0.5rem;">
                                <!-- Resultados varios se mostrarán aquí -->
                            </div>
                            <h4 style="margin-top: 1rem;"><i class="fas fa-clock"></i> Tiempos:</h4>
                            <div id="lu-tiempos" style="margin-top: 0.5rem;">
                                <!-- Tiempos de cálculo -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <h4><i class="fas fa-chart-bar"></i> Análisis de Matrices</h4>
                    <div style="height: 300px;">
                        <canvas id="lu-chart"></canvas>
                    </div>
                    <div style="margin-top: 1rem;">
                        <h5><i class="fas fa-balance-scale"></i> Comparación de Métodos</h5>
                        <div style="height: 200px;">
                            <canvas id="lu-comparacion-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Solución del sistema (si se calculó) -->
            <div class="iterations-table" id="lu-solucion-container" style="margin-top: 2rem; display: none;">
                <h4><i class="fas fa-code-branch"></i> Solución del Sistema Ax = b</h4>
                <div class="table-container">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem;">
                        <div>
                            <h5>Solución x:</h5>
                            <div id="lu-solucion-x" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace;">
                                <!-- Solución x se mostrará aquí -->
                            </div>
                        </div>
                        <div>
                            <h5>Sustitución hacia adelante Ly = Pb:</h5>
                            <div id="lu-solucion-y" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace;">
                                <!-- Vector y se mostrará aquí -->
                            </div>
                        </div>
                        <div>
                            <h5>Sustitución hacia atrás Ux = y:</h5>
                            <div id="lu-solucion-ux" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace;">
                                <!-- Proceso Ux=y se mostrará aquí -->
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 1rem;">
                        <h5>Residuos y error:</h5>
                        <div id="lu-residuos" style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
                            <!-- Residuos se mostrarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Inversa de la matriz (si se calculó) -->
            <div class="iterations-table" id="lu-inversa-container" style="margin-top: 2rem; display: none;">
                <h4><i class="fas fa-exchange-alt"></i> Matriz Inversa A⁻¹</h4>
                <div class="table-container">
                    <div id="lu-matriz-inversa" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace; max-height: 300px; overflow-y: auto;">
                        <!-- Matriz inversa se mostrará aquí -->
                    </div>
                    <div style="margin-top: 1rem;">
                        <button id="lu-verificar-inversa" class="calc-btn-small"><i class="fas fa-check"></i> Verificar A·A⁻¹ = I</button>
                        <button id="lu-copiar-inversa" class="example-btn-small"><i class="fas fa-copy"></i> Copiar Matriz</button>
                    </div>
                </div>
            </div>
            
            <!-- Pasos del algoritmo -->
            <div class="iterations-table" id="lu-pasos-container" style="margin-top: 2rem; display: none;">
                <h4><i class="fas fa-list-ol"></i> Pasos de la Factorización LU</h4>
                <div class="table-container">
                    <table id="lu-pasos-table">
                        <thead>
                            <tr>
                                <th>Paso</th>
                                <th>Descripción</th>
                                <th>Operación</th>
                                <th>Matriz Resultante</th>
                            </tr>
                        </thead>
                        <tbody id="lu-pasos-body">
                            <!-- Pasos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Explicación del método -->
            <div class="conclusion-box" id="lu-explicacion-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f4fd 0%, #d4e9fa 100%); border-radius: 8px; border-left: 4px solid #3498db;">
                <h4 style="margin-top: 0; color: #3498db;">
                    <i class="fas fa-lightbulb"></i> Teoría: Descomposición LU
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <p><strong>Factorización LU:</strong> A = LU</p>
                        <p><strong>Con pivoteo:</strong> PA = LU</p>
                        <p><strong>Doolittle:</strong> L con 1's en diagonal</p>
                        <p><strong>Crout:</strong> U con 1's en diagonal</p>
                    </div>
                    <div>
                        <p><strong>Determinante:</strong> det(A) = (-1)^s × ∏ᵢ uᵢᵢ</p>
                        <p><strong>Sistema:</strong> LUx = b → Ly = b, Ux = y</p>
                        <p><strong>Inversa:</strong> Resolver AX = I por columnas</p>
                        <p><strong>Complejidad:</strong> O(n³/3) operaciones</p>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 6px; border: 1px solid #ddd;">
                    <strong>Algoritmo Doolittle:</strong><br>
                    Para k = 1 hasta n:<br>
                    &nbsp;&nbsp;uₖⱼ = aₖⱼ - Σₗ₌₁ᵏ⁻¹ lₖₗ uₗⱼ, j = k,...,n<br>
                    &nbsp;&nbsp;lᵢₖ = (aᵢₖ - Σₗ₌₁ᵏ⁻¹ lᵢₗ uₗₖ) / uₖₖ, i = k+1,...,n
                </div>
            </div>
        </div>
    `;
    
    console.log('LU.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemploLU();
    
    // Generar matrices iniciales
    generarMatricesLU();
    
    // Agregar evento para actualizar matrices cuando cambia la dimensión
    document.getElementById('lu-n').addEventListener('change', generarMatricesLU);
}

function inicializarSelectorEjemploLU() {
    const ejemplos = [
        {
            nombre: "Matriz 3×3 Simple",
            descripcion: "Matriz fácil de factorizar con pivoteo parcial",
            n: 3,
            A: [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]],
            b: [8, -11, -3],
            tipo: "doolittle",
            pivoteo: "parcial",
            solucionExacta: [2, 3, -1],
            nota: "Matriz no singular - requiere pivoteo"
        },
        {
            nombre: "Matriz Simétrica Def.Positiva",
            descripcion: "Matriz para factorización de Cholesky",
            n: 3,
            A: [[4, 12, -16], [12, 37, -43], [-16, -43, 98]],
            b: [0, 0, 0],
            tipo: "cholesky",
            pivoteo: "ninguno",
            solucionExacta: [0, 0, 0],
            nota: "A = GGᵀ donde G es triangular inferior"
        },
        {
            nombre: "Matriz de Hilbert 4×4",
            descripcion: "Matriz mal condicionada - prueba de estabilidad",
            n: 4,
            A: [
                [1, 1/2, 1/3, 1/4],
                [1/2, 1/3, 1/4, 1/5],
                [1/3, 1/4, 1/5, 1/6],
                [1/4, 1/5, 1/6, 1/7]
            ],
            b: [25/12, 77/60, 57/60, 319/420],
            tipo: "doolittle",
            pivoteo: "total",
            solucionExacta: [1, 1, 1, 1],
            nota: "Matriz mal condicionada - requiere pivoteo total"
        },
        {
            nombre: "Matriz Diagonal Dominante",
            descripcion: "Matriz que no requiere pivoteo",
            n: 3,
            A: [[10, 2, 1], [1, 10, 2], [2, 1, 10]],
            b: [13, 13, 13],
            tipo: "crout",
            pivoteo: "ninguno",
            solucionExacta: [1, 1, 1],
            nota: "Matriz diagonalmente dominante - estable sin pivoteo"
        },
        {
            nombre: "Matriz Singular (Ejemplo)",
            descripcion: "Matriz singular para demostrar detección",
            n: 3,
            A: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            b: [6, 15, 24],
            tipo: "doolittle",
            pivoteo: "parcial",
            solucionExacta: null,
            nota: "Matriz singular - determinante cero"
        },
        {
            nombre: "Matriz Tridiagonal",
            descripcion: "Matriz banda común en diferencias finitas",
            n: 4,
            A: [[2, -1, 0, 0], [-1, 2, -1, 0], [0, -1, 2, -1], [0, 0, -1, 2]],
            b: [1, 0, 0, 1],
            tipo: "doolittle",
            pivoteo: "ninguno",
            solucionExacta: [0.8, 0.6, 0.6, 0.8],
            nota: "Matriz simétrica definida positiva - estructura banda"
        }
    ];
    
    const selector = document.getElementById('lu-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #3498db;">
            <h4 style="margin-bottom: 1rem; color: #3498db;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Factorización LU
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #3498db; margin-bottom: 0.5rem;">
                            <i class="fas fa-cube"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-lu-ejemplo-btn" data-index="${index}" 
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
        document.querySelectorAll('.cargar-lu-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoLU(ejemplos[index]);
            });
        });
    }, 100);
}

function generarMatricesLU() {
    const n = parseInt(document.getElementById('lu-n').value);
    
    // Contenedores
    const matrizAContainer = document.getElementById('lu-matriz-a-container');
    const vectorBContainer = document.getElementById('lu-vector-b-container');
    
    if (!matrizAContainer || !vectorBContainer) return;
    
    // Generar matriz A
    let htmlA = '<div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">';
    htmlA += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem;">';
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const valor = (i === j) ? '2' : (Math.abs(i-j) === 1 ? '-1' : '0');
            htmlA += `
                <div>
                    <label style="font-size: 0.8rem; color: #666;">a${i+1}${j+1}</label>
                    <input type="number" class="lu-a" data-i="${i}" data-j="${j}" 
                           value="${valor}" step="0.1" style="width: 100%;">
                </div>
            `;
        }
    }
    htmlA += '</div></div>';
    matrizAContainer.innerHTML = htmlA;
    
    // Generar vector b (opcional)
    let htmlB = '<div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">';
    htmlB += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">';
    
    for (let i = 0; i < n; i++) {
        const valor = (n === 3) ? '8' : (n === 2) ? '3' : '1';
        htmlB += `
            <div>
                <label style="font-size: 0.8rem; color: #666;">b${i+1}</label>
                <input type="number" class="lu-b" data-i="${i}" 
                       value="${valor}" step="0.1" style="width: 100%;">
            </div>
        `;
    }
    htmlB += '</div></div>';
    vectorBContainer.innerHTML = htmlB;
}

function asignarEventosLU() {
    console.log('LU.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('lu-calc');
    const ejemploBtn = document.getElementById('lu-ejemplo');
    const clearBtn = document.getElementById('lu-clear');
    const generarBtn = document.getElementById('lu-generar');
    const verificarInversaBtn = document.getElementById('lu-verificar-inversa');
    const copiarInversaBtn = document.getElementById('lu-copiar-inversa');
    
    if (!calcBtn) {
        console.error('LU.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularLU);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemploLU);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarLU);
    }
    
    if (generarBtn) {
        const newGenerarBtn = generarBtn.cloneNode(true);
        generarBtn.parentNode.replaceChild(newGenerarBtn, generarBtn);
        newGenerarBtn.addEventListener('click', generarMatrizAleatoriaLU);
    }
    
    // Asignar eventos para botones que se crearán dinámicamente
    setTimeout(() => {
        const verificarBtn = document.getElementById('lu-verificar-inversa');
        const copiarBtn = document.getElementById('lu-copiar-inversa');
        
        if (verificarBtn) {
            verificarBtn.addEventListener('click', verificarInversaLU);
        }
        
        if (copiarBtn) {
            copiarBtn.addEventListener('click', copiarInversaLU);
        }
    }, 500);
    
    console.log('LU.js: Eventos asignados correctamente');
}

function cargarEjemploInicialLU() {
    console.log('LU.js: Cargando ejemplo inicial...');
    
    const ejemplo = {
        nombre: "Matriz 3×3 Simple",
        descripcion: "Matriz fácil de factorizar con pivoteo parcial",
        n: 3,
        A: [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]],
        b: [8, -11, -3],
        tipo: "doolittle",
        pivoteo: "parcial",
        solucionExacta: [2, 3, -1],
        nota: "Matriz no singular - requiere pivoteo"
    };
    
    cargarEjemploEspecificoLU(ejemplo);
}

function cargarEjemploEspecificoLU(ejemplo) {
    console.log(`LU.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar dimensión
    document.getElementById('lu-n').value = ejemplo.n;
    generarMatricesLU();
    
    // Dar tiempo para que se generen las matrices
    setTimeout(() => {
        // Rellenar matriz A
        for (let i = 0; i < ejemplo.n; i++) {
            for (let j = 0; j < ejemplo.n; j++) {
                const input = document.querySelector(`.lu-a[data-i="${i}"][data-j="${j}"]`);
                if (input) input.value = ejemplo.A[i][j];
            }
        }
        
        // Rellenar vector b
        for (let i = 0; i < ejemplo.n; i++) {
            const input = document.querySelector(`.lu-b[data-i="${i}"]`);
            if (input) input.value = ejemplo.b[i];
        }
        
        // Configurar otros parámetros
        document.getElementById('lu-tipo').value = ejemplo.tipo;
        document.getElementById('lu-pivoteo').value = ejemplo.pivoteo;
        document.getElementById('lu-precision').value = 0.0001;
        document.getElementById('lu-resolver-sistema').checked = true;
        document.getElementById('lu-calcular-determinante').checked = true;
        document.getElementById('lu-calcular-inversa').checked = false;
        document.getElementById('lu-mostrar-pasos').checked = false;
        
        // Mostrar descripción del ejemplo
        let descripcion = document.getElementById('lu-descripcion-ejemplo');
        if (!descripcion) {
            descripcion = document.createElement('div');
            descripcion.id = 'lu-descripcion-ejemplo';
            const inputSection = document.querySelector('#lu-content .input-group:first-child');
            if (inputSection) {
                inputSection.parentNode.insertBefore(descripcion, inputSection.nextSibling);
            }
        }
        
        descripcion.innerHTML = `
            <div style="padding: 1rem; background: #e8f4fd; border-radius: 6px; border-left: 4px solid #3498db;">
                <strong style="color: #2980b9;">
                    <i class="fas fa-info-circle"></i> Ejemplo práctico:
                </strong> ${ejemplo.descripcion}
                ${ejemplo.nota ? `<br><small><i class="fas fa-lightbulb"></i> ${ejemplo.nota}</small>` : ''}
                ${ejemplo.solucionExacta ? `<br><small><i class="fas fa-bullseye"></i> Solución exacta: [${ejemplo.solucionExacta.join(', ')}]</small>` : ''}
            </div>
        `;
        
        // Calcular automáticamente después de un breve delay
        setTimeout(() => {
            calcularLU();
        }, 400);
        
    }, 200);
}

function calcularLU() {
    console.log('LU.js: Calculando factorización...');
    
    // OBTENER PARÁMETROS
    const n = parseInt(document.getElementById('lu-n').value);
    const precision = parseFloat(document.getElementById('lu-precision').value);
    const tipo = document.getElementById('lu-tipo').value;
    const pivoteo = document.getElementById('lu-pivoteo').value;
    const resolverSistema = document.getElementById('lu-resolver-sistema').checked;
    const calcularDeterminante = document.getElementById('lu-calcular-determinante').checked;
    const calcularInversa = document.getElementById('lu-calcular-inversa').checked;
    const mostrarPasos = document.getElementById('lu-mostrar-pasos').checked;
    
    // Validaciones básicas
    if (isNaN(n) || n < 2) {
        showError('La dimensión debe ser ≥ 2', 'lu-n');
        return;
    }
    
    if (isNaN(precision) || precision <= 0) {
        showError('La precisión debe ser positiva', 'lu-precision');
        return;
    }
    
    // Obtener matriz A
    const A = [];
    for (let i = 0; i < n; i++) {
        A[i] = [];
        for (let j = 0; j < n; j++) {
            const input = document.querySelector(`.lu-a[data-i="${i}"][data-j="${j}"]`);
            if (!input) {
                showError(`Elemento a${i+1}${j+1} no encontrado`);
                return;
            }
            const valor = parseFloat(input.value);
            if (isNaN(valor)) {
                showError(`Elemento a${i+1}${j+1} no es un número válido`);
                return;
            }
            A[i][j] = valor;
        }
    }
    
    // Obtener vector b (si se va a resolver sistema)
    let b = null;
    if (resolverSistema) {
        b = [];
        for (let i = 0; i < n; i++) {
            const input = document.querySelector(`.lu-b[data-i="${i}"]`);
            if (!input) {
                showError(`Elemento b${i+1} no encontrado`);
                return;
            }
            const valor = parseFloat(input.value);
            if (isNaN(valor)) {
                showError(`Elemento b${i+1} no es un número válido`);
                return;
            }
            b[i] = valor;
        }
    }
    
    // Verificar tipo Cholesky requiere matriz simétrica
    if (tipo === 'cholesky') {
        let esSimetrica = true;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(A[i][j] - A[j][i]) > precision) {
                    esSimetrica = false;
                    break;
                }
            }
            if (!esSimetrica) break;
        }
        
        if (!esSimetrica) {
            showError('Cholesky requiere matriz simétrica');
            return;
        }
    }
    
    // Mostrar loading
    showLoading(document.getElementById('lu-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Ejecutar factorización LU según tipo
            let resultado;
            switch (tipo) {
                case 'doolittle':
                    resultado = factorizacionDoolittle(A, n, precision, pivoteo, mostrarPasos);
                    break;
                case 'crout':
                    resultado = factorizacionCrout(A, n, precision, pivoteo, mostrarPasos);
                    break;
                case 'cholesky':
                    resultado = factorizacionCholesky(A, n, precision, mostrarPasos);
                    break;
                default:
                    throw new Error('Tipo de factorización no válido');
            }
            
            // Si se solicitó resolver sistema
            if (resolverSistema && b) {
                resultado.solucion = resolverSistemaLU(resultado, b, n);
                
                // Calcular residuos
                resultado.residuos = calcularResiduos(A, b, resultado.solucion.x, n);
            }
            
            // Si se solicitó calcular determinante
            if (calcularDeterminante) {
                resultado.determinante = calcularDeterminanteLU(resultado, n);
            }
            
            // Si se solicitó calcular inversa
            if (calcularInversa) {
                resultado.inversa = calcularInversaLU(resultado, n, precision);
            }
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            mostrarResultadosLU(resultado, A, b, n);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('LU.js error:', error);
        } finally {
            showLoading(document.getElementById('lu-calc'), false);
        }
    }, 100);
}

function factorizacionDoolittle(A, n, eps, pivoteo, mostrarPasos) {
    console.log('LU.js: Ejecutando factorización Doolittle con pivoteo', pivoteo);
    
    const pasos = [];
    let L = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let U = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let P = new Array(n).fill(0).map((_, i) => i); // Permutación inicial
    let cambios = 0; // Contador de intercambios para determinante
    
    // Inicializar L con 1's en diagonal
    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
    }
    
    // Copiar A a U temporalmente
    const A_copia = A.map(row => [...row]);
    
    if (mostrarPasos) {
        pasos.push({
            paso: 'Inicialización',
            descripcion: 'Inicializar matrices L, U y P',
            operacion: 'L = I, U = A, P = [0,1,...,n-1]',
            matriz: `L:\n${matrizToString(L)}\n\nU:\n${matrizToString(A_copia)}`
        });
    }
    
    for (let k = 0; k < n; k++) {
        // Aplicar pivoteo si es necesario
        if (pivoteo === 'parcial' || pivoteo === 'total') {
            let pivotRow = k;
            let pivotCol = k;
            let maxVal = Math.abs(A_copia[k][k]);
            
            // Buscar pivote
            if (pivoteo === 'parcial') {
                // Pivoteo parcial: buscar máximo en columna k
                for (let i = k + 1; i < n; i++) {
                    if (Math.abs(A_copia[i][k]) > maxVal) {
                        maxVal = Math.abs(A_copia[i][k]);
                        pivotRow = i;
                    }
                }
            } else if (pivoteo === 'total') {
                // Pivoteo total: buscar máximo en submatriz
                for (let i = k; i < n; i++) {
                    for (let j = k; j < n; j++) {
                        if (Math.abs(A_copia[i][j]) > maxVal) {
                            maxVal = Math.abs(A_copia[i][j]);
                            pivotRow = i;
                            pivotCol = j;
                        }
                    }
                }
            }
            
            // Intercambiar filas si es necesario
            if (pivotRow !== k) {
                [A_copia[k], A_copia[pivotRow]] = [A_copia[pivotRow], A_copia[k]];
                [L[k], L[pivotRow]] = [L[pivotRow], L[k]];
                [P[k], P[pivotRow]] = [P[pivotRow], P[k]];
                cambios++;
                
                if (mostrarPasos) {
                    pasos.push({
                        paso: `Paso ${k+1} - Pivoteo`,
                        descripcion: `Intercambiar fila ${k+1} con fila ${pivotRow+1}`,
                        operacion: `R${k+1} ↔ R${pivotRow+1}`,
                        matriz: `Matriz después de pivoteo:\n${matrizToString(A_copia)}`
                    });
                }
            }
            
            // Intercambiar columnas si es pivoteo total
            if (pivotCol !== k && pivoteo === 'total') {
                for (let i = 0; i < n; i++) {
                    [A_copia[i][k], A_copia[i][pivotCol]] = [A_copia[i][pivotCol], A_copia[i][k]];
                }
                // También intercambiar columnas de L
                for (let i = 0; i < n; i++) {
                    [L[i][k], L[i][pivotCol]] = [L[i][pivotCol], L[i][k]];
                }
                cambios++;
                
                if (mostrarPasos) {
                    pasos.push({
                        paso: `Paso ${k+1} - Pivoteo Total`,
                        descripcion: `Intercambiar columna ${k+1} con columna ${pivotCol+1}`,
                        operacion: `C${k+1} ↔ C${pivotCol+1}`,
                        matriz: `Matriz después de pivoteo total:\n${matrizToString(A_copia)}`
                    });
                }
            }
        }
        
        // Verificar si el pivote es cero
        if (Math.abs(A_copia[k][k]) < eps) {
            throw new Error(`Matriz singular o casi singular en el paso ${k+1}. Pivote: ${A_copia[k][k]}`);
        }
        
        // Calcular elementos de U en fila k
        for (let j = k; j < n; j++) {
            let sum = 0;
            for (let s = 0; s < k; s++) {
                sum += L[k][s] * U[s][j];
            }
            U[k][j] = A_copia[k][j] - sum;
        }
        
        // Calcular elementos de L en columna k
        for (let i = k + 1; i < n; i++) {
            let sum = 0;
            for (let s = 0; s < k; s++) {
                sum += L[i][s] * U[s][k];
            }
            L[i][k] = (A_copia[i][k] - sum) / U[k][k];
        }
        
        // Para Doolittle, L[k][k] = 1 ya está establecido
        
        if (mostrarPasos && k < n - 1) {
            pasos.push({
                paso: `Paso ${k+1}`,
                descripcion: `Calcular U[${k+1},:] y L[:,${k+1}]`,
                operacion: `U_${k+1} = A_${k+1} - Σ L_${k+1}*U, L_i${k+1} = (A_i${k+1} - Σ L_i*U_${k+1})/U_${k+1}${k+1}`,
                matriz: `L:\n${matrizToString(L.slice(0, k+2).map(row => row.slice(0, k+2)))}\n\nU:\n${matrizToString(U.slice(0, k+2).map(row => row.slice(0, n)))}`
            });
        }
    }
    
    return {
        L: L,
        U: U,
        P: P,
        cambios: cambios,
        tipo: 'doolittle',
        pivoteo: pivoteo,
        pasos: pasos,
        exito: true
    };
}

function factorizacionCrout(A, n, eps, pivoteo, mostrarPasos) {
    console.log('LU.js: Ejecutando factorización Crout con pivoteo', pivoteo);
    
    const pasos = [];
    let L = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let U = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let P = new Array(n).fill(0).map((_, i) => i);
    let cambios = 0;
    
    // Inicializar U con 1's en diagonal
    for (let i = 0; i < n; i++) {
        U[i][i] = 1;
    }
    
    const A_copia = A.map(row => [...row]);
    
    for (let k = 0; k < n; k++) {
        // Pivoteo (similar a Doolittle)
        if (pivoteo !== 'ninguno') {
            let pivotRow = k;
            let maxVal = Math.abs(A_copia[k][k]);
            
            for (let i = k + 1; i < n; i++) {
                if (Math.abs(A_copia[i][k]) > maxVal) {
                    maxVal = Math.abs(A_copia[i][k]);
                    pivotRow = i;
                }
            }
            
            if (pivotRow !== k) {
                [A_copia[k], A_copia[pivotRow]] = [A_copia[pivotRow], A_copia[k]];
                cambios++;
            }
        }
        
        // Verificar pivote
        if (Math.abs(A_copia[k][k]) < eps) {
            throw new Error(`Matriz singular o casi singular en el paso ${k+1}`);
        }
        
        // Calcular elementos de L en columna k
        for (let i = k; i < n; i++) {
            let sum = 0;
            for (let s = 0; s < k; s++) {
                sum += L[i][s] * U[s][k];
            }
            L[i][k] = A_copia[i][k] - sum;
        }
        
        // Calcular elementos de U en fila k
        for (let j = k + 1; j < n; j++) {
            let sum = 0;
            for (let s = 0; s < k; s++) {
                sum += L[k][s] * U[s][j];
            }
            U[k][j] = (A_copia[k][j] - sum) / L[k][k];
        }
    }
    
    return {
        L: L,
        U: U,
        P: P,
        cambios: cambios,
        tipo: 'crout',
        pivoteo: pivoteo,
        pasos: pasos,
        exito: true
    };
}

function factorizacionCholesky(A, n, eps, mostrarPasos) {
    console.log('LU.js: Ejecutando factorización de Cholesky');
    
    const pasos = [];
    let G = new Array(n).fill(0).map(() => new Array(n).fill(0));
    
    // Verificar que la matriz sea definida positiva
    for (let i = 0; i < n; i++) {
        if (A[i][i] <= 0) {
            throw new Error('Matriz no es definida positiva (elementos diagonales deben ser > 0)');
        }
    }
    
    for (let i = 0; i < n; i++) {
        // Calcular G[i][i]
        let sum = 0;
        for (let k = 0; k < i; k++) {
            sum += G[i][k] * G[i][k];
        }
        
        const diag = A[i][i] - sum;
        if (diag <= eps) {
            throw new Error(`Matriz no es definida positiva en el paso ${i+1}`);
        }
        
        G[i][i] = Math.sqrt(diag);
        
        // Calcular G[j][i] para j > i
        for (let j = i + 1; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < i; k++) {
                sum += G[j][k] * G[i][k];
            }
            G[j][i] = (A[j][i] - sum) / G[i][i];
        }
        
        if (mostrarPasos && i < n - 1) {
            pasos.push({
                paso: `Paso ${i+1}`,
                descripcion: `Calcular columna ${i+1} de G`,
                operacion: `G_${i+1}${i+1} = √(A_${i+1}${i+1} - Σ G_${i+1}²), G_j${i+1} = (A_j${i+1} - Σ G_j*G_${i+1})/G_${i+1}${i+1}`,
                matriz: `G (hasta columna ${i+1}):\n${matrizToString(G.map(row => row.slice(0, i+2)))}`
            });
        }
    }
    
    // Para Cholesky: L = G, U = Gᵀ
    const L = G;
    const U = new Array(n).fill(0).map((_, i) => 
        new Array(n).fill(0).map((_, j) => G[j][i])
    );
    
    return {
        L: L,
        U: U,
        P: new Array(n).fill(0).map((_, i) => i), // Sin permutaciones en Cholesky
        cambios: 0,
        tipo: 'cholesky',
        pivoteo: 'ninguno',
        pasos: pasos,
        exito: true
    };
}

function resolverSistemaLU(resultadoLU, b, n) {
    const { L, U, P } = resultadoLU;
    
    // Aplicar permutación a b: Pb
    const b_perm = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        b_perm[i] = b[P[i]];
    }
    
    // Sustitución hacia adelante: Ly = Pb
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
            sum += L[i][j] * y[j];
        }
        y[i] = (b_perm[i] - sum) / L[i][i];
    }
    
    // Sustitución hacia atrás: Ux = y
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += U[i][j] * x[j];
        }
        x[i] = (y[i] - sum) / U[i][i];
    }
    
    return {
        x: x,
        y: y,
        b_perm: b_perm
    };
}

function calcularDeterminanteLU(resultadoLU, n) {
    const { U, cambios } = resultadoLU;
    
    // Determinante = producto de elementos diagonales de U
    // Multiplicado por (-1)^cambios debido a permutaciones
    let det = 1;
    for (let i = 0; i < n; i++) {
        det *= U[i][i];
    }
    
    if (cambios % 2 === 1) {
        det = -det;
    }
    
    return det;
}

function calcularInversaLU(resultadoLU, n, eps) {
    const { L, U, P } = resultadoLU;
    
    // Para calcular A⁻¹, resolver AX = I
    // Donde X será A⁻¹
    const inversa = new Array(n).fill(0).map(() => new Array(n).fill(0));
    
    // Para cada columna de I
    for (let col = 0; col < n; col++) {
        // Crear vector b = columna col de I
        const b = new Array(n).fill(0);
        b[col] = 1;
        
        // Resolver sistema con esta b
        const sol = resolverSistemaLU({ L, U, P }, b, n);
        
        // Colocar solución en columna col de la inversa
        for (let i = 0; i < n; i++) {
            inversa[i][col] = sol.x[i];
        }
    }
    
    return inversa;
}

function calcularResiduos(A, b, x, n) {
    // Calcular Ax - b
    const residuos = new Array(n).fill(0);
    let maxResiduo = 0;
    let normaResiduo = 0;
    
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += A[i][j] * x[j];
        }
        residuos[i] = sum - b[i];
        maxResiduo = Math.max(maxResiduo, Math.abs(residuos[i]));
        normaResiduo += residuos[i] * residuos[i];
    }
    
    normaResiduo = Math.sqrt(normaResiduo);
    
    return {
        vector: residuos,
        maximo: maxResiduo,
        norma: normaResiduo
    };
}

function mostrarResultadosLU(resultado, A, b, n) {
    console.log('LU.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.luResultados = resultado;
    
    // Mostrar matrices L y U
    document.getElementById('lu-matriz-l').innerHTML = 
        formatMatrixHTML(resultado.L, 'lu-l', 'L');
    
    document.getElementById('lu-matriz-u').innerHTML = 
        formatMatrixHTML(resultado.U, 'lu-u', 'U');
    
    // Mostrar matriz de permutación P
    const P_matrix = new Array(n).fill(0).map(() => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        P_matrix[i][resultado.P[i]] = 1;
    }
    
    document.getElementById('lu-matriz-p').innerHTML = 
        formatMatrixHTML(P_matrix, 'lu-p', 'P');
    
    // Verificación PA = LU
    const PA = multiplyMatrices(P_matrix, A, n);
    const LU = multiplyMatrices(resultado.L, resultado.U, n);
    
    let verificacionHTML = `<div style="margin-bottom: 0.5rem;">`;
    verificacionHTML += `<strong>PA = </strong><br>${formatMatrixHTML(PA, null, null, true)}`;
    verificacionHTML += `<strong style="margin: 0 1rem;">=</strong>`;
    verificacionHTML += `<strong>LU = </strong><br>${formatMatrixHTML(LU, null, null, true)}`;
    verificacionHTML += `</div>`;
    
    const errorVerificacion = calcularErrorMatricial(PA, LU, n);
    verificacionHTML += `<div style="margin-top: 0.5rem; padding: 0.5rem; background: ${errorVerificacion < 0.001 ? '#d4edda' : '#f8d7da'}; border-radius: 4px;">`;
    verificacionHTML += `<strong>Error ‖PA - LU‖ = ${formatNumber(errorVerificacion, 10)}</strong>`;
    verificacionHTML += errorVerificacion < 0.001 ? 
        ' <span style="color: #155724;">✓ Verificación exitosa</span>' :
        ' <span style="color: #721c24;">✗ Error en la factorización</span>';
    verificacionHTML += `</div>`;
    
    document.getElementById('lu-verificacion').innerHTML = verificacionHTML;
    
    // Mostrar propiedades
    let propiedadesHTML = '';
    propiedadesHTML += `<div><strong>Tipo:</strong> ${resultado.tipo.charAt(0).toUpperCase() + resultado.tipo.slice(1)}</div>`;
    propiedadesHTML += `<div><strong>Pivoteo:</strong> ${resultado.pivoteo}</div>`;
    propiedadesHTML += `<div><strong>Intercambios:</strong> ${resultado.cambios}</div>`;
    propiedadesHTML += `<div><strong>Éxito:</strong> ${resultado.exito ? 'Sí' : 'No'}</div>`;
    
    if (resultado.tipo === 'cholesky') {
        // Verificar simetría
        let simetrica = true;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(A[i][j] - A[j][i]) > 0.0001) {
                    simetrica = false;
                    break;
                }
            }
            if (!simetrica) break;
        }
        propiedadesHTML += `<div><strong>Simétrica:</strong> ${simetrica ? 'Sí' : 'No'}</div>`;
    }
    
    document.getElementById('lu-propiedades').innerHTML = propiedadesHTML;
    
    // Mostrar resultados varios
    let resultadosHTML = '';
    
    if (resultado.determinante !== undefined) {
        resultadosHTML += `<div><strong>Determinante det(A):</strong> ${formatNumber(resultado.determinante, 8)}</div>`;
    }
    
    resultadosHTML += `<div><strong>Tiempo de cálculo:</strong> ${formatNumber(resultado.tiempo, 2)} ms</div>`;
    resultadosHTML += `<div><strong>Complejidad estimada:</strong> O(${n}³/3) ≈ ${formatNumber(Math.pow(n, 3) / 3, 0)} operaciones</div>`;
    
    document.getElementById('lu-resultados').innerHTML = resultadosHTML;
    document.getElementById('lu-tiempos').innerHTML = `<div>Tiempo total: ${formatNumber(resultado.tiempo, 2)} ms</div>`;
    
    // Mostrar solución del sistema si se calculó
    if (resultado.solucion) {
        document.getElementById('lu-solucion-container').style.display = 'block';
        
        document.getElementById('lu-solucion-x').innerHTML = 
            resultado.solucion.x.map((xi, i) => 
                `x<sub>${i+1}</sub> = ${formatNumber(xi, 8)}`
            ).join('<br>');
        
        document.getElementById('lu-solucion-y').innerHTML = 
            resultado.solucion.y.map((yi, i) => 
                `y<sub>${i+1}</sub> = ${formatNumber(yi, 8)}`
            ).join('<br>');
        
        document.getElementById('lu-solucion-ux').innerHTML = 
            `Ux = y verificado<br>Error máximo: ${formatNumber(resultado.residuos.maximo, 10)}`;
        
        let residuosHTML = '';
        residuosHTML += `<div><strong>Residuo máximo:</strong> ${formatNumber(resultado.residuos.maximo, 10)}</div>`;
        residuosHTML += `<div><strong>Norma del residuo:</strong> ${formatNumber(resultado.residuos.norma, 10)}</div>`;
        residuosHTML += `<div><strong>Vector de residuos:</strong><br>`;
        residuosHTML += resultado.residuos.vector.map((r, i) => 
            `r<sub>${i+1}</sub> = ${formatNumber(r, 10)}`
        ).join(', ');
        residuosHTML += `</div>`;
        
        document.getElementById('lu-residuos').innerHTML = residuosHTML;
    } else {
        document.getElementById('lu-solucion-container').style.display = 'none';
    }
    
    // Mostrar inversa si se calculó
    if (resultado.inversa) {
        document.getElementById('lu-inversa-container').style.display = 'block';
        document.getElementById('lu-matriz-inversa').innerHTML = 
            formatMatrixHTML(resultado.inversa, 'lu-inv', 'A⁻¹');
    } else {
        document.getElementById('lu-inversa-container').style.display = 'none';
    }
    
    // Mostrar pasos si se solicitaron
    if (resultado.pasos && resultado.pasos.length > 0) {
        document.getElementById('lu-pasos-container').style.display = 'block';
        actualizarTablaPasosLU(resultado.pasos);
    } else {
        document.getElementById('lu-pasos-container').style.display = 'none';
    }
    
    // Crear gráficos
    crearGraficoAnalisisLU(A, resultado, n);
}

function formatMatrixHTML(matrix, prefix, name, small = false) {
    const n = matrix.length;
    let html = '';
    
    if (name) {
        html += `<div style="margin-bottom: 0.5rem; font-weight: bold; color: #2c3e50;">${name}:</div>`;
    }
    
    html += '<div style="display: inline-block; padding: 0.5rem; background: white; border-radius: 4px;">';
    html += '<table style="border-collapse: collapse;">';
    
    for (let i = 0; i < n; i++) {
        html += '<tr>';
        for (let j = 0; j < n; j++) {
            const valor = matrix[i][j];
            const cellClass = Math.abs(valor) < 0.000001 ? 'zero-cell' : '';
            const formatted = Math.abs(valor) < 0.000001 ? '0' : formatNumber(valor, 6);
            
            html += `<td style="padding: ${small ? '2px 4px' : '4px 8px'}; text-align: right; 
                     border: 1px solid #dee2e6; ${cellClass === 'zero-cell' ? 'color: #999;' : ''}">`;
            html += formatted;
            html += '</td>';
        }
        html += '</tr>';
    }
    
    html += '</table></div>';
    return html;
}

function multiplyMatrices(A, B, n) {
    const result = new Array(n).fill(0).map(() => new Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    
    return result;
}

function calcularErrorMatricial(A, B, n) {
    let error = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            error += Math.pow(A[i][j] - B[i][j], 2);
        }
    }
    return Math.sqrt(error);
}

function actualizarTablaPasosLU(pasos) {
    const tbody = document.getElementById('lu-pasos-body');
    tbody.innerHTML = '';
    
    pasos.forEach((paso, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #3498db;">${paso.paso}</td>
            <td>${paso.descripcion}</td>
            <td style="font-family: monospace; font-size: 0.9rem;">${paso.operacion}</td>
            <td style="font-family: monospace; font-size: 0.8rem; white-space: pre;">${paso.matriz}</td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoAnalisisLU(A, resultado, n) {
    // Crear datos para gráfico de barras de elementos de L y U
    const elementosL = [];
    const elementosU = [];
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i >= j) { // Elementos de L (incluye diagonal)
                elementosL.push(Math.abs(resultado.L[i][j]));
            }
            if (i <= j) { // Elementos de U (incluye diagonal)
                elementosU.push(Math.abs(resultado.U[i][j]));
            }
        }
    }
    
    const labels = Array.from({length: Math.max(elementosL.length, elementosU.length)}, (_, i) => i + 1);
    
    const data = {
        labels: labels.slice(0, 20), // Mostrar solo primeros 20 elementos
        datasets: [
            {
                label: '|L|',
                data: elementosL.slice(0, 20),
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            },
            {
                label: '|U|',
                data: elementosU.slice(0, 20),
                backgroundColor: 'rgba(231, 76, 60, 0.5)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Valor absoluto'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Elemento'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${formatNumber(context.parsed.y, 6)}`;
                    }
                }
            }
        }
    };
    
    // Crear gráfico
    const ctx = document.getElementById('lu-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.luChart) {
        window.luChart.destroy();
    }
    
    window.luChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
    
    // Crear gráfico de comparación de métodos
    crearGraficoComparacionLU(A, resultado, n);
}

function crearGraficoComparacionLU(A, resultado, n) {
    // Simular tiempos para diferentes métodos
    const metodos = ['Gauss Simple', 'LU sin pivoteo', 'LU con pivoteo', 'Cholesky'];
    const tiempos = [
        Math.pow(n, 3), // Gauss: O(n³)
        Math.pow(n, 3) / 3, // LU: O(n³/3)
        Math.pow(n, 3) / 3 * 1.2, // LU con pivoteo: un poco más lento
        Math.pow(n, 3) / 6 // Cholesky: O(n³/6)
    ];
    
    const estabilidad = [3, 5, 9, 10]; // Puntuación de estabilidad (1-10)
    
    const data = {
        labels: metodos,
        datasets: [
            {
                label: 'Tiempo relativo (menos es mejor)',
                data: tiempos,
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                label: 'Estabilidad (1-10)',
                data: estabilidad,
                backgroundColor: 'rgba(46, 204, 113, 0.5)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1,
                yAxisID: 'y1'
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Tiempo relativo'
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Estabilidad'
                },
                min: 0,
                max: 10,
                grid: {
                    drawOnChartArea: false
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };
    
    const ctx = document.getElementById('lu-comparacion-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.luComparacionChart) {
        window.luComparacionChart.destroy();
    }
    
    window.luComparacionChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function mostrarMasEjemploLU() {
    const ejemplosExtras = [
        {
            nombre: "Matriz de Vandermonde",
            descripcion: "Matriz común en interpolación polinomial",
            n: 4,
            A: [
                [1, 1, 1, 1],
                [1, 2, 4, 8],
                [1, 3, 9, 27],
                [1, 4, 16, 64]
            ],
            b: [4, 15, 40, 85],
            tipo: "doolittle",
            pivoteo: "total",
            solucionExacta: [1, 1, 1, 1],
            nota: "Matriz mal condicionada para n grande"
        },
        {
            nombre: "Matriz Identidad Perturbada",
            descripcion: "Matriz casi identidad para probar estabilidad",
            n: 3,
            A: [
                [1.001, 0.001, 0.001],
                [0.001, 1.001, 0.001],
                [0.001, 0.001, 1.001]
            ],
            b: [1.003, 1.003, 1.003],
            tipo: "doolittle",
            pivoteo: "ninguno",
            solucionExacta: [1, 1, 1],
            nota: "Matriz bien condicionada - no requiere pivoteo"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="lu-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Ejemplos Avanzados - Factorización LU</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #3498db; margin-bottom: 0.5rem;">
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
                                <button class="cargar-lu-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #3498db; color: white; border: none; padding: 0.5rem 1rem; 
                                               border-radius: 4px; cursor: pointer; width: 100%;">
                                    <i class="fas fa-play-circle"></i> Cargar y Factorizar
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
    const modalExistente = document.getElementById('lu-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('lu-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-lu-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoLU(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function generarMatrizAleatoriaLU() {
    const n = parseInt(document.getElementById('lu-n').value);
    const tipo = document.getElementById('lu-tipo').value;
    
    // Generar matriz aleatoria según el tipo
    let A = [];
    
    if (tipo === 'cholesky') {
        // Para Cholesky, necesitamos matriz simétrica definida positiva
        // Generar matriz aleatoria G y hacer A = G·Gᵀ
        const G = [];
        for (let i = 0; i < n; i++) {
            G[i] = [];
            for (let j = 0; j < n; j++) {
                G[i][j] = j <= i ? Math.random() * 2 - 1 : 0;
            }
        }
        
        // A = G·Gᵀ
        A = multiplyMatrices(G, G.map((row, i) => row.map((_, j) => G[j][i])), n);
        
        // Asegurar diagonal dominante
        for (let i = 0; i < n; i++) {
            A[i][i] += n; // Hacer diagonal dominante
        }
    } else {
        // Para LU normal, generar matriz aleatoria bien condicionada
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < n; j++) {
                // Generar números aleatorios, hacer diagonal dominante
                if (i === j) {
                    A[i][j] = (Math.random() + 1) * n; // Diagonal más grande
                } else {
                    A[i][j] = Math.random() * 2 - 1; // [-1, 1]
                }
            }
        }
    }
    
    // Generar vector b aleatorio
    const b = Array.from({length: n}, () => Math.random() * 10 - 5);
    
    // Actualizar la interfaz
    setTimeout(() => {
        // Actualizar matriz A
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.querySelector(`.lu-a[data-i="${i}"][data-j="${j}"]`);
                if (input) input.value = formatNumber(A[i][j], 4);
            }
        }
        
        // Actualizar vector b
        for (let i = 0; i < n; i++) {
            const input = document.querySelector(`.lu-b[data-i="${i}"]`);
            if (input) input.value = formatNumber(b[i], 4);
        }
        
        // Mostrar mensaje
        const descripcion = document.getElementById('lu-descripcion-ejemplo');
        if (descripcion) {
            descripcion.innerHTML = `
                <div style="padding: 1rem; background: #e8f4fd; border-radius: 6px; border-left: 4px solid #3498db;">
                    <strong style="color: #2980b9;">
                        <i class="fas fa-random"></i> Matriz aleatoria generada:
                    </strong> Matriz ${n}×${n} ${tipo === 'cholesky' ? 'simétrica definida positiva' : 'bien condicionada'}
                    <br><small><i class="fas fa-info-circle"></i> Se generó una matriz con diagonal dominante para asegurar estabilidad.</small>
                </div>
            `;
        }
        
        // Calcular automáticamente
        setTimeout(() => {
            calcularLU();
        }, 300);
        
    }, 100);
}

function verificarInversaLU() {
    if (!window.luResultados || !window.luResultados.inversa) {
        showError('Primero debe calcular la inversa');
        return;
    }
    
    const n = window.luResultados.inversa.length;
    const A = [];
    
    // Obtener matriz A original de los inputs
    for (let i = 0; i < n; i++) {
        A[i] = [];
        for (let j = 0; j < n; j++) {
            const input = document.querySelector(`.lu-a[data-i="${i}"][data-j="${j}"]`);
            A[i][j] = parseFloat(input.value);
        }
    }
    
    // Calcular A·A⁻¹
    const AAinv = multiplyMatrices(A, window.luResultados.inversa, n);
    
    // Calcular error respecto a la identidad
    let error = 0;
    const I = new Array(n).fill(0).map((_, i) => new Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            error += Math.pow(AAinv[i][j] - I[i][j], 2);
        }
    }
    
    error = Math.sqrt(error);
    
    // Mostrar resultado
    alert(`Verificación A·A⁻¹ = I:\n\nError ‖A·A⁻¹ - I‖ = ${formatNumber(error, 10)}\n\n` +
          `La verificación ${error < 0.001 ? 'es exitosa' : 'tiene errores significativos'}.`);
}

function copiarInversaLU() {
    if (!window.luResultados || !window.luResultados.inversa) {
        showError('No hay matriz inversa para copiar');
        return;
    }
    
    const inversa = window.luResultados.inversa;
    const n = inversa.length;
    
    // Formatear matriz como texto
    let texto = `Matriz inversa A⁻¹ (${n}×${n}):\n\n`;
    
    for (let i = 0; i < n; i++) {
        texto += inversa[i].map(val => formatNumber(val, 8)).join('\t') + '\n';
    }
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(texto).then(() => {
        alert('Matriz inversa copiada al portapapeles');
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('Error al copiar al portapapeles');
    });
}

function limpiarLU() {
    console.log('LU.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('lu-n').value = '3';
    document.getElementById('lu-precision').value = '0.0001';
    document.getElementById('lu-tipo').value = 'doolittle';
    document.getElementById('lu-pivoteo').value = 'parcial';
    document.getElementById('lu-resolver-sistema').checked = true;
    document.getElementById('lu-calcular-determinante').checked = true;
    document.getElementById('lu-calcular-inversa').checked = false;
    document.getElementById('lu-mostrar-pasos').checked = false;
    
    // Regenerar matrices
    generarMatricesLU();
    
    // Limpiar resultados
    document.getElementById('lu-matriz-l').innerHTML = '';
    document.getElementById('lu-matriz-u').innerHTML = '';
    document.getElementById('lu-matriz-p').innerHTML = '';
    document.getElementById('lu-verificacion').innerHTML = '';
    document.getElementById('lu-propiedades').innerHTML = '';
    document.getElementById('lu-resultados').innerHTML = '';
    document.getElementById('lu-tiempos').innerHTML = '';
    document.getElementById('lu-solucion-x').innerHTML = '';
    document.getElementById('lu-solucion-y').innerHTML = '';
    document.getElementById('lu-solucion-ux').innerHTML = '';
    document.getElementById('lu-residuos').innerHTML = '';
    document.getElementById('lu-matriz-inversa').innerHTML = '';
    document.getElementById('lu-pasos-body').innerHTML = '';
    
    // Ocultar secciones
    document.getElementById('lu-solucion-container').style.display = 'none';
    document.getElementById('lu-inversa-container').style.display = 'none';
    document.getElementById('lu-pasos-container').style.display = 'none';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('lu-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    if (window.luChart) {
        window.luChart.destroy();
        window.luChart = null;
    }
    
    if (window.luComparacionChart) {
        window.luComparacionChart.destroy();
        window.luComparacionChart = null;
    }
    
    // Crear gráficos vacíos
    const ctx1 = document.getElementById('lu-chart').getContext('2d');
    window.luChart = new Chart(ctx1, {
        type: 'bar',
        data: { datasets: [] },
        options: { responsive: true }
    });
    
    const ctx2 = document.getElementById('lu-comparacion-chart').getContext('2d');
    window.luComparacionChart = new Chart(ctx2, {
        type: 'bar',
        data: { datasets: [] },
        options: { responsive: true }
    });
    
    console.log('LU.js: Limpieza completada');
}

// Funciones auxiliares
function matrizToString(matriz) {
    return matriz.map(row => 
        row.map(val => formatNumber(val, 6)).join('\t')
    ).join('\n');
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', function() {
//     console.log("=== PRUEBA DE FACTORIZACIÓN LU ===");
//     const A = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]];
//     const resultado = factorizacionDoolittle(A, 3, 0.0001, 'parcial', false);
//     console.log("Matriz L:", resultado.L);
//     console.log("Matriz U:", resultado.U);
//     console.log("Permutación P:", resultado.P);
// });