import React from 'react'
import cl from './OrderDetails.module.css'
import OrderService from '../API/OrderService'
import { useState,useEffect } from 'react'
import { useNavigate, Link ,useParams } from 'react-router-dom'
import Button from '../UI/MyButton'
import WhiteTable from '../components/WhiteTable'
import WhiteTableCompound from '../components/WhiteTableCompound'
import GoodService from '../API/GoodService'
import Auth from '../API/AuthService'
import MyModal from '../UI/MyModal'
import MyInput from '../UI/MyInput'
import ToggleSwitch from '../UI/ToggleSwitch'
import Select from 'react-select/async'
import debounce from 'lodash.debounce'
import Errors from '../UI/ErrorList' 
import {useInput} from '../hooks/useInput'

export default function OrderDetails() {
  const [whileDelivering, setWhileDelivering] = useState(false)
  const [didPay, setDidPay] = useState(false)
  const [orderInfo, setOrderInfo] = useState([])
  const deliveryPriceInput = useInput('', {isEmpty: true}, 'price')
  const [acceptVisible, setAcceptVisible] = useState(false)
  const [cancelVisible, setCancelVisible] = useState(false)
  const [deliver, setDeliver] = useState('')
  const params = useParams()
  const router = useNavigate()

  const selectStyle = {
    option: (provided) => ({
      ...provided,
      fontSize: 12
    }),
    menu: (provided) => ({
      ...provided,
      height: 100
    }),
    menuList: (provided) => ({
      ...provided,
      height: 100,
      zIndex: 1000
    }),
    control: () => ({
      display: 'flex',
      width: 190,
      height: 35,
      fontSize: 12,
      border: '1px solid gray',
      borderRadius: '2px',
      cursor: 'pointer'
    }),
    dropdownIndicatorStyles: () => ({

    })
  }

  const _searchUsers = (inputValue, callback) => {
    Auth.getUsers(inputValue).then(resp => callback(resp))
  }
  const searchUsers = debounce(_searchUsers, 700)

  const goods = []
    orderInfo.orderCompound
        ?
        goods.push(...(Object.values(orderInfo.orderCompound[0])))
        :
        goods.push() 

  const finishOrder = async (cancel, whileDelivering, didPay) => {
    await OrderService.finishOrder(params.id, [cancel, whileDelivering, didPay])
    router(-1)
    setCancelVisible(false)
  }

  const acceptOrder = async () => {
    await OrderService.acceptOrder(params.id, {
      deliver: orderInfo.deliveryInfo? 
          orderInfo.deliveryInfo[0] === 'Самовывоз' ? '' :
           orderInfo.deliveryInfo[0] === 'Доставка' ? deliver : '' 
           : '',
      deliveryPriceForStore: orderInfo.deliveryInfo? 
          orderInfo.deliveryInfo[0] === 'Самовывоз' ? '' :
            orderInfo.deliveryInfo[0] === 'Доставка' ? deliveryPriceInput.props.value : '' 
            : ''})
    router(-1)
    setAcceptVisible(false)
  }  

  const getOrderInfo = async (id) => {
    try{
      const data = await OrderService.getOrderInfo(id)
      setOrderInfo(data)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => { 
    getOrderInfo(params.id)
  }, [params.id])


  return (
    <div className={cl.OrderWrapper}>
      <div className={cl.Order}>
        <div className={cl.Title}>
          <h2>Заказ номер №{(params.id)}</h2>
        </div>
        <div className={cl.OrderInfos}>
          <div className={cl.OrderInfo}><WhiteTable tableTitles={['Статус',"Дата создания","Дата выдачи","Стоимость доставки для магазина","Стоимость доставки для клиента","Продавец","Сумма","Комиссия","Скидка"]} title={"Информация о доставке:"} data={orderInfo.orderInfo? orderInfo.orderInfo : []}/></div>
          <div className={cl.OrderInfo}><WhiteTable tableTitles={['Адрес',"Номер телефона"]} title={"Покупатель:"} data={orderInfo.customerInfo? orderInfo.customerInfo : []}/></div>
          <div className={cl.OrderInfo}><WhiteTableCompound goods = { goods }  tableTitles={['Наимнование',"Количество","Оптовая цена","Розничная цена","Выгода (для продавца)"]} title={"Состав заказа:"} data={orderInfo.orderCompound? orderInfo.orderCompound : []}/></div>
          <div className={cl.OrderInfo}><WhiteTable tableTitles={['Доставка / Самовывоз',"Курьер"]} title={"Доставка:"} data={orderInfo.deliveryInfo? orderInfo.deliveryInfo : []}/></div>
          <div className={cl.OrderInfo}><WhiteTable tableTitles={['Комментарий',"Прототип","Дочерний"]} title={"Дополнительная информация:"} data={orderInfo.extraInfo? orderInfo.extraInfo : []}/></div>
        </div>
        {localStorage.getItem('role')==="0"?'':
        <div className={cl.Buttons}>
          {orderInfo.orderInfo? orderInfo.orderInfo[0]==='Новый'?<Button color={'blue'} onClick={() => {orderInfo.deliveryInfo? orderInfo.deliveryInfo[0] === 'Самовывоз' ? acceptOrder() :setAcceptVisible(true):console.log('Error')}}>Принять</Button>:'':''}
          {orderInfo.orderInfo? orderInfo.orderInfo[0]==="Ожидается Доставка/Самовывоз"?<Button color={'blue'} onClick={() => {finishOrder(0,0,0)}}>Выдать</Button>:'':''}
          {orderInfo.orderInfo? (orderInfo.orderInfo[0]==="Новый" || orderInfo.orderInfo[0]==='Ожидается Доставка/Самовывоз' || orderInfo.orderInfo[0]==='Неопределен')?<Button color={'blue'} onClick={() => router('/main/edit/' + params.id)}>Редактировать</Button>:'':''}
          {orderInfo.orderInfo? (orderInfo.orderInfo[0]==="Новый" || orderInfo.orderInfo[0]==='Ожидается Доставка/Самовывоз')?<Button color={'gray'} onClick={() => {orderInfo.orderInfo? orderInfo.orderInfo[0] === 'Новый' ||orderInfo.deliveryInfo[0] === 'Самовывоз' ? finishOrder(1,0,0) : setCancelVisible(true) : console.log('Error')}}>Отменить</Button>:'':''}
          {orderInfo.orderInfo? orderInfo.orderInfo[0]==="Выдан"?<Button color={'gray'} onClick={() => {router('/main/return/'+params.id)}}>Возврат</Button>:'':''}
        </div>}
      </div>
      <MyModal visible={acceptVisible} setVisible={setAcceptVisible}>
        <div className={cl.ModalContentWrapper}> 
          <p>Стоимость доставки для клиента:</p>
          <MyInput placeholder='Стоимость доставки для клиента' type='text' inputMode={'numeric'} {...deliveryPriceInput.props} ></MyInput>
          <Errors>{deliveryPriceInput.props.isInvalid?deliveryPriceInput.errorText:''}</Errors>
          <p>Курьер:</p>
          <Select onChange={(value) => setDeliver(value.value)} loadOptions={searchUsers} styles={selectStyle} placeholder='Выбрать...'></Select>
          <Button color='blue' disabled={deliveryPriceInput.valid||deliver===''} onClick={acceptOrder}>Принять</Button>
        </div>
      </MyModal>
      <MyModal visible={cancelVisible} setVisible={setCancelVisible}>
        <div className={cl.ModalContentWrapper}> 
          <p>Доехал ли курьер?</p>
          <ToggleSwitch checked={whileDelivering} onChange={(e) => setWhileDelivering(e.target.checked)}></ToggleSwitch>
          <p>Оплатил ли клиент доставку?</p>
          <ToggleSwitch checked={didPay} onChange={(e) => {setDidPay(e.target.checked)}}></ToggleSwitch>
          <Button color='gray' onClick={() => {finishOrder(1, whileDelivering, didPay)}}>Отменить</Button>
        </div>
      </MyModal>
    </div>
  )
}
