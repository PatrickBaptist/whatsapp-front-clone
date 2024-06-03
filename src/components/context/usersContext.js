import { createContext, useEffect, useState } from "react"
import socket from 'socket.io-client'

const io = socket('http://localhost:4000')

export const UsersContext =  createContext ()

export const UsersStore = ({children}) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        io.on("users", (users) => setUsers(users))
    }, [users])

    return (
        <UsersContext.Provider value={{users, setUsers}}>
            {children}
        </UsersContext.Provider>
    )
}