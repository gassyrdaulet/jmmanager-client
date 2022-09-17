import React from 'react'
import cl from './WhiteTableCompound.module.css'
import { Link } from 'react-router-dom'

export default function WhiteTableCompound({title, tableTitles, data, goods}) {
    return (
    <div className={cl.WhiteTableWrapper}>
        <div className={cl.Title}>
            <h3>{title}</h3>
        </div>
        <div className={cl.Content}>
            <table>
                <thead>
                    <tr>
                        {tableTitles.map((tableTitle, index) => <th key={index}>{tableTitle}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {goods.map((good, index) => 
                        <tr key={index}>
                            <td><Link className={cl.Reference} to={"/main/good/" + good}>{(data[3][index])?data[3][index].length !== 0?data[3][index]:goods[index]:goods[index]}</Link></td>
                            <td>{data[1][index] + ' шт.'}</td>
                            <td>{data[2][index].FIRST_PRICE}</td>
                            <td>{data[2][index].SECOND_PRICE}</td>
                            <td>{Math.floor((data[2][index].SECOND_PRICE - data[2][index].FIRST_PRICE)/2)*data[1][index]}</td>
                        </tr>)}
                        <tr><td className={cl.Total} colSpan='5'>{data[4]? data[4].status===2? 'Общая выгода для продавца: ' + data[4].incomeForUser  + ' тг':null:null}</td></tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}
