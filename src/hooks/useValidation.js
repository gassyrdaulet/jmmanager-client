import {useState, useEffect} from 'react'

export const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true)
    const [minLengthError, setMinLengthError] = useState(false)
    const [maxLengthError, setMaxLengthError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [errorText, setErrorText] = useState('')

    useEffect( () => {
        setErrorText('')
        let text = ''
        for (const validation in validations) {
            switch (validation) {
                case 'password':
                    if(!value.match(/[A-z.!@0-9]/g)){
                        setPasswordError(true)
                        text += 'Пароль должен состоять только из английских букв, цифр и символов "." , "!" , "@".\n'
                    }
                    else{
                        setPasswordError(false)
                    }
                    break;
                case 'email':
                    if(!value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                        setEmailError(true)
                        text += `Некорректный E-mail.\n`
                    }else{
                        setEmailError(false)
                    }
                    break;
                case 'minLength':
                    if(value.length < validations[validation]){
                        setMinLengthError(true) 
                        text += `Минимальная длина - ${validations[validation]}.\n`
                    }
                    else{
                        setMinLengthError(false)
                    }
                    break;  
                case 'maxLength':
                    if(value.length > validations[validation]){
                        setMaxLengthError(true)
                        text += `Максимальная длина - ${validations[validation]}.\n`
                    }
                    else{
                        setMaxLengthError(false)
                    }
                    break;
                case 'isEmpty':
                    if(value){
                        setEmpty(false)
                    }
                    else{
                        setEmpty(true)
                        text += 'Поле не может быть пустым.\n'
                    }
                    break;
                case 'noValidation':
                    setEmpty(false)
                    break;
            }
            if(text.length !== 0){
                setErrorText(text.substring(0, text.length - 2) + '.')
            }
        }
    }, [value])

    return {
        errorText, valid: isEmpty||minLengthError||maxLengthError||emailError||passwordError
    }
}