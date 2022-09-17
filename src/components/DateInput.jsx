import React, {useState} from 'react'
import cl from './DateInput.module.css'
import MyInput from '../UI/MyInput'
import MyColoredButton from '../UI/MyColoredButton'
import refreshButton from '../img/refresh.png'

export default function DateInput({updateFinishedOrders , dates, type = 'orders'}) {
    const [firstDate, setFirstDate] = useState(dates.yesterDay)
    const [secondDate, setSecondDate] = useState(dates.toDay)

    return (
        <div className={cl.DateWrapper}>
            <div className={cl.DateWrapper2}>
                <div className={cl.Date}>
                    <p>с: </p><MyInput type="date" value={firstDate} onChange={(e) => {setFirstDate(e.target.value); localStorage.setItem(type==='orders'?'firstDate':type==='transactions'?'firstDateTr':'firstDateTrOther',e.target.value)}}/>
                    <p>до: </p><MyInput type="date" value={secondDate} onChange={(e) => {setSecondDate(e.target.value); localStorage.setItem(type==='orders'?'secondDate':type==='transactions'?'secondDateTr':'secondDateTrOther',e.target.value)}}/>
                    <MyColoredButton color='lightsky' onClick={() => {updateFinishedOrders(firstDate, secondDate)}}><img src={refreshButton}  alt='Обн.'  /></MyColoredButton>
                </div>
            </div>
        </div>
    )
}
