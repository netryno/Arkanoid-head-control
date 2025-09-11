import { PADDLE_W, PADDLE_H, CANVAS_H, CANVAS_W } from '../utils/constants.js'

export class Paddle {
  constructor(x = CANVAS_W / 2 - PADDLE_W / 2, y = CANVAS_H - 60) {
    this.x = x
    this.y = y
    this.w = PADDLE_W
    this.h = PADDLE_H
    this.baseW = PADDLE_W
  }
  moveToHead(normalizedX) {
    this.x = normalizedX * (CANVAS_W - this.w)
  }
  enlarge() {
    this.w = this.baseW * 1.5
    setTimeout(() => (this.w = this.baseW), 8000)
  }
  draw(ctx, img) {
    ctx.drawImage(img, this.x, this.y, this.w, this.h)
  }
}