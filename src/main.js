const {app, BrowserWindow} = require('electron'),
      url = require("url"),
      path = require("path");

let win = null;

function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({show: false, width: 1000, height: 600});
  win.setMenu(null);

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