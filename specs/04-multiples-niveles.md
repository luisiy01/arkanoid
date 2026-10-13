# SPEC 04 — Multiples niveles con dificultad progresiva

> **Estado:** Borrador
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-10-13
> **Objetivo:** Implementar 3 niveles con patrones de bloques distintos y dificultad progresiva (velocidad de bola, cantidad de filas y ancho de paddle).

## Alcance

**Incluido:**

- 3 niveles con patrones de bloques diferentes (disposicion y colores distintos por nivel).
- Dificultad progresiva entre niveles:
  - Velocidad de bola incrementa.
  - Mas filas de bloques.
  - Paddle mas angosto.
- Pantalla de transicion "Level N" entre niveles (~2 segundos), con bola pegada al paddle al comenzar cada nivel.
- Vidas se mantienen entre niveles (no se reinician).
- Score se acumula entre niveles.
- Pantalla de victoria final al completar los 3 niveles, mostrando score total.
- HUD muestra nivel actual ("Level: N") junto a vidas y score.

**Fuera de alcance (para futuras specs):**

- Generacion procedural de niveles.
- Mas de 3 niveles.
- Bloques con durabilidad (multi-hit).
- Seleccion de nivel.
- Guardado de progreso entre sesiones.
- Power-ups.

## Modelo de datos

```js
// Configuracion de niveles
const LEVELS = [
  {
    rows: 7,
    colors: ['red', 'hotpink', 'magenta', 'yellow', 'green', 'cyan', 'gray'],
    ballSpeed: 4,
    paddleWidth: 80,
  },
  {
    rows: 9,
    colors: ['cyan', 'green', 'yellow', 'magenta', 'hotpink', 'red', 'gray', 'cyan', 'green'],
    ballSpeed: 5,
    paddleWidth: 70,
  },
  {
    rows: 10,
    colors: ['magenta', 'red', 'hotpink', 'yellow', 'green', 'cyan', 'gray', 'red', 'magenta', 'hotpink'],
    ballSpeed: 6,
    paddleWidth: 60,
  },
];

// Nuevo estado en state
const state = {
  // ... campos existentes ...
  level: 0,              // indice en LEVELS (0-2)
  status: 'start',       // se agrega 'levelTransition' como estado posible
  transitionTimer: 0,    // ms restantes en pantalla de transicion
};

// status posibles: 'start' | 'playing' | 'paused' | 'gameover' | 'victory' | 'levelTransition'
```

Convenciones:
- `level` es indice 0-based. Se muestra al usuario como `level + 1`.
- `LEVELS[state.level]` da la configuracion del nivel actual.
- `createBlocks()` recibe la configuracion del nivel para generar la grilla.

## Plan de implementacion

1. **Definir array LEVELS** — Crear constante `LEVELS` con la configuracion de los 3 niveles (filas, colores, velocidad de bola, ancho de paddle). Verificacion: `LEVELS` accesible, cada entrada tiene `rows`, `colors`, `ballSpeed`, `paddleWidth`.

2. **Agregar `level` al estado y modificar `createBlocks()`** — Agregar `state.level = 0` al estado inicial. Modificar `createBlocks()` para que use `LEVELS[state.level]` en lugar de las constantes fijas `BLOCK_ROWS` y `ROW_COLORS`. Aplicar `ballSpeed` y `paddleWidth` del nivel al paddle y bola. Verificacion: el nivel 1 se ve y juega igual que antes (mismos parametros).

3. **Agregar estado `levelTransition`** — Agregar `'levelTransition'` a la maquina de estados. Crear `updateLevelTransition(dt)` que decrementa `state.transitionTimer` y pasa a `'playing'` cuando llega a 0. Crear `drawLevelTransition()` que muestra "Level N" centrado en pantalla. Verificacion: forzar `state.status = 'levelTransition'` muestra la pantalla correcta.

4. **Implementar avance de nivel** — Cuando todos los bloques estan muertos y no hay explosiones activas: si `state.level < LEVELS.length - 1`, incrementar `state.level`, configurar `state.status = 'levelTransition'`, `state.transitionTimer = 2000`, crear nuevos bloques con `createBlocks()`, pegar bola al paddle, y aplicar parametros del nuevo nivel (velocidad de bola y ancho de paddle). Si `state.level === LEVELS.length - 1`, declarar victoria final. Verificacion: completar nivel 1 muestra "Level 2" por 2 segundos y luego empieza nivel 2 con mas bloques, bola mas rapida y paddle mas angosto.

5. **Actualizar HUD** — Agregar "Level: N" al HUD (junto a vidas y score). Mostrar `state.level + 1`. Verificacion: durante el juego se ve "Level: 1", "Level: 2" o "Level: 3".

6. **Ajustar `resetGame()`** — Al reiniciar, volver a `state.level = 0` y aplicar parametros del nivel 1. Verificacion: reiniciar desde game over o victoria vuelve al nivel 1 con parametros originales.

7. **Ajustar pantalla de victoria** — La pantalla de victoria final muestra score total acumulado. Verificacion: completar los 3 niveles muestra victoria con score total.

## Criterios de aceptacion

- [ ] Existen 3 niveles con patrones de bloques diferentes.
- [ ] Nivel 2 tiene mas filas de bloques que nivel 1.
- [ ] Nivel 3 tiene mas filas de bloques que nivel 2.
- [ ] La velocidad de bola aumenta en cada nivel.
- [ ] El paddle se hace mas angosto en cada nivel.
- [ ] Al completar un nivel (no el ultimo), se muestra "Level N" por ~2 segundos.
- [ ] Tras la pantalla de transicion, el siguiente nivel comienza con bola pegada al paddle.
- [ ] Las vidas se mantienen entre niveles.
- [ ] El score se acumula entre niveles.
- [ ] Al completar el nivel 3, se muestra pantalla de victoria final con score total.
- [ ] El HUD muestra el nivel actual durante el juego.
- [ ] Reiniciar la partida vuelve al nivel 1 con parametros originales.
- [ ] No hay errores en consola al transicionar entre niveles.

## Decisiones tomadas y descartadas

- **Si:** 3 niveles hardcodeados. Suficientes para demostrar progresion sin sobrecomplicar.
- **No:** Generacion procedural. Mucho mas codigo y dificil de balancear; merece su propia spec si se necesita.
- **Si:** Dificultad triple (velocidad + filas + paddle). Tres ejes de dificultad dan sensacion clara de progresion.
- **No:** Solo cambiar velocidad. Un solo eje no se siente suficientemente diferente.
- **Si:** Vidas se mantienen entre niveles. Recompensa jugar bien y agrega tension.
- **No:** Reiniciar vidas por nivel. Demasiado facil, elimina consecuencia de perder bola.
- **Si:** Pantalla de transicion de 2 segundos. Da respiro al jugador entre niveles.
- **No:** Transicion inmediata. Puede desorientar al cambiar parametros de golpe.
- **Si:** Victoria final al completar nivel 3. Cierre claro de la experiencia.
- **No:** Loop infinito. Requiere escalado de dificultad sin tope, mas complejo.
- **Si:** Patrones de colores diferentes por nivel. Distincion visual clara entre niveles.

## Lo que **no** esta en esta spec

- Generacion procedural de niveles.
- Mas de 3 niveles.
- Bloques multi-hit.
- Seleccion de nivel o menu de niveles.
- Guardado de progreso.
- Power-ups.

Cada uno de estos, si se implementa, va en su propia spec.
