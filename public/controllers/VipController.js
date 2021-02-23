let vipModel = require("../models/vip.js");
let jobsModel = require("../models/jobs.js");
const async = require("async");

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = function(request, response){
    response.title = 'Répertoire des stars';
    vipModel.getRepertoireLetters(function(err, result){  // appel le module repertoire qui exécute la requete SQL
        if (err) {
            console.log(err);
            return;
        }
        response.letters = result; // result contient un array des 1eres lettres des noms des vip

        response.render('repertoireVips', response); // appel la vue Handlebars qui va afficher le résultat
    });
};

module.exports.Card = function (request, response) {
    let lettre = request.params.lettre;
    response.title = 'Stars en ' + lettre;
    async.parallel([
        function (callback){
            vipModel.getRepertoireLetters(function (err, result){callback(null, result)});
        },
        function (callback){
            vipModel.getRepertoireResult(lettre,(function (err, result){callback(null, result)}));
        }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.letters = result[0];

            response.vip = result[1];

            response.render('repertoireVips', response);
        }
    );
};

module.exports.Personne = function (request, response) {
    let id = request.params.id;
    response.title = 'Vip numero' + id;
    async.parallel([
        function (callback){
            vipModel.getRepertoireLetters(function (err, result){callback(null, result)});
        },
        function (callback){
            vipModel.getVipInfos(id,(function (err, result){callback(null, result)}));
        },
        function (callback){
            jobsModel.getVipFilms(id,(function (err, result){callback(null, result)}));
        },
        function (callback){
            jobsModel.getFilmsRealises(id,(function (err, result){callback(null, result)}));
        },
        function (callback){
            jobsModel.getVipAlbums(id,(function (err, result){callback(null, result)}));
        },
        function (callback){
            jobsModel.getVipDefiles(id,(function (err, result){callback(null, result)}));
        },
        function (callback){
            jobsModel.getDefilesOrganises(id,(function (err, result){callback(null, result)}));
        },
        function (callback){
            vipModel.getVipMariages(id,(function (err, result){callback(null, result)}))
        },
        function (callback){
            vipModel.getVipLiaisons(id,(function (err, result){callback(null, result)}))
        },
        function (callback){
            vipModel.getVipPhotos(id,(function (err, result){callback(null, result)}))
        }],
        function (err, result) {
            if (err) {console.log(err);return;}

            response.letters = result[0];
            response.vip = result[1][0];
            response.films = result[2];
            response.filmsRealises = result[3];
            response.albums = result[4];
            response.defiles = result[5];
            response.defilesOrganises = result[6];
            response.mariages = result[7];
            response.liaisons = result[8];
            response.photos = result[9];

            response.render('detailVip', response);
        }
    );
};
