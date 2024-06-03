import { useRef, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import './chat.css'
import Panel from '../panel/MessagePanel';
import SendMessageIcon from '../../assets/send.png'
import BgContact from '../../assets/bg-contact.png'
import { useMemo } from 'react';

function Chat ({ users, messages, setMessage, openMenu, message, handleMessage, currentUserId }) {
    
    const { userId: receiverId } = useParams()
    const location = useLocation()
    const user = users.find(user => user.id === receiverId)
    const messagesContainer = useRef(null) //até a última msg enviada

    useEffect(() => {
        messagesContainer.current?.scrollTo(0, messagesContainer.current.scrollHeight)
      }, [messages]) //scrolla até a última msg enviada

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => {
            return (
                (msg.senderId === currentUserId && msg.receiverId === receiverId) ||
                (msg.senderId === receiverId && msg.receiverId === currentUserId)
            )
        })
    }, [messages, currentUserId, receiverId])
        
    if (!user) {
        console.log("Usuário não encontrado:", receiverId)
        return <div className='user-container'>
            <img src={BgContact} alt='contacts-bg' className='bg-contact' />
            <div className='found-users'>
                <span>Usuário não encontrado</span>
            </div>
            </div>
    }


    return (
    <div className={ `${openMenu ? 'chat-container-individual' : 'chat-container-collapsed'}` }>
        <Panel name={location.state.userName}/>
        <div className='chat-messages-area' ref={messagesContainer}>
            {filteredMessages.map((msg, index) => (
            <div key={msg.id || index} className={msg.senderId === currentUserId ? 'user-container-message right' : 'user-container-message left'}>
                <div
                className={msg.senderId === currentUserId ? 'user-my-message' : 'user-other-message'}
                >
                    <span className='name' style={msg.senderId === currentUserId ? {display: 'none'} : {display: 'flex'}}>
                    </span>
                    <span>{msg.message}</span>
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
                handleMessage(receiverId)
            }
            }}
            />

            <img
            src={SendMessageIcon}
            alt=''
            className='send-message-icon'
            onClick={() => handleMessage(receiverId)}
            />
            </div>
    </div>
    )
}

export default Chat