import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import cl from './Error.module.css'
import Button from '../UI/MyButton'

const Error = () => {
    const router = useNavigate()
    return (
        <div className={cl.Error}>
            <h1>
                404
            </h1>
            <div>
                Страница не найдена
            </div>
            <Link className={cl.Link} to='/'>
                На главную
            </Link>
            <Button onClick={() => router(-2)}>Назад</Button>
        </div>
    );
};

export default Error;