# Optimización por etapas — implementación y verificación

Fecha: 2026-11-11. Versión conservada: **7.18.0**. Referencia de código: `c5f735ad3387a028f8c21627eaf433085e9d283f` (HEAD previo a la implementación, fijado para futuras comparaciones). La implementación quedó inicialmente sin commits según el plan; después César autorizó expresamente los commits semánticos y el cierre documental, registrados en [status.md](status.md). No se hicieron worktrees, instalaciones globales, cambios de versión, push ni publicación en npm. `docs/rust-port.md`, que ya estaba sin rastrear, se conservó fuera de los commits.

Autoría de la sesión: Codex, familia GPT-6; el identificador exacto del modelo no está expuesto.

## Alcance de las cinco etapas

| Etapa | Hallazgos | Implementación y prueba |
| --- | --- | --- |
| 1. Pruebas y medición | F-09, F-10 | Códigos de salida efectivos para categorías, archivos, descubrimiento y comprobaciones agregadas; los archivos esperados del e2e también deciden su éxito. Temporizadores independientes con `performance.now()`. Perfil JSON global, aliases, `--all`, errores controlados, destinos no escribibles y omisiones LiveView. |
| 2. Lectura y análisis | F-01 | Contexto explícito por purgado con rutas, textos, XML, AST, fallos de parseo y extracciones. Se comparte entre extracción, diagnóstico y SVG y se libera en `finally`. Las listas de class/id y clases faltantes siguen diferenciadas. Se conservan Acorn, entidades, validación XML y fallback regex. |
| 3. Resolución y build | F-02, F-03, F-04, F-05 | Ruta lineal hasta 32 candidatos e índices para listas mayores, sin cambiar recorrido, duplicados ni primeras coincidencias. Selectores escapados conservan la búsqueda original. `apply` indexa selectores exactos, conserva prefijos/opacidad y consulta posiciones actualizadas; lee fuentes sólo cuando las necesita. Las clases faltantes usan Aho–Corasick UTF-16 y extracciones compartidas. El catálogo completo, las definiciones y el glosario se conservan. |
| 4. Configuración y arranque | F-06, F-07, F-08, F-13, F-15 | Imports diferidos, ayuda/versión sin evaluar config, configuración evaluada por invocación y clonada, nombres/descriptores invariantes precalculados, limpieza de apply y estado temporal incluso en errores. Firma de configuración efectiva y fuentes/tablas del generador; metadatos menores de 4 KiB y reconstrucción conservadora para valores no representables. Escrituras de texto derivado sólo si cambian bytes. Node/CI alineados y paquete npm `path` retirado. |
| 5. Generadores y dependencias | F-11, F-12, F-14 | CSS/codepoints compartidos entre TSS y JS, incluido Pro/Beta; orquestador único en el orden existente y copias esperadas. Metadatos/entradas/renders de imágenes compartidos por imagen y cola de hasta dos trabajos que deja de iniciar tareas al fallar. Conversiones de colores reutilizadas sin mutar paletas, conservando desempates, operaciones y UUID nuevos. Copias/borrados de creación e instalación mediante Node. Actualizaciones compatibles probadas y avisos incompatibles documentados abajo. |
| Condición preservada | F-16 | Se conserva el candado de dos segundos y la escritura de `app.tss` en cada purgado completado para renovar su mtime. No se aplica write-if-changed a ese archivo. |

La etapa de medición es una base de observabilidad y corrección: no se le atribuye una aceleración aislada. Las medidas de lecturas/parseos corresponden al análisis compartido; la fixture de 200 apply mide resolución/generación; versión mide arranque; imágenes y colores tienen experimentos propios. Las cifras del purgado combinan las mejoras que se ejecutan juntas, sin atribuir todo el ahorro a una función individual.

## Purgado directo: resultados

Cada variante tiene una ejecución inicial separada y cinco muestras posteriores, con orden alternado. Se usó Node 22.23.2, un proceso nuevo por llamada, el mismo preload de medición y `NO_UPDATE_NOTIFIER=1` en ambos brazos. El loader sustituye los módulos modificados por su fuente de la revisión auditada para la referencia; no modifica las fuentes ni copia/checkoutea los proyectos. Ambas variantes usan las dependencias instaladas; la comparación entre versiones de Sharp se hizo por separado.

Se esperó de forma natural a superar el candado, sin envejecer `app.tss`. Las muestras omitidas se midieron por separado. Los tiempos de la tabla son medianas de tiempo total de proceso, en milisegundos.

| Proyecto | Referencia ms | Implementación ms | Reducción | Archivos comparados |
| --- | ---: | ---: | ---: | ---: |
| notiGAPE | 1140.2 | 471.9 | 58.6% | 81 |
| LM - Generador de Tablas | 680.5 | 448.8 | 34.1% | 442 |
| EM Industrial | 1591.3 | 547.1 | 65.6% | 107 |
| Fixture mínima | 480.3 | 388.4 | 19.1% | 6 |

Los archivos iniciales y posteriores coincidieron byte por byte. Sólo se excluyeron de esta comparación los nuevos metadatos `generator-signature.json`, cuyo contrato se prueba por separado; la caché SVG existente sí está incluida. Los JSON guardan todas las muestras, CPU (`user`/`system`, microsegundos), pico RSS, lecturas/escrituras, tiempo total y tiempo dentro del proceso Node entre el preload y la salida. Ese tiempo interno incluye imports; no se presenta como tiempo exclusivo del núcleo de purgado.

| Proyecto | Lecturas instrumentadas | Parseos XML | Parseos JS |
| --- | ---: | ---: | ---: |
| notiGAPE | 920 → 468 | 280 → 70 | 168 → 54 |
| LM - Generador de Tablas | 600 → 360 | 40 → 10 | 30 → 10 |
| EM Industrial | 1242 → 574 | 792 → 198 | 108 → 36 |
| Fixture mínima | 540 → 337 | 4 → 1 | 0 → 0 |

| Proyecto | CPU referencia ms | CPU implementación ms | RSS ref. MiB | RSS impl. MiB |
| --- | ---: | ---: | ---: | ---: |
| notiGAPE | 1395.2 | 686.7 | 163.4 | 159.3 |
| LM - Generador de Tablas | 915.9 | 600.9 | 163.8 | 158.0 |
| EM Industrial | 1926.6 | 830.4 | 165.4 | 167.1 |
| Fixture mínima | 565.8 | 455.4 | 153.1 | 143.5 |

Las lecturas incluyen arranque y firmas, además de fuentes de la app. Los purgados posteriores escriben `app.tss` una vez. Las llamadas omitidas por LiveView registraron cero parseos XML/JS y cero escrituras.

**Coste inicial explícito:** la fixture mínima existente sin firma pasó de 398.3 a 481.2 ms en la primera llamada optimizada: requiere reconstruir el catálogo para establecer una firma fiable. Después, su mediana pasó de 480.3 a 388.4 ms (mejora del 19.1%, por lo que no hay regresión mediana superior al 5%). No se usa una fecha antigua como prueba de validez para evitar este coste único. Una inicialización hecha con el nuevo generador ya escribe su firma. Las primeras llamadas y sus mayores picos RSS están guardadas separadamente de las medianas posteriores.

## Mediciones específicas

- **Arranque (`--version`):** 333.2 → 188.6 ms de mediana. RSS mediano: 147.7 → 104.1 MB decimales. Se verificó además que ayuda y versión no ejecutan una configuración con efectos laterales/errores.
- **Build con 200 directivas apply:** 709.4 → 332.4 ms de mediana, con los archivos generados iguales. RSS mediano: 185.8 → 165.2 MB decimales. Sigue siendo una generación completa, no un catálogo recortado.
- **Colores, 100 paletas por muestra:** 48.2 → 30.7 ms. Se conservaron resultados diferenciales, UUID nuevos, entradas de tipo color y selección de la última coincidencia en empates. El benchmark conserva la tabla de entrada y alterna orden; no se cachea la paleta generada ni los UUID.
- **Imágenes, base 512 dp, codecs iniciales:** 1145.6 → 794.9 ms al compartir entradas/renders en serie → 618.2 ms con dos trabajos. Pico RSS mediano: 229.8 → 264.8 MB decimales para la ruta de dos trabajos.
- **Imágenes al máximo de 1024 dp:** 3182.8 → 2181.6 → 1697.5 ms (referencia/compartido serie/dos trabajos). RSS mediano: 459.8 → 496.7 MB decimales al pasar de referencia a dos trabajos. La aceptación comprobó el **máximo de las cinco muestras y la llamada inicial**, además de registrar las medianas: no superó el 20% sobre la referencia. También se midieron 128 dp.
- **Todos los codecs, comparación adicional entre dependencias:** PNG desde SVG y raster, WebP, JPEG, AVIF, TIFF y GIF: **56/56 archivos** con bytes, píxeles decodificados, dimensiones y alpha iguales. Se comparó el código previo con Sharp **0.35.3 / libvips 8.18.3** instalado temporalmente contra la implementación con **0.35.5 / libvips 8.18.7**. La referencia temporal se eliminó. La cola también pasó el límite de memoria en esta fixture de 32 dp; no sustituye la medida de máxima resolución anterior.

La concurrencia queda limitada a dos, mantiene el orden de resultados y espera los trabajos ya iniciados antes de propagar el primer error. Un test de fallo de render comprueba que no se inicia el resto de la cola. Se mantienen codecs, supersampling, opciones de compresión y cuantización optativa; ninguna mejora procede de reducir calidad.

El build de distribución terminó mediante sus scripts. Los cuatro módulos de iconos conservaron bytes, nombres de exports, familias y Unicode: Font Awesome 2606 iconos, Material Icons 2276, Material Symbols 3021 y Framework7 1252. `dist/` y los assets no tienen diferencias de contenido contra la revisión auditada; no se editaron a mano.

## Dependencias

`npm audit` pasó de **12 a 5 paquetes afectados**. Se actualizaron dentro de rangos compatibles Sharp y sus binarios/libvips, `@humanfs/node`, `brace-expansion`, `js-yaml`, `postcss-selector-parser`, `source-map-js` y `sucrase` (más sus cambios transitivos). Se retiró `path` y sus dependencias exclusivas: los usos existentes resuelven el módulo nativo de Node. Tailwind permanece en 3.x; Acorn, xml-js y los parsers utilizados por PurgeTSS no se sustituyeron.

Permanecen estos avisos del árbol instalado:

| Paquete | Severidad | Motivo de no aplicar automáticamente la propuesta de npm |
| --- | --- | --- |
| `css` | Alta | npm propone bajar de 3.x a 2.2.1; es un cambio mayor/incompatible de parser y no pertenece a esta optimización. |
| `source-map-resolve` | Alta | Cadena transitiva de `css`; el arreglo propuesto requiere el mismo cambio incompatible. |
| `decode-uri-component` | Alta | Dependencia transitiva de la misma cadena con rango que no admite la corrección actual. No se fuerza un override fuera de rango. |
| `glob` | Moderada | npm propone 14.0.4, un cambio mayor desde 13.x. Requiere revisión específica de rutas, orden y compatibilidad. |
| `minimatch` | Moderada | La corrección propuesta para esta rama llega mediante el mismo salto mayor de glob. |

En PurgeTSS las llamadas a CSS usan parsing, no generación de sourcemaps; las llamadas a glob no proporcionan AbortSignal. Esto contextualiza los avisos, pero no los declara resueltos ni sustituye su revisión en una actualización separada. No se ejecutó `audit fix --force`.

El rango soportado se alineó con las dependencias reales: `^20.12.0 || ^22.13.0 || >=23.5.0`. Se añadió una matriz de CI para 20.12.0, 22.13.0 y 24. Se conserva Node 20.12, admitido por la intersección de los engines de Commander, Sharp, Inquirer y glob; no se exige Node 22 sin necesidad. La ejecución local de esta entrega fue con 22.23.2; la matriz remota no se ejecutó porque no se hizo push.

## Verificación y revisiones

- Suite completa: **43/43 archivos unitarios, 7/7 de integración y 6/6 e2e**. Al hacer efectivos los fallos se detectaron y corrigieron tanto agregaciones incorrectas como una prueba e2e que contaba éxito aun con archivos faltantes. La fixture espera naturalmente el candado antes del primer purgado; no se modifica su regla.
- Regresiones específicas: temporizadores anidados, perfil fallido/no escribible, aliases y callbacks asíncronos; `--all` con fuentes vacías y purgado omitido; opciones repetidas y `--`; XML/entidades, AST/fallback, extracción y falta de clases; UTF-16 con subcadenas/surrogates; umbral 32, duplicados y selectores escapados; apply encadenado y precedencias; cambios de config en el mismo segundo, entorno, symlinks/redirección de destino, builds repetidos, mtime de derivados y restauración de estado al fallar; render compartido y detención de cola; paletas/UUID/desempates.
- Las pruebas existentes conservan cobertura de modificadores combinados, estados, arbitrarios, negativos, unidades, opacidad semántica, fuentes, widgets/temas y opciones de configuración.
- ESLint en JS/MJS modificados y nuevos. El entry point sin extensión se verificó por stdin como JS, con la excepción de `n/no-process-exit` propia de una CLI. `node --check bin/purgetss`, build de distribución, exports de módulos, `npm pack --dry-run --json`, YAML de CI y `git diff --check`.
- Una revisión independiente encontró regresiones de CRLF, selectores escapados, errores de imports diferidos y perfiles asíncronos, además del estado temporal tras errores. Se corrigieron con pruebas que fallaron primero y pasaron después. La revisión de esas correcciones no encontró otro problema importante; se extendió después la prueba de configuración para cubrir la redirección de symlinks.
- Los tres proyectos reales terminaron con su estado Git previo. Los archivos protegidos se restauraron individualmente en `finally` (bytes y tiempos de acceso/modificación); no se hizo una restauración general de Git. Se eliminaron los temporales de benchmarks y la instalación local de referencia.
- En el cierre se fijó la referencia diferencial para que los commits no la alteren. Pasaron la prueba de equivalencia de colores con fixtures originales congeladas y la prueba de fallos del runner. Un smoke de arranque después de los ocho commits de código/pruebas confirmó la revisión auditada, las llamadas iniciales, cinco muestras alternadas por variante y bytes equivalentes. No reemplaza las mediciones anteriores ni se repitieron las suites completas o los benchmarks de proyectos reales por el mero hecho de hacer commits. El lint de estas referencias no tuvo errores; quedó un aviso de estilo de importación en la copia congelada del código original.
- La comprobación de sólo lectura del cierre encontró limpios notiGAPE y Generador de Tablas. EM Industrial tenía una firma nueva sin seguimiento y `app.tss` renovado a las 12:18, después del archivo de validación finalizado a las 12:14 y antes de esta sesión de commits. Se conservó esa actividad posterior; no se eliminó como residuo de las pruebas.

Las mediciones son de estas fixtures y esta Mac; no se extrapolan como un porcentaje garantizado a cualquier proyecto. Se registran el coste inicial y las condiciones de medición para que la comparación pueda repetirse.

## Evidencias y reproducción

Evidencias pequeñas en `/Users/cesar/Developer/validation-evidence/purgeTSS/`:

- `implementation-final-benchmark.json`: proyectos reales, fixture mínima, primeras llamadas, cinco muestras y omisiones.
- `implementation-startup.json`, `implementation-build.json`, `implementation-colors.json`.
- `implementation-images.json`, `implementation-images-512.json`, `implementation-images-1024.json`, `implementation-images-updated.json`, `implementation-all-codecs.json`.
- `implementation-validation.tar.gz`: logs de validación y auditorías de dependencias de esta entrega.
- `implementation-commit-startup-smoke.json`, `implementation-commit-validation.json`: comprobación de la referencia fija después de los commits y validaciones específicas del cierre.

```sh
node tests/performance/benchmark.mjs /tmp/purge-results.json   '/Users/cesar/Developer/Apps/notiGAPE'   '/Users/cesar/Developer/Apps/LM - Generador de Tablas'   '/Users/cesar/Developer/Apps/EM Industrial'
PURGETSS_BENCH_COMMAND='["--version"]' node tests/performance/benchmark.mjs /tmp/startup-results.json
PURGETSS_BENCH_COMMAND='["build"]' PURGETSS_BENCH_STRESS=1 node tests/performance/benchmark.mjs /tmp/build-results.json
node tests/performance/color-benchmark.mjs /tmp/color-results.json
node tests/performance/images-benchmark.mjs /tmp/image-results.json 512
node tests/performance/images-benchmark.mjs /tmp/all-codecs-results.json 32 all
```

Los benchmarks de fuentes e imágenes usan por defecto `c5f735ad3387a028f8c21627eaf433085e9d283f`, no el HEAD cambiante. Esa revisión debe estar disponible en el historial; `PURGETSS_BENCH_BASELINE=<revisión>` permite elegir otra explícitamente y el JSON registra la referencia utilizada. Sólo se sustituyen archivos modificados que existían en esa revisión. La prueba unitaria y el benchmark de colores importan las implementaciones originales congeladas en `tests/fixtures/color-shades/` y no necesitan historial Git, incluido un checkout superficial de CI.

Para comparar además dos versiones de Sharp, `PURGETSS_BENCH_BASE_SHARP` puede apuntar al URL `file:` de la entrada de una instalación local temporal de la versión de referencia. El driver la usa sólo en el brazo baseline. Sin esa variable, ambos brazos utilizan las dependencias instaladas.

No quedan tareas de implementación de estas etapas abiertas. Los cinco avisos que requieren cambios incompatibles quedan expresamente fuera de esta entrega; tampoco se realizó una publicación automática.

## Conservación de documentación

No se condensaron capacidades, ejemplos ni requisitos vigentes. Se corrigió la afirmación general de Node 20+ con el rango real compatible, las referencias a HEAD como baseline y el estado sin commits tras la autorización de cierre; el estado anterior se conservó completo como registro histórico. No se eliminó documentación vigente ni el archivo previo `docs/rust-port.md`.
