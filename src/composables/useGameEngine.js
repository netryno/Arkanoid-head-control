import { ref, reactive, watch } from 'vue'
import { Paddle } from '../entities/Paddle.js'
import { Ball } from '../entities/Ball.js'
import { Block, BlockType } from '../entities/Block.js'
import { PowerUp, PowerType } from '../entities/PowerUp.js'
import { circleRectCollision, circleCircleCollision } from '../utils/collisions.js'
import { CANVAS_W, CANVAS_H, MAX_LEVEL, LIVES } from '../utils/constants.js'

export function useGameEngine(images) {
  const score = ref(0)
  const level = ref(1)
  const lives = ref(LIVES)
  const running = ref(false)
  const ended = ref(false)

  const paddle = reactive(new Paddle())
  const ball = reactive(new Ball())
  const blocks = ref([])
  const powerUps = ref([])

  let raf = null

  function buildLevel(lvl) {
    blocks.value = []
    const cols = 7
    const rows = 3 + Math.min(lvl, 3)
    const span = CANVAS_W / (cols + 1)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 1) * span
        const y = 60 + r * 60
        const rnd = Math.random()
        const type = rnd < 0.7 ? BlockType.NORMAL : rnd < 0.9 ? BlockType.STRONG : BlockType.POWER
        const img = type === BlockType.STRONG ? images.block2 : type === BlockType.POWER ? images.block3 : images.block1
        blocks.value.push(new Block(x, y, type, img))
      }
    }
  }
  /*
  function resetBallPaddle() {
    Object.assign(ball, new Ball(CANVAS_W / 2, CANVAS_H / 2, 4 + level.value))
    Object.assign(paddle, new Paddle())
  }
  */
  function resetBallPaddle() {
    const baseSpeed = 2                       // <-- más lento que antes
    const speed = baseSpeed + (level.value - 1) * 0.8   // +0.8 por nivel
    Object.assign(ball, new Ball(CANVAS_W / 2, CANVAS_H / 2, speed))
    Object.assign(paddle, new Paddle())
  }

  function gameLoop() {
    if (!running.value) return
    // update
    ball.update()
    powerUps.value.forEach(p => p.update())
    powerUps.value = powerUps.value.filter(p => p.y < CANVAS_H)

    // paredes
    if (ball.x - ball.r < 0 || ball.x + ball.r > CANVAS_W) ball.dx *= -1
    if (ball.y - ball.r < 0) ball.dy *= -1

    // ----- choque con paredes (versión sin bucle) -----
    if (ball.x - ball.r <= 0) {
      ball.x = ball.r + 1          // sacar del borde
      ball.dx = Math.abs(ball.dx)  // derecha
    }
    if (ball.x + ball.r >= CANVAS_W) {
      ball.x = CANVAS_W - ball.r - 1
      ball.dx = -Math.abs(ball.dx) // izquierda
    }
    if (ball.y - ball.r <= 0) {
      ball.y = ball.r + 1
      ball.dy = Math.abs(ball.dy)  // abajo
    }


    // suelo
    if (ball.y + ball.r > CANVAS_H) {
      lives.value--
      if (lives.value <= 0) {
        ended.value = true
        running.value = false
        return
      }
      resetBallPaddle()
    }

    // paddle
    if (circleRectCollision(ball.x, ball.y, ball.r, paddle.x, paddle.y, paddle.w, paddle.h)) {
      ball.dy = -Math.abs(ball.dy)
      // ángulo según punto de impacto
      const hitPos = (ball.x - paddle.x) / paddle.w
      ball.dx = 8 * (hitPos - 0.5)
    }

    // bloques
  // dentro del loop de bloques (busca este bloque y reemplázalo)
  for (let i = blocks.value.length - 1; i >= 0; i--) {
    const b = blocks.value[i]
    if (b.collide(ball)) {          // <-- usamos el método collide del rectángulo
      b.hit()
      ball.dy *= -1
      if (b.destroyed) {
        blocks.value.splice(i, 1)
        score.value += b.type === BlockType.STRONG ? 20 : 10
        if (b.type === BlockType.POWER) {
          const powerType = Math.random() < 0.5 ? PowerType.BIG_PADDLE : PowerType.SLOW_BALL
          powerUps.value.push(new PowerUp(b.x + b.w / 2, b.y + b.h / 2, powerType))
        }
      }
    }
  }

    // power-ups vs paddle
    for (let i = powerUps.value.length - 1; i >= 0; i--) {
      const p = powerUps.value[i]
      if (circleRectCollision(p.x, p.y, p.r, paddle.x, paddle.y, paddle.w, paddle.h)) {
        if (p.type === PowerType.BIG_PADDLE) paddle.enlarge()
        if (p.type === PowerType.SLOW_BALL) ball.slow()
        powerUps.value.splice(i, 1)
      }
    }

    // nivel completado
    if (blocks.value.length === 0) {
      if (level.value >= MAX_LEVEL) {
        ended.value = true
        running.value = false
        return
      }
      level.value++
      buildLevel(level.value)
      resetBallPaddle()
    }

    raf = requestAnimationFrame(gameLoop)
  }

  function start() {
    buildLevel(1)
    resetBallPaddle()
    running.value = true
    gameLoop()
  }

  watch(running, v => v ? gameLoop() : cancelAnimationFrame(raf))

  return { score, level, lives, running, ended, paddle, ball, blocks, powerUps, start, onFaceMove: x => paddle.moveToHead(x) }
}