
class Scene {
    constructor(name = "1", portals = null, lines = []) {
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
        this.lines.forEach(obj => { if (obj.x1 == x1 && obj.y1 == y1 && obj.x2 == x2 && obj.y2 == y2) { exists = true } })
        console.log(exists)
        if (!exists) { this.lines.push(new Line(x1, y1, x2, y2)) }
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
        let temp = localStorage.getItem("SceneLines" + this.name)
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
        localStorage.setItem("SceneLines" + this.name, JSON.stringify(this.lines))
    }

    readPortals() {
        let temp = localStorage.getItem("ScenePortals" + this.name)
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
        localStorage.setItem("ScenePortals" + this.name, JSON.stringify(this.portals))
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
        temp.forEach(
            obj1 => temp.forEach(
                obj2 => {
                    let a = obj1.intersect(obj2)
                    if (a != false) {
                        let b = true
                        points.forEach(obj => {
                            if (obj.x == a.x && obj.y == a.y) {
                                b = false
                            }
                        })
                        b && points.push({ x: a.x, y: a.y })
                    }
                }
            )
        )

        for (const l of this.lines) {
            let a = true
            points.forEach(obj => { if (obj.x == l.x1 && obj.y == l.y1) { a = false } })
            a && points.push({ x: l.x1, y: l.y1 })
            let b = true
            points.forEach(obj => { if (obj.x == l.x2 && obj.y == l.y2) { b = false } })
            b && points.push({ x: l.x2, y: l.y2 })
        }
        return points
    }

    drawShadows(x, y) {
        let l = [...this.lines]
        //l.push(
        //    new Line(-windowWidth, -windowHeight, windowWidth, -windowHeight),
        //    new Line(windowWidth, -windowHeight, windowWidth, windowHeight),
        //    new Line(windowWidth, windowHeight, -windowWidth, windowHeight),
        //    new Line(-windowWidth, windowHeight, -windowWidth, -windowHeight)
        //)
        this.update()

        let p = this.points.map(obj => atan2(obj.y - y, obj.x - x)).sort((a, b) => a - b)
        p.push(p[0])
        let rays = []
        p.forEach(ang => rays.push(new Line(x, y, x + cos(ang), y + sin(ang))))

        let visableLine = []
        noStroke()
        fill(100)
        stroke(100)
        for (let i = 0; i < p.length - 1; i++) {
            let aRay, bRay
            aRay = rays[i]
            bRay = rays[i + 1]

            let ang = (p[i] + p[i + 1]) / 2
            i + 1 == p.length - 1 && (ang += PI)
            let ray = new Line(x, y, x + cos(ang), y + sin(ang))


            let rayLines = l.filter(obj => ray.ray(obj) != false).sort(((a, b) => ray.ray(a).t - ray.ray(b).t))
            let line = rayLines.length > 0 ? rayLines[0] : null

            let aV = aRay.getVector()
            let bV = bRay.getVector()
            let bool = (aV.x) * -(bV.y) + (aV.y) * (bV.x) < 0

            if (bool) {
                if (line != null) {
                    let a = aRay.intersectInfo(line)
                    let b = bRay.intersectInfo(line)
                    visableLine.push(new Line(a.x, a.y, b.x, b.y))

                    let mV = ray.getVector()
                    beginShape()
                    vertex(a.x,a.y)
                    vertex(aV.x*10000,aV.y*10000)
                    vertex(mV.x*10000,mV.y*10000)
                    vertex(bV.x*10000,bV.y*10000)
                    vertex(b.x,b.y)
                    endShape()
                }
            }
        }
        visableLine.forEach(obj => obj.draw())
    }
}