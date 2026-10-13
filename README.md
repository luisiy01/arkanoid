# Juego de Arkanoid

Juego estilo breakout/Arkanoid hecho con HTML, CSS y JavaScript puro — cero dependencias externas. Se juega directamente en el navegador.

## Cómo jugar

Abrir `index.html` en cualquier navegador moderno (no requiere servidor, bundler ni build).

### Controles

| Tecla | Acción |
|-------|--------|
| `Espacio` | Iniciar partida / lanzar bola / reiniciar |
| `←` / `A` | Mover paddle a la izquierda |
| `→` / `D` | Mover paddle a la derecha |
| `Esc` / `P` | Pausar / reanudar |

### Mecánicas

- **3 vidas** por partida, se conservan entre niveles
- **Puntaje** acumulativo: 10 puntos por bloque destruido
- Rebote angular según punto de impacto en el paddle

## Niveles

3 niveles con dificultad progresiva:

| Nivel | Filas | Velocidad bola | Ancho paddle |
|-------|-------|-----------------|--------------|
| 1 | 7 | 4 | 80px |
| 2 | 9 | 5 | 70px |
| 3 | 10 | 6 | 60px |

Pantalla de transición de 2 segundos entre niveles. Al completar los 3 niveles se muestra pantalla de victoria con puntaje total.

## Estructura del proyecto

```
index.html              — Punto de entrada (canvas 480×720)
game.js                 — Lógica completa del juego
assets/
  spritesheet-breakout.png  — Spritesheet con todos los gráficos
  spritesheet.js            — Mapa de coordenadas y helpers de dibujo
  sounds/
    ball-bounce.mp3         — Sonido de rebote
    break-sound.mp3         — Sonido de destrucción de bloque
```

## Sprites disponibles

- Paddle, bola
- Bloques de colores: gray, red, yellow, cyan, magenta, hotpink, green
- Animaciones de explosión: 4 frames por color, 150ms de duración

## Specs implementadas

1. **MVP jugable** — Paddle, bola, bloques, colisiones, vidas, puntaje, game over
2. **Animaciones de explosión** — Efecto visual al destruir bloques
3. **Sistema de sonidos** — Sonidos de rebote y destrucción de bloques
4. **Múltiples niveles** — 3 niveles con dificultad progresiva

## Desarrollo

Proyecto guiado por specs en `specs/`. Flujo: Draft → In review → Approved → Implemented.

- `/spec <descripción>` — Crear nueva spec
- `/spec-impl <NN-nombre>` — Implementar spec aprobada