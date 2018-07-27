const { saveSets, getSets, saveCards, searchCards, getBackSide } = require("./helpers"),
      { ipcMain } = require("electron");

module.exports = function(db) {
    ipcMain.on("store-sets", async (event) => {
        saveSets(db, event, "sets-stored")
    });

    ipcMain.on("get-sets", async (event) => {
        getSets(db, event, "sets-returned")
    })

    ipcMain.on("store-cards", async (event) => {
        saveCards(db, event, "cards-stored");
    })

    ipcMain.on("get-cards", async (event, args) => {
        searchCards(db, event, args)
    })

    ipcMain.on("clear-cards", async (event) => {
        console.log("Received clear command")
        db.cards.remove({}, { multi: true }, function (err, numRemoved) {
            event.sender.send("cards-cleared", numRemoved)
        });
    })

    ipcMain.on("get-back-side", async (event, args) => {
        getBackSide(event, args);
    })
}