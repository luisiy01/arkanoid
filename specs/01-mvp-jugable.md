# SPEC 01 — MVP jugable de Arkanoid

> **Estado:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-10-12
> **Objetivo:** Implementar un juego de Arkanoid jugable con paddle, bola, bloques destructibles, sistema de vidas, puntaje y pantallas de estado (inicio, pausa, game over, victoria).

## Alcance

**Incluido:**

- Canvas fijo de 480×720 centrado en pantalla.
- Paddle controlado con teclado (flechas izquierda/derecha y A/D).
- Bola que rebota en paredes, techo y paddle.
- Rebote en paddle con ángulo variable según punto de impacto (centro = recto, bordes = ángulo abierto).
- Grilla rectangular clásica de bloques (~6 filas × 10-12 columnas) usando colores del spritesheet.
- Bloques de un solo golpe — desaparecen instantáneamente al ser golpeados (sin animación de explosión).
- Puntaje: 10 puntos por bloque, sin importar color.
- Sistema de 3 vidas — perder la bola resta una vida.
- Bola pegada al paddle al inicio y tras perder vida; se lanza con Space.
- Pantalla de inicio con título y botón/indicación para jugar.
- Pausa con tecla (Esc o P) y overlay visual.
- Pantalla de Game Over al perder todas las vidas con opción de reiniciar.
- Pantalla de Victoria al romper todos los bloques.
- Renderizado usando sprites del spritesheet existente (`assets/spritesheet.png` + `assets/spritesheet.js`).

**Fuera de alcance (para futuras specs):**

- Sonidos y música.
- Animaciones de explosión al romper bloques.
- Múltiples niveles o generación procedural.
- Bloques con durabilidad (multi-hit).
- Control por mouse o touch.
- Tabla de high scores o persistencia de puntaje.
- Power-ups.
- Responsividad o adaptación al viewport.

## Modelo de datos

```js
// Estado principal del juego
const state = {
  status: 'start', // 'start' | 'playing' | 'paused' | 'gameover' | 'victory'
  lives: 3,
  score: 0,
  ballAttached: true, // bola pegada al paddle antes de lanzar
};

// Paddle
const paddle = {
  x: 0,       // posición horizontal (centro)
  y: 0,       // posición vertical (fija, cerca del fondo)
  width: 80,
  height: 16,
  speed: 6,   // pixeles por frame
};

// Bola
const ball = {
  x: 0,
  y: 0,
  radius: 6,
  dx: 0,      // velocidad horizontal (pixeles/frame)
  dy: 0,      // velocidad vertical (pixeles/frame)
  speed: 4,   // magnitud base de velocidad
};

// Bloque individual
// { x, y, width, height, color, alive }
// Grilla generada al iniciar nivel.

// Colores disponibles (del spritesheet):
// gray, red, yellow, cyan, magenta, hotpink, green
// Cada fila usa un color distinto.
```

Convenciones:
- Coordenadas: origen arriba-izquierda.
- Velocidades en pixeles/frame.
- Sprites se dibujan con `drawSprite(ctx, 'block_<color>', x, y)` y `drawSprite(ctx, 'paddle', x, y)` / `drawSprite(ctx, 'ball', x, y)`.

## Plan de implementación

1. **Crear `index.html`** con canvas 480×720, centrado con CSS mínimo, y tag `<script>` que carga el módulo principal del juego. Verificación: abrir en navegador muestra canvas vacío con borde visible.

2. **Crear `game.js`** con game loop básico usando `requestAnimationFrame`. Implementar máquina de estados (`start`, `playing`, `paused`, `gameover`, `victory`) con funciones `update()` y `draw()` que despachan según estado. Verificación: canvas muestra fondo de color sólido.

3. **Implementar paddle** — carga de sprite, renderizado en posición fija cerca del fondo, movimiento horizontal con flechas y A/D. Limitar movimiento a bordes del canvas. Verificación: paddle se mueve suavemente y no sale del canvas.

4. **Implementar bola** — renderizado con sprite, estado "pegada al paddle" y lanzamiento con Space. Movimiento libre con rebote en paredes laterales y techo. Verificación: bola se lanza y rebota en paredes.

5. **Implementar colisión bola-paddle** — detección de colisión rectangular, cálculo de ángulo de rebote según punto de impacto (centro = rebote vertical, bordes = ángulo hasta ~60°). Verificación: bola rebota con ángulo variable según dónde golpea el paddle.

6. **Implementar grilla de bloques** — generar filas de bloques con colores del spritesheet, renderizar usando `drawSprite`. Verificación: grilla de bloques visible en parte superior del canvas.

7. **Implementar colisión bola-bloques** — detección de colisión, eliminar bloque al contacto, sumar 10 puntos, invertir componente de velocidad apropiado. Verificación: bloques desaparecen al ser golpeados, score incrementa.

8. **Implementar sistema de vidas** — detectar bola cayendo por debajo del canvas, restar vida, resetear bola pegada al paddle. Game over si vidas llegan a 0. Verificación: perder bola resta vida, 0 vidas muestra game over.

9. **Implementar condición de victoria** — detectar que no quedan bloques vivos. Verificación: romper todos los bloques muestra pantalla de victoria.

10. **Implementar pantallas de UI** — pantalla de inicio (título + "Press Space to start"), overlay de pausa (Esc/P para pausar/reanudar), pantalla game over (score final + "Press Space to restart"), pantalla victoria (score final + "Press Space to restart"). HUD durante juego: vidas y score visibles. Verificación: todas las transiciones de estado funcionan correctamente.

## Criterios de aceptación

- [x ] `index.html` abre en navegador sin errores en consola.
- [x ] Canvas de 480×720 visible y centrado.
- [x ] Paddle se mueve con flechas izquierda/derecha y A/D.
- [x ] Paddle no sale de los bordes del canvas.
- [x ] Bola empieza pegada al paddle.
- [x ] Space lanza la bola.
- [x ] Bola rebota en paredes laterales y techo.
- [x ] Bola rebota en paddle con ángulo variable según punto de impacto.
- [x ] Grilla de bloques visible con colores del spritesheet.
- [x ] Bloques desaparecen al ser golpeados por la bola.
- [x ] Score incrementa en 10 por cada bloque destruido.
- [x ] Score y vidas visibles durante el juego.
- [x ] Perder la bola (cae por debajo) resta una vida.
- [x ] Tras perder vida, bola vuelve pegada al paddle.
- [x ] 0 vidas muestra pantalla de Game Over con score final.
- [x ] Romper todos los bloques muestra pantalla de Victoria.
- [x ] Pantalla de inicio se muestra al cargar.
- [x ] Esc o P pausa el juego con overlay visual.
- [x ] Desde Game Over o Victoria, Space reinicia la partida.
- [x ] Todos los sprites se renderizan correctamente desde el spritesheet.

## Decisiones tomadas y descartadas

- **Sí:** Canvas fijo 480×720. Simple, predecible, sin complejidad de escalado para MVP.
- **No:** Canvas responsive. Agrega complejidad de escalado que no aporta al MVP.
- **Sí:** Control solo por teclado. Suficiente para validar el juego en desktop.
- **No:** Mouse o touch. Touch especialmente agrega complejidad; mouse se puede agregar en otra spec.
- **Sí:** Bloques de un golpe. Mecánica más simple, suficiente para MVP.
- **No:** Bloques multi-hit. Requiere feedback visual de daño parcial, más complejidad.
- **Sí:** Puntaje uniforme (10 pts). Simplifica lógica de puntaje.
- **No:** Puntaje diferenciado por color/fila. Se puede agregar después sin cambios estructurales.
- **Sí:** Remoción instantánea de bloques. Implementación directa.
- **No:** Animación de explosión. Existe en spritesheet pero agrega complejidad de temporización al MVP.
- **Sí:** Un solo nivel. Valida toda la mecánica sin sistema de niveles.
- **No:** Sonidos. Se integran en otra spec; no cambian la jugabilidad base.

## Lo que **no** está en esta spec

- Sonidos y música.
- Animaciones de explosión.
- Múltiples niveles.
- Bloques con durabilidad.
- Control por mouse o touch.
- Persistencia de high scores.
- Power-ups.
- Responsive/adaptativo.

Cada uno de estos, si se implementa, va en su propia spec.
