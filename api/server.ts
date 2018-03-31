const express = require('express');
const app = express();
const session = require('express-session');
let bodyParser = require('body-parser');

express.json();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json({
  extended: true,
  inflate: false,
  type: 'application/json'
}));

app.use(session({
  secret: 'keyboard cat',
  cookie: {
    user: {
      id: 1,
      email: 'pawel@cms.com'
    }
  }
}));

app.use(express.static(__dirname + '/public'));
app.use(require('./middlewares/users'));
app.use(require('./controllers'));

app.listen(4000, function() {
  console.log('Listening on port 4000...')
});
