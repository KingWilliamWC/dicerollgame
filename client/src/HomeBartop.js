import React, { Component } from "react";

import './HomeBartop.css';

import SettingsOverlay from "./SettingsOverlay"; 

// vectors
import topTableSolidSVG from './SVG/TopTable-Solid.svg';
import topTableSolidFillSVG from './SVG/TopTable-Solid.svg';

class HomeBartop extends Component{
    constructor(props){
        super(props);

        this.state = {
            TopTableImages: [topTableSolidSVG, topTableSolidFillSVG],
            TopTableState: 0,
            isOverlay: false,
        }
    }

    toggleShowSettingsOverlay = () => {
        this.state.isOverlay ? this.setState({isOverlay: false}) : this.setState({isOverlay: true});
    }

    render(){
        return(
            <div id='homeBartop'>
                {this.state.isOverlay ? <SettingsOverlay toggleShowHandler={this.toggleShowSettingsOverlay}/> : ''}
                <div id='homeBartopContainer'>
                    <img onClick={() => this.toggleShowSettingsOverlay()} className='profileImage' src={sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).profileImage : ''}></img>
                    <a href="/" id="gameNameText">Dice Roll Game</a>
                    <a href="/toptable">
                        <img id="topTableIcon" src={this.state.TopTableImages[this.state.TopTableState]}/>
                    </a>
                </div>
            </div>
        )
    }
}

export default HomeBartop;