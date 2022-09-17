import React, { useState , useEffect } from 'react'
import cl from './Return.module.css'
import CreateOrderForm from '../components/CreateOrderForm'
import OrderService from '../API/OrderService'
import { useParams, useNavigate } from 'react-router-dom'

export default function Return() {
    const router = useNavigate()

    const params = useParams()

    const [orderInfo, setOrderInfo] = useState(0)

    const fetchData = async () => {
        try{
            setOrderInfo(await OrderService.getOrderInfoForEdit(params.id, 'ret'))
        }catch(e){
            router('/error')
        }
    }
    
    useEffect( () => {
            fetchData()
        } , []
    )

    return (
        <div className={cl.ReturnOrder}>
            <div className={cl.Title}>
                <h3>Оформление возврата заказа №{params.id}</h3>
            </div>
            {
                orderInfo===0?'':
                <CreateOrderForm data={orderInfo} type={'ret'}></CreateOrderForm>
            }
        </div>
    )
}
