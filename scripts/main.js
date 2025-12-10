// main.js - Versión completa con eventos
document.addEventListener('DOMContentLoaded', function() {
    console.log('LabNum-Pro inicializado');
    
    // Navegación entre secciones
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Mostrar la sección correspondiente
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            
            if (targetElement) {
                targetElement.classList.add('active');
                
                // 1. DISPARAR EVENTO DE CAMBIO DE SECCIÓN
                const sectionEvent = new CustomEvent('sectionChanged', {
                    detail: { 
                        section: targetSection,
                        element: targetElement
                    }
                });
                document.dispatchEvent(sectionEvent);
                
                console.log(`Sección cambiada a: ${targetSection}`);
            }
            
            // Cerrar menú móvil si está abierto
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            // Cambiar ícono del menú móvil
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Toggle del menú móvil
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.toggle('active');
                
                // Cambiar ícono
                const icon = this.querySelector('i');
                if (icon) {
                    if (navMenu.classList.contains('active')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    }
    
    // Selector de métodos dentro de cada sección
    document.querySelectorAll('.method-selector').forEach(selector => {
        const methodBtns = selector.querySelectorAll('.method-btn');
        const methodContents = selector.parentElement.querySelectorAll('.method-content');
        
        methodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                methodBtns.forEach(b => b.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                // Ocultar todos los contenidos
                methodContents.forEach(content => content.classList.add('hidden'));
                
                // Mostrar el contenido correspondiente
                const targetMethod = this.getAttribute('data-method');
                const targetContent = selector.parentElement.querySelector(`#${targetMethod}-content`);
                
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    
                    // 2. DISPARAR EVENTO DE CAMBIO DE MÉTODO
                    const methodEvent = new CustomEvent('methodChanged', {
                        detail: { 
                            method: targetMethod,
                            content: targetContent,
                            section: selector.closest('.content-section').id
                        }
                    });
                    document.dispatchEvent(methodEvent);
                    
                    console.log(`Método cambiado a: ${targetMethod}`);
                }
            });
        });
    });
    
    // Inicializar gráficos
    initializeCharts();
    
    // Cargar ejemplos iniciales
    loadInitialExamples();
    
    // 3. INICIALIZAR SECCIÓN ACTIVA AL CARGAR
    setTimeout(() => {
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            
            const sectionEvent = new CustomEvent('sectionChanged', {
                detail: { 
                    section: sectionId,
                    element: activeSection
                }
            });
            document.dispatchEvent(sectionEvent);
            
            console.log(`Sección inicial activa: ${sectionId}`);
        }
        
        // También inicializar método activo dentro de la sección
        const activeMethodBtn = document.querySelector('.method-btn.active');
        if (activeMethodBtn) {
            const methodId = activeMethodBtn.getAttribute('data-method');
            const methodContent = document.getElementById(`${methodId}-content`);
            
            if (methodContent) {
                const methodEvent = new CustomEvent('methodChanged', {
                    detail: { 
                        method: methodId,
                        content: methodContent,
                        section: methodContent.closest('.content-section').id
                    }
                });
                document.dispatchEvent(methodEvent);
                
                console.log(`Método inicial activo: ${methodId}`);
            }
        }
    }, 800);
});

// Inicializar gráficos
function initializeCharts() {
    console.log('Sistema de gráficos inicializado');
    if (!window.charts) {
        window.charts = {};
    }
}

// Cargar ejemplos iniciales
function loadInitialExamples() {
    console.log('Cargando ejemplos iniciales...');
    
    // Cargar ejemplo de bisección al inicio
    setTimeout(() => {
        const bisecEjemploBtn = document.getElementById('bisec-ejemplo');
        if (bisecEjemploBtn) {
            bisecEjemploBtn.click();
            console.log('Ejemplo de bisección cargado');
        }
    }, 1000);
}

// Función para evaluar expresiones matemáticas
// Función para evaluar expresiones matemáticas VERSIÓN CORREGIDA
function evaluateExpression(expr, ...variables) {
    try {
        if (!expr || typeof expr !== 'string') {
            throw new Error('Expresión no válida');
        }
        
        let expression = expr.trim();
        
        // Reemplazar variables según el número de parámetros
        if (variables.length === 1) {
            // Para raíces: f(x) - solo variable x
            expression = expression.replace(/x/g, `(${variables[0]})`);
        } else if (variables.length === 2) {
            // Para EDOs: f(x, y) o f(t, y)
            expression = expression.replace(/x|t/g, `(${variables[0]})`);
            expression = expression.replace(/y/g, `(${variables[1]})`);
        }
        
        // Reemplazar funciones matemáticas
        const replacements = {
            'sin': 'Math.sin',
            'cos': 'Math.cos', 
            'tan': 'Math.tan',
            'asin': 'Math.asin',
            'acos': 'Math.acos',
            'atan': 'Math.atan',
            'sqrt': 'Math.sqrt',
            'log': 'Math.log10',
            'ln': 'Math.log',
            'exp': 'Math.exp',
            'abs': 'Math.abs',
            'pi': 'Math.PI',
            'e': 'Math.E'
        };
        
        for (const [key, value] of Object.entries(replacements)) {
            expression = expression.replace(new RegExp(key, 'g'), value);
        }
        
        // Manejar operadores
        expression = expression.replace(/\^/g, '**');
        
        // Manejar multiplicación implícita (solo para raíces, no para EDOs)
        if (variables.length === 1) {
            expression = expression.replace(/(\d)([a-zA-Z\(])/g, '$1*$2');
            expression = expression.replace(/(\))(\d)/g, '$1*$2');
            expression = expression.replace(/(\))(\()/g, '$1*$2');
        }
        
        // Validar seguridad
        const cleanExpr = expression.replace(/Math\./g, '');
        const safePattern = /^[0-9\+\-\*\/\(\)\.\,\s]*$/;
        
        if (!safePattern.test(cleanExpr) && variables.length === 1) {
            console.warn('Expresión puede contener caracteres no seguros:', expr);
        }
        
        // Evaluar
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            throw new Error('Resultado no es un número válido');
        }
        
        return result;
    } catch (error) {
        console.error('Error evaluando expresión:', expr, 'variables:', variables, error);
        throw new Error(`Error en expresión "${expr}": ${error.message}`);
    }
}

// Función para formatear números
function formatNumber(num, decimals = 6) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    if (typeof num !== 'number') return num;
    
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(num * factor) / factor;
    
    // Para números muy pequeños, usar notación científica
    if (Math.abs(rounded) < 0.000001 && rounded !== 0) {
        return rounded.toExponential(decimals - 2);
    }
    
    return rounded.toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    });
}

// Función para crear gráfico
function createChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ${canvasId} no encontrado`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente
    if (window.charts && window.charts[canvasId]) {
        window.charts[canvasId].destroy();
    }
    
    // Configuración por defecto
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
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
        }
    };
    
    // Fusionar opciones
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Crear gráfico
    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: mergedOptions
    });
    
    // Almacenar referencia
    if (!window.charts) window.charts = {};
    window.charts[canvasId] = chart;
    
    return chart;
}

// Función para mostrar u ocultar loading
function showLoading(button, show) {
    if (!button) return;
    
    if (show) {
        const originalHTML = button.innerHTML;
        button.setAttribute('data-original', originalHTML);
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        button.disabled = true;
    } else {
        const originalHTML = button.getAttribute('data-original');
        if (originalHTML) {
            button.innerHTML = originalHTML;
        }
        button.disabled = false;
    }
}

// Manejo de errores
function showError(message, elementId = null) {
    console.error('Error:', message);
    
    // Crear/actualizar elemento de error
    let errorElement = document.getElementById('global-error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'global-error-message';
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 400px;
            display: none;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        document.body.appendChild(errorElement);
    }
    
    // Mostrar mensaje
    errorElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 18px;"></i>
            <span>${message}</span>
        </div>
    `;
    errorElement.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
    
    // Resaltar elemento específico si se proporciona
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const originalBorder = element.style.borderColor || '';
            element.style.borderColor = '#e74c3c';
            element.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            
            setTimeout(() => {
                element.style.borderColor = originalBorder;
                element.style.boxShadow = '';
            }, 3000);
        }
    }
}

// Exportar datos
function exportToCSV(data, filename = 'datos.csv') {
    if (!data || data.length === 0) {
        showError('No hay datos para exportar');
        return;
    }
    
    try {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const cell = row[header];
                return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell;
            }).join(','))
        ].join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Archivo ${filename} exportado correctamente`);
    } catch (error) {
        showError('Error al exportar datos: ' + error.message);
    }
}

// Función para mostrar información
function showInfo(title, content) {
    const infoElement = document.getElementById('global-info-message');
    
    if (!infoElement) {
        const newInfoElement = document.createElement('div');
        newInfoElement.id = 'global-info-message';
        newInfoElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: #3498db;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            max-width: 400px;
            display: none;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        document.body.appendChild(newInfoElement);
    }
    
    const element = document.getElementById('global-info-message');
    element.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <i class="fas fa-info-circle" style="font-size: 18px; margin-top: 2px;"></i>
            <div>
                <strong style="display: block; margin-bottom: 5px;">${title}</strong>
                <div>${content}</div>
            </div>
        </div>
    `;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Inicializar tooltips
function initializeTooltips() {
    // Inicializar tooltips de Bootstrap si están disponibles
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Cargar todos los métodos al iniciar
window.addEventListener('load', function() {
    console.log('Página completamente cargada');
    initializeTooltips();
    
    // Verificar que todas las funciones estén disponibles
    console.log('Funciones disponibles:', {
        evaluateExpression: typeof evaluateExpression,
        formatNumber: typeof formatNumber,
        createChart: typeof createChart,
        showError: typeof showError,
        showLoading: typeof showLoading
    });
});