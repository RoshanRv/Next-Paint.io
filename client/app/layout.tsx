"use client"

import "./globals.css"
import ContextProvider from "../components/ContextProvider"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="font-disp">
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
                <ContextProvider>{children}</ContextProvider>
            </body>
        </html>
    )
}
