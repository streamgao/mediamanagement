var express = require('express');
var router = express.Router();
var uploadManager = require('./uploadManager')(router);
// var http = require('http').Server( express() );
// var io = require('socket.io')(http);

var fancyhands = require('fancyhands-node').fancyhands;
//var FANCY_HANDS_API_KEY = "fEF4wWATgoZZQvj";
//var FANCY_HANDS_API_SECRET = "2hVF6GXFBTTuOHL";
//fancyhands.config(FANCY_HANDS_API_KEY, FANCY_HANDS_API_SECRET);
fancyhands.config('9ALLnTW3stkFrnL', 'LupLe86P5GSU7HP'); // , 'http://localhost:8080');

var cloudinary = require('cloudinary');
var CLOUDINARY_CLOUD_NAME = "restage";
var CLOUDINARY_API_KEY = "856791998262335";
var CLOUDINARY_API_SECRET = "qJTQL4MfdrDpfwd9WAkysGMx1AI";
cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});


var listurls=[];
// var resource = function(_id,_title, _url, _time, _format,_byte,_width, _height){
//   this.id=_id;
// 	this.title = _title;
// 	this.url=_url;
// 	this.time=_time;
// 	this.format=_format;
// 	this.byte=_byte;
// 	this.width=_width;
// 	this.height=_height;
// };

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'restage' });
});

router.get('/index', function(req, res) {
  res.render('index', { title: 'restage' });
});

router.get('/index', function(req, res) {
  res.render('index', { title: 'restage' });
});

router.get('/fileupload', function(req, res) {
  res.render('fileupload', { title: 'Upload and Request' });
});

// router.get('/waterfall', function(req, res) {
//   res.render('waterfall', { title: 'Media Browse' });
// });


router.get('/uploadcloudinary', function(req, res) {
  res.render('uploadcloudinary', { title: 'Upload to Cloudinary' });
});

router.get('/browse', function(req, res) {
  listurls=[];
  cloudinary.api.resources(function(result)  { 
  		for(var i=0; i<result.resources.length; i++){
        //console.log(result.resources[i]);
  			if (result.resources[i].resource_type=='image') {
            listurls.push( result.resources[i] );
  			}
  		}
      //console.log(listurls);
  		res.render('browse', { title: 'Media Browse', urllist:listurls });
  });//list resources
});

router.get('/browse?folder=:foldername', function(req, res) {
    listurls=[];
    var folder = req.params.foldername;
    cloudinary.api.resources(function(result)  { 
      for(var i=0; i<result.resources.length; i++){
        if (result.resources[i].resource_type=='image') { 
            if ( result.resources[i].public_id.split('/')[0] == folder ) {
              listurls.push( result.resources[i] );
            }
        }
      }
    });//list resources

    res.render('browse', { title: 'Media Browse', urllist:listurls });
});

router.get('/list', function(req, res) {
  fancyhands.standard_request_get()
    .then(function(data) {
      res.render('list', { requests: data.requests, title: "My Requests" } );
  });  
});//getlist


router.post('/tagdelete',function(req,res){
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));

  for(var i=0; i<req.body.deleteurls.length; i++){
      var formatlength = -1* req.body.deleteurls[i].split('.').pop().length -1;
      console.log( req.body.deleteurls[i].slice(0,formatlength) );
      var pathtodelete = req.body.deleteurls[i].slice(0,formatlength);
      
      cloudinary.uploader.add_tag('delete',pathtodelete, 
                 function(result) { console.log(result); });
      /*or an alternative way is:    cloudinary.api.update("deepart/6itDYBPNbDp3_1500x1500_mtdhGWCw.jpg.jpg",
            function(result) { console.log("result"+result); },
            { tags: "delete" });
      */
  }
  res.send(req.body);
});


// io.on('connect', function(socket){
//   connected = true;
//   console.log('socket is on');
//   socket.on('tagdeteles',function(data){
//       for (var i = 0; i < data.length; i++) {
//           var formatlength = -1* data[i].split('.').pop().length -1;
//           console.log( data[i].slice(0,formatlength) );
//       }
//   });//tagdeteles

// });

module.exports = router;








