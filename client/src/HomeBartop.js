import React, { Component } from "react";

import './HomeBartop.css';

// images, png, jpg etc
import profileImageTest from './Images/ProfileImageTest.png';

// vectors
import topTableSolidSVG from './SVG/TopTable-Solid.svg';
import topTableSolidFillSVG from './SVG/TopTable-Solid.svg';

class HomeBartop extends Component{
    constructor(props){
        super(props);

        this.state = {
            TopTableImages: [topTableSolidSVG, topTableSolidFillSVG],
            TopTableState: 0,
        }
    }
    render(){
        return(
            <div id='homeBartop'>
                <div id='homeBartopContainer'>
                    <img className='profileImage' src={sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).profileImage : ''}></img>
                    <p id="gameNameText">Dice Roll Game</p>
                    <img id="topTableIcon" src={this.state.TopTableImages[this.state.TopTableState]}/>
                </div>
            </div>
        )
    }
}

export default HomeBartop;