function rotation(x, y, ang) {
    return {
        x: x * cos(ang) - y * sin(ang),
        y: x * sin(ang) + y * cos(ang)
    }
}
