var express = require('express');
var router = express.Router();
const url = require('url');
const querystring = require('querystring');
const minio = require('minio')

var toolsController = require('../api/tools')
var datasetController = require('../api/dataset_s3_store')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/tools/*', function(req,
                              res,
                              next) {
  var path = url.parse(req.url).pathname;
  var arkurl = path.replace('/tools/','')
  var arkuri = path.substring(path.indexOf('ark:'))
  toolsController.getTool(arkurl).then(
     function(r) {
       res.send(r);

     }
  ).catch( function(err){
      // need better error messaging
      if (err.response.isAxiosError ) {
          res.status(500)
          res.render('error', {error: err})

      } else {
          if (err.response.status === 404) {
              res.status(404)
              res.render('error', {error: "bad ark" + arkuri})
          } else {
              res.status(err.response.status)
              res.render('error', {error: err.response.data})

          }
      }
  })

});
/// thinking
// need to setup caching
// dataset/{urn}  -- return
// dataset/{urn}/download -- return download links and mime types
//                           maybe return possible transformation
// dataset/{urn}/download/{type} -- return the data in format as a proxy
router.get('/dataset/*/downloads', function(req
                                            ,res
                                            , next){
    var path = url.parse(req.url).pathname;

    var datasetFromPath = path.replace('/dataset/','')
    var datasetUrn = path.substring(path.indexOf('urn:') , path.indexOf('/downloads'))
    var part = datasetUrn.split(':')
    datasetController.getDownloads(datasetUrn).then(
        jsonld => res.send(jsonld)
    ).catch(
        err => {res.status(err.status); res.send(err.error)}
    )
})
router.get('/dataset/*', function(req,
                                res,
                                next) {
  var path = url.parse(req.url).pathname;

  var datasetFromPath = path.replace('/dataset/','')
  var datasetUrn = path.substring(path.indexOf('urn:') )
    var part = datasetUrn.split(':')
    datasetController.getDataset(datasetUrn).then(
        jsonld => res.send(jsonld)
    ).catch(
        err => {res.status(err.status); res.send(err.error)}
        )
    // var s3Path = `summoned/${part[3]}/${part[4]}.jsonld`
    //
    // const mc = new minio.Client(global.gConfig.config.jsonldStore  )
    // //https://gleaner.oss.geodex.org/summoned/opentopo/0281f678daa333bdc4d9b6bbdf6c07974244e0a4.jsonld
    //
    //  mc.getObject('gleaner', s3Path,
    //     function(err, dataStream ) {
    //          if (err) {
    //              // need better error messaging
    //                  res.status(404)
    //                  res.render('error', { error: err.message + err.resource })
    //              console.log(err)
    //              return
    //          }
    //          dataStream.on('data', function(chunk) {
    //
    //              res.write(chunk)
    //          })
    //          dataStream.on('end', function() {
    //
    //              res.end()
    //          })
    //          dataStream.on('error', function(err) {
    //             console.log(err)
    //              res.status(500)
    //              res.render('error', { error: err.message  })
    //
    //          })
    //      }
    //  )



});
module.exports = router;
