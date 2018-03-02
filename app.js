const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
app.use(bodyParser.json());
app.use(cors());

// Connect to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');
// Heroku || localhost

// Allows node to find static content
app.use(express.static(__dirname + '/public'));

app.get('/new/:urlToShorten(*)', (req, res, next) => {
  var {urlToShorten} = req.params;
  // Regex for url
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = expression;
  if(regex.test(urlToShorten)===true) {
    var short = Math.floor(Math.random()*100000).toString();
    var data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shorterUrl: short
      }
    );

    data.save(err => {
      if(err) {
        return res.send('Error saving to database');
      }
    })

    return res.json({data});
  }
  var data = new shortUrl({
    originalUrl: 'urlToShorten does not match standard format',
    shorterUrl: 'InvalidURL'
  });
  return res.json({urlToShorten: 'Failed'});
  //return res.json({urlToShorten});
})

app.get('/:urlToForward', (req, res,next) => {
  var shorterUrl = req.params.urlToForward;
  shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data) => {
    if(err) return res.send('Error reading database');
    var red = new RegExp("^(http|https)://", "i");
    var strToCheck = data.originalUrl;
    if(red.test(strToCheck)){
      res.redirect(301, data.originalUrl);
    } else {
      res.redirect(301, 'http://' + data.originalUrl);
    }
  })
})

// Process is for if on Heroku
app.listen(process.env.PORT || 3000, () => {
  console.log('Everything is working');
})
