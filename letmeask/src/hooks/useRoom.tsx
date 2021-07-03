import { useEffect, useState } from "react";
import { database } from "../service/firebase";
import { useAuth } from "./useAuth";

type QuestionProps = {
  id: string;
  author: {
    name:string;
    avatar:string;
  }
  content:string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likes: number;
  hasLiked: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name:string;
    avatar:string;
  }
  content:string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likes:Record<string, {
    authorId:string;
  }>;
}>

export function useRoom(roomId: string){
  const {user} = useAuth();
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [title, setTitle] = useState('');


  useEffect(() =>{
    const roomRef = database.ref(`rooms/${roomId}`);
    
    //on faz escutar em tempo real as modificoes
    roomRef.once('value', room =>{
      //valores de dentro de room
      const databaseRoom = room.val();
      //questions que estao dentro de database que pertence ao room que esta sendo tipado agora
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      //coversao desses dados para array
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likes: Object.values(value.likes ?? {}).length,
          hasLiked: Object.entries(value.likes ?? {}).find(([key, like])=> like.authorId === user?.id)?.[0]
        }
      })
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);

    })

    //remove todos os events listens da sala
    return () => {
      roomRef.off('value');
    }

  }, [roomId, user?.id]);

  return {questions, title}
}