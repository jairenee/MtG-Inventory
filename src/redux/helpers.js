async function pullSets(db) {
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

module.exports.saveSets = async function(db, event, emit) {
    console.log("Storing Sets")
    let sets = await crud.getAllSets();
    sets.sort((a, b) => {
        return new Date(a.release) - new Date(b.release)
    });
    event.sender.send(emit, sets);
    db.sets.insert(sets);
}

module.exports.saveCards = async function(db, event, emit) {
    console.log("Storing Cards");
    let sets = await module.exports.getSets(db);
    for (let set in sets) {
        event.sender.send("next-cards-returned", `Set: ${parseInt(set)+1} of ${sets.length}`)
        let thisSet = await crud.getCardsByFilter({filter: "set", search: sets[set].code})
        db.cards.insert(thisSet);
    }
    event.sender.send(emit, "Cards stored")
}

module.exports.getSets = async function(db, event, emit) {
    let sets = await pullSets(db);
    if (event) {
        event.sender.send(emit, sets)
    } else {
        return sets;
    }
}

module.exports.searchCards = async function(db, event, args) {
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