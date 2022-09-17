import axios from "axios";

export default class Auth{
    static isTestingOnPhone = true
    static ip = 'jackmarket.kz'

    static async payOff(sum, user, comment) {
      const {data} = await axios.post(('https://'+(Auth.isTestingOnPhone?Auth.ip:'localhost')+':5000/api/auth/payoff'),
        {
          sum, user, comment
        }, 
        {
        headers: {
          authorization: "Bearer " + localStorage.getItem('token')
        }
        }
      )
      return data
    }

    static async getAllUsers() {
      const {data} = await axios.get(('https://'+(Auth.isTestingOnPhone?Auth.ip:'localhost')+':5000/api/auth/users/all'),
      {
        headers:{
          authorization: "Bearer " + localStorage.getItem('token')
        }
      })
      return data
    }

    static async getTransactions(user, firstDate, secondDate){
      const data = await axios.get(('https://'+(Auth.isTestingOnPhone?Auth.ip:'localhost')+':5000/api/auth/transactions'), 
        {
          headers:{
            authorization: "Bearer " + localStorage.getItem('token')
          }, 
          params:{
            firstDate,
            secondDate,
            id: user
          }
      })
      return data
    }

    static async getUsers(searchValue){
      const {data} = await axios.get('https://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/auth/users',
      {
          headers:{
              authorization: "Bearer " + localStorage.getItem('token')
          },  
          params: {
              searchValue
          }
      })
      return data
  }

    static async getBalance( id ) {
      try{
        const {data} = await axios.get((Auth.isTestingOnPhone? 'https://'+Auth.ip+':5000/api/auth/balance/':'https://localhost:5000/api/auth/balance/') + id, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        return data
      }catch(e){
        return(e)
      }
    }

    static async login ( event, email, password, setIsAuth, setError, setIsLoading) {
      event.preventDefault()
      setIsLoading(true)
      const toDay = ((new Date(Date.now() + 6*60*60*1000)).toISOString().substring(0,10))
      const yesterDay = ((new Date(Date.now() + 6*60*60*1000)).toISOString().substring(0,10))

      try{
          const data = await axios.post(Auth.isTestingOnPhone? 'https://'+Auth.ip+':5000/api/auth/login':'https://localhost:5000/api/auth/login', {
          email,
          password
        })
        if(data.data.token !== undefined){
          setIsAuth(true)
          localStorage.setItem('auth', 'true')
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('email', data.data.user.email)
          localStorage.setItem('role', data.data.user.role)
          localStorage.setItem('name', data.data.user.name)
          localStorage.setItem('id', data.data.user.id)
          localStorage.setItem('toDay', toDay)
          localStorage.setItem('firstDate', yesterDay)
          localStorage.setItem('secondDate' ,toDay)
          localStorage.setItem('firstDateTr' ,yesterDay)
          localStorage.setItem('secondDateTr' ,toDay)
          localStorage.setItem('firstDateTrOther' ,yesterDay)
          localStorage.setItem('secondDateTrOther' ,toDay)
        }
        setIsLoading(false)
        return data.data
        }catch(e){
          setIsLoading(false)
          setError(e.response.data.message)
          console.log(e)
        }
  }
}