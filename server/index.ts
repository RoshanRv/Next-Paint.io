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
    roomId: string
}

interface Points {
    x: number
    y: number
}

io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId }: { roomId: string }) => {
        socket.join(roomId)
    })

    socket.on("client-ready", (roomId: string, name: string) => {
        socket.to(roomId).emit("get-state")
        //socket.to(roomId).emit("update-members", name)
    })

    // socket.on("client-ready-leader", (roomId: string, name: string) => {
    //     socket.to(roomId).emit("get-state")
    //     io.to(roomId).emit("update-members", name)
    // })

    socket.on("canvas-state", (state: string, roomId: string) => {
        socket.to(roomId).emit("canvas-state-from-server", state)
    })

    socket.on(
        "onDraw",
        ({
            currentPoints,
            prePoints,
            color,
            size,
            roomId,
        }: OnDrawSocketProps) => {
            socket.to(roomId).emit("onDraw", {
                currentPoints,
                prePoints,
                color,
                size,
            })
        }
    )
    socket.on("handleClear", (roomId: string) => {
        io.to(roomId).emit("handleClear")
    })
})

httpServer.listen(PORT, () => {
    console.log(`Server is running at ${PORT} `)
})
