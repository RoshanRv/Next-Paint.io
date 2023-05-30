"use client"
import { useEffect, useRef, useState } from "react"
import useDraw from "../../../hooks/useDraw"
import { CirclePicker } from "react-color"
import { io } from "socket.io-client"
import onDraw from "../../../utils/onDraw"
import getCanvasSize from "../../../utils/getCanvasSize"
import { UserContext } from "../../../components/ContextProvider"
import RoomMembers from "../../../components/RoomMembers"
import { useRouter } from "next/navigation"
import Link from "next/link"

const serverUrl =
    process.env.NODE_ENV === "production"
        ? "https://next-paint-io.onrender.com"
        : "http://localhost:3001"

const socket = io(serverUrl)

interface ParamsProps {
    params: RoomProps
}

const Room = ({ params }: ParamsProps) => {
    const roomId = params.id
    const [color, setColor] = useState("#000")
    const [size, setSize] = useState<5 | 7.5 | 10>(5)
    const [membersState, setMembersState] = useState<string[]>([])
    const membersRef = useRef<string[]>([])
    const router = useRouter()

    const onCreate = ({ currentPoints, ctx, prePoints }: OnDraw) => {
        socket.emit("onDraw", { currentPoints, prePoints, color, size, roomId })

        onDraw({ currentPoints, ctx, prePoints, color, size })
    }

    const { canvasRef, onMouseDown, handleClear } = useDraw(onCreate)
    const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 })

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d")

        const { height, width } = getCanvasSize()
        setCanvasSize({ height, width })

        socket.emit("join-room", { roomId })

        socket.on("get-members", (name: string) => {
            socket.emit("receive-members", roomId, membersRef.current, name)
        })

        socket.on("update-members", (members: string[], name: string) => {
            membersRef.current = [...members, name]
            setMembersState(membersRef.current)
        })

        socket.on("remove-member", (name: string) => {
            membersRef.current = membersRef.current.filter(
                (member) => member !== name
            )
            setMembersState(membersRef.current)
        })

        socket.on("get-state", () => {
            if (!canvasRef.current?.toDataURL()) return

            socket.emit("canvas-state", canvasRef.current.toDataURL(), roomId)
        })

        socket.on("canvas-state-from-server", (state: string) => {
            const img = new Image()
            img.src = state
            img.onload = () => {
                ctx?.drawImage(img, 0, 0)
            }
        })

        return () => {
            socket.off("get-state")
            socket.off("canvas-state-from-server")
            socket.off("get-members")
            socket.off("update-members")
            socket.off("remove-member")
        }
    }, [])

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d")

        socket.on("onDraw", ({ currentPoints, prePoints, color, size }) => {
            if (!ctx) return

            onDraw({ currentPoints, ctx, prePoints, color, size })
        })

        socket.on("handleClear", handleClear)

        return () => {
            socket.off("onDraw")
            socket.off("handleClear")
        }
    }, [canvasRef])

    return (
        <main className="min-h-screen py-10 bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="container mx-auto">
            <Link href={"/"}>
              <h1 className="p-2 mx-auto text-3xl font-bold text-center text-white md:text-5xl w-max font-serif">
                Next-Paint.io
              </h1>
            </Link>
            <h1 className="p-2 mx-auto text-3xl font-bold text-center text-white md:text-5xl w-max font-serif">
              ID de la Sala: {roomId}
            </h1>
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="flex p-4 bg-white border-2 border-black rounded-lg gap-x-6">
                <div>
                  <h1 className="pb-3 text-xl text-center text-gray-800 font-serif">
                    Elija un color
                  </h1>
                  <CirclePicker
                    color={color}
                    onChange={(e) => setColor(e.hex)}
                  />
                </div>
                <div>
                  <h1 className="pb-3 text-xl text-center text-gray-800 font-serif">Tamaño</h1>
                  <div
                    style={{ color: color }}
                    className="flex flex-col items-center justify-center gap-y-5"
                  >
                    <ColorCircle
                      style={"small"}
                      size={size}
                      setSize={setSize}
                    />
                    <ColorCircle
                      style={"mid"}
                      size={size}
                      setSize={setSize}
                    />
                    <ColorCircle
                      style={"large"}
                      size={size}
                      setSize={setSize}
                    />
                  </div>
                </div>
                <button
                  onClick={() => socket.emit("handleClear", roomId)}
                  className="px-8 py-2 m-2 bg-white border-2 border-black rounded-md text-gray-800 font-serif"
                >
                  Limpiar
                </button>
              </div>
              <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                className="bg-white border-4 border-black rounded-md mt-8"
                width={canvasSize.width}
                height={canvasSize.height}
              />
              <RoomMembers members={membersState} />
            </div>
          </div>
        </main>
      )
      
}

export default Room

const ColorCircle = ({ style, setSize, size }: ColorCicleProps) => {
    const circleSize = style === "small" ? 1 : style === "mid" ? 1.5 : 2.25
    const brushSize = style === "small" ? 5 : style === "mid" ? 7.5 : 10

    const handleSize = () => {
        setSize(brushSize)
    }

    return (
        <div
            onClick={handleSize}
            style={{ width: `${circleSize}rem`, height: `${circleSize}rem` }}
            className={` text-inherit rounded-full hover:scale-125 transition-all cursor-pointer
            ${size === brushSize ? "border-[3px] border-current" : "bg-current"}
            `}
        ></div>
    )
}
