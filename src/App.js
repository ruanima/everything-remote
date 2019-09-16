import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      searchWord: '',
      tableHead: ['NAME', 'TRANS_PATH', 'SIZE', 'DATE_MODIFIED'],
      tableData: [
        ['1', '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456\n789'],
        ['a', 'b', 'c', 'd'],
      ],
    }
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
    window.ipcRenderer.on('asynchronous-reply-search', (event, arg)=>{
      console.log(arg)
    })
    window.ipcRenderer.send('asynchronous-msg-search', '大海')

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React {this.state.tableData}
          </a>
        </header>
      </div>
    );
  }
}

export default App;
