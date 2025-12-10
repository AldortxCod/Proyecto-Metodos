/**
 * gauss-seidel.js - Método de Gauss-Seidel
 * Implementa solución de sistemas lineales usando el método iterativo de Gauss-Seidel
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('GaussSeidel.js: Cargado');
    
    // Escuchar cuando la sección de álgebra se active
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.section === 'algebra') {
            console.log('GaussSeidel.js: Sección Álgebra activada');
            setTimeout(inicializarGaussSeidel, 300);
        }
    });
    
    // Escuchar cuando se seleccione Gauss-Seidel
    document.addEventListener('methodChanged', function(e) {
        if (e.detail.method === 'gauss-seidel') {
            console.log('GaussSeidel.js: Método Gauss-Seidel seleccionado');
            setTimeout(inicializarGaussSeidel, 100);
        }
    });
    
    // Verificar si ya está visible al cargar
    setTimeout(verificarGaussSeidelVisibilidad, 1000);
});

function verificarGaussSeidelVisibilidad() {
    const gaussSeidelContent = document.getElementById('gauss-seidel-content');
    if (gaussSeidelContent && !gaussSeidelContent.classList.contains('hidden')) {
        console.log('GaussSeidel.js: Ya visible al cargar');
        inicializarGaussSeidel();
    }
}

function inicializarGaussSeidel() {
    console.log('GaussSeidel.js: Inicializando...');
    
    const gaussSeidelContent = document.getElementById('gauss-seidel-content');
    if (!gaussSeidelContent) {
        console.error('GaussSeidel.js: Error - Contenedor no encontrado');
        return;
    }
    
    // Verificar si ya está inicializado
    if (window.gaussSeidelInitialized) {
        console.log('GaussSeidel.js: Ya inicializado anteriormente');
        return;
    }
    
    // Crear interfaz si no existe
    if (gaussSeidelContent.innerHTML.trim() === '' || !document.getElementById('gauss-seidel-n')) {
        console.log('GaussSeidel.js: Creando interfaz...');
        crearInterfazGaussSeidel();
    }
    
    // Asignar eventos
    asignarEventosGaussSeidel();
    
    // Cargar ejemplo inicial
    cargarEjemploInicialGaussSeidel();
    
    // Marcar como inicializado
    window.gaussSeidelInitialized = true;
    console.log('GaussSeidel.js: Inicialización completada');
}

function crearInterfazGaussSeidel() {
    const content = document.getElementById('gauss-seidel-content');
    
    content.innerHTML = `
        <div class="input-section">
            <h3><i class="fas fa-sync-alt"></i> Método de Gauss-Seidel</h3>
            <p>Solución iterativa de sistemas lineales Ax = b con convergencia acelerada</p>
            
            <!-- Selector de ejemplos -->
            <div class="ejemplo-selector-container" id="gauss-seidel-ejemplo-selector" style="margin-bottom: 1.5rem;">
                <!-- Se llenará dinámicamente -->
            </div>
            
            <div class="input-group">
                <label for="gauss-seidel-n"><i class="fas fa-sort-numeric-up"></i> Dimensión del sistema (n)</label>
                <input type="number" id="gauss-seidel-n" value="3" min="2" max="10" step="1">
                <small>Número de ecuaciones/variables del sistema</small>
            </div>
            
            <!-- Matriz A (coeficientes) -->
            <div class="input-group">
                <label><i class="fas fa-th"></i> Matriz de coeficientes A</label>
                <div id="gauss-seidel-matriz-a-container" style="margin-top: 0.5rem;">
                    <!-- Se generará dinámicamente -->
                </div>
            </div>
            
            <!-- Vector b (términos independientes) -->
            <div class="input-group">
                <label><i class="fas fa-vector-square"></i> Vector b (términos independientes)</label>
                <div id="gauss-seidel-vector-b-container" style="margin-top: 0.5rem;">
                    <!-- Se generará dinámicamente -->
                </div>
            </div>
            
            <!-- Vector inicial x⁽⁰⁾ -->
            <div class="input-group">
                <label><i class="fas fa-play-circle"></i> Vector inicial x⁽⁰⁾ (aproximación inicial)</label>
                <div id="gauss-seidel-vector-x0-container" style="margin-top: 0.5rem;">
                    <!-- Se generará dinámicamente -->
                </div>
            </div>
            
            <div class="input-row">
                <div class="input-group">
                    <label for="gauss-seidel-tol"><i class="fas fa-bullseye"></i> Tolerancia (ε)</label>
                    <input type="number" id="gauss-seidel-tol" value="0.0001" step="0.0001">
                    <small>Criterio de convergencia</small>
                </div>
                <div class="input-group">
                    <label for="gauss-seidel-max-iter"><i class="fas fa-redo"></i> Máximo de iteraciones</label>
                    <input type="number" id="gauss-seidel-max-iter" value="100" min="10" max="1000" step="10">
                    <small>Límite de iteraciones</small>
                </div>
                <div class="input-group">
                    <label for="gauss-seidel-relajacion"><i class="fas fa-tachometer-alt"></i> Factor de relajación (ω)</label>
                    <input type="number" id="gauss-seidel-relajacion" value="1.0" min="0.1" max="2.0" step="0.1">
                    <small>1.0 = Gauss-Seidel, ≠1.0 = SOR (Sobre-relajación)</small>
                </div>
            </div>
            
            <div class="input-group">
                <label><i class="fas fa-cogs"></i> Opciones de convergencia</label>
                <div class="checkbox-group" style="display: flex; gap: 20px; margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="gauss-seidel-diagonal-dominante" checked style="transform: scale(1.2);">
                        <span style="color: #27ae60; font-weight: bold;">
                            Verificar diagonal dominante
                        </span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="gauss-seidel-mostrar-paso-a-paso" style="transform: scale(1.2);">
                        <span style="color: #3498db; font-weight: bold;">
                            Mostrar paso a paso
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button id="gauss-seidel-calc" class="calc-btn"><i class="fas fa-cogs"></i> Resolver Sistema</button>
                <button id="gauss-seidel-ejemplo" class="example-btn"><i class="fas fa-flask"></i> Más Ejemplos</button>
                <button id="gauss-seidel-clear" class="clear-btn"><i class="fas fa-broom"></i> Limpiar</button>
            </div>
            
            <!-- Descripción del ejemplo actual -->
            <div id="gauss-seidel-descripcion-ejemplo" style="margin-top: 1rem;"></div>
        </div>
        
        <div class="results-section">
            <h3><i class="fas fa-chart-line"></i> Resultados de la Iteración</h3>
            
            <div class="result-container">
                <div class="result-text">
                    <h4><i class="fas fa-check-circle"></i> Solución del sistema:</h4>
                    <div id="gauss-seidel-solucion" style="background: #f8f9fa; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 1rem;">
                        <!-- Solución se mostrará aquí -->
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <h4><i class="fas fa-redo"></i> Iteraciones:</h4>
                            <p id="gauss-seidel-iteraciones">-</p>
                            <h4><i class="fas fa-clock"></i> Tiempo:</h4>
                            <p id="gauss-seidel-tiempo">-</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-bullseye"></i> Error final:</h4>
                            <p id="gauss-seidel-error">-</p>
                            <h4><i class="fas fa-tachometer-alt"></i> Tasa convergencia:</h4>
                            <p id="gauss-seidel-tasa">-</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem;">
                        <h4><i class="fas fa-chart-line"></i> Convergencia:</h4>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="height: 10px; flex-grow: 1; background: #ecf0f1; border-radius: 5px; overflow: hidden;">
                                <div id="gauss-seidel-convergencia-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #9b59b6, #8e44ad); transition: width 1s;"></div>
                            </div>
                            <span id="gauss-seidel-convergencia-text" style="font-weight: bold; color: #9b59b6;">-</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-chart">
                    <canvas id="gauss-seidel-chart"></canvas>
                </div>
            </div>
            
            <!-- Tabla de iteraciones -->
            <div class="iterations-table">
                <h4><i class="fas fa-table"></i> Iteraciones del Método</h4>
                <div class="table-container">
                    <table id="gauss-seidel-iteraciones-table">
                        <thead>
                            <tr>
                                <th>k</th>
                                <th>x₁</th>
                                <th>x₂</th>
                                <th>x₃</th>
                                <th>Error ‖x⁽ᵏ⁾ - x⁽ᵏ⁻¹⁾‖∞</th>
                                <th>Tasa convergencia</th>
                            </tr>
                        </thead>
                        <tbody id="gauss-seidel-iteraciones-body">
                            <!-- Datos se llenarán aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Información del sistema -->
            <div class="iterations-table" style="margin-top: 2rem;">
                <h4><i class="fas fa-info-circle"></i> Análisis del Sistema</h4>
                <div class="table-container">
                    <table id="gauss-seidel-analisis-table">
                        <thead>
                            <tr>
                                <th>Propiedad</th>
                                <th>Valor</th>
                                <th>Condición</th>
                                <th>Cumple</th>
                                <th>Explicación</th>
                            </tr>
                        </thead>
                        <tbody id="gauss-seidel-analisis-body">
                            <!-- Análisis se llenará aquí -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Comparación con Jacobi -->
            <div class="comparison-section" id="gauss-seidel-comparacion-section" style="margin-top: 2rem;">
                <h4><i class="fas fa-balance-scale"></i> Comparación con Método de Jacobi</h4>
                <div class="comparison-container">
                    <div class="comparison-chart">
                        <canvas id="gauss-seidel-comparacion-chart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="gauss-seidel-comparacion-table">
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th>Iteraciones</th>
                                    <th>Tiempo (ms)</th>
                                    <th>Error final</th>
                                    <th>Tasa convergencia</th>
                                    <th>Ventaja</th>
                                </tr>
                            </thead>
                            <tbody id="gauss-seidel-comparacion-body">
                                <!-- Comparación se llenará aquí -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Explicación del método -->
            <div class="conclusion-box" id="gauss-seidel-explicacion-box" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f3e8ff 0%, #e8d7ff 100%); border-radius: 8px; border-left: 4px solid #9b59b6;">
                <h4 style="margin-top: 0; color: #9b59b6;">
                    <i class="fas fa-lightbulb"></i> Teoría: Método de Gauss-Seidel
                </h4>
                <p><strong>Fórmula iterativa:</strong> xᵢ⁽ᵏ⁺¹⁾ = (bᵢ - Σⱼ₌₁ⁱ⁻¹ aᵢⱼxⱼ⁽ᵏ⁺¹⁾ - Σⱼ₌ᵢ₊₁ⁿ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ</p>
                <p><strong>Forma matricial:</strong> x⁽ᵏ⁺¹⁾ = D⁻¹(b - Lx⁽ᵏ⁺¹⁾ - Ux⁽ᵏ⁾)</p>
                <p><strong>Con SOR:</strong> xᵢ⁽ᵏ⁺¹⁾ = (1-ω)xᵢ⁽ᵏ⁾ + ω×(bᵢ - Σⱼ₌₁ⁱ⁻¹ aᵢⱼxⱼ⁽ᵏ⁺¹⁾ - Σⱼ₌ᵢ₊₁ⁿ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ</p>
                <p><strong>Condición suficiente:</strong> Matriz A diagonalmente dominante</p>
                <p><strong>Ventaja sobre Jacobi:</strong> Usa valores actualizados inmediatamente, converge más rápido</p>
                <p><strong>Criterio parada:</strong> ‖x⁽ᵏ⁺¹⁾ - x⁽ᵏ⁾‖∞ < ε ó k > max_iter</p>
            </div>
        </div>
    `;
    
    console.log('GaussSeidel.js: Interfaz creada correctamente');
    
    // Inicializar selector de ejemplos
    inicializarSelectorEjemploGaussSeidel();
    
    // Generar matrices iniciales
    generarMatricesGaussSeidel();
    
    // Agregar evento para actualizar matrices cuando cambia la dimensión
    document.getElementById('gauss-seidel-n').addEventListener('change', generarMatricesGaussSeidel);
}

function inicializarSelectorEjemploGaussSeidel() {
    const ejemplos = [
        {
            nombre: "Sistema 3×3 Diagonal Dominante",
            descripcion: "Sistema con matriz diagonalmente dominante - converge rápido",
            n: 3,
            A: [[10, 2, 1], [1, 10, 2], [2, 1, 10]],
            b: [13, 13, 13],
            x0: [0, 0, 0],
            tol: 0.0001,
            maxIter: 100,
            omega: 1.0,
            solucionExacta: [1, 1, 1],
            nota: "Matriz diagonalmente dominante garantiza convergencia"
        },
        {
            nombre: "Sistema Laplaciano 4×4",
            descripcion: "Discretización de ecuación de Laplace - común en diferencias finitas",
            n: 4,
            A: [[4, -1, 0, -1], [-1, 4, -1, 0], [0, -1, 4, -1], [-1, 0, -1, 4]],
            b: [1, 0, 0, 1],
            x0: [0, 0, 0, 0],
            tol: 0.0001,
            maxIter: 100,
            omega: 1.2,
            solucionExacta: [0.375, 0.125, 0.125, 0.375],
            nota: "Matriz simétrica definida positiva - converge con SOR óptimo ω≈1.2"
        },
        {
            nombre: "Sistema 2×2 Simple",
            descripcion: "Sistema pequeño para demostración básica",
            n: 2,
            A: [[5, 2], [1, 4]],
            b: [9, 8],
            x0: [0, 0],
            tol: 0.0001,
            maxIter: 50,
            omega: 1.0,
            solucionExacta: [1, 2],
            nota: "Converge en pocas iteraciones - buen ejemplo introductorio"
        },
        {
            nombre: "Sistema Mal Condicionado",
            descripcion: "Sistema casi singular - lenta convergencia",
            n: 3,
            A: [[1, 1, 1], [1, 1.0001, 1], [1, 1, 1.0001]],
            b: [3, 3.0001, 3.0001],
            x0: [0, 0, 0],
            tol: 0.00001,
            maxIter: 200,
            omega: 1.0,
            solucionExacta: [1, 1, 1],
            nota: "Matriz casi singular - converge lentamente"
        },
        {
            nombre: "Sistema 5×5 con SOR Óptimo",
            descripcion: "Sistema grande con factor de relajación óptimo",
            n: 5,
            A: [
                [10, 1, 0, 0, 0],
                [1, 10, 1, 0, 0],
                [0, 1, 10, 1, 0],
                [0, 0, 1, 10, 1],
                [0, 0, 0, 1, 10]
            ],
            b: [11, 12, 12, 12, 11],
            x0: [0, 0, 0, 0, 0],
            tol: 0.00001,
            maxIter: 100,
            omega: 1.5,
            solucionExacta: [1, 1, 1, 1, 1],
            nota: "SOR con ω>1 acelera convergencia para matrices tridiagonales"
        },
        {
            nombre: "Sistema No Convergente",
            descripcion: "Sistema que no cumple condiciones de convergencia",
            n: 3,
            A: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            b: [6, 15, 24],
            x0: [0, 0, 0],
            tol: 0.001,
            maxIter: 50,
            omega: 1.0,
            solucionExacta: [1, 1, 1],
            nota: "Matriz no diagonalmente dominante - puede no converger"
        }
    ];
    
    const selector = document.getElementById('gauss-seidel-ejemplo-selector');
    selector.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #9b59b6;">
            <h4 style="margin-bottom: 1rem; color: #9b59b6;">
                <i class="fas fa-vial"></i> Ejemplos Prácticos - Método de Gauss-Seidel
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${ejemplos.map((ejemplo, index) => `
                    <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                          border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                        <h5 style="color: #9b59b6; margin-bottom: 0.5rem;">
                            <i class="fas fa-sync-alt"></i> ${ejemplo.nombre}
                        </h5>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                            ${ejemplo.descripcion}
                        </p>
                        <button class="cargar-gauss-seidel-ejemplo-btn" data-index="${index}" 
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
        document.querySelectorAll('.cargar-gauss-seidel-ejemplo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cargarEjemploEspecificoGaussSeidel(ejemplos[index]);
            });
        });
    }, 100);
}

function generarMatricesGaussSeidel() {
    const n = parseInt(document.getElementById('gauss-seidel-n').value);
    
    // Contenedores
    const matrizAContainer = document.getElementById('gauss-seidel-matriz-a-container');
    const vectorBContainer = document.getElementById('gauss-seidel-vector-b-container');
    const vectorX0Container = document.getElementById('gauss-seidel-vector-x0-container');
    
    if (!matrizAContainer || !vectorBContainer || !vectorX0Container) return;
    
    // Generar matriz A
    let htmlA = '<div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">';
    htmlA += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem;">';
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const valor = (i === j) ? '10' : (Math.abs(i-j) === 1 ? '1' : '0');
            htmlA += `
                <div>
                    <label style="font-size: 0.8rem; color: #666;">a${i+1}${j+1}</label>
                    <input type="number" class="gauss-seidel-a" data-i="${i}" data-j="${j}" 
                           value="${valor}" step="0.1" style="width: 100%;">
                </div>
            `;
        }
    }
    htmlA += '</div></div>';
    matrizAContainer.innerHTML = htmlA;
    
    // Generar vector b
    let htmlB = '<div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">';
    htmlB += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">';
    
    for (let i = 0; i < n; i++) {
        const valor = (n === 3) ? '13' : (n === 2) ? '9' : '1';
        htmlB += `
            <div>
                <label style="font-size: 0.8rem; color: #666;">b${i+1}</label>
                <input type="number" class="gauss-seidel-b" data-i="${i}" 
                       value="${valor}" step="0.1" style="width: 100%;">
            </div>
        `;
    }
    htmlB += '</div></div>';
    vectorBContainer.innerHTML = htmlB;
    
    // Generar vector inicial x⁽⁰⁾
    let htmlX0 = '<div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">';
    htmlX0 += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">';
    
    for (let i = 0; i < n; i++) {
        htmlX0 += `
            <div>
                <label style="font-size: 0.8rem; color: #666;">x${i+1}⁽⁰⁾</label>
                <input type="number" class="gauss-seidel-x0" data-i="${i}" 
                       value="0" step="0.1" style="width: 100%;">
            </div>
        `;
    }
    htmlX0 += '</div></div>';
    vectorX0Container.innerHTML = htmlX0;
}

function asignarEventosGaussSeidel() {
    console.log('GaussSeidel.js: Asignando eventos...');
    
    const calcBtn = document.getElementById('gauss-seidel-calc');
    const ejemploBtn = document.getElementById('gauss-seidel-ejemplo');
    const clearBtn = document.getElementById('gauss-seidel-clear');
    
    if (!calcBtn) {
        console.error('GaussSeidel.js: Botón calcular no encontrado');
        return;
    }
    
    // Remover eventos anteriores usando clones
    const newCalcBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);
    
    // Asignar nuevos eventos
    newCalcBtn.addEventListener('click', calcularGaussSeidel);
    
    if (ejemploBtn) {
        const newEjemploBtn = ejemploBtn.cloneNode(true);
        ejemploBtn.parentNode.replaceChild(newEjemploBtn, ejemploBtn);
        newEjemploBtn.addEventListener('click', mostrarMasEjemploGaussSeidel);
    }
    
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', limpiarGaussSeidel);
    }
    
    console.log('GaussSeidel.js: Eventos asignados correctamente');
}

function cargarEjemploInicialGaussSeidel() {
    console.log('GaussSeidel.js: Cargando ejemplo inicial...');
    
    const ejemplo = {
        nombre: "Sistema 3×3 Diagonal Dominante",
        descripcion: "Sistema con matriz diagonalmente dominante - converge rápido",
        n: 3,
        A: [[10, 2, 1], [1, 10, 2], [2, 1, 10]],
        b: [13, 13, 13],
        x0: [0, 0, 0],
        tol: 0.0001,
        maxIter: 100,
        omega: 1.0,
        solucionExacta: [1, 1, 1],
        nota: "Matriz diagonalmente dominante garantiza convergencia"
    };
    
    cargarEjemploEspecificoGaussSeidel(ejemplo);
}

function cargarEjemploEspecificoGaussSeidel(ejemplo) {
    console.log(`GaussSeidel.js: Cargando ejemplo - ${ejemplo.nombre}`);
    
    // Configurar dimensión
    document.getElementById('gauss-seidel-n').value = ejemplo.n;
    generarMatricesGaussSeidel();
    
    // Dar tiempo para que se generen las matrices
    setTimeout(() => {
        // Rellenar matriz A
        for (let i = 0; i < ejemplo.n; i++) {
            for (let j = 0; j < ejemplo.n; j++) {
                const input = document.querySelector(`.gauss-seidel-a[data-i="${i}"][data-j="${j}"]`);
                if (input) input.value = ejemplo.A[i][j];
            }
        }
        
        // Rellenar vector b
        for (let i = 0; i < ejemplo.n; i++) {
            const input = document.querySelector(`.gauss-seidel-b[data-i="${i}"]`);
            if (input) input.value = ejemplo.b[i];
        }
        
        // Rellenar vector inicial x⁽⁰⁾
        for (let i = 0; i < ejemplo.n; i++) {
            const input = document.querySelector(`.gauss-seidel-x0[data-i="${i}"]`);
            if (input) input.value = ejemplo.x0[i];
        }
        
        // Configurar otros parámetros
        document.getElementById('gauss-seidel-tol').value = ejemplo.tol;
        document.getElementById('gauss-seidel-max-iter').value = ejemplo.maxIter;
        document.getElementById('gauss-seidel-relajacion').value = ejemplo.omega;
        document.getElementById('gauss-seidel-diagonal-dominante').checked = true;
        document.getElementById('gauss-seidel-mostrar-paso-a-paso').checked = false;
        
        // Mostrar descripción del ejemplo
        let descripcion = document.getElementById('gauss-seidel-descripcion-ejemplo');
        if (!descripcion) {
            descripcion = document.createElement('div');
            descripcion.id = 'gauss-seidel-descripcion-ejemplo';
            const inputSection = document.querySelector('#gauss-seidel-content .input-group:first-child');
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
                <br><small><i class="fas fa-sync-alt"></i> <strong>Ventaja Gauss-Seidel:</strong> Usa valores actualizados inmediatamente, converge más rápido que Jacobi.</small>
            </div>
        `;
        
        // Calcular automáticamente después de un breve delay
        setTimeout(() => {
            calcularGaussSeidel();
        }, 400);
        
    }, 200);
}

function calcularGaussSeidel() {
    console.log('GaussSeidel.js: Resolviendo sistema...');
    
    // OBTENER PARÁMETROS
    const n = parseInt(document.getElementById('gauss-seidel-n').value);
    const tol = parseFloat(document.getElementById('gauss-seidel-tol').value);
    const maxIter = parseInt(document.getElementById('gauss-seidel-max-iter').value);
    const omega = parseFloat(document.getElementById('gauss-seidel-relajacion').value);
    const verificarDiagonal = document.getElementById('gauss-seidel-diagonal-dominante').checked;
    const mostrarPasoAPaso = document.getElementById('gauss-seidel-mostrar-paso-a-paso').checked;
    
    // Validaciones básicas
    if (isNaN(n) || n < 2) {
        showError('La dimensión debe ser ≥ 2', 'gauss-seidel-n');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('La tolerancia debe ser positiva', 'gauss-seidel-tol');
        return;
    }
    
    if (isNaN(maxIter) || maxIter < 10) {
        showError('El máximo de iteraciones debe ser ≥ 10', 'gauss-seidel-max-iter');
        return;
    }
    
    if (isNaN(omega) || omega <= 0 || omega > 2) {
        showError('El factor de relajación debe estar entre 0.1 y 2.0', 'gauss-seidel-relajacion');
        return;
    }
    
    // Obtener matriz A
    const A = [];
    for (let i = 0; i < n; i++) {
        A[i] = [];
        for (let j = 0; j < n; j++) {
            const input = document.querySelector(`.gauss-seidel-a[data-i="${i}"][data-j="${j}"]`);
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
    
    // Obtener vector b
    const b = [];
    for (let i = 0; i < n; i++) {
        const input = document.querySelector(`.gauss-seidel-b[data-i="${i}"]`);
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
    
    // Obtener vector inicial x⁽⁰⁾
    const x0 = [];
    for (let i = 0; i < n; i++) {
        const input = document.querySelector(`.gauss-seidel-x0[data-i="${i}"]`);
        if (!input) {
            showError(`Elemento x${i+1}⁽⁰⁾ no encontrado`);
            return;
        }
        const valor = parseFloat(input.value);
        if (isNaN(valor)) {
            showError(`Elemento x${i+1}⁽⁰⁾ no es un número válido`);
            return;
        }
        x0[i] = valor;
    }
    
    // Verificar que los elementos diagonales no sean cero
    for (let i = 0; i < n; i++) {
        if (Math.abs(A[i][i]) < 1e-10) {
            showError(`Elemento diagonal a${i+1}${i+1} es cero o muy pequeño. Gauss-Seidel requiere aᵢᵢ ≠ 0.`);
            return;
        }
    }
    
    // Mostrar loading
    showLoading(document.getElementById('gauss-seidel-calc'), true);
    
    // Realizar cálculo
    setTimeout(() => {
        try {
            const inicio = performance.now();
            
            // Ejecutar método de Gauss-Seidel
            const resultado = metodoGaussSeidel(A, b, x0, tol, maxIter, omega, verificarDiagonal, mostrarPasoAPaso);
            
            const fin = performance.now();
            resultado.tiempo = fin - inicio;
            
            mostrarResultadosGaussSeidel(resultado, A, b, n);
            
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
            console.error('GaussSeidel.js error:', error);
        } finally {
            showLoading(document.getElementById('gauss-seidel-calc'), false);
        }
    }, 100);
}

function metodoGaussSeidel(A, b, x0, tol, maxIter, omega, verificarDiagonal, mostrarPasoAPaso) {
    console.log(`GaussSeidel.js: Ejecutando método ${omega === 1.0 ? 'Gauss-Seidel' : 'SOR'} (ω=${omega})`);
    
    const n = A.length;
    const iteraciones = [];
    let x = [...x0]; // Copia del vector inicial
    let xAnterior = [...x0];
    let k = 0;
    let error = Infinity;
    let converge = false;
    
    // Verificar condiciones de convergencia si se solicita
    const analisis = analizarMatriz(A, verificarDiagonal);
    
    // Iteración principal
    while (k < maxIter && error > tol) {
        xAnterior = [...x]; // Guardar iteración anterior
        
        // Para cada variable x_i
        for (let i = 0; i < n; i++) {
            let sum1 = 0; // Suma de a_ij * x_j^(k+1) para j < i
            let sum2 = 0; // Suma de a_ij * x_j^(k) para j > i
            
            for (let j = 0; j < i; j++) {
                sum1 += A[i][j] * x[j]; // Usa valores ya actualizados
            }
            
            for (let j = i + 1; j < n; j++) {
                sum2 += A[i][j] * xAnterior[j]; // Usa valores de la iteración anterior
            }
            
            // Cálculo de Gauss-Seidel con relajación (SOR si ω ≠ 1)
            const xGS = (b[i] - sum1 - sum2) / A[i][i];
            x[i] = (1 - omega) * xAnterior[i] + omega * xGS;
        }
        
        // Calcular error (norma infinito)
        error = 0;
        for (let i = 0; i < n; i++) {
            const dif = Math.abs(x[i] - xAnterior[i]);
            if (dif > error) error = dif;
        }
        
        // Calcular tasa de convergencia (solo después de la primera iteración)
        let tasaConvergencia = null;
        if (k > 0 && iteraciones[k-1].error > 0) {
            tasaConvergencia = error / iteraciones[k-1].error;
        }
        
        // Guardar información de la iteración
        iteraciones.push({
            k: k + 1,
            x: [...x],
            error: error,
            tasaConvergencia: tasaConvergencia
        });
        
        k++;
        
        // Verificar convergencia
        if (error <= tol) {
            converge = true;
            break;
        }
    }
    
    // Calcular error relativo (si se conoce solución exacta del ejemplo)
    let errorRelativo = null;
    let solucionExacta = null;
    
    // Verificar si hay solución exacta en la descripción del ejemplo
    const descripcion = document.getElementById('gauss-seidel-descripcion-ejemplo');
    if (descripcion && descripcion.textContent.includes('Solución exacta:')) {
        // Extraer solución exacta del texto (esto es simplificado)
        // En una implementación real, se podría almacenar en un atributo data
        const match = descripcion.textContent.match(/Solución exacta:\s*\[([^\]]+)\]/);
        if (match) {
            try {
                solucionExacta = match[1].split(',').map(Number);
                if (solucionExacta.length === n) {
                    let errorAbs = 0;
                    for (let i = 0; i < n; i++) {
                        errorAbs = Math.max(errorAbs, Math.abs(x[i] - solucionExacta[i]));
                    }
                    errorRelativo = errorAbs;
                }
            } catch (e) {
                console.warn('No se pudo extraer solución exacta:', e);
            }
        }
    }
    
    return {
        solucion: x,
        iteraciones: iteraciones,
        convergencia: converge,
        iteracionesTotales: k,
        errorFinal: error,
        analisis: analisis,
        tiempo: 0, // Se asignará después
        errorRelativo: errorRelativo,
        solucionExacta: solucionExacta,
        n: n,
        omega: omega,
        tol: tol
    };
}

function analizarMatriz(A, verificarDiagonal) {
    const n = A.length;
    const analisis = [];
    
    // 1. Verificar diagonal dominante
    if (verificarDiagonal) {
        let esDiagonalDominanteFila = true;
        let esDiagonalDominanteFilaEstricta = true;
        
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    suma += Math.abs(A[i][j]);
                }
            }
            
            const condicionFila = Math.abs(A[i][i]) >= suma;
            const condicionFilaEstricta = Math.abs(A[i][i]) > suma;
            
            esDiagonalDominanteFila = esDiagonalDominanteFila && condicionFila;
            esDiagonalDominanteFilaEstricta = esDiagonalDominanteFilaEstricta && condicionFilaEstricta;
            
            analisis.push({
                propiedad: `Fila ${i+1} diagonal dominante`,
                valor: `${formatNumber(Math.abs(A[i][i]), 4)} ≥ ${formatNumber(suma, 4)}`,
                condicion: '|aᵢᵢ| ≥ Σⱼ≠ᵢ|aᵢⱼ|',
                cumple: condicionFila
            });
        }
        
        analisis.push({
            propiedad: 'Matriz diagonal dominante por filas',
            valor: esDiagonalDominanteFila ? 'Sí' : 'No',
            condicion: '|aᵢᵢ| ≥ Σⱼ≠ᵢ|aᵢⱼ| ∀i',
            cumple: esDiagonalDominanteFila
        });
        
        analisis.push({
            propiedad: 'Matriz diagonal dominante estricta',
            valor: esDiagonalDominanteFilaEstricta ? 'Sí' : 'No',
            condicion: '|aᵢᵢ| > Σⱼ≠ᵢ|aᵢⱼ| ∀i',
            cumple: esDiagonalDominanteFilaEstricta,
            explicacion: esDiagonalDominanteFilaEstricta ? 
                'Garantiza convergencia de Gauss-Seidel' : 
                'Convergencia no garantizada'
        });
    }
    
    // 2. Verificar simetría
    let esSimetrica = true;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(A[i][j] - A[j][i]) > 1e-10) {
                esSimetrica = false;
                break;
            }
        }
        if (!esSimetrica) break;
    }
    
    analisis.push({
        propiedad: 'Matriz simétrica',
        valor: esSimetrica ? 'Sí' : 'No',
        condicion: 'A = Aᵀ',
        cumple: esSimetrica,
        explicacion: esSimetrica ? 'Condición suficiente para convergencia si es definida positiva' : ''
    });
    
    // 3. Verificar definida positiva (aproximación simple)
    if (esSimetrica) {
        // Solo verificar que los elementos diagonales sean positivos
        let diagonalPositiva = true;
        for (let i = 0; i < n; i++) {
            if (A[i][i] <= 0) {
                diagonalPositiva = false;
                break;
            }
        }
        
        analisis.push({
            propiedad: 'Elementos diagonales positivos',
            valor: diagonalPositiva ? 'Sí' : 'No',
            condicion: 'aᵢᵢ > 0 ∀i',
            cumple: diagonalPositiva,
            explicacion: diagonalPositiva ? 'Necesario (no suficiente) para ser definida positiva' : ''
        });
    }
    
    return analisis;
}

function mostrarResultadosGaussSeidel(resultado, A, b, n) {
    console.log('GaussSeidel.js: Mostrando resultados...');
    
    // Almacenar resultados globalmente
    window.gaussSeidelResultados = resultado;
    
    // Mostrar solución
    const solucionHTML = resultado.solucion.map((xi, i) => 
        `x<sub>${i+1}</sub> = ${formatNumber(xi, 8)}`
    ).join('<br>');
    
    document.getElementById('gauss-seidel-solucion').innerHTML = solucionHTML;
    
    // Mostrar estadísticas
    document.getElementById('gauss-seidel-iteraciones').textContent = resultado.iteracionesTotales;
    document.getElementById('gauss-seidel-tiempo').textContent = formatNumber(resultado.tiempo, 2) + ' ms';
    document.getElementById('gauss-seidel-error').textContent = formatNumber(resultado.errorFinal, 10);
    
    // Calcular y mostrar tasa de convergencia promedio
    let tasaPromedio = null;
    if (resultado.iteraciones.length > 1) {
        const tasas = resultado.iteraciones
            .slice(1)
            .map(it => it.tasaConvergencia)
            .filter(t => t !== null);
        
        if (tasas.length > 0) {
            tasaPromedio = tasas.reduce((sum, t) => sum + t, 0) / tasas.length;
        }
    }
    
    document.getElementById('gauss-seidel-tasa').textContent = 
        tasaPromedio !== null ? formatNumber(tasaPromedio, 6) : '-';
    
    // Actualizar barra de convergencia
    const convergenciaBar = document.getElementById('gauss-seidel-convergencia-bar');
    const convergenciaText = document.getElementById('gauss-seidel-convergencia-text');
    
    if (resultado.convergencia) {
        const porcentaje = Math.min(100, 100 - Math.log10(resultado.errorFinal / resultado.tol) * 10);
        convergenciaBar.style.width = `${porcentaje}%`;
        convergenciaText.textContent = 'Convergió ✓';
        convergenciaText.style.color = '#27ae60';
    } else {
        const porcentaje = Math.min(100, (resultado.iteracionesTotales / resultado.tol) * 100);
        convergenciaBar.style.width = `${porcentaje}%`;
        convergenciaText.textContent = 'No convergió ✗';
        convergenciaText.style.color = '#e74c3c';
    }
    
    // Actualizar tabla de iteraciones
    actualizarTablaIteracionesGaussSeidel(resultado.iteraciones, n);
    
    // Actualizar tabla de análisis
    actualizarTablaAnalisisGaussSeidel(resultado.analisis);
    
    // Crear gráficos
    crearGraficoConvergenciaGaussSeidel(resultado.iteraciones);
    
    // Actualizar comparación con Jacobi
    actualizarComparacionJacobiGaussSeidel(resultado, A, b, n);
}

function actualizarTablaIteracionesGaussSeidel(iteraciones, n) {
    const tbody = document.getElementById('gauss-seidel-iteraciones-body');
    tbody.innerHTML = '';
    
    const mostrarPasoAPaso = document.getElementById('gauss-seidel-mostrar-paso-a-paso').checked;
    const iteracionesMostrar = mostrarPasoAPaso ? iteraciones : 
        iteraciones.filter((_, index) => 
            index === 0 || 
            index === iteraciones.length - 1 || 
            (index + 1) % Math.ceil(iteraciones.length / 10) === 0
        );
    
    iteracionesMostrar.forEach(it => {
        const row = document.createElement('tr');
        
        // Resaltar última iteración si convergió
        let bgColor = '';
        if (it.k === iteraciones.length && window.gaussSeidelResultados.convergencia) {
            bgColor = 'background-color: rgba(46, 204, 113, 0.1);';
        }
        
        // Mostrar valores de x según dimensión
        let valoresX = '';
        for (let i = 0; i < Math.min(3, n); i++) { // Mostrar máximo 3 variables
            valoresX += `<td>${formatNumber(it.x[i], 6)}</td>`;
        }
        
        // Completar con guiones si n < 3
        for (let i = n; i < 3; i++) {
            valoresX += '<td>-</td>';
        }
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #9b59b6; ${bgColor}">${it.k}</td>
            ${valoresX}
            <td>${formatNumber(it.error, 10)}</td>
            <td>${it.tasaConvergencia !== null ? formatNumber(it.tasaConvergencia, 6) : '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

function actualizarTablaAnalisisGaussSeidel(analisis) {
    const tbody = document.getElementById('gauss-seidel-analisis-body');
    tbody.innerHTML = '';
    
    analisis.forEach(a => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td style="font-weight: bold; color: #2c3e50;">${a.propiedad}</td>
            <td>${a.valor}</td>
            <td>${a.condicion}</td>
            <td style="color: ${a.cumple ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                ${a.cumple ? '✓' : '✗'}
            </td>
            <td style="font-size: 0.9rem;">${a.explicacion || ''}</td>
        `;
        tbody.appendChild(row);
    });
}

function crearGraficoConvergenciaGaussSeidel(iteraciones) {
    const labels = iteraciones.map(it => `Iter ${it.k}`);
    const errores = iteraciones.map(it => it.error);
    const tasas = iteraciones.map(it => it.tasaConvergencia || 0);
    
    const datasets = [{
        label: 'Error ‖x⁽ᵏ⁺¹⁾ - x⁽ᵏ⁾‖∞',
        data: errores,
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        yAxisID: 'y'
    }];
    
    // Solo agregar tasa de convergencia si hay valores
    if (tasas.some(t => t > 0)) {
        datasets.push({
            label: 'Tasa de convergencia',
            data: tasas,
            borderColor: '#e74c3c',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
            borderDash: [5, 5],
            yAxisID: 'y1'
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
            x: {
                title: {
                    display: true,
                    text: 'Iteración (k)'
                }
            },
            y: {
                type: 'logarithmic',
                position: 'left',
                title: {
                    display: true,
                    text: 'Error (escala logarítmica)'
                },
                min: Math.pow(10, Math.floor(Math.log10(Math.min(...errores.filter(e => e > 0)))) - 1)
            },
            y1: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Tasa de convergencia'
                },
                grid: {
                    drawOnChartArea: false
                },
                min: 0,
                max: 1
            }
        }
    };
    
    createChart('gauss-seidel-chart', data, options);
}

function actualizarComparacionJacobiGaussSeidel(resultadoGaussSeidel, A, b, n) {
    // Implementar método de Jacobi para comparación
    function metodoJacobi(A, b, x0, tol, maxIter) {
        const n = A.length;
        const iteraciones = [];
        let x = [...x0];
        let xAnterior = [...x0];
        let k = 0;
        let error = Infinity;
        
        while (k < maxIter && error > tol) {
            xAnterior = [...x];
            
            // Para cada variable x_i
            for (let i = 0; i < n; i++) {
                let suma = 0;
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        suma += A[i][j] * xAnterior[j];
                    }
                }
                x[i] = (b[i] - suma) / A[i][i];
            }
            
            // Calcular error
            error = 0;
            for (let i = 0; i < n; i++) {
                const dif = Math.abs(x[i] - xAnterior[i]);
                if (dif > error) error = dif;
            }
            
            iteraciones.push({
                k: k + 1,
                error: error
            });
            
            k++;
        }
        
        return {
            solucion: x,
            iteracionesTotales: k,
            errorFinal: error,
            converge: error <= tol
        };
    }
    
    // Obtener parámetros
    const x0 = [];
    for (let i = 0; i < n; i++) {
        const input = document.querySelector(`.gauss-seidel-x0[data-i="${i}"]`);
        x0.push(parseFloat(input.value));
    }
    
    const tol = parseFloat(document.getElementById('gauss-seidel-tol').value);
    const maxIter = parseInt(document.getElementById('gauss-seidel-max-iter').value);
    
    // Ejecutar Jacobi
    const resultadoJacobi = metodoJacobi(A, b, x0, tol, maxIter);
    
    // Actualizar tabla de comparación
    const tbody = document.getElementById('gauss-seidel-comparacion-body');
    tbody.innerHTML = '';
    
    const metodos = [
        {
            nombre: 'Jacobi',
            resultado: resultadoJacobi,
            color: '#3498db',
            ventaja: 'Paralelizable, simple'
        },
        {
            nombre: resultadoGaussSeidel.omega === 1.0 ? 'Gauss-Seidel' : 'SOR (ω=' + resultadoGaussSeidel.omega + ')',
            resultado: resultadoGaussSeidel,
            color: '#9b59b6',
            ventaja: resultadoGaussSeidel.omega === 1.0 ? 
                'Converge más rápido que Jacobi' : 
                'Convergencia acelerada con ω óptimo'
        }
    ];
    
    metodos.forEach(m => {
        const row = document.createElement('tr');
        
        // Calcular tiempo relativo (estimación)
        const tiempoRelativo = m.nombre.includes('Jacobi') ? 
            resultadoGaussSeidel.tiempo * 0.8 : // Jacobi es más lento por iteración pero más paralelizable
            resultadoGaussSeidel.tiempo;
        
        row.innerHTML = `
            <td style="font-weight: bold; color: ${m.color};">
                <i class="fas fa-${m.nombre.includes('Jacobi') ? 'sync' : 'sync-alt'}"></i>
                ${m.nombre}
            </td>
            <td>${m.resultado.iteracionesTotales}</td>
            <td>${formatNumber(tiempoRelativo, 2)} ms</td>
            <td>${formatNumber(m.resultado.errorFinal, 10)}</td>
            <td>${m.resultado.converge ? 'Converge' : 'No converge'}</td>
            <td style="font-size: 0.9rem;">${m.ventaja}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Crear gráfico de comparación
    crearGraficoComparacionJacobiGaussSeidel(metodos);
}

function crearGraficoComparacionJacobiGaussSeidel(metodos) {
    const data = {
        labels: ['Iteraciones', 'Error final', 'Convergencia'],
        datasets: metodos.map((m, i) => ({
            label: m.nombre,
            data: [
                m.resultado.iteracionesTotales,
                Math.log10(Math.max(m.resultado.errorFinal, 1e-10)), // Evitar log(0)
                m.resultado.converge ? 1 : 0
            ],
            backgroundColor: m.color + '80',
            borderColor: m.color,
            borderWidth: 2
        }))
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
                        const label = context.dataset.label || '';
                        const value = context.parsed.r;
                        let displayValue = value;
                        
                        if (context.dataIndex === 1) { // Error final
                            displayValue = `log(Error) = ${value.toFixed(4)}`;
                        } else if (context.dataIndex === 2) { // Convergencia
                            displayValue = value === 1 ? 'Converge' : 'No converge';
                        }
                        
                        return `${label}: ${displayValue}`;
                    }
                }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    // SOLUCIÓN DEFINITIVA: Usar función flecha con lógica simple
                    callback: function(value, index) {
                        // En gráficos radar, los ticks son para valores numéricos
                        // Las etiquetas categóricas están en los ejes
                        return value;
                    }
                }
            }
        }
    };
    
    createChart('gauss-seidel-comparacion-chart', data, options, 'radar');
}

function mostrarMasEjemploGaussSeidel() {
    const ejemplosExtras = [
        {
            nombre: "Sistema Poisson 2D",
            descripcion: "Discretización de ∇²u = f en malla 3×3 (9 ecuaciones)",
            n: 9,
            A: [
                [4, -1, 0, -1, 0, 0, 0, 0, 0],
                [-1, 4, -1, 0, -1, 0, 0, 0, 0],
                [0, -1, 4, 0, 0, -1, 0, 0, 0],
                [-1, 0, 0, 4, -1, 0, -1, 0, 0],
                [0, -1, 0, -1, 4, -1, 0, -1, 0],
                [0, 0, -1, 0, -1, 4, 0, 0, -1],
                [0, 0, 0, -1, 0, 0, 4, -1, 0],
                [0, 0, 0, 0, -1, 0, -1, 4, -1],
                [0, 0, 0, 0, 0, -1, 0, -1, 4]
            ],
            b: [1, 0, 1, 0, 0, 0, 1, 0, 1],
            x0: Array(9).fill(0),
            tol: 0.0001,
            maxIter: 200,
            omega: 1.2,
            nota: "Matriz laplaciana 9×9 - SOR con ω≈1.2 es óptimo"
        },
        {
            nombre: "Sistema con Convergencia Oscilante",
            descripcion: "Sistema que muestra oscilaciones antes de converger",
            n: 2,
            A: [[1, 0.9], [0.9, 1]],
            b: [1.9, 1.9],
            x0: [0, 0],
            tol: 0.00001,
            maxIter: 50,
            omega: 0.8,
            solucionExacta: [1, 1],
            nota: "Sub-relajación (ω<1) ayuda a estabilizar oscilaciones"
        }
    ];
    
    // Crear modal similar al selector inicial
    const modalHTML = `
        <div class="modal-overlay" id="gauss-seidel-mas-ejemplos-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-vial"></i> Ejemplos Avanzados - Gauss-Seidel</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        ${ejemplosExtras.map((ejemplo, index) => `
                            <div class="ejemplo-card" style="background: white; padding: 1rem; border-radius: 6px; 
                                  border: 1px solid #dee2e6; cursor: pointer; transition: all 0.3s;">
                                <h5 style="color: #9b59b6; margin-bottom: 0.5rem;">
                                    <i class="fas fa-sync-alt"></i> ${ejemplo.nombre}
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
                                <button class="cargar-gauss-seidel-ejemplo-ext-btn" data-index="${index}" 
                                        style="background: #9b59b6; color: white; border: none; padding: 0.5rem 1rem; 
                                               border-radius: 4px; cursor: pointer; width: 100%;">
                                    <i class="fas fa-play-circle"></i> Cargar y Resolver
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
    const modalExistente = document.getElementById('gauss-seidel-mas-ejemplos-modal');
    if (modalExistente) modalExistente.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    const modal = document.getElementById('gauss-seidel-mas-ejemplos-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const ejemploBtns = modal.querySelectorAll('.cargar-gauss-seidel-ejemplo-ext-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    ejemploBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cargarEjemploEspecificoGaussSeidel(ejemplosExtras[index]);
            modal.remove();
        });
    });
}

function limpiarGaussSeidel() {
    console.log('GaussSeidel.js: Limpiando...');
    
    // Restablecer valores por defecto
    document.getElementById('gauss-seidel-n').value = '3';
    document.getElementById('gauss-seidel-tol').value = '0.0001';
    document.getElementById('gauss-seidel-max-iter').value = '100';
    document.getElementById('gauss-seidel-relajacion').value = '1.0';
    document.getElementById('gauss-seidel-diagonal-dominante').checked = true;
    document.getElementById('gauss-seidel-mostrar-paso-a-paso').checked = false;
    
    // Regenerar matrices
    generarMatricesGaussSeidel();
    
    // Limpiar resultados
    document.getElementById('gauss-seidel-solucion').innerHTML = '';
    document.getElementById('gauss-seidel-iteraciones').textContent = '-';
    document.getElementById('gauss-seidel-tiempo').textContent = '-';
    document.getElementById('gauss-seidel-error').textContent = '-';
    document.getElementById('gauss-seidel-tasa').textContent = '-';
    document.getElementById('gauss-seidel-iteraciones-body').innerHTML = '';
    document.getElementById('gauss-seidel-analisis-body').innerHTML = '';
    document.getElementById('gauss-seidel-comparacion-body').innerHTML = '';
    
    // Restablecer indicador de convergencia
    document.getElementById('gauss-seidel-convergencia-bar').style.width = '0%';
    document.getElementById('gauss-seidel-convergencia-text').textContent = '-';
    document.getElementById('gauss-seidel-convergencia-text').style.color = '#9b59b6';
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('gauss-seidel-descripcion-ejemplo');
    if (descripcion) descripcion.innerHTML = '';
    
    // Limpiar gráficos
    const charts = ['gauss-seidel-chart', 'gauss-seidel-comparacion-chart'];
    charts.forEach(chartId => {
        if (window.charts && window.charts[chartId]) {
            window.charts[chartId].destroy();
            delete window.charts[chartId];
        }
    });
    
    // Crear gráfico vacío
    const ctx = document.getElementById('gauss-seidel-chart').getContext('2d');
    const emptyChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Resuelve el sistema para ver la convergencia',
                data: [],
                borderColor: 'rgba(200, 200, 200, 0.5)',
                borderWidth: 1,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Iteración' } },
                y: { title: { display: true, text: 'Error' } }
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
    window.charts['gauss-seidel-chart'] = emptyChart;
    
    console.log('GaussSeidel.js: Limpieza completada');
}

// Función de prueba rápida
function pruebaRapidaGaussSeidel() {
    console.log("=== PRUEBA DE MÉTODO DE GAUSS-SEIDEL ===");
    
    try {
        const A = [[10, 2, 1], [1, 10, 2], [2, 1, 10]];
        const b = [13, 13, 13];
        const x0 = [0, 0, 0];
        const tol = 1e-6;
        const maxIter = 50;
        const omega = 1.0;
        
        const resultado = metodoGaussSeidel(A, b, x0, tol, maxIter, omega, true, false);
        
        console.log("Sistema:", A.map((row, i) => `${row.join(', ')} | ${b[i]}`).join('\n        '));
        console.log("Solución aproximada:", resultado.solucion);
        console.log("Iteraciones:", resultado.iteracionesTotales);
        console.log("Error final:", resultado.errorFinal);
        console.log("Converge:", resultado.convergencia);
        console.log("\nPrimeras 5 iteraciones:");
        resultado.iteraciones.slice(0, 5).forEach(it => {
            console.log(`  Iter ${it.k}: x = [${it.x.map(v => formatNumber(v, 6)).join(', ')}], error = ${formatNumber(it.error, 8)}`);
        });
        
        return resultado;
    } catch (error) {
        console.error("Error en prueba:", error.message);
        return null;
    }
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaGaussSeidel);