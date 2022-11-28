interface OnDraw {
    currentPoints: Points
    prePoints: Points | null
    ctx: CanvasRenderingContext2D
}

interface Points {
    x: number
    y: number
}
