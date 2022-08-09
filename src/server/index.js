const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const mainController = require('./controllers/mainController.js');

const PORT = 3000;

const mongoURI = 'mongodb://localhost/solo-project';
mongoose.connect(mongoURI)
  .then(() => { console.log('connected to Mongo DB...'); })
  .catch(err => console.log(err));
  

/*
** middleware for all requests
*/  
app.use(express.json());


/*
**  serve static assets
*/

app.use('/dist', express.static(path.resolve(__dirname, '../../dist')));

app.get('/',
  (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname,'../../index.html'));
  }
);


/*
**  api routes
*/
app.get('/api',
  mainController.someMethod,
  (req, res) => {
    return res.status(200).json({foo: `${new Date} ${res.locals.info}`});
  }
);



app.listen(PORT, () => { console.log(`Listening on port ${PORT}...`); });