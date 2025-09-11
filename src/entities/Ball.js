import { BALL_RAD, CANVAS_W, CANVAS_H } from '../utils/constants.js'

export class Ball {
  constructor(x = CANVAS_W / 2, y = CANVAS_H / 2, speed = 4) {
    this.x = x
    this.y = y
    this.dx = speed
    this.dy = -speed
    this.r = BALL_RAD
    this.baseSpeed = speed
  }
  update() {
    this.x += this.dx
    this.y += this.dy
  }
  slow() {
    this.dx *= 0.6
    this.dy *= 0.6
    setTimeout(() => {
      this.dx = Math.sign(this.dx) * this.baseSpeed
      this.dy = Math.sign(this.dy) * this.baseSpeed
    }, 6000)
  }
  draw(ctx, img) {
    ctx.drawImage(img, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2)
  }
}