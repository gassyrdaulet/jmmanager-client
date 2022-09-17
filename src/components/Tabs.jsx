import React , {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../UI/Loading'
import refreshImage from '../img/refresh.png'
import cl from './Tabs.module.css'

export default function Tabs({children, openedTab, updateData}) {
    const router = useNavigate()
    const [toggleState, setToggleState] = useState(openedTab)
    const [wasPressed, setWasPressed] = useState(0)
    const toggleTab = (index) => { setToggleState(index) }
    
    useEffect(() => {
        toggleTab(openedTab)
    },[openedTab])
    
    return (
        <div className={cl.TabsWrapper}>
            <div className={cl.TabsHeader}>
                <div className={cl.TabsSlider}>
                    <div className={cl.Tabs}>
                        {children.map((child) => 
                        <div className={toggleState === parseInt(child.props.id)? cl.Tab + ' ' + cl.isActive : cl.Tab} onClick={() => {router('/main/'+child.props.link)}} key={child.props.id}>{child.props.tabname}</div>)}
                    </div>
                </div>
                {toggleState !== 5 ?
                    <div className={wasPressed === 1 ? cl.Refresh2 : (wasPressed === 2 ? cl.Refresh3 : cl.Refresh1)}><img onClick={() => {updateData();setWasPressed(wasPressed === 1? 2 : 1)}} src={refreshImage} alt='Обн.' /></div>
                :
                    <div className={cl.Placebo}></div>
                }
                </div>
            <div className={cl.TabsContents}>
                <div className={cl.TabsContent}>
                    {children[toggleState-1]}
                </div>
            </div>
        </div>
    )
}
