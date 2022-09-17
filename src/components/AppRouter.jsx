import React, {useContext} from 'react';
import {Route, Routes} from "react-router-dom";
import {adminRoutes, publicRoutes, userRoutes} from "../router";
import Loading from "../UI/Loading";
import { AuthContext } from '../context';

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    if(isLoading){
        return <Loading/>
    }

    return (
        isAuth?
            localStorage.getItem('role')==='1'||
            localStorage.getItem('role')==='2'?
                <Routes>
                    {adminRoutes.map(({path, element}) => <Route path={path} element={element} key={path}/>)}
                </Routes>:
                <Routes>
                    {userRoutes.map(({path, element}) => <Route path={path} element={element} key={path}/>)}
                </Routes>
        :
        <Routes>
            {publicRoutes.map(({path, element}) => <Route path={path} element={element} key={path}/>)}
        </Routes>    
    )
};


export default AppRouter;