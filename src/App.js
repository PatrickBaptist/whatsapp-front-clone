import { useEffect, useState } from 'react'
import './App.css';
import Image from './assets/logo-img.jpg'
import SendMessageIcon from './assets/send.png'
import socket from 'socket.io-client'

const io = socket('http://localhost:4000')

function App() {

  const [name, setName] = useState('')
  const [joined, setJoined] = useState(false)
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    io.on("users", (users) => setUsers(users))
    io.on("message", (message) => setMessages((messages) => [...messages, message]))
    io.on("connect", (socket) => console.log(socket))
  }, [])

  const handleJoin = () => {
    if(name) {
      io.emit("join", name)
      setJoined(true)
    }
  }

  const handleMessage = () => {
    if(message) {
      io.emit("message", {message, name})
      setMessage("")
    }
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
    <div className='container'>
      <div className='back-ground'>

      </div>
      <div className='chat-container'>
        <div className='chat-contacts'>
          <div className='chat-options'></div>
          <div className='chat-item'>
            <img src={Image} alt='' className='image-profile' />
            <div className='title-chat-container'>
              <span className='title-message'>Networking Profissão Programador</span>
              <span className='last-message'>
                {messages.length? `${messages[messages.length - 1].name}: ${messages[messages.length - 1].message}` : ''}
              </span>
            </div>
          </div>

        </div>

        <div className='chat-messages'>
          <div className='chat-options'>
          <div className='chat-item'>
            <img src={Image} alt='' className='image-profile' />
            <div className='title-chat-container'>
              <span className='title-message'>Networking Profissão Programador</span>
              <span className='last-message'>
                {users.map((user, index) => (
                  <span>{user.name}{index + 1 < users.length? ', ' : ''}</span>
                ))}
              </span>
            </div>
          </div>
          </div>
       


          <div className='chat-messages-area'>
            {messages.map((message, index) => (
              <div className={message.name === name? 'user-container-message right' : 'user-container-message left'}>
                <div
                className={message.name === name? 'user-my-message' : 'user-other-message'}
                key={index}
                >
                  <span className='name' style={message.name === name? {display: 'none'} : {display: 'flex'} }>{message.name? `${message.name}` : ''}</span>
                  <span>{message.message}</span>
                </div>

              </div>
            ))}
          </div>

          <div className='chat-input-area'>
            <input
            className='chat-input'
            placeholder='Mensagem'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter') {
                handleMessage()
              }
            }}
            />
            <img
            src={SendMessageIcon}
            alt=''
            className='send-message-icon'
            onClick={() => handleMessage()}
            />
          </div>
        </div>


      </div>
    </div>
  );
}

export default App;
