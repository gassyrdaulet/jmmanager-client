import React, { useState , useEffect } from 'react'
import cl from './EditOrder.module.css'
import CreateOrderForm from '../components/CreateOrderForm'
import OrderService from '../API/OrderService'
import { useParams, useNavigate } from 'react-router-dom'

export default function EditOrder() {
    const router = useNavigate()

    const params = useParams()

    const [orderInfo, setOrderInfo] = useState(0)

    const fetchData = async () => {
        try{
            setOrderInfo(await OrderService.getOrderInfoForEdit(params.id))
        }catch(e){
            console.log(e)
            // router('/error')
        }
    }
    
    useEffect( () => {
            fetchData()
        } , []
    )

    return (
        <div className={cl.EditOrder}>
            <div className={cl.Title}>
                <h3>Редактирование заказа №{params.id}</h3>
            </div>
            {
                orderInfo===0?'':
                <CreateOrderForm data={orderInfo} type={'edit'}></CreateOrderForm>
            }
        </div>
    )
}
