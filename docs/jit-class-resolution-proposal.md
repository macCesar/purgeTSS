# JIT Class Resolution — Propuesta de Refactor

**Estado:** propuesta general · no es un plan de implementación · pendiente de discusión y aprobación.
**Audiencia:** maintainer (Cesar) + futuras sesiones con AI assistant.
**Fecha de la conversación inicial:** 2026-05-14.

---

## 1. Propósito

PurgeTSS hoy opera en dos pasos: (1) `build` pre-genera el archivo maestro `dist/utilities.tss` con **TODAS** las clases posibles a partir de `config.cjs`, y (2) `purge` recorre ese archivo línea por línea, queda solo con las que aparecen en las vistas/controllers, y las concatena en `app.tss`.

El archivo maestro hoy mide **25,803 líneas**. Cualquier cambio en `config.cjs` lo regenera completo, aunque el usuario use menos del 1% de esas clases.

La idea de este refactor es **migrar al modelo JIT (Just-In-Time)**: en lugar de pre-generar el universo completo y filtrarlo, sintetizar la definición de cada clase **únicamente cuando aparezca en el código del proyecto**.

El resultado deseado: `dist/utilities.tss` se vuelve innecesario (o vestigial, solo para clases que no son algorítmicas), `build` se simplifica o desaparece para esas categorías, y `purge` se vuelve más declarativo (toma el nombre de la clase, devuelve su definición).

---

## 2. JIT NO es una idea nueva en PurgeTSS — ya existe parcialmente

El patrón JIT está **funcionando en producción hoy mismo**, solo que está limitado a las clases con valores arbitrarios entre paréntesis.

Cuando una vista/controller usa `w-(300)`, `top-(-10)`, `bg-(#FF6B00)`, `text-(#abc)`, etc., esas clases **no existen en `utilities.tss`**. Se sintetizan en tiempo de purge llamando a `helpers.formatArbitraryValues` desde `src/core/purger/tailwind-purger.js:75-77`:

```js
} else if (cleanClassName.includes('(')) {
  const line = helpers.formatArbitraryValues(cleanClassName, true)
  if (line) arbitraryValues += helpers.checkPlatformAndDevice(line, className)
}
```

Este branch del dispatcher es **el modelo del JIT completo**. La propuesta es extender el mismo patrón a las clases con valores pre-definidos (colors, spacing, fontSize, etc.).

**Importante:** el JIT actual ya maneja correctamente clases compuestas con modifiers (`open:w-(200)`, `ios:mt-(15)`, `handheld:bg-(#cecece)`). El cleanup del modifier lo hace `cleanClassNameFn` en `tailwind-purger.js:37`, y la reaplicación del modifier al output lo hace `checkPlatformAndDevice` en `helpers/utils.js:769`. Esa infraestructura se hereda gratis para cualquier categoría que se migre a JIT.

---

## 3. Lo que ya existe en el codebase (infraestructura reusable)

### 3.1 La tabla de property templates: `arbitraryValuesTable`

**Archivo:** `src/shared/helpers/utils.js:1052`.

Es un objeto que mapea **prefijo de clase → template de propiedades de Titanium**. Cubre ~150 prefijos divididos en tres bloques (Spacing, Color, Misc). Ejemplos:

```js
const arbitraryValuesTable = {
  // Spacing / dimensiones
  w: 'width: {value}',
  h: 'height: {value}',
  wh: 'width: {value}, height: {value}',
  m: 'top: {value}, right: {value}, bottom: {value}, left: {value}',
  mt: 'top: {value}',
  rounded: 'borderRadius: {value}',
  'rounded-bl': 'borderRadius: [0, 0, 0, {value}]',

  // Color
  bg: 'backgroundColor: {value}',
  'text-color': 'color: {value}, textColor: {value}',  // ← dual-property de Titanium
  'bg-from': 'backgroundGradient: { colors: [ {value1}, {value} ] }', // ← gradiente
  'border-color': 'borderColor: {value}',
  'hint-text': 'hintTextColor: {value}',
  // ... ~30+ entries de color

  // Misc
  opacity: 'opacity: {value}',
  delay: 'delay: {value}',
  // ...
}
```

**Esta tabla es la fuente de verdad de "cómo se mapea cada prefijo de clase a propiedades de Titanium".** Cubre las particularidades específicas (dual-property `text-color`, gradientes composicionales, dimensiones compuestas). Cualquier categoría que se migre a JIT consume las mismas entries.

### 3.2 El dispatcher del purger

**Archivo:** `src/core/purger/tailwind-purger.js`, función `purgeTailwind` línea 48.

Recibe `uniqueClasses` (las clases extraídas de XMLs/Controllers) y emite el TSS resultante. Dentro tiene el if/else que dispatcha:

```js
uniqueClasses.forEach((className, index) => {
  const cleanClassName = cleanClassNameFn(className)

  if (cleanClassName.indexOf(':') !== -1) {
    // modifiers compuestos (no procesados como JIT hoy)
  } else if (cleanClassName.includes('(')) {
    // JIT arbitrary values (ya funciona)
    const line = helpers.formatArbitraryValues(cleanClassName, true)
    if (line) arbitraryValues += helpers.checkPlatformAndDevice(line, className)
  } else if (helpers.checkColorClasses(cleanClassName)) {
    // opacity modifier path (bg-red-500/65), distinto a JIT general
    // ...
  } else {
    cleanUniqueClasses.push(className)  // ← falls back a lookup en utilities.tss
  }
})
```

**El branch `cleanUniqueClasses.push(className)` es lo que JIT eventualmente vaciará**. Cada categoría migrada agrega un `else if` antes de ese fallback.

### 3.3 La data source: `combineDefaultThemeWithConfigFile`

**Archivo:** `src/core/builders/auto-utilities-builder.js:487`.

Combina los defaults oficiales de Tailwind (`tailwindcss/colors`, `tailwindcss/defaultTheme`) con la configuración del usuario, aplicando la precedencia estándar:

- `theme.X` → reemplaza el default
- `theme.extend.X` → se mergea con el default
- Custom user values siempre ganan

Devuelve un objeto `base` con todas las paletas/tablas listas: `base.colors`, `base.spacing`, `base.width`, `base.height`, `base.fontSize`, `base.fontWeight`, `base.opacity`, `base.zIndex`, `base.borderWidth`, `base.borderRadius`, etc.

**Hoy se llama una vez al inicio de `autoBuildUtilitiesTSS`** y se itera para generar todas las líneas. Para JIT, se puede cachear el resultado y consultarlo bajo demanda — los datos en sí son los mismos.

**Importante:** el merge de defaults + user customs ya está resuelto aquí. Cualquier JIT que se construya encima de `combineDefaultThemeWithConfigFile()` **no duplica esa lógica** — la consume.

### 3.4 El emitter universal: `processProperties`

**Archivo:** `src/shared/helpers/utils.js:29`.

Función que TODOS los helpers de property usan internamente. Su firma:

```js
processProperties(info, selectorAndDeclarationBlock, selectorsAndValues, debug)
```

- `info`: metadata para comentarios (`{ prop: 'backgroundColor', modules: 'Ti.UI...' }`)
- `selectorAndDeclarationBlock`: el mapping prefijo → template, ej. `{ bg: '{ backgroundColor: {value} }' }`
- `selectorsAndValues`: el mapping modifier → valores, ej. `{ default: { red: { 500: '#ef4444', ... }, ... } }`

Walks recursivamente los valores (porque las paletas son objetos anidados: color → shade → hex) y emite las líneas TSS, sustituyendo `{value}` en el template.

**El patrón uniforme:** cada helper de property es una thin wrapper que llama a `processProperties` con su prefijo, su template y los valores que recibe.

### 3.5 Los helpers individuales

**Archivos:** `src/shared/helpers/colors.js` (775 líneas, ~50 funciones), `src/shared/helpers/layout.js` (695 líneas), `src/shared/helpers/typography.js`, `src/shared/helpers/animation.js`, `src/shared/helpers/ui-properties.js`, etc.

Todas siguen exactamente la misma forma. Ejemplo de `backgroundColor` (colors.js:40):

```js
export function backgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundColor',
    modules: 'Ti.UI, Ti.UI.Android.CardView, Ti.UI.Animation, ...'
  }, {
    bg: '{ backgroundColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
```

Otro ejemplo, `backgroundDisabledColor` (colors.js:56):

```js
export function backgroundDisabledColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundDisabledColor - Android Only',
    modules: 'Ti.UI.View'
  }, {
    'bg-disabled': '{ backgroundDisabledColor: {value} }'
  }, {
    android: modifiersAndValues  // ← inyecta el modifier [platform=android]
  })
}
```

**Cada helper aporta tres piezas reusables para el JIT:**
1. Su prefijo (`bg`, `bg-disabled`, ...)
2. Su template (`'{ backgroundColor: {value} }'`)
3. Su modifier por default (`default`, `android`, `ios`, ...)

Hoy esos helpers se invocan desde `processCompoundClasses` (auto-utilities-builder.js:385) con la paleta completa, lo cual genera **todas** sus líneas. Para JIT, los mismos helpers se podrían invocar con un solo `(name, shade)` y devolver solo la línea correspondiente — o un nuevo helper `resolveX(className, base)` que reuse la misma tabla template + la misma `parseValue`.

### 3.6 Otras piezas reusables

- **`parseValue(value, sign)`** (helpers/utils.js:115) — convierte un valor crudo a su forma TSS (`16` → `16`, `'1px'` → `'1px'`, `'Ti.UI.SIZE'` → `Ti.UI.SIZE`, hex con/sin transparencia, etc.).
- **`checkColorClasses(className)`** (helpers/utils.js:1011) — detecta si un className es una clase de color con modifier de opacidad (`bg-red-500/65`). Lista los ~35 prefixes que cuentan como color.
- **`checkPlatformAndDevice(line, className)`** (helpers/utils.js:769) — reaplica los modifiers (`ios:`, `android:`, `handheld:`, etc.) al output. Cualquier JIT lo hereda gratis.
- **`addTransparencyToHex(hex, transparency)`** (helpers/utils.js:990) — aplica alpha hex a un color. Reusable para el path `/65` de opacidad.
- **`tailwindcss/colors`** y **`tailwindcss/defaultTheme`** — los módulos oficiales de Tailwind que PurgeTSS ya importa via `tailwindcss@3` dependency. Son las fuentes byte-exactas de las paletas y tablas de espaciado de TW3.

---

## 4. La propuesta

### 4.1 Resumen

Migrar PurgeTSS de **"pre-generar `utilities.tss` y filtrar"** a **"resolver cada clase usada bajo demanda"**, reusando los componentes existentes:

- Mismo dispatcher (`purgeTailwind`), agregando branches por categoría
- Misma `arbitraryValuesTable` como fuente de templates
- Misma `combineDefaultThemeWithConfigFile` como fuente de datos (cacheada)
- Mismos helpers de property (refactorizados ligeramente para emitir UNA línea en lugar de todas)
- Misma estructura de output en `app.tss`

### 4.2 Migración por fases (no big-bang)

| Fase | Categoría | ROI | Notas |
|---|---|---|---|
| **1** | Colors (default + custom + opacity modifier) | ENORME — probablemente >60% de `utilities.tss` | Empezar aquí. Data source byte-exacto (`tailwindcss/colors`). |
| **2** | Spacing (w, h, m, p, top, etc. + fractions + keywords) | ALTO — segundo en volumen | `parseValue` + `defaultTheme.spacing` |
| **3** | fontSize / fontWeight / fontFamily | MEDIO | Tablas chicas, formula simple |
| **4** | Ti-constant families (soft-input, autocapitalize, text-align, etc.) | BAJO por categoría individual, pero suman | Decisión: ¿JIT con tabla de constantes inline, o quedan en `utilities.tss`? |
| **5** | Element defaults (`Window`, `Label`, `Button` presets) | BAJO | Probablemente conviene mantenerlos pre-generados |
| **6** | Icon fonts (fontawesome, material, etc.) | N/A — ya tienen su propio dispatcher | NO se tocan. Quedan como están en `dist/*.tss`. |

Cada fase es valor entregable por sí sola. Si después de las primeras 2-3 el `utilities.tss` resultante es suficientemente chico que no vale la pena seguir, paras ahí.

### 4.3 Bosquejo: resolver de color (Fase 1)

Pseudo-código de cómo se vería un `resolveColorClass`:

```js
const TW_COLORS = require('tailwindcss/colors')

function resolveColorClass(className, configExtendColors) {
  // 1. Descomponer: bg-red-500, text-blue-700/65, border-emerald-400, etc.
  //    prefix + name [+ shade] [+ /alpha]
  const m = className.match(/^([a-z][\w-]*?)-(\w+)(?:-(\d+))?(?:\/(\d+))?$/)
  if (!m) return null
  const [, prefix, name, shade, alpha] = m

  // 2. Verificar que el prefix sea uno de color
  //    (usar `arbitraryValuesTable[prefix]` + un filtro de "es color")
  const template = arbitraryValuesTable[prefix]
  if (!template || !isColorTemplate(template)) return null

  // 3. Resolver el hex desde TW_COLORS o theme.extend.colors
  const palette = configExtendColors?.[name] ?? TW_COLORS[name]
  if (!palette) return null
  const hex = shade ? palette[shade] : (typeof palette === 'string' ? palette : null)
  if (!hex) return null

  // 4. Aplicar opacity modifier si existe
  //    (reusar `addTransparencyToHex` de helpers/utils.js:990)
  const finalHex = alpha ? applyAlphaToHex(hex, alpha) : hex

  // 5. Substituir {value} en el template, envolver con el selector
  const props = template.replace(/\{value\}/g, `'${finalHex}'`)
  return `'.${className}': { ${props} }`
}
```

Integración en `purgeTailwind`:

```js
} else if (cleanClassName.includes('(')) {
  // JIT arbitrary (ya existe)
  const line = helpers.formatArbitraryValues(cleanClassName, true)
  if (line) arbitraryValues += helpers.checkPlatformAndDevice(line, className)
} else if (isColorClass(cleanClassName)) {
  // JIT color (NUEVO)
  const line = resolveColorClass(cleanClassName, configFile.theme.extend.colors)
  if (line) /* push al output array correspondiente */
} else {
  cleanUniqueClasses.push(className)  // legacy lookup
}
```

**Cantidad de código nuevo estimada:** 30-50 líneas. El resto (templates, parseValue, addTransparencyToHex, dispatcher, modifier handling) ya está.

### 4.4 Co-existencia durante la migración

Cada fase corre **lado a lado** con el lookup tradicional:

1. Implementar el resolver JIT para la categoría
2. Hacer que el dispatcher lo intente PRIMERO; si retorna `null`, cae al lookup en `utilities.tss`
3. Correr golden tests: para cada clase de esa categoría en un proyecto real, JIT y lookup deben producir **byte-by-byte** la misma línea TSS
4. Cuando se confirme match 100%, eliminar las líneas de esa categoría de `utilities.tss` (modificar el builder para no emitirlas)
5. Repetir para la siguiente categoría

Si una clase falla el diff, se queda en lookup hasta que se resuelva. Cero rupturas para el usuario.

---

## 5. Edge cases y consideraciones

### 5.1 Colors

- **Default palette de TW3:** ya está como data en `tailwindcss/colors`. Match byte-exacto garantizado.
- **Custom colors del usuario (`theme.extend.colors.brand = '#5b21b6'`):** dos casos:
  - Si es un hex string → usar `shades(hex)` para generar la escala 50-950
  - Si es un objeto con shades → lookup directo
- **Semantic colors (light/dark):** lookup en `semantic.colors.json`. Ya lo maneja `tryDeriveSemanticOpacityLine` en `tailwind-purger.js:235`.
- **Opacity modifier (`bg-red-500/65`):** algorítmico sobre el hex resuelto. Ya existe la lógica en `tailwind-purger.js:188-220`.
- **Gradients (`bg-from-red-500`, `bg-to-...`, `from-...`):** templates composicionales ya están en `arbitraryValuesTable` (`bg-from`, `from`, `to`, `via`).
- **Dual-property (`text-red-500`):** emite `color` Y `textColor` simultáneamente. Ya está en `arbitraryValuesTable['text-color']`.
- **Deprecated colors (`blueGray`, `lightBlue`, etc.):** `removeDeprecatedColors` en `auto-utilities-builder.js:656` los elimina. El JIT debe hacer lo mismo o reusarla.

### 5.2 Spacing

- **Default scale:** `n × 4` para enteros, half-steps y fractions. Hay keywords (`px`, `auto`, `full`, `screen`, `min`, `max`, `fit`).
- **Custom spacing:** `theme.extend.spacing` mergea con defaults.
- **Algunas clases compuestas emiten múltiples propiedades:** `m-4` → `{top, right, bottom, left}` (4 props), `mx-4` → `{left, right}` (2 props). Los templates de `arbitraryValuesTable` ya saben.

### 5.3 Modifiers y platform/device

- `open:`, `close:`, `complete:`, `drag:`, `drop:`, `bounds:` → animation modifiers
- `ios:`, `android:` → platform modifiers
- `handheld:`, `tablet:` → device modifiers
- `child:`, `children:` → animation child modifiers

Todos se manejan en `cleanClassNameFn` (strip) y `checkPlatformAndDevice` (reapply). JIT los hereda gratis.

### 5.4 Auto-rebuild y cache

Hoy `utilities.tss` se regenera cuando cambia `config.cjs` (line 56-62 de tailwind-purger.js). Con JIT:

- El `base` de `combineDefaultThemeWithConfigFile()` se debería cachear con invalidación por mtime de `config.cjs`
- En cada llamada a `purge`, verificar si el cache está vigente; si no, regenerarlo
- O simpler: regenerar el cache una vez por proceso (purge típicamente corre y termina rápido)

### 5.5 Qué queda en `utilities.tss` (V1)

Después de Fase 1-3, lo que probablemente quede:

- Element defaults (`Window`, `Label`, `Button`, `View`, `ImageView` con sus presets)
- Ti-constant families pequeñas (a menos que también se JIT-een en Fase 4)
- Cosas estructurales raras (gradients direction, layout types, etc.)

Si las Fases 4-5 se completan, `utilities.tss` podría desaparecer por completo o quedar minúsculo. Decisión a tomar cuando lleguemos a ese punto.

### 5.6 Icon fonts

Quedan fuera del scope. Ya tienen sus propios purgers:
- `purgeFontAwesome`, `purgeMaterialIcons`, `purgeMaterialSymbols`, `purgeFramework7` (en `src/core/purger/icon-purger.js`)
- Operan sobre `dist/fontawesome.tss`, `dist/materialicons.tss`, etc.

No requieren JIT porque ya consumen tablas de glifos discretas, no algorítmicas.

---

## 6. Riesgos y unknowns

### 6.1 Lo que no sé con certeza

- **Cuánto del código existente en `auto-utilities-builder.js` se puede REUSAR sin refactor pesado.** Funciones como `helpers.backgroundColor(values)` siguen un patrón uniforme y probablemente se pueden invertir a "una sola línea" con poco trabajo. Otras como `processCompoundClasses` con sus gradient/borderRadius/anchor-point composicionales pueden requerir más cirugía.
- **El bottleneck real de performance hoy.** Si el 80% del tiempo de `purge` se va en scan de views/parse XML, el JIT no mueve la aguja. Vale la pena medir con `purgetss --debug` antes de comprometerse.
- **Si hay comportamientos sutiles que dependen del modelo "todo se genera de antemano".** Por ejemplo, validación cruzada entre clases, ordering effects en la cascada de TSS, o efectos del orden en `app.tss` que asumen que `utilities.tss` es completo.

### 6.2 Riesgos

- **Color drift.** Si en alguna fase el JIT produce un hex diferente del lookup (por bug, por diff en algoritmo, por diff en la versión de `tailwindcss`), los devs verían un cambio de color sutil en sus apps. Mitigación: golden tests por categoría con diff byte-by-byte antes de eliminar las líneas correspondientes de `utilities.tss`.
- **Regresiones en clases compuestas.** Las clases tipo `rounded-bl-2xl` o `m-4` que emiten múltiples propiedades son donde más facilidad hay de equivocarse. Mitigación: golden tests deben cubrir compounds explícitamente.
- **Refactor de helpers existentes.** Si para reusar `backgroundColor()` con un solo valor se requiere reescribirla, eso podría romper otras llamadas que la usan con el patrón actual (paleta completa). Mitigación: crear `backgroundColorOne(name, shade, base)` nuevo y dejar el viejo intacto durante la coexistencia.

### 6.3 Lo que conviene NO migrar (V1)

- Icon fonts — fuera de scope por convención
- Element defaults (`Window`, `Label`, etc.) — convivencia es OK
- Compound classes muy específicas (gradients composicionales con múltiples valores) — mantener pre-generados es más simple

---

## 7. Pointers para la próxima sesión

### 7.1 Archivos clave a tener en mente

| Archivo | Líneas | Rol |
|---|---|---|
| `src/cli/commands/build.js` | 44 | Entry point del comando `build` |
| `src/core/builders/tailwind-builder.js` | 30 | Thin wrapper → `autoBuildUtilitiesTSS` |
| `src/core/builders/auto-utilities-builder.js` | 973 | Generador del `utilities.tss` completo |
| `src/core/purger/tailwind-purger.js` | 273 | El purger, donde vive el dispatcher JIT/lookup |
| `src/shared/helpers/utils.js` | 1254 | Templates, `parseValue`, `formatArbitraryValues`, `arbitraryValuesTable` |
| `src/shared/helpers/colors.js` | 775 | ~50 helpers de color (uno por propiedad de Titanium) |
| `src/shared/helpers/layout.js` | 695 | Helpers de dimensions/spacing/margin/padding |
| `dist/utilities.tss` | 25,803 | El maestro pre-generado (lo que JIT busca reducir/eliminar) |

### 7.2 Líneas críticas

- `tailwind-purger.js:75-77` — el branch del dispatcher donde corre el JIT actual (arbitrary values). Aquí se agregarán los nuevos branches.
- `helpers/utils.js:1052` — `arbitraryValuesTable` (la tabla de templates reusable).
- `helpers/utils.js:676` — `formatArbitraryValues` (el JIT example funcional).
- `auto-utilities-builder.js:487` — `combineDefaultThemeWithConfigFile` (la data source para todo).
- `auto-utilities-builder.js:228` — `autoBuildUtilitiesTSS` (entry point del builder).
- `helpers/utils.js:29` — `processProperties` (el emitter universal).
- `helpers/utils.js:115` — `parseValue` (formateador de valores).

### 7.3 Para empezar el experimento concreto

Una sesión productiva inicial podría:

1. Confirmar el plan general (este doc)
2. Decidir si el experimento empieza con `resolveColorClass` o algo más chico (p.ej. solo `bg-{color}-{shade}` sin opacity, sin gradient)
3. Implementar el primer resolver
4. Insertar el branch en el dispatcher con fallback al lookup
5. Hacer golden test: corre `purgetss` sobre el `test-project/` actual (que tiene `bg-blue-500` y `bg-red-500`), comparar `app.tss` antes y después
6. Si match: documentar el patrón y planear Fase 2
7. Si no match: diagnosticar diff, ajustar resolver, repetir

Probablemente sea una tarde de trabajo el primer experimento.

---

## 8. Decisión pendiente

Esta propuesta NO está aprobada para implementación. La conversación que la originó terminó con:

- Acuerdo en que el JIT es la dirección correcta a largo plazo
- Acuerdo en empezar por colores (mayor ROI, data source byte-exacto disponible)
- Pendiente: probar primero el SVG image pipeline (otro feature implementado en paralelo) en proyectos reales
- Pendiente: medir el bottleneck actual del `purge` para validar que JIT impactará performance
- Pendiente: decidir si todas las fases se ejecutan o paramos cuando el ROI marginal baje

Cuando se retome esta conversación, este doc debería leerse primero para no repetir el trabajo de descubrimiento del codebase.
