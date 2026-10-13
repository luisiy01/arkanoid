# SPEC 02 — Destruccion de bloques con animacion de explosion

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-12
> **Objetivo:** Reemplazar la desaparicion instantanea de bloques por una animacion de explosion de 4 frames usando los sprites existentes del spritesheet.

## Alcance

**Incluido:**

- Animacion de explosion al destruir un bloque usando los 4 frames de `EXPLOSION_FRAMES` del spritesheet.
- Cada explosion se reproduce en la posicion exacta del bloque destruido, con el color correspondiente.
- Duracion total de la animacion: 150ms (valor de `EXPLOSION_DURATION` ya definido en `spritesheet.js`).
- Multiples explosiones pueden ocurrir simultaneamente (si la bola destruye un bloque mientras otra explosion aun se reproduce).
- La condicion de victoria espera a que terminen TODAS las animaciones de explosion antes de mostrar la pantalla de victoria.

**Fuera de alcance:**

- Sonidos al destruir bloques (spec separada).
- Efectos adicionales (escalado, particulas, fade-out).
- Bloques con durabilidad (multi-hit).

## Modelo de datos

```js
// Array global de explosiones activas
let explosions = [];

// Explosion individual
// {
//   x: number,       — posicion x del bloque destruido
//   y: number,       — posicion y del bloque destruido
//   width: number,   — ancho del bloque (para renderizar frame a tamano correcto)
//   height: number,  — alto del bloque
//   color: string,   — color del bloque (para seleccionar frames de EXPLOSION_FRAMES)
//   frame: number,   — indice del frame actual (0-3)
//   elapsed: number, — tiempo acumulado en ms desde inicio de la explosion
// }
```

Convencion: `EXPLOSION_DURATION` (150ms) se divide entre 4 frames = ~37.5ms por frame. El frame actual se calcula como `Math.floor(elapsed / (EXPLOSION_DURATION / 4))`, clampeado a 0-3.

## Plan de implementacion

1. **Agregar array de explosiones y funcion de spawn** — Crear array global `explosions = []`. Crear funcion `spawnExplosion(block)` que agrega un nuevo objeto explosion con las coordenadas, dimensiones y color del bloque, `frame: 0`, `elapsed: 0`. Verificacion: funcion existe y crea objetos con la estructura correcta.

2. **Integrar spawn en colision bola-bloques** — Cuando un bloque es destruido (`b.alive = false`), llamar `spawnExplosion(b)` antes de marcar `alive = false`. Verificacion: al destruir un bloque se agrega una explosion al array.

3. **Implementar actualizacion de explosiones** — En `updatePlaying()`, despues de la logica existente, iterar sobre `explosions` y avanzar `elapsed` usando deltaTime. Cuando `elapsed >= EXPLOSION_DURATION`, remover la explosion del array. Requiere calcular deltaTime en el game loop (diferencia entre timestamps de `requestAnimationFrame`). Verificacion: explosiones se crean y se eliminan tras 150ms.

4. **Implementar renderizado de explosiones** — En `drawBlocks()` (o funcion separada `drawExplosions()`), iterar sobre `explosions`, calcular frame actual con `Math.floor(elapsed / (EXPLOSION_DURATION / 4))`, y usar `drawFrame(ctx, EXPLOSION_FRAMES[color][frameIndex], x, y, width, height)` para dibujar. Verificacion: se ven 4 frames de animacion en la posicion del bloque destruido.

5. **Agregar deltaTime al game loop** — Modificar `gameLoop()` para recibir timestamp de `requestAnimationFrame`, calcular deltaTime respecto al frame anterior, y pasarlo a `update()`. Cap de deltaTime a ~33ms (30fps minimo) para evitar saltos grandes al cambiar de tab. Verificacion: deltaTime se calcula correctamente y la animacion es independiente del framerate.

6. **Ajustar condicion de victoria** — Modificar la deteccion de victoria: cuando todos los bloques estan muertos (`blocks.every(b => !b.alive)`) Y no hay explosiones activas (`explosions.length === 0`), entonces declarar victoria. Verificacion: la pantalla de victoria aparece solo despues de que la ultima explosion termina.

7. **Limpiar explosiones en resetGame** — Vaciar el array `explosions` al reiniciar la partida. Verificacion: reiniciar no deja explosiones residuales.

## Criterios de aceptacion

- [ x] Al golpear un bloque con la bola, se reproduce una animacion de explosion de 4 frames en la posicion del bloque.
- [ x] La animacion usa los frames correctos segun el color del bloque destruido.
- [ x] La animacion dura 150ms en total.
- [ x] Multiples explosiones pueden ocurrir simultaneamente sin problemas.
- [ x] La explosion no afecta la fisica del juego (la bola no colisiona con explosiones).
- [ x] La condicion de victoria espera a que terminen todas las explosiones antes de mostrar la pantalla de victoria.
- [ x] Reiniciar la partida limpia todas las explosiones activas.
- [ x] El game loop usa deltaTime para que la animacion sea independiente del framerate.
- [ x] No hay errores en consola relacionados con la animacion.

## Decisiones tomadas y descartadas

- **Si:** Usar `EXPLOSION_FRAMES` y `EXPLOSION_DURATION` ya definidos en `spritesheet.js`. No reinventar constantes que ya existen.
- **No:** Efectos adicionales (escalado, particulas). Los frames del spritesheet son suficientes y mantienen consistencia visual.
- **Si:** Esperar a que terminen todas las explosiones antes de declarar victoria. Da un cierre visual mas satisfactorio.
- **No:** Victoria inmediata mientras la explosion se anima. Se veria cortada la animacion del ultimo bloque.
- **Si:** Agregar deltaTime al game loop. Necesario para animar correctamente y beneficia futuras features.
- **No:** Incluir sonido en esta spec. Sonido merece su propia spec para poder disenar volumen, mute, multiples efectos, etc.
- **Si:** Duracion de 150ms. Rapida, no interrumpe el ritmo del juego, consistente con el valor definido en el spritesheet.
