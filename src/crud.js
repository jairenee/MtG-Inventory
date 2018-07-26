const mtg = require('mtgsdk'),
      helpers = require('./helpers');

// Sets
export async function getAllSets() {
    return new Promise(async function(res, rej) {
        console.log("Getting sets");
        let sets = await mtg.set.all(),
            setList = []
        sets.on("data", set => {
            setList.push(set);
        })
        sets.on("end", () => {
            return res(helpers.formatSetsJson(setList));
        })
    })
}

export async function getSet(code) {
    return new Promise(async function(res, rej) {
        let thisSet = await mtg.card.all({set: code});
        
        let list = {};
        let doublesided = {};
        thisSet.on("data", card => {
            let flipped = card.layout === "double-faced"
            if (flipped) {
                let number = card.number.replace(/[a-b]/, "");
                if (!doublesided[number]) doublesided[number] = {};
                doublesided[number][flipped[0]] = helpers.snip(card);
            } else {
                list[card.number] = helpers.snip(card);
            }
        })

        thisSet.on("end", () => {
            for (let asshole in doublesided) {
                list[asshole] = doublesided[asshole];
            }
            console.log("Finished import")
            return res(list);
        })
    });
}

export async function getSetCardCount(code) {
    return new Promise(async function(res, rej) {
        let thisSet = await mtg.card.all({set: code});
        
        let x = 0;
        thisSet.on("data", card => {
            x++;
        })

        thisSet.on("end", () => {
            return res(x);
        })
    });
}

export async function getReleaseDate(code) {
    return new Promise(async function(res, rej) {
        let result = await mtg.set.find(code)
        res(result.set.releaseDate);
    });
}

// Cards

export async function getCardsByFilter(input, filter) {
    console.log("Getting cards");
    return new Promise(async function(res, rej) {

        let filterObj = {};
        filterObj[filter] = input
        let thisCard = await mtg.card.all(filterObj),
            confirmedCards = [];

        thisCard.on("data", card => {
            confirmedCards.push(helpers.snip(card));
        })

        thisCard.on("end", () => {
            if (confirmedCards.length === 0) {
                return res([]);
            } else {
                return res(helpers.formatCardsJson(confirmedCards));
            }
        })
    });
}

// Spreadsheet Manip

export async function createSetSheet(config) {
    return new Promise(async (res, rej) => {
        let confirmed,
            search;
        if (!config.code) {
            try {
                let set = await mtg.set.where({name: config.setName});
                if (set.length > 1) {
                    console.error("Multiple sets found:")
                    let allSetsFound = "";
                    for (let setFound of set) {
                        allSetsFound += `   ${setFound.name}\n`;
                    }
                    console.error(allSetsFound.trimEnd());
                    throw Error("\nPlease refine search.")
                } else {
                    search = set[0].code;
                }
            } catch(err) {
                return rej(err.message);
            }
        } else {
            search = config.code;
        }
        try {
            confirmed = await mtg.set.find(search);
            console.log(`Set found: ${confirmed.set.name}`)
        } catch (err) {
            return rej (err)
        }

        let set = await this.getSet(search),
            setLength = Object.keys(set).length;
        
        console.log(`${setLength} cards imported`);
        // console.log(set["200"]);

        // sheet.(creds, async () => {
        //     const headers = ["Quantity", "Desired", "Name", "Type", "Colors", "Cost", "CMC", 
        //                      "Stats", "Text", "Rarity", "Image", "Reverse", "Text", "Image"]
        //     let sheet = await helpers.getSheet(doc, confirmed.set.name);
        //     if (!sheet) { 
        //         console.log(`Sheet doesn't exist. Creating "${confirmed.set.name}".`)
        //         doc.addWorksheet({title: confirmed.set.name, rowCount: setLength, colCount: headers.length, headers: headers});
        //         setTimeout(async () => {
        //             let created = await helpers.getSheet(doc, confirmed.set.name);
        //             return res(`Sheet created: ${created.url}`)
        //         }, 1000)
        //     } else {
        //         return res(`Sheet exists: ${sheet.url}`);
        //     }
        // });
    });
}

