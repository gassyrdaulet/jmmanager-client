import React from 'react'
import cl from './WhiteTable.module.css'
import {Link} from 'react-router-dom'

export default function WhiteTable({tableTitles, title, data}) {
    return (
        <div className={cl.WhiteTableWrapper}>
            <div className={cl.Title}>
                <h3>{title}</h3>
            </div>
            <div className={cl.Content}>
                <table>
                    <tbody>
                        {tableTitles.map((tableTitle, index) => 
                            <tr key={index}>
                                <td>{tableTitle}</td>
                                <td>{(data[index])===undefined? 'Отсутствует' :(data[index])===null ? "Отсутствует" : typeof(data[index])==='object'? data[index].id? <Link className={cl.Reference} to={'/main/userpage/'+data[index].id}>{data[index].name}</Link> : data[index].order? <Link className={cl.Reference} to={'/main/order/'+data[index].order}>{data[index].order}</Link>: 'Отсутствует': data[index]}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
