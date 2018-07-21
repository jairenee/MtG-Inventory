const net = require('net'),
      port = process.env.npm_package_config_port || 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('Starting Electron!');
            startedElectron = true;
            const exec = require('child_process').exec;
            exec('electron .');
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});