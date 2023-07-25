const express = require("express");
const route = require("./routes/route");
require('dotenv').config()
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const conn = require('./config/squelize-connect');
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
conn.dbConnect();
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use("/api", route);

// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(5000, function () {
  console.log('Node app is running on port 5000');
});

module.exports = app;
