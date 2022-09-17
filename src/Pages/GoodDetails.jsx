import React, {useState, useEffect} from 'react'
import cl from './GoodDetails.module.css'
import {useParams} from 'react-router-dom'
import GoodService from '../API/GoodService.js'
import OrderService from '../API/OrderService'
import Loading from '../UI/Loading'
import Button from '../UI/MyButton'
import MyModal from '../UI/MyModal'
import MyInput from '../UI/MyInput'
import {useInput} from '../hooks/useInput'
import { useNavigate } from 'react-router-dom'

export default function GoodDetails() {
  const [goodInfo, setGoodInfo] = useState([])
  const [isGoodInfoLoading, setIsGoodInfoLoading] = useState(false)
  const [editGoodActive, setEditGoodActive] = useState(false)
  const [deleteGoodActive, setDeleteGoodActive] = useState(false)
  const params = useParams()
  const firstPrice = useInput('', {isEmpty: true}, 'number')
  const secondPrice = useInput('', {isEmpty: true}, 'number')
  const name = useInput('', {isEmpty: true}, 'text')
  const router = useNavigate()

  const getGoodInfo = async () => {
    setIsGoodInfoLoading(true)
    try{
      setGoodInfo(await GoodService.getGoodInfo(params.id))
      setIsGoodInfoLoading(false)
    }catch(e){
      console.log(e)
      setIsGoodInfoLoading(false)
    }
  }

  const editGoodInfo = async () => {
    await GoodService.editGood(params.id, {
      NAME: name.props.value,
      FIRST_PRICE: firstPrice.props.value,
      SECOND_PRICE: secondPrice.props.value
    })
    getGoodInfo()
    setEditGoodActive(false)
  }

  const deleteGood = async () => {
    await GoodService.deleteGood(params.id)
    router(-1)
  }

  useEffect( () => {
    getGoodInfo()
  }, [])

  return (
    <div className={cl.GoodWrapper}>
      <h1 className={cl.Center}>Товар #{params.id}</h1>
      {isGoodInfoLoading?
        <div className={cl.Center + ' ' + cl.MarginTop40}>
          <Loading which={1}/>
        </div>:
        <div className={cl.Good}>
          <h3 className={cl.Center + ' ' + cl.WithLine}>
            {(goodInfo.NAME)}
          </h3>
          <table className={cl.Table}>
            <thead>
              <tr>
                <th>Цена закупочная</th>
                <th>Цена розничная</th>
                <th>Дата последнего обновления</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{goodInfo.FIRST_PRICE}</td>
                <td>{goodInfo.SECOND_PRICE}</td>
                <td>{new Date(goodInfo.DATE).toLocaleString('zh', OrderService.options).replace(/,/g,'').replaceAll('/','.')}</td>
              </tr>
            </tbody>
          </table>
          <div className={cl.Buttons + ' ' + cl.JustifyCenter}>
            <Button onClick={() => setEditGoodActive(true)} color='blue'>Редактировать</Button>
            <Button onClick={() => setDeleteGoodActive(true)} color='red'>Удалить</Button>
          </div>
        </div>}
          <MyModal visible={editGoodActive} setVisible={setEditGoodActive}>
            <div>
              <p className={cl.Center + ' ' + cl.WithBottomLine}>
                Редактирование
              </p>
              <MyInput {...name.props} inputMode={'text'} placeholder='Название'/>
              <MyInput {...firstPrice.props} inputMode={'numeric'} placeholder='Закупочная цена'/>
              <MyInput {...secondPrice.props} inputMode={'numeric'} placeholder='Розничная цена'/>
              <div className={cl.Buttons + ' ' + cl.JustifyCenter}>
                <Button onClick={editGoodInfo} color='blue' disabled={name.valid||firstPrice.valid||secondPrice.valid}>Подтвердить</Button>
              </div>
            </div>
          </MyModal>
          <MyModal visible={deleteGoodActive} setVisible={setDeleteGoodActive}>
            <div>
              <p className={cl.Center + ' ' + cl.WithBottomLine}>
                Вы Уверены?
              </p>
              <div className={ cl.SpaceBetween + ' ' + cl.Buttons + ' ' + cl.MarginTop40}>
                <Button color='blue' onClick={deleteGood}>Да</Button>
                <Button onClick={() => setDeleteGoodActive(false)} color='red'>Нет</Button>
              </div>
            </div>
          </MyModal>
    </div>
  )
}
