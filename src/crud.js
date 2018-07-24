const mtg = require('mtgsdk'),
      helpers = require("./helpers");
      //helpers = require('./helpers');
      //{google} = require('googleapis'),
      //vars = require('./customVars.json'),
      //credentials = require("./credentials.json");

// All of this is for the future Google Spreadsheet integration.

// let jwtClient = new google.auth.JWT(
//     creds.client_email,
//     null,
//     creds.private_key,
//     'https://www.googleapis.com/auth/spreadsheets'
// )

// jwtClient.authorize((err, tokens) => {
//     if (err) {
//         console.log(err);
//         return;
//     } else {
//         console.log("Successfully connected!");
//     }
// });

// const TOKEN_PATH = "token.json";

// async function authorize(credentials) {
//     return new Promise((res, rej) => {
//         const {client_secret, client_id, redirect_uris} = credentials.installed;
//         const oAuth2Client = new google.auth.OAuth2(
//             client_id, client_secret, redirect_uris[0]);

//         // Check if we have previously stored a token.
//         fs.readFile(TOKEN_PATH, async (err, token) => {
//             if (err) {
//                 let auth = await getNewToken(oAuth2Client);
//                 return res (auth);
//             }
//             oAuth2Client.setCredentials(JSON.parse(token));
//             return res(oAuth2Client);
//         });
//     })
// }

// async function getNewToken(oAuth2Client) {
//     return new Promise((res, rej) => {
//         const authUrl = oAuth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/spreadsheets',
//         });
//         opener(authUrl);
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout,
//           });
//         rl.question('Enter the code from that page here: ', (code) => {
//             rl.close();
//             oAuth2Client.getToken(code, (err, token) => {
//                 if (err) return rej(err);
//                 oAuth2Client.setCredentials(token);
//                 // Store the token to disk for later program executions
//                 fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//                     if (err) console.error(err);
//                     console.log('Token stored to', TOKEN_PATH);
//                 });
//                 return res(oAuth2Client);
//             });
//         });
//     })
// }

// async function main() {
//     let auth = await authorize(credentials),
//         sheet = google.sheets({version: 'v4', auth});

//     sheet.spreadsheets.values.get({
//         spreadsheetId: vars.sheet,
//         range: 'Wants',
//     }, (err, res) => {
//         let config = {
//             columnDefault: {
//                 width: 20
//             }
//         }
//         if (err) return console.log('The API returned an error: ' + err);
//         for(let row in res.data.values) {
//             for(let cell in res.data.values[row]) {
//                 res.data.values[row][cell] = res.data.values[row][cell].replace(/(\r\n|\n|\r)/gm,"")
//             }
//         }
//         console.log(table(res.data.values, config));
//     });
// }
//main()

// Sets
module.exports.getAllSets = async function() {
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

module.exports.getSet = async function(code) {
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

module.exports.getSetCardCount = async function(code) {
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

module.exports.getReleaseDate = async function(code) {
    return new Promise(async function(res, rej) {
        let result = await mtg.set.find(code)
        res(result.set.releaseDate);
    });
}

// Cards

module.exports.getCardsByFilter = async function(input, filter) {
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

module.exports.createSetSheet = async function(config) {
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

