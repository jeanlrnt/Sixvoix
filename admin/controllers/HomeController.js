const adminModel = require("../models/admin");
const Cryptr = require("cryptr");

// ////////////////////////////////////////////// A C C U E I L
const async = require("async");
module.exports.Index = function (request, response) {
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('home', response);
};

module.exports.NotFound = function (request, response) {
    response.nextpage = "/error/404"
    response.render('notFound', response);
};

module.exports.Error404 = function (request, response) {
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('Error404', response);
};

module.exports.Deconnexion = function (request, response) {
    request.session.username = null
    request.session.menu = null
    return response.redirect('/')
};

module.exports.Connexion = function (request, response) {
    adminModel.getUser(request.body.utilisateur, function (err, result) {
        if (result[0] !== undefined && request.body.mot_de_passe !== '') {
            let cryptr = new Cryptr('MaSuperCléDeChiffrementDeouF');
            let decryptedString = cryptr.decrypt(result[0].password)
            if (request.body.mot_de_passe === decryptedString) {
                request.session.username = request.body.utilisateur
                return response.redirect('/vip')
            } else {
                request.session.username = null
                return response.redirect('/')
            }
        } else {
            request.session.username = null
            return response.redirect('/')
        }
    });
}
