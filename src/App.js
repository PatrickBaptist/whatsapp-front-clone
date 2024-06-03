import { useEffect, useState } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import socket from 'socket.io-client'
import Chat from './components/chat/chat'
import SelectUser from './components/selectusers/SelectUserName'

const io = socket('http://localhost:4000')

function App() {

  const [name, setName] = useState('')
  const [joined, setJoined] = useState(false)
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [lastMessages, setLastMessages] = useState({})
  const [currentUserId, setCurrentUserId] = useState(null)
  const [unreadMessages, setUnreadMessages] = useState({})
  const [pinnedChats, setPinnedChats] = useState([]) // Novo estado para chats fixados
  const [openMenu, setOpenMenu] = useState(false)

  useEffect(() => {
    const handleUsers = (users) => setUsers(users)
    const handleMessage = (message) => {
      setMessages((messages) => [...messages, message])
      setLastMessages((lastMessages) => ({
        ...lastMessages,
        [message.senderId === currentUserId ? message.receiverId : message.senderId]: {
          ...message,
          sentByCurrentUser: message.senderId === currentUserId,
        },
      }))

      // Atualiza mensagens não lidas
    if (message.receiverId === currentUserId) {
      setUnreadMessages((prevUnreadMessages) => ({
        ...prevUnreadMessages,
        [message.senderId]: (prevUnreadMessages[message.senderId] || 0) + 1,
      }))
    }

    };

    io.on('users', handleUsers)
    io.on('message', handleMessage)
    io.on('connect', () => console.log('connected'))

    return () => {
      io.off('users', handleUsers)
      io.off('message', handleMessage)
      io.off('connect')
    };
  }, [currentUserId])

  const MenuClick = () => {
    setOpenMenu(!openMenu)
  }

  const handleJoin = () => {
    if (name) {
      io.emit("join", name, (id) => {
        setCurrentUserId(id)
        setJoined(true)
      })
    }
  }

  const handleMessage = (receiverId) => {
    if (message) {
      io.emit("privateMessage", { message, receiverId })
      setMessage('')
    }
  }

  const togglePinChat = (userId) => {
    setPinnedChats((prevPinnedChats) => {
      if (prevPinnedChats.includes(userId)) {
        return prevPinnedChats.filter((id) => id !== userId)
      } else {
        return [...prevPinnedChats, userId]
      }
    })
  }

  if(!joined) {
    return (
    <div className='container-login'> 
      <div className='content-login'>
        <span className='span-login'>Entre no WhatsApp Web</span>
        <input
        className='input-login' 
        value={name}
        placeholder='Digite seu nome'
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            handleJoin()
          }
        }}
        />
        <button className='button-login' onClick={() => handleJoin()}>Entrar</button>
      </div>
    </div>
    )
  }

  return (
    <BrowserRouter>
      <div className='container'>
        <div className='back-ground'>

        </div>
        <div className='chat-container'>
          <SelectUser 
          users={users} 
          lastMessages={lastMessages} 
          currentUserId={currentUserId} 
          unreadMessages={unreadMessages}
          setUnreadMessages={setUnreadMessages}
          name={name} 
          pinnedChats={pinnedChats} // Passa o estado de chats fixados
          togglePinChat={togglePinChat} // Passa a função para fixar chats
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          MenuClick={MenuClick}
          />

          <div className='chat-messages'>

          <Routes>
            <Route 
            path='/chat/:userId' 
            element={
              <Chat 
              users={users} 
              messages={messages} 
              message={message} 
              setMessage={setMessage} 
              handleMessage={handleMessage}
              currentUserId={currentUserId} 
              unreadMessages={unreadMessages}
              openMenu={openMenu}
              />
            } 
            />
            
          </Routes>
          </div>


        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
