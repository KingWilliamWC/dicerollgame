import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// page structure amongst all pages
import './App.css';

// component imports
import GameHome from './GameHome';
import OnlineHome from './OnlineHome';
import GameJoin from './GameJoin';
import Login from './Login';
import Signup from './Signup';

class AppRouter extends Component {
    componentDidMount = () => {
        // ensure height works on all devices, I hate css
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    render(){
        var urlBase = 'https://localhost/';
        var routes = {
            'search': `${urlBase}search`,
            'locationselect': `${urlBase}locationselect`,
            'area': `${urlBase}area`,
            'viewrestraunt': `${urlBase}viewrestraunt`
        }
        return(
            <Router>
                <Routes>
                    <Route exact path='/'element={<GameHome routes={routes}/>} />
                    <Route exact path='/online' element={<OnlineHome routes={routes}/>} />
                    <Route exact path='/lobby' element={<GameJoin/>}/>
                    <Route exact path='/login' element={<Login/>}/>
                    <Route exact path='/signup' element={<Signup/>}/>
                </Routes>
            </Router>
        )
    }
}

export default AppRouter;