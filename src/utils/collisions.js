export function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw))
  const closestY = Math.max(ry, Math.min(cy, ry + rh))
  const dx = cx - closestX
  const dy = cy - closestY
  return dx * dx + dy * dy <= r * r
}

export function circleCircleCollision(c1, c2) {
  const dx = c1.x - c2.x
  const dy = c1.y - c2.y
  const rr = c1.r + c2.r
  return dx * dx + dy * dy <= rr * rr
}