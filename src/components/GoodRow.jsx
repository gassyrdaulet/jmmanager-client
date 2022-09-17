import CounterInput from '../UI/CounterInput'
import cl from './GoodRow.module.css'
import cancel from '../img/cancel.png'
import Select from 'react-select/async'
import debounce from 'lodash.debounce'
import { useState } from 'react'
import { useEffect } from 'react'

export default function GoodRow({maxDigitForCounter:maxDigit, isSearchable, defaultValue, firstPrice, secondPrice, onChange: editGood, loadOptions, styles, index, good:goods, count : counts, deleteGood, id}) {
  const [good, setGood] = useState(goods)
  const [count, setCount] = useState(counts)
  const [maxDigitForCounter] = useState(maxDigit)

  const _searchGoods = (inputValue, callback) => {
    loadOptions(inputValue).then(resp => callback(resp))
  }

  const handleChange = (setValue ,value, which) => {
    if(value>=1&&value<999){
      value = (value+'').replace(/^0{1,}|[^0-9]/ig,'')
      setValue(value)
      editGood(index, which, value)}
    else if(value>=999){
      setValue(999)
      editGood(index, which, value)}
    else if(value===''){
      setValue('')
    }
  }
  const handleChange2 = (setValue ,value, which) => {
    if(value>=0&&value<maxDigitForCounter){
      value = (value+'').replace(/^0{2,}|^0.|[^0-9]/ig,'')
      setValue(value)
      editGood(index, which, value)}
    else if(value>=maxDigitForCounter){
      setValue(maxDigitForCounter)
      editGood(index, which, value)}
    else if(value===''){
      setValue('')
    }
  }

  const handleBlur = (setValue, value, which) => {
    if(value===''){
      handleChange(setValue, 1, which)
    }
  }

  const searchGoods = debounce(_searchGoods, 700)

  useEffect( () => {
    handleChange(setGood, good, 0)
  }, [])

  return (
    <div className={cl.GoodRow}>
        <p className={cl.Number}>{index+1}</p>
        <div className={cl.GoodRowElement}> 
            <Select isSearchable={isSearchable} defaultValue={defaultValue} onChange={(value) => handleChange(setGood, value.value, 0)} loadOptions={searchGoods} styles={styles} placeholder={"Введите название..."}/>
        </div>
        <div className={cl.GoodRowElementHor}> 
            <CounterInput setValue={setCount} onClickArrow={maxDigitForCounter?handleChange2:(handleChange)} onBlur={(e) => (handleBlur(setCount, e.target.value, 1))} value={count} maxDigitForCounter={maxDigitForCounter} onChange={(e) => {maxDigitForCounter?handleChange2(setCount,e.target.value, 1):handleChange(setCount,e.target.value, 1)}}/> шт.
        </div>
        <div className={cl.GoodRowElement}> 
            <p className={cl.FirstPrice}> {firstPrice + 'тг'}</p>
        </div>
        <div className={cl.GoodRowElement}> 
            <p className={cl.SecondPrice}> {secondPrice + 'тг'}</p>
        </div>
        <div className={cl.GoodRowElement}> 
            <p className={cl.SecondPrice}> {secondPrice*count  + 'тг'}</p>
        </div>
        <div className={cl.GoodRowElement}> 
          <div onClick={() => deleteGood(id)} className={cl.DeleteElementBtn}><img src={cancel} alt="Удал." /></div>
        </div>
    </div>
  )
}
