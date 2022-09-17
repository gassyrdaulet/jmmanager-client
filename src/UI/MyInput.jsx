import React from 'react'
import cl from './MyInput.module.css'

function MyInput({type, placeholder, list, value, onChange, onBlur, inputMode, isInvalid}) {
  if(onChange===undefined){
    onChange = ()=>{console.log('empty')}
  }
  return (
    <div className={cl.MyInputWrapper}>
       <input list={list} onBlur={onBlur} onChange={onChange} inputMode={inputMode? inputMode:'text'} className={cl.MyInput + ' ' + (isInvalid? cl.Invalid : '')} type={type} placeholder={placeholder} value={value}></input>
    </div>
  )
}

export default MyInput