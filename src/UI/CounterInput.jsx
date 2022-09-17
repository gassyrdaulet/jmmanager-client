import React from 'react'
import cl from './CounterInput.module.css'
import up from '../img/up.png'
import { useState } from 'react'

export default function CounterInput({maxDigitForCounter, value, onChange, onBlur, onClickArrow: handleChange, setValue}) {
  const [maxDigit] = useState(maxDigitForCounter)

  return (
    maxDigitForCounter?
    <div className={cl.CounterInput}>
        <div onClick={() => {parseInt(value)>=maxDigit?handleChange(setValue,maxDigit,1):handleChange(setValue,parseInt(value)+1,1)}} className={cl.Up}><img alt='' src={up}/></div>
        <input inputMode="numeric" onBlur={onBlur} value={value} onChange={onChange} placeholder="Кол." type="text" step='1' min='0' max={maxDigitForCounter}/>
        <div onClick={() => {parseInt(value)>0?handleChange(setValue,value-1,1):handleChange(setValue,parseInt(value),1)}} className={cl.Down}><img alt='' src={up}/></div>
    </div>:
    <div className={cl.CounterInput}>
        <div onClick={() => {parseInt(value)>999?handleChange(setValue,999,1):handleChange(setValue,parseInt(value)+1,1)}} className={cl.Up}><img alt='' src={up}/></div>
        <input inputMode="numeric" onBlur={onBlur} value={value} onChange={onChange} placeholder="Кол." type="text" step='1' min='1' max={maxDigitForCounter}/>
        <div onClick={() => {parseInt(value)>1?handleChange(setValue,value-1,1):handleChange(setValue,parseInt(value),1)}} className={cl.Down}><img alt='' src={up}/></div>
    </div>
  )
}
