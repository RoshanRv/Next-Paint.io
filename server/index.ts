import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
})

interface OnDrawSocketProps {
    currentPoints: Points
    prePoints: Points | null
    color: string
    size: 5 | 7.5 | 10
}

interface Points {
    x: number
    y: number
}

io.on("connection", (socket) => {
    socket.on(
        "onDraw",
        ({ currentPoints, prePoints, color, size }: OnDrawSocketProps) => {
            socket.broadcast.emit("onDraw", {
                currentPoints,
                prePoints,
                color,
                size,
            })
        }
    )
    socket.on("handleClear", () => {
        io.emit("handleClear")
    })
})

httpServer.listen(3001, () => {
    console.log("Server is running at 3001")
})
