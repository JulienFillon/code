var express = require("express");
var app = express();

const routes = require('./api/routes');
const data = require('./data');
const utils = require("./utils");

const path = require("path");

const configuration = require('./config/'+process.env.NODE_ENV+'.json');
routes(app);

if(process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "test"){
    utils.fillTestData();
}

const http = require('http');
const hostname = '127.0.0.1';
const port = configuration.server.port;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "template"));

app.listen(port, () => {
 console.log("Server running on port "+port+" visit :  http://"+hostname+":"+port+"/sumup");
});

