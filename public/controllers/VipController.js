let vipModel = require("../models/vip.js");
let jobsModel = require("../models/jobs.js");
const async = require("async");

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = function(request, response){
    request.session.menu = 'repertoire';
    response.title = 'Répertoire des stars';
    vipModel.getRepertoireLetters((err, result) => {  // appel le module repertoire qui exécute la requete SQL
        if (err) return console.log(err);
        response.letters = result; // result contient un array des 1eres lettres des noms des vip

        response.render('repertoireVips', response); // appel la vue Handlebars qui va afficher le résultat
    });
};

module.exports.Card = function (request, response) {
    request.session.menu = 'repertoire';
    let lettre = request.params.lettre;
    if (lettre !== undefined) {
        response.title = `Stars en ${lettre.toUpperCase()}`;
    }
    async.parallel([
        function (callback){vipModel.getRepertoireLetters( (err, result) => {callback(null, result)});},
        function (callback){vipModel.getRepertoireResult(lettre,((err, result) => {callback(null, result)}));}],
         (err, result) => {
            if (err) return console.log(err);

            response.letters = result[0];
            response.vip = result[1];

            response.render('repertoireVips', response);
        }
    );
};

module.exports.Personne = function (request, response) {
    request.session.menu = 'repertoire';
    let id = request.params.id;
    async.parallel([
        function (callback){vipModel.getRepertoireLetters((err, result) => {callback(null, result)});},
        function (callback){vipModel.getVipInfos(id,((err, result) => {callback(null, result)}));},
        function (callback){jobsModel.getVipFilms(id,((err, result) => {callback(null, result)}));},
        function (callback){jobsModel.getFilmsRealises(id,((err, result) => {callback(null, result)}));},
        function (callback){jobsModel.getVipAlbums(id,((err, result) => {callback(null, result)}));},
        function (callback){jobsModel.getVipDefiles(id,((err, result) => {callback(null, result)}));},
        function (callback){jobsModel.getDefilesOrganises(id,((err, result) => {callback(null, result)}));},
        function (callback){vipModel.getVipMariages(id,((err, result) => {callback(null, result)}))},
        function (callback){vipModel.getVipLiaisons(id,((err, result) => {callback(null, result)}))},
        function (callback){vipModel.getVipPhotos(id,((err, result) => {callback(null, result)}))}
        ],
         (err, result) => {
            if (err) return console.log(err);

            if (result[1][0] !== undefined) {
                response.title = result[1][0].prenom + ' ' + result[1][0].nom.toUpperCase();
            } else {
                response.title = 'Vip inconnu'
            }

            response.letters            = result[0];
            response.vip                = result[1];
            response.films              = result[2];
            response.filmsRealises      = result[3];
            response.albums             = result[4];
            response.defiles            = result[5];
            response.defilesOrganises   = result[6];
            response.mariages           = result[7];
            response.liaisons           = result[8];
            response.photos             = result[9];

            response.render('detailVip', response);
        }
    );
};
