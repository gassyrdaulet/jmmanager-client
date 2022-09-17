import React, {useState, useEffect, useMemo} from 'react'
import cl from './ProfilePage.module.css'
import Auth from '../API/AuthService'
import TransactionsRow from '../components/TransactionsRow'
import DateInput from '../components/DateInput'
import Loading from '../UI/Loading'
import Pagination from '../components/Pagination'
import UserList from '../components/UserList'
import MyInput from '../UI/MyInput'
import {useInput} from '../hooks/useInput'
import Button from '../UI/MyButton'
import ErrorList from '../UI/ErrorList'
import debounce from 'lodash.debounce'
import userimg from '../img/user.png'
import adminpng from '../img/admin.png'
import creatorpng from '../img/creator.png'
import scorp from '../img/scorp.jpg'

export default function ProfilePage() {
const [transactions, setTransactioins] = useState([])
const [transactionsOther, setTransactioinsOther] = useState([])
const [isLoading, setIsLoading] = useState(false)
const [isOtherLoading, setIsOtherLoading] = useState(false)
const [isPayOffLoading, setIsPayOffLoading] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const [currentPage2, setCurrentPage2] = useState(1)
const [goodsPerPage] = useState(10)
const [selectedUser, setSelectedUser] = useState(0)
const [selectedUserName, setSelectedUserName] = useState('Выберите пользователя')
const searchUser = useInput('', {noValidation: true}, 'text')
const sum = useInput('', {isEmpty: true}, 'number')
const comment = useInput('', {maxLength: 50, noValidation: true}, 'text')
const [users, setUsers] = useState([])


const _payOff = async (sign) => {
    setIsPayOffLoading(true)
    try{
        if(sign==='add'){
            await Auth.payOff(parseInt(sum.props.value), selectedUser, comment.props.value)
        }
        else if(sign==='minus'){
            await Auth.payOff(-parseInt(sum.props.value), selectedUser, comment.props.value)
        }
        getAllUsers()
        getTransactions(localStorage.getItem('firstDateTr'), localStorage.getItem('secondDateTr'))
        getTransactionsOther(localStorage.getItem('firstDateTrOther'), localStorage.getItem('secondDateTrOther'))
        setIsPayOffLoading(false)
    }catch(e){
        console.log(e)
        getAllUsers()
        getTransactions(localStorage.getItem('firstDateTr'), localStorage.getItem('secondDateTr'))
        getTransactionsOther(localStorage.getItem('firstDateTrOther'), localStorage.getItem('secondDateTrOther'))
        setIsPayOffLoading(false)
    }
}
const payOff = debounce(_payOff, 1000)
const getTransactions = async (firstDate, secondDate) => {
    setIsLoading(true)
    try{
        const response = await Auth.getTransactions(localStorage.getItem('id'), firstDate, secondDate)
        setTransactioins(response.data)
        setIsLoading(false)
    }catch(e){
        console.log(e)
        setIsLoading(false)
    }
}

const getTransactionsOther = async (firstDate, secondDate) => {
    setIsOtherLoading(true)
    try{
        const response = await Auth.getTransactions(selectedUser, firstDate, secondDate)
        setTransactioinsOther(response.data)
        setIsOtherLoading(false)
    }catch(e){
        console.log(e)
        setIsOtherLoading(false)
    }
}

const paginate = (page) => {
    if(page>totalPages){
        setCurrentPage(totalPages)
    }else if(page<1){
        setCurrentPage(1)
    }else{
        setCurrentPage(page)
    }
}

const paginate2 = (page) => {
    if(page>totalPages2){
        setCurrentPage2(totalPages2)
    }else if(page<1){
        setCurrentPage2(1)
    }else{
        setCurrentPage2(page)
    }
}

const getAllUsers = async () => {
    setUsers(await Auth.getAllUsers())
}

useEffect( () => {
    getAllUsers()
    getTransactions(localStorage.getItem('firstDateTr'), localStorage.getItem('secondDateTr'))
},[])
useEffect( () => {
    getTransactionsOther(localStorage.getItem('firstDateTrOther'), localStorage.getItem('secondDateTrOther'))
},[selectedUser])


const sortedTransactioins = useMemo(() => {
    try{
        const sortedArray = [...transactions].sort((a,b) => ((b.date) < (a.date)?-1:(b.date) > (a.date)?1:0))
        return sortedArray
    }catch(e){
        console.log(e)
        return []
    }
}, [transactions])
const sortedTransactioinsOther = useMemo(() => {
    try{
        const sortedArray = [...transactionsOther].sort((a,b) => ((b.date) < (a.date)?-1:(b.date) > (a.date)?1:0))
        return sortedArray
    }catch(e){
        console.log(e)
        return []
    }
}, [transactionsOther])

const indexOfLastPost = currentPage * goodsPerPage
const indexOfFirstPost = indexOfLastPost - goodsPerPage
const currentData = (sortedTransactioins.slice(indexOfFirstPost, indexOfLastPost))
const totalPages = Math.ceil(transactions.length/goodsPerPage)

const indexOfLastPost2 = currentPage2 * goodsPerPage
const indexOfFirstPost2 = indexOfLastPost2 - goodsPerPage
const currentData2 = (sortedTransactioinsOther.slice(indexOfFirstPost2, indexOfLastPost2))
const totalPages2 = Math.ceil(transactionsOther.length/goodsPerPage)

const sortedUsers = useMemo(() => {
    try{
        const sortedArray = [...users].sort((a, b) => parseInt(b.balance) - parseInt(a.balance))
        return sortedArray
    }catch(e){
        console.log(e);
        return []
    }
},[users])
const filterUsers = useMemo(() => {
    try{
        const temp = [...sortedUsers].filter(user => (user.name.toLowerCase()).includes(searchUser.props.value.toLowerCase()))
        return temp
    }catch(e){
        console.log(e);
        return []}
},[searchUser.props.value, users, sortedUsers])

  return (
    <div className={cl.ProfilePage}>
        <h1 className={cl.Title}>Мой Профиль</h1>
        <h3 className={cl.Title2}>Информация о пользователе</h3>
        <div className={cl.Avatar + ' ' + (localStorage.getItem('role')==='1'?cl.AdminAvatar:localStorage.getItem('role')==='2'?cl.AdminAvatar1:'')}>
            <div className={cl.AvatarPlaceholder}/>
            {localStorage.getItem('role')==='1'?
                <img src={adminpng} alt="" />:
                localStorage.getItem('role')==='2'?
                    <img src={scorp} alt="" />:
                    <img src={userimg} alt="" />
                }
        </div>
        <div className={cl.ProfileInfo}>
            <p>Имя: {localStorage.getItem('name')}</p>
            <p>ID: {localStorage.getItem('id')}</p>
            <p>E-mail: {localStorage.getItem('email')}</p>
            <p>Роль: {(localStorage.getItem('role')==="1"?'Администратор':localStorage.getItem('role')==="2"?"Создатель":"Пользователь")}</p>
        </div>
        <h3 className={cl.Title2}>История транзакций</h3>
        <DateInput type='transactions' updateFinishedOrders={getTransactions} dates={{yesterDay: localStorage.getItem('firstDateTr'), toDay: localStorage.getItem("secondDateTr")}}></DateInput>
        {isLoading?
        <div className={cl.LoadingWrapper}> 
            <Loading which={3}></Loading>
        </div>
        :
        currentData.length>0?
        <div className={cl.Transactions}>
            <table className={cl.Table}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Дата и время транзакции</th>
                        <th>ID</th>
                        <th>Тип транзакции</th>
                        <th>Сумма транзакции</th>
                        <th>Баланс после</th>
                        <th>Комментарий</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((transaction, index) => 
                        <TransactionsRow key={transaction.id} index={index} data={transaction}></TransactionsRow>
                    )}
                </tbody>
            </table>
        </div>
        :
        'Ничего не найдено.'}
        <Pagination totalGoods={transactions.length} paginate={paginate} goodsPerPage = {goodsPerPage} totalPages = {totalPages} currentPage={currentPage}></Pagination>
        {(localStorage.getItem('role')==='1'||localStorage.getItem('role')==='2')?<div className={cl.AdminTools}><h1 className={cl.Title2}>Инструменты администратора</h1>
        <div className={cl.HorResizable}>
            <div className={cl.Select}>
                <p>Список пользователей:</p>
                <div className={cl.Hor}><MyInput {...searchUser.props} placeholder={'Найти...'}></MyInput></div>
                <UserList setName={setSelectedUserName} key='0' setSelected={setSelectedUser} selected={selectedUser} users={filterUsers}></UserList>
            </div>
            <div className={cl.Select + ' ' + cl.Start}>
                <p className={cl.Center + ' ' + cl.FixedHeight}>Расчет c пользователем '{selectedUserName}', ID: {selectedUser}</p>
                <div className={cl.HorNoMargin}>
                    <MyInput {...sum.props} placeholder='Сумма расчета' inputMode={'number'}></MyInput><ErrorList>{sum.props.isInvalid?sum.errorText:''}</ErrorList>
                </div>
                <MyInput {...comment.props} placeholder='Комментарий'></MyInput>
                <div className={cl.Hor}>
                    <Button onClick={() => payOff("add")} disabled={sum.valid||selectedUser===0}>{isPayOffLoading?<Loading/>:'Добавить'}</Button>
                    <Button onClick={() => payOff("minus")} disabled={sum.valid||selectedUser===0} color='green'>{isPayOffLoading?<Loading/>:'Расчет'}</Button>
                </div>
            </div>
        </div>
        <p className={cl.Center}>История транзакций пользователя '{selectedUserName}'</p>
        <DateInput type='transactionsOther' updateFinishedOrders={getTransactionsOther} dates={{yesterDay: localStorage.getItem('firstDateTrOther'), toDay: localStorage.getItem("secondDateTrOther")}}></DateInput>
        {isOtherLoading?
        <div className={cl.LoadingWrapper}> 
            <Loading which={3}></Loading>
        </div>
        :
        currentData2.length>0?
        <div className={cl.Transactions}>
            <table className={cl.Table}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Дата и время транзакции</th>
                        <th>ID</th>
                        <th>Тип транзакции</th>
                        <th>Сумма транзакции</th>
                        <th>Баланс после</th>
                        <th>Комментарий</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData2.map((transaction, index) => 
                        <TransactionsRow key={transaction.id} index={index} data={transaction}></TransactionsRow>
                    )}
                </tbody>
            </table>
        </div>
        :
        <p className={cl.Center}>Ничего не найдено.</p>}
        <Pagination totalGoods={transactionsOther.length} paginate={paginate2} goodsPerPage = {goodsPerPage} totalPages = {totalPages2} currentPage={currentPage2}></Pagination></div>:''}
    </div>
  )
}
