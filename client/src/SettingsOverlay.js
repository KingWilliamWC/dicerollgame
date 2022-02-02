import React, { Component } from "react";

import 'animate.css';

import './SettingsOverlay.css';

import AccountSettings from "./AccountSettings";
import GameHistory from "./GameHistory";

class SettingsOverlay extends Component{
    constructor(props){
        super(props);

        this.state = {
            settinsgsOverlayItemClasses: [
                'settingsOverlaySidebarItemActive',
                'settingsOverlaySidebarItem'
            ],
            activeItem: 0,
            activeTabs: [<AccountSettings routes={this.props.routes} updateBartopImage={this.props.updateBartopImage}/>,<GameHistory/>]
        }
    }

    onTabClick = (index) => {
        if(this.state.activeItem !== index){
            var newsettinsgsOverlayItemClasses = this.state.settinsgsOverlayItemClasses;
            newsettinsgsOverlayItemClasses[this.state.activeItem] = 'settingsOverlaySidebarItem';
            newsettinsgsOverlayItemClasses[index] = 'settingsOverlaySidebarItemActive';
            this.setState({settinsgsOverlayItemClasses: newsettinsgsOverlayItemClasses, activeItem: index});
        }
    }

    onSignout = () => {
        sessionStorage.clear();
        window.location.href  =`/login`;
    }

    onSettingsOverlayKeypress = (event) => {
        if(event.keyCode === 27){
            this.props.toggleShowHandler();
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.onSettingsOverlayKeypress, false);
    }

    componentWillUnmount(){
        // avoid a memory fill... lol thanks brain
        document.removeEventListener("keydown", this.onSettingsOverlayKeypress, false);
      }

    render(){
        return(
            <div onKeyPress={(e) => this.onSettingsOverlayKeypress(e)} id='settingsOverlay'>
                <div className="animate__animated animate__fadeIn" onClick={() => this.props.toggleShowHandler()} id='settingsOverlayBackground'>

                </div>
                <div className="animate__animated animate__fadeIn" id='settingsOverlayContentContainer'>
                    <div id='settingsOverlaySidebar'>
                        <div id='settingsOverlayTopBar'>
                            <div onClick={() => this.onTabClick(0)} className={this.state.settinsgsOverlayItemClasses[0]}>
                                <p>My account</p>
                            </div>
                            <div onClick={() => this.onTabClick(1)} className={this.state.settinsgsOverlayItemClasses[1]}>
                                <p>Game history</p>
                            </div>
                        </div>
                        <div id='settingsOverlayBottomBar'>
                            <div onClick={() => this.onSignout()} className='settingsOverlaySidebarItem settingsOverlaySidebarItemRed'>
                                <p>Sign out</p>
                            </div>
                        </div>
                    </div>
                    <div id='settingsOverlayMainContentContainer'>
                        {this.state.activeTabs[this.state.activeItem]}
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsOverlay;