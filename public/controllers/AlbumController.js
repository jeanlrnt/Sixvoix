let albumModel = require("../models/album.js");
const vipModel = require("../models/vip");
const async = require("async");

// ////////////////////// L I S T E R     A L B U M S

module.exports.ListerAlbum = function(request, response){
    request.session.menu = 'album';
    response.title = 'Album des stars';
    async.parallel([
            function (callback){
                albumModel.getPhotoProfile((err, result) => {callback(null, result)});
            }],
        (err, result) => {
            if (err) return console.error(err);

            response.pplist = result[0];

            response.render('listerAlbum', response);
        }
    );
};

module.exports.AlbumVip = function(request, response){
    request.session.menu = 'album';
    let id = request.params.id;
    async.parallel([
            function (callback){
                albumModel.getPhotoProfile((err, result) => {callback(null, result)});
            },
            function (callback){
                albumModel.getPhotoVip(id, (err, result) => {callback(null, result)});
            },
            function (callback){
                vipModel.getVipInfos(id, (err, result) => {callback(null, result)});
            }],
        (err, result) => {
            if (err) return console.error(err);

            if (result[2][0] !== undefined) {
                response.title = 'Photos de ' + result[2][0].prenom + ' ' + result[2][0].nom.toUpperCase()
            } else {
                response.title = 'Album des stars'
            }

            response.pplist = result[0];
            response.photosVip = result[1];

            response.render('listerAlbum', response);
        }
    );
};
