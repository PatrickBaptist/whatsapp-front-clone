import IconAnonimo from '../../assets/anonimo.jpg'
import './messagePanel.css'

function Panel ({name}) {

    return (
            <div className='chat-options'>
                <div className='chat-item'>
                    <img src={IconAnonimo} alt='profile' className='image-profile' />
                    <div className='title-chat-container'>
                        
                        <span className='chat-name'>{name}</span>
                        
                    </div>
                </div>
            </div>
        );
    }

export default Panel