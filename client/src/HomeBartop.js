import React, { Component } from "react";

import './HomeBartop.css';

import SettingsOverlay from "./SettingsOverlay"; 

// vectors
import topTableSolidSVG from './SVG/TopTable-Solid.svg';
import topTableSolidFillSVG from './SVG/TopTable-Solid-Fill.svg';

class HomeBartop extends Component{
    constructor(props){
        super(props);

        this.state = {
            TopTableImages: [topTableSolidSVG, topTableSolidFillSVG],
            TopTableState: 0,
            isOverlay: false,
            userImage: null,
        }
    }

    componentDidMount(){
        var userImage = JSON.parse(localStorage.getItem('user')).profileImage;
        this.setState({userImage: userImage});
    }

    toggleShowSettingsOverlay = () => {
        this.state.isOverlay ? this.setState({isOverlay: false}) : this.setState({isOverlay: true});
    }

    updateBartopImage = (newProfileImage) => {
        console.log(newProfileImage);
        this.setState({userImage: newProfileImage});
    }

    render(){
        return(
            <div id='homeBartop'>
                {this.state.isOverlay ? <SettingsOverlay updateBartopImage={this.updateBartopImage} routes={this.props.routes} toggleShowHandler={this.toggleShowSettingsOverlay}/> : ''}
                <div id='homeBartopContainer'>
                    <img onClick={() => this.toggleShowSettingsOverlay()} className='profileImage' src={this.state.userImage}></img>
                    <a href="/" id="gameNameText">Dice Roll Game</a>
                    <a onPointerLeave={() => this.setState({TopTableState: 0})} onPointerEnter={() => this.setState({TopTableState: 1})} href="/toptable">
                        <img id="topTableIcon"  src={this.state.TopTableImages[this.state.TopTableState]}/>
                    </a>
                </div>
            </div>
        )
    }
}

export default HomeBartop;