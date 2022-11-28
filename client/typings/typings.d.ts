interface OnDraw {
    currentPoints: Points
    prePoints: Points | null
    ctx: CanvasRenderingContext2D
}

interface OnDrawSocketProps {
    currentPoints: Points
    prePoints: Points | null
    color: string
    size: SizeProps[size]
}

interface Points {
    x: number
    y: number
}

interface ColorCicleProps {
    style: "small" | "mid" | "large"
    size: SizeProps[size]
    setSize: (size: SizeProps[size]) => void
}

interface SizeProps {
    size: 5 | 7.5 | 10
}
