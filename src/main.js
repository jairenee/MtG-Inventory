const { app, BrowserWindow, ipcMain } = require('electron'),
      { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer'),
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

let win = null;

if (tools) {
  require("electron-debug")();
}

function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({show: false, ...store.get("windowBounds")});
  win.setMenu(null);

  function saveWindowBounds() {
    store.set('windowBounds', win.getBounds());
  }

  if (tools) {
    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REDUX_DEVTOOLS);
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
  db.cards = new Datastore({filename: `${app.getPath("userData")}/cards.db`, autoload: true});

  async function saveSets(event, emit) {
    console.log("Storing Sets")
    let sets = await crud.getAllSets();
    sets.sort((a, b) => {
      return new Date(a.release) - new Date(b.release)
    });
    event.sender.send(emit, sets);
    db.sets.insert(sets);
  }

  async function saveCards(event, emit) {
    console.log("Storing Cards");
    let sets = await getSets();
    for (let set in sets) {
      console.log("Set:", parseInt(set)+1, "of", sets.length)
      let thisSet = await crud.getCardsByFilter({filter: "set", search: sets[set].code})
      db.cards.insert(thisSet);
    }
    event.sender.send(emit, "Cards stored")
  }

  async function pullSets() {
    return new Promise((res, rej) => {
      db.sets.find({}, async (err, sets) => {
        if (err) { 
          let pulledSets = await crud.getAllSets();
          pulledSets.sort((a, b) => {
            return new Date(a.release) - new Date(b.release)
          });
          return res(pulledSets);
        } else {
          sets.sort((a, b) => {
            return new Date(a.release) - new Date(b.release)
          });
          return res(sets);
        }
      })
    })
  }

  async function getSets(event, emit) {
    let sets = await pullSets();
    if (event) {
      event.sender.send(emit, sets)
    } else {
      return sets;
    }
  }

  async function searchCards(event, args) {
    console.log("Searching")
    db.cards.find({ $where: function () {
      return this[args.filter].toLowerCase().includes(args.search); 
    } }, async (err, docs) => {
      if (err || docs.length === 0) {
        if (err) console.log(err)
        let cards = await crud.getCardsByFilter({filter: args.filter, search: args.search});
        event.sender.send("cards-returned", cards);
      } else {
        console.log("Loaded from db!");
        event.sender.send("cards-returned", docs);
      }
    })
  }

  ipcMain.on("store-sets", async (event) => {
    saveSets(event, "sets-stored")
  });

  ipcMain.on("get-sets", async (event) => {
    getSets(event, "sets-returned")
  })

  ipcMain.on("store-cards", async (event) => {
    saveCards(event, "cards-stored");
  })

  ipcMain.on("get-cards", async (event, args) => {
    searchCards(event, args)
  })

  ipcMain.on("clear-cards", async (event) => {
    console.log("Received clear command")
    db.cards.remove({}, { multi: true }, function (err, numRemoved) {
      event.sender.send("cards-cleared", numRemoved)
    });
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