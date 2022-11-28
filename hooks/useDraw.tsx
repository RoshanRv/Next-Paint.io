import { useEffect, useRef, useState } from "react"

const useDraw = (
    onDraw: ({ ctx, prePoints, currentPoints }: OnDraw) => void
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prePoint = useRef<null | Points>(null)

    const [isMouseDown, setIsMouseDown] = useState(false)

    const onMouseDown = () => setIsMouseDown(true)

    const handleClear = (setColor: (setColor: any) => void) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        setColor("#000")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (!isMouseDown) return

            const currentPoints = getCurrentPoints(e)

            const ctx = canvasRef.current?.getContext("2d")

            if (!currentPoints || !ctx) return

            onDraw({ ctx, currentPoints, prePoints: prePoint.current })
            prePoint.current = currentPoints
        }

        const getCurrentPoints = (e: MouseEvent) => {
            const canvas = canvasRef.current

            if (!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return { x, y }
        }

        const handleMouseUp = () => {
            setIsMouseDown(false)
            prePoint.current = null
        }

        canvasRef.current?.addEventListener("mousemove", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            canvasRef.current?.removeEventListener("mousemove", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [onDraw])

    return { canvasRef, onMouseDown, handleClear }
}

export default useDraw
