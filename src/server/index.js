const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

app.use('/dist', express.static(path.resolve(__dirname, '../../dist')));

app.get('/',
  (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname,'../../index.html'));
  }
);


app.get('/api',
  (req, res) => {
    return res.status(200).json({foo: `${new Date}`});
  }
);

app.listen(PORT, () => { console.log(`Listening on port ${PORT}...`); });