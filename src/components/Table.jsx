import React from 'react'
import TableLine from './TableLine'
import cl from './Table.module.css'
import { useState , useEffect, useMemo} from 'react'
import Pagination from './Pagination.jsx'
import Loading from '../UI/Loading'

export default function Table({data, heads, isLoading, which='заказы'}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [goodsPerPage] = useState(10)
    
    const sortedData = useMemo( () => {
        switch (which) {
            case 'архив':
                return [...data].sort( (a, b) => (((b.finishedDate)<(a.finishedDate)?-1:(b.finishedDate)<(a.finishedDate)?1:0)))
            case 'цены':
                return [...data].sort( (a, b) => (((b.Date)<(a.Date)?-1:(b.Date)>(a.Date)?1:0)))
            case 'заказы':
                return [...data].sort( (a, b) => (((b.creationDate)<(a.creationDate)?-1:(b.creationDate)>(a.creationDate)?1:0)))
            default:
                return []
        }
    },[data])

    const indexOfLastPost = currentPage * goodsPerPage
    const indexOfFirstPost = indexOfLastPost - goodsPerPage
    const currentData = useMemo(() => {
        return (sortedData.slice(indexOfFirstPost, indexOfLastPost))
    }, [currentPage, sortedData])
    const totalPages = Math.ceil(data.length/goodsPerPage)


    useEffect(() => {
        paginate(1)
    }, [totalPages])

    const paginate = (page) => {
        if(page>totalPages){
            setCurrentPage(totalPages)
        }else if(page<1){
            setCurrentPage(1)
        }else{
            setCurrentPage(page)
        }
    }

    return (
        <div>
            <div className={cl.TableWrapper}>
                {isLoading?
                    <div className={cl.LoadingWrapper}>
                        <Loading/>
                    </div>
                :
                data.length === 0?
                    <h3 className={cl.NothingFound}>Ничего не найдено.</h3>
                    :
                    <table className={cl.Table}>
                        <thead>
                            <tr>
                                {heads.map((head) => <th key={head}>{head}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((dataElement, index) => <TableLine currentPage={currentPage} goodsPerPage={goodsPerPage} data={dataElement} index={index} key={index}></TableLine>)}
                        </tbody>
                    </table>
                }
            </div>
            <div className={cl.Pagination}>
                <Pagination goodsPerPage={goodsPerPage} totalGoods={data.length} paginate={paginate} currentPage={currentPage} totalPages={totalPages}/>
            </div>
        </div>
        
  )
}
