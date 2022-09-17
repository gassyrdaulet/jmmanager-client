import Error from "../Pages/Error";
import Login from "../Pages/Login";
import Main from "../Pages/Main";
import OrderDetails from "../Pages/OrderDetails";
import {Navigate} from "react-router-dom";
import GoodDetails from "../Pages/GoodDetails";
import NewOrder from "../Pages/NewOrder";
import ProfilePage from '../Pages/ProfilePage';
import EditOrder from "../Pages/EditOrder";
import ReturnOrder from "../Pages/Return";

export const userRoutes = [
    {path: '/main' , element: <Main openedTab={1}></Main>},
    {path: '/main/create' , element: <NewOrder></NewOrder>},
    {path: '/main/recent' , element: <Main openedTab={1}></Main>},
    {path: '/main/pickup' , element: <Main openedTab={2}></Main>},
    {path: '/main/delivery' , element: <Main openedTab={3}></Main>},
    {path: '/main/prices' , element: <Main openedTab={4}></Main>},
    {path: '/main/archive' , element: <Main openedTab={5}></Main>},
    {path: '/error' , element: <Error></Error>},
    {path: '/main/order/:id' , element: <OrderDetails></OrderDetails>},
    {path: '/main/good/:id' , element: <GoodDetails></GoodDetails>},
    {path: '/userpage' , element: <ProfilePage></ProfilePage>},
    {path: '/' , element: <Navigate to='/main/recent'></Navigate>},
    {path: '/login' , element: <Navigate to='/'></Navigate>},
    {path: '/*' , element: <Navigate to='/error'></Navigate>}
]
export const adminRoutes = [
    {path: '/main' , element: <Main openedTab={1}></Main>},
    {path: '/main/create' , element: <NewOrder></NewOrder>},
    {path: '/main/edit/:id' , element: <EditOrder></EditOrder>},
    {path: '/main/return/:id' , element: <ReturnOrder></ReturnOrder>},
    {path: '/main/recent' , element: <Main openedTab={1}></Main>},
    {path: '/main/pickup' , element: <Main openedTab={2}></Main>},
    {path: '/main/delivery' , element: <Main openedTab={3}></Main>},
    {path: '/main/prices' , element: <Main openedTab={4}></Main>},
    {path: '/main/archive' , element: <Main openedTab={5}></Main>},
    {path: '/error' , element: <Error></Error>},
    {path: '/main/order/:id' , element: <OrderDetails></OrderDetails>},
    {path: '/main/good/:id' , element: <GoodDetails></GoodDetails>},
    {path: '/userpage' , element: <ProfilePage></ProfilePage>},
    {path: '/' , element: <Navigate to='/main/recent'></Navigate>},
    {path: '/login' , element: <Navigate to='/'></Navigate>},
    {path: '/*' , element: <Navigate to='/error'></Navigate>}
]
export const publicRoutes = [
    {path: '/login' , element: <Login></Login>},
    {path: '/error' , element: <Error></Error>},
    {path: '/*' , element: <Navigate to='/login'></Navigate>}
]