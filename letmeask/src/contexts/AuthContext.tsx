import { ReactNode } from "react";
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { firebase,auth } from '../service/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  singInWithGoogle: () => Promise<void>; //funcao async
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props:AuthContextProviderProps){

  const [user, setUser] = useState<User>();

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user =>{
      if(user){
        const {displayName, photoURL, uid} = user
        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account')
        }
        //preenche o estado da aplicacao caso ja exista um user logado
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
    
    //desloga do event listen useEffect
    return() => {
      unsubscribe();
    }
  }, [])

    async function singInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();

      //variavel com a autenticacao
      const result = await auth.signInWithPopup(provider);

      //verifica as informacoes do user vindas do result
        if(result.user){
          const {displayName, photoURL, uid} = result.user
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account')
          }
          //setar essa informacao para o setUser onde eu posso manipular ela
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
    }

  return(
  <AuthContext.Provider value={{user, singInWithGoogle}} >
    {props.children}
  </AuthContext.Provider>
  )
}