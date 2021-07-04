
import { useHistory, useParams } from 'react-router-dom'

import logoImage from '../assets/images/logo.svg'
import answerImage from '../assets/images/answer.svg'
import checkImage from '../assets/images/check.svg'
import deleteImage from '../assets/images/delete.svg';

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import '../styles/room.scss'
import { database } from '../service/firebase'

type RoomParams ={
  id: string;
}

export function AdminRoom(){
  const {user} = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id
  const { questions, title } = useRoom(roomId);

  async function handleDelete(questionId: string) {
    if(window.confirm('Tem certeza que deseja deletar essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheck(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ 
      isAnswered: true
    });
  }

  async function handleAnswer(questionId: string){
       await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ 
      isHighlighted: true
    });

  }

  async function handleEndRoom(roomId: string){
    await database.ref(`rooms/${roomId}`).update({ 
      endedAt: new Date(),
    })
    history.push('/')
  }

  return(
    <div id="page-room"> 
      <header>
        <div className="content">
          <img src={logoImage} alt="letmeask"/>
          <div>
          <RoomCode code={roomId} />
          <Button isOutline onClick={() => handleEndRoom(roomId)}> Encerrar sala </Button>
          </div>

        </div>
      </header>
      <main> 
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span> {questions.length} pergunta(s) </span>}
        </div>

        <div className="question-list">
          {questions.map(questions => {
              return(
                <Question key={questions.id} 
                isAnswered={questions.isAnswered}
                isHighlighted={questions.isHighlighted}
                content={questions.content} 
                author={questions.author}>
                  {!questions.isAnswered && (
                    <>
                      <button className="" type="button" onClick={() => handleCheck(questions.id)}> 
                        <img src={checkImage} />
                      </button>
                      
                      <button className="" type="button" onClick={() => handleAnswer(questions.id)}> 
                        <img src={answerImage} />
                      </button>
                    </>
                  )}

                  <button className="" type="button" onClick={() => handleDelete(questions.id)}> 
                    <img src={deleteImage} />
                  </button>
                </Question>
               );
            })
          }
        </div>
      </main>
    </div>
  )
}