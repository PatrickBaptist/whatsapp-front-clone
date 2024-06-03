import React, { useState } from 'react'
import IconAnonimo from '../../assets/anonimo.jpg'
import './selectUser.css'
import { useNavigate } from 'react-router-dom';
import Hamburguer from '../../assets/hamburger.png'

function SelectUser ({ users, lastMessages, currentUserId, setOpenMenu, openMenu, MenuClick, name, unreadMessages, setUnreadMessages, pinnedChats, togglePinChat }) {

    const navigate = useNavigate()
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleUserClick = (user) => {
        setSelectedUserId(user.id) // Atualiza o usuário selecionado
        navigate(`/chat/${user.id}`, { state: { userName: user.name } })

        // Limpa mensagens não lidas para o usuário clicado
        setUnreadMessages((prevUnreadMessages) => ({
            ...prevUnreadMessages,
            [user.id]: 0,
        }))

        if (window.innerWidth < 893) {
            setOpenMenu(true)
        }
    }

    const sortedUsers = users.slice().sort((a, b) => {
        const aPinned = pinnedChats.includes(a.id)
        const bPinned = pinnedChats.includes(b.id)
        if (aPinned && !bPinned) return -1
        if (!aPinned && bPinned) return 1
        return 0
    })

    return (
        <div className={`contacts-container ${openMenu ? 'contacts-container-collapsed' : 'contacts-container-expanded'}`}>
            <div className='you'>
                <img src={IconAnonimo} alt='' className='image-profile' style={ openMenu ? {display: "none"} : {display: "block"} } />
                <div className='you-content' style={ openMenu ? {display: "none"} : {display: "flex"} }>
                        <b>VOCÊ</b>
                        <span>({name})</span>
                </div>
                <img src={Hamburguer} alt='menu' className='hamburguer' onClick={MenuClick} />
            </div>
            <div className='contacts-content'>
            {sortedUsers
                    .filter(user => user.id !== currentUserId) // Filtra o usuário atual
                    .map((user) => {
                        if (!user || !user.id) return null // Adicione uma verificação para garantir que user e user.id existam
                        const lastMessage = lastMessages?.[user.id] || {} // Verifica se lastMessages[user.id] existe
                        const messageText = lastMessage.message
                            ? `${lastMessage.sentByCurrentUser ? 'Você' : lastMessage.senderName}: ${lastMessage.message}`
                            : ''
                        const unreadCount = unreadMessages[user.id] || 0
                        const isPinned = pinnedChats.includes(user.id)

                            
        return (
                <div className={`contact-content ${selectedUserId === user.id ? 'selected' : ''}`} key={user.id} 
                onClick={() => handleUserClick(user)}>
                    <img src={IconAnonimo} alt='' className='image-profile' />
                    <div className='contact'>
                        <span className='user-name'>    
                        {user.name}
                        </span>
                        <span className='last-message'>
                        {messageText}
                        </span>

                    </div>
                    <div className='count-content'>
                    {unreadCount > 0 && (
                        <span className='unread-count'>
                            {unreadCount}
                        </span>
                    )}
                    
                    <button onClick={(e) => { 
                    e.stopPropagation()
                    togglePinChat(user.id)
                    }}>
                    {isPinned ? 'Desfixar' : 'Fixar'}
                    </button>

                    </div>
                </div>
                );
            })}
            </div>
        </div>
    )
}

export default SelectUser