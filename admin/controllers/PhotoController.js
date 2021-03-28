const vipModel = require("../models/vip");
const photoModel = require("../models/photo");
const async = require("async");

module.exports.Index = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'photo'
    response.title = 'Admin Photo';
    async.parallel([

            function (callback){
                vipModel.getAllVipsWithPhotoNum(function(err, result) {callback(null, result)})
            }],
        function (err, result) {
            if (err) return console.error(err);

            let header = []
            for (const element in result[0][0]) {
                if (result[0][0].hasOwnProperty(element)) {
                    header.push(element)
                }
            }

            response.thead  = header;
            response.vip    = result[0];

            response.render('homePhoto', response);
        }
    );
};

module.exports.AddPhoto = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'photo'
    response.title = 'Admin Photo';
    let vip_num = request.body.vip_num;
    async.parallel([
            function (callback){
                vipModel.getAllVips(function (err, result){callback(null, result)});
            },
            function (callback){
                if (vip_num !== undefined) {
                    photoModel.getVipLastPhoto(vip_num,function (err, result){
                        if (err) return console.error(err)
                        vipModel.getVipFromId(vip_num, function (err1, result1){
                            if (err1) return console.error(err1)
                            if (!request.files || Object.keys(request.files).length === 0) {
                                return false;
                            }
                            photoModel.addPhotoVip(request.files.image_file, Number(Number(result[0].id)+1), request.body['titre'], request.body['commentaire'], vip_num, result1[0].nom, result1[0].prenom)
                        })
                    })
                }
                callback(null, null)
            }],
        function (err, result) {
            if (err) return console.error(err)

            response.vips = result[0];

            response.render('addPhoto', response);
        }
    );
};

module.exports.DeletePhoto = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'photo'
    response.title = 'Admin Photo';
    let vip_num = request.params.id;
    let photo_num = request.body.photo_to_delete;
    async.parallel([
            function (callback){
                photoModel.getVipPhotos(vip_num, function (err, result){callback(null, result)});
            },
            function (callback){
                if(photo_num !== undefined){
                    let name = request.body.photo_to_delete_name
                    photoModel.getVipPhotoFromName(vip_num, name, (err, result) => {
                        if (err) return console.error(err)
                        photoModel.removePhotoVip(vip_num, result[0])
                    })
                }callback(null, null)
            }
        ],
        function (err, result) {
            if (err) return console.error(err)

            response.photo = result[0];

            response.render('deletePhoto', response);
        }
    );
};