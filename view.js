
let main

function setup() {
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
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
    //main.drawPoints()
    main.drawLines()
    main.portals.drawPortals()
    //new Scene("proj", [], main.portals.project(mouseX - windowWidth / 2, mouseY - windowHeight / 2, main.lines)).drawLines()
}