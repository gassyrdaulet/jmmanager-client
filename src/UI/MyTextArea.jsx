import React from 'react'
import cl from './MyTextArea.module.css'

export default function MyTextArea({children, onChange, value}) {
  return (
    <textarea className={cl.MyTextArea} onChange={onChange} value={value} cols="30" rows="10">{children}</textarea>
  )
}
