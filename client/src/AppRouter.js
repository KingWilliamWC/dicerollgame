import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// page structure amongst all pages
import './App.css';

// component imports
import GameHome from './GameHome';
import OnlineHome from './OnlineHome';
import GlobalGame from './GlobalGame';
import Login from './Login';
import Signup from './Signup';
import TopTable from './TopTable';
import VSComputerGameGlobal from './VSComputerGameGlobal';
import LocalMultiplayerHome from './LocalMultiplayerHome';
import LocalMultiplayerGameGlobal from './LocalMultiplayerGameGlobal';

class AppRouter extends Component {
    componentDidMount = () => {
        // ensure height works on all devices, I hate css
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    render(){
        var urlBase = 'https://dicerollgame.co.uk';
        var routes = {
            'newgameid': `${urlBase}/api/newgameid`,
            'signup': `${urlBase}/api/signup`,
            'login': `${urlBase}/api/login`,
            'updateprofileimage': `${urlBase}/api/updateprofileimage`,
            'updateusername': `${urlBase}/api/updateusername`,
            'gameend': `${urlBase}/api/gameend`,
            'toptabledata': `${urlBase}/api/toptable`,
            'gamesocket': `${urlBase}/`
        }
        return(
            <Router>
                <Routes>
                    <Route exact path='/'element={<GameHome routes={routes}/>} />
                    <Route exact path='/online' element={<OnlineHome routes={routes}/>} />
                    <Route exact path='/game' element={<GlobalGame routes={routes}/>}/>
                    <Route exact path='/login' element={<Login routes={routes}/>}/>
                    <Route exact path='/signup' element={<Signup routes={routes}/>}/>
                    <Route exact path='/toptable' element={<TopTable routes={routes}/>}/>
                    <Route exact path='/vscomputergame' element={<VSComputerGameGlobal/>}/>
                    <Route exact path='/localmultiplayer' element={<LocalMultiplayerHome/>}/>
                    <Route exact path='/localmultiplayergame' element={<LocalMultiplayerGameGlobal/>}/>
                </Routes>
            </Router>
        )
    }
}

export default AppRouter;