import React from 'react'
import Loading from './Loading'
import cl from './MyButton.module.css'

export default function MyButton({onClick, children, color, disabled}) {
  return (
    <button disabled={disabled} className={color==='blue'? cl.MyButtonBlue : color==='gray'? cl.MyButtonGray : color==='green'?cl.MyButtonGreen : color==='red'?cl.MyButtonRed:cl.MyButton} onClick={onClick}>{children}</button>
  )
}
