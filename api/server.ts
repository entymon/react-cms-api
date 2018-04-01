require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

if (!process.env.AUTH0_SECRET || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_SECRET, and AUTH0_AUDIENCE in your .env file';
}


express.json();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));



app.all('*', function(req, res){
  console.log('tewer');
  res.json({
    status: 'error',
    message: `route does not exist ${req.originalUrl}`
  }, 404);
});

app.listen(4000, function() {
  console.log('Listening on port 4000...')
});
