import React from 'react'
import cl from './TableLine.module.css'
import {Link} from "react-router-dom";
import OrderService from '../API/OrderService';

export default function TableLine({data, index, goodsPerPage, currentPage}) {
    const dataArray = Object.values(data)
    const dataArrayKeys = Object.keys(data)

    return (
        <tr className={cl.Tr}>
            <td>{(index+1)+goodsPerPage*(currentPage-1)}</td>
            {dataArray.map((dataElement, index) => 
                index === 0 ? <td key={index}><Link style={{textDecoration: 'none'}} to={(dataArrayKeys[index] ==='id'?'/main/order/':'/main/good/') + dataElement}><span className={cl.Reference}>{(dataElement).toLocaleString('en-US', {minimumIntegerDigits: 8, useGrouping:false})}</span></Link></td>:
                dataArrayKeys[index] === "telephoneNumber"?<td key={index}><a href={'tel:'+dataElement}>{dataElement}</a></td>: 
                dataArrayKeys[index] === "Date"?<td key={index}>{dataElement.toLocaleString('zh', OrderService.options).replace(/,/g,'').replaceAll('/','.')}</td>: 
                dataArrayKeys[index] === "creationDate"?<td key={index}>{dataElement.toLocaleString('zh', OrderService.options).replace(/,/g,'').replaceAll('/','.')}</td>: 
                dataArrayKeys[index] === "finishedDate"?<td key={index}>{dataElement.toLocaleString('zh', OrderService.options).replace(/,/g,'').replaceAll('/','.')}</td>: 
                <td key={index}>{dataElement}</td>)}
        </tr>
    )
}
