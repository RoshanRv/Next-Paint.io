"use client"

const getCanvasSize = () => {
    const screenWidth = window.screen.width
    if (screenWidth > 1024) return { width: 750, height: 750 }

    if (screenWidth > 468) {
        return { width: screenWidth - 50, height: 350 }
    }

    return { width: screenWidth - 50, height: 400 }
}

export default getCanvasSize
