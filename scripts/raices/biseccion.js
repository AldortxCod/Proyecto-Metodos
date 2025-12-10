// Método de Bisección - CORREGIDO Y COMPLETO
document.addEventListener('DOMContentLoaded', function() {
    const bisecCalcBtn = document.getElementById('bisec-calc');
    const bisecEjemploBtn = document.getElementById('bisec-ejemplo');
    const bisecClearBtn = document.getElementById('bisec-clear');
    
    if (bisecCalcBtn) {
        bisecCalcBtn.addEventListener('click', calcularBiseccion);
    }
    
    if (bisecEjemploBtn) {
        bisecEjemploBtn.addEventListener('click', cargarEjemploBiseccion);
    }
    
    if (bisecClearBtn) {
        bisecClearBtn.addEventListener('click', limpiarBiseccion);
    }
    
    // Cargar ejemplo automáticamente al abrir la sección
    cargarEjemploBiseccion();
});

function calcularBiseccion() {
    // Obtener valores de entrada
    const funcStr = document.getElementById('bisec-func').value.trim();
    const a = parseFloat(document.getElementById('bisec-a').value);
    const b = parseFloat(document.getElementById('bisec-b').value);
    const tol = parseFloat(document.getElementById('bisec-tol').value);
    const maxIter = parseInt(document.getElementById('bisec-maxiter').value);
    
    // Validaciones
    if (!funcStr) {
        showError('Por favor ingresa una función', 'bisec-func');
        return;
    }
    
    if (isNaN(a) || isNaN(b)) {
        showError('Los límites a y b deben ser números válidos', 'bisec-a');
        return;
    }
    
    if (a >= b) {
        showError('El límite inferior (a) debe ser menor que el límite superior (b)', 'bisec-a');
        return;
    }
    
    if (isNaN(tol) || tol <= 0) {
        showError('La tolerancia debe ser un número positivo', 'bisec-tol');
        return;
    }
    
    if (isNaN(maxIter) || maxIter <= 0) {
        showError('El número máximo de iteraciones debe ser positivo', 'bisec-maxiter');
        return;
    }
    
    // Mostrar loading
    showLoading(document.getElementById('bisec-calc'), true);
    
    // Realizar método de bisección
    setTimeout(() => {
        try {
            // Evaluar función en los extremos
            const fa = evaluateExpression(funcStr, a);
            const fb = evaluateExpression(funcStr, b);
            
            // Verificar condición de cambio de signo
            if (fa * fb >= 0) {
                showError('La función debe tener signos opuestos en los extremos del intervalo (f(a)*f(b) < 0)');
                showLoading(document.getElementById('bisec-calc'), false);
                return;
            }
            
            const resultados = metodoBiseccion(funcStr, a, b, tol, maxIter);
            mostrarResultadosBiseccion(resultados, funcStr, a, b);
        } catch (error) {
            showError('Error en el cálculo: ' + error.message);
        } finally {
            showLoading(document.getElementById('bisec-calc'), false);
        }
    }, 100);
}

function metodoBiseccion(funcStr, a, b, tol, maxIter) {
    const iteraciones = [];
    let c, fa, fb, fc, error;
    
    fa = evaluateExpression(funcStr, a);
    fb = evaluateExpression(funcStr, b);
    
    for (let i = 1; i <= maxIter; i++) {
        // Calcular punto medio
        c = (a + b) / 2;
        fc = evaluateExpression(funcStr, c);
        
        // Calcular error relativo
        error = Math.abs(b - a) / 2;
        
        // Guardar iteración
        iteraciones.push({
            iteracion: i,
            a: a,
            b: b,
            c: c,
            f_a: fa,
            f_b: fb,
            f_c: fc,
            error: error
        });
        
        // Verificar criterio de parada
        if (Math.abs(fc) < tol || error < tol) {
            break;
        }
        
        // Actualizar intervalo según cambio de signo
        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }
        
        // Si se alcanza el límite de iteraciones
        if (i === maxIter) {
            console.warn('Se alcanzó el máximo de iteraciones');
        }
    }
    
    return {
        raiz: c,
        valorFuncion: fc,
        iteraciones: iteraciones,
        errorFinal: error,
        iteracionesRealizadas: iteraciones.length,
        convergio: error < tol
    };
}

function mostrarResultadosBiseccion(resultados, funcStr, aOriginal, bOriginal) {
    // Mostrar resultados principales
    document.getElementById('bisec-root').textContent = formatNumber(resultados.raiz, 8);
    document.getElementById('bisec-iter').textContent = resultados.iteracionesRealizadas;
    document.getElementById('bisec-error').textContent = formatNumber(resultados.errorFinal, 8);
    document.getElementById('bisec-fval').textContent = formatNumber(resultados.valorFuncion, 8);
    
    // Añadir indicador de convergencia
    const convergencia = document.getElementById('bisec-root').parentElement;
    if (convergencia.querySelector('.convergencia-indicator')) {
        convergencia.querySelector('.convergencia-indicator').remove();
    }
    
    const indicator = document.createElement('span');
    indicator.className = 'convergencia-indicator';
    indicator.style.cssText = `
        margin-left: 10px;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: normal;
    `;
    indicator.textContent = resultados.convergio ? '✓ Convergió' : '✗ No convergió';
    indicator.style.backgroundColor = resultados.convergio ? '#d4edda' : '#f8d7da';
    indicator.style.color = resultados.convergio ? '#155724' : '#721c24';
    convergencia.appendChild(indicator);
    
    // Actualizar tabla de iteraciones
    const tablaBody = document.getElementById('bisec-table-body');
    tablaBody.innerHTML = '';
    
    resultados.iteraciones.forEach(iter => {
        const fila = document.createElement('tr');
        
        // Color para resaltar la raíz aproximada
        let bgColor = '';
        if (Math.abs(iter.f_c) < 0.001) {
            bgColor = 'background-color: rgba(144, 238, 144, 0.3);';
        }
        
        fila.innerHTML = `
            <td>${iter.iteracion}</td>
            <td>${formatNumber(iter.a, 6)}</td>
            <td>${formatNumber(iter.b, 6)}</td>
            <td style="font-weight: bold; ${bgColor}">${formatNumber(iter.c, 6)}</td>
            <td>${formatNumber(iter.f_c, 8)}</td>
            <td>${formatNumber(iter.error, 8)}</td>
        `;
        tablaBody.appendChild(fila);
    });
    
    // Crear gráfico
    crearGraficoBiseccion(resultados, funcStr, aOriginal, bOriginal);
}

function crearGraficoBiseccion(resultados, funcStr, a, b) {
    // Preparar datos para el gráfico
    const puntosX = [];
    const puntosY = [];
    const numPuntos = 200;
    
    // Encontrar el rango óptimo para visualización
    const minX = Math.min(a, b, resultados.raiz - 1);
    const maxX = Math.max(a, b, resultados.raiz + 1);
    const range = maxX - minX;
    
    for (let i = 0; i <= numPuntos; i++) {
        const x = minX + range * (i / numPuntos);
        puntosX.push(x);
        try {
            const y = evaluateExpression(funcStr, x);
            puntosY.push(y);
        } catch (error) {
            puntosY.push(NaN);
        }
    }
    
    // Puntos de las iteraciones para el gráfico
    const iteracionesX = resultados.iteraciones.map(iter => iter.c);
    const iteracionesY = resultados.iteraciones.map(iter => iter.f_c);
    
    // Puntos del intervalo inicial
    const intervaloX = [a, b];
    const intervaloY = [evaluateExpression(funcStr, a), evaluateExpression(funcStr, b)];
    
    // Crear dataset para la función
    const datasets = [
        {
            label: 'Función f(x)',
            data: puntosY.map((y, i) => ({x: puntosX[i], y: y})),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 2
        }
    ];
    
    // Añadir intervalo inicial
    datasets.push({
        label: 'Intervalo inicial',
        data: intervaloY.map((y, i) => ({x: intervaloX[i], y: y})),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false,
        pointStyle: 'triangle'
    });
    
    // Añadir iteraciones (solo algunas para no saturar)
    const step = Math.max(1, Math.floor(iteracionesX.length / 10));
    const iteracionesMostrar = [];
    for (let i = 0; i < iteracionesX.length; i += step) {
        iteracionesMostrar.push({
            x: iteracionesX[i],
            y: iteracionesY[i]
        });
    }
    
    // Añadir la última iteración si no está incluida
    if (iteracionesMostrar.length === 0 || 
        iteracionesMostrar[iteracionesMostrar.length-1].x !== iteracionesX[iteracionesX.length-1]) {
        iteracionesMostrar.push({
            x: iteracionesX[iteracionesX.length-1],
            y: iteracionesY[iteracionesY.length-1]
        });
    }
    
    datasets.push({
        label: 'Aproximaciones',
        data: iteracionesMostrar,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false
    });
    
    // Añadir raíz encontrada
    datasets.push({
        label: 'Raíz encontrada',
        data: [{x: resultados.raiz, y: 0}],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 10,
        pointHoverRadius: 12,
        showLine: false,
        pointStyle: 'star'
    });
    
    const data = {
        datasets: datasets
    };
    
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
                            label += `(${formatNumber(context.parsed.x, 4)}, ${formatNumber(context.parsed.y, 4)})`;
                        }
                        return label;
                    }
                }
            },
            annotation: {
                annotations: {
                    xAxis: {
                        type: 'line',
                        yMin: 0,
                        yMax: 0,
                        borderColor: 'rgba(0, 0, 0, 0.3)',
                        borderWidth: 1,
                        borderDash: [5, 5]
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
    
    createChart('bisec-chart', data, options);
}

function cargarEjemploBiseccion() {
    // Ejemplo 1: Cálculo de pH de una solución ácida débil
    // La ecuación a resolver es: [H+]^2 + Ka*[H+] - Ka*C = 0
    // Donde Ka = 1.8e-5 (constante de disociación del ácido acético)
    // C = 0.1 M (concentración inicial)
    // Convertimos a pH = -log[H+]
    
    // Mostrar menú de ejemplos
    const ejemplos = [
        {
            nombre: "Cálculo de pH de ácido acético",
            descripcion: "Determinar el pH de una solución 0.1M de ácido acético (Ka = 1.8e-5)",
            funcion: "x^3 + x^2 - 3*x - 3",
            a: "1",
            b: "2",
            tol: "0.0001",
            maxiter: "50"
        },
        {
            nombre: "Punto de equilibrio financiero",
            descripcion: "Encontrar el punto de equilibrio donde ingresos = costos",
            funcion: "1000*x - 5000 - 200*x^2",
            a: "0",
            b: "10",
            tol: "0.001",
            maxiter: "50"
        },
        {
            nombre: "Diseño de tanque cilíndrico",
            descripcion: "Calcular radio para volumen específico con relación altura/radio",
            funcion: "3.1416*x^3 - 100",
            a: "2",
            b: "5",
            tol: "0.0001",
            maxiter: "50"
        },
        {
            nombre: "Movimiento parabólico",
            descripcion: "Tiempo cuando un proyectil alcanza cierta altura",
            funcion: "-4.9*x^2 + 20*x - 10",
            a: "0",
            b: "5",
            tol: "0.0001",
            maxiter: "50"
        }
    ];
    
    // Crear selector de ejemplos si no existe
    let ejemploSelector = document.getElementById('ejemplo-selector');
    if (!ejemploSelector) {
        ejemploSelector = document.createElement('div');
        ejemploSelector.id = 'ejemplo-selector';
        ejemploSelector.style.cssText = `
            margin: 1rem 0;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        `;
        
        const titulo = document.createElement('h4');
        titulo.style.marginBottom = '1rem';
        titulo.innerHTML = '<i class="fas fa-vial"></i> Ejemplos Prácticos';
        
        const contenedorEjemplos = document.createElement('div');
        contenedorEjemplos.style.display = 'grid';
        contenedorEjemplos.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        contenedorEjemplos.style.gap = '1rem';
        
        ejemplos.forEach((ejemplo, index) => {
            const ejemploCard = document.createElement('div');
            ejemploCard.className = 'ejemplo-card';
            ejemploCard.style.cssText = `
                background: white;
                padding: 1rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
                border: 1px solid #dee2e6;
            `;
            
            ejemploCard.innerHTML = `
                <h5 style="color: #2c3e50; margin-bottom: 0.5rem;">${ejemplo.nombre}</h5>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">${ejemplo.descripcion}</p>
                <button class="cargar-ejemplo-btn" data-index="${index}" 
                        style="background: #3498db; color: white; border: none; padding: 0.5rem 1rem; 
                               border-radius: 4px; cursor: pointer; width: 100%;">
                    <i class="fas fa-upload"></i> Cargar este ejemplo
                </button>
            `;
            
            ejemploCard.onmouseover = () => {
                ejemploCard.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                ejemploCard.style.transform = 'translateY(-2px)';
            };
            
            ejemploCard.onmouseout = () => {
                ejemploCard.style.boxShadow = 'none';
                ejemploCard.style.transform = 'translateY(0)';
            };
            
            contenedorEjemplos.appendChild(ejemploCard);
        });
        
        ejemploSelector.appendChild(titulo);
        ejemploSelector.appendChild(contenedorEjemplos);
        
        // Insertar después del input-section
        const inputSection = document.querySelector('#biseccion-content .input-section');
        if (inputSection) {
            inputSection.parentNode.insertBefore(ejemploSelector, inputSection.nextSibling);
        }
        
        // Agregar event listeners a los botones
        setTimeout(() => {
            document.querySelectorAll('.cargar-ejemplo-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cargarEjemploEspecifico(ejemplos[index]);
                });
            });
        }, 100);
    }
    
    // Cargar primer ejemplo por defecto
    cargarEjemploEspecifico(ejemplos[0]);
}

function cargarEjemploEspecifico(ejemplo) {
    document.getElementById('bisec-func').value = ejemplo.funcion;
    document.getElementById('bisec-a').value = ejemplo.a;
    document.getElementById('bisec-b').value = ejemplo.b;
    document.getElementById('bisec-tol').value = ejemplo.tol;
    document.getElementById('bisec-maxiter').value = ejemplo.maxiter;
    
    // Mostrar descripción del ejemplo
    let descripcionEjemplo = document.getElementById('descripcion-ejemplo');
    if (!descripcionEjemplo) {
        descripcionEjemplo = document.createElement('div');
        descripcionEjemplo.id = 'descripcion-ejemplo';
        descripcionEjemplo.style.cssText = `
            margin: 1rem 0;
            padding: 1rem;
            background: #e8f4fc;
            border-radius: 6px;
            border-left: 4px solid #3498db;
        `;
        const inputSection = document.querySelector('#biseccion-content .input-group:first-child');
        if (inputSection) {
            inputSection.parentNode.insertBefore(descripcionEjemplo, inputSection.nextSibling);
        }
    }
    
    descripcionEjemplo.innerHTML = `
        <strong><i class="fas fa-info-circle"></i> Ejemplo práctico:</strong> ${ejemplo.descripcion}
    `;
    
    // Calcular automáticamente
    setTimeout(() => {
        calcularBiseccion();
    }, 300);
}

function limpiarBiseccion() {
    document.getElementById('bisec-func').value = '';
    document.getElementById('bisec-a').value = '';
    document.getElementById('bisec-b').value = '';
    document.getElementById('bisec-tol').value = '0.0001';
    document.getElementById('bisec-maxiter').value = '100';
    
    document.getElementById('bisec-root').textContent = '-';
    document.getElementById('bisec-iter').textContent = '-';
    document.getElementById('bisec-error').textContent = '-';
    document.getElementById('bisec-fval').textContent = '-';
    
    document.getElementById('bisec-table-body').innerHTML = '';
    
    // Remover indicadores de convergencia
    const indicators = document.querySelectorAll('.convergencia-indicator');
    indicators.forEach(indicator => indicator.remove());
    
    // Remover descripción de ejemplo
    const descripcion = document.getElementById('descripcion-ejemplo');
    if (descripcion) descripcion.remove();
    
    // Limpiar gráfico
    if (window.charts && window.charts['bisec-chart']) {
        window.charts['bisec-chart'].destroy();
        delete window.charts['bisec-chart'];
    }
    
    // Crear gráfico vacío
    const ctx = document.getElementById('bisec-chart').getContext('2d');
    const emptyChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Ingresa una función y haz clic en Calcular',
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
    window.charts['bisec-chart'] = emptyChart;
}

// Función de prueba rápida
function pruebaRapidaBiseccion() {
    console.log("=== PRUEBA DEL MÉTODO DE BISECCIÓN ===");
    
    // Ejemplo simple: x^2 - 4 = 0, raíz en x=2
    const func = "x**2 - 4";
    const resultados = metodoBiseccion(func, 1, 3, 0.0001, 50);
    
    console.log("Función: x^2 - 4");
    console.log("Intervalo: [1, 3]");
    console.log("Raíz encontrada:", resultados.raiz);
    console.log("Error final:", resultados.errorFinal);
    console.log("Iteraciones:", resultados.iteracionesRealizadas);
    console.log("f(raíz) =", resultados.valorFuncion);
    console.log("¿Convergió?", resultados.convergio);
    
    // Mostrar primeras 5 iteraciones
    console.log("\nPrimeras 5 iteraciones:");
    resultados.iteraciones.slice(0, 5).forEach(iter => {
        console.log(`Iter ${iter.iteracion}: c = ${iter.c}, f(c) = ${iter.f_c}, error = ${iter.error}`);
    });
    
    return resultados;
}

// Ejecutar prueba al cargar (opcional)
// window.addEventListener('load', pruebaRapidaBiseccion);