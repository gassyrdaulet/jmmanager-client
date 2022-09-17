import MyInput from '../UI/MyInput'
import ToggleSwitch from '../UI/ToggleSwitch'
import cl from './CreateOrderForm.module.css'
import GoodRow from './GoodRow'
import cancel from '../img/cancel.png'
import PaymentRow from './PaymentRow'
import MyButton from '../UI/MyButton'
import { useState } from 'react'
import GoodService from '../API/GoodService'
import MyTextArea from '../UI/MyTextArea'
import OrderService from '../API/OrderService'
import { useEffect } from 'react'
import Loading from '../UI/Loading'
import {useNavigate} from 'react-router-dom'
import {useInput} from '../hooks/useInput'
import Errors from '../UI/ErrorList'
import Select from 'react-select/async'
import Auth from '../API/AuthService'
import debounce from 'lodash.debounce'

export default function CreateOrderForm({data, type = 'new'}) {
  const [delivery , setDelivery] = useState(type==='new'?true:data.delivery)
  const [goodsCount, setGoodsCount] = useState(type==='new'?[[0,1,0,0,0]]:data.goodsCountEdit)
  const [paymentCount, setPaymentCount] = useState(type==='new'?[[0,0,0]]:data.paymentEdit)
  const [paymentSum, setPaymentSum] = useState(0)
  const [sumOfPayment, setSumOfPayment] = useState(0)
  const [goodSum, setGoodSum] = useState(0)
  const [totalSum, setTotalSum] = useState(0)
  const [areSumsEqual, setAreSumsEqual] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [invalidGood, setInvalidGood] = useState(false)
  const [deliver, setDeliver] = useState(type==='new'?0:data.deliver)
  const [response, setResponse] = useState('')

  const street = useInput(type==='new'||!data.delivery?'':data.address[0]?data.address[0].replace('ул. ',''):'', {isEmpty: true}, 'street')
  const house = useInput(type==='new'?'':data.address[1]?data.address[1].replace(/[^0-9]/ig,''):'', {isEmpty: true}, 'house')
  const entrance = useInput(type==='new'?'':data.address[2]?data.address[2].replace(/[^0-9]/ig,''):'', {noValidation: true}, 'number')
  const floor = useInput(type==='new'?'':data.address[3]?data.address[3].replace(/[^0-9]/ig,''):'', {noValidation: true}, 'number')
  const apartment = useInput(type==='new'?'':data.address[4]?data.address[4].replace(/[^0-9]/ig,''):'', {noValidation: true}, 'number')
  const deliveryPrice = useInput(type==='new'?0:data.deliveryPriceForCustomer, {isEmpty: true}, 'price')
  const pickupAddress = useInput(type==='new'||data.delivery?'':data.addressString, {isEmpty: true}, 'street')
  const telephone = useInput(type==='new'?'':data.telephoneNumber, {isEmpty: true}, 'tel')
  const discount = useInput(type==='new'?0:data.discount, {noValidation: true}, 'price')
  const commentary = useInput(type==='new'?'':data.comment, {noValidation: true}, 'text')
  const deliveryPriceForStore = useInput(type==='new'?0:data.deliveryPriceForStore, {isEmpty: true}, 'price')

  const router = useNavigate()

  const options = [{value: 0, label: 'Наличные'},{value: 10 , label: 'Kaspi RED'}, {value: 1, label: 'Kaspi QR'}]
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
      height: 100
    }),
    control: () => ({
      display: 'flex',
      width: 120,
      height: 50,
      fontSize: 12,
      border: '1px solid gray'
    }),
    dropdownIndicatorStyles: () => ({

    })
  }
  const selectStyle2 = {
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
      height: 100
    }),
    control: () => ({
      display: 'flex',
      textAlign: 'start',
      width: 150,
      height: 38,
      fontSize: 12,
      border: '1px solid gray'
    }),
    dropdownIndicatorStyles: () => ({

    })
  }
  const selectStyle4 = {
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
      height: 100
    }),
    control: () => ({
      margin: '5px',
      display: 'flex',
      textAlign: 'start',
      width: 190,
      height: 38,
      fontSize: 12,
      border: '1px solid gray',
      borderRadius: '1px'
    }),
    dropdownIndicatorStyles: () => ({

    })
  }
  const selectStyle3 = {
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
      height: 100
    }),
    control: () => ({
      display: 'flex',
      textAlign: 'start',
      width: 150,
      height: 38,
      fontSize: 12,
      border: '1px solid lightgray'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#b0a0a0'
    })
  }
  
  const _searchUsers = (inputValue, callback) => {
    Auth.getUsers(inputValue).then(resp => callback(resp))
  }
  const searchUsers = debounce(_searchUsers, 700)

  const sendData = async (mode='normal') => {
    setIsLoading(true)
    const body = {}
    body.goods = {}
    body.goodsCount = {}
    goodsCount.map( (good, index) => {
        body.goods[index] = good[0]
        body.goodsCount[index] = good[1]
    })
    body.payment={}
    paymentCount.map( (payment, index) => {
        body.payment[index] = {
          sum: payment[1],
          percent: payment[0]
      }
    })

    body.pickup = delivery? 0:1
    body.address = {}
    body.deliveryPriceForCustomer = 0

    if(delivery){
      body.address = {0: 'ул. ' + street.props.value , 1: ' д. ' + house.props.value}

      if(entrance.props.value !== '') {
        body.address[Object.keys(body.address).length + 1] = ' под. ' + entrance.props.value
      }
      if(floor.props.value !== '') {
        body.address[Object.keys(body.address).length + 1] = ' эт. ' + floor.props.value
      }
      if(apartment.props.value !== '') {
        body.address[Object.keys(body.address).length + 1] = ' кв. ' + apartment.props.value
      }
      body.deliveryPriceForCustomer = deliveryPrice.props.value===''?0:parseInt(deliveryPrice.props.value)
    }else{
      body.address[0] = pickupAddress.props.value
    }

    body.telephoneNumber = telephone.props.value
    body.discount = discount.props.value===''?0:parseInt(discount.props.value)
    body.comment = commentary.props.value
    body.user = localStorage.getItem('id')

    let goodsValid = true
    for(let key in body.goods){
      if(body.goods[key] === 0){goodsValid=false}
    }

    if(type==='edit'&&data.retOrEx===1){
      body.deliveryPriceForStore = deliveryPriceForStore.props.value
      body.deliver = deliver
      if(data.status===0){
        delete body.deliveryPriceForStore
        delete body.deliver
      }
      delete body.payment
      delete body.goods
      delete body.user
      delete body.pickup

        for(let key in body.goodsCount){
          body.goodsCount[key] = body.goodsCount[key]===0?0:-(body.goodsCount[key])
        }
      if(mode==='normal'&&(
        (delivery&&(
          !street.valid&&
          !house.valid&&
          !telephone.valid&&
          !deliveryPrice.valid&&
            ((data.status===1&&
              (!deliveryPriceForStore.valid&&deliver!==null))||
              data.status!==1)))||
        (!delivery&&!pickupAddress.valid))){
          try{
              console.log(body)
              await OrderService.editOrder(data.id, body)
              setIsLoading(false)
              router(delivery.status===0?'/':delivery.delivery?'/main/delivery/':'/main/pickup')
          }catch(e){
            console.log(e)
            setResponse(e.response.data.message)
            setIsInvalid(true)
            if(!goodsValid){setInvalidGood(true)}
            if( street.props.value === ''){street.setDirty(true)}
            if( house.props.value === ''){house.setDirty(true)}
            if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
            if( telephone.props.value === ''){telephone.setDirty(true)}
            if( deliveryPriceForStore.props.value === ''){deliveryPriceForStore.setDirty(true)}
            setIsLoading(false)
          }
      } else if(mode === "test") {
        console.log(body)
        setIsLoading(false)
      } else {
        console.log(body)
        setIsLoading(false)
        setIsInvalid(true)
        if(!goodsValid){setInvalidGood(true)}
        if( street.props.value === ''){street.setDirty(true)}
        if( house.props.value === ''){house.setDirty(true)}
        if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
        if( telephone.props.value === ''){telephone.setDirty(true)}
        if( deliveryPriceForStore.props.value === ''){deliveryPriceForStore.setDirty(true)}
      }
      return
    }

    if(type==='ret'){
      delete body.payment
      delete body.goods
      body.id = data.id
        for(let key in body.goodsCount){
          body.goodsCount[key] = body.goodsCount[key]===0?0:-(body.goodsCount[key])
        }
      if(goodsValid&&mode==='normal'&&(
        (delivery&&!street.valid&&
        !house.valid&&
        !telephone.valid&&
        !deliveryPrice.valid)||
        (!delivery&&!pickupAddress.valid))){
          try{
              console.log(body)
              await OrderService.newOrder(body, 5)
              router('/main/recent')
              setIsLoading(false)
          }catch(e){
            console.log(e)
            setResponse(e.response.data.message)
            setIsInvalid(true)
            if(!goodsValid){setInvalidGood(true)}
            if( street.props.value === ''){street.setDirty(true)}
            if( house.props.value === ''){house.setDirty(true)}
            if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
            if( telephone.props.value === ''){telephone.setDirty(true)}
            if( deliveryPriceForStore.props.value === ''){deliveryPriceForStore.setDirty(true)}
            setIsLoading(false)
          }
      } else if(mode === "test") {
        console.log(body)
        setIsLoading(false)
      } else {
        console.log(body)
        setIsLoading(false)
        setIsInvalid(true)
        if(!goodsValid){setInvalidGood(true)}
        if( street.props.value === ''){street.setDirty(true)}
        if( house.props.value === ''){house.setDirty(true)}
        if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
        if( telephone.props.value === ''){telephone.setDirty(true)}
        if( deliveryPriceForStore.props.value === ''){deliveryPriceForStore.setDirty(true)}
      }
      return
    }
   
    if(type==='edit'){
      body.deliveryPriceForStore = deliveryPriceForStore.props.value
      body.deliver = deliver
      if(data.status===0){
        delete body.deliveryPriceForStore
        delete body.deliver
      }
      delete body.user
      delete body.pickup

      if(goodsValid&&
        areSumsEqual&&mode==='normal'&&(
        (delivery&&(
          !street.valid&&
          !house.valid&&
          !telephone.valid&&
          !deliveryPrice.valid&&
            ((data.status===1&&
              (!deliveryPriceForStore.valid&&deliver!==null))||
              data.status!==1)))||
        (!delivery&&!pickupAddress.valid))){
          try{
              console.log(body)
              await OrderService.editOrder(data.id, body)
              setIsLoading(false)
              router(data.status===0?'/':delivery.delivery?'/main/delivery/':'/main/pickup')
          }catch(e){
            console.log(e)
            setResponse(e.response.data.message)
            setIsInvalid(true)
            if(!goodsValid){setInvalidGood(true)}
            if( street.props.value === ''){street.setDirty(true)}
            if( house.props.value === ''){house.setDirty(true)}
            if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
            if( telephone.props.value === ''){telephone.setDirty(true)}
            if( deliveryPriceForStore.props.value === ''){deliveryPriceForStore.setDirty(true)}
            setIsLoading(false)
          }
      } else if(mode === "test") {
        console.log(body)
        setIsLoading(false)
      } else {
        console.log(body)
        setIsLoading(false)
        setIsInvalid(true)
        if(!goodsValid){setInvalidGood(true)}
        if( street.props.value === ''){street.setDirty(true)}
        if( house.props.value === ''){house.setDirty(true)}
        if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
        if( telephone.props.value === ''){telephone.setDirty(true)}
        if( deliveryPriceForStore.props.value === ''){deliveryPriceForStore.setDirty(true)}
      }
      return
    }

    if(goodsValid&&
      areSumsEqual&&mode==='normal'&&(
      (delivery&&!street.valid&&
      !house.valid&&
      !telephone.valid&&
      !deliveryPrice.valid)||
      (!delivery&&!pickupAddress.valid))){
        try{
            await OrderService.newOrder(body, 0)
            router('/')
        }catch(e){
          console.log(e)
          setResponse(e.response.data.message)
          setIsInvalid(true)
          if(!goodsValid){setInvalidGood(true)}
          if( street.props.value === ''){street.setDirty(true)}
          if( house.props.value === ''){house.setDirty(true)}
          if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
          if( telephone.props.value === ''){telephone.setDirty(true)}
          setIsLoading(false)
        }
    } else if(mode === "test") {
      console.log(body)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      setIsInvalid(true)
      if(!goodsValid){setInvalidGood(true)}
      if( street.props.value === ''){street.setDirty(true)}
      if( house.props.value === ''){house.setDirty(true)}
      if( deliveryPrice.props.value === ''){deliveryPrice.setDirty(true)}
      if( telephone.props.value === ''){telephone.setDirty(true)}
    }

    setIsLoading(false)
  }

  const getGoodsPrices = (good, index) => {
    try{
    GoodService.getGoodsPrices(parseInt(good)).then((res)=> {
      const temp = goodsCount
      temp[index][2]=res.FIRST_PRICE
      temp[index][3]=res.SECOND_PRICE
      setGoodsCount(temp)
      setGoodSum(getGoodSum(temp))
    })}catch(e){
      console.log(e)
    }
  }
  const getPaymentSum = (data) => {
    let sum = 0
    data.map((payment) => sum += Math.floor((payment[1]*payment[0])/100))
    return isNaN(sum)?0:Math.abs(sum)
  }
  const getSumOfPayment = () => {
    let sum = 0
    const data = [...paymentCount]
    data.map((payment) => sum += payment[1])
    return isNaN(sum)?0:(sum)
  }
  const getGoodSum = (data) => {
    let sum = 0
    data.map((good) => sum += Math.floor(good[3]*good[1]))
    return isNaN(sum)?0:Math.abs(sum)
  }
  const getTotalSum = () => {
    function check (value){
      value = (parseInt(value))
      return isNaN(value)?0:value
    }
    const totalSum = check(goodSum) - check(discount.props.value) + check(deliveryPrice.props.value)
    return totalSum
  }
  const deleteGoodsCount = (id) => {
    const temp = goodsCount.filter(good => !(id===good[4]))
    if(goodsCount.length > 1){
      setGoodsCount(goodsCount.filter(good => !(id===good[4])))
    }
    setGoodSum(getGoodSum(temp))
  }
  const addNewGoodsCount = () => {
    if(goodsCount.length<=19){
      setGoodsCount([...goodsCount, [0,1,0,0,goodsCount[goodsCount.length-1][4]+1]])}
  }
  const addNewPaymentCount = () => {
    if(paymentCount.length<=19){
      setPaymentCount([...paymentCount, [0,0,paymentCount[paymentCount.length-1][2]+1]])}
  }
  const deletePaymentCount = (id) => {
    const temp = paymentCount.filter(payment => !(id===payment[2]))
    if(paymentCount.length > 1){
      setPaymentCount(paymentCount.filter(payment => !(id===payment[2])))
    }
  }
  const editPayment = (id,which,value) => {
    const temp = [...paymentCount]
    temp[id][which]=(isNaN(parseInt(value))?0:parseInt(value))
    setPaymentCount(temp)
    setPaymentSum(getPaymentSum(paymentCount))
  }
  const editGood = (id,which,value) => {
    const temp = [...goodsCount]
    if(which===0){
    getGoodsPrices(value, id)}
    temp[id][which]=(isNaN(parseInt(value))?0:parseInt(value))
    setGoodsCount(temp)
    setGoodSum(getGoodSum(goodsCount))
  }

  useEffect(() => {
    setTotalSum(getTotalSum())
  },[goodSum, deliveryPrice, discount])
  useEffect(() => {
    setSumOfPayment(getSumOfPayment())
  },[paymentCount])
  useEffect(() => {
    setAreSumsEqual(parseInt(sumOfPayment) === parseInt(totalSum))
  },[sumOfPayment, totalSum])

  return (
    <div className={cl.CreateOrderForm}>
      {isLoading?
        <div className={cl.LoadingWrapper}>
            <div className={cl.Loading}>
                <Loading which={1}/>
            </div>
        </div>
        :
        <span></span>}
      <div className={cl.GoodsWrapper}>
           <div className={cl.Title}>
            <h2>Товары{type==='ret'||type==='edit'&&data.retOrEx===1?' к возврату':''}:<span className={cl.Error}>*</span></h2>
            {invalidGood? <p className={cl.Error}>Выберите товар.</p> : ''}
            <p>{'Сумма ' + (type==='ret'||type==='edit'&&data.retOrEx===1?-goodSum:goodSum) + " тг"}</p>
          </div>
          <div className={cl.Goods}>
            <div className={cl.GoodsSlide}>
              <div className={cl.Titles}>
                  <p>№</p>
                  <p>Название</p>
                  <p>Кол.</p>
                  <p>Цена закуп.</p>
                  <p>Цена розн.</p>
                  <p>Сумма</p>
                  <p>Удал.</p>
                </div>
                {
                  type==='ret'||type==='edit'&&data.retOrEx===1?
                    goodsCount.map( (good, index) => <GoodRow maxDigitForCounter={type==='edit'&&data.retOrEx===1?999:good[1]} defaultValue={{option: good[2], label: data.goodsNames[index]}} isSearchable={false} firstPrice={good[2]} secondPrice={good[3]} onChange={editGood} styles={selectStyle3} loadOptions={GoodService.searchGoodByName} index={index} good={good[0]} count={good[1]} key={good[4]} id={good[4]} deleteGood={type==='ret'||type==='edit'&&data.retOrEx===1?()=>parseInt(''):deleteGoodsCount}/>)
                  :
                  type==='edit'||type==='edit'&&data.retOrEx!==1?
                    goodsCount.map( (good, index) => <GoodRow defaultValue={{option: good[2], label: data.goodsNames[index]}} firstPrice={good[2]} secondPrice={good[3]} onChange={editGood} styles={selectStyle2} loadOptions={GoodService.searchGoodByName} index={index} good={good[0]} count={good[1]} key={good[4]} id={good[4]} deleteGood={type==='ret'?()=>parseInt(''):deleteGoodsCount}/>)
                  :
                    goodsCount.map( (good, index) => <GoodRow firstPrice={good[2]} secondPrice={good[3]} onChange={editGood} styles={selectStyle2} loadOptions={GoodService.searchGoodByName} index={index} good={good[0]} count={good[1]} key={good[4]} id={good[4]} deleteGood={deleteGoodsCount}/>)
                }
                {type==='ret'||type==='edit'&&data.retOrEx===1?'':
              <div onClick={addNewGoodsCount} className={cl.Btns}>
                <p>Новая позиция</p>
                <p><img src={cancel} alt="Доб." /></p>
              </div>}
            </div>
          </div>
          <hr />
          <div className={cl.Title}>
            <h2>Доставка: <ToggleSwitch  checked={delivery} onChange={(e) => type==='edit'?'':setDelivery(e.target.checked)}/></h2><p>{type==='edit'?"(Нельзя поменнять в редактировании)":""}</p>
          </div>
          {delivery?
          <div className={cl.DeliveryInfo}>
            <div className={cl.FormItem}>
                <p>Улица:<span className={cl.Error}>*</span></p>
                <MyInput isInvalid={street.props.isInvalid} value={street.props.value} onChange={street.props.onChange} type='text' onBlur={street.props.onBlur} ></MyInput>
                <Errors>{street.isDirty? street.errorText : ''}</Errors>
            </div>
            <div className={cl.FormItem}>
                <p>Дом:<span className={cl.Error}>*</span></p>
                <MyInput value={house.props.value} onBlur={house.props.onBlur} onChange={house.props.onChange} inputMode='text' type='text' isInvalid={house.props.isInvalid}></MyInput>
                <Errors>{house.isDirty? house.errorText : ''}</Errors>
            </div>
            <div className={cl.FormItem}>
                <p>Подъезд:</p>
                <MyInput value={entrance.props.value} onChange={entrance.props.onChange} inputMode='numeric' type='text' onBlur={entrance.props.onBlur} isInvalid={entrance.props.isInvalid}></MyInput>
                <Errors>{entrance.isDirty? entrance.errorText : ''}</Errors>
            </div>
            <div className={cl.FormItem}>
                <p>Этаж:</p>
                <MyInput value={floor.props.value} onChange={floor.props.onChange} inputMode='numeric' type='text' onBlur={floor.props.onBlur} isInvalid={floor.props.isInvalid}></MyInput>
                <Errors>{floor.isDirty? floor.errorText : ''}</Errors>
            </div>
            <div className={cl.FormItem}>
                <p>Квартира:</p>
                <MyInput value={apartment.props.value} onChange={apartment.props.onChange}  inputMode='numeric' type='text' onBlur={apartment.props.onBlur} isInvalid={apartment.props.isInvalid}></MyInput>
                <Errors>{apartment.isDirty? apartment.errorText : ''}</Errors>
            </div>
            <div className={cl.FormItem}>
              <p>Стоимость доставки:<span className={cl.Error}>*</span></p>
              <MyInput value={deliveryPrice.props.value} onChange={deliveryPrice.props.onChange} inputMode='numeric' type='text' onBlur={deliveryPrice.props.onBlur} isInvalid={deliveryPrice.props.isInvalid}></MyInput>
              <Errors>{deliveryPrice.isDirty? deliveryPrice.errorText : ''}</Errors>
            </div>
            {
              type==='edit'&&data.status!==0?
              <div className={cl.FormItem}>
                <p>Расход на доставку:<span className={cl.Error}>*</span></p>
                <MyInput value={deliveryPriceForStore.props.value} onChange={deliveryPriceForStore.props.onChange} inputMode='numeric' type='text' onBlur={deliveryPriceForStore.props.onBlur} isInvalid={deliveryPriceForStore.props.isInvalid}></MyInput>
                <Errors>{deliveryPriceForStore.isDirty? deliveryPriceForStore.errorText : ''}</Errors>
              </div>:''
            }
            {
              type==='edit'&&data.status!==0?
              <div className={cl.FormItem}>
                <p>Курьер:<span className={cl.Error}>*</span></p>
                <Select
                  defaultValue={{option: deliver, label: data.deliverName}} onChange={(value) => setDeliver(value.value)} loadOptions={searchUsers} styles={selectStyle4} placeholder='Выбрать...'
                />
              </div>:''
            }
          </div>:
          <div className={cl.FormItem}>
            <p>Адрес<br/>самовывоза:</p> <span className={cl.Error}>*</span>
            <MyInput list="suggestions" value={pickupAddress.props.value} onChange={pickupAddress.props.onChange} type='text' onBlur={pickupAddress.props.onBlur} isInvalid={pickupAddress.props.isInvalid}></MyInput>
            <datalist id="suggestions">
              <option value="Косшыгулулы, д.20" />
              <option value="Манаса, д.4" />
            </datalist>
            <Errors>{pickupAddress.isDirty? pickupAddress.errorText : ''}</Errors>
          </div>}
          <hr />
          <div className={cl.Title}>
            <h2>Информация о клиенте:</h2>
          </div>
          <div className={cl.FormItem}>
              <p>Номер телефона:<span className={cl.Error}>*</span></p>
              <MyInput value={telephone.props.value} onChange={telephone.props.onChange}   inputMode='tel' placeholder='Номер телефона' type='text' onBlur={telephone.props.onBlur} isInvalid={telephone.props.isInvalid}></MyInput>
              <Errors>{telephone.isDirty? telephone.errorText : ''}</Errors>
          </div>
          <hr />
          {type==='ret'||type==='edit'&&data.retOrEx===1?"":
          <div className={cl.Title}>
            <h2>Расчет комиссии:</h2>
            {!areSumsEqual? <p className={cl.Error}>Суммы должны быть равны</p> : ''}
            <p>{'Комиссия ' + paymentSum + ' тг'}, <span className={!areSumsEqual?cl.RedText:''}>Разница {sumOfPayment - totalSum} тг</span></p>
          </div>}
          {type==='ret'||type==='edit'&&data.retOrEx===1?"При возврате способы оплаты не указываются":
          <div className={cl.Goods}>
            <div className={cl.PaymentSlide}>
              <div className={cl.PaymentTitles}>
                  <p>№</p>
                  <p>Способ оплаты</p>
                  <p>Сумма</p>
                  <p>Комм.</p>
                  <p>Удал.</p>
                </div>
              {paymentCount.map((payment, index) => <PaymentRow defaultValue={{option: payment[0], label: 'Ком. ' +payment[0]+ '%'}} style={selectStyle} options={options} onChange = {editPayment} paymentMethod={payment[0]} paymentSum={payment[1]} index={index} id={payment[2]} key={payment[2]} deletePayment={deletePaymentCount}/>)}
              <div onClick={addNewPaymentCount} className={cl.PaymentBtns}>
                <p>Новая позиция</p>
                <p><img src={cancel} alt="Доб." /></p>
              </div>
            </div>
          </div>}
          <hr />
          <div className={cl.Title}>
            <h2>Дополнительно:</h2>
          </div>
          <div className={cl.FormItem}>
              <p>Скидка:</p>
              <MyInput value={discount.props.value} onChange={discount.props.onChange}  inputMode='numeric' type='text' onBlur={discount.props.onBlur} isInvalid={discount.props.isInvalid}></MyInput>
              <Errors>{discount.isDirty? discount.errorText : ''}</Errors>
          </div>
          <div className={cl.FormItem + ' ' + cl.Comment}>
              <p>Коммент.:</p>
              <MyTextArea {...commentary.props}></MyTextArea>
              <p></p>
          </div>
          <hr />
        </div>
        <div className={cl.Commit}>
          {
            type==='new'?<MyButton onClick={() => sendData('normal')} color='green'>Создать</MyButton>:
            type==='edit'?<MyButton onClick={() => sendData('normal')} color='blue'>Сохранить</MyButton>:
            type==='ret'?<MyButton onClick={() => sendData('normal')} color='red'>Возврат</MyButton>:''
          }
          <p >Общая сумма: {totalSum} тг</p>
          {isInvalid? <p className={cl.Error}>Обнаружены ошибки. Проверьте все поля для заполнения. {response}</p>:''}
        </div>
    </div>
  )
}
