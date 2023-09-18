
import './App.css';
import io from 'socket.io-client'
import axios from 'axios'
import {useState, useEffect} from 'react'



//conexion para escuchar los eventos 
const socket = io('http://localhost:8080');
const url='http://localhost:8080/api/'


//formulario de chat
function App() {
    const [nickname, setNickname] = useState('')
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [messages, setMessages] = useState([])

    const [storedMessages, setStoredMessages] = useState([])
    const [firstTime, setFirstTime] = useState(false)

    useEffect(() =>{
      const receivedMessage = (message) =>{
        setMessages([message,...messages])
      }
      socket.on('message', receivedMessage)
      return () => {
        socket.off('message', receivedMessage)
      }
    }, [messages])


    if (!firstTime) {
      axios.get(url + "messages").then(res=>{
        setStoredMessages(res.data.messages)
      })
      setFirstTime(true)
    }



    //aqui evitamos recargue la pagina  y enviar el mensaje con asginacion de nickname

    const handlerSubmit = (e) =>{
      e.preventDefault( )
      
      if (nickname !=='') {
        socket.emit('message',message,nickname)

        const newMessage ={
          body:message,
          from:'yo'
        }

        setMessages([newMessage, ...messages])
        setMessage('')

        //peticiones http por post para guardar el mensaje

        axios.post(url + 'save',{
          message: message,
          from: nickname
        })
        
      } else {
        alert('Para enviar un mensaje debes establecer un nickname!!')
      }
    }

    const nicknameSubmit = (e) =>{
      e.preventDefault()
      setNickname(nickname)
      setDisabled(true)      
    }
  return (
    <div className="App">
        <div className='container mt-3'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='text-center'>Chat</h5>
                


              {/*nickname*/}
              <form onSubmit={nicknameSubmit}>
                <div className="d-flex mb-3">
                  <input type='text' className='form-control' placeholder='Nickname.....' id='nickname' onChange={e => setNickname(e.target.value)} disabled={disabled}/>
                  <button class="btn btn-success mx-3" type="submit" id="btn-nickname" disabled={disabled} >estalecer</button>
                </div>
              </form>


       

              
              {/*chat form*/}
              <form onSubmit={handlerSubmit}>
                <div className="d-flex">
                  <input type='text' className='form-control' placeholder='mensaje.....' id="mensaje" onChange={e => setMessage(e.target.value)} value={message}/>
                  <button class="btn btn-success mx-3" type="submit" id="btn-message">enviar</button>
                </div>
              </form>
              
              
            </div>

          </div>
        </div>

        
        {/* CHAT DE MENSAJES*/ }
        <div className="card mt-3 mb-3" id="content-chat">
          <div className="card-body">
            {messages.map((message, index)=>(
              <div key={index} className={`d-flex p-3 ${message.from === "yo" ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`card mb-3 border-1 ${message.from === "yo" ? "bg-success bg-opacity-25" :"bg-light"}`}> 
                <div className="card-body">
                  <small className="">{message.from} : {message.body}</small>
                </div>
                </div>
              </div>
            ))}


            
          {/* CHAT DE STORE MENSAJES*/ }
          <small className="text-center text-muted">mensajes guardados</small>
            {storedMessages.map((message, index)=>(
              <div key={index} className={`d-flex p-3 ${message.from === nickname  ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`card mb-3 border-1 ${message.from === nickname ? "bg-success bg-opacity-25" :"bg-light"}`}> 
                <div className="card-body">
                  <small className="text-muted">{message.from} : {message.message}</small>
                </div>
                </div>
              </div>
            ))}
            
           </div>
        </div>  
      </div>
  );
}

export default App;
