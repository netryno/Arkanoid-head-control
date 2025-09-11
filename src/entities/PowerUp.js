import { BLOCK_RAD } from '../utils/constants.js'

export const PowerType = { BIG_PADDLE: 1, SLOW_BALL: 2 }

export class PowerUp {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.r = BLOCK_RAD * 0.7
    this.type = type
    this.dy = 2.5
  }
  update() {
    this.y += this.dy
  }
  draw(ctx) {
    ctx.fillStyle = this.type === PowerType.BIG_PADDLE ? '#0f0' : '#00f'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
  }
}