import cl from './NavBar.module.css'
import React, {useContext, useState, useEffect} from 'react';
import {useNavigate, Link} from "react-router-dom";
import {AuthContext} from "../context";
import MyColoredButton from '../UI/MyColoredButton';
import Auth from '../API/AuthService'
import Loading from '../UI/Loading';
import { useTimeout } from '../hooks/useTimeout';

export default function NavBar() {
  const [balance, setBalance] = useState(0)

  const _updateBalance = async () => {
    const response = await Auth.getBalance(localStorage.getItem('id'))
    setBalance(response.balance)
  }

  const [isBalanceLoading, updateBalance] = useTimeout(1500, _updateBalance)

  const router = useNavigate()
  const {isAuth, setIsAuth} = useContext(AuthContext)

  const logout = () => {
      setIsAuth(false)
      localStorage.removeItem('auth')
      localStorage.removeItem('email')
      localStorage.removeItem('balance')
      localStorage.removeItem('id')
      localStorage.removeItem('name')
      localStorage.removeItem('role')
      localStorage.removeItem('token')
      localStorage.removeItem('firstDate')
      localStorage.removeItem('secondDate')
      localStorage.removeItem('firstDateTr')
      localStorage.removeItem('secondDateTr')
      localStorage.removeItem('firstDateTrOther')
      localStorage.removeItem('secondDateTrOther')
      router('/login')
  }

  useEffect( () => {
    if(isAuth){
    updateBalance()
    }
  },[isAuth])

  return (
    <div className={cl.navBarWrapper}>
      <div className={cl.navBar}>
          <div className={cl.navBarItemsLeft}>
            {isAuth? <Link className={cl.Reference} to='/main/'>Главная страница</Link> : <span/>}
            {isAuth? <Link className={cl.Reference} to='/userpage/'>Мой Профиль</Link> : <span/>}
          </div>
          <div className={cl.navBarItemsRight}>
            {isAuth?
            <div className={cl.navBarItemsLeftWrapper}>
              <div className={cl.Profile}>
                <div className={cl.HorizontalAlign}>
                  {localStorage.getItem('name')} : {isBalanceLoading?<Loading/>:balance}тг
                </div>
                <div className={cl.HorizontalAlign}>
                  <MyColoredButton color='lightsky' onClick={updateBalance}>Обновить</MyColoredButton>
                  <MyColoredButton color='red' onClick={logout}>Выйти</MyColoredButton>
                </div>
                </div>
            </div>
              :
              <span/>}
          </div>
      </div>
    </div>
  )
}
