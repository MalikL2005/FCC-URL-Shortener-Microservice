require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

var urls = [];

function is_valid(url){
  const urlRegex = /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;
  return urlRegex.test(url);   
}

app.post('/api/shorturl', (req, res)=>{
  if (is_valid(req.body.url)){
    if (!urls.includes(req.body.url)) urls.push(req.body.url); 
    res.json({ original_url : req.body.url, short_url : urls.indexOf(req.body.url)+1});
  } else res.json({ error: 'invalid url' });
});

app.get('/api/shorturl/:shorturl', (req, res)=>{
  console.log(urls.at(req.params.shorturl-1)); 
  res.redirect(urls.at(req.params.shorturl-1)); 
});
