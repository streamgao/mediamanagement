var fancyhands = require('fancyhands-node').fancyhands;
var cloudinary = require('cloudinary');

//Configuration
var fancyhands = require('fancyhands-node').fancyhands;
//var FANCY_HANDS_API_KEY = "fEF4wWATgoZZQvj";
//var FANCY_HANDS_API_SECRET = "2hVF6GXFBTTuOHL";
//fancyhands.config(FANCY_HANDS_API_KEY, FANCY_HANDS_API_SECRET);
fancyhands.config('9ALLnTW3stkFrnL', 'LupLe86P5GSU7HP'); // , 'http://localhost:8080');


var CLOUDINARY_CLOUD_NAME = "restage";
var CLOUDINARY_API_KEY = "856791998262335";
var CLOUDINARY_API_SECRET = "qJTQL4MfdrDpfwd9WAkysGMx1AI";
cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});


// config the uploader
var options = {
    tmpDir: __dirname + '/../public/uploaded/tmp',
    publicDir: __dirname + '/../public/uploaded',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl: '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize: 1,
    maxFileSize: 10000000000, // 10 GB
    acceptFileTypes: /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes: /\.(gif|jpe?g|png)$/i,
    imageTypes: /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        maxWidth: 80,
        maxHeight: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'local',
        // type : 'aws',
        // aws : {
        //     accessKeyId :  'XXXXXXXXXXXXXXXXXXXXXXXX',
        //     secretAccessKey : 'XXXXXXXXXXXXXXXXXXXXXXXX',
        //     region : 'us-west-2', //make sure you know the region, else leave this option out
        //     bucketName : 'XXXXXXXXXXXXXXXXXXXXXXXX'
        // }
        // type : 'cloudinary',
        // cloudinary: {
        //     cloud_name: CLOUDINARY_CLOUD_NAME,
        //     api_key: CLOUDINARY_API_KEY,
        //     api_secret: CLOUDINARY_API_SECRET
        // }
    },
    nodeStatic: {
        cache: 3600 // seconds to cache served files
    }
};

var currentIP='http://localhost:3000';
var uploader = require('blueimp-file-upload-expressjs')(options);
var cachetocloudinary=[];

module.exports = function(router) {
    router.get('/upload', function(req, res) {
        uploader.get(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
            //console.log( JSON.stringify(obj) );
        });
    });

    router.post('/upload', function(req, res) {
        console.log(req.body);

        uploader.post(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
            for (var i = 0; i < obj.files.length; i++) {
                cachetocloudinary.push(obj.files[i]);
            }
            console.log(cachetocloudinary);
        });
    });

    router.delete('/uploaded/files/:name', function(req, res) {
        uploader.delete(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
            //delete in cloudinary
        });
    });



    router.post('/submitfancyhands', function(req, res){
        console.log(req.body);
        console.log(cachetocloudinary);

        if (cachetocloudinary.length>0) {
            var foldername = req.body.foldername;
        
            for (var i=0; i<cachetocloudinary.length; i++){
                console.log( cachetocloudinary[i].type );
                var path = cachetocloudinary[i].options.uploadDir+'/'+cachetocloudinary[i].name;
                path = path.replace('/routes/..','' );

                if( cachetocloudinary[i].size > 10485760 ){
                    if ( cachetocloudinary[i].type.match(/^image/) ) {
                        cloudinary.v2.uploader.upload_large(path, 
                            { resource_type: "image", chunk_size: 6000000, folder: foldername }, 
                            function(error, result) {/*console.log(result);*/ });//resize to 6MB
                    }else 
                        cloudinary.v2.uploader.upload_large(path, 
                            function(error, result) {/*console.log(result);*/ }                            ); 
                }else if ( cachetocloudinary[i].type.match(/^image/) ) { //if image
                    cloudinary.uploader.upload(path, function(upload_result) {
                        //console.log(upload_result);
                        var image_url = upload_result.url;
                    },{public_id: cachetocloudinary[i].name,
                        folder: foldername });
                }else{
                    cloudinary.uploader.upload( path, function(upload_result) {
                        //console.log(upload_result);
                        },{ public_id: cachetocloudinary[i].name,
                            resource_type: "raw",folder: foldername  }
                    );//upload raw file type
                }//else
            }//for
        }else{
            console.log('error'+err);
        }

        var des = "This is developer test. do not need to reply. I need to organize these files and there are some organizing standards: ";
        if (req.body.req1msg!='') {
            des+='-.Delete photos with duplication of ';
            des+=req.body.req1msg;
        }
        if (req.body.req2msg!='') {
            des+='-.Keep images that are only ';
            des+=req.body.req2msg;
        }
        if (req.body.req3msg!='') {
            des+='-.Keep photos with the best posture of ';
            des+=req.body.req3msg;
        }
        if (req.body.req4msg!='') {
            des+='-.Delete photos that contains this person ';
            des+=req.body.req4msg;
        }

        des+=req.body.extra+'. And the image archive link is :'+currentIP+'/browse?folder='+req.body.foldername;
        var bid = req.body.bid ? req.body.bid : 0.01;
        var request =  {
            // set the price
            bid: bid,
            title: "I need to organize these files: ["+req.body.foldername,
            description: des
        };

        fancyhands.standard_request_create(request)
            .then(function(data) {
                console.log(request);
                console.log(data);
                //res.redirect('/fileupload',{ title: 'Upload and Request' });
        });

        cachetocloudinary=[];
        res.redirect('/fileupload', { title: 'Upload and Request' });
    });//postsubmitfancyhands

    return router;
}


