import React from 'react'
import CreateOrderForm from '../components/CreateOrderForm'
import cl from './NewOrder.module.css'
import {useInput} from '../hooks/useInput.js'

export default function NewOrder() {

  return (
    <div className={cl.NewOrder}>
        <div className={cl.Title}>
            <h3>Новый заказ </h3>
        </div>
        <CreateOrderForm></CreateOrderForm>
    </div>
  )
}
