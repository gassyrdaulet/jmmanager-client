import {useState} from 'react'
import { useValidation } from './useValidation'

export const useInput = (initialValue, validations, limiter) => {
    const [value , setValue] = useState(initialValue)
    const [isDirty, setDirty] = useState(false)
    const valid = useValidation(value, validations)

    const onChange = e => {
        let temp = ''
        if(limiter=== 'street'){
            temp = e.target.value.replace(/([^a-zа-яё0-9-,.\s])/ig,'').replace(/-+/ig,'-').substring(0,99)
            setValue(temp)
        }else if (limiter === 'tel') {
            temp = e.target.value.replace(/\s|[^0-9-+()]/ig,'').replace(/-+/ig,'-').replace(/\)+/ig,')').replace(/\(+/ig,'(').replace(/\++/ig,'+').substring(0,13)
            setValue(temp)
        }else if (limiter === 'number') {
            temp = e.target.value.replace(/^0{1,}|[^0-9]/igm,'').substring(0,7)
            setValue(temp)
        }else if(limiter==='text'){
            temp = e.target.value.replace(/[^0-9а-яa-z\s\.\,\/\-]/ig,'').substring(0,50)
            setValue(temp)
        }else if(limiter==='house'){
            temp = e.target.value.replace(/^0{1,}|[^0-9\/]/igm,'').substring(0,5)
            setValue(temp)
        }else if(limiter==='price'){
            temp = e.target.value.replace(/^0{2,}|^0.|[^0-9\/]/igm,'').substring(0,5)
            setValue(temp)
        }else {
            setValue(e.target.value)
        }
    }

    const onBlur = e => {
        setDirty(true)
    }

    return (
        {
            props:{
                isInvalid: isDirty&&valid.valid,
                value, onChange, onBlur,
            },
            isDirty, ...valid, setDirty
        }
    )
}