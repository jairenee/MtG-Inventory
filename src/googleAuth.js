const {google} = require('googleapis'),
      vars = require('./customVars.json'),
      credentials = require("./credentials.json");

// All of this is for the future Google Spreadsheet integration.

let jwtClient = new google.auth.JWT(
    creds.client_email,
    null,
    creds.private_key,
    'https://www.googleapis.com/auth/spreadsheets'
)

jwtClient.authorize((err, tokens) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");
    }
});

const TOKEN_PATH = "token.json";

async function authorize(credentials) {
    return new Promise((res, rej) => {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, async (err, token) => {
            if (err) {
                let auth = await getNewToken(oAuth2Client);
                return res (auth);
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            return res(oAuth2Client);
        });
    })
}

async function getNewToken(oAuth2Client) {
    return new Promise((res, rej) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/spreadsheets',
        });
        opener(authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return rej(err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                return res(oAuth2Client);
            });
        });
    })
}

async function main() {
    let auth = await authorize(credentials),
        sheet = google.sheets({version: 'v4', auth});

    sheet.spreadsheets.values.get({
        spreadsheetId: vars.sheet,
        range: 'Wants',
    }, (err, res) => {
        let config = {
            columnDefault: {
                width: 20
            }
        }
        if (err) return console.log('The API returned an error: ' + err);
        for(let row in res.data.values) {
            for(let cell in res.data.values[row]) {
                res.data.values[row][cell] = res.data.values[row][cell].replace(/(\r\n|\n|\r)/gm,"")
            }
        }
        console.log(table(res.data.values, config));
    });
}
main()