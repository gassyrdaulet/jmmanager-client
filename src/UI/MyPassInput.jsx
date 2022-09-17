import React from 'react'
import cl from './MyPassInput.module.css'

function MyPassInput({type, onClick, isPasswordVisible ,placeholder, list, value, onChange, onBlur, inputMode, isInvalid}) {
  if(onChange===undefined){
    onChange = ()=>{console.log('empty')}
  }
  const isPassword = (type === 'password')

  return (
    <div className={cl.MyInputWrapper}>
      <div className={cl.MyInputDiv}>
       <input list={list} onBlur={onBlur} onChange={onChange} inputMode={inputMode?inputMode:'text'} className={cl.MyInput + ' ' + (isInvalid? cl.Invalid : '') + ' ' + (isPassword? cl.Password : '')} type={isPasswordVisible? 'text' : type} placeholder={placeholder} value={value}></input>
      {isPassword ? <div onClick={onClick} className={cl.Eye}></div>: ''}
      </div>
    </div>
  )
}

export default MyPassInput