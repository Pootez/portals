class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  draw() {
    stroke(255)
    strokeWeight(2)
    line(this.x1, this.y1, this.x2, this.y2)
  }

  intersect(line) {
    let temp = this.intersectInfo(line)
    if (
      temp != false &&
      temp.t >= -0.01 &&
      temp.t <= 1.01 &&
      temp.u >= -0.01 &&
      temp.u <= 1.01
    ) {
      return {
        x: temp.x,
        y: temp.y,
      }
    } else {
      return false
    }
  }

  ray(line) {
    let temp = this.intersectInfo(line)
    return temp != false && -0.001 <= temp.u && temp.u <= 1.001 && temp.t > 0
      ? {
          x: temp.x,
          y: temp.y,
          t: temp.t,
        }
      : false
  }

  getVector() {
    return {
      x: this.x2 - this.x1,
      y: this.y2 - this.y1,
    }
  }

  intersectInfo(line) {
    const t1 =
      (this.x1 - line.x1) * (line.y1 - line.y2) -
      (this.y1 - line.y1) * (line.x1 - line.x2)
    const t2 =
      (this.x1 - this.x2) * (line.y1 - line.y2) -
      (this.y1 - this.y2) * (line.x1 - line.x2)
    let t = t1 / t2

    const u1 =
      (this.x1 - line.x1) * (this.y1 - this.y2) -
      (this.y1 - line.y1) * (this.x1 - this.x2)
    const u2 =
      (this.x1 - this.x2) * (line.y1 - line.y2) -
      (this.y1 - this.y2) * (line.x1 - line.x2)
    let u = u1 / u2

    let v1 = this.getVector()
    let v2 = line.getVector()

    let x = v1.x * t + this.x1
    let y = v1.y * t + this.y1

    let s = this.sharesPoint(line)

    return v1.y / v1.x == v2.y / v2.x || s[0] || s[1]
      ? false
      : {
          x: x,
          y: y,
          t: t,
          u: u,
        }
  }

  sharesPoint(line) {
    return [
      (this.x1 == line.x1 && this.y1 == line.y1) ||
        (this.x1 == line.x2 && this.y1 == line.y2),
      (this.x2 == line.x2 && this.y2 == line.y2) ||
        (this.x2 == line.x1 && this.y2 == line.y1),
    ]
  }

  translate(xOff, yOff, ang) {
    let aT = rotation(this.x1, this.y1, ang)
    let bT = rotation(this.x2, this.y2, ang)

    return new Line(aT.x + xOff, aT.y + yOff, bT.x + xOff, bT.y + yOff)
  }
}
