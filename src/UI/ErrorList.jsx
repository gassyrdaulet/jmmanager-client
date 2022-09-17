import {useState, useRef} from 'react'
import { useOutsideAlerter } from '../hooks/useOutsideAlerter'
import cl from './ErrorList.module.css'

export default function ({children}) {
    const [areErrorsShown, setAreErrorsShown] = useState(false)
    const ErrorList = useRef(null)
    useOutsideAlerter(ErrorList, setAreErrorsShown)

    return (
        <div className={cl.ErrorList}>
            {children.length > 0 ?
                <div className={cl.ErrorListWrapper}>
                    <div  onClick={() => setAreErrorsShown(!areErrorsShown)} className={cl.Button}></div>
                    <div ref={ErrorList} className={areErrorsShown? cl.List : cl.ListHidden}>
                        {children}
                    </div>
                </div> :
                <span/>    
            }
        </div>
    )
}
