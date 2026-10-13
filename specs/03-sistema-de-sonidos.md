# SPEC 03 — Sistema de sonidos

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-13
> **Objetivo:** Reproducir efectos de sonido al rebotar la bola y al destruir bloques usando los archivos MP3 existentes.

## Alcance

**Incluido:**

- Sonido `ball-bounce.mp3` al rebotar la bola contra paredes, techo y paddle.
- Sonido `break-sound.mp3` al destruir un bloque.
- Precarga de ambos archivos de audio al iniciar el juego para evitar latencia en la primera reproduccion.
- Soporte para multiples instancias simultaneas del mismo sonido (si la bola destruye un bloque mientras otro sonido aun suena).

**Fuera de alcance (para futuras specs):**

- Control de volumen o boton de mute.
- Musica de fondo.
- Sonidos adicionales (game over, victoria, lanzamiento de bola).
- Feedback visual de estado de audio.

## Modelo de datos

Esta feature no introduce nuevas estructuras de datos. Los objetos `Audio` se crean al inicio y se reutilizan.

```js
// Pool de instancias de audio para permitir sonidos simultaneos
// Se clonan nodos de audio preexistentes para evitar latencia de carga.
const sounds = {
  bounce: new Audio('assets/sounds/ball-bounce.mp3'),
  breakBlock: new Audio('assets/sounds/break-sound.mp3'),
};

// Funcion para reproducir un sonido (clona el nodo si ya esta sonando)
function playSound(name) { /* ... */ }
```

## Plan de implementacion

1. **Crear funcion de carga y reproduccion de sonidos** — Al inicio de `game.js` (o en un bloque dedicado), crear los objetos `Audio` para ambos sonidos. Implementar `playSound(name)` que resetea `currentTime` a 0 y llama `play()`, o clona el nodo de audio si se necesitan instancias simultaneas. Verificacion: llamar `playSound('bounce')` desde consola reproduce el sonido.

2. **Integrar sonido de rebote** — En `updatePlaying()`, llamar `playSound('bounce')` cuando la bola rebota contra paredes laterales, techo y paddle (en cada punto donde `ball.dx` o `ball.dy` se invierte por colision con pared/techo/paddle). Verificacion: la bola produce sonido al rebotar en cada superficie.

3. **Integrar sonido de destruccion** — En la colision bola-bloques, llamar `playSound('breakBlock')` cuando un bloque es destruido (`b.alive = false`). Verificacion: destruir un bloque produce sonido. Destruir bloques rapido produce sonidos superpuestos sin cortes.

4. **Manejar restriccion de autoplay del navegador** — Los navegadores bloquean audio antes de la primera interaccion del usuario. Asegurarse de que el primer `playSound` ocurre despues de una accion del usuario (Space para iniciar ya cumple esto). Si `play()` falla silenciosamente, capturar la promesa rechazada con `.catch(() => {})` para evitar errores en consola. Verificacion: no hay errores de autoplay en consola al iniciar el juego.

## Criterios de aceptacion

- [ x] Al rebotar la bola contra una pared lateral se reproduce `ball-bounce.mp3`.
- [ x] Al rebotar la bola contra el techo se reproduce `ball-bounce.mp3`.
- [ x] Al rebotar la bola contra el paddle se reproduce `ball-bounce.mp3`.
- [ x] Al destruir un bloque se reproduce `break-sound.mp3`.
- [ x] Multiples sonidos pueden reproducirse simultaneamente sin cortarse entre si.
- [ x] No hay errores en consola relacionados con audio.
- [x ] El juego funciona correctamente si el navegador bloquea autoplay (los sonidos comienzan tras la primera interaccion).

## Decisiones tomadas y descartadas

- **Si:** Usar los dos MP3 existentes sin agregar mas. Suficientes para dar feedback auditivo basico.
- **No:** Agregar sonidos de game over, victoria o lanzamiento. Se pueden agregar en otra spec sin cambios estructurales.
- **Si:** Sin control de volumen ni mute. Minima complejidad; el usuario puede controlar volumen desde el sistema operativo.
- **No:** Slider de volumen o tecla mute. Requiere UI adicional y persistencia de preferencia.
- **Si:** Clonar nodos de audio para sonidos simultaneos. Garantiza que multiples impactos rapidos suenen todos.
- **No:** Web Audio API. Demasiado complejo para dos efectos simples; `Audio` nativo es suficiente.

## Lo que **no** esta en esta spec

- Control de volumen o mute.
- Musica de fondo.
- Sonidos adicionales mas alla de rebote y destruccion.
- Web Audio API.

Cada uno de estos, si se implementa, va en su propia spec.
