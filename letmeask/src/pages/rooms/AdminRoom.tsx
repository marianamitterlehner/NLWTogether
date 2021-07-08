
import { useHistory, useParams } from 'react-router-dom'

import logoImage from '../../assets/images/logo.svg'
import answerImage from '../../assets/images/answer.svg'
import checkImage from '../../assets/images/check.svg'
import deleteImage from '../../assets/images/delete.svg';

import { Button } from '../../components/button/Button'
import { Question } from '../../components/question/Question'
import { RoomCode } from '../../components/room-code/RoomCode'

import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'

import './room.scss'
import { database } from '../../service/firebase'

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
                      <button type="button" 
                        onClick={() => handleCheck(questions.id)}> 
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      
                      <button type="button" 
                        onClick={() => handleAnswer(questions.id)}> 
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )}

                  <button type="button" 
                    onClick={() => handleDelete(questions.id)}> 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.99988H5H21" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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