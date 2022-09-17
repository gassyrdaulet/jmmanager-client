import cl from './Pagination.module.css'
import next from '../img/next.png'
import last from '../img/last.png'

const Pagination = ({goodsPerPage, totalGoods, paginate, currentPage, totalPages}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalGoods / goodsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={cl.arrows}>
            <div className={cl.arrowsLeft}>
                <button onClick={() => paginate(1)}><img src={last} alt="f" /></button>
            </div>
            <div className={cl.arrowsCenter}>
                <button className={cl.prev} onClick={() => paginate(currentPage - 1)}><img src={next} alt="p" /></button>
                <p>{currentPage*goodsPerPage>totalGoods? totalGoods : currentPage*goodsPerPage} из {totalGoods}</p>
                <button onClick={() => paginate(currentPage + 1)}><img src={next} alt="n" /></button>
            </div>
            <div className={cl.arrowsRight}>
                <button onClick={() => paginate(totalPages)}><img src={last} alt="l" /></button>
            </div>
        </div>
    );
};

export default Pagination