import illustration from '../../assets/images/illustration.svg';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google-icon.svg';

import { Button } from '../../components/button/Button';
import { useAuth } from '../../hooks/useAuth';

import { useHistory, Link } from 'react-router-dom';
import { useState } from 'react';
import { FormEvent } from 'react';

import { database } from '../../service/firebase';

import './auth.scss';

export function Home(){

  //estado
  const [roomCode, setRoomCode] = useState('');

  //armazena o historico do user
  const history = useHistory(); 
  //contexto
  const  {user, singInWithGoogle} = useAuth();

  //funcao de redirecionamento 
  async function handleNewRoom(){
    if(!user){
      await singInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === ''){
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    //teste pra ver se a sala existe com base no array retornado do roomRef
    if(!roomRef.exists()){
      alert('Room does not exist');
      return;
    }else if(roomRef.val().endedAt){
      alert('Room already ended')
      return;
    }else{
      history.push(`/rooms/${roomCode}`);
    }
  }

  return(
    <div id='page-auth'>
      <aside>
        <img src={illustration} />
        <div className='text-aside'>
          <strong> Crie salas de Q&amp;A ao-vivo</strong>
          <p>Tire as duvidas da sua audiencia em tempo-real</p>
        </div>
      </aside>
      <main> 
        <div className="main-content"> 
          <img src={logo} />
          <button onClick={handleNewRoom} className="btn-create-room"> 
              <img src={googleIcon} />
              Crie sua sala com o Google
            </button>
            <div className="separator">ou entre dentro de uma sala</div>
            <form onSubmit={handleJoinRoom}> 
              <input type="text"
                placeholder="Digite o codigo da sua sala" 
                onChange={event => setRoomCode(event.target.value)}
                value={roomCode}
                />
                <Button type="submit"> Entre na Sala </Button>
            </form>
        </div>
      </main>
    </div>
  )
}