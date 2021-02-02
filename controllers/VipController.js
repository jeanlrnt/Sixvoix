
let model = require("../models/vip.js");
let photo = require("../models/photo.js");

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = function(request, response){
    response.title = 'Répertoire des stars';
    model.repertoire(function(err, result){  // appel le module repertoire qui exécute la requete SQL
        if (err) {
            console.log(err);
            return;
        }
        response.firstLetter = result; // result contient un array des 1eres lettres des noms des vip

        response.render('repertoireVips', response); // appel la vue Handlebars qui va afficher le résultat
    });
};

module.exports.Personne = function (request, response) {
    let lettre = request.params.lettre;
    model.personne(lettre ,function(err, result){  // appel le module repertoire qui exécute la requete SQL
        if (err) {
            console.log(err);
            return;
        }
        response.vip = result; // result contient un array des 1eres lettres des noms des vip

        response.render('repertoireVips', response); // appel la vue Handlebars qui va afficher le résultat
    });
    photo.profile(lettre ,function(err, result){  // appel le module repertoire qui exécute la requete SQL
        if (err) {
            console.log(err);
            return;
        }
        response.vip = result; // result contient un array des 1eres lettres des noms des vip

        response.render('repertoireVips', response); // appel la vue Handlebars qui va afficher le résultat
    });
}
