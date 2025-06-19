# 🧪 Guía de Tests de PurgeTSS

## 🚀 Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo tests rápidos (recomendado para desarrollo)
npm run test:unit

# Tests de integración
npm run test:integration

# Tests de extremo a extremo (completos)
npm run test:e2e
```

## 📁 Estructura de Carpetas

```
tests/
├── 📁 unit/           ⚡ Tests rápidos e independientes
├── 📁 integration/    🔄 Tests de flujos de trabajo
├── 📁 e2e/           🎯 Tests con proyectos reales
└── 🚀 run-tests.js   Script principal para ejecutar tests
```

---

## ⚡ Unit Tests - Tests Rápidos
**Ubicación**: `tests/unit/`  
**Tiempo**: ~5-10 segundos  
**Propósito**: Validar funciones individuales

### 📂 `unit/shared/` - Módulos Compartidos
| Archivo                    | Para qué sirve                                      |
| -------------------------- | --------------------------------------------------- |
| `helpers.test.js`          | ✅ Valida las **381 funciones** de los helpers       |
| `function-counter.test.js` | 📊 Cuenta funciones en cada módulo                   |
| `test-helpers-modules.js`  | 🔗 Prueba que se puedan importar todos los módulos   |
| `test-shared-imports.js`   | 📦 Prueba módulos compartidos (logger, config, etc.) |

### 📂 `unit/cli/` - Comandos CLI
| Archivo            | Para qué sirve                                   |
| ------------------ | ------------------------------------------------ |
| `commands.test.js` | 🔧 Prueba comandos CLI (build, init, purge, etc.) |

### 📂 `unit/core/` - Funcionalidad Principal
| Archivo             | Para qué sirve                           |
| ------------------- | ---------------------------------------- |
| `analyzers.test.js` | 🔍 Prueba extracción de clases y análisis |
| `builders.test.js`  | 🏗️ Prueba construcción de CSS y purga     |

### 📂 `unit/` - Otros
| Archivo          | Para qué sirve                    |
| ---------------- | --------------------------------- |
| `test-fonts.mjs` | 🔤 Prueba procesamiento de fuentes |

---

## 🔄 Integration Tests - Tests de Flujo
**Ubicación**: `tests/integration/`  
**Tiempo**: ~30-60 segundos  
**Propósito**: Validar que los componentes funcionen juntos

| Archivo                 | Para qué sirve                        |
| ----------------------- | ------------------------------------- |
| `test-timing.js`        | ⏱️ Mide rendimiento de operaciones     |
| `test-timing-direct.js` | ⏱️ Mediciones directas de rendimiento  |
| `test-purge.js`         | 🧹 Prueba el proceso completo de purga |
| `test-tailwind.js`      | 🎨 Prueba generación de Tailwind CSS   |

---

## 🎯 E2E Tests - Tests Completos
**Ubicación**: `tests/e2e/`  
**Tiempo**: ~2-5 minutos  
**Propósito**: Probar comandos reales en proyectos reales

| Archivo                         | Para qué sirve                                |
| ------------------------------- | --------------------------------------------- |
| `cli-commands.test.js`          | 🚀 Ejecuta comandos CLI reales en test-project |
| `configuration-options.test.js` | ⚙️ Prueba diferentes configuraciones           |
| `test-real-usage.js`            | 🌍 Escenarios de uso real                      |

---

## 📊 Estado Actual

### ✅ Migración de Helpers Completa
- **381 funciones** migradas correctamente
- **14 módulos** helpers organizados
- **0 duplicados** (limpiados durante migración)
- **100% de coverage** de funciones

### 📈 Resultados de Tests
- **Unit Tests**: 8/8 ✅ pasando
- **Integration Tests**: 4/4 ✅ pasando  
- **E2E Tests**: 3/3 ✅ pasando
- **Total**: 15/15 ✅ **Todos los tests pasando**

---

## 🔧 Tests Más Útiles para Desarrollo

### Validación Rápida (Durante desarrollo):
```bash
npm run test:unit
```

### Verificar Helpers Específicos:
```bash
npm run test:helpers
```

### Contar Funciones por Módulo:
```bash
npm run test:count
```

### Probar CLI en Proyecto Real:
```bash
npm run test:e2e
```

---

## 💡 Tips Rápidos

1. **Para desarrollo diario**: Usa `npm run test:unit` (son rápidos)
2. **Antes de commit**: Ejecuta `npm test` (todos los tests)
3. **Para debugging**: Ejecuta archivos individuales con `node`
4. **Si algo falla**: Revisa el log completo con `2>&1 | tee output.log`

---

## 🆘 Solución de Problemas

### Error común: "Cannot find module"
```bash
# Verifica que estás en la raíz del proyecto
cd /Users/cesar/Developer/openSource/purgeTSS
node tests/run-tests.js unit
```

### Tests lentos o que no terminan
```bash
# Ejecuta solo un archivo específico
node tests/unit/shared/helpers.test.js
```

### Ver output completo
```bash
npm run test:unit 2>&1 | tee test-results.log
```

---

*📅 Última actualización: Diciembre 2024*  
*🎯 Estado: Todos los tests funcionando correctamente*  
*📊 Funciones validadas: 381 helpers + funcionalidad core*
