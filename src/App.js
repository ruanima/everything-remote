import React from 'react';
import logo from './logo.svg';
import './App.css';

import ReactTable from "react-table";
import "react-table/react-table.css";


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      searchWord: '',
      tableHead: ['NAME', 'TRANS_PATH', 'SIZE', 'DATE_MODIFIED'],
      tableData: [],
    }
    window.ipcRenderer.on('asynchronous-reply-search', (event, arg)=>{
      console.log(arg)
      this.setState({
        tableData: this.state.tableData.concat(arg.data)
      })
    })
    window.ipcRenderer.send('asynchronous-msg-search', '大海')
  }

  // bb(){
  //   const jsftp = require("jsftp");

  //   const Ftp = new jsftp({
  //     host: "192.168.123.1",
  //   });
  //   Ftp.raw('OPTS UTF8 ON', (err, res)=>{console.log(res)})
  // }

  render() {
    // (async() => {await this.aa()})()
    // this.bb()
    //在渲染器进程 (网页) 中。
    // window.ipcRenderer.on('asynchronous-reply-init', (event, arg) => {
    //   console.log(arg) // prints "pong"
    // })

    let columns = []
    for (let i of this.state.tableHead) {
      columns.push({
        Header: i,
        accessor: i
      })
    }

    return (
      <div>
        <ReactTable
          data={this.state.tableData}
          columns={columns}
          defaultPageSize={20}
          style={{
            height: "550px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}

export default App;
