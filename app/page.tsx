"use client"

import { useState } from "react"
import useDraw from "../hooks/useDraw"
import { SketchPicker, CirclePicker } from "react-color"

export default function Home() {
    const [color, setColor] = useState("#000")

    const onDraw = ({ currentPoints, prePoints, ctx }: OnDraw) => {
        const { x: currX, y: currY } = currentPoints
        const lineColor = color
        const lineWidth = 5

        let startingPoint = prePoints ?? currentPoints
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(startingPoint.x, startingPoint.y)
        ctx.lineTo(currX, currY)
        ctx.stroke()

        ctx.fillStyle = lineColor
        ctx.beginPath()
        ctx.arc(startingPoint.x, startingPoint.y, 2, 0, 2 * Math.PI)
        ctx.fill()
    }

    const { canvasRef, onMouseDown, handleClear } = useDraw(onDraw)

    return (
        <main
            style={{ backgroundImage: "url(bg.svg)", backgroundSize: "cover" }}
            className="w-full h-screen py-10"
        >
            {/*   Title    */}
            <h1 className="p-2 mx-auto text-3xl font-bold text-center text-white bg-black rounded-md md:text-5xl w-max ">
                Next-Paint.io
            </h1>
            <div className="flex items-center justify-center w-full mt-20 gap-x-10 ">
                <div className="flex flex-col gap-4">
                    <div className="p-4 pt-2 bg-white border-2 border-black rounded-lg">
                        <h1 className="pb-3 text-xl text-center">Pick Color</h1>
                        <CirclePicker
                            color={color}
                            onChange={(e) => setColor(e.hex)}
                        />
                    </div>
                    <button
                        onClick={() => handleClear(setColor)}
                        className="px-8 py-2 m-2 bg-white border-2 border-black rounded-md"
                    >
                        Clear
                    </button>
                </div>
                <canvas
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    className="bg-white border-2 border-black rounded-md"
                    width={750}
                    height={750}
                />
            </div>
        </main>
    )
}
