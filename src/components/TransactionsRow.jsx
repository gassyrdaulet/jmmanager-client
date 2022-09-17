import React from 'react'
import cl from './TransactionsRow.module.css'
import OrderService from '../API/OrderService'

export default function TransactionsRow({data, index}) {
    
  return (
    <tr>
        <td className={cl.TransactionsRow}>{index + 1}</td>
        <td className={cl.TransactionsRow}>{new Date((new Date(data.date)).getTime()).toLocaleString('zh', OrderService.options).replace(/,/g,'').replaceAll('/','.')}</td>
        <td className={cl.TransactionsRow}>{data.user}</td>
        <td className={cl.TransactionsRow}>{data.type}</td>
        <td className={cl.TransactionsRow}>{(parseInt(data.sum)>0?<span className={cl.Green}>+{data.sum}</span>:<span className={cl.Red}>{data.sum}</span>)}</td>
        <td className={cl.TransactionsRow}>{data.balance}</td>
        <td className={cl.TransactionsRow}>{data.comment}</td>
    </tr>
  )
}
