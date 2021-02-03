let model = require("../models/vip.js");
const async = require("async");

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = function(request, response){
    response.title = 'Répertoire des stars';
    model.getRepertoireLetters(function(err, result){  // appel le module repertoire qui exécute la requete SQL
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
            model.getRepertoireLetters(function (err, result){callback(null, result)});
        },
        function (callback){
            model.getRepertoireResult(lettre,(function (err, result){callback(null, result)}));
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
    let lettre = request.params.id;
    response.title = 'Stars en ' + lettre;
    async.parallel([
            function (callback){
                model.getRepertoireLetters(function (err, result){callback(null, result)});
            },
            function (callback){
                model.getVipInfos(lettre,(function (err, result){callback(null, result)}));
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.letters = result[0];

            response.vip = result[1];

            response.render('detailVip', response);
        }
    );
};
