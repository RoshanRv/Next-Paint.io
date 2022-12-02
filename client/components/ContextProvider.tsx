import React, { createContext, ReactNode, useState } from "react"

export const UserContext = createContext({} as UserContext)

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState({} as UserProps)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default ContextProvider
