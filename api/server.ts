const express = require('express');
const app = express();
const router = express.Router();

// app.use(express.static(__dirname + '/public'));
// app.use(require('./middlewares/users'));
// app.use(require('./controllers'));

app.listen(4000, function() {
  console.log('Listening on port 3000...')
});

//
// app.get('/', (req, res) => {
//   res.send('Hello World')
// });
// app.listen(4000, () => {
//   console.log('Listening');
// });
