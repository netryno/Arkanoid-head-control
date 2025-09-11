import { BLOCK_W, BLOCK_H } from '../utils/constants.js'

export class Block {
  constructor(x, y, type, img) {
    this.x = x
    this.y = y
    this.w = BLOCK_W
    this.h = BLOCK_H
    this.type = type
    this.img = img
    this.hits = type === 2 ? 2 : 1
  }
  hit() { this.hits-- }
  get destroyed() { return this.hits <= 0 }

  // colisión rectángulo-círculo (ball)
  collide(ball) {
    const closestX = Math.max(this.x, Math.min(ball.x, this.x + this.w))
    const closestY = Math.max(this.y, Math.min(ball.y, this.y + this.h))
    const dx = ball.x - closestX
    const dy = ball.y - closestY
    return dx * dx + dy * dy <= ball.r * ball.r
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
  }
}

export const BlockType = {
  NORMAL: 1,
  STRONG: 2,
  POWER: 3
}