import axios from "axios";
import Auth from './AuthService.js'

export default class GoodService{
    static options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }

    static async editGood(id, body){
        const {data} = await axios.patch('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/edit', body,
        {
            params:{
                id
            },
            headers:{
                authorization: "Bearer " + localStorage.getItem('token')
            }
        })
        return data
    }

    static async newGood(body){
        const {data} = await axios.post('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/new', body,
        {
            headers:{
                authorization: "Bearer " + localStorage.getItem('token')
            }
        })
        return data
    }
    
    static async deleteGood(id){
        const {data} = await axios.delete('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/delete',
        {
            params:{
                id
            },
            headers:{
                authorization: "Bearer " + localStorage.getItem('token')
            }
        })
        return data
    }

    static async getGoodInfo(id){
        const {data} = await axios.get('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/details',
        {
            params:{
                id
            },
            headers:{
                    authorization: "Bearer " + localStorage.getItem('token')
            }
        })
        return data
    }

    static async getGoodsPrices(id){
        const {data} = await axios.get('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/prices',
        {
            headers:{
                authorization: "Bearer " + localStorage.getItem('token')
            },  
            params: {
                id
            }
        })
        return data
    }
    static async searchGoodByName(searchValue){
        const {data} = await axios.get('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/search',
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

    static async getGoodsNames(ids){
        console.log(ids)
        const names = []
        ids.map(async (id) => {
            try{
                const {data} = await axios.get('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods/name/' + id)
                names.push(data)
                console.log(data)
            }catch(e){
                console.log(e)
                throw e
            }
        })
        console.log(names)
        return names
    }
    static async getAllGoods(){
        const filteredResult = []
        try{
            const {data} = await axios.get('http://' + (Auth.isTestingOnPhone?Auth.ip:'localhost') + ':5000/api/goods')
            data.map((resultElement) => {
                const {ID, NAME, FIRST_PRICE, SECOND_PRICE, DATE} = resultElement
                const date = new Date(DATE)
                const newDataElement = {ID, NAME, FIRST_PRICE, SECOND_PRICE, Date: date}
                filteredResult.push(newDataElement)
            })
            return filteredResult
        }catch(e){
            console.log(e)
            throw e
        }
    }
}