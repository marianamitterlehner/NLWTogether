import firebase from 'firebase'
import { FormEvent, useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import logoImage from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../service/firebase'

import '../styles/room.scss'

type FirebaseQuestions = Record<string, {
  author: {
    name:string;
    avatar:string;
  }
  content:string;
  isHighlighted: string;
  isAnswered: string;
}>
type RoomParams ={
  id: string;
}
type QuestionProps = {
  id: string;
  author: {
    name:string;
    avatar:string;
  }
  content:string;
  isHighlighted: string;
  isAnswered: string;
}

export function Room(){
  const user = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id

  const [newQuestion, setNewQuestion] = useState('');
  const [question, setQuestion] = useState<QuestionProps[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() =>{
    const roomRef = database.ref(`rooms/${roomId}`);
    
    //on faz escutar em tempo real as modificoes
    roomRef.on('value', room =>{
      //valores de dentro de room
      const databaseRoom = room.val();
      //questions que estao dentro de database que pertence ao room que esta sendo tipado agora
      const firebaseQuestions: FirebaseQuestions = databaseRoom.question ?? {};
      //coversao desses dados para array
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
        }
      })
      setTitle(databaseRoom.title);
      setQuestion(parsedQuestions);

    })
  }, [roomId]);

  async function handleNewQuestion(event: FormEvent){
    event.preventDefault();
    if (newQuestion.trim() === ''){
      return;
    }

    if(!user){
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author:{
        name: user.user?.name,
        avatar: user.user?.avatar
      },
      isHighlighted: false,
      isAnswered:false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }


  return(
    <div id="page-room"> 
      <header>
        <div className="content">
          <img src={logoImage} alt="letmeask"/>
          <RoomCode code={roomId} />
        </div>
      </header>
      <main> 
        <div className="room-title">
          <h1>Sala {title}</h1>
          {question.length > 0 && <span> {question.length} pergunta(s) </span>}
        </div>
        <form  onSubmit={handleNewQuestion}> 
          <textarea placeholder="o que vc quer perguntar?"
          onChange={event => setNewQuestion(event.target.value)} 
          value={newQuestion}/>

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.user?.avatar}/>
                <span>{user.user?.name} </span>
              </div>
            ) : (
              <span> Para enviar uma pergunta, <button> faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}> Enviar pergunta</Button>
          </div>
        </form>


      </main>
    </div>
  )
}