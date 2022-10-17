var express = require("express");
var app = express();

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

app.get("/titi", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

// add
app.post('/book', (req, res) => {
    const book = req.body;
});

// get
app.get('/book/:code', (req, res, next) => {
    // Reading code from the URL
    const code = req.params.code;
});

//get all
app.get('/books', (req, res) => {
    res.json(books);
});

// edit
app.post('/book/:code', (req, res) => {
    // Reading code from the URL
    const code = req.params.code;
});

//delete
app.delete('/book/:code', (req, res) => {
    // Reading code from the URL
    const code = req.params.code;
});

app.listen(port, () => {
 console.log("Server running on port "+port);
});
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
