import { createContext, useEffect, useState } from "react"
import socket from 'socket.io-client'

const io = socket('http://localhost:4000')

export const MyidContext =  createContext ()

export const MyidStore = ({children}) => {
    const [myId, setMyId] = useState('')

    useEffect(() => {
        io.on("connect", () => setMyId(io.id))
    }, [setMyId])

    return (
        <MyidContext.Provider value={{myId, setMyId}}>
            {children}
        </MyidContext.Provider>
    )
}