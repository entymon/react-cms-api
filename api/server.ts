const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(require('./middlewares/users'));
app.use(require('./controllers'));

app.get('/', (req, res) => {
  res.send('Hello World')
});
app.listen(4000, function() {
  console.log('Listening on port 4000...')
});
