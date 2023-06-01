require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;
const dns = require('dns');
const urlMap = {};


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`)); 

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  var string = req.method + ' ' + req.path + ' - ' + req.ip + ' - '+JSON.stringify(req.body);
  console.log(string);
  next();
});
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
  if (!urlRegex.test(url)) {
    res.json({error: 'invalid url'});
    return;
  }
  dns.lookup(url.replace(/^(http|https):\/\//, ''), (err, address) => {
    if (!address) {
      res.json({error: 'invalid url'});
      return;
    }
    console.log(address);
    console.log(err);
    const shortUrl = Math.floor(Math.random() * 100000).toString();
    urlMap[shortUrl] = url;
    res.json({original_url: url, short_url: shortUrl});
  });
});
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  if (!urlMap[shortUrl]) {
    res.json({error: 'invalid url'});
    return;
  }
  res.redirect(urlMap[shortUrl]);
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
