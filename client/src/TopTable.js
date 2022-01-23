import React, { Component } from "react";
import HomeBartop from "./HomeBartop";

import axios from "axios";

import './TopTable.css';

class TopTable extends Component{
    constructor(props){
        super(props);

        this.state = {
            tableRows: [],
        }
    }

    async getTopTableData(){
        const res = await axios.get(this.props.routes.toptabledata)
        return await res.data;
    }
    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/login`;
        }else{
            this.getTopTableData()
            .then((data) => {
                if(data.success){
                    var newTableRows = []
                    var tableArray = data.topTable.players
                    for(var i = 0; i < tableArray.length; i++){
                        newTableRows.push(
                            <tr key={i}>
                            <td className="tableText">{i+1}</td>
                            <td className="tableText">{tableArray[i].username}</td>
                            <td className="tableTextLight">{tableArray[i].score}</td>
                            </tr>
                        )
                    }
    
                    this.setState({tableRows: newTableRows});
                }
            })
        }
    }
    render(){
        return(
            <div id='toptable'>
                <HomeBartop/>
                <div id='toptableContainer'>
                    <p id="topTableTitleText">Top Table</p>
                    <div id='toptableTableContainer'>
                        <table className="toptableTableTable">
                            <thead>
                                <tr>
                                <th>Position</th>
                                <th>Username</th>
                                <th>Score</th>
                                </tr>
                            </thead>
                            <tbody className="toptableTableTableBody">
                                {this.state.tableRows.length > 0 ? this.state.tableRows : 'Awating Server...'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default TopTable;