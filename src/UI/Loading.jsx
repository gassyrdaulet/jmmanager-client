import React from 'react';
import cl from './Loading.module.css'

const Loading = ({which}) => {
    return (
        which  === 1?
        <div className={cl.ldsGrid}>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
        :
        which === 0?
        <div className={cl.ldsDualRing}></div>
        :
        <div className={cl.MiniLoader}></div>
    )
};


export default Loading;