let albumModel = require("../models/album.js");
const async = require("async");

// ////////////////////// L I S T E R     A L B U M S

module.exports.ListerAlbum = function(request, response){
    response.title = 'Album des stars';
    async.parallel([
            function (callback){
                albumModel.getPhotoProfile(function (err, result){callback(null, result)});
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.pplist = result[0];

            response.render('listerAlbum', response);
        }
    );
};

module.exports.AlbumVip = function(request, response){
    let id = request.params.id;
    response.title = 'Album des stars';
    async.parallel([
            function (callback){
                albumModel.getPhotoProfile(function (err, result){callback(null, result)});
            },
            function (callback){
                albumModel.getPhotoVip(id, function (err, result){callback(null, result)});
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.pplist = result[0];
            response.photosVip = result[1];

            response.render('listerAlbum', response);
        }
    );
};
