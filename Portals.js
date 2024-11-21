class Portals {
  constructor(a, b) {
    this.a = a
    this.b = b
  }

  drawPortals() {
    stroke('red')
    strokeWeight(3)
    line(this.a.x1, this.a.y1, this.a.x2, this.a.y2)
    stroke('blue')
    line(this.b.x1, this.b.y1, this.b.x2, this.b.y2)
  }

  project(x, y, lines) {
    let l = [...lines]
    let re = []
    let T = this.getTranslations()
    let AB = T[0]
    let BA = T[1]

    let xyAB = rotation(x, y, AB.ang)
    xyAB.x += AB.xOff
    xyAB.y += AB.yOff
    let xyBA = rotation(x, y, BA.ang)
    xyBA.x += BA.xOff
    xyBA.y += BA.yOff

    let AaAng = atan2(y - this.a.y1, x - this.a.x1) + PI
    let AbAng = atan2(y - this.a.y2, x - this.a.x2) + PI
    let BaAng = atan2(y - this.b.y1, x - this.b.x1) + PI
    let BbAng = atan2(y - this.b.y2, x - this.b.x2) + PI

    let Aa = new Line(
      this.a.x1,
      this.a.y1,
      this.a.x1 + cos(AaAng) * 20,
      this.a.y1 + sin(AaAng) * 20
    )
    let Ab = new Line(
      this.a.x2,
      this.a.y2,
      this.a.x2 + cos(AbAng) * 20,
      this.a.y2 + sin(AbAng) * 20
    )
    let Ba = new Line(
      this.b.x1,
      this.b.y1,
      this.b.x1 + cos(BaAng) * 20,
      this.b.y1 + sin(BaAng) * 20
    )
    let Bb = new Line(
      this.b.x2,
      this.b.y2,
      this.b.x2 + cos(BbAng) * 20,
      this.b.y2 + sin(BbAng) * 20
    )

    let temp = []

    for (const line of l) {
      let ray = this.a.getVector()
      let posLeft = ray.x * -(y - this.a.y1) + ray.y * (x - this.a.x1) <= 0
      let aLeft =
        ray.x * -(line.y1 - this.a.y1) + ray.y * (line.x1 - this.a.x1) > 0
      let bLeft =
        ray.x * -(line.y2 - this.a.y1) + ray.y * (line.x2 - this.a.x1) > 0

      if (posLeft == aLeft && posLeft == bLeft) {
        temp.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && !posLeft == bLeft) {
        re.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x2, line.y2, inter.x, inter.y))
        re.push(new Line(inter.x, inter.y, line.x1, line.y1))
      } else if (posLeft == aLeft && !posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x1, line.y1, inter.x, inter.y))
        re.push(new Line(inter.x, inter.y, line.x2, line.y2))
      }
    }

    let AaV = Aa.getVector()
    let AbV = Ab.getVector()
    for (const line of temp) {
      let aRay = Aa.ray(line)
      let bRay = Ab.ray(line)
      // x = (line.x1 - x) y = (line.y1 - y)
      let aleftb = AaV.x * -AbV.y + AaV.y * AbV.x < 0
      let leftright =
        (line.x1 - x) * -(line.y2 - y) + (line.y1 - y) * (line.x2 - x) < 0
      let rightofa = AaV.x * -(line.y1 - y) + AaV.y * (line.x1 - x) > 0
      let leftofb = AbV.x * -(line.y1 - y) + AbV.y * (line.x1 - x) < 0
      if (aRay != false && bRay != false) {
        if (aleftb == leftright) {
          re.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
          re.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        } else {
          re.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
          re.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (aRay != false) {
        if (aleftb == leftright) {
          re.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
        } else {
          re.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (bRay != false) {
        if (aleftb == !leftright) {
          re.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
        } else {
          re.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        }
      } else if (rightofa == !leftofb) {
        re.push(line)
      }
    }

    temp = [...re]
    let tempb = []
    re = []

    for (const line of temp) {
      let ray = this.b.getVector()
      let posLeft = ray.x * -(y - this.b.y1) + ray.y * (x - this.b.x1) <= 0
      let aLeft =
        ray.x * -(line.y1 - this.b.y1) + ray.y * (line.x1 - this.b.x1) > 0
      let bLeft =
        ray.x * -(line.y2 - this.b.y1) + ray.y * (line.x2 - this.b.x1) > 0

      if (posLeft == aLeft && posLeft == bLeft) {
        tempb.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && !posLeft == bLeft) {
        re.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && posLeft == bLeft) {
        let inter = this.b.intersectInfo(line)
        tempb.push(new Line(line.x2, line.y2, inter.x, inter.y))
        re.push(new Line(inter.x, inter.y, line.x1, line.y1))
      } else if (posLeft == aLeft && !posLeft == bLeft) {
        let inter = this.b.intersectInfo(line)
        tempb.push(new Line(line.x1, line.y1, inter.x, inter.y))
        re.push(new Line(inter.x, inter.y, line.x2, line.y2))
      }
    }

    let BaV = Ba.getVector()
    let BbV = Bb.getVector()
    for (const line of tempb) {
      let aRay = Ba.ray(line)
      let bRay = Bb.ray(line)
      // x = (line.x1 - x) y = (line.y1 - y)
      let aleftb = BaV.x * -BbV.y + BaV.y * BbV.x < 0
      let leftright =
        (line.x1 - x) * -(line.y2 - y) + (line.y1 - y) * (line.x2 - x) < 0
      let rightofa = BaV.x * -(line.y1 - y) + BaV.y * (line.x1 - x) > 0
      let leftofb = BbV.x * -(line.y1 - y) + BbV.y * (line.x1 - x) < 0
      if (aRay != false && bRay != false) {
        if (aleftb == leftright) {
          re.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
          re.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        } else {
          re.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
          re.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (aRay != false) {
        if (aleftb == leftright) {
          re.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
        } else {
          re.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (bRay != false) {
        if (aleftb == !leftright) {
          re.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
        } else {
          re.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        }
      } else if (rightofa == !leftofb) {
        re.push(line)
      }
    }

    let AaT = Aa.translate(AB.xOff, AB.yOff, AB.ang)
    let AbT = Ab.translate(AB.xOff, AB.yOff, AB.ang)

    let Al = []
    let Bl = []
    temp = []

    for (const line of l) {
      let ray = this.b.getVector()
      let posLeft =
        ray.x * -(xyAB.y - this.b.y1) + ray.y * (xyAB.x - this.b.x1) <= 0
      let aLeft =
        ray.x * -(line.y1 - this.b.y1) + ray.y * (line.x1 - this.b.x1) > 0
      let bLeft =
        ray.x * -(line.y2 - this.b.y1) + ray.y * (line.x2 - this.b.x1) > 0

      if (posLeft == aLeft && posLeft == bLeft) {
        temp.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && !posLeft == bLeft) {
      } else if (!posLeft == aLeft && posLeft == bLeft) {
        let inter = this.b.intersectInfo(line)
        temp.push(new Line(line.x2, line.y2, inter.x, inter.y))
      } else if (posLeft == aLeft && !posLeft == bLeft) {
        let inter = this.b.intersectInfo(line)
        temp.push(new Line(line.x1, line.y1, inter.x, inter.y))
      }
    }

    let BaT = Ba.translate(BA.xOff, BA.yOff, BA.ang)
    let BbT = Bb.translate(BA.xOff, BA.yOff, BA.ang)

    BaV = AaT.getVector()
    BbV = AbT.getVector()

    // .translate(BA.xOff, BA.yOff, BA.ang)

    for (const line of temp) {
      let aRay = AaT.ray(line)
      let bRay = AbT.ray(line)
      // x = (line.x1 - x) y = (line.y1 - y)
      let aleftb = BaV.x * -BbV.y + BaV.y * BbV.x < 0
      let leftright =
        (line.x1 - xyAB.x) * -(line.y2 - xyAB.y) +
          (line.y1 - xyAB.y) * (line.x2 - xyAB.x) <
        0
      let rightofa =
        BaV.x * -(line.y1 - xyAB.y) + BaV.y * (line.x1 - xyAB.x) > 0
      let leftofb = BbV.x * -(line.y1 - xyAB.y) + BbV.y * (line.x1 - xyAB.x) < 0
      if (aRay != false && bRay != false) {
        Al.push(new Line(aRay.x, aRay.y, bRay.x, bRay.y))
      } else if (aRay != false) {
        if (aleftb == leftright) {
          Al.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        } else {
          Al.push(new Line(aRay.x, aRay.y, line.x1, line.y1))
        }
      } else if (bRay != false) {
        if (aleftb == !leftright) {
          Al.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        } else {
          Al.push(new Line(bRay.x, bRay.y, line.x1, line.y1))
        }
      } else if (
        (!aleftb && rightofa && leftofb) ||
        (aleftb && !rightofa && !leftofb)
      ) {
        Al.push(line)
      }
    }

    temp = []
    for (const line of l) {
      let ray = this.a.getVector()
      let posLeft =
        ray.x * -(xyBA.y - this.a.y1) + ray.y * (xyBA.x - this.a.x1) <= 0
      let aLeft =
        ray.x * -(line.y1 - this.a.y1) + ray.y * (line.x1 - this.a.x1) > 0
      let bLeft =
        ray.x * -(line.y2 - this.a.y1) + ray.y * (line.x2 - this.a.x1) > 0

      if (posLeft == aLeft && posLeft == bLeft) {
        temp.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && !posLeft == bLeft) {
      } else if (!posLeft == aLeft && posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x2, line.y2, inter.x, inter.y))
      } else if (posLeft == aLeft && !posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x1, line.y1, inter.x, inter.y))
      }
    }

    AaV = BaT.getVector()
    AbV = BbT.getVector()

    // .translate(BA.xOff, BA.yOff, BA.ang)

    for (const line of temp) {
      let aRay = BaT.ray(line)
      let bRay = BbT.ray(line)
      // x = (line.x1 - x) y = (line.y1 - y)
      let aleftb = AaV.x * -AbV.y + AaV.y * AbV.x < 0
      let leftright =
        (line.x1 - xyBA.x) * -(line.y2 - xyBA.y) +
          (line.y1 - xyBA.y) * (line.x2 - xyBA.x) <
        0
      let rightofa =
        AaV.x * -(line.y1 - xyBA.y) + AaV.y * (line.x1 - xyBA.x) > 0
      let leftofb = AbV.x * -(line.y1 - xyBA.y) + AbV.y * (line.x1 - xyBA.x) < 0
      if (aRay != false && bRay != false) {
        Bl.push(new Line(aRay.x, aRay.y, bRay.x, bRay.y))
      } else if (aRay != false) {
        if (aleftb == leftright) {
          Bl.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        } else {
          Bl.push(new Line(aRay.x, aRay.y, line.x1, line.y1))
        }
      } else if (bRay != false) {
        if (aleftb == !leftright) {
          Bl.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        } else {
          Bl.push(new Line(bRay.x, bRay.y, line.x1, line.y1))
        }
      } else if (
        (!aleftb && rightofa && leftofb) ||
        (aleftb && !rightofa && !leftofb)
      ) {
        Bl.push(line)
      }
    }

    let AlTtemp = []
    for (const line of Al) {
      AlTtemp.push(line.translate(BA.xOff, BA.yOff, BA.ang))
    }
    let BlTtemp = []
    for (const line of Bl) {
      BlTtemp.push(line.translate(AB.xOff, AB.yOff, AB.ang))
    }

    let AlT = []
    temp = []

    BaV = Ba.getVector()
    BbV = Bb.getVector()

    for (const line of AlTtemp) {
      let ray = this.b.getVector()
      let posLeft = ray.x * -(y - this.b.y1) + ray.y * (x - this.b.x1) <= 0
      let aLeft =
        ray.x * -(line.y1 - this.b.y1) + ray.y * (line.x1 - this.b.x1) > 0
      let bLeft =
        ray.x * -(line.y2 - this.b.y1) + ray.y * (line.x2 - this.b.x1) > 0

      if (posLeft == aLeft && posLeft == bLeft) {
        temp.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && !posLeft == bLeft) {
        AlT.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x2, line.y2, inter.x, inter.y))
        AlT.push(new Line(inter.x, inter.y, line.x1, line.y1))
      } else if (posLeft == aLeft && !posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x1, line.y1, inter.x, inter.y))
        AlT.push(new Line(inter.x, inter.y, line.x2, line.y2))
      }
    }

    for (const line of temp) {
      let aRay = Ba.ray(line)
      let bRay = Bb.ray(line)
      // x = (line.x1 - x) y = (line.y1 - y)
      let aleftb = BaV.x * -BbV.y + BaV.y * BbV.x < 0
      let leftright =
        (line.x1 - x) * -(line.y2 - y) + (line.y1 - y) * (line.x2 - x) < 0
      let rightofa = BaV.x * -(line.y1 - y) + BaV.y * (line.x1 - x) > 0
      let leftofb = BbV.x * -(line.y1 - y) + BbV.y * (line.x1 - x) < 0
      if (aRay != false && bRay != false) {
        if (aleftb == leftright) {
          AlT.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
          AlT.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        } else {
          AlT.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
          AlT.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (aRay != false) {
        if (aleftb == leftright) {
          AlT.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
        } else {
          AlT.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (bRay != false) {
        if (aleftb == !leftright) {
          AlT.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
        } else {
          AlT.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        }
      } else if (rightofa == !leftofb) {
        AlT.push(line)
      }
    }

    let BlT = []
    temp = []

    AaV = Aa.getVector()
    AbV = Ab.getVector()

    for (const line of BlTtemp) {
      let ray = this.a.getVector()
      let posLeft = ray.x * -(y - this.a.y1) + ray.y * (x - this.a.x1) <= 0
      let aLeft =
        ray.x * -(line.y1 - this.a.y1) + ray.y * (line.x1 - this.a.x1) > 0
      let bLeft =
        ray.x * -(line.y2 - this.a.y1) + ray.y * (line.x2 - this.a.x1) > 0

      if (posLeft == aLeft && posLeft == bLeft) {
        temp.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && !posLeft == bLeft) {
        AlT.push(new Line(line.x1, line.y1, line.x2, line.y2))
      } else if (!posLeft == aLeft && posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x2, line.y2, inter.x, inter.y))
        AlT.push(new Line(inter.x, inter.y, line.x1, line.y1))
      } else if (posLeft == aLeft && !posLeft == bLeft) {
        let inter = this.a.intersectInfo(line)
        temp.push(new Line(line.x1, line.y1, inter.x, inter.y))
        AlT.push(new Line(inter.x, inter.y, line.x2, line.y2))
      }
    }

    for (const line of temp) {
      let aRay = Aa.ray(line)
      let bRay = Ab.ray(line)
      // x = (line.x1 - x) y = (line.y1 - y)
      let aleftb = AaV.x * -AbV.y + AaV.y * AbV.x < 0
      let leftright =
        (line.x1 - x) * -(line.y2 - y) + (line.y1 - y) * (line.x2 - x) < 0
      let rightofa = AaV.x * -(line.y1 - y) + AaV.y * (line.x1 - x) > 0
      let leftofb = AbV.x * -(line.y1 - y) + AbV.y * (line.x1 - x) < 0
      if (aRay != false && bRay != false) {
        if (aleftb == leftright) {
          AlT.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
          AlT.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        } else {
          AlT.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
          AlT.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (aRay != false) {
        if (aleftb == leftright) {
          AlT.push(new Line(line.x1, line.y1, aRay.x, aRay.y))
        } else {
          AlT.push(new Line(aRay.x, aRay.y, line.x2, line.y2))
        }
      } else if (bRay != false) {
        if (aleftb == !leftright) {
          AlT.push(new Line(line.x1, line.y1, bRay.x, bRay.y))
        } else {
          AlT.push(new Line(bRay.x, bRay.y, line.x2, line.y2))
        }
      } else if (rightofa == !leftofb) {
        AlT.push(line)
      }
    }

    //fill(255)
    //noStroke()
    //arc(xyAB.x, xyAB.y, 10, 10, 0, TWO_PI)
    //arc(xyBA.x, xyBA.y, 10, 10, 0, TWO_PI)
    //new Line(xyAB.x,xyAB.y,this.b.x2,this.b.y2).draw()
    //new Line(xyAB.x,xyAB.y,this.b.x1,this.b.y1).draw()
    //new Line(xyBA.x,xyBA.y,this.a.x1,this.a.y1).draw()
    //new Line(xyBA.x,xyBA.y,this.a.x2,this.a.y2).draw()
    //BaT.draw()
    //BbT.draw()
    //fill(60)
    //triangle(xyAB.x,xyAB.y,AaT.x2,AaT.y2,AbT.x2,AbT.y2)
    //this.drawPortals()

    return re.concat(AlT, BlT)
  }

  getTranslations() {
    let aV = this.a.getVector()
    let bV = this.b.getVector()
    let aX = this.a.x1
    let aY = this.a.y1
    let bX = this.b.x1
    let bY = this.b.y1
    let aAng = atan2(aV.y, aV.x)
    let bAng = atan2(bV.y, bV.x)

    let ABT = rotation(aX, aY, bAng - aAng)
    let AB = {
      xOff: bX - ABT.x,
      yOff: bY - ABT.y,
      ang: bAng - aAng,
    }

    let BAT = rotation(bX, bY, aAng - bAng)
    let BA = {
      xOff: aX - BAT.x,
      yOff: aY - BAT.y,
      ang: aAng - bAng,
    }

    return [AB, BA]
  }
}
