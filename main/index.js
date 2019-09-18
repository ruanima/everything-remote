const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

const preferences = require('./preferences');

preferences.on('save', (preferences) => {
    console.log(`Preferences were saved.`, JSON.stringify(preferences, null, 4));
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 进程间通信
const { ipcMain } = require('electron')
const { EtpClient } = require('./etpClient')
const {shell} = require('electron')

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   // event.reply('asynchronous-reply', 'pong')
//   const etp = new EtpClient()
//   etp.connect().then(()=>{
//     etp.search('猛男').then((data)=>{
//       console.log('xxx')
//       event.reply('asynchronous-reply', data)
//     })
//   })
// })

var etp = null

async function initConnect() {
  if (!etp) {
    etp = new EtpClient()
    await etp.connect()
  }
}

ipcMain.on('asynchronous-msg-connect', async (event, arg) => {
  try {
    await initConnect()
  } catch (e) {
    console.log(e)
  }
})
ipcMain.on('asynchronous-msg-search', async (event, arg) => {
  try {
    data = await etp.search(arg)
    event.reply('asynchronous-reply-search', data)
  } catch (e) {
    console.log(e)
  }
})
ipcMain.on('asynchronous-msg-file', async (event, arg) => {
  shell.showItemInFolder(arg)
})
