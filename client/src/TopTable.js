import React, { Component } from "react";
import HomeBartop from "./HomeBartop";

import axios from "axios";

import './TopTable.css';

class TopTable extends Component{
    constructor(props){
        super(props);

        this.state = {
            tableRows: [],
            user: null,
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
            var user = JSON.parse(sessionStorage.getItem('user'));
            this.getTopTableData()
            .then((data) => {
                if(data.success){
                    var newTableRows = []
                    var tableArray = data.topTable.players
                    for(var i = 0; i < tableArray.length; i++){
                        newTableRows.push(
                            <tr className={tableArray[i].username === user.username ? 'rowHighlight' : ''} key={i}>
                            <td className="tableText"><p>{i+1}</p></td>
                            <td className="tableText"><p>{tableArray[i].username}</p></td>
                            <td className="tableTextLight"><p>{tableArray[i].score}</p></td>
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
                <HomeBartop routes={this.props.routes}/>
                <div id='toptableContainer'>
                    <p id="topTableTitleText">Top Table</p>
                    <div id='toptableTableContainer'>
                        <table cellSpacing={0} className="toptableTableTable">
                            <thead>
                                <tr>
                                <th>Position</th>
                                <th>Username</th>
                                <th>Score</th>
                                </tr>
                            </thead>
                            <tbody className="toptableTableTableBody">
                                {this.state.tableRows.length > 0 ? this.state.tableRows : <p id='noDatatableText'>No One has finished an online game yet...</p>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default TopTable;