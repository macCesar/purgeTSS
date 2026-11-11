**Sí, podemos crear una versión de PurgeTSS en Rust que conserve todas sus funcionalidades actuales.** No encontré ninguna capacidad del proyecto que lo impida. Pero hay una distinción decisiva: **reescribir el CLI en Rust es viable; eliminar absolutamente todo el JavaScript manteniendo compatibilidad total sería otro proyecto mucho mayor.**

Revisé la versión **7.18.0**, los comandos, las rutas de ejecución del purgado, los generadores, las plantillas de módulos y la estructura de pruebas. Mi evaluación es de viabilidad técnica; la equivalencia completa tendría que demostrarse durante la implementación.

**PurgeTSS hace bastante más que eliminar clases sin usar.** Este es el alcance que habría que conservar:

| Área                                     | Funcionalidades que debe mantener la versión Rust                                                                                                              | Dificultad                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Purgado principal                        | Lectura de XML y controladores, modos de extracción, widgets, vistas de temas, safelist, validación y reporte de clases desconocidas                           | Alta                             |
| Generación de estilos                    | Propiedades Titanium, escalas, colores, reglas personalizadas, `theme` y `theme.extend`, `apply`, resets, grid, gradientes, sombras y propiedades de animación | Alta                             |
| Sintaxis de clases                       | Valores arbitrarios, negativos, unidades, opacidad, modificadores de plataforma/dispositivo combinados y estados de animación                                  | Alta                             |
| Archivos generados                       | `app.tss`, respaldo `_app.tss`, `utilities.tss`, definiciones para IntelliSense y glosario                                                                     | Media                            |
| `init`, `create`, `install-dependencies` | Configuración inicial, creación de proyectos, plantillas, instalación de dependencias y configuración del editor                                               | Media                            |
| `watch`                                  | Instalación, actualización, desactivación y eliminación del hook de Alloy, con ejecución síncrona/asíncrona y propagación de errores                           | Media                            |
| `icon-library`                           | Font Awesome, Material Icons, Material Symbols y Framework7; aliases, fuentes, módulos y estilos; variantes Pro/Beta donde corresponde                         | Media                            |
| `build-fonts`                            | Lectura TTF/OTF, nombres PostScript, análisis de CSS, Unicode, clases y módulos de familias/iconos                                                             | Media                            |
| `shades`, `semantic`, `color-module`     | Paletas, nombres de colores, Light/Dark, alpha, formatos de salida, actualización de configuración y módulos CommonJS                                          | Media-alta                       |
| `images`                                 | Densidades Android/iOS, formatos, calidad, dimensiones, transparencia, padding, rutas alternativas y configuración por archivo                                 | Alta                             |
| Pipeline automático SVG                  | Extracción desde XML/JS, dimensiones derivadas del TSS, generación PNG, caché y sincronización de `images.files`                                               | Alta                             |
| `brand`                                  | Iconos, Dark/Tinted, adaptive/monochrome, splash, LaunchLogo, artwork de tiendas, notificaciones, geometría, optimización y limpieza de archivos antiguos      | Alta                             |
| `module`                                 | Distribución de `purgetss.ui.js` con animaciones, arrastre, colisiones, transiciones, apariencia, información del dispositivo y captura de componentes         | Baja si conservamos el módulo JS |
| Compatibilidad y mantenimiento           | Alloy/Classic, destinos de `tiapp.xml`, migraciones de configuración, confirmaciones, dry-run, aliases, ayuda, diagnósticos, avisos y actualización del CLI    | Media                            |

Esta superficie está definida en [el CLI](/Users/cesar/Developer/openSource/purgeTSS/bin/purgetss:1). El flujo principal puede seguirse desde [purgeClasses()](/Users/cesar/Developer/openSource/purgeTSS/src/cli/commands/purge.js:672).

Hay un detalle que conviene registrar correctamente: `nine-patch` figura como opción, pero actualmente **avisa que no está implementado**. Conservar la funcionalidad actual significa conservar ese comportamiento; implementarlo sería una mejora adicional.

**Los tres puntos que requieren más cuidado son estos.**

**1. `config.cjs` es un programa JavaScript.**

Actualmente PurgeTSS carga la configuración mediante `require()`, como muestra [getConfigFile()](/Users/cesar/Developer/openSource/purgeTSS/src/shared/config-manager.js:127). Por tanto, una configuración puede calcular valores, consultar variables de entorno o importar otros archivos y paquetes.

Cambiarla directamente a JSON o TOML rompería configuraciones existentes.

Tenemos tres caminos:

| Enfoque                                                   | Compatibilidad                                               | Consecuencia                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| Rust con un pequeño puente Node para evaluar `config.cjs` | El camino más seguro para conservar el comportamiento actual | Permanece una dependencia limitada de Node                           |
| Rust con motor JavaScript integrado                       | Puede cubrir configuraciones autocontenidas                  | Hay que implementar el entorno y la resolución de módulos necesarios |
| Configuración declarativa nueva                           | Simplifica el CLI independiente                              | Requiere migración y deja de ser un reemplazo transparente           |

Un motor como [QuickJS](https://www.bellard.org/quickjs/quickjs.html) permite ejecutar JavaScript embebido, pero integrarlo **no reproduce automáticamente el entorno de Node ni sus paquetes**.

Además, no sólo leemos configuración: también la modificamos. Hay que preservar las reglas actuales para migraciones, comentarios y secciones ajenas al cambio. Esa responsabilidad ya existe en [config-writer.js](/Users/cesar/Developer/openSource/purgeTSS/src/shared/config-writer.js:1).

**Para una primera versión con compatibilidad completa, conservaría el puente Node.** Después podríamos añadir una configuración declarativa opcional que permita ejecutar ciertos proyectos sin él.

**2. El código que corre dentro de Titanium debe seguir siendo compatible con Titanium.**

`purgetss.ui.js` utiliza directamente `Ti.UI`, eventos táctiles, matrices, propiedades persistentes y APIs de archivos y medios. Incluye los 15 métodos de animación y manipulación de vistas, además de `Appearance`, `deviceInfo()` y `saveComponent()`. Está en [la plantilla del módulo](/Users/cesar/Developer/openSource/purgeTSS/lib/templates/purgetss.ui.js.cjs:4).

Un CLI escrito en Rust puede **distribuir exactamente ese mismo JavaScript**, igual que puede escribir TSS, XML o JSON.

Así conservaríamos todas las funcionalidades sin alterar las apps existentes. Reescribir también ese módulo en Rust exigiría integraciones nativas para las plataformas y una interfaz accesible desde Titanium. Técnicamente se puede investigar, pero no hace falta para portar PurgeTSS y añade bastante mantenimiento.

Lo mismo aplica a los módulos generados de colores, fuentes e iconos: Rust puede generarlos conservando su API CommonJS.

**3. Imágenes y colores requieren equivalencia, no sólo bibliotecas parecidas.**

Para XML, análisis JavaScript, fuentes y SVG existen componentes adecuados: [quick-xml](https://docs.rs/quick-xml/latest/quick_xml/), [Oxc](https://oxc.rs/docs/guide/usage/parser), [ttf-parser](https://docs.rs/ttf-parser/latest/ttf_parser/) y [resvg](https://docs.rs/resvg/latest/resvg/). Su existencia facilita el port, pero no garantiza que sus resultados coincidan con los actuales.

Por ejemplo:

- Dos rasterizadores SVG pueden producir bordes, texto o transparencias ligeramente diferentes.
- Otro codificador PNG puede generar archivos distintos con los mismos píxeles.
- Otra implementación de color puede cambiar redondeos y seleccionar una familia de referencia diferente.

El generador de paletas actual combina distancia de color, luminosidad, ajustes HSL y nombres mediante `chroma-js` y `ntcjs`; no es una interpolación genérica. Puede verse en [generateColorShades()](/Users/cesar/Developer/openSource/purgeTSS/lib/color-shades/generateColorShades.js:7).

Para reducir regresiones, inicialmente consideraría **mantener libvips mediante una integración nativa** y portar primero la lógica que decide tamaños, destinos y transformaciones.

**Sobre velocidad: sí hay oportunidades, pero no prometería multiplicadores sin medir.**

Los candidatos más claros son el arranque del CLI, extracción y análisis de archivos, resolución de clases y generación de estilos. Encontré, por ejemplo, recorridos de utilidades con búsquedas repetidas mediante `indexOf()` en [purgeTailwind()](/Users/cesar/Developer/openSource/purgeTSS/src/core/purger/tailwind-purger.js:48). Un índice de clases permitiría evitar muchas búsquedas lineales.

Ese beneficio combina **cambios de algoritmo y lenguaje**. Parte también podría obtenerse optimizando el JavaScript actual.

En imágenes, el margen es menos evidente: Sharp ya delega el trabajo pesado a **libvips nativo**, con concurrencia interna. Cambiar el lenguaje que organiza esas operaciones no garantiza una gran aceleración. [Documentación de Sharp](https://sharp.pixelplumbing.com/performance/).

También hay operaciones dominadas por herramientas externas: crear un proyecto Titanium o instalar paquetes seguirá dependiendo del tiempo de esos comandos.

**Sobre tamaño: hay que separar el CLI de las apps generadas.**

Medí en este checkout:

- Las fuentes distribuidas ocupan aproximadamente **24,1 MiB**.
- `dist/utilities.tss` ocupa aproximadamente **1,39 MiB**.
- El módulo distribuido `purgetss.ui.js` ocupa aproximadamente **31,5 KiB**.

Rust podría reducir dependencias y archivos de la instalación del CLI. El tamaño final dependerá de los motores de imagen, codecs, recursos incluidos y estrategia de enlace.

Pero **las fuentes seguirán pesando lo mismo si distribuimos las mismas fuentes**. Y las apps Titanium no se harán automáticamente más pequeñas o rápidas: si reciben el mismo TSS, JavaScript e imágenes, el cambio de lenguaje del generador no modifica esos resultados.

Un CLI Rust tampoco elimina Node de todo el entorno de desarrollo: los flujos actuales invocan Titanium, Alloy y npm.

**Mi recomendación es construir un reemplazo compatible por etapas.**

1. **Fijar el contrato actual:** comandos, aliases, opciones, salidas, códigos de error, rutas y cambios sobre archivos.
2. **Crear pruebas comparativas:** ejecutar ambas versiones sobre copias idénticas de proyectos Alloy y Classic y comparar resultados.
3. **Portar primero el núcleo de estilos:** configuración, extracción, construcción y purgado. Medir arranque, tiempo y memoria.
4. **Incorporar colores, fuentes, imágenes y branding**, conservando inicialmente los módulos JavaScript entregados a Titanium.
5. **Completar distribución y actualización** para cada sistema y arquitectura soportados.

Las pruebas existentes sirven de base, pero habría que complementarlas: muchas comprueban funciones internas de JavaScript y no pueden validar directamente un ejecutable Rust. Para TSS habría que verificar propiedades, condiciones y precedencia; para imágenes, dimensiones, alpha y píxeles; para módulos, exports y comportamiento.

**Yo sí veo viable un “PurgeTSS en Rust” con todas las capacidades actuales, y empezaría por un núcleo Rust con compatibilidad JavaScript preservada.** El primer hito debería demostrar dos cosas: resultados equivalentes y una mejora medible en proyectos reales. Eso nos daría evidencia para decidir cuánto conviene migrar después.

No modifiqué archivos del proyecto ni ejecuté la suite: esta revisión fue de arquitectura y viabilidad. Como referencias de la habilidad PurgeTSS consulté `cli-commands.md` y `classic-projects.md`.
