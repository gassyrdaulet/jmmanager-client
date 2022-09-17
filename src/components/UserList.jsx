import React from 'react'
import cl from './UserList.module.css'

export default function UserList({users = [], selected, setSelected, setName}) {
  return (
    <div className={cl.UserListWrapper}>
        {users.length<=0?'Нет пользователей':''}
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              <th>Баланс</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => <tr onClick={() => {setSelected(user.id);setName(user.name)}} className={selected===user.id?cl.Selected:cl.Normal} key={user.id}><td>{index+1}</td><td>{user.name}</td><td>{user.balance}тг</td></tr>)}
          </tbody>
        </table>
    </div>
  )
}
