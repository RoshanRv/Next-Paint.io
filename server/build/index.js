"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
const PORT = process.env.PORT || 3001;
io.on("connection", (socket) => {
    socket.on("client-ready", () => {
        socket.broadcast.emit("get-state");
    });
    socket.on("canvas-state", (state) => {
        socket.broadcast.emit("canvas-state-from-server", state);
    });
    socket.on("onDraw", ({ currentPoints, prePoints, color, size }) => {
        socket.broadcast.emit("onDraw", {
            currentPoints,
            prePoints,
            color,
            size,
        });
    });
    socket.on("handleClear", () => {
        io.emit("handleClear");
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server is running at ${PORT} `);
});
