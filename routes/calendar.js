const express = require('express')
const router = express.Router()
const gcal = require('google-calendar')

router.all('/', function(req, res){
 
  //Create an instance from accessToken
  var accessToken = req.session.access_token;
  console.log('accessToken', accessToken)
  gcal(accessToken).calendarList.list(function(err, data) {
    if(err) return res.send(500,err);
    return res.send(data);
  });
});

router.all('/:calendarId', (req, res) => {
  
  //Create an instance from accessToken
  const {access_token} = req.session;
  const {calendarId} = req.params;

  console.log( {
    maxResults:1, 
    timeMin: new Date(), 
    timeMax: new Date("2016-12-11"), 
    items: [{id:"rachelralston@gmail.com"}],
    groupExpansionMax: 0
  })
  
  gcal(access_token).freebusy.query( 
  { 
    items: [{id:"rachelralston@gmail.com"}, {id:"lauranmontoya@gmail.com"}],
    timeMin: new Date(), 
    timeMax: new Date("2016-12-11")
  }, (err, data) => {
    if(err) return res.send(500,err);
    
    console.log(data)
    return res.send(data);
  });
});


module.exports = router