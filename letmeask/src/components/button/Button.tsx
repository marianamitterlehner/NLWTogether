import { ButtonHTMLAttributes } from "react"
import './button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutline?: boolean
};

export function Button({isOutline = false, ...props}: ButtonProps){
  return(
    <button className={`button ${isOutline ? 'outline' : ''}`}
    {...props}></button>
  )
}