import React from 'react';
// import logo from './logo.svg';
import './App.css';

import ReactVirtualizedTable from './page'


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

    columns = [
      {
        width: 400,
        label: 'Dessert',
        dataKey: 'dessert',
      },
      {
        width: 120,
        label: 'Calories\u00A0(g)',
        dataKey: 'calories',
        numeric: true,
      },
      {
        width: 120,
        label: 'Fat\u00A0(g)',
        dataKey: 'fat',
        numeric: true,
      },
      {
        width: 120,
        label: 'Carbs\u00A0(g)',
        dataKey: 'carbs',
        numeric: true,
      },
      {
        width: 120,
        label: 'Protein\u00A0(g)',
        dataKey: 'protein',
        numeric: true,
      },
    ]
    return (
      <div>
        <ReactVirtualizedTable columns={columns}/>
      </div>
    );
  }
}

export default App;
