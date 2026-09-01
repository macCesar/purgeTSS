# PurgeTSS Classic — kit para videos cortos

Este paquete contiene ocho proyectos Titanium Classic independientes, uno por comando. Ninguno usa Alloy, `app/`, TSS, clases utilitarias ni `$.UI.create()`. Los resultados que produce PurgeTSS son recursos nativos dentro de `Resources/`, salvo `shades`, que puede mantener `purgetss/config.cjs` como fuente de desarrollo. [source: references/classic-projects.md]

## Contenido

| Proyecto          | Comando principal                            | Material incluido                                         |
| ----------------- | -------------------------------------------- | --------------------------------------------------------- |
| `01-brand`        | `purgetss brand --yes`                       | Logotipo SVG y app Classic mínima                         |
| `02-images`       | `purgetss images --width 220 --yes`          | Ilustración SVG para generar densidades                   |
| `03-semantic`     | `purgetss semantic --single ...`             | Pantalla que alterna Light/Dark                           |
| `04-shades`       | `purgetss shades ...`                        | Proyecto limpio para mostrar consola y config             |
| `05-color-module` | `purgetss color-module`                      | Paleta preparada y pantalla que consume el módulo         |
| `06-module`       | `purgetss module`                            | Pantalla que usa `createAnimation().pulse()`              |
| `07-icon-library` | `purgetss icon-library --vendor=fa --module` | Pantalla con cuatro iconos Font Awesome                   |
| `08-build-fonts`  | `purgetss build-fonts --module`              | Fuente de iconos personalizada, CSS y pantalla de muestra |

## Antes de grabar

1. Verifica que el CLI publicado esté disponible:

   ```bash
   purgetss --version
   ```

2. Duplica la carpeta del proyecto que vas a grabar y trabaja en la copia. Los comandos generan archivos dentro del proyecto y así puedes repetir la toma desde cero.
3. Abre la copia en VS Code con el explorador visible y una terminal en la raíz del proyecto.
4. Usa una ventana vertical de 1080 × 1920 o recorta a 9:16. Sube el tamaño del texto de terminal a 18–22 px.
5. Para tomas repetibles, usa `--yes` en `brand` e `images`; evita que una confirmación tape el resultado.

## Orden recomendado de publicación

Publica primero `brand`, `images` y `semantic`: tienen el cambio visual más evidente. Después publica `icon-library`, `build-fonts`, `shades`, `color-module` y `module`. El orden cuenta una historia: activos → tema → fuentes → datos reutilizables → comportamiento.

Los guiones, encuadres y comandos exactos están en [recording-guide.md](./recording-guide.md).

## Qué no debe aparecer en los videos

- No ejecutes `purgetss init`, `build`, `watch` ni el comando raíz dentro de estos proyectos.
- No agregues `app/`, `alloy.jmk`, TSS, clases utilitarias ni `$.UI.create()`.
- No presentes `purgetss/config.cjs` como dependencia de ejecución: en Classic sólo sirve como fuente de desarrollo para comandos compatibles.

La aplicación Classic compila normalmente con `ti build`; los archivos generados bajo `Resources/` son recursos Titanium ordinarios. [source: references/classic-projects.md]

## Referencias consultadas

- `references/classic-projects.md`
- `references/cli-commands.md`
- `references/app-branding.md`
- `references/multi-density-images.md`
- `references/semantic-colors.md`
- `references/icon-fonts.md`
- `references/custom-fonts.md`
- `references/animation-system.md`
