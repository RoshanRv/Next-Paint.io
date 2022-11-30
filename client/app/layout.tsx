"use client"

import { createContext, useState } from "react"
import "./globals.css"
import { Water_Brush } from "@next/font/google"

const font = Water_Brush({ weight: ["400"], variable: "--font-sketch" })

export const UserContext = createContext({} as UserContext)

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState({} as UserProps)
    return (
        <html lang="en" className={"font-disp"}>
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap"
                    rel="stylesheet"
                ></link>
            </head>
            <body>
                <UserContext.Provider value={{ user, setUser }}>
                    {children}
                </UserContext.Provider>
            </body>
        </html>
    )
}
