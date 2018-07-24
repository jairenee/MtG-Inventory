// let crud = require("./crud");

function formatReleaseDate(inputDate) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = new Date(inputDate),
        date = (function(date) {
            if (date.toString().length === 1) return `0${date}`;
            return date.toString();
        }(d.getDate()))
    return `${months[d.getMonth()]} ${date}, ${d.getFullYear()}`
}

// Maybe there's a better way to do this, but I just really didn't want this
// unnecessary info. Really an artifact from the CLI tool.

module.exports.snip = function (card) {
    delete card.artist;
    delete card.foreignNames;
    delete card.originalText;
    delete card.originalType;
    return card;
}

module.exports.formatSetsJson = function (setList) {
    let list = [];
    for (let set of setList) {
        let releaseDate = formatReleaseDate(set.releaseDate)
        list.push({_id: set.code, name: set.name, code: set.code, type: set.type, release: releaseDate})
    }
    return list;
}

module.exports.formatCardsJson = function (cardList) {
    let cards = [];
    for (let card of cardList) {
        let reverse, printings;
        if (card.layout === "double-faced" && card.names) {
            card.names.splice(card.names.indexOf(card.name), 1);
            reverse = card.names.toString()
        } else {
            reverse = "None"
        }
        if (card.rarity === "Basic Land") {
            // No point in printing this since Basic Lands
            // are printed in literally every set.
            printings = null;
        } else {
            // Truncate if the list is too long.
            if (card.printings.length > 5) {
                printings = `${card.printings.slice(0, 5).join(", ")}...`;
            } else {
                printings = `${card.printings.join(", ")}`;
            }
        }
        cards.push({
            set: card.set,
            number: card.number,
            name: card.name, 
            reverse: reverse, 
            printings: printings, 
            type: card.type, 
            color: card.colorIdentity ? card.colorIdentity.join(", ") : "None", 
            rarity: card.rarity,
            image: card.imageUrl,
            id: card.multiverseId
        });
    }

    return cards;
}

module.exports.getRarity = function (config) {
    if (config.rarity && config.rarity.length === 1) {
        switch (config.rarity) {
            case "M":
                return "Mythic Rare"
            case "R":
                return "Rare"
            case "U":
                return "Uncommon"
            case "C":
                return "Common"
            case "B":
                return "Basic Land"
            default:
                return "UNKNOWN"
        }
    } else if (config.rarity) {
        if (!["Common", "Uncommon", "Rare", "Mythic Rare", "Basic Land"].includes(config.rarity)) {
            return "UNKNOWN"
        }
    }
}

// For future feature use.
module.exports.getSheet = function(doc, sheetName) {
    return new Promise(async (res, rej) => {
        doc.getInfo((err, info) => {
            let wantedSheet;
            if (err) {
                return rej (err);
            }
            for (let sheet of info.worksheets) {
                if (sheet.title === sheetName) { 
                    wantedSheet = sheet;
                }
            }
            if (wantedSheet) {
                let id = info.id.split("/")[5]
                let gid = wantedSheet._links["http://schemas.google.com/visualization/2008#visualizationApi"].split("=")[1];
                wantedSheet.url = `https://docs.google.com/spreadsheets/d/${id}/edit#gid=${gid}`
                return res(wantedSheet);
            } else {
                return res();
            }
        })
    })
} 

// This is only used by the commented out
// CLI function.

//sortSetByDate(sets) {
//     return new Promise(async (res, rej) => {
//         let key = {}
//         for (let set of sets) {
//             key[set] = await crud.getReleaseDate(set);
//         }
//         sets.sort((a, b) => {
//             return new Date(key[a]) - new Date(key[b]);
//         })
//         res(sets);
//     })
// }

// This isn't really needed anymore since
// BootstrapTable works with JSON, but I'll
// leave it here just in case.

//formatSets(setList) {
//     let list = [];
//     for (let set of setList) {
//         let releaseDate = formatReleaseDate(set.releaseDate),
//             add = true;
//         if (add) list.push([set.name, set.code, set.type, releaseDate])
//     }
//     list.sort((a, b) => {
//             return new Date(a[3]) - new Date(b[3])
//         });
//     list.unshift(["Name", "Code", "Type", "Release"]);
//     return list;
// }

// Same with this. Just here for legacy reasons for
// back when this was a CLI instead of a web app.

// asyncformatCards(cardList) {
//     let sets = {}
//     for (let card of cardList) {
//         if (!sets[card.set]) {
//             sets[card.set] = [];
//         }
//         let reverse, printings;
//         if (card.layout === "double-faced" && card.names) {
//             card.names.splice(card.names.indexOf(card.name), 1);
//             reverse = card.names.toString()
//         } else {
//             reverse = "None"
//         }
//         if (card.rarity === "Basic Land") {
//             printings = null;
//         } else {
//             if (card.printings.length > 5) {
//                 printings = `${card.printings.slice(0, 5).join(", ")}...`;
//             } else {
//                 printings = `${card.printings.join(", ")}`;
//             }
//         }
//         sets[card.set].push([
//             card.set,
//             card.number,
//             card.name, 
//             reverse, 
//             printings, 
//             card.type, 
//             card.colorIdentity ? card.colorIdentity.join(", ") : "None", 
//             card.rarity.charAt(0)
//         ]);
//     }
//     let list = [],
//         currentSetsSorted = await sortSetByDate(Object.keys(sets));

//     for (let set in sets) {
//         sets[set].sort((a, b) => {
//             if (a[1] && b[1]) {
//                 return parseInt(a[1], 10) - parseInt(b[1], 10);
//             } else {
//                 return a[2] - b[2];
//             }
//         });
//     }

//     for (let setSort of currentSetsSorted) {
//         for (let card of sets[setSort]) {
//             list.push(card);
//         }
//     }

//     list.unshift(["Set", "Number", "Name", "Reverse", "Sets", "Type", "Colors", "Rarity"]);
//     return list;
// }