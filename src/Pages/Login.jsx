import React from 'react'
import cl from './Login.module.css'
import AuthService from '../API/AuthService'
import {useState, useContext} from 'react'
import MyButton from '../UI/MyButton'
import MyInput from '../UI/MyPassInput'
import {AuthContext} from "../context";
import Loading from '../UI/Loading';
import {useInput} from '../hooks/useInput'
import ErrorList from '../UI/ErrorList'

export default function Login() {    
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const {setIsAuth} = useContext(AuthContext)
    const [error, setError] = useState('')

    const email = useInput('' , {isEmpty: true,minLength:5,maxLength: 30,email:true})
    const password = useInput('' , {isEmpty: true,minLength:5,maxLength: 18,password:true})

    return (
        <div className={cl.Login}>
            <form className={cl.LoginForm}>
                <div className={cl.Title}>
                    <h1>ВОЙДИТЕ В АККАУНТ</h1>
                </div>
                <div className={cl.LoginFormItem}>
                    <MyInput {...email.props} type='text' placeholder="Эл. почта"></MyInput><ErrorList key='0'>{email.isDirty? email.errorText : ''}</ErrorList>
                </div>
                <div className={cl.LoginFormItem}>
                    <MyInput {...password.props} onClick={() => setIsPasswordVisible(!isPasswordVisible)} type={'password'} isPasswordVisible = {isPasswordVisible} placeholder="Пароль"></MyInput><ErrorList key='1'>{password.isDirty? password.errorText : ''}</ErrorList>
                </div>
                <MyButton disabled={(isLoading||email.valid||password.valid)} onClick={(e)=>{AuthService.login(e, email.props.value, password.props.value,setIsAuth,setError,setIsLoading)}}>{isLoading?<Loading></Loading>:'Войти'}</MyButton>
            </form>
            {error?
            <div className={cl.Error}>
                <p>{error}</p>
            </div>
            :
            ''}
        </div>
    )
}
