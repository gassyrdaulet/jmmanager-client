import React from 'react'
import MyInput from '../UI/MyInput'
import cl from './PaymentRow.module.css'
import cancel from '../img/cancel.png'
import { useState } from 'react'
import Select from 'react-select'

export default function PaymentRow({defaultValue, style, options, paymentMethod:payment, paymentSum: sum, index,id,deletePayment, onChange: editPayment}) {
  const [paymentvalue, setPaymentValue] = useState((payment))
  const [paymentSum, setPaymentSum] = useState((sum))

  return (
    <div className={cl.GoodRow}>
        <p className={cl.Number}>{index+1}</p>
        <div className={cl.GoodRowElement}> 
          <Select isSearchable={false} defaultValue={defaultValue} onChange={(value) => {editPayment(index, 0 , value.value);setPaymentValue(value.value)}} styles={style} options={options} placeholder='Выбрать...'/>
        </div>
        <div className={cl.GoodRowElement}> 
            <MyInput inputMode="numeric" onChange={(e) => {editPayment(index, 1, e.target.value);setPaymentSum((e.target.value).replace(/^0{1,}|[^0-9]/ig,''))}} value={paymentSum} type='text'></MyInput>
        </div>
        <div className={cl.GoodRowElement}> 
            <p className={cl.FirstPrice}> {!isNaN(Math.floor((paymentvalue*paymentSum)/100))?(Math.abs(Math.floor((paymentvalue*paymentSum)/100))):0} тг</p>
        </div>
        <div className={cl.GoodRowElement}> 
          <div onClick={() => deletePayment(id)} className={cl.DeleteElementBtn}><img src={cancel} alt="Удал." /></div>
        </div>
    </div>
  )
}
