import React from 'react';
// import logo from './logo.svg';
import './App.css';

import  VirtualizedTable  from './page'
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import { debounce } from 'lodash';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      searchWord: '',
      tableHead: {
        'NAME': 3,
        'TRANS_PATH': 4,
        'SIZE': 1,
        'DATE_MODIFIED':2,
      },
      tableData: [],
    }

    this.initSearch()
    this.doSearch = debounce(this.doSearch, 1000)
  }

  handleInputChange = (e) => {
    // Immediately update the state
    const word = e.target.value
    this.setState({
      searchWord: word
    })
    console.log(word)
    this.doSearch()
  }

  doSearch() {
    window.ipcRenderer.send('asynchronous-msg-search', this.state.searchWord)
  }

  initSearch() {
    window.ipcRenderer.on('asynchronous-reply-search', (event, arg)=>{
      console.log(this.state)
      let _rows = []
      let i = 0
      for (let row of arg.data){
        if ('TRANS_PATH' in row) {
          _rows.push({id:i, ...row})
          i += 1
        }
      }
      this.setState({
        tableData: _rows
      })
    })
    window.ipcRenderer.send('asynchronous-msg-connect', '')
  }

  render() {
    const rows = this.state.tableData
    const columns = []
    for (let [k,v] of Object.entries(this.state.tableHead)) {
      columns.push({
        width: 5000 * v / 10,
        label: k,
        dataKey: k,
      })
    }
    console.log(rows)
    return (
      <div>
        <Paper style={{ height: "60px", width: '100%' }}>
          <TextField
            id="outlined-full-width"
            style={{ height: "100%", marginTop: 4, marginBottom: 4}}
            fullWidth
            onChange={this.handleInputChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Paper>
        <Paper style={{ height: "calc(100vh - 61px)", width: '100%' }}>
          <VirtualizedTable
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            columns={columns}
          />
        </Paper>
      </div>
    );
  }
}

export default App;
