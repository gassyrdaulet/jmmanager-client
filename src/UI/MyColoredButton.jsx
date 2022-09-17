import React from 'react'
import cl from './MyColoredButton.module.css'

export default function MyColoredButton({children, color, onClick}) {
  return (
    <button onClick={onClick} className={color === 'red' ? cl.RedButton : color === 'lightsky' ? cl.LightSkyButton : color === 'green'? cl.GreenButton : cl.RedButton}>
        {children}
    </button>
  )
}
