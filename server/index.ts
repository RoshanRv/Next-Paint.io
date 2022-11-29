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

const PORT = process.env.PORT || 3001

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
    socket.on("client-ready", () => {
        socket.broadcast.emit("get-state")
    })

    socket.on("canvas-state", (state: string) => {
        socket.broadcast.emit("canvas-state-from-server", state)
    })

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

httpServer.listen(PORT, () => {
    console.log("Server is running at 3001")
})
