import { createContext, useContext, useEffect, useState} from "react"
import { MessagesContext } from './messagesContext'

import socket from 'socket.io-client'

const io = socket('http://localhost:4000')

export const MessageContext =  createContext ()

export const MessageStore = ({children}) => {
    const [message, setMessage] = useState('')
    const [setMessages] = useContext(MessagesContext)

    useEffect(() => {
        io.on("message", (receivedMessage) => {
            setMessages((messages) => [...messages, receivedMessage]);
        });

        // Cleanup: remove the listener when component unmounts
        return () => {
            io.off("message");
        };
    }, [setMessages]);

    return (
        <MessageContext.Provider value={{message, setMessage}}>
            {children}
        </MessageContext.Provider>
    )
}