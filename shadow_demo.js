
let main

function setup() {
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
    localStorage.setItem("SceneLinesdemo", '[{"x1":-50,"y1":-100,"x2":-50,"y2":100},{"x1":-50,"y1":-100,"x2":-100,"y2":-100},{"x1":-100,"y1":-100,"x2":-100,"y2":-50},{"x1":-100,"y1":-50,"x2":-50,"y2":-50},{"x1":-50,"y1":100,"x2":-100,"y2":100},{"x1":-100,"y1":100,"x2":-100,"y2":50},{"x1":-100,"y1":50,"x2":-50,"y2":50},{"x1":50,"y1":-100,"x2":50,"y2":100},{"x1":50,"y1":-100,"x2":100,"y2":-100},{"x1":100,"y1":-100,"x2":100,"y2":-50},{"x1":100,"y1":-50,"x2":50,"y2":-50},{"x1":50,"y1":100,"x2":100,"y2":100},{"x1":100,"y1":100,"x2":100,"y2":50},{"x1":100,"y1":50,"x2":50,"y2":50}]')
    localStorage.setItem("ScenePortalsdemo", '{"a":{"x1":-99.9,"y1":-50,"x2":-50.05,"y2":50},"b":{"x1":50.5,"y1":-50,"x2":99.9,"y2":50}}')
    main = new Scene("demo")
    main.read()
}

function draw() {
    resizeCanvas(windowWidth, windowHeight)
    translate(windowWidth / 2, windowHeight / 2)
    background(125)

    let mouseMove = new Line(pmouseX - windowWidth / 2, pmouseY - windowHeight / 2, mouseX - windowWidth / 2, mouseY - windowHeight / 2)
    let tr = main.portals.getTranslations()
    if (mouseMove.intersect(main.portals.a) != false) {
        main.lines = main.translate(tr[1].xOff, tr[1].yOff, tr[1].ang)
        main.portals.b = main.portals.a.translate(tr[1].xOff, tr[1].yOff, tr[1].ang)
    } else if (mouseMove.intersect(main.portals.b) != false) {
        main.lines = main.translate(tr[0].xOff, tr[0].yOff, tr[0].ang)
        main.portals.a = main.portals.b.translate(tr[0].xOff, tr[0].yOff, tr[0].ang)
    }

    new Scene("proj", [], main.portals.project(mouseX - windowWidth / 2, mouseY - windowHeight / 2, main.lines)).drawShadows(mouseX - windowWidth / 2, mouseY - windowHeight / 2)
}