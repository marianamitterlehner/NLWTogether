import illustration from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState  } from 'react';
import { database } from '../service/firebase';

export function NewRoom(){

  const  {user} = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if(newRoom.trim() === ''){
      return; //impede que continue
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title:newRoom,
      author:user?.id
    })

    history.push(`/admin/rooms/${firebaseRoom.key}`);
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
            <h1>{user?.name}</h1>
            <h2>Criar uma nova sala</h2>
            <form  onSubmit={handleCreateRoom} > 
              <input type="text"
                placeholder="Digite o codigo da sua sala"
                onChange={event => setNewRoom(event.target.value)}
                value={newRoom}
              />
                <Button type="submit"> Criar Sala </Button>
                <p>Quer entrar em uma sala ja existente? <Link to="/rooms/existing">clique aqui</Link></p>
            </form>
        </div>
      </main>
    </div>
  )
}