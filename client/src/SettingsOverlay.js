import React, { Component } from "react";
import axios from "axios";

import './SettingsOverlay.css';

class SettingsOverlay extends Component{
    constructor(props){
        super(props);

        this.state = {
            settinsgsOverlayItemClasses: [
                'settingsOverlaySidebarItemActive',
                'settingsOverlaySidebarItem'
            ],
            activeItem: 0,
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

    render(){
        return(
            <div id='settingsOverlay'>
                <div onClick={() => this.props.toggleShowHandler()} id='settingsOverlayBackground'>

                </div>
                <div id='settingsOverlayContentContainer'>
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
                </div>
            </div>
        )
    }
}

export default SettingsOverlay;