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
      tools = process.env.TOOLS || false,
      Datastore = require('nedb'),
      crud = require("./crud");

let db = {};

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

  db.sets = new Datastore({filename: `${app.getPath("userData")}/sets.db`, autoload: true});

  async function saveSets(event, emit) {
    console.log("Storing")
    let sets = await crud.getAllSets();
    sets.sort((a, b) => {
      return new Date(a.release) - new Date(b.release)
    });
    event.sender.send(emit, sets);
    db.sets.insert(sets);
  }

  async function searchCards(event, args) {
    console.log("Searching")
    let cards = await crud.getCardsByFilter(args);
    event.sender.send("cards-returned", cards);
  }

  ipcMain.on("store-sets", async (event) => {
    saveSets(event, "sets-stored")
  });

  ipcMain.on("get-sets", async (event) => {
    db.sets.find({}, (err, sets) => {
      if (err) { 
        saveSets(event, "sets-returned");
      } else {
        sets.sort((a, b) => {
          return new Date(a.release) - new Date(b.release)
        });
        event.sender.send("sets-returned", sets);
      }
    })
  })

  ipcMain.on("store-cards", async (event) => {
    
  })

  ipcMain.on("get-cards", async (event, args) => {
    searchCards(event, args)
  })
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