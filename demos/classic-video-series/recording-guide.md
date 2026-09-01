# Guiones — PurgeTSS en Titanium Classic

Formato sugerido: videos verticales de 35–55 segundos. Graba primero pantalla y terminal; añade la voz después para cortar esperas y acelerar procesos largos.

## 1. `brand` — toda la identidad desde un SVG

Duración final: 41.40 s. La narración termina en 39.79 s y el último plano permanece visible 1.61 s más.

Comando:

```bash
purgetss brand --yes
```

Secuencia:

| Tiempo          | Imagen                                                                                                      | Voz                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 0.20–5.10 s     | Abre `purgetss/brand/logo.svg`.                                                                             | “A single SVG is all Purge T S S needs to brand a Titanium Classic project.”                                    |
| 5.40–9.95 s     | Ejecuta `purgetss brand --yes` desde la terminal integrada.                                                | “From the integrated terminal, run: Purge T S S brand, dash dash yes.”                                          |
| 10.30–15.05 s   | Muestra el árbol con los assets generados para iOS y Android.                                               | “The command creates every branding asset for the enabled iOS and Android platforms.”                           |
| 15.10–19.90 s   | Enseña los splashes de iOS con el artwork redondeado y el icono maestro cuadrado.                           | “The iOS splash set now rounds only the artwork, while the master icon stays square.”                           |
| 21.30–26.25 s   | Recorre el splash principal y las variantes de densidad y orientación de Android.                           | “Android applies the same radius to its main launch image and every density and orientation variant.”           |
| 28.70–31.10 s   | Abre `MarketplaceArtworkFeature.png` y deja visibles sus esquinas redondeadas.                              | “Feature Graphic gets the same rounded artwork.”                                                                |
| 31.45–34.68 s   | Mantiene el Feature Graphic y deja visibles `MarketplaceArtwork.png` y los iconos cuadrados en el explorador. | “Store and launcher icons stay square for platform masking.”                                                    |
| 35.10–39.90 s   | Mantiene el plano final del Feature Graphic.                                                               | “That is Purge T S S: one logo, one command, and every branding asset.”                                         |
| 39.90–41.40 s   | Conserva el último fotograma sin voz.                                                                       | Margen final de 1.5 s; no cortar ni usar `-shortest`.                                                           |

Plano clave: deja visible `tiapp.xml` un instante para conectar los outputs con `<deployment-targets>`. Un run normal respeta esos targets; `--only` puede sobrescribir el filtro cuando quieras preparar una pieza específica. [source: references/classic-projects.md] [source: references/app-branding.md]

El proyecto `01-brand` fija `brand.artworkCornerRadius: '22%'`. La grabación debe mostrar al menos un `Default-Portrait*.png`, un `Default-Landscape*.png`, un `Resources/android/**/default.png` y `MarketplaceArtworkFeature.png` con las esquinas del artwork redondeadas sobre el fondo blanco. `MarketplaceArtwork.png` debe permanecer cuadrado porque es un icono que Google Play enmascara.

## 2. `images` — un asset, todas las densidades

Duración objetivo: 40–50 s.

Comando:

```bash
purgetss images --width 220 --yes
```

Secuencia:

| Tiempo  | Imagen                                                                 | Voz                                                                                              |
| ------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 0–4 s   | Abre `empty-state.svg` y haz zoom.                                     | “Este SVG todavía no está listo para todas las pantallas.”                                       |
| 4–11 s  | Muestra `Resources/` sin las densidades generadas.                     | “En Classic necesitaría variantes para Android y iPhone.”                                        |
| 11–18 s | Ejecuta el comando.                                                    | “Con `images` fijo el tamaño base en 220 píxeles y PurgeTSS hace el resto.”                      |
| 18–32 s | Expande `Resources/android/images/res-*` y `Resources/iphone/images/`. | “Crea mdpi hasta xxxhdpi en Android y las escalas de iPhone, conservando la subcarpeta.”         |
| 32–43 s | Ejecuta la app; muestra la ilustración nítida.                         | “En el código sólo uso `illustrations/empty-state.png`; Titanium resuelve la densidad correcta.” |
| 43–48 s | Texto: “SVG → native densities”.                                       | “Una fuente, todas las densidades.”                                                              |

`images` está pensado para imágenes dentro de las pantallas; los iconos de la app pertenecen a `brand`. [source: references/multi-density-images.md]

## 3. `semantic` — Light/Dark nativo, sin runtime extra

Duración objetivo: 50–60 s.

Comandos:

```bash
purgetss semantic --single '#F8FAFC' surfaceColor --dark '#0F172A'
purgetss semantic --single '#0F172A' textColor --dark '#F8FAFC'
purgetss semantic --single '#7C3AED' accentColor --dark '#A78BFA'
```

Secuencia:

| Tiempo  | Imagen                                                                         | Voz                                                                                                  |
| ------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 0–5 s   | Muestra `Resources/app.js` usando `surfaceColor`, `textColor` y `accentColor`. | “Estos colores no son hex fijos: son nombres semánticos de Titanium.”                                |
| 5–15 s  | Ejecuta el primer comando y acelera los otros dos.                             | “En Classic, `semantic` escribe directamente las variantes Light y Dark.”                            |
| 15–25 s | Abre `Resources/semantic.colors.json`.                                         | “El resultado es un solo archivo nativo. No crea `purgetss/`, config, TSS, `app/` ni hooks.”         |
| 25–44 s | Ejecuta la app y pulsa “Toggle light / dark” dos veces.                        | “Titanium resuelve cada nombre según la apariencia. La pantalla cambia sin repintar colores a mano.” |
| 44–52 s | Muestra de nuevo el árbol de archivos.                                         | “PurgeTSS genera el JSON; Titanium hace el cambio en runtime.”                                       |

En Classic se usan las claves semánticas directamente en propiedades como `backgroundColor` y `color`; no hay clases utilitarias. [source: references/semantic-colors.md] [source: references/classic-projects.md]

## 4. `shades` — una paleta completa desde un color

Duración objetivo: 35–45 s.

Comandos:

```bash
purgetss shades '#7C3AED' brand --log
purgetss shades '#7C3AED' brand
```

Secuencia:

| Tiempo  | Imagen                                               | Voz                                                                                  |
| ------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 0–4 s   | Pantalla con el hex `#7C3AED`.                       | “Tengo un color de marca, pero necesito una escala consistente.”                     |
| 4–13 s  | Ejecuta la versión `--log`.                          | “Primero la previsualizo en consola, sin escribir nada.”                             |
| 13–21 s | Ejecuta la versión sin `--log`.                      | “Cuando me convence, la guardo.”                                                     |
| 21–34 s | Abre `purgetss/config.cjs` y recorre 50–900/default. | “PurgeTSS crea o actualiza `config.cjs` con tonos y matices listos para reutilizar.” |
| 34–41 s | Texto: “Preview → save → reuse”.                     | “En Classic, este archivo es una fuente de desarrollo, no una instalación de Alloy.” |

Los modos `--log`, `--json` y `--tailwind` sólo escriben en consola; guardar la paleta crea o actualiza `purgetss/config.cjs`. [source: references/cli-commands.md] [source: references/classic-projects.md]

## 5. `color-module` — colores reutilizables en JavaScript

Duración objetivo: 35–45 s.

Comando:

```bash
purgetss color-module
```

Secuencia:

| Tiempo  | Imagen                                                    | Voz                                                                                       |
| ------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 0–6 s   | Muestra la paleta `brand` en `purgetss/config.cjs`.       | “Ya tengo mi paleta. Ahora quiero usarla en JavaScript sin copiar hexadecimales.”         |
| 6–13 s  | Ejecuta el comando.                                       | “`color-module` convierte la configuración en un módulo CommonJS.”                        |
| 13–25 s | Abre `Resources/lib/purgetss.colors.js`.                  | “En Classic lo guarda directamente en `Resources/lib/`.”                                  |
| 25–37 s | Enseña `require('lib/purgetss.colors')` y ejecuta la app. | “La vista consume `colors.brand['600']`. Una fuente de verdad y cero colores duplicados.” |
| 37–42 s | Texto: “config.cjs → CommonJS”.                           | “Tu paleta, disponible en código.”                                                        |

El módulo se genera en `Resources/lib/purgetss.colors.js` en proyectos Classic. [source: references/cli-commands.md] [source: references/classic-projects.md]

## 6. `module` — helpers de UI en un proyecto Classic

Duración objetivo: 35–45 s.

Comando:

```bash
purgetss module
```

Secuencia:

| Tiempo  | Imagen                                                    | Voz                                                                                 |
| ------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 0–5 s   | Muestra `Resources/app.js` y resalta `createAnimation`.   | “También puedes usar el módulo de UI de PurgeTSS en Classic.”                       |
| 5–12 s  | Ejecuta el comando.                                       | “Un comando instala el módulo CommonJS en `Resources/lib/`.”                        |
| 12–25 s | Abre brevemente `purgetss.ui.js`, luego vuelve al código. | “Lo requiero como cualquier módulo local y creo una animación de 220 milisegundos.” |
| 25–36 s | Ejecuta la app y pulsa el bloque varias veces.            | “Aquí uso `pulse` para dar feedback al toque.”                                      |
| 36–42 s | Texto: “CommonJS. Classic. No hook.”                      | “Sin Alloy y sin hook de compilación.”                                              |

El demo usa `createAnimation({ duration: 220 }).pulse(view, 2)`. `pulse` escala y regresa la vista a su estado original. [source: references/animation-system.md] [source: references/classic-projects.md]

## 7. `icon-library` — Font Awesome listo para Classic

Duración objetivo: 40–50 s.

Comando:

```bash
purgetss icon-library --vendor=fa --module
```

Secuencia:

| Tiempo  | Imagen                                                                   | Voz                                                                                   |
| ------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 0–5 s   | Árbol sin `Resources/fonts/` ni módulo.                                  | “Quiero Font Awesome, pero este proyecto no usa Alloy.”                               |
| 5–14 s  | Ejecuta el comando.                                                      | “`icon-library` instala sólo la familia que pido y añade el módulo opcional.”         |
| 14–26 s | Expande `Resources/fonts/` y `Resources/lib/fontawesome.js`.             | “Las fuentes van a `Resources/fonts/`; los Unicode y aliases de familia, a CommonJS.” |
| 26–40 s | Muestra `fontAwesome.icons.house` y `fontAwesome.solid`; ejecuta la app. | “Uso nombres legibles, el alias `solid` y obtengo iconos nativos en Classic.”         |
| 40–46 s | Texto: “fa + module → native icons”.                                     | “Sin hardcodear caracteres Unicode.”                                                  |

En Classic, `--styles` se omite porque no hay salida TSS. El módulo expone `icons`, `families.default` y aliases como `solid`, `regular` y `brands`. [source: references/icon-fonts.md] [source: references/classic-projects.md]

## 8. `build-fonts` — tu propia fuente de iconos

Duración objetivo: 45–55 s.

Comando:

```bash
purgetss build-fonts --module
```

Secuencia:

| Tiempo  | Imagen                                                                                  | Voz                                                                                          |
| ------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0–6 s   | Abre `purgetss/fonts/interface-line-icon/`: `ili.ttf` + `style.css`.                    | “¿Y si la librería de iconos es tuya o viene de tu diseñador?”                               |
| 6–15 s  | Ejecuta el comando.                                                                     | “Coloca la fuente y su CSS en `purgetss/fonts`, y ejecuta `build-fonts --module`.”           |
| 15–28 s | Enseña `Resources/fonts/Interface-Line-Icon-2.ttf` y `Resources/lib/purgetss.fonts.js`. | “PurgeTSS usa el nombre PostScript, copia la fuente y extrae cada Unicode del CSS.”          |
| 28–43 s | Resalta `fonts.icons.ili.home` y `fonts.families.ili`; ejecuta la app.                  | “El módulo conserva el prefijo, expone la familia y deja los iconos listos para JavaScript.” |
| 43–50 s | Muestra que no apareció ningún `.tss`.                                                  | “En Classic genera recursos nativos y CommonJS; nada de TSS.”                                |

`build-fonts` sirve para fuentes definidas por el usuario. Las cuatro familias oficiales incluidas con PurgeTSS deben instalarse con `icon-library`. [source: references/custom-fonts.md] [source: references/cli-commands.md]

## Tomas B-roll que puedes reutilizar

- El explorador de VS Code alternando “antes” y “después”.
- Un acercamiento a `tiapp.xml` con Android e iPhone habilitados.
- La búsqueda “app/” sin resultados, para reforzar que es Classic.
- El simulador junto al fragmento de `Resources/app.js` que consume el resultado.
- Un cierre uniforme: “PurgeTSS 7.15 · Now for Titanium Classic”.

## Checklist antes de publicar

- El comando y sus flags se ven completos al menos un segundo.
- Las rutas mostradas empiezan con `Resources/` cuando corresponde.
- No aparece una carpeta `app/`, `alloy.jmk`, TSS ni `$.UI.create()`.
- El resultado visible coincide con el comando: `brand` para identidad, `images` para UI assets, `semantic` para colores, `icon-library` para familias oficiales y `build-fonts` para fuentes propias.
- La voz no afirma que el runtime dependa de PurgeTSS: los outputs Classic son recursos nativos o módulos CommonJS copiados al proyecto. [source: references/classic-projects.md]
