var cron = require('node-cron');
const http = require('http');


const data = require('./data');

cron.schedule("*/5 * * * * *", () => {
    http.get('http://127.0.0.1:3002/getPendingTransactions', (resp) => {
    var body = [];
    resp.on('data', function(chunk) {
        body.push(chunk);
    });
    // La réponse complète à été reçue. On affiche le résultat.
    resp.on('end', () => {
        console.log(JSON.parse(Buffer.concat(body).toString()));
    });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

});