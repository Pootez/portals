class Scene {
  constructor(name = '1', portals = null, lines = []) {
    this.name = name
    this.portals = portals
    this.lines = lines
    this.points = []
  }

  update() {
    this.updatePoints()
  }

  updatePoints() {
    this.points = this.getPoints()
  }

  addLine(x1, y1, x2, y2) {
    let exists = false
    console.log(exists)
    this.lines.forEach((obj) => {
      if (obj.x1 == x1 && obj.y1 == y1 && obj.x2 == x2 && obj.y2 == y2) {
        exists = true
      }
    })
    console.log(exists)
    if (!exists) {
      this.lines.push(new Line(x1, y1, x2, y2))
    }
    this.points = this.getPoints()
  }

  drawLines() {
    stroke(255)
    strokeWeight(2)
    for (const l of this.lines) {
      l.draw()
    }
  }

  read() {
    this.lines = this.readLines()
    this.portals = this.readPortals()
  }

  write() {
    this.writeLines()
    this.readLines()
  }

  readLines() {
    let temp = localStorage.getItem('SceneLines' + this.name)
    if (temp == null) {
      return []
    } else {
      temp = JSON.parse(temp)
      let l = []
      for (const a of temp) {
        l.push(new Line(a.x1, a.y1, a.x2, a.y2))
      }
      return l
    }
  }

  writeLines() {
    localStorage.setItem('SceneLines' + this.name, JSON.stringify(this.lines))
  }

  readPortals() {
    let temp = localStorage.getItem('ScenePortals' + this.name)
    if (temp == null) {
      return null
    } else {
      temp = JSON.parse(temp)
      return new Portals(
        new Line(temp.a.x1, temp.a.y1, temp.a.x2, temp.a.y2),
        new Line(temp.b.x1, temp.b.y1, temp.b.x2, temp.b.y2)
      )
    }
  }

  writePortals() {
    localStorage.setItem(
      'ScenePortals' + this.name,
      JSON.stringify(this.portals)
    )
  }

  translate(xOff, yOff, ang) {
    let newLines = []
    for (const line of this.lines) {
      newLines.push(line.translate(xOff, yOff, ang))
    }
    return newLines
  }

  drawPoints() {
    fill(255)
    noStroke()
    for (const point of this.points) {
      arc(point.x, point.y, 10, 10, 0, TWO_PI)
    }
  }

  getPoints() {
    let points = []
    let temp = [...this.lines]
    let intersections = []
    temp.forEach((obj1) =>
      temp.forEach((obj2) => {
        let a = obj1.intersect(obj2)
        if (a != false) {
          let b = true
          points.forEach((obj) => {
            if (obj.x == a.x && obj.y == a.y) {
              b = false
            }
          })
          b && points.push({ x: a.x, y: a.y })
        }
      })
    )

    for (const l of this.lines) {
      let a = true
      points.forEach((obj) => {
        if (obj.x == l.x1 && obj.y == l.y1) {
          a = false
        }
      })
      a && points.push({ x: l.x1, y: l.y1 })
      let b = true
      points.forEach((obj) => {
        if (obj.x == l.x2 && obj.y == l.y2) {
          b = false
        }
      })
      b && points.push({ x: l.x2, y: l.y2 })
    }
    return points
  }

  drawShadows(x, y) {
    let lines = [...this.lines]
    this.update()

    let sortedAngles = this.points
      .map((point) => atan2(point.y - y, point.x - x))
      .sort((a, b) => a - b)
    sortedAngles.push(sortedAngles[0])
    let rays = sortedAngles.map(
      (angle) => new Line(x, y, x + cos(angle), y + sin(angle))
    )

    let visableLine = []
    noStroke()
    fill(100)
    stroke(100)
    for (let i = 0; i < sortedAngles.length - 1; i++) {
      let leftRay, rightRay
      leftRay = rays[i]
      rightRay = rays[i + 1]

      let aV = leftRay.getVector()
      let bV = rightRay.getVector()
      let angleThreshold = aV.x * -bV.y + aV.y * bV.x < 0 // If angle between rays is less than 180

      if (angleThreshold) {
        let middleAngle = (sortedAngles[i] + sortedAngles[i + 1]) / 2 // Get the average of the two angles
        i + 1 == sortedAngles.length - 1 && (middleAngle += PI) // When the second angle is the smallest, add PI to the average (2PI one of the angles)
        let middleRay = new Line(
          x,
          y,
          x + cos(middleAngle),
          y + sin(middleAngle)
        ) // Create a ray from middle angle

        let rayLines = lines
          .map((line) => {
            return { line, ray: middleRay.ray(line) }
          }) // Get ray to line segment
          .filter(({ ray }) => !!ray) // If ray intersects
          .toSorted(({ ray: aRay }, { ray: bRay }) => aRay.t - bRay.t) // Sort by closest line segment
          .map(({ line }) => line) // Return line
        let closestSegment = rayLines.length > 0 ? rayLines[0] : null // Get closest line segment

        if (closestSegment != null) {
          let leftIntersect = leftRay.intersectInfo(closestSegment)
          let rightIntersect = rightRay.intersectInfo(closestSegment)
          visableLine.push(
            new Line(
              leftIntersect.x,
              leftIntersect.y,
              rightIntersect.x,
              rightIntersect.y
            )
          )

          let mV = middleRay.getVector()
          beginShape()
          vertex(leftIntersect.x, leftIntersect.y)
          vertex(aV.x * 10000 + x, aV.y * 10000 + y)
          vertex(mV.x * 10000 + x, mV.y * 10000 + y)
          vertex(bV.x * 10000 + x, bV.y * 10000 + y)
          vertex(rightIntersect.x, rightIntersect.y)
          endShape()
        }
      }
    }
    visableLine.forEach((obj) => obj.draw())
  }
}
