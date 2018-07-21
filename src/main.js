const {app, BrowserWindow, ipcMain} = require('electron'),
      Store = require('electron-store');
      store = new Store({
        defaults: {
          windowBounds: {
            width: 1000,
            height: 600,
            x: 0,
            y: 0
          }
        }
      }),
      url = require("url"),
      path = require("path"),
      process = require("process"),
      tools = process.env.TOOLS || false;

if (tools) {
  require("electron-debug")();
}

let win = null;

function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({show: false, ...store.get("windowBounds")});
  win.setMenu(null);

  function saveWindowBounds() {
    store.set('windowBounds', win.getBounds());
  }

  // listen to `resize` and `move` and save the settings
  win.on('resize', saveWindowBounds);
  win.on('move', saveWindowBounds);

  // Specify entry point
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  win.loadURL(startUrl);

  win.once('ready-to-show', () => {
    win.show()
  })

  // Remove window once app is closed
  win.on('closed', function () {
    app.quit();
  });
}

app.on('ready', function () {
  createWindow();

  ipcMain.on("store-sets", (event, arg) => {
    console.log(event, arg)
    event.sender.send("store-sets-return", arg);
  });
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});