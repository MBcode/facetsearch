var axios = require('axios')


// exports.getTool =async function(toolArk) {
// //var url = new URL(toolArk); //adding ?  or ?? to ark returns some info  eg http://n2t.net/ark:/23942/g2600027??
//  var ark = toolArk.substr(toolArk.indexOf('ark:'))
//  var arkurl = ark.replace(':/','_').replace(':','_').replace('/', "_")   // https://object.cloud.sdsc.edu/v1/AUTH_85f46aa78936477d8e71b186269414e8/gleaner-summoned
//     //    ecrr_form/ark_23942_g,20g98.json
//    // var url = 'https://object.cloud.sdsc.edu/v1/AUTH_85f46aa78936477d8e71b186269414e8/gleaner-summoned/ecrr_form/ark_23942_g20g98.json'
// //var url = toolArk
//     var url = `https://object.cloud.sdsc.edu/v1/AUTH_85f46aa78936477d8e71b186269414e8/gleaner-summoned/ecrr_form/${arkurl}.json`
//     const config = {
//     url: url,
//     method: 'get',
//     maxRedirects: 5,
//     // headers: {
//     //     'Accept': 'application/xhtml+xml',
//     //     'Content-Type': 'application/xhtml+xml'
//     // },
//     crossDomain: true,
//
//
// }
//     return axios.request(config
//     ).then(
//         //const content = await rawResponse.json();
//         function (r) {
//
//             //: https://drive.google.com/file/d/1jV0uTRwBGLcYt_tP0KLN-8eC-wiDqXdg/view?usp=drivesdk]
//             return r.data
//
//         }
//     )
// }
var jsonLdObj = require("./jsonldObject");
var jsonld = require('jsonld')
var axios = require('axios')
const https = require('https')
const minio = require('minio')
var d = require('debug')('dataset:dataset')
var t = require('debug')('dataset:tools')
var g = require('debug')('dataset:getJson')

var S3_BASE ='http://gleaner.oss.geodex.org/summoned'

exports.getTool =async function(toolArk) {
    return  new Promise((resolve, reject) => {
        if (toolArk === undefined) {
            reject ({status:404, error:"empty tooo"})
            return;
        }
        var ark = toolArk.substr(toolArk.indexOf('ark:'))
 var arkurl = ark.replace(':/','_').replace(':','_').replace('/', "_")   // https://object.cloud.sdsc.edu/v1/AUTH_85f46aa78936477d8e71b186269414e8/gleaner-summoned
    //    ecrr_form/ark_23942_g,20g98.json
   // var url = 'https://object.cloud.sdsc.edu/v1/AUTH_85f46aa78936477d8e71b186269414e8/gleaner-summoned/ecrr_form/ark_23942_g20g98.json'
//var url = toolArk
   // var url = `https://object.cloud.sdsc.edu/v1/AUTH_85f46aa78936477d8e71b186269414e8/gleaner-summoned/ecrr_form/${arkurl}.json`


        var s3Path = `summoned/ecrr_form/${arkurl}.jsonld`
        g('config'+global.gConfig)
        const mc = new minio.Client(global.gConfig.config.jsonldStore)
        //https://gleaner.oss.geodex.org/summoned/opentopo/0281f678daa333bdc4d9b6bbdf6c07974244e0a4.jsonld
        let jsonld = "";
        mc.getObject(global.gConfig.config.tools, s3Path,
            function (err, dataStream) {
                if (err) {
                    // need better error messaging
                    //res.status(404)
                    //res.render('error', { error: err.message + err.resource })
                    console.log(err)

                    //throw Error(err.message + err.resource)
                    reject({status:404, error:err.message + err.resource})
                    return
                }
                let jsonld = ""
                dataStream.on('data', function (chunk) {
                    //res.write(chunk)
                    jsonld += chunk
                })
                dataStream.on('end', function () {
                    //res.end()
                    resolve(jsonld)
                })
                dataStream.on('error', function (err) {
                    console.log(err)
                    //res.status(500)
                    //res.render('error', { error: err.message  })
                    // throw Error(err.message)
                    reject({status:500, error:err.message})
                })
            }
        )
    }) // promise
}


