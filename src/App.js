import './App.css'
import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import {AuthContext} from "./context";


function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('auth')) {
        setIsAuth(true)
    }
    setIsLoading(false)
},[])

return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth,
      isLoading
    }}>
        <div className="App">
          <BrowserRouter>
            <div className='Body'>
              <NavBar/>
              <AppRouter/>
            </div>
            <Footer/>
          </BrowserRouter>
        </div>
    </AuthContext.Provider>
  );
}

export default App;
