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
    let sets = await crud.getAllSets();
    sets.sort((a, b) => {
        return new Date(a.release) - new Date(b.release)
    });
    event.sender.send(emit, sets);
    db.sets.insert(sets);
}

module.exports.saveCards = async function(db, event, emit) {
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
    db.cards.find({ $where: function () {
        return JSON.stringify(this[args.filter]).replace(/[^0-9a-zA-Z\s]/gi, '').toLowerCase()
            .includes(JSON.stringify(args.search).replace(/[^0-9a-zA-Z\s]/gi, '').toLowerCase()); 
    } }, async (err, docs) => {
        if (err || docs.length === 0) {
            if (err) console.log(err)
            let cards = await crud.getCardsByFilter({filter: args.filter, search: args.search});
            event.sender.send("cards-returned", cards);
        } else {
            event.sender.send("cards-returned", docs);
        }
    })
}

module.exports.getBackSide = async function(event, args) {
    let imageUrl = await crud.getBackSide(args.set, args.number);
    event.sender.send(`back-side-${args.number}`, imageUrl);
}