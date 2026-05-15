Confirmado: el doc tiene fases explícitas en sección 4.2 (Fase 1 = Colors). Te armo el handoff:

---

```
Estoy en /Users/cesar/Developer/openSource/purgeTSS. Voy a empezar la **Fase 1** del refactor JIT documentado en `docs/jit-class-resolution-proposal.md` (migrar la generación de clases de color a resolución JIT desde `tailwindcss/colors` + `theme.extend.colors`, eliminándolas eventualmente de `utilities.tss`).

Antes de tocar código:

1. Lee `docs/jit-class-resolution-proposal.md` COMPLETO. Especialmente:
   - Sección 3 (infraestructura reusable que ya existe — NO la dupliques)
   - Sección 4.3 (bosquejo del resolver de color)
   - Sección 4.4 (estrategia de coexistencia con golden tests byte-exact)
   - Sección 5.1 (edge cases: opacity modifier /65, gradients, dual-property text-color, deprecated colors, semantic colors)
   - Sección 7 (archivos y líneas clave)

2. Bottleneck ya medido en sesión anterior con `purgetss --debug` sobre el proyecto real "LM - El Juego": 507ms de 958ms (~53%) se van en el lookup de utilities.tss. JIT colores ataca directamente esa porción. NO repitas la medición.

3. Estado de la rama: actualmente hay otra feature en `feat/svg-images-pipeline` (SVG-aware image pipeline) ya implementada y validada pero todavía sin merge ni commit final. Para Fase 1 JIT crea una rama nueva desde main (sugerido: `feat/jit-colors`), NO trabajes sobre la rama de SVG.

4. Antes de escribir UNA línea de código:
   - Confirma conmigo el alcance del primer experimento. La sección 7.3 sugiere empezar con `bg-{color}-{shade}` sin opacity y sin gradient. Quizá querramos eso, o quizá querramos algo distinto.
   - Diseña los golden tests primero (qué clases vamos a comparar byte-by-byte entre lookup y JIT).
   - NO empieces "exploratorio". El doc ya hizo el descubrimiento.

5. Reglas operativas (de mi CLAUDE.md global, no negociables):
   - NO commits, NO version bumps, NO git push sin que yo diga "commitea" explícitamente
   - NO inventes funciones/rutas/comandos que no hayas verificado leyendo el código
   - Cambios quirúrgicos: solo lo que el pedido requiere, sin "limpieza" adyacente
   - Si hay ambigüedad, pregunta ANTES de codear

El doc tiene todo el contexto que falta. Empieza por leerlo.
```

---

Eso te da un punto de entrada limpio: el modelo nuevo lee el doc, entiende el alcance, y arranca con un experimento concreto en lugar de re-descubrir el codebase.
