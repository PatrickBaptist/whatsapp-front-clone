import { createContext, useContext, useEffect, useState } from "react"
import { MessageContext } from './components/context/messageContext'
import socket from 'socket.io-client'

const io = socket('http://localhost:4000')

export const MessagesContext =  createContext ()

export const MessagesStore = ({children}) => {
    const [messages, setMessages] = useState([])
    const [message] = useContext(MessageContext)

    useEffect(() => {
        io.on("message", (message) => setMessages((messages) => [...messages, message]))
    }, [message])

    return (
        <MessagesContext.Provider value={{messages, setMessages}}>
            {children}
        </MessagesContext.Provider>
    )
}